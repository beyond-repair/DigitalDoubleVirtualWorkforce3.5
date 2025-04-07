# Project-Wide Refactor Plan

## Objective
Consolidate all core modules, fix imports, remove duplicates, and resolve build errors to enable a clean, maintainable, and functional codebase.

---

## Step-by-Step Plan

### 1. Consolidate Core Modules
- Move `src/core/ml/MLService.ts` to `src/core/MLService.ts`
- Keep these in `src/core/`:
  - `ModelTracker.ts`
  - `AnalyticsService.ts`
  - `ResourceGovernor.ts`
  - `PolicyManager.ts`
- Remove or archive `src/modules/lead_ai/ml_service.py` if not needed

### 2. Update Imports
- Change all imports to reference `src/core/` for these modules
- Fix inconsistent paths in all files

### 3. Remove Duplicates
- Delete duplicate or obsolete files in `src/core/ml/` and `src/modules/lead_ai/`

### 4. Fix Undefined References
- Implement or stub missing classes/interfaces (e.g., `ResourceGovernor`, `Policy`)
- Add missing method/property implementations

### 5. Rebuild Incrementally
- Run `npm run build` after each step
- Fix new errors as they appear

### 6. Test and Document
- Run tests
- Update `document.md` with new structure

---

## Mermaid Diagram

```mermaid
flowchart TD
    subgraph Core
        A[MLService.ts]
        B[ModelTracker.ts]
        C[AnalyticsService.ts]
        D[ResourceGovernor.ts]
        E[PolicyManager.ts]
    end
    subgraph Modules
        F[lead_ai/ml_service.py (archive/remove)]
    end
    A --> B
    A --> C
    A --> D
    A --> E
```

---

## Expected Outcome
- Clean, unified core module structure
- Consistent imports
- No duplicate or obsolete files
- Successful build and test runs
- Easier future development and maintenance