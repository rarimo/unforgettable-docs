---
sidebar_position: 1
---

# Getting Started

This guide will help you install and get started with Unforgettable SDK.

## Requirements

### Web / React / React Native
- Node.js 18+ or modern browser with Web Crypto API support
- TypeScript 5.0+ (optional but recommended)

### Android
- Android SDK 21+ (Android 5.0 Lollipop)
- Kotlin 1.9+
- Java 17+

### iOS
- iOS 13.0+ / macOS 10.15+ / tvOS 13.0+ / watchOS 6.0+
- Swift 5.9+
- Xcode 15.0+

## Installation

Choose your platform and install the SDK:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform">
  <TabItem value="web" label="Web / JavaScript / TypeScript" default>

<Tabs groupId="package-manager">
  <TabItem value="npm" label="npm" default>

```bash
npm install @rarimo/unforgettable-sdk
```

  </TabItem>
  <TabItem value="yarn" label="yarn">

```bash
yarn add @rarimo/unforgettable-sdk
```

  </TabItem>
  <TabItem value="pnpm" label="pnpm">

```bash
pnpm add @rarimo/unforgettable-sdk
```

  </TabItem>
</Tabs>

  </TabItem>
  <TabItem value="react" label="React">

<Tabs groupId="package-manager">
  <TabItem value="npm" label="npm" default>

```bash
npm install @rarimo/unforgettable-sdk-react
```

  </TabItem>
  <TabItem value="yarn" label="yarn">

```bash
yarn add @rarimo/unforgettable-sdk-react
```

  </TabItem>
  <TabItem value="pnpm" label="pnpm">

```bash
pnpm add @rarimo/unforgettable-sdk-react
```

  </TabItem>
</Tabs>

  </TabItem>
  <TabItem value="react-native" label="React Native">

<Tabs groupId="package-manager">
  <TabItem value="npm" label="npm" default>

```bash
npm install @rarimo/unforgettable-sdk
```

  </TabItem>
  <TabItem value="yarn" label="yarn">

```bash
yarn add @rarimo/unforgettable-sdk
```

  </TabItem>
</Tabs>

  </TabItem>
  <TabItem value="android" label="Android">

<Tabs groupId="build-tool">
  <TabItem value="gradle-kts" label="Gradle (Kotlin)" default>

```kotlin
repositories {
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    implementation("com.github.rarimo.unforgettable-sdk:android:1.0.0")
}
```

  </TabItem>
  <TabItem value="gradle-groovy" label="Gradle (Groovy)">

```groovy
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    implementation 'com.github.rarimo.unforgettable-sdk:android:1.0.0'
}
```

  </TabItem>
  <TabItem value="maven" label="Maven">

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
    <version>1.0.0</version>
</dependency>
```

  </TabItem>
</Tabs>

**Permissions**: Add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

  </TabItem>
  <TabItem value="ios" label="iOS">

**Swift Package Manager:**

Add the package dependency to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/rarimo/unforgettable-sdk", from: "1.0.0")
]
```

Or add via Xcode:
1. File → Add Package Dependencies
2. Enter: `https://github.com/rarimo/unforgettable-sdk`
3. Select version 1.0.0+

  </TabItem>
</Tabs>

## Quick Start

Let's create a simple recovery flow where users can set up a new private key.

### Step 1: Initialize the SDK

<Tabs groupId="platform">
  <TabItem value="web" label="Web / JavaScript / TypeScript" default>

```typescript
import { UnforgettableSdk, RecoveryFactor } from '@rarimo/unforgettable-sdk'

const sdk = new UnforgettableSdk({
  mode: 'create',
  factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password],
})
```

  </TabItem>
  <TabItem value="react" label="React">

```tsx
import UnforgettableQrCode from '@rarimo/unforgettable-sdk-react'
import { RecoveryFactor } from '@rarimo/unforgettable-sdk'

function App() {
  const handleSuccess = (privateKey: string) => {
    console.log('Recovery successful!', privateKey)
  }

  return (
    <UnforgettableQrCode
      mode="create"
      factors={[RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password]}
      onSuccess={handleSuccess}
    />
  )
}
```

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
import com.rarimo.unforgettable.UnforgettableSDK
import com.rarimo.unforgettable.UnforgettableSdkOptions
import com.rarimo.unforgettable.UnforgettableMode
import com.rarimo.unforgettable.RecoveryFactor

val sdk = UnforgettableSDK(
    UnforgettableSdkOptions(
        mode = UnforgettableMode.CREATE,
        factors = listOf(RecoveryFactor.FACE, RecoveryFactor.IMAGE, RecoveryFactor.PASSWORD)
    )
)
```

  </TabItem>
  <TabItem value="ios" label="iOS">

```swift
import UnforgettableSDK

let sdk = UnforgettableSDK(
    mode: .create,
    factors: [.face, .image, .password]
)
```

  </TabItem>
</Tabs>

### Step 2: Generate Recovery URL

<Tabs groupId="platform">
  <TabItem value="web" label="Web / JavaScript / TypeScript" default>

```typescript
const recoveryUrl = await sdk.getRecoveryUrl()
console.log('Recovery URL:', recoveryUrl)
// Display this as a QR code for users to scan
```

  </TabItem>
  <TabItem value="react" label="React">

The `UnforgettableQrCode` component handles this automatically! It generates the URL and displays it as a QR code.

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
val recoveryUrl = sdk.getRecoveryUrl()
// Load this URL in a WebView
webView.loadUrl(recoveryUrl)
```

  </TabItem>
  <TabItem value="ios" label="iOS">

```swift
let recoveryUrl = try await sdk.getRecoveryUrl()
// Load this URL in a WKWebView
if let url = URL(string: recoveryUrl) {
    webView.load(URLRequest(url: url))
}
```

  </TabItem>
</Tabs>

### Step 3: Poll for Recovered Key

<Tabs groupId="platform">
  <TabItem value="web" label="Web / JavaScript / TypeScript" default>

```typescript
import { NotFoundError } from '@rarimo/unforgettable-sdk'

async function pollForKey() {
  const maxAttempts = 60
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const recoveryKey = await sdk.getRecoveredKey()
      console.log('✅ Recovery successful!', recoveryKey)
      return recoveryKey
    } catch (error) {
      if (error instanceof NotFoundError) {
        attempts++
        await new Promise(resolve => setTimeout(resolve, 3000))
      } else {
        throw error
      }
    }
  }
  
  throw new Error('Recovery timeout')
}

pollForKey()
```

  </TabItem>
  <TabItem value="react" label="React">

The `UnforgettableQrCode` component handles polling automatically! Just provide an `onSuccess` callback.

  </TabItem>
  <TabItem value="android" label="Android">

```kotlin
import kotlinx.coroutines.delay

suspend fun pollForKey(): String {
    val maxAttempts = 60
    var attempts = 0
    
    while (attempts < maxAttempts) {
        try {
            return sdk.getRecoveredKey()
        } catch (e: UnforgettableSDKError.NotFound) {
            attempts++
            delay(3000)
        }
    }
    
    throw Exception("Recovery timeout")
}
```

  </TabItem>
  <TabItem value="ios" label="iOS">

```swift
func pollForKey() async throws -> String {
    let maxAttempts = 60
    var attempts = 0
    
    while attempts < maxAttempts {
        do {
            return try await sdk.getRecoveredKey()
        } catch UnforgettableSDKError.notFound {
            attempts += 1
            try await Task.sleep(nanoseconds: 3_000_000_000)
        }
    }
    
    throw NSError(domain: "Recovery", code: -1, 
                  userInfo: [NSLocalizedDescriptionKey: "Recovery timeout"])
}
```

  </TabItem>
</Tabs>

## Next Steps

Explore platform-specific guides for detailed examples and advanced features:

- [Web](/sdk/platforms/web) - QR code implementation for browsers
- [React](/sdk/platforms/react) - Hooks and components
- [React Native](/sdk/platforms/react-native) - WebView integration
- [Android](/sdk/platforms/android) - Native Android implementation
- [iOS](/sdk/platforms/ios) - Native iOS implementation

## Key Concepts

Before diving deeper, understand these core concepts:

- **Mode**: Either `create` (for setting up a new key) or `restore` (for recovering an existing key)
- **Recovery Factors**: The methods users can choose to create/restore their key (Face, Image, Password)
- **Recovery URL**: A secure link that users scan/open to complete the recovery process
- **Data Transfer**: The encrypted communication between your app and Unforgettable.app
- **QR Code** (Web): Web apps display QR codes for users to scan with mobile devices
- **WebView** (Mobile): Mobile apps open the recovery URL in a WebView for in-app recovery
