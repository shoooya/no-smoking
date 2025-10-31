import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { SmokingDataProvider } from '@/contexts/SmokingDataContext';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <AuthProvider>
          <SmokingDataProvider>{children}</SmokingDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
