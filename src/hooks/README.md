# Custom React Hooks

This folder contains custom React hooks for shared stateful logic.

## Available Hooks

### useFetch
Custom hook for fetching data with loading and error states.

```javascript
const { data, loading, error } = useFetch('/api/endpoint');
```

### useBeneficiaryForm
Hook for managing beneficiary form state.

```javascript
const { formData, setFormData, resetForm } = useBeneficiaryForm();
```

## Adding New Hooks

1. Create a new file: `useYourHookName.js`
2. Export the hook as default
3. Add documentation in this README
