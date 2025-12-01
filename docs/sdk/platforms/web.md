---
sidebar_position: 1
---

# Web

Learn how to integrate Unforgettable SDK into your vanilla JavaScript or TypeScript web application.

:::info Platform-Specific Approach
Web applications display QR codes for users to scan with their mobile device. For mobile apps (Android, iOS, React Native), the recovery URL is opened in a WebView for in-app recovery. See the [platform guides](/sdk/intro#platform-specific-implementation) for details.
:::

## Installation

```bash
npm install @rarimo/unforgettable-sdk
```

Or using yarn:

```bash
yarn add @rarimo/unforgettable-sdk
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
  group: 'my-web-app', // Optional
  customParams: { theme: 'dark' }, // Optional
})
```

## Creating a Recovery Flow

### Step 1: Generate QR Code

First, get the recovery URL and display it as a QR code:

```typescript
import QRCode from 'qrcode' // Install: npm install qrcode

async function displayRecoveryQR() {
  const sdk = new UnforgettableSdk({
    mode: 'create',
    factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password],
  })

  const recoveryUrl = await sdk.getRecoveryUrl()
  
  // Display QR code in a canvas element
  const canvas = document.getElementById('qr-canvas')
  await QRCode.toCanvas(canvas, recoveryUrl, {
    width: 300,
    margin: 2,
  })

  // Or generate as data URL for an image
  const dataUrl = await QRCode.toDataURL(recoveryUrl)
  document.getElementById('qr-image').src = dataUrl
}
```

### Step 2: Poll for Recovery Key

```typescript
async function pollForRecoveryKey(sdk: UnforgettableSdk) {
  const maxAttempts = 60 // 3 minutes
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const recoveryKey = await sdk.getRecoveredKey()
      console.log('Recovery successful!')
      return recoveryKey
    } catch (error) {
      if (error.name === 'NotFoundError') {
        attempts++
        await new Promise(resolve => setTimeout(resolve, 3000))
      } else {
        throw error
      }
    }
  }
  
  throw new Error('Recovery timeout')
}
```

## Complete Example

Here's a complete HTML + TypeScript example:

### HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unforgettable Recovery</title>
  <style>
    .container {
      max-width: 600px;
      margin: 50px auto;
      text-align: center;
      font-family: Arial, sans-serif;
    }
    .qr-container {
      margin: 20px 0;
      padding: 20px;
      border: 2px solid #ddd;
      border-radius: 8px;
    }
    .status {
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .loading { background: #fff3cd; }
    .success { background: #d4edda; }
    .error { background: #f8d7da; }
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 4px;
      border: none;
      background: #007bff;
      color: white;
    }
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Account Recovery</h1>
    
    <button id="createBtn">Create Recovery</button>
    <button id="restoreBtn">Restore Account</button>
    
    <div id="qrContainer" class="qr-container" style="display: none;">
      <h2>Scan QR Code</h2>
      <canvas id="qrCanvas"></canvas>
      <p>Or click the link below:</p>
      <a id="recoveryLink" href="#" target="_blank">Open Recovery Page</a>
    </div>
    
    <div id="status"></div>
  </div>

  <script src="./main.js" type="module"></script>
</body>
</html>
```

### TypeScript (main.ts)

```typescript
import { UnforgettableSdk, RecoveryFactor, NotFoundError } from '@rarimo/unforgettable-sdk'
import QRCode from 'qrcode'

class RecoveryApp {
  private sdk: UnforgettableSdk | null = null
  private polling = false

  constructor() {
    this.setupEventListeners()
  }

  private setupEventListeners() {
    document.getElementById('createBtn')?.addEventListener('click', () => {
      this.startRecovery('create')
    })

    document.getElementById('restoreBtn')?.addEventListener('click', () => {
      const walletAddress = prompt('Enter wallet address to restore:')
      if (walletAddress) {
        this.startRecovery('restore', walletAddress)
      }
    })
  }

  private async startRecovery(mode: 'create' | 'restore', walletAddress?: string) {
    try {
      this.updateStatus('Initializing...', 'loading')
      
      // Initialize SDK
      this.sdk = new UnforgettableSdk({
        mode,
        factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password],
        walletAddress,
        group: 'web-demo',
      })

      // Generate and display QR code
      const recoveryUrl = await this.sdk.getRecoveryUrl()
      await this.displayQRCode(recoveryUrl)

      this.updateStatus('Waiting for user to complete recovery...', 'loading')

      // Start polling
      const recoveryKey = await this.pollForKey()
      
      if (recoveryKey) {
        this.updateStatus(`✅ Recovery successful! Key: ${recoveryKey.slice(0, 10)}...`, 'success')
        // Use the recovery key for your application
        this.onRecoverySuccess(recoveryKey)
      }
    } catch (error) {
      this.updateStatus(`❌ Error: ${error.message}`, 'error')
      console.error(error)
    }
  }

  private async displayQRCode(url: string) {
    const container = document.getElementById('qrContainer')
    const canvas = document.getElementById('qrCanvas') as HTMLCanvasElement
    const link = document.getElementById('recoveryLink') as HTMLAnchorElement

    if (canvas && link && container) {
      await QRCode.toCanvas(canvas, url, { width: 300 })
      link.href = url
      container.style.display = 'block'
    }
  }

  private async pollForKey(): Promise<string | null> {
    if (!this.sdk) return null

    const maxAttempts = 60
    let attempts = 0

    while (attempts < maxAttempts) {
      try {
        const recoveryKey = await this.sdk.getRecoveredKey()
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

    throw new Error('Recovery timeout - user did not complete the process')
  }

  private updateStatus(message: string, type: 'loading' | 'success' | 'error') {
    const statusEl = document.getElementById('status')
    if (statusEl) {
      statusEl.textContent = message
      statusEl.className = `status ${type}`
    }
  }

  private onRecoverySuccess(key: string) {
    // Implement your logic here
    // For example: create a wallet, restore user access, etc.
    console.log('Recovery key available for use:', key)
  }
}

// Initialize the app
new RecoveryApp()
```

## Advanced Features

### Custom API and App URLs

```typescript
const sdk = new UnforgettableSdk({
  mode: 'create',
  appUrl: 'https://custom.unforgettable.app',
  apiUrl: 'https://api.custom.unforgettable.app',
})
```

### Error Handling

```typescript
import { NotFoundError } from '@rarimo/unforgettable-sdk'

try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Data not ready yet')
  } else if (error.name === 'NetworkError') {
    console.log('Network issue')
  } else {
    console.log('Unknown error:', error)
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and includes full type definitions:

```typescript
import type {
  UnforgettableSdkOptions,
  RecoveredData,
  UnforgettableMode,
} from '@rarimo/unforgettable-sdk'

const options: UnforgettableSdkOptions = {
  mode: 'create',
  factors: [RecoveryFactor.Face],
}
```

## Browser Compatibility

The SDK requires browsers that support:
- Web Crypto API
- ES2020+ JavaScript features
- Async/await

Supported browsers:
- Chrome 80+
- Firefox 78+
- Safari 14+
- Edge 80+

## Next Steps

- [React Integration](/sdk/platforms/react) - Use React components
- [Advanced: Encryption](/sdk/advanced/encryption) - Understand the cryptography
- [API Reference](/sdk/api/unforgettable-sdk) - Complete API documentation
