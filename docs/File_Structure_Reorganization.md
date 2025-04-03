# File Structure Reorganization Plan

## Current Issues
- Mixed TypeScript and Python files in core directory
- Duplicate/partial files present
- Inconsistent naming conventions

## Proposed Structure
```
src/
  core/                   # Core TypeScript services
    agent/                # Agent subsystem
    analytics/            # Analytics services  
    billing/              # Billing services
    ml/                   # Machine learning services
    notification/         # Notification services
    __tests__/            # Core service tests
    
  api/                    # API controllers
  interfaces/             # Shared interfaces
  models/                 # Data models
  services/               # Business logic services
  
  python/                 # Python backend services
    core/                 # Core Python modules
    tests/                # Python unit tests
```

## Implementation Steps
1. Move Python files to src/python/
2. Consolidate duplicate files
3. Standardize naming:
   - Service files: [Domain]Service.ts
   - Interfaces: I[Domain].ts 
   - Tests: [Domain].test.ts
4. Update all import references
5. Verify CI/CD pipelines

## Verification
- Run full test suite after reorganization
- Check all import paths
- Verify documentation links