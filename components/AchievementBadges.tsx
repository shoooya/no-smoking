'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSmokingData } from '@/contexts/SmokingDataContext';
import { achievements } from '@/lib/data/constants';
import { checkAchievementUnlocked } from '@/lib/calculations';
import { cn } from '@/lib/utils';

export default function AchievementBadges() {
  const { statistics } = useSmokingData();

  if (!statistics) return null;

  const totalMinutes = statistics.timeSinceLastCigarette.totalMinutes;
  const moneySaved = statistics.moneySaved;

  return (
    <Card>
      <CardHeader>
        <CardTitle>達成バッジ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {achievements.map((achievement) => {
            const unlocked = checkAchievementUnlocked(
              achievement,
              totalMinutes,
              moneySaved
            );

            return (
              <div
                key={achievement.id}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all',
                  unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-md'
                    : 'bg-gray-50 border-gray-200 opacity-50 grayscale'
                )}
                title={achievement.name}
              >
                <div className="text-3xl mb-1">{achievement.icon}</div>
                <div className="text-xs text-center font-medium">{achievement.name}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
