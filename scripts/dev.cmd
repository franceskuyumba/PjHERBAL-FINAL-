@echo off
setlocal
rem PJHERBAL dev launcher - finds the portable Node and starts the dev server.
set "ROOT=%~dp0.."
set "PATH=%ROOT%\.node;%PATH%"
cd /d "%ROOT%"

rem If the dev server hangs on a stale cache, pass "clean" to reset .next first.
if /i "%~1"=="clean" (
  echo Cleaning .next cache...
  if exist ".next" rmdir /s /q ".next"
)

node node_modules\next\dist\bin\next dev
