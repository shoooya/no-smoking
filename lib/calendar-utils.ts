import { CalendarDay, Craving, Slip, QuitData } from '@/types';
import { formatDate } from './calculations';

// カレンダーデータを生成
export function generateCalendarData(
  quitData: QuitData | null,
  cravings: Craving[],
  slips: Slip[]
): Record<string, CalendarDay> {
  if (!quitData) return {};

  const calendarData: Record<string, CalendarDay> = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const quitDate = new Date(quitData.quitDate);
  quitDate.setHours(0, 0, 0, 0);

  // 禁煙開始日から今日までの日数を計算
  const daysSinceQuit = Math.floor((today.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.max(daysSinceQuit + 1, 7); // 最低1週間は表示

  // 各日のデータを初期化
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(quitDate);
    currentDate.setDate(quitDate.getDate() + i);
    const dateStr = formatDate(currentDate);

    // その日の渇望回数をカウント
    const dayCravings = cravings.filter((c) => {
      const cravingDate = formatDate(new Date(c.timestamp));
      return cravingDate === dateStr;
    });

    // その日のスリップをチェック
    const daySlips = slips.filter((s) => {
      const slipDate = formatDate(new Date(s.timestamp));
      return slipDate === dateStr;
    });

    // ステータスを決定
    let status: CalendarDay['status'] = 'ongoing';
    if (currentDate > today) {
      status = 'future';
    } else if (daySlips.length > 0) {
      status = 'slip';
    } else if (dayCravings.length > 0) {
      status = 'craving';
    } else {
      status = 'perfect';
    }

    calendarData[dateStr] = {
      date: dateStr,
      status,
      cravingsCount: dayCravings.length,
      slipsCount: daySlips.reduce((sum, s) => sum + s.count, 0),
    };
  }

  return calendarData;
}

// カレンダーの週データを生成
export interface CalendarWeek {
  days: CalendarDay[];
}

export function generateCalendarWeeks(
  quitData: QuitData | null,
  calendarData: Record<string, CalendarDay>
): CalendarWeek[] {
  if (!quitData) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const quitDate = new Date(quitData.quitDate);
  quitDate.setHours(0, 0, 0, 0);

  const daysSinceQuit = Math.floor((today.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.max(daysSinceQuit + 1, 7);
  const weeksCount = Math.ceil(totalDays / 7);

  const weeks: CalendarWeek[] = [];

  for (let week = 0; week < weeksCount; week++) {
    const days: CalendarDay[] = [];

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(quitDate);
      currentDate.setDate(quitDate.getDate() + week * 7 + day);
      const dateStr = formatDate(currentDate);

      // 既存のデータがあればそれを使用、なければデフォルト
      const dayData = calendarData[dateStr] || {
        date: dateStr,
        status: currentDate > today ? 'future' : 'ongoing',
        cravingsCount: 0,
        slipsCount: 0,
      };

      days.push(dayData);
    }

    weeks.push({ days });
  }

  return weeks;
}

// ツールチップの内容を生成
export function generateTooltipContent(
  dayData: CalendarDay,
  quitDate: Date
): string {
  const date = new Date(dayData.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) {
    return `${dayData.date}\n未到達`;
  }

  if (date < quitDate) {
    return `${dayData.date}\n禁煙開始前`;
  }

  const daysDiff = Math.floor((date.getTime() - quitDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  let content = `${dayData.date}\n禁煙${daysDiff}日目`;

  if (dayData.status === 'slip') {
    content += `\n❌ スリップ（${dayData.slipsCount}本）`;
  } else if (dayData.status === 'craving') {
    content += `\n⚠️ 渇望${dayData.cravingsCount}回`;
  } else if (dayData.status === 'perfect') {
    content += '\n✓ 完璧な1日';
  } else {
    content += '\n✓ 禁煙継続中';
  }

  return content;
}
