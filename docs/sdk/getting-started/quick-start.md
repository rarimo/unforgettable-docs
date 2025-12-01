---
sidebar_position: 2
---

# Quick Start

This guide will walk you through creating your first recovery flow with Unforgettable SDK.

## Basic Concepts

Before you begin, understand these key concepts:

- **Mode**: Either `create` (for setting up a new key) or `restore` (for recovering an existing key)
- **Recovery Factors**: The methods users can choose to create/restore their key (Face, Image, Password)
- **Recovery URL**: A secure link that users scan/open to complete the recovery process
- **Data Transfer**: The encrypted communication between your app and Unforgettable.app

## Creating a Recovery Key

Let's create a simple recovery flow where users can set up a new private key.

### Step 1: Initialize the SDK

```typescript
import { UnforgettableSdk, RecoveryFactor } from '@rarimo/unforgettable-sdk'

const sdk = new UnforgettableSdk({
  mode: 'create',
  factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password],
  group: 'my-app', // Optional: organize keys by application
})
```

### Step 2: Generate Recovery URL

```typescript
const recoveryUrl = await sdk.getRecoveryUrl()
console.log('Recovery URL:', recoveryUrl)
// Web: Display this URL as a QR code for users to scan
// Mobile (Android/iOS/React Native): Open this URL in a WebView
```

### Step 3: Poll for Recovered Key

After the user completes the recovery process on Unforgettable.app:

```typescript
import { NotFoundError } from '@rarimo/unforgettable-sdk'

// Poll for the recovered key
const pollForKey = async () => {
  try {
    const recoveryKey = await sdk.getRecoveredKey()
    console.log('✅ Recovery key:', recoveryKey)
    // Use this key to create a wallet or restore user access
    return recoveryKey
  } catch (error) {
    if (error instanceof NotFoundError) {
      // User hasn't completed the process yet, try again later
      console.log('⏳ Waiting for user to complete recovery...')
      setTimeout(pollForKey, 3000) // Poll every 3 seconds
    } else {
      console.error('❌ Error:', error)
    }
  }
}

pollForKey()
```

## Restoring a Key

To restore an existing key, use the `restore` mode with the wallet address:

```typescript
const sdk = new UnforgettableSdk({
  mode: 'restore',
  walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  factors: [RecoveryFactor.Face], // Optional: pre-select factors
  group: 'my-app', // Optional: organize keys by application
})

const recoveryUrl = await sdk.getRecoveryUrl()
// Display the URL and poll for the recovered key as above
```

## Complete Example

Here's a complete example with error handling:

```typescript
import { UnforgettableSdk, RecoveryFactor, NotFoundError } from '@rarimo/unforgettable-sdk'

async function createRecovery() {
  // 1. Initialize SDK
  const sdk = new UnforgettableSdk({
    mode: 'create',
    factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password],
    group: 'my-wallet-app',
    customParams: {
      theme: 'dark',
      lang: 'en',
    },
  })

  // 2. Generate and display recovery URL
  const recoveryUrl = await sdk.getRecoveryUrl()
  console.log('🔗 Share this URL with user:', recoveryUrl)
  // Web: Display as QR code for users to scan
  // Mobile: Open in WebView for in-app recovery

  // 3. Poll for recovered data
  const maxAttempts = 60 // 3 minutes with 3-second intervals
  let attempts = 0

  const poll = async (): Promise<string | null> => {
    try {
      const data = await sdk.getRecoveredData()
      console.log('✅ Success!')
      console.log('Recovery Key:', data.recoveryKey)
      return data.recoveryKey
    } catch (error) {
      attempts++
      
      if (error instanceof NotFoundError) {
        if (attempts >= maxAttempts) {
          console.log('⏱️ Timeout: User did not complete recovery')
          return null
        }
        console.log(`⏳ Waiting... (${attempts}/${maxAttempts})`)
        await new Promise(resolve => setTimeout(resolve, 3000))
        return poll()
      } else {
        console.error('❌ Error during recovery:', error)
        throw error
      }
    }
  }

  return await poll()
}

// Run the recovery flow
createRecovery()
  .then(key => {
    if (key) {
      console.log('Recovery completed successfully!')
      // Use the key in your application
    }
  })
  .catch(error => {
    console.error('Recovery failed:', error)
  })
```

## Next Steps

Now that you understand the basics, explore platform-specific guides:

- [Web Integration](/sdk/platforms/web) - QR code implementation for web browsers
- [React Integration](/sdk/platforms/react) - React hooks and QR code components
- [React Native Integration](/sdk/platforms/react-native) - WebView integration for mobile
- [Android Integration](/sdk/platforms/android) - Native Android WebView implementation
- [iOS Integration](/sdk/platforms/ios) - Native iOS WebView implementation

## Best Practices

1. **Error Handling**: Always handle `NotFoundError` for polling scenarios
2. **Timeout Logic**: Implement reasonable timeout periods for user action
3. **User Feedback**: Show clear instructions and loading states
4. **Security**: Never log or expose the recovered private key in production
5. **Testing**: Test with all recovery factors to ensure compatibility
