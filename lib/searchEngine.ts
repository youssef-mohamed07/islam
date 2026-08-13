import { normalizeArabicText } from './arabic';
import { UnifiedSearchResult } from './types';

export interface SearchableEntity {
  id: string;
  type: 'quran' | 'tafsir' | 'hadith' | 'book' | 'adhkar' | 'fiqh' | 'seerah' | 'scholar';
  typeArabic: string;
  title: string;
  subtitle?: string;
  textToSearch: string;
  snippet: string;
  sourceName: string;
  url: string;
  badgeColor?: string;
}

export class SanadSearchEngine {
  private items: SearchableEntity[] = [];

  constructor(initialItems: SearchableEntity[] = []) {
    this.items = initialItems;
  }

  public setIndex(items: SearchableEntity[]): void {
    this.items = items;
  }

  public search(query: string, categoryFilter?: string): UnifiedSearchResult[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const normalizedQuery = normalizeArabicText(query);
    const queryTokens = normalizedQuery.split(/\s+/).filter(t => t.length > 0);

    const matches = this.items.filter((item) => {
      if (categoryFilter && categoryFilter !== 'all' && item.type !== categoryFilter) {
        return false;
      }

      const normalizedTitle = normalizeArabicText(item.title);
      const normalizedContent = normalizeArabicText(item.textToSearch);
      const combinedText = `${normalizedTitle} ${normalizedContent}`;

      return queryTokens.every((token) => combinedText.includes(token));
    });

    return matches.map((item) => {
      const normalizedTitle = normalizeArabicText(item.title);
      const isTitleMatch = queryTokens.some(t => normalizedTitle.includes(t));
      
      return {
        id: item.id,
        type: item.type,
        typeArabic: item.typeArabic,
        title: item.title,
        subtitle: item.subtitle,
        snippet: item.snippet,
        sourceName: item.sourceName,
        url: item.url,
        badgeColor: item.badgeColor,
        relevanceScore: isTitleMatch ? 2 : 1
      };
    }).sort((a, b) => (b.relevanceScore || 1) - (a.relevanceScore || 1));
  }
}
