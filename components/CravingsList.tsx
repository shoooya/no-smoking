'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSmokingData } from '@/contexts/SmokingDataContext';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import { formatDate } from '@/lib/calculations';

export default function CravingsList() {
  const { cravings } = useSmokingData();

  // 統計
  const totalCravings = cravings.length;
  const avgIntensity =
    totalCravings > 0
      ? (cravings.reduce((sum, c) => sum + c.intensity, 0) / totalCravings).toFixed(1)
      : 0;

  // 今日の渇望回数
  const today = formatDate(new Date());
  const todayCravings = cravings.filter((c) => {
    const cravingDate = formatDate(new Date(c.timestamp));
    return cravingDate === today;
  }).length;

  // 最新10件
  const recentCravings = cravings.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>🚬 渇望記録</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 統計 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-800">{totalCravings}</div>
            <div className="text-xs text-orange-600">総渇望回数</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-800">{avgIntensity}</div>
            <div className="text-xs text-orange-600">平均強度</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-800">{todayCravings}</div>
            <div className="text-xs text-orange-600">今日の渇望</div>
          </div>
        </div>

        {/* 記録一覧 */}
        <div className="space-y-3">
          {recentCravings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">まだ渇望記録がありません</p>
            </div>
          ) : (
            <>
              {recentCravings.map((craving) => {
                const date = new Date(craving.timestamp);
                const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: ja });

                return (
                  <div
                    key={craving.id}
                    className="p-4 rounded-lg border border-orange-200 bg-orange-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-muted-foreground">{timeAgo}</span>
                      <span className="font-bold text-orange-800">
                        強度: {craving.intensity}/10
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>状況:</strong> {craving.situation}
                      </div>
                      {craving.trigger && (
                        <div>
                          <strong>トリガー:</strong> {craving.trigger}
                        </div>
                      )}
                      {craving.notes && (
                        <div>
                          <strong>メモ:</strong> {craving.notes}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
