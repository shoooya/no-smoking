# GitHub Pages 自動デプロイ設定ガイド

## ❌ 発生した問題

```
refusing to allow a GitHub App to create or update workflow `.github/workflows/deploy.yml` without `workflows` permission
```

## 🔍 原因

Claude CodeがGitHubとの通信に使用しているGitHub Appには、セキュリティ上の理由から、ワークフローファイル（`.github/workflows/*.yml`）を作成・更新する権限（`workflows` permission）がありません。

これはGitHubのセキュリティ機能で、悪意のあるコードがCI/CDパイプラインを改ざんすることを防ぐためです。

## ✅ 解決方法（3つの選択肢）

### 方法1: GitHub UIから直接作成（最も簡単）✨

1. GitHubのリポジトリページを開く
2. **Actions** タブをクリック
3. 「**set up a workflow yourself**」または「**New workflow**」をクリック
4. 以下の内容を貼り付けて「**Start commit**」→「**Commit new file**」

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. **Settings** → **Pages** → **Source** で「**GitHub Actions**」を選択
6. mainブランチにプッシュすると自動デプロイされます

### 方法2: ローカルで作成してプッシュ（Git CLIを使用）

このブランチをローカルにクローンして、あなた自身のGit認証情報でプッシュします：

```bash
# リポジトリをクローン（まだの場合）
git clone https://github.com/shoooya/no-smoking.git
cd no-smoking

# Claude Codeのブランチをチェックアウト
git checkout claude/smoking-cessation-tracker-011CUbWUcSvknGLxbBH6hsFW

# ワークフローディレクトリを作成
mkdir -p .github/workflows

# ワークフローファイルを作成（上記のYAMLをコピー）
# エディタで .github/workflows/deploy.yml を作成

# コミット＆プッシュ
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions workflow for auto-deploy"
git push origin claude/smoking-cessation-tracker-011CUbWUcSvknGLxbBH6hsFW
```

### 方法3: 手動デプロイ（GitHub Actions不要）

もしGitHub Actionsを使わない場合は、ブランチから直接デプロイもできます：

1. このブランチをmainブランチにマージ
2. **Settings** → **Pages**
3. **Source**: 「**Deploy from a branch**」を選択
4. **Branch**: 「**main**」/「**/ (root)**」を選択
5. **Save**

この方法なら、mainブランチへのプッシュ時に自動的にデプロイされます（GitHub Actions不要）。

## 📋 GitHub Pages設定の最終ステップ

ワークフローファイルを追加した後：

1. **Settings** タブを開く
2. 左サイドバーの **Pages** をクリック
3. **Build and deployment** セクションで：
   - **Source**: 「**GitHub Actions**」を選択（方法1または2の場合）
   - または「**Deploy from a branch**」を選択（方法3の場合）
4. 設定を保存

## 🎯 デプロイ後のアクセス

設定完了後、以下のURLでアクセスできます：

```
https://shoooya.github.io/no-smoking/
```

初回デプロイには数分かかる場合があります。**Actions** タブでデプロイの進行状況を確認できます。

## 🔧 トラブルシューティング

### デプロイが失敗する場合

1. **Settings** → **Actions** → **General** で：
   - **Workflow permissions** が「**Read and write permissions**」になっているか確認

2. **Settings** → **Pages** で：
   - **Source** が正しく設定されているか確認

3. **Actions** タブで：
   - エラーログを確認

### ページが表示されない場合

- ブラウザのキャッシュをクリア
- 5〜10分待ってから再度アクセス
- GitHubのStatus（https://www.githubstatus.com/）を確認

## 📝 推奨: 方法1（GitHub UIから作成）

最も簡単で確実な方法は、**方法1: GitHub UIから直接作成**です。わずか5分で完了します！
