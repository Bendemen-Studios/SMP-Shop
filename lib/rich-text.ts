const allowedTags = new Set(['p','br','strong','b','em','i','u','h1','h2','h3','h4','h5','h6','ul','ol','li','blockquote','code']);

/** Keep useful Tip4Serv product formatting while removing scripts, styles and unsafe attributes. */
export function sanitizeRichText(value?: string) {
 if (!value) return '';
 return value
  .replace(/<!--[\s\S]*?-->/g,'')
  .replace(/<\/?([a-z0-9]+)(?:\s[^>]*)?>/gi,(full, rawTag) => {
   const tag=String(rawTag).toLowerCase();
   if (!allowedTags.has(tag)) return '';
   return full.startsWith('</') ? `</${tag}>` : `<${tag}>`;
  })
  .replace(/javascript\s*:/gi,'')
  .replace(/on[a-z]+\s*=\s*(['"]).*?\1/gi,'')
  .replace(/\s+/g,' ')
  .trim();
}

export function plainText(value?: string) {
 return sanitizeRichText(value).replace(/<br\s*\/?>(?=.)/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
}