---
sidebar_position: 5
---

# iOS

Learn how to integrate Unforgettable SDK into your iOS application using Swift.

## Installation

### Swift Package Manager

Add the package dependency to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/rarimo/unforgettable-sdk", from: "0.8.0")
]
```

### Xcode

1. File → Add Package Dependencies
2. Enter the repository URL: `https://github.com/rarimo/unforgettable-sdk`
3. Select the version you want to use (0.8.0+)

## Quick Start

Here's a minimal example to get started:

```swift
import UIKit
import WebKit
import UnforgettableSDK

class RecoveryViewController: UIViewController {
    private var webView: WKWebView!
    private var sdk: UnforgettableSDK!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Setup WebView
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        webView = WKWebView(frame: view.bounds, configuration: configuration)
        view.addSubview(webView)
        
        Task {
            // 1. Initialize SDK
            sdk = UnforgettableSDK(
                mode: .create,
                factors: [.face, .image, .password]
            )
            
            // 2. Load recovery URL in WebView
            let recoveryUrl = try await sdk.getRecoveryUrl()
            if let url = URL(string: recoveryUrl) {
                webView.load(URLRequest(url: url))
            }
            
            // 3. Poll for recovered key
            var attempts = 0
            while attempts < 60 {
                do {
                    let key = try await sdk.getRecoveredKey()
                    print("✅ Recovery successful: \(key)")
                    break
                } catch UnforgettableSDKError.notFound {
                    attempts += 1
                    try await Task.sleep(nanoseconds: 3_000_000_000)
                }
            }
        }
    }
}
```

## Basic Setup

### Import the SDK

```swift
import UnforgettableSDK
```

### Initialize the SDK

```swift
do {
    let sdk = try UnforgettableSDK(options: UnforgettableSdkOptions(
        mode: .create,
        factors: [.face, .image, .password],
        group: "my-ios-app"
    ))
} catch {
    print("Error initializing SDK: \(error)")
}
```

## WebView Integration

For iOS apps, use WKWebView to open the recovery URL and enable in-app recovery:

### Import WebKit

```swift
import WebKit
```

### Configure WKWebView

```swift
func setupWebView() -> WKWebView {
    let configuration = WKWebViewConfiguration()
    configuration.allowsInlineMediaPlayback = true
    configuration.mediaTypesRequiringUserActionForPlayback = []
    
    let webView = WKWebView(frame: .zero, configuration: configuration)
    webView.translatesAutoresizingMaskIntoConstraints = false
    
    return webView
}
```

### Camera Permissions

Add to `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required for face verification during account recovery</string>
```

## Complete Example

### Create Recovery View Controller

```swift
import UIKit
import WebKit
import UnforgettableSDK

class CreateRecoveryViewController: UIViewController {
    private var sdk: UnforgettableSDK?
    private var webView: WKWebView!
    private let statusLabel = UILabel()
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupRecovery()
    }
    
    private func setupUI() {
        view.backgroundColor = .systemBackground
        
        // Title
        let titleLabel = UILabel()
        titleLabel.text = "Set Up Account Recovery"
        titleLabel.font = .systemFont(ofSize: 24, weight: .bold)
        titleLabel.textAlignment = .center
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        // WebView
        webView = setupWebView()
        
        // Status
        statusLabel.text = "Waiting for recovery..."
        statusLabel.font = .systemFont(ofSize: 14)
        statusLabel.textAlignment = .center
        statusLabel.textColor = .secondaryLabel
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(titleLabel)
        view.addSubview(webView)
        view.addSubview(activityIndicator)
        view.addSubview(statusLabel)
        
        activityIndicator.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            titleLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            webView.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 20),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: activityIndicator.topAnchor, constant: -20),
            
            activityIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            activityIndicator.bottomAnchor.constraint(equalTo: statusLabel.topAnchor, constant: -8),
            
            statusLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            statusLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            statusLabel.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20)
        ])
    }
    
    private func setupWebView() -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.translatesAutoresizingMaskIntoConstraints = false
        
        return webView
    }
    
    private func setupRecovery() {
        activityIndicator.startAnimating()
        
        Task {
            do {
                // Initialize SDK
                sdk = try UnforgettableSDK(options: UnforgettableSdkOptions(
                    mode: .create,
                    factors: [.face, .image, .password],
                    group: "ios-wallet-app"
                ))
                
                // Get recovery URL and load it in WebView
                let recoveryUrl = sdk!.getRecoveryUrl()
                
                await MainActor.run {
                    if let url = URL(string: recoveryUrl) {
                        webView.load(URLRequest(url: url))
                    }
                    activityIndicator.stopAnimating()
                }
                
                // Start polling
                try await pollForRecoveryKey()
                
            } catch {
                await showError("Failed to initialize recovery: \(error.localizedDescription)")
            }
        }
    }
    
    private func pollForRecoveryKey() async throws {
        let maxAttempts = 60
        var attempts = 0
        
        while attempts < maxAttempts {
            do {
                let recoveredData = try await sdk?.getRecoveredData()
                if let recoveryKey = recoveredData?.recoveryKey {
                    await onRecoverySuccess(recoveryKey)
                    return
                }
            } catch let error as UnforgettableSDKError {
                if case .notFound = error {
                    attempts += 1
                    try await Task.sleep(nanoseconds: 3_000_000_000) // 3 seconds
                } else {
                    throw error
                }
            }
        }
        
        await showError("Recovery timeout - user did not complete the process")
    }
    
    @MainActor
    private func onRecoverySuccess(_ privateKey: String) {
        statusLabel.text = "✅ Recovery successful!"
        statusLabel.textColor = .systemGreen
        
        // Use the private key to create/restore wallet
        createWallet(privateKey: privateKey)
    }
    
    private func createWallet(privateKey: String) {
        // Your wallet creation logic
        print("Creating wallet with key: \(privateKey)")
    }
    
    @MainActor
    private func showError(_ message: String) {
        let alert = UIAlertController(
            title: "Error",
            message: message,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
```

### Restore Account View Controller

```swift
import UIKit
import WebKit
import UnforgettableSDK

class RestoreAccountViewController: UIViewController {
    private var sdk: UnforgettableSDK?
    private let walletAddressTextField = UITextField()
    private let restoreButton = UIButton(type: .system)
    private var webView: WKWebView!
    private let statusLabel = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }
    
    private func setupUI() {
        view.backgroundColor = .systemBackground
        
        // Title
        let titleLabel = UILabel()
        titleLabel.text = "Restore Your Account"
        titleLabel.font = .systemFont(ofSize: 24, weight: .bold)
        titleLabel.textAlignment = .center
        
        // Wallet Address Input
        walletAddressTextField.placeholder = "Enter wallet address (0x...)"
        walletAddressTextField.borderStyle = .roundedRect
        walletAddressTextField.autocapitalizationType = .none
        walletAddressTextField.autocorrectionType = .no
        
        // Restore Button
        restoreButton.setTitle("Restore Account", for: .normal)
        restoreButton.titleLabel?.font = .systemFont(ofSize: 18, weight: .semibold)
        restoreButton.backgroundColor = .systemBlue
        restoreButton.setTitleColor(.white, for: .normal)
        restoreButton.layer.cornerRadius = 8
        restoreButton.addTarget(self, action: #selector(handleRestore), for: .touchUpInside)
        
        // WebView (hidden initially)
        webView = setupWebView()
        webView.isHidden = true
        
        // Status Label
        statusLabel.font = .systemFont(ofSize: 14)
        statusLabel.textAlignment = .center
        statusLabel.textColor = .secondaryLabel
        statusLabel.numberOfLines = 0
        
        // Stack View
        let stackView = UIStackView(arrangedSubviews: [
            titleLabel,
            walletAddressTextField,
            restoreButton,
            webView,
            statusLabel
        ])
        stackView.axis = .vertical
        stackView.spacing = 16
        stackView.alignment = .fill
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(stackView)
        
        NSLayoutConstraint.activate([
            stackView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            stackView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 32),
            stackView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -32),
            stackView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -20),
            restoreButton.heightAnchor.constraint(equalToConstant: 50)\n        ])
    }
    
    private func setupWebView() -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.translatesAutoresizingMaskIntoConstraints = false
        
        return webView
    }
    
    @objc private func handleRestore() {
        guard let walletAddress = walletAddressTextField.text,
              !walletAddress.isEmpty else {
            showError("Please enter a wallet address")
            return
        }
        
        startRestore(walletAddress: walletAddress)
    }
    
    private func startRestore(walletAddress: String) {
        Task {
            do {
                // Initialize SDK in restore mode
                sdk = try UnforgettableSDK(options: UnforgettableSdkOptions(
                    mode: .restore,
                    walletAddress: walletAddress,
                    factors: [.face, .image, .password]
                ))
                
                // Get recovery URL and load it in WebView
                let recoveryUrl = sdk!.getRecoveryUrl()
                
                await MainActor.run {
                    if let url = URL(string: recoveryUrl) {
                        webView.load(URLRequest(url: url))
                    }
                    webView.isHidden = false
                    walletAddressTextField.isHidden = true
                    restoreButton.isHidden = true
                    statusLabel.text = "Complete recovery in the browser"
                }
                
                // Poll for restored key
                try await pollForRestoredKey()
                
            } catch {
                await showError("Failed to start restore: \(error.localizedDescription)")
            }
        }
    }
    
    private func pollForRestoredKey() async throws {
        let maxAttempts = 60
        var attempts = 0
        
        while attempts < maxAttempts {
            do {
                let recoveryKey = try await sdk?.getRecoveredKey()
                if let key = recoveryKey {
                    await onRestoreSuccess(key)
                    return
                }
            } catch let error as UnforgettableSDKError {
                if case .notFound = error {
                    attempts += 1
                    try await Task.sleep(nanoseconds: 3_000_000_000)
                } else {
                    throw error
                }
            }
        }
        
        await showError("Restore timeout")
    }
    
    @MainActor
    private func onRestoreSuccess(_ privateKey: String) {
        statusLabel.text = "✅ Account restored successfully!"
        statusLabel.textColor = .systemGreen
        
        // Restore wallet with the private key
        restoreWallet(privateKey: privateKey)
    }
    
    private func restoreWallet(privateKey: String) {
        // Your wallet restoration logic
        print("Restoring wallet with key: \(privateKey)")
    }
    
    @MainActor
    private func showError(_ message: String) {
        let alert = UIAlertController(
            title: "Error",
            message: message,
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
```

## SwiftUI

For SwiftUI applications:

```swift
import SwiftUI
import WebKit
import UnforgettableSDK

struct RecoveryView: View {
    @StateObject private var viewModel = RecoveryViewModel()
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Account Recovery")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            switch viewModel.state {
            case .idle:
                Button("Start Recovery Setup") {
                    viewModel.startRecovery(mode: .create)
                }
                .buttonStyle(.borderedProminent)
                
            case .loading:
                ProgressView()
                Text("Initializing recovery...")
                
            case .webViewReady(let url):
                WebView(url: URL(string: url)!)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                
                HStack {
                    ProgressView()
                        .scaleEffect(0.8)
                    Text("Waiting for completion...")
                        .foregroundColor(.secondary)
                }
                
            case .success:
                VStack {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.system(size: 64))
                        .foregroundColor(.green)
                    Text("Recovery Successful!")
                        .font(.title)
                    Text("Your account is now protected")
                        .foregroundColor(.secondary)
                }
                
            case .error(let message):
                VStack {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 64))
                        .foregroundColor(.red)
                    Text("Error")
                        .font(.title)
                    Text(message)
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding()
    }
}

struct WebView: UIViewRepresentable {
    let url: URL
    
    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        
        return WKWebView(frame: .zero, configuration: configuration)
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        webView.load(URLRequest(url: url))
    }
}

@MainActor
class RecoveryViewModel: ObservableObject {
    enum State {
        case idle
        case loading
        case webViewReady(String)
        case success(String)
        case error(String)
    }
    
    @Published var state: State = .idle
    private var sdk: UnforgettableSDK?
    
    func startRecovery(mode: UnforgettableMode) {
        state = .loading
        
        Task {
            do {
                sdk = try UnforgettableSDK(options: UnforgettableSdkOptions(
                    mode: mode,
                    factors: [.face, .image, .password]
                ))
                
                let recoveryUrl = sdk!.getRecoveryUrl()
                state = .webViewReady(recoveryUrl)
                
                try await pollForKey()
            } catch {
                state = .error(error.localizedDescription)
            }
        }
    }
    
    private func pollForKey() async throws {
        let maxAttempts = 60
        var attempts = 0
        
        while attempts < maxAttempts {
            do {
                if let key = try await sdk?.getRecoveredKey() {
                    state = .success(key)
                    return
                }
            } catch let error as UnforgettableSDKError {
                if case .notFound = error {
                    attempts += 1
                    try await Task.sleep(nanoseconds: 3_000_000_000)
                } else {
                    throw error
                }
            }
        }
        
        state = .error("Recovery timeout")
    }
}
```

## Error Handling

```swift
do {
    let recoveredData = try await sdk.getRecoveredData()
    print("Recovery Key: \(recoveredData.recoveryKey)")
} catch let error as UnforgettableSDKError {
    switch error {
    case .notFound:
        print("Data not ready yet")
    case .networkError(let underlyingError):
        print("Network error: \(underlyingError)")
    case .cryptoError(let underlyingError):
        print("Crypto error: \(underlyingError)")
    case .invalidResponse:
        print("Invalid response from server")
    case .decodingError(let underlyingError):
        print("Decoding error: \(underlyingError)")
    }
} catch {
    print("Unexpected error: \(error)")
}
```

## Deep Linking

To handle deep links from Unforgettable app:

### Info.plist Configuration

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>yourapp</string>
    </array>
  </dict>
</array>
```

### Handle Deep Links (UIKit)

```swift
func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
) -> Bool {
    handleDeepLink(url)
    return true
}

private func handleDeepLink(_ url: URL) {
    print("Received deep link: \(url)")
    // Parse and handle the URL
}
```

### Handle Deep Links (SwiftUI)

```swift
struct YourApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    handleDeepLink(url)
                }
        }
    }
    
    private func handleDeepLink(_ url: URL) {
        print("Received deep link: \(url)")
    }
}
```

## Best Practices

1. **Async/Await**: Use Swift's modern concurrency features
2. **Error Handling**: Always handle all possible error cases
3. **UI Updates**: Ensure UI updates happen on the main thread
4. **Memory Management**: Use `weak` references to avoid retain cycles
5. **Security**: Never log or expose private keys in production

## Requirements

- iOS 13.0+ / macOS 10.15+ / tvOS 13.0+ / watchOS 6.0+
- Swift 5.9+
- Xcode 15.0+

## Next Steps

- [Advanced: Architecture](/sdk/advanced/architecture) - How it works under the hood
- [Advanced: Encryption](/sdk/advanced/encryption) - Cryptography details
- [API Reference](/sdk/api/unforgettable-sdk) - Complete API documentation
