@echo off
title LOGOVO site - http://127.0.0.1:8787/
cd /d "%~dp0"
start "LOGOVO site" /min "C:\Users\?????\AppData\Roaming\Xiaomi MiMo AI\resources\runtimes\win32-x64\python\python.exe" serve.py
start "" http://127.0.0.1:8787/
timeout /t 5 >nul
