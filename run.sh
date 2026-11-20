#!/usr/bin/env sh
# Code Arcade — Khởi chạy server tĩnh & mở trình duyệt (Linux / macOS)
cd "$(dirname "$0")" || exit 1
PORT=8000

# Kiểm tra nếu cổng 8000 đang bận, đổi sang 8080
if command -v lsof >/dev/null 2>&1; then
  if lsof -i :$PORT >/dev/null 2>&1; then
    PORT=8080
  fi
fi

URL="http://localhost:$PORT"
echo "🎮 Khởi chạy Code Arcade tại $URL ..."

( sleep 1; (xdg-open "$URL" || open "$URL") >/dev/null 2>&1 ) &

if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  python -m http.server "$PORT"
else
  echo "Vui lòng cài đặt Python hoặc mở trực tiếp index.html bằng trình duyệt!"
fi
