#!/bin/bash

# AurumTask APK Build Script
# Usage: ./build-apk.sh [debug|release]

set -e

BUILD_TYPE=${1:-debug}
GREEN='\033[0;32m'
GOLD='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GOLD}"
echo "  ╔══════════════════════════════════════╗"
echo "  ║     ⚡ AurumTask APK Builder ⚡      ║"
echo "  ╚══════════════════════════════════════╝"
echo -e "${NC}"

# Step 1: Build web app
echo -e "${GREEN}[1/5]${NC} Building web app..."
npm run build
echo -e "${GREEN}✓${NC} Web app built successfully"

# Step 2: Initialize Capacitor (if not already done)
if [ ! -d "android" ]; then
    echo -e "${GREEN}[2/5]${NC} Adding Android platform..."
    npx cap add android
else
    echo -e "${GREEN}[2/5]${NC} Android platform already exists, skipping..."
fi

# Step 3: Sync web assets
echo -e "${GREEN}[3/5]${NC} Syncing web assets to Android..."
npx cap sync android
echo -e "${GREEN}✓${NC} Assets synced"

# Step 4: Build APK
echo -e "${GREEN}[4/5]${NC} Building ${BUILD_TYPE} APK..."
cd android

if [ "$BUILD_TYPE" = "release" ]; then
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
else
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

cd ..

# Step 5: Report
echo -e "${GREEN}[5/5]${NC} Build complete!"
echo ""
echo -e "${GOLD}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✓ APK built successfully!${NC}"
echo -e "  Location: android/${APK_PATH}"
echo ""

# Check if APK exists
if [ -f "android/${APK_PATH}" ]; then
    APK_SIZE=$(du -h "android/${APK_PATH}" | cut -f1)
    echo -e "  Size: ${APK_SIZE}"
    echo ""
    echo -e "${GOLD}To install on device:${NC}"
    echo -e "  adb install android/${APK_PATH}"
    echo ""
    echo -e "${GOLD}To open in Android Studio:${NC}"
    echo -e "  npx cap open android"
else
    echo -e "${RED}✗ APK not found. Check build logs above.${NC}"
    exit 1
fi

echo -e "${GOLD}═══════════════════════════════════════${NC}"
