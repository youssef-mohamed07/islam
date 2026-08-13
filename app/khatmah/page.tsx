import React from 'react';
import { KhatmahPlanner } from '@/components/KhatmahPlanner';

export const metadata = {
  title: 'مخطط الختمات | سَنَد',
  description: 'خطط لختمة القرآن الكريم، فردياً أو بمشاركة عائلتك.',
};

export default function KhatmahPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0D1412] pt-6 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <KhatmahPlanner />
      </div>
    </div>
  );
}
