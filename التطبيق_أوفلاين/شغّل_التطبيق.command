#!/bin/bash
cd "$(dirname "$0")"
echo "🐚 صدفة الصوت — يعمل بلا إنترنت. اتركي هذه النافذة مفتوحة."
( sleep 1 ; open "http://localhost:8000/avatar_vrm.html" ) &
python3 -m http.server 8000
