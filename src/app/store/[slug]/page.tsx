/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Legacy URL — canonical public profile lives at /reviews/[slug]. */
export default async function StoreAliasPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/reviews/${slug}`);
}
