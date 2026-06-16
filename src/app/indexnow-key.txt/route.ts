export async function GET() {
  const key = process.env.INDEXNOW_API_KEY?.trim() ?? "";
  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
