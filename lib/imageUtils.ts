export function sanitizeImageUrl(url?: string | null): string {
  const placeholder = 'https://via.placeholder.com/400x250?text=Image';
  if (!url || typeof url !== 'string') return placeholder;

  // Trim spaces
  let cleaned = url.trim();

  // Fix common typos
  cleaned = cleaned.replace('i.ibb.co.com', 'i.ibb.co');

  // If protocol-relative, add https
  if (cleaned.startsWith('//')) cleaned = 'https:' + cleaned;

  // If it's a data URL or blob, keep as is
  if (cleaned.startsWith('data:') || cleaned.startsWith('blob:')) return cleaned;

  // Basic validation
  try {
    // Will throw if invalid
    const u = new URL(cleaned);
    return u.toString();
  } catch {
    return placeholder;
  }
}

export function safeNextImageSrc(url?: string | null): string {
  return sanitizeImageUrl(url);
}
