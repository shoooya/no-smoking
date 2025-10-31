'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSmokingData } from '@/contexts/SmokingDataContext';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function SlipsList() {
  const { slips } = useSmokingData();

  // 統計
  const totalSlips = slips.length;
  const totalCigarettes = slips.reduce((sum, s) => sum + s.count, 0);

  // 最新10件
  const recentSlips = slips.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>💔 吸っちゃった記録</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 統計 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-3xl font-bold text-red-800">{totalSlips}</div>
            <div className="text-sm text-red-600">総記録回数</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-3xl font-bold text-red-800">{totalCigarettes}</div>
            <div className="text-sm text-red-600">総本数</div>
          </div>
        </div>

        {/* 記録一覧 */}
        <div className="space-y-3">
          {recentSlips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">記録がありません。素晴らしい！</p>
            </div>
          ) : (
            <>
              {recentSlips.map((slip) => {
                const date = new Date(slip.timestamp);
                const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: ja });

                return (
                  <div
                    key={slip.id}
                    className="p-4 rounded-lg border border-red-200 bg-red-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-muted-foreground">{timeAgo}</span>
                      <span className="font-bold text-red-800">{slip.count}本</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>状況:</strong> {slip.situation}
                      </div>
                      {slip.trigger && (
                        <div>
                          <strong>きっかけ:</strong> {slip.trigger}
                        </div>
                      )}
                      {slip.feelings && (
                        <div>
                          <strong>気持ち:</strong> {slip.feelings}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* 励ましメッセージ */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  過去は変えられませんが、未来は変えられます。一度の失敗で全てが無駄になるわけではありません。今この瞬間から、また禁煙を続けましょう！
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
