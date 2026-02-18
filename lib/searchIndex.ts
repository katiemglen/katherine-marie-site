import postsData from '@/posts.json';

export interface SearchResult {
  slug: string;
  title: string;
  date: string;
  heroImage: string;
  snippet: string;
  matchStart: number;
  matchEnd: number;
}

interface SearchEntry {
  slug: string;
  title: string;
  date: string;
  heroImage: string;
  searchText: string; // combined lowercase text for searching
  rawText: string;    // original text for snippet extraction
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFigcaptions(html: string): string {
  const matches = html.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi);
  if (!matches) return '';
  return matches.map(m => stripHtml(m)).join(' ');
}

let _index: SearchEntry[] | null = null;

function getIndex(): SearchEntry[] {
  if (_index) return _index;

  _index = (postsData as any[]).map(post => {
    const strippedContent = stripHtml(post.content || '');
    const captions = extractFigcaptions(post.content || '');
    const rawText = `${post.title} ${strippedContent} ${captions}`;

    return {
      slug: post.slug,
      title: post.title,
      date: post.date,
      heroImage: post.images?.[0] || '',
      searchText: rawText.toLowerCase(),
      rawText,
    };
  });

  return _index;
}

export function search(query: string, max = 20): SearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim().toLowerCase();
  const index = getIndex();
  const results: SearchResult[] = [];

  for (const entry of index) {
    const pos = entry.searchText.indexOf(q);
    if (pos === -1) continue;

    // Build snippet around match in rawText
    const snippetRadius = 75;
    const start = Math.max(0, pos - snippetRadius);
    const end = Math.min(entry.rawText.length, pos + q.length + snippetRadius);

    let snippet = entry.rawText.slice(start, end);
    if (start > 0) snippet = '…' + snippet;
    if (end < entry.rawText.length) snippet = snippet + '…';

    results.push({
      slug: entry.slug,
      title: entry.title,
      date: entry.date,
      heroImage: entry.heroImage,
      snippet,
      matchStart: start > 0 ? pos - start + 1 : pos - start,
      matchEnd: (start > 0 ? pos - start + 1 : pos - start) + q.length,
    });

    if (results.length >= max) break;
  }

  return results;
}
