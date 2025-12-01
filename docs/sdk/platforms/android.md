---
sidebar_position: 4
---

# Android

Learn how to integrate Unforgettable SDK into your Android application using Kotlin.

## Installation

### Gradle (Kotlin DSL)

Add JitPack repository and dependency to your `build.gradle.kts`:

```kotlin
repositories {
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    implementation("com.github.rarimo.unforgettable-sdk:android:0.8.0")
}
```

### Gradle (Groovy)

Add to your `build.gradle`:

```groovy
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    implementation 'com.github.rarimo.unforgettable-sdk:android:0.8.0'
}
```

### Maven

```xml
<repositories>
    <repository>
        <id>jitpack.io</id>
        <url>https://jitpack.io</url>
    </repository>
</repositories>

<dependency>
    <groupId>com.github.rarimo.unforgettable-sdk</groupId>
    <artifactId>android</artifactId>
    <version>0.8.0</version>
</dependency>
```

## Permissions

Add to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## Basic Setup

### Import the SDK

```kotlin
import com.rarimo.unforgettable.UnforgettableSDK
import com.rarimo.unforgettable.UnforgettableSdkOptions
import com.rarimo.unforgettable.UnforgettableMode
import com.rarimo.unforgettable.RecoveryFactor
```

### Initialize the SDK

```kotlin
val sdk = UnforgettableSDK(
    UnforgettableSdkOptions(
        mode = UnforgettableMode.CREATE,
        factors = listOf(RecoveryFactor.FACE, RecoveryFactor.PASSWORD),
        group = "my-android-app"
    )
)
```

## WebView Integration

For Android apps, open the recovery URL in a WebView to enable in-app recovery flow:

### Add Permissions

Add camera permission to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

### WebView Setup

```kotlin
import android.webkit.WebView
import android.webkit.WebSettings
import android.webkit.WebChromeClient
import android.webkit.PermissionRequest

fun setupWebView(webView: WebView) {
    webView.settings.apply {
        javaScriptEnabled = true
        domStorageEnabled = true
        mediaPlaybackRequiresUserGesture = false
        databaseEnabled = true
    }
    
    // Enable camera access for face verification
    webView.webChromeClient = object : WebChromeClient() {
        override fun onPermissionRequest(request: PermissionRequest) {
            request.grant(request.resources)
        }
    }
}
```

## Complete Example

### Create Recovery Activity

```kotlin
import android.os.Bundle
import android.webkit.WebView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.rarimo.unforgettable.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class CreateRecoveryActivity : AppCompatActivity() {
    private lateinit var sdk: UnforgettableSDK
    private lateinit var webView: WebView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_recovery)
        
        webView = findViewById(R.id.recoveryWebView)
        setupWebView(webView)
        
        setupRecovery()
    }
    
    private fun setupRecovery() {
        lifecycleScope.launch {
            try {
                // Initialize SDK
                sdk = UnforgettableSDK(
                    UnforgettableSdkOptions(
                        mode = UnforgettableMode.CREATE,
                        factors = listOf(
                            RecoveryFactor.FACE,
                            RecoveryFactor.IMAGE,
                            RecoveryFactor.PASSWORD
                        ),
                        group = "android-wallet-app"
                    )
                )
                
                // Get recovery URL and load it in WebView
                val recoveryUrl = sdk.getRecoveryUrl()
                webView.loadUrl(recoveryUrl)
                
                // Start polling for recovered key
                pollForRecoveryKey()
                
            } catch (e: Exception) {
                showError("Failed to initialize recovery: ${e.message}")
            }
        }
    }
    
    private suspend fun pollForRecoveryKey() {
        val maxAttempts = 60
        var attempts = 0
        
        while (attempts < maxAttempts) {
            try {
                val recoveredData = sdk.getRecoveredData()
                onRecoverySuccess(recoveredData.recoveryKey)
                return
            } catch (e: UnforgettableSDKError.NotFound) {
                attempts++
                delay(3000) // Wait 3 seconds before next attempt
            } catch (e: Exception) {
                showError("Recovery failed: ${e.message}")
                return
            }
        }
        
        showError("Recovery timeout - user did not complete the process")
    }
    
    private fun onRecoverySuccess(privateKey: String) {
        Toast.makeText(this, "Recovery successful!", Toast.LENGTH_SHORT).show()
        // Use the private key to create/restore wallet
        createWallet(privateKey)
    }
    
    private fun createWallet(privateKey: String) {
        // Your wallet creation logic
        println("Creating wallet with key: $privateKey")
    }
    
    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
    
    private fun setupWebView(webView: WebView) {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false
            databaseEnabled = true
        }
        
        webView.webChromeClient = object : android.webkit.WebChromeClient() {
            override fun onPermissionRequest(request: android.webkit.PermissionRequest) {
                request.grant(request.resources)
            }
        }
    }
}
```

### Layout XML

`res/layout/activity_create_recovery.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Set Up Account Recovery"
        android:textSize="24sp"
        android:textStyle="bold"
        android:layout_marginBottom="16dp"
        android:layout_gravity="center" />

    <WebView
        android:id="@+id/recoveryWebView"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center"
        android:layout_marginTop="16dp">

        <ProgressBar
            android:id="@+id/progressBar"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginEnd="8dp" />

        <TextView
            android:id="@+id/statusText"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Waiting for recovery..."
            android:textSize="14sp" />
    </LinearLayout>
</LinearLayout>
```

### Restore Account Activity

```kotlin
class RestoreAccountActivity : AppCompatActivity() {
    private lateinit var walletAddressInput: EditText
    private lateinit var restoreButton: Button
    private lateinit var webView: WebView
    private lateinit var sdk: UnforgettableSDK
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_restore_account)
        
        walletAddressInput = findViewById(R.id.walletAddressInput)
        restoreButton = findViewById(R.id.restoreButton)
        webView = findViewById(R.id.recoveryWebView)
        
        setupWebView(webView)
        
        restoreButton.setOnClickListener {
            val walletAddress = walletAddressInput.text.toString()
            if (walletAddress.isNotBlank()) {
                startRestore(walletAddress)
            } else {
                Toast.makeText(this, "Please enter wallet address", Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    private fun startRestore(walletAddress: String) {
        lifecycleScope.launch {
            try {
                // Initialize SDK in restore mode
                sdk = UnforgettableSDK(
                    UnforgettableSdkOptions(
                        mode = UnforgettableMode.RESTORE,
                        walletAddress = walletAddress,
                        factors = listOf(RecoveryFactor.FACE, RecoveryFactor.IMAGE, RecoveryFactor.PASSWORD)
                    )
                )
                
                // Get recovery URL and load it in WebView
                val recoveryUrl = sdk.getRecoveryUrl()
                webView.loadUrl(recoveryUrl)
                webView.visibility = View.VISIBLE
                
                // Hide input form
                walletAddressInput.visibility = View.GONE
                restoreButton.visibility = View.GONE
                
                // Poll for restored key
                pollForRestoredKey()
                
            } catch (e: Exception) {
                Toast.makeText(
                    this@RestoreAccountActivity,
                    "Failed to start restore: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }
    
    private suspend fun pollForRestoredKey() {
        val maxAttempts = 60
        var attempts = 0
        
        while (attempts < maxAttempts) {
            try {
                val recoveryKey = sdk.getRecoveredKey()
                onRestoreSuccess(recoveryKey)
                return
            } catch (e: UnforgettableSDKError.NotFound) {
                attempts++
                delay(3000)
            } catch (e: Exception) {
                Toast.makeText(
                    this@RestoreAccountActivity,
                    "Restore failed: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
                return
            }
        }
        
        Toast.makeText(this, "Restore timeout", Toast.LENGTH_LONG).show()
    }
    
    private fun onRestoreSuccess(privateKey: String) {
        Toast.makeText(this, "Account restored successfully!", Toast.LENGTH_SHORT).show()
        // Restore wallet with the private key
        restoreWallet(privateKey)
    }
    
    private fun restoreWallet(privateKey: String) {
        // Your wallet restoration logic
        println("Restoring wallet with key: $privateKey")
    }
    
    private fun setupWebView(webView: WebView) {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false
            databaseEnabled = true
        }
        
        webView.webChromeClient = object : android.webkit.WebChromeClient() {
            override fun onPermissionRequest(request: android.webkit.PermissionRequest) {
                request.grant(request.resources)
            }
        }
    }
}
```

## ViewModel Pattern

For better architecture, use ViewModel:

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.rarimo.unforgettable.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay

sealed class RecoveryState {
    object Idle : RecoveryState()
    object Loading : RecoveryState()
    data class WebViewReady(val url: String) : RecoveryState()
    data class Success(val privateKey: String) : RecoveryState()
    data class Error(val message: String) : RecoveryState()
}

class RecoveryViewModel : ViewModel() {
    private val _state = MutableStateFlow<RecoveryState>(RecoveryState.Idle)
    val state: StateFlow<RecoveryState> = _state
    
    private var sdk: UnforgettableSDK? = null
    
    fun startRecovery(mode: UnforgettableMode, walletAddress: String? = null) {
        viewModelScope.launch {
            try {
                _state.value = RecoveryState.Loading
                
                sdk = UnforgettableSDK(
                    UnforgettableSdkOptions(
                        mode = mode,
                        walletAddress = walletAddress,
                        factors = listOf(RecoveryFactor.FACE, RecoveryFactor.IMAGE, RecoveryFactor.PASSWORD
                    )
                )
                
                val recoveryUrl = sdk!!.getRecoveryUrl()
                _state.value = RecoveryState.WebViewReady(recoveryUrl)
                
                pollForKey()
            } catch (e: Exception) {
                _state.value = RecoveryState.Error(e.message ?: "Unknown error")
            }
        }
    }
    
    private suspend fun pollForKey() {
        val maxAttempts = 60
        var attempts = 0
        
        while (attempts < maxAttempts) {
            try {
                val key = sdk?.getRecoveredKey()
                if (key != null) {
                    _state.value = RecoveryState.Success(key)
                    return
                }
            } catch (e: UnforgettableSDKError.NotFound) {
                attempts++
                delay(3000)
            } catch (e: Exception) {
                _state.value = RecoveryState.Error(e.message ?: "Unknown error")
                return
            }
        }
        
        _state.value = RecoveryState.Error("Recovery timeout")
    }
}
```

## Jetpack Compose

For Compose UI:

```kotlin
import android.webkit.WebView
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

@Composable
fun RecoveryScreen(viewModel: RecoveryViewModel = viewModel()) {
    val state by viewModel.state.collectAsState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Account Recovery",
            style = MaterialTheme.typography.headlineMedium
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        when (val currentState = state) {
            is RecoveryState.Idle -> {
                Button(onClick = {
                    viewModel.startRecovery(UnforgettableMode.CREATE)
                }) {
                    Text("Start Recovery Setup")
                }
            }
            
            is RecoveryState.Loading -> {
                CircularProgressIndicator()
                Spacer(modifier = Modifier.height(16.dp))
                Text("Initializing recovery...")
            }
            
            is RecoveryState.WebViewReady -> {
                AndroidView(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    factory = { context ->
                        WebView(context).apply {
                            settings.javaScriptEnabled = true
                            settings.domStorageEnabled = true
                            settings.mediaPlaybackRequiresUserGesture = false
                            
                            webChromeClient = object : android.webkit.WebChromeClient() {
                                override fun onPermissionRequest(request: android.webkit.PermissionRequest) {
                                    request.grant(request.resources)
                                }
                            }
                            
                            loadUrl(currentState.url)
                        }
                    }
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Waiting for completion...")
                }
            }
            
            is RecoveryState.Success -> {
                Text("✅ Recovery Successful!")
                Spacer(modifier = Modifier.height(16.dp))
                Text("Your account is now protected")
            }
            
            is RecoveryState.Error -> {
                Text("❌ Error: ${currentState.message}")
            }
        }
    }
}
```

## ProGuard Rules

If using ProGuard, add to `proguard-rules.pro`:

```proguard
# Keep SDK classes
-keep class com.rarimo.unforgettable.** { *; }

# Keep serialization classes
-keepclassmembers class com.rarimo.unforgettable.** {
    @kotlinx.serialization.* <fields>;
}
```

## Error Handling

```kotlin
try {
    val recoveredData = sdk.getRecoveredData()
    println("Key: ${recoveredData.recoveryKey}")
} catch (e: UnforgettableSDKError.NotFound) {
    println("Data not ready yet")
} catch (e: UnforgettableSDKError.NetworkError) {
    println("Network error: ${e.cause}")
} catch (e: UnforgettableSDKError.CryptoError) {
    println("Cryptography error: ${e.cause}")
} catch (e: Exception) {
    println("Unexpected error: $e")
}
```

## Requirements

- Android SDK 21+ (Android 5.0 Lollipop)
- Kotlin 1.9+
- Java 17+

## Next Steps

- [iOS Integration](/sdk/platforms/ios) - Native iOS SDK
- [Advanced: Encryption](/sdk/advanced/encryption) - Cryptography details
- [API Reference](/sdk/api/unforgettable-sdk) - Complete API documentation
