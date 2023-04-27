# bsky-backup

ユーザーの投稿内容を全てバックアップします。

## 実行手順

実行にあたってはuserlist.sample.jsonを書き換えてください
以下の手順でデプロイします

```bash
npm install
cp userlist.sample.json userlist.json
```

userlist.jsonを編集する

```json
[
    "user handle",
    "user did",
    "user handle"
]
```

### 全件バックアップ

```bash
node all.js
```

### 一定時間ごとの差分

```bash
node laps.js [minutes]
```

## docker環境

https://github.com/ShinoharaTa/node-docker

使用方法はリポジトリの説明を読んで下さい
