/**
 * Arabic Text Normalization & Search Utilities for Sanad
 */

export const ARABIC_DIACRITICS_REGEX = /[\u064B-\u0652\u0670\u06D6-\u06ED]/g;

export function stripDiacritics(text: string): string {
  if (!text) return '';
  return text.replace(ARABIC_DIACRITICS_REGEX, '');
}

export function normalizeArabicText(text: string): string {
  if (!text) return '';
  
  let normalized = stripDiacritics(text);

  // Normalize Alif forms (أ, إ, آ, ٱ) -> ا
  normalized = normalized.replace(/[أإآٱ]/g, 'ا');
  
  // Normalize Hamza forms (ؤ, ئ) -> ء
  normalized = normalized.replace(/[ؤئ]/g, 'ء');

  // Normalize Alef Maqsura (ى) -> ي
  normalized = normalized.replace(/ى/g, 'ي');

  // Normalize Ta Marbuta (ة) -> ه
  normalized = normalized.replace(/ة/g, 'ه');

  return normalized.trim();
}

export function tokenizeArabic(text: string): string[] {
  const normalized = normalizeArabicText(text);
  return normalized
    .split(/\s+/)
    .filter((token) => token.length > 1);
}
