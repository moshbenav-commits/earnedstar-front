# Salvage

Work recovered from elsewhere that could not be merged as-is. Each entry records what it was, where it came from, and why it is here rather than on a branch.

## 2026-06-28-ops-wip-from-earnedstar-mirror.patch

**Origin:** branch `stash-archive/0628-s00-ops-wip` in the duplicate local checkout at `<workspace>/earnedstar/` — a second working copy of this same GitHub repo. Those commits existed on **no remote ref** and were not present in this repo, so deleting the duplicate would have destroyed them.

**Contents:** archived `git stash` of ops WIP — 4 files, 15 insertions / 40 deletions:
- `src/app/ops/tasks/page.tsx`
- `src/components/ops/ops-sidebar.tsx`
- `src/components/ops/task-console.tsx`
- `supabase/migrations/010_gt_ops_p0.sql`

**Why a patch and not a branch:** the stash's sibling commits carried `.next/` build output including a 116 MB `node_modules/@next/swc-darwin-arm64/next-swc.darwin-arm64.node`, which GitHub rejects (100 MB limit) — the push failed with `GH001: Large files detected`. Git LFS is deliberately not used in this estate. The patch also no longer applies cleanly to `main`: all four files have moved on since 2026-06-28, so this is a record of intent, not drop-in code.

**To use it:** `git apply -3 docs/salvage/2026-06-28-ops-wip-from-earnedstar-mirror.patch` and resolve by hand, or just read it for the intended change.

**Consequence:** with this committed, the duplicate checkout at `<workspace>/earnedstar/` holds nothing unique and is safe to retire.
