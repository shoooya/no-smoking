import { QuitData, Statistics, Slip } from '@/types';

// 時間差を計算
export function calculateTimeDifference(startDate: string, endDate: Date = new Date()) {
  const start = new Date(startDate);
  const diffMs = endDate.getTime() - start.getTime();

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMinutes,
  };
}

// 統計情報を計算
export function calculateStatistics(
  quitData: QuitData | null,
  slips: Slip[] = []
): Statistics | null {
  if (!quitData) return null;

  const now = new Date();

  // 最後にタバコを吸った時刻（スリップがあればその時刻、なければ禁煙開始時刻）
  const lastCigaretteTime = quitData.lastCigaretteTime || quitData.quitDate;

  // 禁煙開始からの経過時間
  const timeSinceQuit = calculateTimeDifference(quitData.quitDate, now);

  // 最後のタバコからの経過時間
  const timeSinceLastCigarette = calculateTimeDifference(lastCigaretteTime, now);

  // スリップで吸った本数を計算
  const totalSlipCigarettes = slips.reduce((sum, slip) => sum + slip.count, 0);

  // 吸わなかったタバコの本数
  const cigarettesAvoided = Math.max(
    0,
    Math.floor((timeSinceQuit.totalMinutes / 1440) * quitData.cigarettesPerDay) - totalSlipCigarettes
  );

  // 節約した金額
  const pricePerCigarette = quitData.pricePerPack / quitData.cigarettesPerPack;
  const moneySaved = Math.floor(cigarettesAvoided * pricePerCigarette);

  // 取り戻した時間（1本11分として計算）
  const lifeRegained = cigarettesAvoided * 11;

  // 健康回復度（15年で100%）
  const healthScore = Math.min(
    100,
    (timeSinceLastCigarette.totalMinutes / (15 * 365 * 24 * 60)) * 100
  );

  return {
    timeSinceQuit,
    timeSinceLastCigarette,
    moneySaved,
    cigarettesAvoided,
    lifeRegained,
    healthScore,
  };
}

// 健康マイルストーンの達成状況を計算
export function checkMilestoneAchievement(minutes: number, totalMinutes: number): boolean {
  return totalMinutes >= minutes;
}

// バッジの達成状況を計算
export function checkAchievementUnlocked(
  achievement: { minutes?: number; condition?: 'time' | 'money'; threshold?: number },
  totalMinutes: number,
  moneySaved: number
): boolean {
  if (achievement.condition === 'time' && achievement.minutes) {
    return totalMinutes >= achievement.minutes;
  }
  if (achievement.condition === 'money' && achievement.threshold) {
    return moneySaved >= achievement.threshold;
  }
  return false;
}

// 進捗率を計算
export function calculateProgress(current: number, target: number): number {
  return Math.min(100, (current / target) * 100);
}

// 日付をYYYY-MM-DD形式にフォーマット
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// 時間を読みやすい形式にフォーマット
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}分`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}時間`;
  if (minutes < 10080) return `${Math.floor(minutes / 1440)}日`;
  if (minutes < 43200) return `${Math.floor(minutes / 10080)}週間`;
  if (minutes < 525600) return `${Math.floor(minutes / 43200)}ヶ月`;
  return `${Math.floor(minutes / 525600)}年`;
}
