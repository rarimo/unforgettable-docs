---
sidebar_position: 2
---

# Recovery Factors

Reference for available recovery factor types and their usage.

## Overview

Recovery factors are authentication methods users can choose to protect their recovery keys. Each factor provides a different balance of security and user experience.

## Available Factors

### RecoveryFactor Enum

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
export enum RecoveryFactor {
  Face = 1,
  Image = 2,
  Password = 3,
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
enum class RecoveryFactor(val value: Int) {
    FACE(1),
    IMAGE(2),
    PASSWORD(3)
}
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
public enum RecoveryFactor: Int {
    case face = 1
    case image = 2
    case password = 3
}
```

  </TabItem>
</Tabs>

## Factor Details

### Face (1)

Biometric facial recognition.

**Security Level:** High

**User Experience:**
- ✅ Fast and convenient
- ✅ No memorization required
- ❌ Requires camera access
- ❌ May fail in low light

**Best For:**
- Mobile applications
- Consumer wallets
- Quick authentication

**Implementation:**
```typescript
factors: [RecoveryFactor.Face]
```

**Considerations:**
- Uses device biometric sensors
- Requires user permission for camera
- Works best with front-facing camera
- May require liveness detection

---

### Image (2)

Physical object or image recognition.

**Security Level:** Medium-High

**User Experience:**
- ✅ Unique and memorable
- ✅ Offline-capable (with photo)
- ❌ Requires keeping physical object safe
- ❌ Can be lost or damaged

**Best For:**
- Backup authentication
- Physical security tokens
- Multi-factor setups

**Implementation:**
```typescript
factors: [RecoveryFactor.Image]
```

**Considerations:**
- User must have access to physical object
- Image should be unique and recognizable
- Avoid common objects (keys, coins)
- Consider digital alternatives

---

### Password (3)

User-defined password or passphrase.

**Security Level:** Medium

**User Experience:**
- ✅ Familiar to users
- ✅ Works everywhere
- ❌ Can be forgotten
- ❌ Vulnerable to weak passwords

**Best For:**
- Enterprise applications
- Users familiar with password managers
- Fallback authentication

**Implementation:**
```typescript
factors: [RecoveryFactor.Password]
```

**Considerations:**
- Encourage strong passwords
- Provide password strength feedback
- Consider password managers
- Implement rate limiting

## Usage Patterns

### All Factors (Default)

Don't specify factors to allow all options:

```typescript
const sdk = new UnforgettableSdk({
  mode: 'create',
  // factors omitted = all factors available
})
```

**Equivalent to:**
```typescript
factors: [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password]
```

---

### Single Factor

Specify one factor for a streamlined experience:

```typescript
const sdk = new UnforgettableSdk({
  mode: 'create',
  factors: [RecoveryFactor.Face], // Only face recognition
})
```

**Pros:**
- Simple user experience
- Fastest setup

**Cons:**
- No fallback if factor unavailable
- Lower security for single factor

---

### Multiple Factors (User Choice)

Allow users to choose their preferred factor:

```typescript
const sdk = new UnforgettableSdk({
  mode: 'create',
  factors: [
    RecoveryFactor.Face,
    RecoveryFactor.Image,
    RecoveryFactor.Password,
  ], // User picks one
})
```

**Pros:**
- Flexible user experience
- Users choose what works best for them

**Cons:**
- Slightly more complex UX
- Users may choose weak factors

---

## Factor Validation

<Tabs groupId="platform">
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { RecoveryFactor, ALL_RECOVERY_FACTORS } from '@rarimo/unforgettable-sdk'

function validateFactors(factors: RecoveryFactor[]): boolean {
  return factors.every(factor => ALL_RECOVERY_FACTORS.includes(factor))
}

// Usage
const userFactors = [RecoveryFactor.Face, RecoveryFactor.Image, RecoveryFactor.Password]
if (validateFactors(userFactors)) {
  console.log('Valid factors')
}
```

  </TabItem>
  <TabItem value="kotlin" label="Kotlin">

```kotlin
fun validateFactors(factors: List<RecoveryFactor>): Boolean {
    val validFactors = RecoveryFactor.values().toList()
    return factors.all { it in validFactors }
}
```

  </TabItem>
  <TabItem value="swift" label="Swift">

```swift
func validateFactors(_ factors: [RecoveryFactor]) -> Bool {
    let validFactors: Set<RecoveryFactor> = [.face, .image, .password]
    return factors.allSatisfy { validFactors.contains($0) }
}
```

  </TabItem>
</Tabs>

## UI Recommendations

### Factor Icons

Suggest using recognizable icons:

- **Face:** 👤 or face scan icon
- **Image:** 📷 or object icon
- **Password:** 🔑 or lock icon

### Factor Labels

Clear, user-friendly labels:

- **Face:** "Face Recognition" or "Biometric"
- **Image:** "Physical Object" or "Security Image"
- **Password:** "Password" or "Passphrase"

### Factor Descriptions

Help users understand each option:

```typescript
const factorDescriptions = {
  [RecoveryFactor.Face]: "Use your face to recover your account",
  [RecoveryFactor.Image]: "Use a physical object or image",
  [RecoveryFactor.Password]: "Use a password you create",
}
```

## Future Factors

Potential future additions:

- **Geolocation:** Location-based verification
- **Voice:** Voice recognition

## Examples

<Tabs groupId="example-type">
  <TabItem value="ui-component" label="Factor Selection UI (React)" default>

```tsx
import { RecoveryFactor } from '@rarimo/unforgettable-sdk'

function FactorSelector({ onSelect }: { onSelect: (factor: RecoveryFactor) => void }) {
  const factors = [
    { value: RecoveryFactor.Face, label: 'Face', icon: '👤' },
    { value: RecoveryFactor.Image, label: 'Image', icon: '📷' },
    { value: RecoveryFactor.Password, label: 'Password', icon: '🔑' },
  ]

  return (
    <div className="factor-selector">
      <h3>Choose Recovery Method</h3>
      {factors.map(factor => (
        <button
          key={factor.value}
          onClick={() => onSelect(factor.value)}
          className="factor-option"
        >
          <span className="icon">{factor.icon}</span>
          <span className="label">{factor.label}</span>
        </button>
      ))}
    </div>
  )
}
```

  </TabItem>
  <TabItem value="dynamic-loading" label="Dynamic Factor Loading">

```typescript
async function getAvailableFactors(): Promise<RecoveryFactor[]> {
  const factors: RecoveryFactor[] = []
  
  // Check if camera available (for Face and Image)
  if (await hasCameraAccess()) {
    factors.push(RecoveryFactor.Face)
    factors.push(RecoveryFactor.Image)
  }
  
  // Password always available
  factors.push(RecoveryFactor.Password)
  
  return factors
}
```

  </TabItem>
</Tabs>

## Next Steps

- [UnforgettableSDK](/docs/sdk/api/unforgettable-sdk) - Main SDK API
- [Errors](/docs/sdk/api/errors) - Error handling
- [Quick Start](/docs/sdk/getting-started) - Get started quickly
