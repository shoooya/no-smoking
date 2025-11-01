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

### 3. Firebase Token の生成

GitHub ActionsからFirebaseにアクセスするためのトークンを生成します。

```bash
firebase login:ci
```

このコマンドを実行すると、ブラウザが開き、Googleアカウントでログインするよう求められます。
ログイン後、ターミナルにトークンが表示されます。

**例:**
```
✔  Success! Use this token to login on a CI server:

1//0eXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Example: firebase deploy --token "$FIREBASE_TOKEN"
```

このトークンをコピーしてください。

### 4. GitHub Secrets の設定

1. GitHubリポジトリにアクセス
2. **Settings** > **Secrets and variables** > **Actions** に移動
3. **New repository secret** をクリック
4. 以下の情報を入力：
   - **Name**: `FIREBASE_TOKEN`
   - **Secret**: 手順3でコピーしたトークン
5. **Add secret** をクリック

### 5. Firebase プロジェクトID の設定

`.firebaserc` ファイルを作成（まだ存在しない場合）：

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

### エラー: "FIREBASE_TOKEN is not set"

**原因**: GitHub Secretsに `FIREBASE_TOKEN` が設定されていない

**解決**: 上記の手順4を実行

---

### エラー: "Error: Failed to get Firebase project"

**原因**: `.firebaserc` が存在しないか、プロジェクトIDが間違っている

**解決**:
1. `.firebaserc` ファイルを確認
2. `firebase use --add` でプロジェクトを再設定

---

### エラー: "HTTP Error: 401, Request had invalid authentication credentials"

**原因**: Firebase Tokenが無効または期限切れ

**解決**:
1. `firebase login:ci` で新しいトークンを生成
2. GitHub Secretsの `FIREBASE_TOKEN` を更新

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

### Firebase Token の管理

- ✅ Firebase TokenはGitHub Secretsで安全に管理されます
- ✅ トークンはログに表示されません
- ✅ トークンは暗号化されて保存されます
- ❌ トークンをコードやコミットに含めないでください

### トークンの更新

定期的にトークンを更新することを推奨します：

1. `firebase login:ci` で新しいトークンを生成
2. GitHub Secretsの `FIREBASE_TOKEN` を更新

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
