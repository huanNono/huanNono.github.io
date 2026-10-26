#!/bin/zsh
set -e
cd "${0:A:h}"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
read "post_slug?文章英文短名（例如 my-first-note）："
if [[ ! "$post_slug" =~ '^[a-z0-9]+(-[a-z0-9]+)*$' ]]; then
  echo "请使用小写英文字母、数字和中间的短横线。"
  read "?按回车结束…"
  exit 1
fi
hugo new content "posts/$post_slug/index.md"
open -R "content/posts/$post_slug/index.md"
echo "已创建草稿。打开 index.md 写作，准备公开时将 draft 改为 false。"
echo "公开仓库中的草稿源码仍然公开；私人笔记请存入 private-notes。"
read "?按回车结束…"
