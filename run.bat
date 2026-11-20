@echo off
rem Code Arcade — Khởi chạy server tĩnh & mở trình duyệt (Windows)
cd /d "%~dp0"
set PORT=8000
echo Khởi chạy Code Arcade tại http://localhost:%PORT% ...
start "" "http://localhost:%PORT%"
where py >nul 2>nul && (py -m http.server %PORT%) || (python -m http.server %PORT%)
