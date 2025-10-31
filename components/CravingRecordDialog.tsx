'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSmokingData } from '@/contexts/SmokingDataContext';

interface CravingRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const situations = ['仕事中', '食後', '飲酒時', 'ストレス', 'その他'];

export default function CravingRecordDialog({ open, onOpenChange }: CravingRecordDialogProps) {
  const { addCraving } = useSmokingData();
  const [intensity, setIntensity] = useState(5);
  const [situation, setSituation] = useState('仕事中');
  const [trigger, setTrigger] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addCraving({
      intensity,
      situation,
      trigger,
      notes,
    });

    // Reset form
    setIntensity(5);
    setSituation('仕事中');
    setTrigger('');
    setNotes('');

    // Show encouragement message
    alert('渇望を記録しました。深呼吸をして、水を飲みましょう。この感覚は必ず消えます。');

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>🚬 渇望を記録</DialogTitle>
          <DialogDescription>
            渇望を記録することで、パターンを理解し、対策を立てられます。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 強度スライダー */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>渇望の強さ（1-10）</Label>
              <span className="text-2xl font-bold text-primary">{intensity}</span>
            </div>
            <Slider
              value={[intensity]}
              onValueChange={(value) => setIntensity(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>弱い</span>
              <span>強い</span>
            </div>
          </div>

          {/* 状況 */}
          <div className="space-y-2">
            <Label>状況</Label>
            <div className="grid grid-cols-2 gap-2">
              {situations.map((sit) => (
                <label
                  key={sit}
                  className={`flex items-center justify-center p-2 rounded-md border-2 cursor-pointer transition-colors ${
                    situation === sit
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="situation"
                    value={sit}
                    checked={situation === sit}
                    onChange={(e) => setSituation(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm">{sit}</span>
                </label>
              ))}
            </div>
          </div>

          {/* トリガー */}
          <div className="space-y-2">
            <Label htmlFor="trigger">トリガー</Label>
            <Input
              id="trigger"
              placeholder="何がきっかけですか？"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
            />
          </div>

          {/* メモ */}
          <div className="space-y-2">
            <Label htmlFor="notes">メモ（任意）</Label>
            <Input
              id="notes"
              placeholder="気持ちや状況を記録..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            記録する
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
