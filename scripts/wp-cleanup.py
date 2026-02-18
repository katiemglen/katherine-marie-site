#!/usr/bin/env python3
"""Deep WordPress cleanup for posts.json - regex only, no dependencies."""

import json
import re
import os
from pathlib import Path

SITE_DIR = Path(__file__).parent.parent
POSTS_FILE = SITE_DIR / "posts.json"
PUBLIC_DIR = SITE_DIR / "public"

def clean_content(html: str) -> str:
    # 1. Remove WordPress HTML comments
    html = re.sub(r'<!--\s*/?wp:[^>]*?-->', '', html)
    
    # 7. &nbsp; → regular space
    html = html.replace('&nbsp;', ' ')
    
    # 8. [caption] shortcodes → <figure>
    def convert_caption(m):
        inner = m.group(1)
        img_match = re.search(r'(<img[^>]*>)', inner)
        if not img_match:
            return inner
        img_tag = img_match.group(1)
        caption_text = re.sub(r'<[^>]+>', '', inner[img_match.end():]).strip()
        if caption_text:
            return f'<figure>{img_tag}<figcaption>{caption_text}</figcaption></figure>'
        return img_tag
    html = re.sub(r'\[caption[^\]]*\](.*?)\[/caption\]', convert_caption, html, flags=re.DOTALL)
    
    # 9. [gallery] shortcodes → remove
    html = re.sub(r'\[gallery[^\]]*\]', '', html)
    
    # 14. Orphaned numeric IDs [1234]
    html = re.sub(r'\[\d{2,}\]', '', html)
    
    # 10. Strip query params from image URLs
    html = re.sub(r'(src="[^"?]+)\?[^"]*"', r'\1"', html)
    html = re.sub(r'(href="[^"?]+)\?[^"]*"', r'\1"', html)
    
    # 11. VideoPress embeds - convert wp-block-embed wrappers with videopress URLs
    def convert_videopress(m):
        block = m.group(0)
        vp = re.search(r'https://videopress\.com/v/[^\s<"]+', block)
        if vp:
            return f'<div class="video-embed"><a href="{vp.group(0)}">Watch Video</a></div>'
        return block
    # Match figure.wp-block-embed or div.wp-block-embed containing videopress
    html = re.sub(r'<figure[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>.*?</figure>', convert_videopress, html, flags=re.DOTALL)
    html = re.sub(r'<div[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>.*?</div>\s*</div>', convert_videopress, html, flags=re.DOTALL)
    
    # 2. Jetpack tiled gallery - extract <img> tags, remove wrappers
    def extract_imgs_from_gallery(m):
        block = m.group(0)
        imgs = re.findall(r'<img[^>]*>', block)
        return '\n'.join(imgs)
    html = re.sub(r'<div[^>]*class="[^"]*wp-block-jetpack-tiled-gallery[^"]*"[^>]*>.*?</div>\s*(?:</div>\s*)*', extract_imgs_from_gallery, html, flags=re.DOTALL)
    
    # Remaining tiled-gallery divs
    html = re.sub(r'<div[^>]*class="[^"]*tiled-gallery__[^"]*"[^>]*>', '', html)
    
    # 16. wp-block-video - unwrap figure/div, keep content
    html = re.sub(r'<figure[^>]*class="[^"]*wp-block-video[^"]*"[^>]*>(.*?)</figure>', r'\1', html, flags=re.DOTALL)
    html = re.sub(r'<div[^>]*class="[^"]*wp-block-video[^"]*"[^>]*>(.*?)</div>', r'\1', html, flags=re.DOTALL)
    
    # 3. wp-block-image figure wrappers
    def clean_figure(m):
        tag = m.group(0)
        has_caption = '<figcaption' in tag
        if has_caption:
            # Keep figure but remove wp classes
            tag = re.sub(r'class="[^"]*wp-block-image[^"]*"', '', tag, count=1)
            tag = re.sub(r'<figure\s+>', '<figure>', tag)
            return tag
        else:
            # Extract inner content, remove figure wrapper
            inner = re.search(r'<figure[^>]*>(.*?)</figure>', tag, re.DOTALL)
            return inner.group(1) if inner else tag
    html = re.sub(r'<figure[^>]*class="[^"]*wp-block-image[^"]*"[^>]*>.*?</figure>', clean_figure, html, flags=re.DOTALL)
    
    # 4. Dead <a> wrappers around images pointing to wordpress.com
    def unwrap_dead_link(m):
        img = re.search(r'<img[^>]*>', m.group(0))
        return img.group(0) if img else m.group(0)
    html = re.sub(r'<a[^>]*href="[^"]*katherinemariedotcom\.wordpress\.com[^"]*"[^>]*>\s*<img[^>]*>\s*</a>', unwrap_dead_link, html, flags=re.DOTALL)
    
    # 5. WordPress CSS classes - remove from class attributes
    wp_patterns = r'wp-block-\S*|wp-image-\S*|is-style-\S*|is-type-\S*|is-provider-\S*|aligncenter|alignright|alignleft|alignnone|columns-\d+|size-\w+'
    def clean_classes(m):
        prefix = m.group(1)  # everything before the class value
        classes = m.group(2)
        suffix = m.group(3)  # closing quote and rest
        cleaned = re.sub(wp_patterns, '', classes).strip()
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        if cleaned:
            return f'{prefix}{cleaned}{suffix}'
        return re.sub(r'\s*class=""', '', f'{prefix}{cleaned}{suffix}')
    html = re.sub(r'(\s*class=")([^"]*)(")', clean_classes, html)
    
    # Remove empty class attributes that might remain
    html = re.sub(r'\s*class=""', '', html)
    
    # 6. data-* attributes
    html = re.sub(r'\s*data-(?:id|link|url|width|height)="[^"]*"', '', html)
    
    # 15. wp-block-quote already handled by class removal
    
    # Also clean wp-block-embed__wrapper divs
    html = re.sub(r'<div[^>]*class="[^"]*wp-block-embed__wrapper[^"]*"[^>]*>', '', html)
    
    # 12. Empty paragraphs
    html = re.sub(r'<p>\s*</p>', '', html)
    
    # 17. Empty div wrappers (no class/id) - remove opening/closing tags of empty divs
    # Multiple passes
    for _ in range(5):
        html = re.sub(r'<div>(\s*)</div>', r'\1', html)
        # Div with only whitespace around a single element
        html = re.sub(r'<div>\s*(<(?:img|p|h[1-6]|blockquote|figure|div|ul|ol|video|a)[^>]*>(?:.*?</(?:p|h[1-6]|blockquote|figure|div|ul|ol|video|a)>)?)\s*</div>', r'\1', html, flags=re.DOTALL)
    
    # 13. Multiple spaces → single
    html = re.sub(r'  +', ' ', html)
    
    # Clean excessive newlines
    html = re.sub(r'\n{3,}', '\n\n', html)
    html = html.strip()
    
    return html


def main():
    with open(POSTS_FILE) as f:
        posts = json.load(f)
    
    print(f"Processing {len(posts)} posts...")
    
    total_changes = 0
    changed_posts = []
    
    for post in posts:
        orig = post['content']
        post['content'] = clean_content(orig)
        if post['content'] != orig:
            total_changes += 1
            changed_posts.append(post['slug'])
    
    # Count remaining WP artifacts
    remaining = {'wp_comments': 0, 'wp_classes': 0, 'wp_shortcodes': 0, 'nbsp': 0, 'wordpress_urls': 0, 'data_attrs': 0}
    for p in posts:
        c = p['content']
        remaining['wp_comments'] += len(re.findall(r'<!--\s*/?wp:', c))
        remaining['wp_classes'] += len(re.findall(r'wp-block-|wp-image-', c))
        remaining['wp_shortcodes'] += len(re.findall(r'\[(gallery|caption)', c))
        remaining['nbsp'] += c.count('&nbsp;')
        remaining['wordpress_urls'] += len(re.findall(r'katherinemariedotcom\.wordpress\.com', c))
        remaining['data_attrs'] += len(re.findall(r'data-(id|link|url|width|height)=', c))
    
    # Part 2: Housekeeping
    issues = []
    
    # External URLs in images arrays
    for p in posts:
        for img in p.get('images', []):
            if img.startswith('https://'):
                issues.append(f"  External URL in images: {p['slug']}: {img}")
    
    # Duplicate images
    for p in posts:
        imgs = p.get('images', [])
        seen = set()
        for i in imgs:
            if i in seen:
                issues.append(f"  Duplicate image: {p['slug']}: {i}")
            seen.add(i)
    
    # Empty content
    for p in posts:
        text = re.sub(r'<[^>]+>', '', p['content']).strip()
        if not text:
            issues.append(f"  Empty content: {p['slug']}")
    
    # Missing image files
    missing_imgs = []
    for p in posts:
        for img_match in re.finditer(r'src="(/images/[^"]+)"', p['content']):
            path = img_match.group(1)
            full = PUBLIC_DIR / path.lstrip('/')
            if not full.exists():
                missing_imgs.append(f"  Content img missing: {p['slug']}: {path}")
        for img in p.get('images', []):
            if img.startswith('/images/'):
                full = PUBLIC_DIR / img.lstrip('/')
                if not full.exists():
                    missing_imgs.append(f"  Array img missing: {p['slug']}: {img}")
    
    # Save
    with open(POSTS_FILE, 'w') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
    
    print(f"\n=== CLEANUP SUMMARY ===")
    print(f"  Posts modified: {total_changes}/{len(posts)}")
    
    print(f"\n=== REMAINING WP ARTIFACTS ===")
    for k, v in remaining.items():
        print(f"  {k}: {v}")
    
    print(f"\n=== HOUSEKEEPING ({len(issues)} issues) ===")
    for i in issues[:30]:
        print(i)
    
    print(f"\n=== MISSING IMAGES ({len(missing_imgs)}) ===")
    for m in missing_imgs[:30]:
        print(m)
    if len(missing_imgs) > 30:
        print(f"  ... and {len(missing_imgs)-30} more")
    
    print("\nDone! posts.json saved.")


if __name__ == '__main__':
    main()
