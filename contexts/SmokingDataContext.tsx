'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  QuitData,
  Craving,
  Slip,
  CopingStrategy,
  Reason,
  CalendarDay,
  SOSRecord,
  Statistics,
} from '@/types';
import { calculateStatistics } from '@/lib/calculations';
import { defaultCopingStrategies, defaultReasons } from '@/lib/data/constants';
import {
  getUserSmokingData,
  saveQuitData,
  saveCravings,
  saveSlips,
  saveAllSmokingData,
  deleteUserSmokingData,
  migrateLocalStorageToFirestore,
} from '@/lib/firestore';

interface SmokingDataContextType {
  // Data
  quitData: QuitData | null;
  cravings: Craving[];
  slips: Slip[];
  copingStrategies: CopingStrategy[];
  reasons: Reason[];
  calendarData: Record<string, CalendarDay>;
  sosHistory: SOSRecord[];
  statistics: Statistics | null;

  // Actions
  setQuitData: (data: QuitData) => void;
  addCraving: (craving: Omit<Craving, 'id' | 'timestamp'>) => void;
  addSlip: (slip: Omit<Slip, 'id' | 'timestamp'>) => void;
  addReason: (reason: Omit<Reason, 'id'>) => void;
  removeReason: (id: string) => void;
  toggleStrategyFavorite: (id: string) => void;
  updateStrategyEffectiveness: (id: string, effectiveness: number) => void;
  addSOSRecord: (overcame: boolean, duration?: number) => void;
  resetData: () => void;

  // Loading state
  loading: boolean;
}

const SmokingDataContext = createContext<SmokingDataContextType | undefined>(undefined);

export const useSmokingData = () => {
  const context = useContext(SmokingDataContext);
  if (!context) {
    throw new Error('useSmokingData must be used within SmokingDataProvider');
  }
  return context;
};

export const SmokingDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [firestoreLoaded, setFirestoreLoaded] = useState(false);

  const [quitData, setQuitDataState] = useState<QuitData | null>(null);
  const [cravings, setCravings] = useState<Craving[]>([]);
  const [slips, setSlips] = useState<Slip[]>([]);
  const [copingStrategies, setCopingStrategies] = useState<CopingStrategy[]>(defaultCopingStrategies);
  const [reasons, setReasons] = useState<Reason[]>(defaultReasons);
  const [calendarData, setCalendarData] = useState<Record<string, CalendarDay>>({});
  const [sosHistory, setSOSHistory] = useState<SOSRecord[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  // LocalStorage keys
  const STORAGE_KEY = user ? `smoking-data-${user.uid}` : 'smoking-data-local';

  // 保存のデバウンス用
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load data from Firestore or localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          // ユーザーがログインしている場合、Firestoreから読み込む
          console.log('Loading data from Firestore...');
          const firestoreData = await getUserSmokingData(user.uid);

          // LocalStorageからの移行処理
          const localStorageData = localStorage.getItem(STORAGE_KEY);
          if (localStorageData && !firestoreData.quitData) {
            console.log('Migrating data from LocalStorage to Firestore...');
            const localData = JSON.parse(localStorageData);
            await migrateLocalStorageToFirestore(user.uid, {
              quitData: localData.quitData || null,
              cravings: localData.cravings || [],
              slips: localData.slips || [],
            });
            // 移行後、再度Firestoreから読み込む
            const migratedData = await getUserSmokingData(user.uid);
            setQuitDataState(migratedData.quitData);
            setCravings(migratedData.cravings);
            setSlips(migratedData.slips);
          } else {
            // Firestoreのデータをセット
            setQuitDataState(firestoreData.quitData);
            setCravings(firestoreData.cravings);
            setSlips(firestoreData.slips);
          }

          // copingStrategies, reasons, calendarData, sosHistoryはLocalStorageから
          if (localStorageData) {
            const localData = JSON.parse(localStorageData);
            setCopingStrategies(localData.copingStrategies || defaultCopingStrategies);
            setReasons(localData.reasons || defaultReasons);
            setCalendarData(localData.calendarData || {});
            setSOSHistory(localData.sosHistory || []);
          }

          setFirestoreLoaded(true);
        } else {
          // ログインしていない場合はLocalStorageから読み込む
          console.log('Loading data from LocalStorage...');
          const storedData = localStorage.getItem(STORAGE_KEY);
          if (storedData) {
            const data = JSON.parse(storedData);
            setQuitDataState(data.quitData || null);
            setCravings(data.cravings || []);
            setSlips(data.slips || []);
            setCopingStrategies(data.copingStrategies || defaultCopingStrategies);
            setReasons(data.reasons || defaultReasons);
            setCalendarData(data.calendarData || {});
            setSOSHistory(data.sosHistory || []);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, STORAGE_KEY]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      const data = {
        quitData,
        cravings,
        slips,
        copingStrategies,
        reasons,
        calendarData,
        sosHistory,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [quitData, cravings, slips, copingStrategies, reasons, calendarData, sosHistory, loading, STORAGE_KEY]);

  // Save core data to Firestore (debounced)
  useEffect(() => {
    if (!loading && user && firestoreLoaded) {
      // デバウンス: 1秒後に保存
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          console.log('Saving data to Firestore...');
          await saveAllSmokingData(user.uid, {
            quitData,
            cravings,
            slips,
          });
          console.log('Data saved to Firestore successfully');
        } catch (error) {
          console.error('Error saving data to Firestore:', error);
        }
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [quitData, cravings, slips, loading, user, firestoreLoaded]);

  // Calculate statistics whenever relevant data changes
  useEffect(() => {
    const stats = calculateStatistics(quitData, slips);
    setStatistics(stats);
  }, [quitData, slips]);

  // Actions
  const setQuitData = (data: QuitData) => {
    setQuitDataState(data);
  };

  const addCraving = (craving: Omit<Craving, 'id' | 'timestamp'>) => {
    const newCraving: Craving = {
      ...craving,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setCravings((prev) => [newCraving, ...prev]);
  };

  const addSlip = (slip: Omit<Slip, 'id' | 'timestamp'>) => {
    const newSlip: Slip = {
      ...slip,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setSlips((prev) => [newSlip, ...prev]);

    // Update lastCigaretteTime in quitData
    if (quitData) {
      setQuitDataState({
        ...quitData,
        lastCigaretteTime: newSlip.timestamp,
      });
    }
  };

  const addReason = (reason: Omit<Reason, 'id'>) => {
    const newReason: Reason = {
      ...reason,
      id: Date.now().toString(),
    };
    setReasons((prev) => [...prev, newReason]);
  };

  const removeReason = (id: string) => {
    setReasons((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleStrategyFavorite = (id: string) => {
    setCopingStrategies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s))
    );
  };

  const updateStrategyEffectiveness = (id: string, effectiveness: number) => {
    setCopingStrategies((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, effectiveness, timesUsed: s.timesUsed + 1 }
          : s
      )
    );
  };

  const addSOSRecord = (overcame: boolean, duration?: number) => {
    const newRecord: SOSRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      overcame,
      duration,
    };
    setSOSHistory((prev) => [newRecord, ...prev]);
  };

  const resetData = async () => {
    if (confirm('本当にすべてのデータをリセットしますか？この操作は取り消せません。')) {
      setQuitDataState(null);
      setCravings([]);
      setSlips([]);
      setCopingStrategies(defaultCopingStrategies);
      setReasons(defaultReasons);
      setCalendarData({});
      setSOSHistory([]);
      localStorage.removeItem(STORAGE_KEY);

      // Firestoreのデータも削除
      if (user) {
        try {
          await deleteUserSmokingData(user.uid);
          console.log('Firestore data deleted successfully');
        } catch (error) {
          console.error('Error deleting Firestore data:', error);
        }
      }
    }
  };

  const value = {
    quitData,
    cravings,
    slips,
    copingStrategies,
    reasons,
    calendarData,
    sosHistory,
    statistics,
    setQuitData,
    addCraving,
    addSlip,
    addReason,
    removeReason,
    toggleStrategyFavorite,
    updateStrategyEffectiveness,
    addSOSRecord,
    resetData,
    loading,
  };

  return (
    <SmokingDataContext.Provider value={value}>
      {children}
    </SmokingDataContext.Provider>
  );
};
