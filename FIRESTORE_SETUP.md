# Firestore セットアップガイド

このアプリはFirestoreを使用してユーザーデータをクラウドに保存します。以下の手順でFirestoreを有効化してください。

## 1. Firestoreデータベースの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクトを選択
3. 左メニューから「Firestore Database」を選択
4. 「データベースの作成」をクリック
5. 本番環境モードで開始することを推奨

## 2. セキュリティルールの設定

Firestoreコンソールの「ルール」タブで、以下のルールを設定してください：

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のドキュメントのみ読み書き可能
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // その他のドキュメントへのアクセスを拒否
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

これにより、ログインユーザーは自分のデータのみアクセス可能になります。

## 3. データ構造

Firestoreには以下の構造でデータが保存されます：

```
users (collection)
  └── {userId} (document)
      ├── quitData: {
      │     startDate: string,
      │     lastCigaretteTime: string,
      │     cigarettesPerDay: number,
      │     pricePerPack: number,
      │     cigarettesPerPack: number
      │   }
      ├── cravings: Craving[]
      ├── slips: Slip[]
      └── updatedAt: string
```

## 4. データの同期

- **自動保存**: データは変更から1秒後に自動的にFirestoreに保存されます
- **自動読み込み**: ログイン時に自動的にFirestoreからデータが読み込まれます
- **LocalStorage移行**: 初回ログイン時に既存のLocalStorageデータが自動的にFirestoreに移行されます
- **オフライン対応**: LocalStorageもバックアップとして保持されるため、オフラインでも動作します

## 5. デバイス間の同期

Firestoreを使用することで、以下のメリットがあります：

- 複数のデバイス間でデータが自動同期されます
- ブラウザのキャッシュをクリアしてもデータが失われません
- デバイスを変更してもログインすればデータにアクセスできます

## トラブルシューティング

### データが保存されない場合

1. Firebaseコンソールでプロジェクトが正しく設定されているか確認
2. セキュリティルールが正しく設定されているか確認
3. ブラウザのコンソールでエラーメッセージを確認
4. Firebase SDKの環境変数が正しく設定されているか確認（.env.local）

### 既存データの移行

アプリは初回ログイン時に自動的にLocalStorageのデータをFirestoreに移行します。
ただし、Firestoreに既にデータがある場合は移行されません（Firestoreのデータが優先されます）。
