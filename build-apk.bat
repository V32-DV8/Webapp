@echo off
REM AurumTask APK Build Script for Windows
REM Usage: build-apk.bat [debug|release]

setlocal enabledelayedexpansion

set BUILD_TYPE=%1
if "%BUILD_TYPE%"=="" set BUILD_TYPE=debug

echo.
echo   ========================================
echo       AurumTask APK Builder
echo   ========================================
echo.

REM Step 1: Build web app
echo [1/5] Building web app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Web build failed!
    exit /b 1
)
echo [OK] Web app built successfully
echo.

REM Step 2: Check for Android platform
if not exist "android" (
    echo [2/5] Adding Android platform...
    call npx cap add android
) else (
    echo [2/5] Android platform already exists, skipping...
)
echo.

REM Step 3: Sync web assets
echo [3/5] Syncing web assets to Android...
call npx cap sync android
echo [OK] Assets synced
echo.

REM Step 4: Build APK
echo [4/5] Building %BUILD_TYPE% APK...
cd android

if "%BUILD_TYPE%"=="release" (
    call gradlew.bat assembleRelease
    set APK_PATH=app\build\outputs\apk\release\app-release.apk
) else (
    call gradlew.bat assembleDebug
    set APK_PATH=app\build\outputs\apk\debug\app-debug.apk
)

cd ..

REM Step 5: Report
echo [5/5] Build complete!
echo.
echo ==========================================

if exist "android\%APK_PATH%" (
    echo [OK] APK built successfully!
    echo   Location: android\%APK_PATH%
    echo.
    echo To install on device:
    echo   adb install android\%APK_PATH%
    echo.
    echo To open in Android Studio:
    echo   npx cap open android
) else (
    echo [ERROR] APK not found. Check build logs above.
    exit /b 1
)

echo ==========================================
echo.

endlocal
