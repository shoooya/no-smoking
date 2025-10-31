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

interface SlipRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const situations = ['仕事中', '食後', '飲酒時', 'ストレス', 'その他'];

export default function SlipRecordDialog({ open, onOpenChange }: SlipRecordDialogProps) {
  const { addSlip } = useSmokingData();
  const [count, setCount] = useState(1);
  const [situation, setSituation] = useState('仕事中');
  const [trigger, setTrigger] = useState('');
  const [feelings, setFeelings] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addSlip({
      count,
      situation,
      trigger,
      feelings,
    });

    // Reset form
    setCount(1);
    setSituation('仕事中');
    setTrigger('');
    setFeelings('');

    // Show encouragement message
    alert('記録しました。大丈夫、これは失敗ではなく学びです。また今から始めましょう！');

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>💔 吸っちゃった記録</DialogTitle>
          <DialogDescription>
            正直に記録することで、パターンを理解できます。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 本数スライダー */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>本数</Label>
              <span className="text-2xl font-bold text-primary">{count}</span>
            </div>
            <Slider
              value={[count]}
              onValueChange={(value) => setCount(value[0])}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
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
            <Label htmlFor="trigger">何がきっかけでしたか？</Label>
            <Input
              id="trigger"
              placeholder="例：飲み会で周りの人が吸っていた"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
            />
          </div>

          {/* 気持ち */}
          <div className="space-y-2">
            <Label htmlFor="feelings">気持ち（任意）</Label>
            <Input
              id="feelings"
              placeholder="今の気持ちを記録..."
              value={feelings}
              onChange={(e) => setFeelings(e.target.value)}
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
