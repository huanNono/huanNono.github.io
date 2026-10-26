#!/bin/zsh
set -e
cd "${0:A:h}"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v hugo >/dev/null; then
  echo "请先安装 Hugo：brew install hugo"
  read "?按回车结束…"
  exit 1
fi
echo "预览地址：http://localhost:1313/ （包括草稿）"
echo "保持此窗口打开；按 Control+C 停止预览。"
hugo server -D --bind 127.0.0.1
