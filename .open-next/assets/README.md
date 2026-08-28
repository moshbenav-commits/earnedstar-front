# EarnedStar — workspace brand masters

**Product:** verified review platform · `earnedstar.com`  
**Spec:** `docs/prompts/AI_EARNEDSTAR_SPEC.md`  
**Site Forge:** `brand/EARNEDSTAR_FORGE_INTEGRATION.json`

## SSOT files

| File | Purpose |
|------|---------|
| `SITE_ASSET_MANIFEST.json` | Tier checklist incl. widget (tier7) |
| `WIDGET_THEMES.json` | Embed theme tokens + forge industry picks |
| `workshop/` | Logo workshop briefs |

## Site Forge wiring

Every commerce/local/SaaS forge path can bundle **EarnedStar** instead of Trustpilot/Yotpo:

1. Merchant slug = customer Site Forge slug
2. Widget theme from `forgeThemePickRules` in `WIDGET_THEMES.json`
3. Public profile: `https://earnedstar.com/reviews/{slug}`

## Develop more (P1)

- [x] Widget theme CSS vars shipped in `embed/v1/widget.js` (via rewrite → `widget/v1/widget.js` · `data-theme`)
- [ ] `customer-brand-sync` reads palette from `brand/{slug}/SITE_ASSET_MANIFEST.json`
- [ ] Shopify app · WooCommerce plugin
- [ ] GBP `place_id` field on merchant (pair with `google-maps-places` playbook)
