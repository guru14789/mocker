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
      const cleanPrivateKey = rawPrivateKey
        .replace(/^"|"$/g, '') // Remove wrapping quotes
        .replace(/\\n/g, '\n'); // Re-enable newlines

      const serviceAccount = {
        projectId: rawProjectId,
        privateKey: cleanPrivateKey,
        clientEmail: rawClientEmail,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: rawProjectId // Explicitly reinforce project ID
      });
      console.log('--- FIREBASE ADMIN: SUCCESSFUL INITIALIZATION ---');
    } else {
      console.warn('--- FIREBASE ADMIN: CREDENTIALS MISSING ---');
      admin.initializeApp();
    }
  }
  
  // Explicitly set projectId to avoid findAndCacheProjectId failures
  db = admin.firestore();
  if (process.env.FIREBASE_PROJECT_ID) {
      db.settings({ projectId: process.env.FIREBASE_PROJECT_ID });
  }
  auth = admin.auth();
} catch (error) {
  console.error('--- FIREBASE ADMIN: INITIALIZATION ERROR ---');
  console.error(error.message);
  db = null; // Ensure controllers see it is null
  auth = null;
}

module.exports = { admin, db, auth };
