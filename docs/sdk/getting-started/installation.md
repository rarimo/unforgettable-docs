---
sidebar_position: 1
---

# Installation

This guide will help you install the Unforgettable SDK for your platform.

## Web / JavaScript / TypeScript

Install the core SDK package using your preferred package manager:

### npm
```bash
npm install @rarimo/unforgettable-sdk
```

### yarn
```bash
yarn add @rarimo/unforgettable-sdk
```

### pnpm
```bash
pnpm add @rarimo/unforgettable-sdk
```

## React

For React applications, install the React-specific package which includes helpful hooks and components:

### npm
```bash
npm install @rarimo/unforgettable-sdk-react
```

### yarn
```bash
yarn add @rarimo/unforgettable-sdk-react
```

### pnpm
```bash
pnpm add @rarimo/unforgettable-sdk-react
```

## React Native

For React Native applications:

### npm
```bash
npm install @rarimo/unforgettable-sdk
```

### yarn
```bash
yarn add @rarimo/unforgettable-sdk
```

## Android

Add JitPack repository and dependency to your `build.gradle.kts`:

```kotlin
repositories {
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    implementation("com.github.rarimo.unforgettable-sdk:android:0.8.0")
}
```

Or if using Groovy `build.gradle`:

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

### Permissions

Add the following permission to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

## iOS

### Swift Package Manager

Add the package dependency to your `Package.swift`:

```swift
dependencies: [
    .package(url: "https://github.com/rarimo/unforgettable-sdk", from: "0.8.0")
]
```

Or add it through Xcode:
1. File → Add Package Dependencies
2. Enter the repository URL: `https://github.com/rarimo/unforgettable-sdk`
3. Select the version you want to use

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

## Verify Installation

After installation, you can verify that the package is working by importing it:

### JavaScript/TypeScript
```typescript
import { UnforgettableSdk, RecoveryFactor } from '@rarimo/unforgettable-sdk'

console.log('Unforgettable SDK loaded successfully!')
```

### React
```tsx
import { UnforgettableQrCode } from '@rarimo/unforgettable-sdk-react'

console.log('Unforgettable SDK React loaded successfully!')
```

### Kotlin
```kotlin
import com.rarimo.unforgettable.UnforgettableSDK
import com.rarimo.unforgettable.RecoveryFactor

println("Unforgettable SDK loaded successfully!")
```

### Swift
```swift
import UnforgettableSDK

print("Unforgettable SDK loaded successfully!")
```

## Next Steps

Now that you have the SDK installed, proceed to the [Quick Start](/docs/sdk/getting-started/quick-start) guide to learn how to use it.
