# Clean Copy - ChatGPT 智能复制插件，粘贴得心应手

一个浏览器插件，用于优化 ChatGPT 等AI 对话内容的复制体验。支持自动转换 Markdown 格式，根据粘贴环境智能适配富文本或纯文本格式。

代码开源，期待感兴趣的小伙伴一起共创，支持更多的 AI 平台。（比如 Claude.ai \ Perplexity.ai 、Google Gemini 等）

已上架 Chrome 应用商店，[免费下载](https://chromewebstore.google.com/detail/clean-copy-%E7%AE%80%E5%87%80%E5%A4%8D%E5%88%B6%EF%BC%8C%E5%A4%8D%E5%88%B6%E5%87%BA%E6%9B%B4%E5%B9%B2%E5%87%80%E7%9A%84-g/jbdmbmgkjmigfnfiibojpmcmfbaclnbn)

预览图：
![image](https://github.com/user-attachments/assets/2282fa14-5b6c-4da5-bbc1-3430930fd026)


## 功能特点

- 🎯 智能复制按钮：在 ChatGPT 对话界面添加专用的复制按钮
- 📝 格式智能转换：自动识别并转换 Markdown 格式
- 🔄 双格式支持：同时生成富文本和纯文本格式
- 🎨 智能粘贴：根据目标编辑器自动选择合适的格式
- ⚡️ 快速开关：通过浏览器工具栏快速启用/禁用插件

## 实现机制

### 复制原理
- 利用 `ClipboardItem` API 同时支持富文本和纯文本格式
- 直接使用 ChatGPT 渲染好的 HTML 内容，确保格式完全一致
- 智能清理 Markdown 标记，生成干净的纯文本版本

### 平台适配
- 富文本环境（如 Mac 备忘录、飞书文档）：
  - 自动选择 HTML 格式
  - 完整保留文本样式（加粗、斜体等）
  - 保持字体和样式的一致性
- 纯文本环境（如微信、代码编辑器）：
  - 自动选择纯文本格式
  - 智能移除所有格式标记
  - 保持文本的整洁性

### 用户体验
- 复制按钮位于操作栏末端，避免干扰原有功能
- 鼠标悬停时显示功能提示
- 复制时提供视觉反馈
- 操作结果有清晰的成功/失败提示

### 支持的 Markdown 语法

- 文本格式化（加粗、斜体）
- 标题（H1-H6）
- 列表（有序、无序）
- 引用
- 代码块
- 链接

## 安装方法

1. 下载项目代码
2. 打开 Chrome 扩展管理页面 (`chrome://extensions/`)
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目目录

## 使用办法

1. 在 ChatGPT 对话页面中，每条回复下方会出现 Clean Copy 按钮
2. 点击按钮即可复制内容
3. 粘贴到目标位置时会自动使用合适的格式
4. 可通过浏览器工具栏的插件图标快速开关功能

### 平台兼容性

- 微信对话框 - 纯文本
- Mac 备忘录 - 富文本
- 飞书文档 - 富文本
- Sublime Text - 纯文本

## 项目结构 
clean-copy/
├── manifest.json # 插件配置文件
├── src/
│ ├── content/ # content script
│ │ ├── index.js # 主要逻辑
│ │ └── styles.css # 样式文件
│ ├── popup/ # 弹出窗口
│ │ ├── popup.html # 弹窗页面
│ │ ├── popup.css # 弹窗样式
│ │ └── popup.js # 弹窗逻辑
│ └── assets/ # 资源文件
└── icons/ # 插件图标

## 开发

### 环境要求

- Chrome 浏览器
- Node.js (可选，用于开发)

### 本地开发

1. 克隆仓库：
```bash
git clone [repository-url]
cd clean-copy
```

2. 在 Chrome 中加载插件：
- 打开 `chrome://extensions/`
- 开启"开发者模式"
- 点击"加载已解压的扩展程序"
- 选择项目目录

3. 修改代码后刷新插件即可看到效果

## 贡献指南

欢迎提交 Pull Request 或创建 Issue。

## 许可证

MIT License

## 更新日志

### v0.1.0
- 初始版本
- 实现基础复制功能
- 支持 ChatGPT 网站
- 支持核心 Markdown 语法转换
- 优化复制机制，直接使用渲染后的 HTML
