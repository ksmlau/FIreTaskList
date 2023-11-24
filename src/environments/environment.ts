export const environment = {
  production: true,
  firebase: {
    apiKey: process.env.ANG_APP_FIREBASE_API_KEY,
    authDomain: process.env.ANG_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.ANG_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.ANG_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.ANG_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.ANG_APP_FIREBASE_APP_ID,
    measurementId: process.env.ANG_APP_FIREBASE_MEASUREMENT_ID
  }
};