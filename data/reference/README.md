# 参考词表与来源

本目录保存“覆盖范围基准”，不直接作为工作台学习卡片。参考词表只能告诉我们缺哪些词头，不能替代词性、释义、发音、例句和搭配的人工校验。

## 已引入基准

- `ngsl.json`：New General Service List，分 1000/2000/3000 三个频段，约 2800 个高频词头及词族。
- `nawl.json`：New Academic Word List，约 960 个学术词头及词族。
- `SOURCE_LICENSE_CC0.txt`：下游机器可读版本仓库声明的 CC0 1.0 许可证。

机器可读文件取自 [lpmi-13/machine_readable_wordlists](https://github.com/lpmi-13/machine_readable_wordlists)，原仓库同时记录了上游来源。引入日期：2026-09-19。

## 使用方式

运行：

```text
node tools/audit_coverage.mjs
```

脚本会生成 `data/coverage_report.json`，分别统计工作台对 NGSL、NAWL 词头及词族的覆盖。缺失清单是待审核队列，不会自动进入 `WORDS`。

新增学习卡片必须逐条核对：词头、词性、核心义、发音、自然例句、例句答案、难度和来源。禁止用占位释义或批量 AI 例句把覆盖率做成 100%。
