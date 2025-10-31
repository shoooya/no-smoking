import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { SmokingDataProvider } from '@/contexts/SmokingDataContext';

export const metadata: Metadata = {
  title: '禁煙サポート - あなたの健康と未来のために',
  description: 'あなたの健康と未来のために作られた、禁煙継続をサポートするWebアプリケーションです。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        <AuthProvider>
          <SmokingDataProvider>{children}</SmokingDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
