@echo off
setlocal enabledelayedexpansion
set showDir=0

goto :init

:interface
if !showDir! equ 0 (
    set /p src=:~$ 
) else (
    set /p src=!cd!:~$ 
)

%src%

call :interface

:toggle
if !%1! equ 0 (
    set %1=1
) else if !%1! equ 1 (
    set %1=0
) else if !%1! equ true (
    set %1=false
) else if !%1! equ false (
    set %1=true
)
exit /b




:init
call :toggle showDir
call :interface