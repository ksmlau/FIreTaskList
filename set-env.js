require('dotenv').config()

const fs = require('fs');

const environment = process.env.ENVIRONMENT || 'dev';
const isProd = environment === 'prod';

const targetPath = isProd
  ? './src/environments/environment.prod.ts'
  : './src/environments/environment.ts';

const envConfigFile = `
export const environment = {
  production: ${isProd},
  firebase: {
    apiKey: '${process.env.ANG_APP_FIREBASE_API_KEY}',
    authDomain: '${process.env.ANG_APP_FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.ANG_APP_FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.ANG_APP_FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.ANG_APP_FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.ANG_APP_FIREBASE_APP_ID}',
    measurementId: '${process.env.ANG_APP_FIREBASE_MEASUREMENT_ID}'
  }
};
`;

fs.writeFileSync(targetPath, envConfigFile, 'utf8');

console.log(`Output generated at ${targetPath}`);