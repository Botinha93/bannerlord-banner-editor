setlocal enableDelayedExpansion
for /f "eol=* delims=" %%i in ('dir /s /b "r:\*.png"') do (
    set "name=%%~nxi"
    convert "%%i" "!name:png=!"
)