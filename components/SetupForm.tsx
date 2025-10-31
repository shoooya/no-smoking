'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSmokingData } from '@/contexts/SmokingDataContext';
import { QuitData } from '@/types';

export default function SetupForm() {
  const { setQuitData } = useSmokingData();
  const [formData, setFormData] = useState({
    quitDate: new Date().toISOString().slice(0, 16),
    cigarettesPerDay: 20,
    pricePerPack: 600,
    cigarettesPerPack: 20,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quitData: QuitData = {
      quitDate: new Date(formData.quitDate).toISOString(),
      cigarettesPerDay: formData.cigarettesPerDay,
      pricePerPack: formData.pricePerPack,
      cigarettesPerPack: formData.cigarettesPerPack,
    };

    setQuitData(quitData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">🚭 禁煙を始めましょう！</CardTitle>
          <CardDescription>
            あなたの禁煙の旅を始めるために、以下の情報を入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quitDate">禁煙開始日時</Label>
              <Input
                id="quitDate"
                type="datetime-local"
                value={formData.quitDate}
                onChange={(e) => setFormData({ ...formData, quitDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cigarettesPerDay">1日あたりの喫煙本数</Label>
              <Input
                id="cigarettesPerDay"
                type="number"
                min="1"
                value={formData.cigarettesPerDay}
                onChange={(e) =>
                  setFormData({ ...formData, cigarettesPerDay: parseInt(e.target.value) })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerPack">1箱の価格（円）</Label>
              <Input
                id="pricePerPack"
                type="number"
                min="1"
                value={formData.pricePerPack}
                onChange={(e) =>
                  setFormData({ ...formData, pricePerPack: parseInt(e.target.value) })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cigarettesPerPack">1箱あたりの本数</Label>
              <Input
                id="cigarettesPerPack"
                type="number"
                min="1"
                value={formData.cigarettesPerPack}
                onChange={(e) =>
                  setFormData({ ...formData, cigarettesPerPack: parseInt(e.target.value) })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full">
              禁煙を開始する
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
