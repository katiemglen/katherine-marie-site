import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();
  const sorted = [...posts].reverse();

  const items = sorted
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>https://katherinemariecreative.com/posts/${p.slug}</link>
      <guid isPermaLink="true">https://katherinemariecreative.com/posts/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt || p.title)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Katherine Marie — Adventure Memories</title>
    <link>https://katherinemariecreative.com</link>
    <description>Travel stories from road trips across America</description>
    <language>en-us</language>
    <atom:link href="https://katherinemariecreative.com/feed/" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
