# YOYO

Hugo + PaperMod 个人博客，地址：https://huannono.github.io/

## 平时怎么写

1. 双击 `new-post.command`，输入英文短名，如 `my-first-note`。
2. 用 VS Code 或其他文本编辑器打开 `content/posts/my-first-note/index.md`。
3. 修改标题、分类、标签，填写正文。两篇初始文章是建站时准备的起始内容，可以直接修改或删除。
4. 双击 `preview.command`，打开 http://localhost:1313/ 查看效果；保存文件后会自动刷新。预览包含草稿。
5. 准备公开时将 `draft: true` 改为 `draft: false`；文章日期不要设到未来。
6. 双击 `publish.command`，检查列出的改动，输入 `yes` 后提交。到仓库 Actions 页面确认部署成功。

若 macOS 不允许直接打开 `.command`，可从终端进入项目文件夹后运行 `zsh preview.command` 等命令。

## 文章格式

```yaml
---
title: "文章标题"
date: 2026-10-26T08:00:00+08:00
slug: my-first-note
categories: ["学习"]
tags: ["计算机网络"]
description: "一句话摘要"
draft: true
---
```

正文使用 Markdown。生活随笔将分类换成 `生活`。图片放在该文章的目录里，正文用 `![图片说明](photo.jpg)` 引用。代码用三个反引号包围并标注语言。代码块自动提供高亮、行号和复制按钮；数学公式渲染尚未配置。

## 阅读博文

`content/posts/` 中的文章会自动使用阅读页布局，无需修改模板。

- 桌面：宽正文搭配右侧固定目录；滚动时高亮当前章节，点击目录可跳转。
- 手机：目录默认收起，点击“文章目录”展开；选择章节后自动收起。
- 顶栏向下滚动时收起，向上滚动时显示；右下角显示阅读进度，点击返回顶部。
- 代码有语言标记、行号和复制按钮；超过 12 行默认折叠，可展开和收起。复制结果不包含行号。
- 文末自动生成标题、文章地址、作者、发布日期、版权说明，并提供复制链接、二维码和分享到 X；上下篇按文章日期排列。
- 二维码由 Hugo 在构建时生成，无需第三方服务。关闭 JavaScript 时正文、代码和目录仍可阅读，代码完整展开。

目录来自 Markdown 标题 `##`、`###` 等。文章不需要目录时，在头部添加 `showtoc: false`。如需显示更新时间，可填写真实的 `lastmod`。版权说明默认为“版权归作者所有”，可通过文章头部的 `articleCopyright` 自定义。

阅读页样式在 `assets/css/extended/reader.css`，交互在 `assets/js/reader.js`，模板在 `layouts/posts/page.html`。布局参考 [Arthals 的 Bomb Lab 文章](https://arthals.ink/blog/bomb-lab)，保留本站的内容和导航。

## 私人草稿

`draft: true` 仅控制生成网页，不会隐藏公开 GitHub 仓库中的文件。
私人文字放在 `private-notes/`（已忽略，不提交），公开前再移入 `content/posts/`。这个文件夹不会参与网站预览或构建。
Git 也会保留已提交文件的历史；公开前检查文章和图片。

## 修改首页

首页结构：头像与昵称 → Profile 自我介绍 → 最近 4 篇文章 → Works 摄影 → 社交账号。

- 网站标题、作者、菜单：`hugo.yaml`
- 昵称、头像路径、自我介绍：`data/home.yaml`
- 头像文件：`static/images/avatar.jpg`，初始头像来自现有 GitHub 账号
- GitHub、X、Instagram、bilibili：`data/social.yaml`，填入自己的完整个人主页链接。空链接显示“待添加”，不会跳到错误页面
- About、Project、Share、Links：`content/` 中对应的 Markdown 文件
- 排版：`assets/css/extended/custom.css`
- 首页与组件模板：`layouts/`；主题 `themes/PaperMod` 不需要修改

`Posts` 自动取最近 4 篇文章；目前只有 2 篇，实际显示 2 篇。完整文章、分类、归档与搜索入口均保留。

### 放入自己的摄影作品

1. 将图片放到 `static/images/works/`（没有这个文件夹时创建它）。
2. 编辑 `data/photography.yaml`，把 `photos: []` 换成如下结构，并使用真实文件名与说明：

```yaml
photos:
  - src: /images/works/my-photo.jpg
    title: 照片标题
    alt: 画面内容的文字描述
    detail: 地点或拍摄日期（可省略）
    position: center # 可省略；如需调整缩略图构图可用 50% 30%
```

列表最前面的 4 张出现在首页，`/works/` 显示全部。点击照片可查看原图。没有照片时显示 4 个明确标注“照片待收录”的位置。发布前建议导出适合网页的尺寸，并检查照片隐私信息。

### 技术说明

首页使用 Hugo 的 `layouts/home.html` 覆盖模板（[Hugo 模板文档](https://gohugo.io/templates/types/)）。博文使用独立阅读页模板；搜索与主题切换继续使用 PaperMod。`layouts/baseof.html` 为页脚缓存加入文章分区，保证阅读页脚本只在博文页加载。固定主题版本由 Git 子模块记录，自动发布在 `.github/workflows/hugo.yaml`。

## 本地命令

```sh
hugo server -D
hugo --gc --minify --panicOnWarning
python3 scripts/check-site.py
```

使用 Hugo 0.168.0；GitHub Actions 固定相同版本。首次在另一台电脑下载：

```sh
git clone --recurse-submodules https://github.com/huanNono/huanNono.github.io.git
```

Mac 可使用 `brew install hugo gh` 安装工具。发布前需要 `gh auth login` 和 `gh auth setup-git`。

## GitHub Pages

仓库应为公开的 `huanNono/huanNono.github.io`，Settings → Pages → Source 选择 GitHub Actions。
推送 main 会自动构建、检查和发布；Pull Request 只构建检查，不发布。
默认不生成草稿、未来日期文章；`public/` 是生成结果，不提交。
构建工具和主题版本固定，升级时先本地构建并检查。

## 参考

- https://gohugo.io/documentation/
- https://github.com/adityatelange/hugo-PaperMod/wiki
- https://gohugo.io/host-and-deploy/deploy-to-github-pages/

PaperMod 保留其 MIT 许可证；文章版权归作者。站点没有配置评论、统计追踪或第三方字体。
