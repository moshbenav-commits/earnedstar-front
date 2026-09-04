#!/usr/bin/env node
/**
 * ws.mjs — run a script that lives in the Expedia Solutions WORKSPACE from this repo,
 * wherever this repo physically sits.
 *
 *   node scripts/ws.mjs <path-under-workspace> [args…]
 *   node scripts/ws.mjs --print            # just print the resolved workspace root
 *
 * Why (2026-09-04): this repo is reached as `<workspace>/earnedstar-front`, but that
 * entry is a SYMLINK to a physical sibling (`~/earnedstar-front`). Node resolves a
 * process's cwd to the physical path, so every `node ../scripts/…` in package.json
 * ran against `~/scripts/…`, which does not exist — preflight, the OpenNext flatten
 * step and the staging deploy all died with MODULE_NOT_FOUND from this checkout.
 * Hard-coding "../Expedia Solutions/…" works on this Mac and nowhere the directory
 * is named differently. This shim resolves the workspace at run time instead.
 *
 * Resolution order (first hit wins, each verified by a workspace marker):
 *   1. $CREYTIX_WORKSPACE_ROOT / $EXPEDIA_WORKSPACE_ROOT
 *   2. the LOGICAL cwd npm hands us in $PWD (keeps the symlink path) → its parent
 *   3. the physical repo dir's parent (the nested-repo case)
 *   4. the fleet convention: $HOME/Expedia Solutions
 *   5. any sibling of the physical repo dir that carries the marker
 *
 * Marker = `scripts/lib/flatten-standalone-for-opennext.mjs` present, or package.json
 * name `expedia-parts-workspace`. Never guesses a directory name with a space in it.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REPO_REAL = fs.realpathSync(path.join(path.dirname(fileURLToPath(import.meta.url)), ".."));

function isWorkspace(dir) {
  if (!dir) return false;
  try {
    if (fs.existsSync(path.join(dir, "scripts/lib/flatten-standalone-for-opennext.mjs"))) return true;
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
    return pkg.name === "expedia-parts-workspace";
  } catch {
    return false;
  }
}

export function resolveWorkspaceRoot() {
  const tried = [];
  const candidates = [
    process.env.CREYTIX_WORKSPACE_ROOT,
    process.env.EXPEDIA_WORKSPACE_ROOT,
    process.env.PWD ? path.resolve(process.env.PWD, "..") : null,
    path.resolve(REPO_REAL, ".."),
    path.join(os.homedir(), "Expedia Solutions"),
  ].filter(Boolean);
  for (const c of candidates) {
    tried.push(c);
    if (isWorkspace(c)) return fs.realpathSync(c);
  }
  // Siblings of the physical repo (the symlinked-sibling layout, any directory name).
  const parent = path.resolve(REPO_REAL, "..");
  for (const name of fs.readdirSync(parent)) {
    const c = path.join(parent, name);
    try {
      if (fs.statSync(c).isDirectory() && isWorkspace(c)) return fs.realpathSync(c);
    } catch {
      /* skip */
    }
  }
  const msg = [
    "ws.mjs: could not find the Expedia Solutions workspace.",
    "Tried: " + tried.join(" · "),
    "Set CREYTIX_WORKSPACE_ROOT=/path/to/workspace (the dir holding scripts/lib/flatten-standalone-for-opennext.mjs).",
  ].join("\n");
  throw new Error(msg);
}

const argv = process.argv.slice(2);
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("ws.mjs")) {
  try {
    const root = resolveWorkspaceRoot();
    if (argv[0] === "--print" || argv.length === 0) {
      console.log(root);
      process.exit(0);
    }
    const target = path.join(root, argv[0]);
    if (!fs.existsSync(target)) {
      console.error(`ws.mjs: ${argv[0]} not found under ${root}`);
      process.exit(2);
    }
    const r = spawnSync(process.execPath, [target, ...argv.slice(1)], { stdio: "inherit", cwd: process.cwd(), env: process.env });
    process.exit(r.status ?? 1);
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
}
