export async function submitReview(payload: {
  token: string;
  rating_overall: number;
  review_title?: string;
  review_text: string;
  customer_name: string;
  customer_email: string;
}) {
  const res = await fetch("/api/earnedstar/reviews/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? "Failed to submit review");
  }
  return data as { ok: boolean; reviewId?: string; status: string };
}
