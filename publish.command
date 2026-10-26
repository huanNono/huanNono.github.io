#!/bin/zsh
set -e
cd "${0:A:h}"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
hugo --gc --minify --panicOnWarning
python3 scripts/check-site.py
git status --short
echo "上面列出的文件会提交到公开仓库（包含 draft: true 的文章源码）。"
read "publish_answer?确认这些文件可以公开？输入 yes 发布："
[[ "$publish_answer" == yes ]] || exit 0
git add hugo.yaml .gitignore .gitmodules archetypes assets content static themes scripts .github README.md preview.command new-post.command publish.command
if ! git diff --cached --quiet; then
  git commit -m "Update blog content"
fi
git push origin main
echo "已提交。GitHub Actions 会自动部署，请等待运行结果。"
echo "https://github.com/huanNono/huanNono.github.io/actions"
read "?按回车结束…"
