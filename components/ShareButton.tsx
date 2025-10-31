'use client';

import { useState } from 'react';
import { useSmokingData } from '@/contexts/SmokingDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, ExternalLink, X } from 'lucide-react';

export default function ShareButton() {
  const { sharingEnabled, shareId, enableSharing, disableSharing } = useSmokingData();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const shareUrl = shareId ? `${window.location.origin}/share/${shareId}` : '';

  const handleEnableSharing = async () => {
    try {
      setLoading(true);
      await enableSharing();
    } catch (error) {
      console.error('Error enabling sharing:', error);
      alert('シェアリングの有効化に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableSharing = async () => {
    if (!confirm('本当にシェアリングを無効化しますか？')) return;

    try {
      setLoading(true);
      await disableSharing();
    } catch (error) {
      console.error('Error disabling sharing:', error);
      alert('シェアリングの無効化に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleOpenShare = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          禁煙記録をシェア
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!sharingEnabled ? (
          <>
            <p className="text-sm text-muted-foreground">
              あなたの禁煙の成果を友達や家族とシェアしませんか？
              シェアリンクを生成すると、誰でもあなたの禁煙記録を見ることができます。
            </p>
            <Button
              onClick={handleEnableSharing}
              disabled={loading}
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              シェアリンクを生成
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">シェアリンクが生成されました！</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-white rounded-md p-2 text-sm border border-indigo-200 truncate">
                  {shareUrl}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyUrl}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      コピーしました
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      URLをコピー
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleOpenShare}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  プレビュー
                </Button>
              </div>
            </div>
            <Button
              onClick={handleDisableSharing}
              variant="outline"
              size="sm"
              disabled={loading}
              className="w-full text-destructive hover:text-destructive"
            >
              <X className="mr-2 h-4 w-4" />
              シェアリングを無効化
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
