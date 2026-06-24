/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 * Proprietary and confidential. Unauthorized copying, distribution, or use
 * is strictly prohibited without express written permission.
 */
export async function submitReview(payload: {
  token: string;
  rating_overall: number;
  rating_fitment?: number;
  rating_quality?: number;
  rating_shipping?: number;
  rating_description?: number;
  rating_install?: number;
  ymm_year?: number;
  ymm_make?: string;
  ymm_model?: string;
  ymm_trim?: string;
  review_title?: string;
  review_text: string;
  customer_name: string;
  customer_email: string;
  photos?: string[];
  video_url?: string;
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
  return data as { ok: boolean; reviewId?: string; status: string; fraud_score?: number };
}

export async function uploadReviewPhoto(input: {
  token: string;
  file: File;
}): Promise<string> {
  const buffer = await input.file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const dataBase64 = btoa(binary);

  const res = await fetch("/api/earnedstar/reviews/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: input.token,
      filename: input.file.name,
      content_type: input.file.type || "image/jpeg",
      data_base64: dataBase64,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? "Failed to upload photo");
  }
  return (data as { url: string }).url;
}

export async function moderateReview(reviewId: string, status: "published" | "rejected") {
  const res = await fetch(`/api/earnedstar/reviews/${reviewId}/moderate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? "Failed to update review");
  }
  return data as { ok: boolean; status: string };
}

export async function respondToReview(reviewId: string, business_response: string) {
  const res = await fetch(`/api/earnedstar/reviews/${reviewId}/respond`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ business_response }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? "Failed to save response");
  }
  return data as { ok: boolean; business_response: string };
}
