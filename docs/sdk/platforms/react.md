---
sidebar_position: 2
---

# React

Learn how to integrate Unforgettable SDK into your React application using hooks and components.

:::info Platform-Specific Approach
React web applications display QR codes for users to scan with their mobile device. For mobile apps (Android, iOS, React Native), the recovery URL is opened in a WebView for in-app recovery. See the [platform guides](/sdk/intro#platform-specific-implementation) for details.
:::

## Installation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

## Components

### UnforgettableQrCode

A ready-to-use QR code component that handles the entire recovery flow.

#### Basic Usage

```tsx
import UnforgettableQrCode from '@rarimo/unforgettable-sdk-react'
import { RecoveryFactor } from '@rarimo/unforgettable-sdk'

function App() {
  const handleSuccess = (privateKey: string) => {
    console.log('Recovery successful!')
    console.log('Private Key:', privateKey)
    // Use the key for wallet creation, authentication, etc.
  }

  const handleError = (error: Error) => {
    console.error('Recovery failed:', error)
  }

  return (
    <div className="app">
      <h1>Account Recovery</h1>
      <UnforgettableQrCode
        mode="create"
        factors={[RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password]}
        onSuccess={handleSuccess}
        onError={handleError}
        qrProps={{ size: 256 }}
      />
    </div>
  )
}
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `mode` | `'create' \| 'restore'` | Yes | Operation mode |
| `appUrl` | `string` | No | Custom Unforgettable app URL |
| `apiUrl` | `string` | No | Custom API URL |
| `factors` | `RecoveryFactor[]` | No | Recovery factors to use |
| `walletAddress` | `string` | Conditional | Required for `restore` mode |
| `group` | `string` | No | Group identifier |
| `customParams` | `Record<string, string>` | No | Custom URL parameters |
| `pollingInterval` | `number` | No | Polling interval in ms (default: 5000) |
| `pollingDisabled` | `boolean` | No | Disable automatic polling (default: false) |
| `onSuccess` | `(key: string, url?: string) => void` | No | Success callback |
| `onError` | `(error: Error) => void` | No | Error callback |
| `qrProps` | `QRCodeSVGProps` | No | Props for QR code customization |
| `loader` | `ReactNode` | No | Custom loading indicator |
| `className` | `string` | No | CSS class for the link wrapper |
| `style` | `CSSProperties` | No | Inline styles |

#### Customization Examples

**Custom QR Code Styling**

```tsx
<UnforgettableQrCode
  mode="create"
  qrProps={{
    size: 300,
    bgColor: '#ffffff',
    fgColor: '#000000',
    level: 'H', // Error correction level
    includeMargin: true,
  }}
/>
```

**Custom Loading State**

```tsx
<UnforgettableQrCode
  mode="create"
  loader={
    <div className="custom-loader">
      <Spinner />
      <p>Generating QR code...</p>
    </div>
  }
/>
```

**Styling the Component**

```tsx
<UnforgettableQrCode
  mode="create"
  className="recovery-qr"
  style={{
    display: 'block',
    margin: '2rem auto',
    padding: '1rem',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  }}
/>
```

## Hooks

### useUnforgettableLink

A React hook that generates a recovery link and handles polling.

#### Basic Usage

```tsx
import { useUnforgettableLink } from '@rarimo/unforgettable-sdk-react'
import { RecoveryFactor } from '@rarimo/unforgettable-sdk'
import { QRCodeSVG } from 'qrcode.react'

function RecoveryComponent() {
  const [recoveredKey, setRecoveredKey] = React.useState<string | null>(null)

  const recoveryLink = useUnforgettableLink({
    mode: 'create',
    factors: [RecoveryFactor.Face, RecoveryFactor.Image],
    pollingInterval: 3000,
    onSuccess: (privateKey) => {
      setRecoveredKey(privateKey)
      alert('Recovery successful!')
    },
    onError: (error) => {
      console.error('Recovery error:', error)
    },
  })

  return (
    <div>
      <h2>Scan to Recover</h2>
      {recoveryLink ? (
        <>
          <QRCodeSVG value={recoveryLink} size={256} />
          <a href={recoveryLink} target="_blank" rel="noopener noreferrer">
            Open in browser
          </a>
        </>
      ) : (
        <p>Generating link...</p>
      )}
      {recoveredKey && (
        <div>
          <h3>Recovery Complete!</h3>
          <p>Key: {recoveredKey.slice(0, 10)}...</p>
        </div>
      )}
    </div>
  )
}
```

#### Parameters

```typescript
interface UseUnforgettableLinkOptions {
  mode: 'create' | 'restore'
  appUrl?: string
  apiUrl?: string
  factors?: RecoveryFactor[]
  walletAddress?: string
  group?: string
  customParams?: Record<string, string>
  pollingInterval?: number
  pollingDisabled?: boolean
  onSuccess?: (privateKey: string) => void
  onError?: (error: Error) => void
}
```

#### Returns

- `string` - The recovery URL (empty string while loading)

## Complete Examples

### Create Recovery Flow

```tsx
import { useState } from 'react'
import UnforgettableQrCode from '@rarimo/unforgettable-sdk-react'
import { RecoveryFactor } from '@rarimo/unforgettable-sdk'

function CreateRecovery() {
  const [privateKey, setPrivateKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSuccess = (key: string) => {
    setPrivateKey(key)
    setLoading(false)
    // Create wallet with the key
    createWallet(key)
  }

  const handleError = (error: Error) => {
    setLoading(false)
    alert(`Error: ${error.message}`)
  }

  const createWallet = (key: string) => {
    // Your wallet creation logic
    console.log('Creating wallet with key:', key)
  }

  return (
    <div className="create-recovery">
      <h1>Set Up Account Recovery</h1>
      
      {!privateKey ? (
        <div className="qr-section">
          <p>Scan this QR code with Unforgettable app to set up recovery</p>
          <UnforgettableQrCode
            mode="create"
            factors={[
              RecoveryFactor.Face,
              RecoveryFactor.Image,
              RecoveryFactor.Password,
            ]}
            group="my-wallet-app"
            onSuccess={handleSuccess}
            onError={handleError}
            qrProps={{ size: 300 }}
            loader={<div>Generating QR code...</div>}
          />
        </div>
      ) : (
        <div className="success">
          <h2>✅ Recovery Set Up Successfully!</h2>
          <p>Your account is now protected.</p>
        </div>
      )}
    </div>
  )
}
```

### Restore Account Flow

```tsx
import { useState } from 'react'
import UnforgettableQrCode from '@rarimo/unforgettable-sdk-react'
import { RecoveryFactor } from '@rarimo/unforgettable-sdk'

function RestoreAccount() {
  const [walletAddress, setWalletAddress] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [recoveredKey, setRecoveredKey] = useState<string | null>(null)

  const handleRestore = () => {
    if (!walletAddress) {
      alert('Please enter a wallet address')
      return
    }
    setShowQR(true)
  }

  const handleSuccess = (key: string) => {
    setRecoveredKey(key)
    // Restore wallet access
    restoreWalletAccess(key)
  }

  const restoreWalletAccess = (key: string) => {
    console.log('Restoring wallet with key:', key)
    // Import wallet, authenticate user, etc.
  }

  return (
    <div className="restore-account">
      <h1>Restore Your Account</h1>
      
      {!showQR ? (
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button onClick={handleRestore}>Restore Account</button>
        </div>
      ) : !recoveredKey ? (
        <div className="qr-section">
          <p>Scan this QR code to restore your account</p>
          <UnforgettableQrCode
            mode="restore"
            walletAddress={walletAddress}
            factors={[RecoveryFactor.Face]}
            onSuccess={handleSuccess}
            onError={(error) => alert(error.message)}
            qrProps={{ size: 300 }}
          />
          <button onClick={() => setShowQR(false)}>Cancel</button>
        </div>
      ) : (
        <div className="success">
          <h2>✅ Account Restored!</h2>
          <p>Welcome back!</p>
        </div>
      )}
    </div>
  )
}
```

### Advanced: Manual Polling Control

```tsx
import { useUnforgettableLink } from '@rarimo/unforgettable-sdk-react'
import { useState, useCallback } from 'react'

function ManualPolling() {
  const [isPolling, setIsPolling] = useState(false)

  const recoveryLink = useUnforgettableLink({
    mode: 'create',
    pollingDisabled: !isPolling, // Control polling manually
    onSuccess: (key) => {
      console.log('Got key:', key)
      setIsPolling(false)
    },
  })

  const startPolling = useCallback(() => {
    setIsPolling(true)
  }, [])

  return (
    <div>
      <QRCodeSVG value={recoveryLink} />
      {!isPolling ? (
        <button onClick={startPolling}>
          I've scanned the QR code
        </button>
      ) : (
        <p>Waiting for recovery...</p>
      )}
    </div>
  )
}
```

## Styling

The component renders a standard `<a>` tag wrapping an SVG QR code. You can style it with CSS:

```css
.recovery-qr {
  display: block;
  max-width: 300px;
  margin: 2rem auto;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.recovery-qr:hover {
  transform: scale(1.02);
}

.recovery-qr svg {
  display: block;
  width: 100%;
  height: auto;
}
```

## TypeScript Support

Full TypeScript support with type definitions:

```tsx
import type { RecoveryFactor } from '@rarimo/unforgettable-sdk'
import type { UnforgettableQrCodeProps } from '@rarimo/unforgettable-sdk-react'

const props: UnforgettableQrCodeProps = {
  mode: 'create',
  factors: [RecoveryFactor.Face],
  onSuccess: (key: string) => console.log(key),
}
```

## Next Steps

- [React Native Integration](/sdk/platforms/react-native) - Mobile apps
- [Advanced: Architecture](/sdk/advanced/architecture) - How it works
- [API Reference](/sdk/api/unforgettable-sdk) - Complete API docs
