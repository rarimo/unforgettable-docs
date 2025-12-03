---
sidebar_position: 3
---

# React Native

Learn how to integrate Unforgettable SDK into your React Native application.

## Installation

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
</Tabs>

### Additional Dependencies

For WebView integration, install:

<Tabs groupId="package-manager">
  <TabItem value="npm" label="npm" default>

```bash
npm install react-native-webview
```

  </TabItem>
  <TabItem value="yarn" label="yarn">

```bash
yarn add react-native-webview
```

  </TabItem>
</Tabs>

For iOS, install pods:

```bash
cd ios && pod install && cd ..
```

## Basic Setup

### Import the SDK

```typescript
import { UnforgettableSdk, RecoveryFactor } from '@rarimo/unforgettable-sdk'
```

### Initialize the SDK

```typescript
const sdk = new UnforgettableSdk({
  mode: 'create', // or 'restore'
  factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password],
  walletAddress: '0x...', // Required for 'restore' mode
  group: 'my-mobile-app',
})
```

## WebView Component

Create a reusable WebView component for recovery:

```tsx
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import { UnforgettableSdk, RecoveryFactor, NotFoundError } from '@rarimo/unforgettable-sdk'

interface RecoveryWebViewProps {
  mode: 'create' | 'restore'
  walletAddress?: string
  onSuccess: (privateKey: string) => void
  onError: (error: Error) => void
}

export const RecoveryWebView: React.FC<RecoveryWebViewProps> = ({
  mode,
  walletAddress,
  onSuccess,
  onError,
}) => {
  const [recoveryUrl, setRecoveryUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sdk, setSdk] = useState<UnforgettableSdk | null>(null)

  useEffect(() => {
    initializeSDK()
  }, [])

  const initializeSDK = async () => {
    try {
      const newSdk = new UnforgettableSdk({
        mode,
        factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password],
        walletAddress,
        group: 'react-native-app',
      })

      const url = await newSdk.getRecoveryUrl()
      setRecoveryUrl(url)
      setSdk(newSdk)
      setLoading(false)

      // Start polling
      startPolling(newSdk)
    } catch (error) {
      setLoading(false)
      onError(error as Error)
    }
  }

  const startPolling = async (sdkInstance: UnforgettableSdk) => {
    const maxAttempts = 60
    let attempts = 0

    const poll = async () => {
      try {
        const privateKey = await sdkInstance.getRecoveredKey()
        onSuccess(privateKey)
      } catch (error) {
        if (error instanceof NotFoundError && attempts < maxAttempts) {
          attempts++
          setTimeout(poll, 3000)
        } else if (!(error instanceof NotFoundError)) {
          onError(error as Error)
        }
      }
    }

    poll()
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading recovery...</Text>
      </View>
    )
  }

  if (!recoveryUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to initialize recovery</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: recoveryUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
      />
      <View style={styles.statusContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.statusText}>Waiting for completion...</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    flex: 1,
    width: '100%',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
  },
})
```

## Complete Example

### Create Recovery Screen

```tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native'
import { RecoveryWebView } from './components/RecoveryWebView'

export const CreateRecoveryScreen = () => {
  const [showQR, setShowQR] = useState(false)
  const [privateKey, setPrivateKey] = useState<string | null>(null)

  const handleStartRecovery = () => {
    setShowQR(true)
  }

  const handleSuccess = (key: string) => {
    setPrivateKey(key)
    Alert.alert('Success', 'Recovery set up successfully!')
    // Create wallet with the key
    createWallet(key)
  }

  const handleError = (error: Error) => {
    Alert.alert('Error', error.message)
    setShowQR(false)
  }

  const createWallet = (key: string) => {
    // Your wallet creation logic
    console.log('Creating wallet with key:', key)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Set Up Account Recovery</Text>

        {!showQR && !privateKey && (
          <>
            <Text style={styles.description}>
              Protect your account with biometric recovery.
              You can restore access using your face or other factors.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleStartRecovery}
            >
              <Text style={styles.buttonText}>Start Setup</Text>
            </TouchableOpacity>
          </>
        )}

        {showQR && !privateKey && (
          <RecoveryWebView
            mode="create"
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}

        {privateKey && (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>
              Recovery Set Up Successfully!
            </Text>
            <Text style={styles.successDescription}>
              Your account is now protected.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 16,
    color: '#666',
  },
})
```

### Restore Account Screen

```tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { RecoveryWebView } from './components/RecoveryWebView'

export const RestoreAccountScreen = () => {
  const [walletAddress, setWalletAddress] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [recovered, setRecovered] = useState(false)

  const handleRestore = () => {
    if (!walletAddress.trim()) {
      Alert.alert('Error', 'Please enter a wallet address')
      return
    }
    setShowQR(true)
  }

  const handleSuccess = (key: string) => {
    setRecovered(true)
    Alert.alert('Success', 'Account restored successfully!')
    // Restore wallet access
    restoreWallet(key)
  }

  const handleError = (error: Error) => {
    Alert.alert('Error', error.message)
    setShowQR(false)
  }

  const restoreWallet = (key: string) => {
    console.log('Restoring wallet with key:', key)
    // Import wallet, restore user access, etc.
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Restore Your Account</Text>

          {!showQR && !recovered && (
            <>
              <Text style={styles.description}>
                Enter your wallet address to restore access
              </Text>
              <TextInput
                style={styles.input}
                placeholder="0x..."
                value={walletAddress}
                onChangeText={setWalletAddress}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleRestore}
              >
                <Text style={styles.buttonText}>Restore Account</Text>
              </TouchableOpacity>
            </>
          )}

          {showQR && !recovered && (
            <>
              <RecoveryWebView
                mode="restore"
                walletAddress={walletAddress}
                onSuccess={handleSuccess}
                onError={handleError}
              />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowQR(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}

          {recovered && (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successText}>Account Restored!</Text>
              <Text style={styles.successDescription}>Welcome back!</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 16,
    color: '#666',
  },
})
```

## Deep Linking

To handle deep links from the Unforgettable app back to your app:

### iOS Configuration

Add to `ios/YourApp/Info.plist`:

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

### Android Configuration

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="yourapp" />
</intent-filter>
```

### Handle Deep Links

```tsx
import { useEffect } from 'react'
import { Linking } from 'react-native'

function App() {
  useEffect(() => {
    // Handle initial URL if app was opened from a deep link
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url)
    })

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url)
    })

    return () => subscription.remove()
  }, [])

  const handleDeepLink = (url: string) => {
    // Parse and handle the deep link
    console.log('Deep link received:', url)
  }

  return <App />
}
```

## Platform-Specific Considerations

### iOS

For iOS, add camera permissions to `ios/YourApp/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required for face verification during account recovery</string>
```

### Android

Add permissions to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

## Error Handling

```tsx
import { NotFoundError } from '@rarimo/unforgettable-sdk'

try {
  const key = await sdk.getRecoveredKey()
  // Success
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Data not ready yet')
  } else {
    console.error('Unexpected error:', error)
    Alert.alert('Error', 'Something went wrong')
  }
}
```

## TypeScript Support

Full TypeScript support included:

```tsx
import type {
  UnforgettableSdkOptions,
  RecoveredData,
  RecoveryFactor,
} from '@rarimo/unforgettable-sdk'

const options: UnforgettableSdkOptions = {
  mode: 'create',
  factors: [RecoveryFactor.Face],
}
```

## Next Steps

- [Android Integration](/sdk/platforms/android) - Native Android SDK
- [iOS Integration](/sdk/platforms/ios) - Native iOS SDK
- [Advanced: Data Transfer](/sdk/advanced/data-transfer) - How polling works
