'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSmokingData } from '@/contexts/SmokingDataContext';
import { Wallet, Cigarette, Clock, Heart } from 'lucide-react';

export default function StatisticsCards() {
  const { statistics } = useSmokingData();

  if (!statistics) return null;

  const stats = [
    {
      title: '節約した金額',
      value: `¥${statistics.moneySaved.toLocaleString()}`,
      description: 'タバコを買わずに節約',
      icon: Wallet,
      gradient: 'from-green-50 to-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-900',
      descColor: 'text-green-600',
    },
    {
      title: '吸わなかったタバコ',
      value: statistics.cigarettesAvoided.toLocaleString(),
      description: '本のタバコを避けました',
      icon: Cigarette,
      gradient: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      descColor: 'text-blue-600',
    },
    {
      title: '取り戻した時間',
      value: `${statistics.lifeRegained.toLocaleString()}`,
      description: '分の寿命を取り戻しました',
      icon: Clock,
      gradient: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900',
      descColor: 'text-purple-600',
    },
    {
      title: '健康回復度',
      value: `${statistics.healthScore.toFixed(1)}%`,
      description: '15年で100%回復します',
      icon: Heart,
      gradient: 'from-red-50 to-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      descColor: 'text-red-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`bg-gradient-to-br ${stat.gradient} border-opacity-50`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
            <p className={`text-xs ${stat.descColor} mt-1`}>{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
