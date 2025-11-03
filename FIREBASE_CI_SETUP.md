# Firebase CI/CD セットアップガイド

## 概要

このプロジェクトでは、Firestoreセキュリティルール（`firestore.rules`）をGitで管理し、mainブランチにマージされた際にGitHub Actionsで自動的にFirebaseにデプロイします。

## セットアップ手順

### 1. Firebase CLI のインストール（ローカル環境）

```bash
npm install -g firebase-tools
```

### 2. Firebase にログイン

```bash
firebase login
```

### 3. Service Account の作成（推奨）

GitHub ActionsからFirebaseにアクセスするための認証情報を作成します。

#### 3.1. Firebaseコンソールでの設定

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクトを選択
3. **プロジェクトの設定**（歯車アイコン）> **サービス アカウント** タブを開く
4. **新しい秘密鍵の生成** をクリック
5. JSONファイルがダウンロードされます（このファイルは安全に保管してください）

#### 3.2. JSONファイルの内容を確認

ダウンロードしたJSONファイルの内容は以下のようになっています：

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

このJSONファイルの**全内容**をコピーしてください。

### 4. GitHub Secrets の設定

1. GitHubリポジトリにアクセス
2. **Settings** > **Secrets and variables** > **Actions** に移動
3. **New repository secret** をクリック
4. 以下の2つのシークレットを設定：

#### 4.1. GOOGLE_CREDENTIALS の設定

- **Name**: `GOOGLE_CREDENTIALS`
- **Secret**: 手順3でダウンロードしたJSONファイルの**全内容**をそのまま貼り付け

**重要**: JSONファイルの内容を一文字も変更せずに、そのまま貼り付けてください。

#### 4.2. FIREBASE_PROJECT_ID の設定

- **Name**: `FIREBASE_PROJECT_ID`
- **Secret**: あなたのFirebaseプロジェクトID（例: `my-project-12345`）

**ヒント**: プロジェクトIDはJSONファイルの`project_id`フィールドにも記載されています。

5. **Add secret** をクリック

### 5. Firebase プロジェクトID の設定（2つの方法）

#### 方法1: GitHub Secrets を使用（推奨）

上記の手順4.2で`FIREBASE_PROJECT_ID`シークレットを設定するだけです。
この方法では`.firebaserc`ファイルは不要です。

**メリット:**
- ✅ プロジェクトIDをリポジトリにコミットする必要がない
- ✅ プライベートプロジェクトIDを保護できる
- ✅ 環境ごとに異なるプロジェクトIDを簡単に切り替えられる

#### 方法2: .firebaserc ファイルを使用

`.firebaserc` ファイルを作成（ローカル開発にも便利）：

```bash
firebase use --add
```

プロジェクトを選択すると、`.firebaserc` ファイルが作成されます。

**または手動で作成:**

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

`.firebaserc` をGitにコミット：

```bash
git add .firebaserc
git commit -m "chore: add Firebase project configuration"
```

**メリット:**
- ✅ ローカル環境で`firebase`コマンドを使用する際に便利
- ✅ プロジェクトIDを明示的に管理できる

## 動作確認

### 自動デプロイのトリガー条件

以下の場合に自動的にFirestoreルールがデプロイされます：

1. **mainブランチへのプッシュ** で `firestore.rules` が変更された場合
2. **GitHub Actionsの手動実行**（Actions タブから実行可能）

### デプロイの流れ

1. `firestore.rules` を編集
2. mainブランチにプッシュ（またはPRをマージ）
3. GitHub Actionsが自動的に実行される
4. Firebase にルールがデプロイされる

### デプロイ状況の確認

1. GitHubリポジトリの **Actions** タブを開く
2. **Deploy Firestore Rules** ワークフローを確認
3. 緑のチェックマーク ✅ が表示されれば成功

## 手動デプロイ（ローカル）

必要に応じて、ローカル環境から手動でデプロイすることも可能です：

```bash
firebase deploy --only firestore:rules
```

## トラブルシューティング

### エラー: "No currently active project"

**原因**: Firebaseプロジェクトが指定されていない

```
Error: No currently active project.
To run this command, you need to specify a project.
```

**解決方法1（推奨）**: GitHub Secretsに `FIREBASE_PROJECT_ID` を設定

1. GitHubリポジトリの **Settings** > **Secrets and variables** > **Actions** に移動
2. `FIREBASE_PROJECT_ID` シークレットを追加
3. 値にFirebaseプロジェクトID（例: `my-project-12345`）を設定

**解決方法2**: `.firebaserc` ファイルを作成してコミット

```bash
firebase use --add
git add .firebaserc
git commit -m "chore: add Firebase project configuration"
git push
```

---

### エラー: "GOOGLE_CREDENTIALS is not set" または認証エラー

**原因**: GitHub Secretsに `GOOGLE_CREDENTIALS` が正しく設定されていない

**解決**:
1. Firebase ConsoleでService Accountの秘密鍵を再生成
2. JSONファイルの**全内容**をGitHub Secretsに設定（上記の手順4.1を参照）
3. JSONファイルの内容が正しくコピーされているか確認（改行や空白が含まれていてもOK）

---

### エラー: "Error: Failed to get Firebase project"

**原因**: `.firebaserc` が存在しないか、プロジェクトIDが間違っている

**解決**:
1. `.firebaserc` ファイルを確認
2. `firebase use --add` でプロジェクトを再設定
3. またはGitHub Secretsの `FIREBASE_PROJECT_ID` を確認

---

### エラー: "HTTP Error: 401, Request had invalid authentication credentials"

**原因**: 認証情報が無効または期限切れ

**解決（Service Account方式 - 推奨）**:
1. Firebase ConsoleでService Accountの秘密鍵を再生成
2. GitHub Secretsの `GOOGLE_CREDENTIALS` を更新

---

### エラー: "Failed to authenticate, have you run firebase login?"

**原因**: 認証情報が正しく設定されていない

**解決（Service Account方式 - 推奨）**:
1. GitHub Secretsに `GOOGLE_CREDENTIALS` が設定されているか確認
2. JSONファイルの内容が完全にコピーされているか確認
3. Firebase Consoleで該当のService Accountが有効か確認

**このワークフローは Service Account 認証を使用しています**。これは以下の理由で推奨されます：
- ✅ トークンの期限切れがない
- ✅ より安全な認証方法
- ✅ Google Cloudの標準的な認証方法

---

### GitHub Actionsが実行されない

**原因1**: `firestore.rules` が変更されていない
- ワークフローは `firestore.rules` の変更時のみ実行されます

**原因2**: mainブランチ以外にプッシュしている
- ワークフローはmainブランチへのプッシュ時のみ実行されます

**解決**: 手動実行する場合：
1. GitHubの **Actions** タブを開く
2. **Deploy Firestore Rules** を選択
3. **Run workflow** をクリック

## セキュリティ

### Service Account の管理

- ✅ Service Account JSONはGitHub Secretsで安全に管理されます
- ✅ 認証情報はログに表示されません
- ✅ 認証情報は暗号化されて保存されます
- ❌ JSONファイルをコードやコミットに含めないでください
- ❌ JSONファイルを公開しないでください

### Service Account の権限

Service Accountには必要最小限の権限のみを付与してください：

- **必要な権限**: Firebase Admin SDK Administrator Service Agent
- Firebaseプロジェクトのデフォルトサービスアカウントには自動的に適切な権限が付与されています

### 認証情報のローテーション

定期的にService Accountの秘密鍵を再生成することを推奨します：

1. Firebase Consoleで新しい秘密鍵を生成
2. GitHub Secretsの `GOOGLE_CREDENTIALS` を更新
3. 古い秘密鍵を削除（Firebase Console > サービス アカウント > キーの管理）

## その他のデプロイ設定

### Firestore インデックスも自動デプロイする場合

`firestore.indexes.json` を作成し、ワークフローを以下のように変更：

```yaml
- name: Deploy Firestore Rules and Indexes
  run: |
    firebase deploy --only firestore --token "$FIREBASE_TOKEN" --non-interactive
```

### 複数の環境（staging, production）をサポートする場合

`.firebaserc` に複数のプロジェクトを追加：

```json
{
  "projects": {
    "default": "your-project-id",
    "staging": "your-staging-project-id",
    "production": "your-production-project-id"
  }
}
```

ワークフローで環境を指定：

```yaml
- name: Deploy to Production
  run: |
    firebase use production
    firebase deploy --only firestore:rules --token "$FIREBASE_TOKEN"
```

## 参考リンク

- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
