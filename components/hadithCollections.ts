export interface HadithCollection {
  id: string;
  name: string;
  author: string;
  total: number;
}

export const HADITH_COLLECTIONS: HadithCollection[] = [
  { id: 'bukhari', name: 'صحيح البخاري', author: 'الإمام البخاري', total: 7563 },
  { id: 'muslim', name: 'صحيح مسلم', author: 'الإمام مسلم', total: 7500 },
  { id: 'abudawud', name: 'سنن أبي داود', author: 'الإمام أبو داود', total: 5274 },
  { id: 'tirmidhi', name: 'جامع الترمذي', author: 'الإمام الترمذي', total: 3956 },
  { id: 'nasai', name: 'سنن النسائي', author: 'الإمام النسائي', total: 5758 },
  { id: 'ibnmajah', name: 'سنن ابن ماجه', author: 'الإمام ابن ماجه', total: 4341 },
  { id: 'malik', name: 'موطأ مالك', author: 'الإمام مالك بن أنس', total: 1858 },
  { id: 'ahmad', name: 'مسند أحمد', author: 'الإمام أحمد بن حنبل', total: 27647 }
];
