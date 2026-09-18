# Building v32 task as Android APK

## Complete Guide to Convert Your Web App to Android

### Prerequisites

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - During installation, ensure "Android SDK" and "Android SDK Platform" are checked
   - After installation, open Android Studio and go to Settings > Languages & Frameworks > Android SDK
   - Install Android SDK Platform 33 or higher
   - Install Android SDK Build-Tools

2. **Set Environment Variables**
   Add to your `~/.bashrc` or `~/.zshrc`:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   ```

3. **Verify Installation**
   ```bash
   adb --version
   sdkmanager --version
   ```

---

## Step-by-Step Build Process

### 1. Initialize Capacitor (Already Done)

Capacitor packages are already installed. Now initialize:

```bash
npx cap init
```

When prompted:
- **App name:** v32 task
- **App ID:** com.aurumtask.app (or your preferred package name)
- **Web directory:** dist

### 2. Build the Web App

```bash
npm run build
```

This creates the `dist/` folder with your production-ready web app.

### 3. Add Android Platform

```bash
npx cap add android
```

This creates the `android/` directory with native Android project files.

### 4. Sync Web Assets to Android

```bash
npx cap sync android
```

This copies your built web assets into the Android project.

### 5. Open in Android Studio

```bash
npx cap open android
```

Android Studio will open with your project.

### 6. Configure Android Project

In Android Studio:

#### a) Update App Icon (Optional but Recommended)
- Right-click on `app/src/main/res` > New > Image Asset
- Select your icon image (1024x1024 PNG recommended)
- Configure foreground and background
- Click Next > Finish

#### b) Update App Name
- Edit `android/app/src/main/res/values/strings.xml`
- Change `<string name="app_name">v32 task</string>`

#### c) Configure Splash Screen (Optional)
- Install Capacitor Splash Screen plugin:
  ```bash
  npm install @capacitor/splash-screen
  npx cap sync
  ```
- Add to `capacitor.config.json`:
  ```json
  {
    "plugins": {
      "SplashScreen": {
        "launchShowDuration": 2000,
        "backgroundColor": "#000000",
        "showSpinner": false,
        "androidScaleType": "CENTER_CROP"
      }
    }
  }
  ```

#### d) Set App Permissions (if needed)
Edit `android/app/src/main/AndroidManifest.xml` and add permissions before `<application>`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### 7. Build APK

#### Option A: Debug APK (For Testing)
In Android Studio:
- Menu: Build > Build Bundle(s) / APK(s) > Build APK(s)
- Wait for build to complete
- Click "locate" in the notification to find the APK
- APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

Or via command line:
```bash
cd android
./gradlew assembleDebug
```

#### Option B: Release APK (For Distribution)
In Android Studio:
1. Menu: Build > Generate Signed Bundle / APK
2. Select "APK" > Next
3. Create or select keystore:
   - Click "Create new..."
   - Set path: `android/app/keystore.jks`
   - Set password (remember this!)
   - Set Key Alias: `aurumtask-key`
   - Set Key Password (remember this!)
   - Validity: 25 years
   - Certificate: Fill in your details
   - Click OK > Next
4. Select "release" > Next
5. Click "Finish"
6. APK location: `android/app/build/outputs/apk/release/app-release.apk`

Or via command line:
```bash
cd android
./gradlew assembleRelease
```

### 8. Install on Device

#### Via USB:
1. Enable Developer Options on Android phone:
   - Settings > About Phone > Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings > Developer Options > USB Debugging
3. Connect phone via USB
4. Install APK:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

#### Via Android Studio:
1. Connect device or start emulator
2. Click the green "Run" button (▶) in Android Studio
3. Select target device
4. Click OK

---

## Updating Your App

When you make changes to your web app:

```bash
# 1. Rebuild web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Rebuild APK
cd android
./gradlew assembleDebug
```

---

## Common Issues & Solutions

### Issue: "SDK location not found"
**Solution:** Create `android/local.properties`:
```
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

### Issue: Gradle build fails
**Solution:** 
```bash
cd android
./gradlew clean
./gradlew build
```

### Issue: App crashes on launch
**Solution:** Check `adb logcat` for errors:
```bash
adb logcat | grep "v32 task"
```

### Issue: White screen on launch
**Solution:** Ensure `npm run build` completed successfully and `dist/` folder exists before running `npx cap sync`.

---

## Publishing to Google Play Store

### 1. Create Signed Release APK/AAB
```bash
cd android
./gradlew bundleRelease  # Creates AAB (required for Play Store)
```

### 2. Prepare Store Listing
- App icon: 512x512 PNG
- Feature graphic: 1024x500 PNG
- Screenshots: At least 2 phone screenshots
- Description: Short (80 chars) and Full (4000 chars)
- Category: Productivity
- Contact email and website

### 3. Upload to Play Console
1. Go to https://play.google.com/console
2. Create new app
3. Fill in store listing
4. Upload AAB file from `android/app/build/outputs/bundle/release/`
5. Set pricing and distribution
6. Submit for review

---

## Alternative: PWA Builder (Easier but Less Control)

If you want a simpler approach:

1. Add PWA manifest to your app (already configured in Vite)
2. Build and deploy to a URL (e.g., Vercel, Netlify)
3. Use https://www.pwabuilder.com/
4. Enter your URL
5. Download generated APK

**Note:** PWA approach has limited native features but is much simpler.

---

## Testing Checklist

Before distributing:
- [ ] Test on multiple screen sizes
- [ ] Test offline functionality (localStorage persistence)
- [ ] Test all animations and interactions
- [ ] Verify dark theme on AMOLED screens
- [ ] Test keyboard shortcuts (may not work on mobile)
- [ ] Check app size (should be < 50MB ideally)
- [ ] Test installation and uninstallation
- [ ] Verify data persistence after app restart

---

## Performance Tips

1. **Reduce APK Size:**
   - Enable ProGuard in `android/app/build.gradle`:
     ```gradle
     buildTypes {
         release {
             minifyEnabled true
             proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
         }
     }
     ```

2. **Optimize Web Assets:**
   - Already done: Vite bundles and minifies automatically
   - Consider lazy loading for routes (future enhancement)

3. **Enable Hardware Acceleration:**
   Already enabled by default in Capacitor

---

## Next Steps

After building your APK:
1. Test thoroughly on real devices
2. Get feedback from beta testers
3. Consider adding native features:
   - Push notifications: `@capacitor/push-notifications`
   - Camera access: `@capacitor/camera`
   - File system: `@capacitor/filesystem`
4. Submit to Google Play Store
5. Set up CI/CD for automated builds (GitHub Actions + Fastlane)

---

## Quick Reference Commands

```bash
# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Build debug APK
cd android && ./gradlew assembleDebug

# Build release APK
cd android && ./gradlew assembleRelease

# Install on connected device
adb install android/app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat

# Clean build
cd android && ./gradlew clean
```

---

## Resources

- Capacitor Docs: https://capacitorjs.com/docs
- Android Developer Guide: https://developer.android.com/guide
- Play Console Help: https://support.google.com/googleplay/android-developer

---

**Need Help?**
If you encounter issues, check:
1. Android Studio build logs
2. `adb logcat` output
3. Capacitor documentation
4. Stack Overflow (tag: capacitor)
