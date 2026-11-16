@echo off
echo Starting personal website server at http://127.0.0.1:8000 ...
start http://127.0.0.1:8000
node "%~dp0serve.cjs"
pause
