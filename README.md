# 📚 雅思背单词工作台 · 多账号云同步版

> 每个使用者**注册一个账号、各自独立的生词本**，手机 / 电脑打开同一个网址登录后，进度**自动云同步**。
> 不再需要 `node server.js`——不用开服务器、不用手动备份文件。

## 网站地址

**https://smilon1009.github.io/english-vocab/**

打开方式任选其一：

| 设备 | 方式 |
|---|---|
| Windows | 双击仓库里的 **`tools/开始学习.bat`**（可复制到桌面） |
| macOS | 双击 **`tools/开始学习.command`**（首次请「右键 → 打开」绕过系统提示） |
| 手机 | 浏览器打开网址 → 右上角菜单「添加到主屏幕」，以后像 App 一样点开 |
| 任何设备 | 直接收藏网址 |

> 双击脚本只是「帮你打开默认浏览器并跳转到上面的网址」，不用装任何东西、不用后台常驻进程。
> 登录后**顶部有一行「📊 测词汇量」链接**，点击会打开 VocabularySize（https://my.vocabularysize.com/ ）在**新窗口**测你的词汇量，方便定期评估水平。

## 多人使用（每人一个账号，进度互相独立）

1. 打开上面的网址，进入登录页：
   - **第一次用** → 点「没有账号？注册一个」→ 输入自己的邮箱 + 密码 →「注册并开始学习」；
     首次登录会**直接以空白进度开始**，不用导入任何旧数据。
   - **以后** → 直接输邮箱密码登录，上次的进度会自动从云端拉下来。
2. 各学各的：判词、三明治三步、艾宾浩斯复习都一样，只是进度分开存、互不干扰。

> 手机和电脑**登录同一个账号**就是同一个进度；换设备只需登录一次。
> 登录状态会保留在浏览器里，不用每次输密码。

## 数据存哪 / 隐私

- 每个人的进度（已学会、生词本、每日状态）存在 **Supabase 云数据库**里，一行一条，**行级安全策略保证只能读写自己的那一行**——不同账号互相看不到、外人更看不到。
- 这个 GitHub 仓库只放网页源码和公开雅思词库，**不含任何用户学习数据**。

## 🗂 仓库结构（每个文件干什么）

```
english-vocab/
├── index.html                # ▶ 网站入口（工作台本体，内嵌全部样式与逻辑）
├── README.md                 # 本说明
├── .gitattributes            # 行尾规范：.bat=CRLF / .command=LF / 文本=LF
│
├── js/                       # 页面加载的 JavaScript（都在 index.html 顶部 <script> 引入）
│   ├── words.js              #   基础词库（Level 1–4，约 530 行）
│   ├── words_ielts1.js       #   雅思核心词包①（用 WORDS.push 追加进同一数组）
│   ├── words_ielts2.js       #   雅思核心词包②（用 WORDS.push 追加进同一数组）
│   ├── words_ielts3.js       #   雅思核心词包③ —— 扩容第一批
│   ├── words_ielts4.js       #   雅思核心词包④ —— 高频词大扩容（第二次）
│   └── config.js             #   ⚠️ Supabase 配置：Project URL + anon public key（部署前填一次）
│
├── lib/                      # 第三方库（下载到本地，不依赖外部 CDN）
│   └── supabase.min.js       #   supabase-js v2 官方客户端库（登录 + 云数据库）
│
├── database/
│   └── schema.sql            # Supabase 建表 SQL：user_state 表 + 3 条行级安全策略
│
├── pwa/                      # 手机「添加到主屏幕」+ 离线缓存
│   ├── icon.svg              #   网站图标（渐变书本 logo）
│   ├── manifest.webmanifest  #   PWA 清单：应用名/主题色/图标/独立窗口
│   └── sw.js                 #   Service Worker：缓存页面壳与词库，Supabase 请求仍走网络
│
└── tools/                    # 双击打开网站的启动器（网址已写好，改仓库名记得同步改）
    ├── 开始学习.bat          #   Windows 双击 → 打开默认浏览器
    └── 开始学习.command      #   macOS 双击 → 打开默认浏览器
```

> ⚠️ **不要移动 `index.html`**：GitHub Pages 靠根目录的 `index.html` 当网站入口，它移动位置站点就打不开。其余文件可以换文件夹，但改完要同步更新 `index.html` 里的相对路径。

## 🛠 管理员的一次性配置教程（只做这一次，约 10 分钟）

下面几步只在最初搭建时做一次；做完后所有人都能用了。

### 第 1 步：注册 Supabase + 建项目（免费，不用信用卡）
1. 打开 https://supabase.com → **Sign up**（用你的 GitHub 账号登录最快）。
2. 创建组织后点 **New project**：取个名字（如 `english-vocab`）、设数据库密码（记好）、**区域选离你近的**（如新加坡 Singapore 或东京 Tokyo）。
3. 等一两分钟项目创建完成。

### 第 2 步：关掉「邮箱验证」（推荐，方便大家随时注册）
1. 左侧 **Authentication → Providers → Email**。
2. 关闭 **Confirm email** 开关，保存。
   - 关闭后，谁都能用任意邮箱直接注册。因为本应用**只有读自己一行的权限**，风险很低，图省事就这样。
   - 想更稳妥：保持开关开启，由管理员在 **Authentication → Users → Add user** 里手动给大家建好账号（这种不走邮件）。
3. （可选）把发件人改成自己的邮箱：Authentication → Emails → SMTP，不填也能用 Supabase 默认发信，但可能有延迟。

### 第 3 步：建数据表
1. 左侧 **SQL Editor** → New query。
2. 把仓库里的 **`database/schema.sql`** 全部内容粘贴进去 → **Run**。
3. 应看到 `Success. No rows returned`。表 `user_state` + 3 条安全策略就建好了。

### 第 4 步：填 `js/config.js`
1. 左侧 **Settings → API**。
2. 复制 **Project URL** 和 **anon public key**。
3. 用编辑器打开本仓库的 `js/config.js`，把两个占位值换成你的（anon key 是"公开密钥"，明文放网页里是 Supabase 的标准做法，靠第 3 步的 RLS 保护数据）。

### 第 5 步：推到 GitHub 并开启网页托管
1. 在 https://github.com 新建一个**公开**仓库，名字建议 `english-vocab`（不要勾选自动生成 README，保持空仓库）。
2. 在本文件夹里执行：
   ```bash
   git init -b main
   git add .
   git commit -m "背单词工作台：多账号云同步版（Supabase + GitHub Pages）"
   git branch -M main
   git remote add origin https://github.com/smilon1009/english-vocab.git
   git push -u origin main
   ```
3. 在 GitHub 仓库页面：**Settings → Pages → Source: Deploy from a branch**，选 `main`、目录 `/ (root)` → Save。
4. 等 1–2 分钟，站点地址固定为 `https://smilon1009.github.io/english-vocab/`（第 1 步和第 3 步要等它生效再测）。

### 第 6 步：验证
- 电脑打开网址 → 注册并登录 → 看到一个"今日生词 0/10"的空白进度，点几个词后有反应。
- 手机打开同一网址 → 登录**同一账号** → 刷新/点几个词 → 电脑上应能看到变化（自动同步，等待几秒或刷新）。
- 换个账号登录 → 应看到另一个人的空白进度，互不影响。

> 启动器 `tools/开始学习.bat` / `tools/开始学习.command` 里的网址已在仓库里写好；如果你改用了别的仓库名或托管方式，记得把脚本里的网址也改掉。

## 文件说明（逐文件详解）

### `index.html` —— 唯一的"应用"
纯 HTML + CSS + 原生 JS（无框架）写成的单页应用，内嵌两大部分：
- **页面结构**：品牌头 + 账号栏（含词汇量等级徽章）、统计卡（含连续打卡天数）、四个模块按钮（判词 / 三明治 / 复习当天 / 复习到期）、设置面板（每日目标、朗读语速、发音引擎、难度上限、词包勾选、词汇量登记）、数据区（撤销误判 / 重置今日 / 清空进度）、完成庆祝弹层、登录/注册弹层。
- **应用逻辑**（`<script>` 内约 900 行）：
  - 判词（出英文→确认中文→认识/不认识，抽词按 level 加权、高频先筛）
  - 三明治三步学习（听音辨词→句子填空→看释义造句）
  - 双复习（当天 7 词 / 艾宾浩斯到期），错词自动重置到第 1 天
  - 状态管理 + **防抖云端同步**（本地 localStorage 缓存 → 800ms 防抖 upsert 到 Supabase）
  - 登录/注册/忘记密码（走 Supabase Auth）；首次登录无云端记录时自动建立空白进度
  - 在线/离线监听：断网时先写本地，`online` 事件或 4 秒定时器自动补传
  - **连续打卡**：完成判词/学完单词/复习判定时推进 streak，存进 state.stats
  - **撤销误判**：判词点「认识」后可在数据区一键撤销（仅当天有效）
  - **跨天顺延**：当天判了但没学满 3 步的词，次日自动带进今日清单继续学
  - **已学会·可回炉**：不再展示已学会词长列表；学会 30→90→180→360 天后，「复习到期」里可**自愿**回炉一遍（答对顺延、答错 7 天后再来）
  - **生词本分页**：底部生词本一页 10 个，箭头/左右滑动翻页
  - **完成庆祝**：今日生词全部学完时弹庆祝卡片
  - **词汇量等级**：登记 VocabularySize 测试结果，自动估算 CEFR 等级并显示在账号栏
  - **PWA**：末尾注册 `pwa/sw.js`，支持「添加到主屏幕」与离线打开
  - **三态判词**：判词支持「认识 / 😐半熟 / 不认识」；半熟词直接入已学会但 7 天后回炉再确认，避免一次判死
  - **词库管理**：可搜索词库手动「设为已学会 / 移出已学会 / 加入今日生词 / 移出生词本」
  - **日报卡**：今日全部学完的庆祝弹层里展示当天判词/三明治/复习正确率小结
  - **休息提醒**：连续学习 25 分钟弹出休息提示（设置里可关）
  - **例句朗读**：复习判分后自动朗读整句例句，顺带练听力
  - **庆祝彩带**：完成日目标时彩带动效
  - **词汇量测量**：① 抽样自测——分层抽 80 词快速估"本词库掌握率"（与泛词汇量口径不同）；② 高频全量摸底——把 level1+2 高频词分批筛完，认识的当场入已学会、不认识的留待日常三明治逐个学。两者均会存进度
  - **词库扩容计划**：当前约 **1375 词**（words.js 500 + 雅思包①~④），高频常用层已基本覆盖（本次 +387 词多为 level1/2）。目标雅思 ~6000；后续新增 `words_ielts5/6/…` 继续扩低频与学术层。逻辑无需改动：`index.html` 逐个引入、按 `WORDS` 全局数组自动并入去重，词包可在设置里勾选（数字随扩容变化，正文不再写死词数）

### `js/` 目录
| 文件 | 作用 |
|---|---|
| `js/words.js` | 基础词库，声明全局 `const WORDS = [...]`。每条含 `word / ipa / pos / zh / def / example / level`（`___` 表示例句中待填空的目标词） |
| `js/words_ielts1.js` | 雅思核心词包①，用 `WORDS.push(...)` 追加进同一个数组，额外带 `pack:"ielts1"` 标记 |
| `js/words_ielts2.js` | 雅思核心词包②，同上，`pack:"ielts2"` + `level` 权重 |
| `js/words_ielts3.js` | 雅思核心词包③，同上，`pack:"ielts3"` + `level` 权重（扩容第一批） |
| `js/words_ielts4.js` | 雅思核心词包④，同上，`pack:"ielts4"` + `level` 权重（高频词大扩容，第二次；后续 words_ielts5… 同格式追加） |
| `js/config.js` | ⚠️ 只暴露全局 `CONFIG = { SUPABASE_URL, SUPABASE_ANON_KEY }`，**需在部署前填好** |

### `lib/` 目录
| 文件 | 作用 |
|---|---|
| `lib/supabase.min.js` | supabase-js 官方库（压缩版）。已下载到仓库本地引入，**不依赖外部 CDN**，避免部分地区加载失败 |

### `database/` 目录
| 文件 | 作用 |
|---|---|
| `database/schema.sql` | 粘贴到 Supabase SQL Editor 运行一次：创建 `user_state` 表（`id / user_id / state jsonb / updated_at`）+ 开启 RLS + 3 条策略（每个账号只能 select / insert / update 自己的 `user_id` 那一行） |

### `pwa/` 目录
| 文件 | 作用 |
|---|---|
| `pwa/manifest.webmanifest` | PWA 清单：应用名称/主题色/图标/独立窗口，让「添加到主屏幕」变成一个 App |
| `pwa/sw.js` | Service Worker：缓存页面壳与词库做离线兜底；**Supabase 的请求一律放行走网络**，不缓存个人数据 |
| `pwa/icon.svg` | 站点图标（渐变书本 logo），同时用作 favicon / apple-touch-icon / 清单图标 |

### `tools/` 目录
| 文件 | 作用 |
|---|---|
| `tools/开始学习.bat` | Windows 启动器：一行 `start "网址"`，双击用默认浏览器打开工作台 |
| `tools/开始学习.command` | macOS 启动器：一行 `open "网址"`，双击打开工作台（文件本身带可执行权限，且经 `.gitattributes` 强制 LF 行尾，否则 macOS 无法运行） |

### 根目录其他文件
| 文件 | 作用 |
|---|---|
| `README.md` | 本说明：使用教程 + 搭建指南 + 文件地图 |
| `.gitattributes` | 让 Git 按文件类型统一行尾：`*.bat` 用 CRLF（Windows）、`*.command` 用 LF（macOS 必需），其余文本文件用 LF，避免跨平台换行混乱 |

## 用到的技术点速览

- **纯前端静态站（零构建）**：原生 HTML/CSS/JS，无框架、无打包器，GitHub 直接托管
- **GitHub Pages**：公开仓库 + "Deploy from a branch"（root 目录）自动部署
- **Supabase（BaaS）**：
  - **Auth**：邮箱+密码注册/登录/找回密码，`onAuthStateChange` 监听会话
  - **PostgreSQL 数据库**：一张 `user_state` 表，进度整包存成 JSONB 列
  - **RLS（Row Level Security）**：数据库端强制"只能读写自己那一行"，前端拿的是公开 anon key 也不怕
- **本地缓存 + 离线优先**：localStorage 每账号一份缓存，断网可用，联网自动补传
- **Web Speech API + 在线发音兜底**：优先 `speechSynthesis` 慢速朗读；安卓/国产浏览器无声或 1.6s 未出声时，自动转有道词典/Google TTS 在线音频（可在设置里手动选「在线词典」）
- **艾宾浩斯遗忘曲线**：`INTERVALS=[1,3,7,15,30]` 天，复习错词退回第 1 天
- **Clipboard API**：造句步骤一键复制文本去 AI 批改
- **PWA（渐进式 Web 应用）**：`manifest.webmanifest` + Service Worker → 可「添加到主屏幕」当 App 用、断网也能打开界面（学习数据仍实时走 Supabase）
- **词库扩容机制**：词包文件按 `WORDS.push` 追加、自动去重合并，扩词不改任何业务逻辑；当前库约 1375 词、分批发往 ~6000

## ❓ 常见问题

**Q：免费套餐够用吗？**
够。数据库 500MB（存文字进度只占几 KB）、每月 5 万活跃用户，远超需求；不需要信用卡。

**Q：好几天没打开，再打开时同步不动了？**
Supabase 免费项目**连续 7 天没有任何访问会自动休眠**。此时页面会提示"云同步失败，将自动重试"。到 supabase.com → 你项目里会看到 Paused → 点 **Restore** 恢复（数据不丢），再刷新页面即可。每天背单词基本不会触发。

**Q：换新手机 / 新电脑？**
打开网址 → 登录自己的账号即可，进度自动从云端拉下来。旧设备上留下的离线缓存不影响。

**Q：密码忘了？**
登录页有「忘记密码」，会往你邮箱发重置链接（需要邮箱验证能收到信；如果用了 Supabase 默认发信，稍等或翻垃圾箱）。

**Q：不同账号之间能互相看到对方进度吗？**
不能，行级安全只允许本人读写。以后想加"互相看/比赛/排行榜"需要改表结构，到时候再说。

**Q：没网 / 断网了还能学吗？**
能。学习操作会先存进本机浏览器缓存，联网后自动补传到云端（页面状态会显示"离线"或"同步中"）。

**Q：部署报错 `Listing artifact metadata failed ... (403) Forbidden`？**
这是 GitHub Pages 内部（artifact 服务）的偶发故障，**不是仓库代码问题**。到仓库 **Actions** 页对失败的 `pages build and deployment` 点 **Re-run**，或随便再 `git push` 一次即可重发部署。

## 旧版档案

老版本工作台仍留在个人 study 仓库的 `09_english` 文件夹里（含当时的 `server.js` 与笔记），需要找回历史记录/旧笔记可去那里。本仓库 v3 起改为账号云同步、从零开始记录进度，不再依赖本地 node 服务。
