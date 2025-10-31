// 禁煙設定データ
export interface QuitData {
  quitDate: string; // ISO 8601 format
  cigarettesPerDay: number;
  pricePerPack: number;
  cigarettesPerPack: number;
  lastCigaretteTime?: string; // 最後に吸った時刻（スリップ記録用）
}

// 健康マイルストーン
export interface HealthMilestone {
  minutes: number;
  text: string;
  icon: string;
  achieved?: boolean;
}

// 達成バッジ
export interface Achievement {
  id: string;
  minutes?: number;
  condition?: 'time' | 'money';
  threshold?: number;
  name: string;
  icon: string;
  achieved?: boolean;
  achievedAt?: string;
}

// 渇望記録
export interface Craving {
  id: string;
  timestamp: string;
  intensity: number; // 1-10
  situation: string;
  trigger: string;
  notes?: string;
  overcome?: boolean;
}

// スリップ記録（吸っちゃった記録）
export interface Slip {
  id: string;
  timestamp: string;
  count: number; // 本数
  situation: string;
  trigger: string;
  feelings?: string;
}

// 対処法
export interface CopingStrategy {
  id: string;
  name: string;
  category: '即効性' | '中期対策' | '長期戦略';
  duration: string;
  emoji: string;
  description: string;
  effectiveness: number; // 0-100
  timesUsed: number;
  favorite: boolean;
}

// 禁煙理由
export interface Reason {
  id: string;
  emoji: string;
  text: string;
  category: string;
}

// カレンダーデータ
export interface CalendarDay {
  date: string; // YYYY-MM-DD
  status: 'perfect' | 'craving' | 'slip' | 'ongoing' | 'future';
  cravingsCount: number;
  slipsCount: number;
}

// SOS履歴
export interface SOSRecord {
  id: string;
  timestamp: string;
  overcame: boolean;
  duration?: number; // 秒
}

// 統計データ
export interface Statistics {
  timeSinceQuit: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMinutes: number;
  };
  timeSinceLastCigarette: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMinutes: number;
  };
  moneySaved: number;
  cigarettesAvoided: number;
  lifeRegained: number; // 分
  healthScore: number; // 0-100%
}

// アプリ全体の状態
export interface AppState {
  quitData: QuitData | null;
  cravings: Craving[];
  slips: Slip[];
  copingStrategies: CopingStrategy[];
  reasons: Reason[];
  calendarData: Record<string, CalendarDay>;
  sosHistory: SOSRecord[];
}
