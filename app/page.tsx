'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSmokingData } from '@/contexts/SmokingDataContext';
import LoginPage from '@/components/LoginPage';
import SetupForm from '@/components/SetupForm';
import AuthButton from '@/components/AuthButton';
import QuitTimer from '@/components/QuitTimer';
import StatisticsCards from '@/components/StatisticsCards';
import HealthMilestones from '@/components/HealthMilestones';
import AchievementBadges from '@/components/AchievementBadges';
import SlipsList from '@/components/SlipsList';
import CravingsList from '@/components/CravingsList';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import SmokingCalendar from '@/components/SmokingCalendar';
import ShareButton from '@/components/ShareButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { motivationMessages } from '@/lib/data/constants';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { quitData, loading: dataLoading, resetData } = useSmokingData();
  const [motivationMessage, setMotivationMessage] = useState('');

  useEffect(() => {
    // ランダムなモチベーションメッセージを表示
    const randomIndex = Math.floor(Math.random() * motivationMessages.length);
    setMotivationMessage(motivationMessages[randomIndex]);
  }, []);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // ユーザーがログインしていない場合
  if (!user) {
    return <LoginPage />;
  }

  // 禁煙データが設定されていない場合
  if (!quitData) {
    return <SetupForm />;
  }

  // ダッシュボード表示
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🚭 禁煙サポート</h1>
            <p className="text-sm text-muted-foreground">あなたの健康と未来のために</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* タイマー */}
        <QuitTimer />

        {/* 統計カード */}
        <StatisticsCards />

        {/* モチベーションメッセージ */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg">💪 今日のメッセージ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-900">{motivationMessage}</p>
          </CardContent>
        </Card>

        {/* 健康マイルストーン */}
        <HealthMilestones />

        {/* 達成バッジ */}
        <AchievementBadges />

        {/* シェアボタン */}
        <ShareButton />

        {/* 禁煙カレンダー */}
        <SmokingCalendar />

        {/* 渇望記録一覧 */}
        <CravingsList />

        {/* スリップ記録一覧 */}
        <SlipsList />

        {/* リセットボタン */}
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={resetData}
            className="text-destructive hover:text-destructive"
          >
            データをリセット
          </Button>
        </div>
      </main>

      {/* FABボタン */}
      <FloatingActionButtons />
    </div>
  );
}
