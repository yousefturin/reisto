import 'dotenv/config';


export default {
  "expo": {
    "name": "reisto",
    "slug": "reisto",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/icon.png"
    },
    "plugins":[
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ],
      [
        "expo-font"
      ]
    ],
    "extra": {
      "FIREBASE_API_KEY": process.env.FIREBASE_API_KEY, 
      "FIREBASE_AUTH_DOMAIN": process.env.FIREBASE_AUTH_DOMAIN,
      "FIREBASE_PROJECT_ID": process.env.FIREBASE_PROJECT_ID,
      "FIREBASE_STORAGE_BUCKET": process.env.FIREBASE_STORAGE_BUCKET,
      "FIREBASE_MESSAGING_SENDER_ID": process.env.FIREBASE_MESSAGING_SENDER_ID,
      "FIREBASE_APP_ID": process.env.FIREBASE_APP_ID,
      "FIREBASE_MEASUREMENT_ID": process.env.FIREBASE_MEASUREMENT_ID 
    }
  }
}
