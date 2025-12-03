---
sidebar_position: 1
---

# Installation

This guide will help you install the Unforgettable SDK for your platform.

## Web / JavaScript / TypeScript

Install the core SDK package using your preferred package manager:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

## React

For React applications, install the React-specific package which includes helpful hooks and components:

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

## React Native

For React Native applications:

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

## Android

Add JitPack repository and dependency to your build configuration:

<Tabs groupId="build-tool">
  <TabItem value="gradle-kts" label="Gradle (Kotlin)" default>

```kotlin
repositories {
    maven { url = uri("https://jitpack.io") }
}

dependencies {
    implementation("com.github.rarimo.unforgettable-sdk:android:0.8.0")
}
```

  </TabItem>
  <TabItem value="gradle-groovy" label="Gradle (Groovy)">

```groovy
repositories {
    maven { url 'https://jitpack.io' }
}

dependencies {
    implementation 'com.github.rarimo.unforgettable-sdk:android:0.8.0'
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
    <version>0.8.0</version>
</dependency>
```

  </TabItem>
</Tabs>

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

<Tabs groupId="platform">
  <TabItem value="javascript" label="JavaScript/TypeScript" default>

```typescript
import { UnforgettableSdk, RecoveryFactor } from '@rarimo/unforgettable-sdk'

console.log('Unforgettable SDK loaded successfully!')
```

  </TabItem>
  <TabItem value="react" label="React">

```tsx
import { UnforgettableQrCode } from '@rarimo/unforgettable-sdk-react'

console.log('Unforgettable SDK React loaded successfully!')
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
import com.rarimo.unforgettable.UnforgettableSDK
import com.rarimo.unforgettable.RecoveryFactor

println("Unforgettable SDK loaded successfully!")
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
import UnforgettableSDK

print("Unforgettable SDK loaded successfully!")
```

  </TabItem>
</Tabs>

## Next Steps

Now that you have the SDK installed, proceed to the [Quick Start](/docs/sdk/getting-started/quick-start) guide to learn how to use it.
