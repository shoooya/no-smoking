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
4. 以下の2つのシークレットを設定：

#### 4.1. FIREBASE_TOKEN の設定

- **Name**: `FIREBASE_TOKEN`
- **Secret**: 手順3でコピーしたトークン

#### 4.2. FIREBASE_PROJECT_ID の設定

- **Name**: `FIREBASE_PROJECT_ID`
- **Secret**: あなたのFirebaseプロジェクトID（例: `my-project-12345`）

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

### エラー: "FIREBASE_TOKEN is not set"

**原因**: GitHub Secretsに `FIREBASE_TOKEN` が設定されていない

**解決**: 上記の手順4.1を実行

---

### エラー: "Error: Failed to get Firebase project"

**原因**: `.firebaserc` が存在しないか、プロジェクトIDが間違っている

**解決**:
1. `.firebaserc` ファイルを確認
2. `firebase use --add` でプロジェクトを再設定
3. またはGitHub Secretsの `FIREBASE_PROJECT_ID` を確認

---

### エラー: "HTTP Error: 401, Request had invalid authentication credentials"

**原因**: Firebase Tokenが無効または期限切れ

**解決**:
1. `firebase login:ci` で新しいトークンを生成
2. GitHub Secretsの `FIREBASE_TOKEN` を更新

---

### エラー: "Failed to authenticate, have you run firebase login?"

**原因**: `FIREBASE_TOKEN` が正しく設定されていない、または認証方法が間違っている

**解決**:
1. GitHub Secretsに `FIREBASE_TOKEN` が正しく設定されているか確認
2. トークンが正しいか確認（`firebase login:ci` で再生成）
3. ワークフローで `FIREBASE_TOKEN` 環境変数が設定されているか確認

**注意**: Firebase CLIは環境変数 `FIREBASE_TOKEN` を自動的に使用するため、`--token` オプションは不要です。

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
