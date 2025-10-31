'use client';

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSmokingData } from '@/contexts/SmokingDataContext';
import { generateCalendarData, generateCalendarWeeks, generateTooltipContent } from '@/lib/calendar-utils';
import { cn } from '@/lib/utils';
import { CalendarDay } from '@/types';

export default function SmokingCalendar() {
  const { quitData, cravings, slips } = useSmokingData();
  const [hoveredDay, setHoveredDay] = useState<{ day: CalendarDay; x: number; y: number } | null>(
    null
  );

  // カレンダーデータを生成
  const calendarData = useMemo(() => {
    return generateCalendarData(quitData, cravings, slips);
  }, [quitData, cravings, slips]);

  // 週データを生成
  const weeks = useMemo(() => {
    return generateCalendarWeeks(quitData, calendarData);
  }, [quitData, calendarData]);

  if (!quitData) return null;

  const quitDate = new Date(quitData.quitDate);

  // 日付のスタイルを取得
  const getDayStyle = (status: CalendarDay['status']) => {
    switch (status) {
      case 'perfect':
        return 'bg-green-500 hover:bg-green-600';
      case 'ongoing':
        return 'bg-green-300 hover:bg-green-400';
      case 'craving':
        return 'bg-yellow-400 hover:bg-yellow-500';
      case 'slip':
        return 'bg-red-500 hover:bg-red-600';
      case 'future':
        return 'bg-gray-100 border border-dashed border-gray-300';
      default:
        return 'bg-gray-200';
    }
  };

  const handleMouseEnter = (day: CalendarDay, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredDay({
      day,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 5,
    });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📅 禁煙継続カレンダー</CardTitle>
      </CardHeader>
      <CardContent>
        {/* カレンダーグリッド */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    'w-5 h-5 rounded-sm cursor-pointer transition-all',
                    getDayStyle(day.status)
                  )}
                  onMouseEnter={(e) => handleMouseEnter(day, e)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </div>
          ))}
        </div>

        {/* 凡例 */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-dashed border-gray-300 rounded-sm" />
            <span>未到達</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 rounded-sm" />
            <span>継続中</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-sm" />
            <span>完璧な1日</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
            <span>渇望あり</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-sm" />
            <span>スリップ</span>
          </div>
        </div>

        {/* ツールチップ */}
        {hoveredDay && (
          <div
            className="fixed z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-md shadow-lg pointer-events-none whitespace-pre-line"
            style={{
              left: `${hoveredDay.x}px`,
              top: `${hoveredDay.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {generateTooltipContent(hoveredDay.day, quitDate)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
