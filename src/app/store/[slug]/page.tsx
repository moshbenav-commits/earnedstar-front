import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Legacy URL — canonical public profile lives at /reviews/[slug]. */
export default async function StoreAliasPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/reviews/${slug}`);
}
