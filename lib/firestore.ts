import { db } from './firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { QuitData, Craving, Slip } from '@/types';

/**
 * Firestore データ構造:
 * users/{userId}/
 *   - quitData: QuitData
 *   - cravings: Craving[]
 *   - slips: Slip[]
 */

export interface UserSmokingData {
  quitData: QuitData | null;
  cravings: Craving[];
  slips: Slip[];
}

/**
 * ユーザーの禁煙データを取得
 */
export async function getUserSmokingData(userId: string): Promise<UserSmokingData> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        quitData: data.quitData || null,
        cravings: data.cravings || [],
        slips: data.slips || [],
      };
    }

    // データが存在しない場合は空のデータを返す
    return {
      quitData: null,
      cravings: [],
      slips: [],
    };
  } catch (error) {
    console.error('Error fetching user smoking data:', error);
    throw error;
  }
}

/**
 * 禁煙データを保存
 */
export async function saveQuitData(userId: string, quitData: QuitData): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        quitData,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving quit data:', error);
    throw error;
  }
}

/**
 * 渇望記録を保存
 */
export async function saveCravings(userId: string, cravings: Craving[]): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        cravings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving cravings:', error);
    throw error;
  }
}

/**
 * スリップ記録を保存
 */
export async function saveSlips(userId: string, slips: Slip[]): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        slips,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving slips:', error);
    throw error;
  }
}

/**
 * 全データを保存（一括）
 */
export async function saveAllSmokingData(
  userId: string,
  data: UserSmokingData
): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error saving all smoking data:', error);
    throw error;
  }
}

/**
 * ユーザーの全データを削除
 */
export async function deleteUserSmokingData(userId: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error('Error deleting user smoking data:', error);
    throw error;
  }
}

/**
 * LocalStorageからFirestoreへデータを移行
 */
export async function migrateLocalStorageToFirestore(
  userId: string,
  localData: UserSmokingData
): Promise<void> {
  try {
    // Firestoreに既存データがあるかチェック
    const firestoreData = await getUserSmokingData(userId);

    // Firestoreにデータがない場合のみ移行
    if (!firestoreData.quitData && localData.quitData) {
      await saveAllSmokingData(userId, localData);
      console.log('Successfully migrated data from LocalStorage to Firestore');
    }
  } catch (error) {
    console.error('Error migrating data to Firestore:', error);
    throw error;
  }
}
