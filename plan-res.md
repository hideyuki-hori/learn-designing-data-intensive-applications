# DDIA 1ヶ月学習プラン

## 方針

- 1日30〜45分（読む20分 + 手を動かす15〜25分）
- 各章を「読む → 作る → 確認する」の3ステップで回す
- 飽きたら次の章に飛んでOK（後で戻ればいい）
- 毎回の手を動かすパートで「動くもの」を作る

---

## Week 1: 基礎（第I部 前半）

### Day 1-2: 1章 — 信頼性・スケーラビリティ・メンテナンス性

**読む（20分）**: 1章を流し読み。キーワードだけ拾う
**作る**: 自分が今まで触ったシステムを1つ選び、以下を書き出す
- そのシステムの信頼性の弱点はどこ？
- スケーラビリティのボトルネックは？
- メンテナンス性で困ってることは？

→ `exercises/ch01-system-audit.md` に書く（自分の言葉で短く）

### Day 3-4: 2章 — データモデルとクエリ言語

**読む（20分）**: リレーショナル vs ドキュメント vs グラフの比較部分だけ集中して読む
**作る**: 同じデータを3種類のモデルで表現してみる
- PostgreSQL（リレーショナル）
- MongoDB的なJSON（ドキュメント）
- Neo4j的なノード+エッジ（グラフ）

題材例: SNSのユーザー・投稿・フォロー関係

→ `exercises/ch02-data-models/` にそれぞれ作る

### Day 5-7: 3章 — ストレージエンジン

**読む（20分）**: LSM-Tree と B-Tree の比較部分を読む
**作る**: シンプルなKey-Valueストアを実装する
- まずappend-onlyログ（最もシンプルなDB）
- 次にハッシュインデックスを追加
- 余裕があればSSTable風のソート済みセグメントも

→ `exercises/ch03-kv-store/` に実装（好きな言語でOK）

---

## Week 2: 基礎（第I部 後半）+ 分散の入口

### Day 8-9: 4章 — エンコーディングとスキーマ進化

**読む（20分）**: JSON/Protobuf/Avroの比較部分
**作る**: 同じデータをJSON, Protocol Buffers, MessagePackでエンコードしてサイズ比較
- スキーマを変更して前方/後方互換性を実験

→ `exercises/ch04-encoding/` に実装

### Day 10-12: 5章 — レプリケーション

**読む（20分）**: リーダーベース・マルチリーダー・リーダーレスの違い
**作る**: Docker Composeで以下のどちらかを試す
- **Option A**: PostgreSQLのストリーミングレプリケーション（リーダー+フォロワー構成）
- **Option B**: Redisのレプリケーション設定

やること:
1. リーダーに書き込み → フォロワーで読めることを確認
2. リーダーを落とす → 何が起こるか観察
3. レプリケーションラグを体感する

→ `exercises/ch05-replication/docker-compose.yml`

### Day 13-14: 6章 — パーティショニング

**読む（20分）**: キーレンジ vs ハッシュパーティショニング
**作る**: 簡易コンシステントハッシュを実装
- ノード追加/削除でデータの再配置がどう変わるか可視化

→ `exercises/ch06-partitioning/`

---

## Week 3: 分散システムの核心（第II部 後半）

### Day 15-16: 7章 — トランザクション

**読む（20分）**: ACID、分離レベルの部分（Read Committed, Snapshot Isolation, Serializable）
**作る**: PostgreSQLで分離レベルの違いを実際に体験
- ターミナルを2つ開いてトランザクションを同時実行
- Dirty Read, Non-repeatable Read, Phantom Readを再現

→ `exercises/ch07-transactions/` にSQLスクリプトと結果メモ

### Day 17-18: 8章 — 分散システムの問題

**読む（20分）**: ネットワーク障害、クロック問題の部分
**作る**: 以下のどちらか
- **Option A**: 2つのサービス間通信で意図的に遅延・障害を入れて挙動観察（tc netemやtoxiproxyを使用）
- **Option B**: 複数ノードのクロックのずれをシミュレートするスクリプト

→ `exercises/ch08-distributed-problems/`

### Day 19-21: 9章 — 一貫性と合意

**読む（20分）**: Linearizability、Raftの概要
**作る**: 以下のどちらか
- **Option A**: etcdまたはZooKeeperをDockerで動かし、リーダー選出を観察（ノードを落としてみる）
- **Option B**: Raftの可視化ツール（https://raft.github.io/）を動かしながら各ステップを理解

→ `exercises/ch09-consensus/`

---

## Week 4: 導出データ + 総仕上げ（第III部）

### Day 22-23: 10章 — バッチ処理

**読む（20分）**: MapReduceの考え方、Unix哲学との対比
**作る**: Unix パイプラインで「なんちゃってMapReduce」
- 大きめのログファイルやCSVを `sort | uniq -c | sort -rn` 的に処理
- 同じ処理をコードでMapReduce風に書く

→ `exercises/ch10-batch/`

### Day 24-25: 11章 — ストリーム処理

**読む（20分）**: メッセージブローカー、イベントソーシングの部分
**作る**: Kafka（またはRedis Streams）をDockerで立てて以下を実験
1. Producerでイベントを流す
2. 複数Consumerで消費
3. Consumer Groupの挙動を確認

→ `exercises/ch11-stream/docker-compose.yml`

### Day 26-28: 12章 + 総まとめ

**読む（20分）**: 12章を軽く読む（未来の話なので流し読みでOK）
**作る**: ミニプロジェクト — 学んだことを組み合わせた小さなシステムを設計
- 例: 「URL短縮サービス」や「リアルタイムアクセスカウンター」のアーキテクチャ設計
- どのストレージを使うか、レプリケーション戦略、パーティショニング方法を選んで理由を書く

→ `exercises/ch12-capstone/architecture.md`

---

## 運用ルール

| ルール | 理由 |
|--------|------|
| 1回のセッションは45分MAX | 集中力が切れる前にやめる |
| 読むパートは20分でタイマー切る | 完璧に読まなくていい。気になったら後で戻る |
| 手を動かすパートは「動いた」で完了 | 完璧なコードは不要 |
| 飽きたら次の章に飛ぶ | 戻ってくればOK |
| 各exerciseの冒頭に「今日学んだこと3行」を書く | 振り返り用。3行以上書かない |

## ディレクトリ構成

```
exercises/
├── ch01-system-audit.md
├── ch02-data-models/
├── ch03-kv-store/
├── ch04-encoding/
├── ch05-replication/
├── ch06-partitioning/
├── ch07-transactions/
├── ch08-distributed-problems/
├── ch09-consensus/
├── ch10-batch/
├── ch11-stream/
└── ch12-capstone/
```
