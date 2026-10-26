# huanNono 的笔记

Hugo + PaperMod 个人博客，预定地址：https://huannono.github.io/

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

正文使用 Markdown。生活随笔将分类换成 `生活`。图片放在该文章的目录里，正文用 `![图片说明](photo.jpg)` 引用。代码用三个反引号包围并标注语言。当前提供代码高亮；数学公式渲染尚未配置。

## 私人草稿

`draft: true` 仅控制生成网页，不会隐藏公开 GitHub 仓库中的文件。
私人文字放在 `private-notes/`（已忽略，不提交），公开前再移入 `content/posts/`。这个文件夹不会参与网站预览或构建。
Git 也会保留已提交文件的历史；公开前检查文章和图片。

## 修改网站

- 名称、简介、菜单：`hugo.yaml`
- 关于我：`content/about.md`
- 排版小调整：`assets/css/extended/custom.css`
- 固定主题版本：Git 子模块 `themes/PaperMod`，不要直接修改主题源码
- 自动发布：`.github/workflows/hugo.yaml`

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
