---
sidebar_position: 4
---

# URL Generation

Learn how recovery URLs are constructed and what each parameter means.

## URL Structure

Recovery URLs follow this structure:

```
https://unforgettable.app/{mode}#{parameters}
```

### Components

| Component | Description | Example |
|-----------|-------------|---------|
| Base URL | Unforgettable app domain | `https://unforgettable.app` |
| Mode Path | `/c` (create) or `/r` (restore) | `/c` |
| Hash Fragment | URL-encoded parameters | `#id=...&epk=...&f=...` |

### Complete Example

**Create Mode:**
```
https://unforgettable.app/c#id=550e8400-e29b-41d4-a716-446655440000&epk=yL8bV...&f=1,2,3&g=my-app
```

**Restore Mode:**
```
https://unforgettable.app/r#id=550e8400-e29b-41d4-a716-446655440000&epk=yL8bV...&f=1&wa=0x1234...&g=my-app
```

## URL Parameters

Parameters are passed in the hash fragment as URL-encoded key-value pairs.

### Standard Parameters

#### `id` (Required)

**Description**: Unique transfer identifier (UUID v4)

**Format**: UUID string
```
id=550e8400-e29b-41d4-a716-446655440000
```

**Purpose**:
- Links SDK instance to recovery session
- Used to retrieve encrypted data from API
- Must be globally unique

#### `epk` (Required)

**Description**: Encryption Public Key

**Format**: Base64 URL-encoded X25519 public key (32 bytes)
```
epk=yL8bV5c4pEqFk2_GxPbN1mQvXhD4wZKj8RtY3nL9cWo
```

**Purpose**:
- Enables Unforgettable.app to encrypt recovery key
- Generated fresh for each session
- 44 characters (base64url encoding of 32 bytes)

#### `f` (Optional)

**Description**: [Recovery Factors](../api/recovery-factors.md)

**Format**: Comma-separated list of factor IDs
```
f=1,2,3
```

**Purpose**:
- Pre-selects available recovery factors
- If omitted, user chooses from all factors
- Multiple factors = user picks one

**Examples**:
```
f=1        # Face only
f=1,3      # Face and Password
f=1,2,3    # All factors
(omitted)  # User chooses factors
```

#### `wa` (Conditional)

**Description**: Wallet Address

**Format**: Ethereum-style address (0x-prefixed hex)
```
wa=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Purpose**:
- Required for restore mode
- Identifies which recovery key to retrieve
- Not used in create mode

**Validation**:
- Must start with `0x`
- 42 characters total (0x + 40 hex digits)
- Case-insensitive

#### `g` (Optional)

**Description**: Group Identifier

**Format**: URL-safe string
```
g=my-wallet-app
```

**Purpose**:
- Organizes recovery keys by application
- Helps users identify which app the recovery is for

**Best Practices**:
- Use app name or identifier
- Keep it short and recognizable
- URL-encode if contains special characters

### Custom Parameters

Applications can add custom parameters for application-specific needs.

**Format**: Any key not reserved (`id`, `epk`, `f`, `wa`, `g`)
```
theme=dark&lang=en&version=2.0
```

**Examples**:
```typescript
const sdk = new UnforgettableSdk({
  mode: 'create',
  customParams: {
    theme: 'dark',
    lang: 'en',
  },
})
```

**Resulting URL:**
```
https://unforgettable.app/c#id=...&epk=...&theme=dark&lang=en
```

## Parameter Encoding

### URL Encoding

Parameters are URL-encoded following RFC 3986.

**Characters that need encoding:**
```
Space → %20
:     → %3A
/     → %2F
?     → %3F
#     → %23
&     → %26
=     → %3D
```

**Base64 URL-Safe Encoding:**

The `epk` parameter uses base64url encoding (RFC 4648):
- `+` → `-`
- `/` → `_`
- Remove padding `=`

**Example:**
```typescript
// Standard Base64: "abc+def/ghi="
// Base64 URL:     "abc-def_ghi"
```

## Generation Process

### Step-by-Step

```typescript
import { UnforgettableSdk } from '@rarimo/unforgettable-sdk'

// 1. Initialize SDK
const sdk = new UnforgettableSdk({
  mode: 'create',
  factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password],
  group: 'my-app',
  customParams: { theme: 'dark' },
})

// 2. SDK generates internal components
// - Transfer ID: uuid()
// - Key pair: generateDataTransferKeyPair()

// 3. SDK builds URL
const recoveryUrl = await sdk.getRecoveryUrl()
// Result: "https://unforgettable.app/c#id=...&epk=...&f=1,3&g=my-app&theme=dark"
```

### Internal Implementation

```typescript
function composeUnforgettableLocationHash(params: UnforgettablePathParams): string {
  const searchParams = new URLSearchParams()
  
  // Required parameters
  searchParams.set('id', params.dataTransferId)
  searchParams.set('epk', params.encryptionPublicKey)
  
  // Optional: Recovery factors
  if (params.factors.length > 0) {
    searchParams.set('f', params.factors.join(','))
  }
  
  // Conditional: Wallet address (restore mode)
  if (params.walletAddress) {
    searchParams.set('wa', params.walletAddress)
  }
  
  // Optional: Group
  if (params.group) {
    searchParams.set('g', params.group)
  }
  
  // Custom parameters
  if (params.customParams) {
    for (const [key, value] of Object.entries(params.customParams)) {
      // Skip reserved keys
      if (!['id', 'epk', 'f', 'wa', 'g'].includes(key)) {
        searchParams.set(key, value)
      }
    }
  }
  
  return `#${searchParams.toString()}`
}
```

## URL Parsing

Unforgettable.app parses the URL to extract parameters:

```typescript
function parseUnforgettableLocationHash(hash: string): UnforgettablePathParams {
  // Remove leading '#'
  const rawParams = hash.startsWith('#') ? hash.slice(1) : hash
  const searchParams = new URLSearchParams(rawParams)
  
  // Extract standard parameters
  const dataTransferId = searchParams.get('id') || ''
  const encryptionPublicKey = searchParams.get('epk') || ''
  const factors = parseFactors(searchParams.get('f') || '')
  const walletAddress = searchParams.get('wa') ?? undefined
  const group = searchParams.get('g') ?? undefined
  
  // Extract custom parameters
  const customParams: Record<string, string> = {}
  const reservedKeys = ['id', 'epk', 'f', 'wa', 'g']
  
  for (const [key, value] of searchParams.entries()) {
    if (!reservedKeys.includes(key)) {
      customParams[key] = value
    }
  }
  
  // Validate required parameters
  if (!dataTransferId || !encryptionPublicKey) {
    throw new Error('Invalid recovery URL: missing required parameters')
  }
  
  return {
    dataTransferId,
    encryptionPublicKey,
    factors,
    walletAddress,
    group,
    ...(Object.keys(customParams).length > 0 && { customParams }),
  }
}
```

## Validation

### SDK Validation

The SDK validates parameters before generating URLs:

```typescript
// Validate mode
if (!['create', 'restore'].includes(options.mode)) {
  throw new Error('Invalid mode: must be "create" or "restore"')
}

// Validate wallet address (restore mode)
if (options.mode === 'restore' && !options.walletAddress) {
  throw new Error('Wallet address required for restore mode')
}

// Validate recovery factors
const validFactors = [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password]
for (const factor of options.factors) {
  if (!validFactors.includes(factor)) {
    throw new Error(`Invalid recovery factor: ${factor}`)
  }
}
```

### App Validation

Unforgettable.app validates received parameters:

```typescript
// Validate transfer ID format
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
if (!uuidRegex.test(dataTransferId)) {
  throw new Error('Invalid transfer ID format')
}

// Validate public key length
const publicKeyBytes = base64UrlToBytes(encryptionPublicKey)
if (publicKeyBytes.length !== 32) {
  throw new Error('Invalid public key length')
}

// Validate wallet address format (if present)
if (walletAddress && !/^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
  throw new Error('Invalid wallet address format')
}
```

## Security Considerations

### Parameter Tampering

**Risk**: Malicious actors modifying URL parameters

**Mitigation**:
- Encryption key embedded in URL
- Even if transfer ID is stolen, cannot decrypt data
- Wallet address validation on Unforgettable.app

### URL Exposure

**Risk**: Recovery URLs contain sensitive transfer information

**Best Practices**:
- Display URLs as QR codes (not clickable links)
- Use HTTPS for URL transmission
- Implement URL expiration (24-hour TTL)
- Don't log full URLs

### Custom Parameters

**Risk**: Custom parameters might leak sensitive data

**Best Practices**:
```typescript
// Good: Non-sensitive data
customParams: { theme: 'dark', lang: 'en' }

// Bad: Sensitive data
customParams: { apiKey: 'secret', userId: '12345' }
```

## URL Length Considerations

### Maximum Lengths

| Browser | Max URL Length |
|---------|----------------|
| Chrome | ~2MB |
| Firefox | ~65,536 chars |
| Safari | ~80,000 chars |
| Edge | ~2MB |

### Typical URL Length

```
Base URL:       27 chars  (https://unforgettable.app/c)
Hash symbol:     1 char   (#)
id parameter:   42 chars  (id=uuid)
epk parameter:  48 chars  (epk=base64url)
f parameter:    10 chars  (f=1,2,3)
g parameter:    20 chars  (g=my-app)
Custom params:  50 chars  (varies)
---
Total:        ~200 chars
```

### QR Code Capacity

QR codes have limited data capacity:

| Version | Error Correction | Max Alphanumeric |
|---------|------------------|------------------|
| 10 | L (7%) | 395 chars |
| 15 | L (7%) | 580 chars |
| 20 | L (7%) | 858 chars |

**Recommendations**:
- Keep URLs under 300 characters for reliable QR codes
- Use short group names
- Minimize custom parameters

## Examples

### Minimal URL (Create Mode)

```
https://unforgettable.app/c#id=a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7&epk=yL8bV5c4pEqFk2_GxPbN1mQvXhD4wZKj8RtY3nL9cWo
```

### Full Featured URL (Create Mode)

```
https://unforgettable.app/c#id=a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7&epk=yL8bV5c4pEqFk2_GxPbN1mQvXhD4wZKj8RtY3nL9cWo&f=1,2,3&g=my-wallet&theme=dark&lang=en
```

### Restore Mode URL

```
https://unforgettable.app/r#id=a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7&epk=yL8bV5c4pEqFk2_GxPbN1mQvXhD4wZKj8RtY3nL9cWo&f=1&wa=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb&g=my-wallet
```

## Next Steps

- [Architecture](/sdk/advanced/architecture) - System overview
- [Encryption](/sdk/advanced/encryption) - Cryptography details
- [API Reference](/sdk/api/unforgettable-sdk) - SDK methods
