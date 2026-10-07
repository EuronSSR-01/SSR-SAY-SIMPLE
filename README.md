# SSR-SAY-SIMPLE

把复杂方案讲清楚：用简明中文、合适的图解和可操作演示，让读者看懂条件、比较选择、留下反馈。

基于 [SSR-HTML-PLAN-CODEX](https://github.com/EuronSSR-01/SSR-HTML-PLAN-CODEX) 的独立 Codex 插件。保留离线 HTML、代码摘录、分层阅读、选择和批注能力，增加中文可读性检查与「选择 → 后果」演示。原插件和原仓库不受影响。

不制作视频，不使用语音服务，不需要专用 API Key。生成内容使用你当前 Codex 会话的模型。不是 OpenAI、Anthropic 或 ASD 官方产品。

## 安装

需要 Git、Node.js、浏览器和支持插件市场的 Codex。在终端执行：

```powershell
codex plugin marketplace add EuronSSR-01/SSR-SAY-SIMPLE
codex plugin add ssr-say-simple@ssr-say-simple-marketplace
```

然后重启 Codex 桌面应用或开启新 CLI 会话。CLI 和桌面需使用同一个 `CODEX_HOME`。本插件的市场名独立，可以与 SSR-HTML-PLAN-CODEX 共存。GitHub 插件市场是分发渠道，不提供单独 Release ZIP。

## 使用

在项目会话中输入：

```text
用 $ssr-say-simple:ssr-say-simple 把这个方案做成易懂的交互式 HTML。
先说清楚谁在什么条件下做什么，再选择合适的图解。
有需要我决定的选项时，让我看到不同选择的结果和代价。
先解释和做计划，不修改业务代码。
```

也可以直接说「用 SSR-SAY-SIMPLE 解释这个方案」，或从技能选择器选择它。

读者展开内容、切换选项、点击状态、添加批注，然后点击 **Respond → Copy response**，把反馈粘回 Codex。它不会自动发送反馈或执行计划。未打开的默认选项不等于批准。

## 有哪些变化

| 能力 | 行为 |
|---|---|
| 简明中文 | 先讲可观察的结果，统一术语，保留条件、例外、数字和不确定性 |
| 按问题选图 | 界面对比、流程、时序、状态图按需选择，简单问题不强行配图 |
| 选择与后果联动 | 改选项后更新对应说明和状态演示，帮助读者比较代价 |
| 中文检查 | 识别中文句末标点和无空格长句，对中文、中英混排及英文分别给提示 |
| 保留原意 | 只报告可读性提示，不把 should 改为 must，不自动改写引文、代码或术语 |
| 可审阅依据 | 保留真实代码摘录、草图标记、批注、数据结构修改与反馈复制 |

这是借鉴简明技术写作原则的实现，**不是 ASD-STE100 合规检查器**。规则不能保证事实或方案正确；对术语一致性和语义仍需人工或模型复查。

## 本地体验示例

```powershell
git clone https://github.com/EuronSSR-01/SSR-SAY-SIMPLE.git
cd SSR-SAY-SIMPLE
node plugins/ssr-say-simple/skills/ssr-say-simple/runtime/pack.mjs plugins/ssr-say-simple/skills/ssr-say-simple/examples/retry-explainer-zh.html -o demo.packed.html
```

用浏览器打开 `demo.packed.html`。展开第一条，切换「用户手动重试 / 系统自动重试」，再展开对应分支，点状态图中的节点查看提示草图。示例使用虚构通知，不调用接口或真实计时。

原有餐厅界面计划示例保留在 `examples/codex-plan-zh.html`；它同样是虚构示例。

## 检查与限制

不需要 `npm install`。运行相关自动测试：

```powershell
node --test
```

打包器还支持 `--lint-only`、`--root <项目路径>` 和 `-o <输出文件>`。中文检查以每个汉字、每个非汉字单词或数字为一个单位；超过建议长度只提示，不阻止打包。结构错误仍会阻止输出。

生成的 HTML 离线运行；选择与批注尽力保存在当前浏览器本地，反馈以复制出的 Markdown 为准。不要加载远程资源。嵌入真实代码后，分享 HTML 也会分享该代码。文件读取范围和凭据保护沿用上游。

首版在 Windows、Node.js 24、Codex CLI 0.159.2 验证。macOS/Linux 未实测。语义表达属于技能指导，不是可确定保证的自动改写功能。

## 更新与卸载

```powershell
codex plugin marketplace upgrade ssr-say-simple-marketplace
codex plugin add ssr-say-simple@ssr-say-simple-marketplace
```

卸载：

```powershell
codex plugin remove ssr-say-simple@ssr-say-simple-marketplace
codex plugin marketplace remove ssr-say-simple-marketplace
```

这些命令不修改旧插件或你生成的计划文件。

## 来源与许可

Apache-2.0。基于 EuronSSR-01 的 SSR-HTML-PLAN-CODEX（`03d1a78`），其上游为 Anthropic 的 [html-plan](https://github.com/anthropics/claude-plugins-community/tree/f60f0454df3045f724c43c6346ec80bdcc3472b2/html-plan)。保留原有许可和修改说明，见 [LICENSE](LICENSE)、[NOTICE](NOTICE)。

简明写作参考 [ASD-STE100 官方说明](https://www.asd-ste100.org/STE_faq.html)；不分发其标准全文、词典或宣称官方认证。
