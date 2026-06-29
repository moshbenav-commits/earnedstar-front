# EarnedStar — mobile (Capacitor, optional)

**Canonical native app:** `earnedstar-ios/` (SwiftUI) per `docs/prompts/AI_MOBILE_APP_BUILD_SPEC.md`.

This Capacitor shell is an optional marketing WebView wrapper. Fleet SSOT: `../brand/mobile/FLEET_MOBILE_SITES.json`.

| Field | Value |
|-------|-------|
| Bundle ID | `com.earnedstar.app` |
| Production URL | https://earnedstar.com |

## First-time setup

```bash
cd earnedstar-front   # symlink to earnedstar/
npm install
npm run mobile:add:ios
npm run mobile:add:android
npm run mobile:sync
```
