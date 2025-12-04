---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# UnforgettableSDK Class

Complete API reference for the `UnforgettableSDK` class.

## Constructor

### `new UnforgettableSDK(options)`

Creates a new instance of the Unforgettable SDK.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `options` | `UnforgettableSdkOptions` | Yes | Configuration options |

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { UnforgettableSdk, RecoveryFactor } from '@rarimo/unforgettable-sdk'

const sdk = new UnforgettableSdk({
  mode: 'create',
  factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password],
  group: 'my-app',
})
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
import app.unforgettable.sdk.*

val sdk = UnforgettableSDK(
    UnforgettableSdkOptions(
        mode = UnforgettableMode.CREATE,
        factors = listOf(RecoveryFactor.FACE, RecoveryFactor.IMAGE, RecoveryFactor.PASSWORD),
        group = "my-app"
    )
)
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
import UnforgettableSDK

let sdk = try UnforgettableSDK(options: UnforgettableSdkOptions(
    mode: .create,
    factors: [.face, .image, .password],
    group: "my-app"
))
```

  </TabItem>
</Tabs>

## Methods

### `getRecoveryUrl()`

Generates the recovery URL to share with the user.

**Returns:** `Promise<string>` (TypeScript) | `String` (Kotlin/Swift)

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
const recoveryUrl = await sdk.getRecoveryUrl()
console.log(recoveryUrl)
// "https://unforgettable.app/sdk/c#id=...&epk=...&f=1,3&g=my-app"
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
val recoveryUrl = sdk.getRecoveryUrl()
println(recoveryUrl)
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
let recoveryUrl = sdk.getRecoveryUrl()
print(recoveryUrl)
```

  </TabItem>
</Tabs>

**Throws:**
- `CryptoError` - If key generation fails

### `getRecoveredData()`

Retrieves the complete recovered data including recovery key.

**Returns:** `Promise<RecoveredData>` (TypeScript) | `RecoveredData` (Kotlin/Swift)

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
try {
  const data = await sdk.getRecoveredData()
  console.log('Recovery Key:', data.recoveryKey)
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Data not ready yet')
  }
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
lifecycleScope.launch {
    try {
        val data = sdk.getRecoveredData()
        println("Recovery Key: ${data.recoveryKey}")
    } catch (e: UnforgettableSDKError.NotFound) {
        println("Data not ready yet")
    }
}
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
Task {
    do {
        let data = try await sdk.getRecoveredData()
        print("Recovery Key: \(data.recoveryKey)")
    } catch let error as UnforgettableSDKError {
        if case .notFound = error {
            print("Data not ready yet")
        }
    }
}
```

  </TabItem>
</Tabs>

**Throws:**
- `NotFoundError` - Data transfer not found (user hasn't completed recovery)
- `NetworkError` - Network connectivity issues
- `CryptoError` - Decryption failed
- `InvalidResponse` - Server returned invalid data

### `getRecoveredKey()`

Convenience method to retrieve only the recovery key.

**Returns:** `Promise<string>` (TypeScript) | `String` (Kotlin/Swift)

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
const recoveryKey = await sdk.getRecoveredKey()
// Equivalent to: (await sdk.getRecoveredData()).recoveryKey
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
val recoveryKey = sdk.getRecoveredKey()
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
let recoveryKey = try await sdk.getRecoveredKey()
```

  </TabItem>
</Tabs>

**Throws:**
- Same as `getRecoveredData()`

## Types

### `UnforgettableSdkOptions`

Configuration options for initializing the SDK.

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
interface UnforgettableSdkOptions {
  mode: 'create' | 'restore'
  appUrl?: string
  apiUrl?: string
  factors?: RecoveryFactor[]
  walletAddress?: string
  group?: string
  customParams?: Record<string, string>
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
data class UnforgettableSdkOptions(
    val mode: UnforgettableMode,
    val appUrl: String = UNFORGETTABLE_APP_URL,
    val apiUrl: String = UNFORGETTABLE_API_URL,
    val factors: List<RecoveryFactor> = emptyList(),
    val walletAddress: String? = null,
    val group: String? = null,
    val customParams: Map<String, String>? = null
)
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
public struct UnforgettableSdkOptions {
    public let mode: UnforgettableMode
    public let appUrl: String
    public let apiUrl: String
    public let factors: [RecoveryFactor]
    public let walletAddress: String?
    public let group: String?
    public let customParams: [String: String]?
}
```

  </TabItem>
</Tabs>

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mode` | `'create' \| 'restore'` | - | **Required.** Operation mode |
| `appUrl` | `string` | `'https://unforgettable.app/sdk'` | Unforgettable app URL |
| `apiUrl` | `string` | `'https://api.unforgettable.app'` | API endpoint URL |
| `factors` | `RecoveryFactor[]` | `[]` | Recovery factors to enable |
| `walletAddress` | `string` | `undefined` | Wallet address (required for restore mode) |
| `group` | `string` | `undefined` | Group identifier for organizing keys |
| `customParams` | `Record<string, string>` | `undefined` | Custom URL parameters |

### `RecoveredData`

Data returned from recovery operations.

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
interface RecoveredData {
  recoveryKey: string
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
data class RecoveredData(
    val recoveryKey: String,
)
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
public struct RecoveredData {
    public let recoveryKey: String
}
```

  </TabItem>
</Tabs>

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `recoveryKey` | `string` | The decrypted recovery/private key |

### `UnforgettableMode`

Recovery operation mode.

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
type UnforgettableMode = 'create' | 'restore'
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
enum class UnforgettableMode {
    CREATE,
    RESTORE
}
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
public enum UnforgettableMode {
    case create
    case restore
}
```

  </TabItem>
</Tabs>

## Properties

### `mode`

The operation mode (create or restore).

**Type:** `UnforgettableMode`

**Read-only:** Yes

```typescript
console.log(sdk.mode) // 'create' or 'restore'
```

### `appUrl`

The Unforgettable app URL.

**Type:** `string`

**Read-only:** Yes

```typescript
console.log(sdk.appUrl) // 'https://unforgettable.app/sdk'
```

### `factors`

The [recovery factors](./recovery-factors.md) configured for this instance.

**Type:** `RecoveryFactor[]`

**Read-only:** Yes

```typescript
console.log(sdk.factors) // [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password]
```

### `walletAddress`

The wallet address (if specified).

**Type:** `string | undefined`

**Read-only:** Yes

```typescript
console.log(sdk.walletAddress) // '0x...' or undefined
```

### `group`

The group identifier (if specified).

**Type:** `string | undefined`

**Read-only:** Yes

```typescript
console.log(sdk.group) // 'my-app' or undefined
```

### `customParams`

Custom URL parameters (if specified).

**Type:** `Record<string, string> | undefined`

**Read-only:** Yes

```typescript
console.log(sdk.customParams) // { theme: 'dark' } or undefined
```

## Examples

### Create Recovery Flow

```typescript
import { UnforgettableSdk, RecoveryFactor, NotFoundError } from '@rarimo/unforgettable-sdk'

async function setupRecovery() {
  // Initialize SDK
  const sdk = new UnforgettableSdk({
    mode: 'create',
    factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password],
    group: 'my-wallet',
  })

  // Get recovery URL
  const url = await sdk.getRecoveryUrl()
  displayQRCode(url)

  // Poll for recovery key
  const maxAttempts = 60
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const key = await sdk.getRecoveredKey()
      console.log('Recovery successful!')
      return key
    } catch (error) {
      if (error instanceof NotFoundError) {
        await sleep(3000)
      } else {
        throw error
      }
    }
  }

  throw new Error('Recovery timeout')
}
```

### Restore Account Flow

```typescript
async function restoreAccount(walletAddress: string) {
  const sdk = new UnforgettableSdk({
    mode: 'restore',
    walletAddress,
    factors: [RecoveryFactor.Face],
  })

  const url = await sdk.getRecoveryUrl()
  displayQRCode(url)

  // Poll for restored key
  while (true) {
    try {
      const data = await sdk.getRecoveredData()
      console.log('Account restored!')
      console.log('Key:', data.recoveryKey)
      return data
    } catch (error) {
      if (error instanceof NotFoundError) {
        await sleep(3000)
      } else {
        throw error
      }
    }
  }
}
```

## Error Handling

All SDK methods can throw errors. Always use try-catch:

```typescript
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  if (error instanceof NotFoundError) {
    // Data not ready, retry
  } else if (error.name === 'NetworkError') {
    // Network issue
  } else if (error.name === 'CryptoError') {
    // Encryption/decryption failed
  } else {
    // Other error
  }
}
```

See [Error Reference](/sdk/api/errors) for detailed error documentation.

## Next Steps

- [Recovery Factors](/sdk/api/recovery-factors) - Available authentication methods
- [Errors](/sdk/api/errors) - Error types and handling
- [Advanced: Architecture](/sdk/advanced/architecture) - How it works
