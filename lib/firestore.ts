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
  sharingEnabled?: boolean;
  shareId?: string;
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
        sharingEnabled: data.sharingEnabled || false,
        shareId: data.shareId || undefined,
      };
    }

    // データが存在しない場合は空のデータを返す
    return {
      quitData: null,
      cravings: [],
      slips: [],
      sharingEnabled: false,
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

/**
 * シェアIDを生成
 */
export function generateShareId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * 共有を有効化してシェアIDを取得
 */
export async function enableSharing(userId: string): Promise<string> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    let shareId: string;

    if (userDoc.exists() && userDoc.data().shareId) {
      // 既存のshareIdを使用
      shareId = userDoc.data().shareId;
    } else {
      // 新しいshareIdを生成
      shareId = generateShareId();
    }

    await setDoc(
      userDocRef,
      {
        sharingEnabled: true,
        shareId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return shareId;
  } catch (error) {
    console.error('Error enabling sharing:', error);
    throw error;
  }
}

/**
 * 共有を無効化
 */
export async function disableSharing(userId: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        sharingEnabled: false,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error disabling sharing:', error);
    throw error;
  }
}

/**
 * シェアIDから公開データを取得
 */
export async function getSharedData(shareId: string): Promise<UserSmokingData | null> {
  try {
    // usersコレクションからshareIdで検索
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('shareId', '==', shareId), where('sharingEnabled', '==', true));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userData = querySnapshot.docs[0].data();
    return {
      quitData: userData.quitData || null,
      cravings: userData.cravings || [],
      slips: userData.slips || [],
      sharingEnabled: userData.sharingEnabled,
      shareId: userData.shareId,
    };
  } catch (error) {
    console.error('Error fetching shared data:', error);
    throw error;
  }
}
