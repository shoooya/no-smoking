'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSmokingData } from '@/contexts/SmokingDataContext';
import { healthMilestones } from '@/lib/data/constants';
import { checkMilestoneAchievement, formatDuration } from '@/lib/calculations';
import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HealthMilestones() {
  const { statistics } = useSmokingData();

  if (!statistics) return null;

  const totalMinutes = statistics.timeSinceLastCigarette.totalMinutes;

  return (
    <Card>
      <CardHeader>
        <CardTitle>健康マイルストーン</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthMilestones.map((milestone, index) => {
            const achieved = checkMilestoneAchievement(milestone.minutes, totalMinutes);

            return (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg transition-colors',
                  achieved ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                )}
              >
                <div className="text-2xl flex-shrink-0">{milestone.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {formatDuration(milestone.minutes)}後
                    </span>
                    {achieved ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <p
                    className={cn(
                      'text-sm',
                      achieved ? 'text-green-900' : 'text-gray-600'
                    )}
                  >
                    {milestone.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
