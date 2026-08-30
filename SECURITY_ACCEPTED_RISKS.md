# Accepted security risks — earnedstar-front

Dependabot alerts knowingly left open, with the reasoning. An alert belongs here only
when it cannot be fixed, not when fixing it is merely inconvenient. Re-check each
entry whenever the named upstream ships a release.

---

## Dependabot #12 — `esbuild` arbitrary file read via the dev server (low)

**Status:** open, accepted. Re-check when `tsup` supports esbuild 0.28.
**Advisory:** esbuild allows arbitrary file read when running the development server
on Windows. Vulnerable `>= 0.27.3, < 0.28.1`; patched in `0.28.1`. Installed: `0.27.7`.

**Why it is not fixed**

`package.json` already carries `overrides: { "esbuild": "^0.28.1" }`, and it works for
most of the tree — `@opennextjs/aws` and `wrangler` both resolve 0.28.2. One copy
resists it:

```
packages/expedia-design-lab      -> tsup@8.5.1 -> esbuild ^0.27.0
packages/expedia-design-system   -> tsup@8.5.1 -> esbuild ^0.27.0
```

`^0.27.0` excludes 0.28.x, so npm keeps a top-level `esbuild@0.27.7` for tsup and
marks it `invalid` against our override. `tsup@8.5.1` is the **latest published
version** and still declares `esbuild: ^0.27.0` (checked 2026-08-30), so there is no
tsup release to upgrade to. Forcing 0.28.x into tsup would run it against an esbuild
minor it does not claim to support, to fix a vulnerability that cannot affect us —
a bad trade against the two build packages the app depends on.

**Why the exposure is acceptable**

This one fails to apply twice over:

- **Wrong platform.** The advisory is specific to Windows. This fleet is macOS
  (laptop, mini-i7, mini-tool, Studio) and CI runs `ubuntu-latest`.
- **Wrong code path.** The vulnerability is in esbuild's **development server**
  (`esbuild serve`). tsup uses esbuild as a bundler; it never starts that server.
  Nothing here runs the vulnerable component on any platform.
- **Dev scope.** esbuild is a devDependency used to build the vendored design
  packages. It is not in any shipped bundle.

**What would change this:** a `tsup` release accepting `esbuild ^0.28`, or anything
that starts `esbuild serve` in this repo. Either makes it a real fix.

---

## Note on the same class elsewhere

`expedia-parts-front` carries a similar entry for `deepmerge-ts` (Dependabot #51),
also unfixable from the repo because Prisma pins the exact version. Both share a
lesson worth keeping: when an override does not move a version, check whether an
intermediate package **excludes** the patched range before assuming the lockfile is
merely stale. A declared override that does not take effect is worse than none — it
reads as protection that is not there.
