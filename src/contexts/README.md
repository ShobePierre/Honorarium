# React Context

This folder contains React Context providers for global state management.

## Available Contexts

### BeneficiaryContext
Manages global state for beneficiaries.

```javascript
import { BeneficiaryProvider, useBeneficiary } from './BeneficiaryContext';
```

### AuthContext
Manages authentication state (if applicable).

```javascript
import { AuthProvider, useAuth } from './AuthContext';
```

## Creating New Contexts

1. Create a new file: `YourContext.jsx`
2. Export both Provider and custom hook
3. Wrap your app with the provider in main.jsx or a parent component
