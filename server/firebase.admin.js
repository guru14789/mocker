const path = require('path');
const admin = require('firebase-admin');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

let db = null;
let auth = null;

try {
  if (!admin.apps.length) {
    const rawProjectId = process.env.FIREBASE_PROJECT_ID;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
    const rawClientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (rawProjectId && rawPrivateKey && rawClientEmail) {
      // Clean the private key (remove quotes and handle escaped newlines)
      let cleanPrivateKey = rawPrivateKey.trim();
      
      // Remove wrapping quotes if they exist
      if (cleanPrivateKey.startsWith('"') && cleanPrivateKey.endsWith('"')) {
        cleanPrivateKey = cleanPrivateKey.substring(1, cleanPrivateKey.length - 1);
      }
      
      // Replace literal \n with actual newlines
      cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');

      const serviceAccount = {
        projectId: rawProjectId,
        privateKey: cleanPrivateKey,
        clientEmail: rawClientEmail,
      };

      console.log('--- FIREBASE ADMIN: ATTEMPTING INITIALIZATION ---');
      console.log('Project ID:', rawProjectId);
      console.log('Client Email:', rawClientEmail);
      console.log('Key length:', cleanPrivateKey.length);
      console.log('Key start:', cleanPrivateKey.substring(0, 50));
      console.log('Key end:', cleanPrivateKey.substring(cleanPrivateKey.length - 50));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('--- FIREBASE ADMIN: SUCCESSFUL INITIALIZATION ---');
    } else {
      console.warn('--- FIREBASE ADMIN: CREDENTIALS MISSING, USING DEFAULT ---');
      admin.initializeApp();
    }
  }
  
  db = admin.firestore();
  auth = admin.auth();
} catch (error) {
  console.error('--- FIREBASE ADMIN: INITIALIZATION ERROR ---');
  console.error(error);
  db = null;
  auth = null;
}

module.exports = { admin, db, auth };
