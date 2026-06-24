# @expedia/design-lab

Shared dev-only shell for design-system previews — header, nav, section/grid/card primitives.

**Consumers:** `expedia-parts-front` (`/design-lab/*`), `earnedstar` (`/design-lab` shared primitives).

```tsx
import {
  DesignLabShell,
  DesignLabSection,
  EXPEDIA_PARTS_DESIGN_LAB_NAV,
} from '@expedia/design-lab';
import '@expedia/design-system/styles';
```

App-specific scenario pages (e.g. product-decision program cards) stay in each consumer repo.
