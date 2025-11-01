# Firebase CI/CD セットアップガイド

## 概要

このプロジェクトでは、Firestoreセキュリティルール（`firestore.rules`）をGitで管理し、mainブランチにマージされた際にGitHub Actionsで自動的にFirebaseにデプロイします。

認証方法は2つあります：
- **方法1: Service Account（推奨）** - Firebaseコンソールから取得
- **方法2: Firebase Token** - Firebase CLIから生成

## 方法1: Service Account を使う（推奨）

### 手順1: Service Account キーをFirebaseコンソールから取得

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクトを選択
3. ⚙️（設定アイコン）> **プロジェクトの設定** をクリック
4. **サービス アカウント** タブを選択
5. 一番下の **新しい秘密鍵の生成** をクリック
6. 確認ダイアログで **キーを生成** をクリック
7. JSONファイルがダウンロードされます（例: `your-project-12345-firebase-adminsdk-xxxxx.json`）

⚠️ **重要**: このファイルには機密情報が含まれています。Gitにコミットしないでください！

### 手順2: JSONファイルの内容をBase64エンコード

#### macOS/Linux の場合:
```bash
cat path/to/your-service-account.json | base64
```

#### Windows (PowerShell) の場合:
```powershell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("path\to\your-service-account.json"))
```

出力された長い文字列をコピーしてください。

### 手順3: GitHub Secrets に設定

1. GitHubリポジトリにアクセス
2. **Settings** > **Secrets and variables** > **Actions** に移動
3. **New repository secret** をクリック
4. 2つのシークレットを作成：

#### シークレット1: サービスアカウント
- **Name**: `FIREBASE_SERVICE_ACCOUNT`
- **Secret**: 手順2でコピーしたBase64文字列を貼り付け
- **Add secret** をクリック

#### シークレット2: プロジェクトID
- **Name**: `FIREBASE_PROJECT_ID`
- **Secret**: あなたのFirebaseプロジェクトID（例: `my-project-12345`）
- **Add secret** をクリック

### 手順4: GitHub Actions ワークフローを更新

`.github/workflows/deploy-firestore-rules.yml` が既に更新されています。特に変更は不要です。

---

## 方法2: Firebase Token を使う（CLI必須）

### 手順1: Firebase CLI のインストール

```bash
npm install -g firebase-tools
```

### 手順2: Firebase にログイン

```bash
firebase login
```

### 手順3: Firebase Token の生成

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

### 手順4: GitHub Secrets の設定

1. GitHubリポジトリにアクセス
2. **Settings** > **Secrets and variables** > **Actions** に移動
3. **New repository secret** をクリック
4. 以下の情報を入力：
   - **Name**: `FIREBASE_TOKEN`
   - **Secret**: 手順3でコピーしたトークン
5. **Add secret** をクリック

---

## Firebase プロジェクトID の設定（共通）

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

### エラー: "Error: Invalid service account"

**原因**: Service Account JSONのデコードに失敗している

**解決**:
1. Base64エンコードが正しいか確認
2. 以下のコマンドで検証：
   ```bash
   # macOS/Linux
   echo "YOUR_BASE64_STRING" | base64 -d | jq .
   ```
3. 有効なJSONが出力されることを確認
4. GitHub Secretsの `FIREBASE_SERVICE_ACCOUNT` を再設定

---

### エラー: "Error: Failed to get Firebase project" (Service Account使用時)

**原因**: `FIREBASE_PROJECT_ID` が設定されていない、または間違っている

**解決**:
1. Firebaseコンソールでプロジェクトを確認
2. GitHub Secretsの `FIREBASE_PROJECT_ID` を正しいIDに更新
3. プロジェクトIDは `firebase.json` の形式ではなく、単純な文字列（例: `my-project-12345`）

---

### エラー: "FIREBASE_TOKEN is not set"

**原因**: GitHub Secretsに `FIREBASE_TOKEN` が設定されていない（Token方式使用時）

**解決**: 方法2の手順4を実行

---

### エラー: "Error: Failed to get Firebase project" (Token使用時)

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

### Service Account の管理（方法1使用時）

- ✅ Service Account JSONファイルは**絶対にGitにコミットしないでください**
- ✅ GitHub Secretsで安全に管理されます
- ✅ ワークフロー実行後は自動的にファイルが削除されます
- ✅ Base64エンコードされた状態で保存されます
- ❌ Service Account JSONをコードやログに含めないでください

**`.gitignore` に追加推奨**:
```
# Firebase Service Account
*-firebase-adminsdk-*.json
service-account*.json
```

### Service Account の更新

定期的に新しいService Accountを生成することを推奨します：

1. 古いService Accountを削除（Firebaseコンソール > サービス アカウント）
2. 新しいService Accountを生成
3. GitHub Secretsの `FIREBASE_SERVICE_ACCOUNT` を更新

---

### Firebase Token の管理（方法2使用時）

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
