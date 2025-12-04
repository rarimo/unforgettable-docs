---
sidebar_position: 3
---

# Error Reference

Complete reference for error types and error handling in Unforgettable SDK.

## Error Types

### NotFoundError

Data transfer not found or not yet available.

**When thrown:**
- User hasn't completed recovery process
- Transfer ID doesn't exist
- Data expired (past TTL)

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { NotFoundError } from '@rarimo/unforgettable-sdk'

try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Data not ready yet, continue polling')
  }
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
try {
    val key = sdk.getRecoveredKey()
} catch (e: UnforgettableSDKError.NotFound) {
    println("Data not ready yet")
}
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
do {
    let key = try await sdk.getRecoveredKey()
} catch let error as UnforgettableSDKError {
    if case .notFound = error {
        print("Data not ready yet")
    }
}
```

  </TabItem>
</Tabs>

**Recommended Action:** Continue polling

---

### NetworkError

Network connectivity or HTTP request failed.

**When thrown:**
- No internet connection
- API server unreachable
- Request timeout
- HTTP error codes (500, 503, etc.)

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  if (error.name === 'NetworkError') {
    console.error('Network issue:', error.message)
    // Show retry button to user
  }
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
try {
    val key = sdk.getRecoveredKey()
} catch (e: UnforgettableSDKError.NetworkError) {
    println("Network error: ${e.cause}")
}
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
do {
    let key = try await sdk.getRecoveredKey()
} catch let error as UnforgettableSDKError {
    if case .networkError(let underlying) = error {
        print("Network error: \(underlying)")
    }
}
```

  </TabItem>
</Tabs>

**Recommended Action:** Retry with exponential backoff

---

### CryptoError

Cryptographic operation failed.

**When thrown:**
- Key generation failed
- Encryption failed
- Decryption failed
- Invalid encryption key
- Malformed encrypted data

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  if (error.name === 'CryptoError') {
    console.error('Decryption failed:', error.message)
    // Data may be corrupted, abort
  }
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
try {
    val sdk = UnforgettableSDK(options)
} catch (e: CryptoError.KeyGenerationFailed) {
    println("Failed to generate keys")
}

try {
    val data = sdk.getRecoveredData()
} catch (e: UnforgettableSDKError.CryptoError) {
    println("Decryption failed: ${e.cause}")
}
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
do {
    let sdk = try UnforgettableSDK(options: options)
} catch let error as CryptoError {
    if case .keyGenerationFailed = error {
        print("Key generation failed")
    }
}

do {
    let data = try await sdk.getRecoveredData()
} catch let error as UnforgettableSDKError {
    if case .cryptoError(let underlying) = error {
        print("Crypto error: \(underlying)")
    }
}
```

  </TabItem>
</Tabs>

**Recommended Action:** Abort and restart recovery process

---

### InvalidResponse

API returned unexpected or malformed response.

**When thrown:**
- Response doesn't match expected schema
- Missing required fields
- Invalid JSON

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  if (error.name === 'InvalidResponse') {
    console.error('API returned invalid data')
  }
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
try {
    val data = sdk.getRecoveredData()
} catch (e: UnforgettableSDKError.InvalidResponse) {
    println("Invalid API response")
}
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
do {
    let data = try await sdk.getRecoveredData()
} catch let error as UnforgettableSDKError {
    if case .invalidResponse = error {
        print("Invalid API response")
    }
}
```

  </TabItem>
</Tabs>

**Recommended Action:** Retry or report error

---

### DecodingError

Failed to decode/parse data.

**When thrown:**
- JSON parsing failed
- Base64 decoding failed
- Invalid data format

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  if (error.name === 'DecodingError') {
    console.error('Failed to parse response')
  }
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
try {
    val data = sdk.getRecoveredData()
} catch (e: UnforgettableSDKError.DecodingError) {
    println("Decoding failed: ${e.cause}")
}
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
do {
    let data = try await sdk.getRecoveredData()
} catch let error as UnforgettableSDKError {
    if case .decodingError(let underlying) = error {
        print("Decoding error: \(underlying)")
    }
}
```

  </TabItem>
</Tabs>

**Recommended Action:** Retry or abort

## Error Handling Patterns

### Basic Try-Catch

```typescript
async function recoverKey(sdk: UnforgettableSdk): Promise<string | null> {
  try {
    return await sdk.getRecoveredKey()
  } catch (error) {
    console.error('Recovery failed:', error)
    return null
  }
}
```

### Specific Error Handling

```typescript
async function recoverKeyWithRetry(sdk: UnforgettableSdk): Promise<string> {
  try {
    return await sdk.getRecoveredKey()
  } catch (error) {
    if (error instanceof NotFoundError) {
      // Not ready, caller should retry
      throw error
    } else if (error.name === 'NetworkError') {
      // Network issue, retry after delay
      await sleep(5000)
      return recoverKeyWithRetry(sdk)
    } else if (error.name === 'CryptoError') {
      // Crypto failure, abort
      throw new Error('Decryption failed, please restart recovery')
    } else {
      // Unknown error
      throw error
    }
  }
}
```

### Polling with Error Handling

```typescript
async function pollForKey(
  sdk: UnforgettableSdk,
  maxAttempts: number = 60
): Promise<string> {
  let attempts = 0
  let lastError: Error | null = null
  
  while (attempts < maxAttempts) {
    try {
      return await sdk.getRecoveredKey()
    } catch (error) {
      lastError = error as Error
      
      if (error instanceof NotFoundError) {
        // Expected during polling
        attempts++
        await sleep(3000)
      } else if (error.name === 'NetworkError') {
        // Network issue, longer wait
        attempts++
        await sleep(10000)
      } else {
        // Other errors, abort
        throw error
      }
    }
  }
  
  throw new Error(`Polling timeout after ${attempts} attempts. Last error: ${lastError?.message}`)
}
```

### User-Friendly Error Messages

```typescript
function getErrorMessage(error: Error): string {
  if (error instanceof NotFoundError) {
    return 'Please complete the recovery process on your mobile device'
  } else if (error.name === 'NetworkError') {
    return 'Network connection issue. Please check your internet and try again'
  } else if (error.name === 'CryptoError') {
    return 'Recovery data is invalid. Please restart the recovery process'
  } else if (error.name === 'InvalidResponse') {
    return 'Server error. Please try again later'
  } else {
    return 'An unexpected error occurred. Please try again'
  }
}

// Usage
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  alert(getErrorMessage(error as Error))
}
```

## Error Logging

### Development

```typescript
async function recoverWithLogging(sdk: UnforgettableSdk): Promise<string> {
  try {
    console.log('[Recovery] Starting...')
    const key = await sdk.getRecoveredKey()
    console.log('[Recovery] Success!')
    return key
  } catch (error) {
    console.error('[Recovery] Error:', {
      type: error.name,
      message: error.message,
      stack: error.stack,
    })
    throw error
  }
}
```

### Production

```typescript
async function recoverWithTracking(sdk: UnforgettableSdk): Promise<string> {
  try {
    const key = await sdk.getRecoveredKey()
    analytics.track('recovery_success')
    return key
  } catch (error) {
    // Log error without exposing sensitive data
    errorTracking.captureException(error, {
      tags: {
        component: 'unforgettable-sdk',
        method: 'getRecoveredKey',
      },
      extra: {
        errorType: error.name,
        // DO NOT log private keys or sensitive data
      },
    })
    throw error
  }
}
```

## Platform-Specific Errors

### Android (Kotlin)

```kotlin
sealed class UnforgettableSDKError : Exception() {
    data class NetworkError(override val cause: Throwable) : UnforgettableSDKError()
    object InvalidResponse : UnforgettableSDKError()
    object NotFound : UnforgettableSDKError()
    data class DecodingError(override val cause: Throwable) : UnforgettableSDKError()
    data class CryptoError(override val cause: Throwable) : UnforgettableSDKError()
}

sealed class CryptoError : Exception() {
    object KeyGenerationFailed : CryptoError()
    object EncryptionFailed : CryptoError()
    object DecryptionFailed : CryptoError()
    object InvalidPublicKey : CryptoError()
    object EncodingFailed : CryptoError()
    object DecodingFailed : CryptoError()
}
```

### iOS (Swift)

```swift
public enum UnforgettableSDKError: Error {
    case networkError(Error)
    case invalidResponse
    case notFound
    case decodingError(Error)
    case cryptoError(Error)
}

public enum CryptoError: Error {
    case keyGenerationFailed
    case encryptionFailed
    case decryptionFailed
    case invalidPublicKey
    case encodingFailed
    case decodingFailed
}
```

## Best Practices

### 1. Always Handle Errors

❌ **Bad:**
```typescript
const key = await sdk.getRecoveredKey() // No error handling!
```

✅ **Good:**
```typescript
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  handleError(error)
}
```

### 2. Distinguish Between Error Types

❌ **Bad:**
```typescript
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  console.error('Error!') // Generic handling
}
```

✅ **Good:**
```typescript
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  if (error instanceof NotFoundError) {
    // Continue polling
  } else if (error.name === 'NetworkError') {
    // Retry
  } else {
    // Abort
  }
}
```

### 3. Provide User Feedback

❌ **Bad:**
```typescript
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  console.error(error) // User sees nothing
}
```

✅ **Good:**
```typescript
try {
  const key = await sdk.getRecoveredKey()
} catch (error) {
  showErrorMessage(getErrorMessage(error))
  enableRetryButton()
}
```

### 4. Don't Log Sensitive Data

❌ **Bad:**
```typescript
try {
  const key = await sdk.getRecoveredKey()
  console.log('Recovered key:', key) // Private key exposed!
} catch (error) {
  console.error(error)
}
```

✅ **Good:**
```typescript
try {
  const key = await sdk.getRecoveredKey()
  console.log('Recovery successful')
  // Use key without logging it
} catch (error) {
  console.error('Recovery failed:', error.name)
}
```

## Next Steps

- [UnforgettableSDK API](/sdk/api/unforgettable-sdk) - Main SDK reference
- [Recovery Factors](/sdk/api/recovery-factors) - Recovery factor details
- [Advanced: Data Transfer](/sdk/advanced/data-transfer) - Polling strategies
