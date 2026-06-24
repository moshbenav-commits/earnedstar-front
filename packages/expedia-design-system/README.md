# @expedia/design-system

Code-native design system for Expedia Parts — tokens, CSS material layers, and React primitives.

**Spec:** [`docs/prompts/AI_CODE_NATIVE_DESIGN_WORKFLOW.md`](../../../docs/prompts/AI_CODE_NATIVE_DESIGN_WORKFLOW.md) (workspace)  
**Cursor rule:** `.cursor/rules/ai-code-native-design-workflow.mdc`

## Usage (expedia-parts-front)

```tsx
import { DsButton, BrandLogo, TrustBadge, colors } from '@expedia/design-system';
import '@expedia/design-system/styles';
```

Import via `@expedia/design-system` (and subpaths). Run `npm run build:design-packages` for publish-ready `dist/`.

## Contents

| Export | Description |
|--------|-------------|
| `.` | Tokens, typography helpers, components, brand assets |
| `./styles` | CSS layers (`tokens`, `metal`, `glass`, `motion`) |
| `./components` | `DsButton`, `DsBadge`, `BrandLogo`, `TrustBadge`, … |

## Design-lab

- Shell primitives: `@expedia/design-lab` (`DesignLabShell`, sections, grids)
- EP dev routes: `src/app/design-lab/` (logos, materials, scenarios)
- EarnedStar dev routes: `earnedstar/src/app/design-lab/` (tokens, stars, brand, shared)

## Consumers

| App | Dependency style |
|-----|------------------|
| expedia-parts-front | `workspace:*` |
| earnedstar | `file:../expedia-parts-front/packages/expedia-design-system` (+ design-lab) |
