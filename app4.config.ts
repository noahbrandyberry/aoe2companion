// Experimental dark splash screen: https://expo.canny.io/feature-requests/p/dark-mode-splash-screen
const splash = {
  "image": "./app/assets/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#000000",
  "dark": {
    "image": "./app/assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#121212",
  },
};

export default {
  "expo": {
    "name": "AoE IV Companion",
    "description": "Track your AoE IV Definitive Edition games. This app fetches information about your games from aoeiv.net so you are always up-to-date.",
    "slug": "aoe4companion",
    "scheme": "aoe4companion",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    "extra": {
      "website": "aoe4companion.com",
      "experienceId": "@denniske1001/aoe4companion",
      "eas": {
        "projectId": "d8d79ec3-2477-4026-8c8a-456f79fc2f20",
      }
    },
    "userInterfaceStyle": "automatic",
    "jsEngine": "hermes",
    "runtimeVersion": process.env.RUNTIME_VERSION,
    "version": "10.0.0",
    "orientation": "portrait",
    "privacy": "public",
    "githubUrl": "https://github.com/denniske/aoe2companion",
    "icon": "./app4/assets/icon.png",
    "splash": splash,
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/d8d79ec3-2477-4026-8c8a-456f79fc2f20"
    },
    "assetBundlePatterns": [
      "node_modules/**",
      "app/assets/font/**",
      "app/assets/legal/**",
      "app/assets/translations/**",
      "app4/assets/civilizations/**",
      "app4/assets/maps/**",
      "app4/assets/strings/**",
      "app4/assets/*"
    ],
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./app4/assets/notification.png"
        }
      ]
    ],
    "android": {
      "userInterfaceStyle": "automatic",
      "package": "com.aoe4companion",
      "versionCode": 100000,
      "permissions": [],
      "googleServicesFile": "./google-services4.json",
      "splash": splash,
    },
    "ios": {
      "userInterfaceStyle": "automatic",
      "icon": "./app4/assets/icon-no-alpha.png",
      "bundleIdentifier": "com.aoe4companion",
      "buildNumber": "10.0.0",
      "supportsTablet": false,
      "config": {
        "usesNonExemptEncryption": false
      },
      "infoPlist": {
        "LSApplicationQueriesSchemes": ["itms-apps"]
      },
      "splash": splash,
    },
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "aoe4companion",
            "project": "aoe4companion"
          }
        }
      ]
    }
  }
};
