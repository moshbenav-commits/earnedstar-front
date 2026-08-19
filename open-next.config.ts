import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/** Staging cache stays in-Worker. Do not bind a custom domain here (PRC-023 Wave 2). */
export default defineCloudflareConfig();
