import { createFileRoute } from "@tanstack/react-router";
import apk from "@/assets/jagx-connect.apk.asset.json";

/**
 * Streams the signed JagX Connect APK with the correct Android MIME type and a
 * Content-Disposition attachment header so browsers always download the file.
 * Range requests are passed through so downloads can resume on flaky networks.
 */
async function serve(request: Request, method: "GET" | "HEAD") {
  const origin = new URL(request.url).origin;
  const source = apk.url.startsWith("http") ? apk.url : origin + apk.url;

  const range = request.headers.get("range");
  const upstream = await fetch(source, {
    method,
    headers: range ? { range } : undefined,
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("APK temporarily unavailable", { status: 502 });
  }

  const headers = new Headers();
  headers.set("content-type", "application/vnd.android.package-archive");
  headers.set("content-disposition", 'attachment; filename="JagX-Connect.apk"');
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=3600");
  headers.set("x-content-type-options", "nosniff");
  const len = upstream.headers.get("content-length");
  if (len) headers.set("content-length", len);
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("content-range", contentRange);

  return new Response(method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
}

export const Route = createFileRoute("/api/public/jagx-connect.apk")({
  server: {
    handlers: {
      GET: ({ request }) => serve(request, "GET"),
      HEAD: ({ request }) => serve(request, "HEAD"),
    },
  },
});
