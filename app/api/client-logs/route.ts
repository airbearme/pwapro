export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  console.error("CLIENT_ERROR", body);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
