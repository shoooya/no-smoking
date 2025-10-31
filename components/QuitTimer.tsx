'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSmokingData } from '@/contexts/SmokingDataContext';
import { calculateTimeDifference } from '@/lib/calculations';
import { Clock } from 'lucide-react';

export default function QuitTimer() {
  const { quitData, statistics } = useSmokingData();
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [startTime, setStartTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!quitData) return;

    const updateTimer = () => {
      // 最後のタバコからの経過時間
      const lastCigaretteTime = quitData.lastCigaretteTime || quitData.quitDate;
      const timeSinceLastCigarette = calculateTimeDifference(lastCigaretteTime);
      setTime(timeSinceLastCigarette);

      // 禁煙開始からの経過時間
      const timeSinceQuit = calculateTimeDifference(quitData.quitDate);
      setStartTime(timeSinceQuit);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [quitData]);

  if (!quitData) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <CardTitle>最後に吸ってからの経過時間</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { value: time.days, label: '日' },
            { value: time.hours, label: '時間' },
            { value: time.minutes, label: '分' },
            { value: time.seconds, label: '秒' },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-4xl font-bold text-primary">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        {/* 開始からの経過時間（小さめ表示） */}
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">禁煙開始からの経過:</div>
          <div className="flex gap-4 text-sm">
            <span>
              <span className="font-semibold">{startTime.days}</span>日
            </span>
            <span>
              <span className="font-semibold">{startTime.hours}</span>時間
            </span>
            <span>
              <span className="font-semibold">{startTime.minutes}</span>分
            </span>
            <span>
              <span className="font-semibold">{startTime.seconds}</span>秒
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
