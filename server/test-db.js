const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { db } = require('./firebase.admin');

async function testConnection() {
    try {
        console.log("Attempting to connect to Firestore...");
        const snapshot = await db.collection('users').limit(1).get();
        console.log("Connection successful! Snapshot empty:", snapshot.empty);
        process.exit(0);
    } catch (err) {
        console.error("Firestore Error:", err.message);
        console.error("Stack:", err.stack);
        process.exit(1);
    }
}

testConnection();
