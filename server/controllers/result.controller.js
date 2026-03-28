const { db } = require('../firebase.admin');

const resultsCollection = db.collection('results');
const testsCollection = db.collection('tests');
const usersCollection = db.collection('users');

const getResult = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const querySnapshot = await resultsCollection.where('sessionId', '==', sessionId).limit(1).get();
        if (querySnapshot.empty) return res.status(404).json({ message: 'Result not found' });
        
        const resultDoc = querySnapshot.docs[0];
        const result = { _id: resultDoc.id, ...resultDoc.data() };

        // Manual populate for testId
        if (result.testId) {
            const testDoc = await testsCollection.doc(result.testId).get();
            if (testDoc.exists) result.testId = { _id: testDoc.id, ...testDoc.data() };
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching result', error: err.message });
    }
};

const getTestResults = async (req, res) => {
    const { testId } = req.params;
    try {
        const querySnapshot = await resultsCollection.where('testId', '==', testId).get();
        const results = await Promise.all(querySnapshot.docs.map(async doc => {
            const data = doc.data();
            const resObj = { _id: doc.id, ...data };
            // Manual populate for candidateId
            if (data.candidateId) {
                const userDoc = await usersCollection.doc(data.candidateId).get();
                if (userDoc.exists) {
                    const u = userDoc.data();
                    resObj.candidateId = { _id: userDoc.id, name: u.name, email: u.email };
                }
            }
            return resObj;
        }));
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching test results', error: err.message });
    }
};

const getLeaderboard = async (req, res) => {
    const { testId } = req.params;
    try {
        const querySnapshot = await resultsCollection.where('testId', '==', testId).limit(10).get();
        const results = await Promise.all(querySnapshot.docs.map(async doc => {
            const data = doc.data();
            const resObj = { _id: doc.id, ...data };
            if (data.candidateId) {
                const userDoc = await usersCollection.doc(data.candidateId).get();
                if (userDoc.exists) {
                    const u = userDoc.data();
                    resObj.candidateId = { _id: userDoc.id, name: u.name };
                }
            }
            return resObj;
        }));
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
    }
};

module.exports = { getResult, getTestResults, getLeaderboard };
