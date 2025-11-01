'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSharedData } from '@/lib/firestore';
import { UserSmokingData } from '@/lib/firestore';
import { calculateStatistics } from '@/lib/calculations';
import { Statistics } from '@/types';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SharePage() {
  const params = useParams();
  const shareIdParam = params?.shareId;
  const shareId = Array.isArray(shareIdParam) ? shareIdParam[0] : shareIdParam;

  const [data, setData] = useState<UserSmokingData | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareId) {
      setError('共有IDが指定されていません。');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching shared data for shareId:', shareId);
        const sharedData = await getSharedData(shareId);

        if (!sharedData) {
          setError('共有データが見つかりませんでした。URLが正しいか確認してください。');
          return;
        }

        console.log('Shared data loaded:', sharedData);
        setData(sharedData);
        const stats = calculateStatistics(sharedData.quitData, sharedData.slips);
        setStatistics(stats);
      } catch (err) {
        console.error('Error fetching shared data:', err);
        setError(`データの取得中にエラーが発生しました: ${err instanceof Error ? err.message : '不明なエラー'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shareId]);

  // リアルタイム更新
  useEffect(() => {
    if (!data) return;

    const interval = setInterval(() => {
      const stats = calculateStatistics(data.quitData, data.slips);
      setStatistics(stats);
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data || !statistics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">エラー</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error || 'データが見つかりませんでした。'}</p>
            <Link href="/">
              <Button>ホームに戻る</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { timeSinceQuit, moneySaved, cigarettesAvoided, lifeRegained, healthScore } = statistics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold">禁煙記録シェア</h1>
            <p className="text-sm text-muted-foreground">誰かの禁煙記録を見ています</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* タイマー */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center">禁煙継続時間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{timeSinceQuit.days}</div>
                <div className="text-sm text-muted-foreground">日</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{timeSinceQuit.hours}</div>
                <div className="text-sm text-muted-foreground">時間</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{timeSinceQuit.minutes}</div>
                <div className="text-sm text-muted-foreground">分</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{timeSinceQuit.seconds}</div>
                <div className="text-sm text-muted-foreground">秒</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">節約金額</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">¥{moneySaved.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">タバコを買わなかった金額</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">吸わなかったタバコ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{Math.floor(cigarettesAvoided)}本</div>
              <p className="text-xs text-muted-foreground mt-1">禁煙で避けられた本数</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">取り戻した時間</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{Math.floor(lifeRegained / 60)}時間</div>
              <p className="text-xs text-muted-foreground mt-1">約{Math.floor(lifeRegained / 1440)}日分の寿命</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-red-50 border-rose-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">健康回復度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-rose-600">{healthScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">15年で100%に到達</p>
            </CardContent>
          </Card>
        </div>

        {/* 応援メッセージ */}
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium text-indigo-900">
              素晴らしい成果です！継続は力なり！
            </p>
          </CardContent>
        </Card>

        {/* アプリへのリンク */}
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">あなたも禁煙を始めませんか？</p>
            <Link href="/">
              <Button size="lg">禁煙アプリを始める</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
