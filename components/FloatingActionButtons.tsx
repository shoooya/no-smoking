'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Cigarette } from 'lucide-react';
import SlipRecordDialog from './SlipRecordDialog';
import CravingRecordDialog from './CravingRecordDialog';

export default function FloatingActionButtons() {
  const [slipDialogOpen, setSlipDialogOpen] = useState(false);
  const [cravingDialogOpen, setCravingDialogOpen] = useState(false);

  return (
    <>
      {/* FABボタン群 */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* 渇望記録ボタン */}
        <Button
          size="lg"
          onClick={() => setCravingDialogOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          title="吸いたくなった"
        >
          <Cigarette className="h-6 w-6" />
        </Button>

        {/* スリップ記録ボタン */}
        <Button
          size="lg"
          onClick={() => setSlipDialogOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
          title="吸っちゃった"
        >
          <Heart className="h-6 w-6 fill-current" />
        </Button>
      </div>

      {/* ダイアログ */}
      <SlipRecordDialog open={slipDialogOpen} onOpenChange={setSlipDialogOpen} />
      <CravingRecordDialog open={cravingDialogOpen} onOpenChange={setCravingDialogOpen} />
    </>
  );
}
