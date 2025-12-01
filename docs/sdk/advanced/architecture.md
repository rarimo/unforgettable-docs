---
sidebar_position: 1
---

# Architecture Overview

Understand the high-level architecture and design principles of the Unforgettable SDK.

## System Architecture

The Unforgettable SDK operates in a distributed architecture with three main components:

```mermaid
graph TB
    App[Your Application]
    SDK[Unforgettable SDK]
    UnfApp[Unforgettable.app]
    API[Unforgettable API]
    
    App -->|1. Initialize| SDK
    SDK -->|2. Generate Key Pair| SDK
    SDK -->|3. Create Recovery URL| App
    App -->|4. Display QR/Link| User
    User -->|5. Scan/Open| UnfApp
    UnfApp -->|6. Recover key| User
    UnfApp -->|7. Encrypt & Send| API
    SDK -->|8. Poll| API
    API -->|9. Return Encrypted Data| SDK
    SDK -->|10. Decrypt| SDK
    SDK -->|11. Return Key| App
```

## Components

### 1. Your Application

Your application integrates the SDK and is responsible for:
- Initializing the SDK with appropriate parameters
- Displaying the recovery URL (as QR code or link)
- Handling the recovered private key
- Creating/restoring user wallets or accounts

### 2. Unforgettable SDK

The client-side SDK running in your application that:
- **Generates Cryptographic Keys**: Creates an X25519 key pair for secure communication
- **Builds Recovery URLs**: Composes URLs with embedded parameters
- **Polls for Data**: Periodically checks the API for recovered keys
- **Decrypts Data**: Decrypts the recovered key using the private key

**Key Features:**
- Zero server-side secrets
- Client-side encryption/decryption only
- No private keys leave the device during generation

### 3. Unforgettable.app

The web application where users complete the recovery process:
- Parses recovery URL parameters
- Authenticates users with selected factors (Face, Image, Password)
- Retrieves the stored recovery key from secure storage
- Encrypts the key with the public key from the URL
- Sends encrypted data to the API

### 4. Unforgettable API

The backend service that:
- Acts as a temporary encrypted data transfer mechanism
- Stores encrypted recovery keys (cannot decrypt them)
- Serves data to authorized SDK instances
- Implements rate limiting and security measures

## Security Model

### End-to-End Encryption

```mermaid
sequenceDiagram
    participant SDK as SDK (Your App)
    participant API as Unforgettable API
    participant UnfApp as Unforgettable.app
    
    Note over SDK: Generate X25519 Key Pair
    SDK->>SDK: Private Key (stays local)
    SDK->>SDK: Public Key (embedded in URL)
    
    SDK->>UnfApp: Recovery URL with Public Key
    
    Note over UnfApp: User authenticates
    UnfApp->>UnfApp: Retrieve recovery key
    UnfApp->>UnfApp: Encrypt with Public Key
    
    UnfApp->>API: Send encrypted data
    
    Note over API: Store encrypted data<br/>(cannot decrypt)
    
    SDK->>API: Poll for data
    API->>SDK: Return encrypted data
    
    SDK->>SDK: Decrypt with Private Key
    Note over SDK: Recovery key available
```

**Key Points:**
- The API never has access to decryption keys
- Private keys never leave the originating device
- Even if API is compromised, data remains encrypted

### Data Flow

1. **Setup Phase**
   - SDK generates ephemeral X25519 key pair
   - Public key embedded in recovery URL
   - Private key stored in memory (never persisted)

2. **Recovery Phase**
   - User authenticates on Unforgettable.app
   - App encrypts recovery key with SDK's public key
   - Encrypted data sent to API with unique transfer ID

3. **Retrieval Phase**
   - SDK polls API with transfer ID
   - Receives encrypted data
   - Decrypts using private key
   - Returns plaintext recovery key to application

## Design Principles

### 1. Zero-Trust Architecture

- No component can access unencrypted recovery keys except the endpoints
- API is an untrusted intermediary
- Cryptographic guarantees over operational security

### 2. Separation of Concerns

```
┌─────────────────────────────────────────────────────────────┐
│ Application Layer                                           │
│ - Business logic                                            │
│ - Wallet management                                         │
│ - User interface                                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ SDK Layer                                                   │
│ - Cryptography                                              │
│ - URL generation                                            │
│ - API communication                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Protocol Layer                                              │
│ - HTTP/HTTPS transport                                      │
│ - JSON serialization                                        │
│ - Error handling                                            │
└─────────────────────────────────────────────────────────────┘
```

### 3. Stateless SDK

- Each SDK instance is independent
- No persistent storage required
- Fresh key pair for each recovery session
- Prevents key reuse vulnerabilities

### 4. Fail-Safe Defaults

- Secure defaults for all configurations
- Explicit opt-in for permissive settings
- Timeout mechanisms prevent indefinite waiting
- Clear error messages for debugging

## Recovery Factors

The SDK supports multiple recovery factors:

### Recovery Factor Types

| Factor | ID | Description | Security Level |
|--------|----|----|----------------|
| Face | 1 | Biometric facial recognition | Medium |
| Image | 2 | Physical object recognition | Medium-High |
| Password | 3 | User-defined password | High |

### Factor Combination

Applications can specify which factors to support:

```typescript
// Single factor
factors: [RecoveryFactor.Face]

// Multiple factors (user chooses)
factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password]

// No factors specified (user chooses from all available)
factors: []
```

## Data Transfer Protocol

### Transfer Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: SDK generates transfer ID
    Created --> Pending: URL generated
    Pending --> Completed: User authenticates
    Pending --> Expired: Timeout
    Completed --> Retrieved: SDK fetches data
    Retrieved --> [*]
    Expired --> [*]
```

### Transfer States

1. **Created**: Transfer ID generated, waiting for URL to be shared
2. **Pending**: URL shared, waiting for user to complete factors
3. **Completed**: User completed factors, encrypted data available
4. **Retrieved**: SDK successfully fetched and decrypted data
5. **Expired**: Transfer exceeded time-to-live (TTL)

### Time-to-Live (TTL)

- Default TTL: 24 hours
- Configurable per deployment
- Automatic cleanup prevents data accumulation
- Fresh transfers for each recovery attempt

## Scalability Considerations

### Horizontal Scaling

- Stateless API enables horizontal scaling
- Load balancing across API instances
- No session affinity required
- Database-backed data transfers

### Performance

- Minimal cryptographic overhead
- Efficient polling with exponential backoff
- CDN-ready static assets
- Optimized QR code generation

## Privacy Considerations

### Data Minimization

- Only essential data transmitted
- No PII required for basic operation
- Optional wallet address for restore mode
- Custom parameters are application-specific

### Data Retention

- Encrypted data stored temporarily
- Automatic deletion after TTL
- No long-term data persistence
- Audit logs contain no sensitive data

## Integration Patterns

### Pattern 1: Embedded Recovery

```
Your App → SDK → Recovery Flow → Wallet Created
```

Recovery integrated directly into onboarding.

### Pattern 2: Optional Backup

```
Your App → Wallet Created → Optional: SDK → Backup Set Up
```

Recovery offered as an optional feature after wallet creation.

### Pattern 3: Recovery-Only

```
Your App → SDK (Restore) → Wallet Restored
```

Used only for recovering existing wallets.

## Next Steps

- [Encryption Details](/sdk/advanced/encryption) - Deep dive into cryptography
- [Data Transfer](/sdk/advanced/data-transfer) - API communication details
- [URL Generation](/sdk/advanced/url-generation) - URL parameter specifications
