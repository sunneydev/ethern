export const runtime = "edge";

export async function GET(request: Request) {
  const response = await fetch(
    "https://storage.sunney.dev/web-app-manifest-512x512.png",
  );

  const blob = await response.blob();

  return new Response(blob, { headers: { "Content-Type": "image/png" } });
}
