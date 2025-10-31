'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';
import AuthButton from '@/components/AuthButton';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🚭 禁煙サポート</h1>
            <p className="text-sm text-gray-600">あなたの健康と未来のために</p>
          </div>
          <AuthButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">ようこそ、{user.displayName}さん！</h2>
          <p className="text-gray-600 mb-4">
            禁煙サポートアプリへようこそ。ここでは、あなたの禁煙の進捗を記録し、目標達成をサポートします。
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📝 次のステップ</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>禁煙開始日時を設定しましょう</li>
              <li>1日の喫煙本数を記録しましょう</li>
              <li>禁煙の理由を書き留めましょう</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-green-800">¥0</div>
              <div className="text-sm text-green-600">節約した金額</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="text-3xl mb-2">🚬</div>
              <div className="text-2xl font-bold text-blue-800">0</div>
              <div className="text-sm text-blue-600">吸わなかったタバコ</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-purple-800">0日</div>
              <div className="text-sm text-purple-600">禁煙継続日数</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
