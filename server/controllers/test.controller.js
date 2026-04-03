const crypto = require('crypto');
const { db } = require('../firebase.admin');

const testsCollection = db.collection('tests');
const questionsCollection = db.collection('questions');

const createTest = async (req, res) => {
    const { title, description, duration, maxParticipants, negativeMark, examType, questions } = req.body;
    try {
        const testData = {
            creatorId: req.user.id,
            title,
            description,
            duration,
            maxParticipants,
            negativeMark,
            examType: examType || 'computer-based',
            uniqueLink: crypto.randomUUID().slice(0, 8),
            status: 'draft',
            createdAt: new Date().toISOString()
        };
        const testDoc = await testsCollection.add(testData);

        let createdQuestions = [];
        if (questions && questions.length > 0) {
            const batch = db.batch();
            questions.forEach(q => {
                const qDoc = questionsCollection.doc();
                batch.set(qDoc, { ...q, testId: testDoc.id });
                createdQuestions.push({ _id: qDoc.id, ...q, testId: testDoc.id });
            });
            await batch.commit();
        }

        res.status(201).json({ test: { _id: testDoc.id, ...testData }, questions: createdQuestions });
    } catch (err) {
        console.error('Create test error:', err);
        res.status(500).json({ message: 'Error creating test', error: err.message });
    }
};

const getTests = async (req, res) => {
    try {
        const querySnapshot = await testsCollection.where('creatorId', '==', req.user.id).get();
        const tests = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.status(200).json(tests);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tests', error: err.message });
    }
};

const getTest = async (req, res) => {
    try {
        const testDoc = await testsCollection.doc(req.params.id).get();
        if (!testDoc.exists) return res.status(404).json({ message: 'Test not found' });
        
        const questionsSnapshot = await questionsCollection.where('testId', '==', req.params.id).get();
        const questions = questionsSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.status(200).json({ test: { _id: testDoc.id, ...testDoc.data() }, questions });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching test', error: err.message });
    }
};

const updateTest = async (req, res) => {
    const { questions, ...testData } = req.body;
    try {
        await testsCollection.doc(req.params.id).update(testData);
        
        let updatedQuestions = [];
        if (questions) {
            // Firestore doesn't have deleteMany by query easily without a loop or batch
            const oldQuestionsSnapshot = await questionsCollection.where('testId', '==', req.params.id).get();
            const batch = db.batch();
            oldQuestionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
            
            if (questions.length > 0) {
                questions.forEach(q => {
                    const qDoc = questionsCollection.doc();
                    const { id, _id, ...cleanQ } = q; // remove old ids
                    batch.set(qDoc, { ...cleanQ, testId: req.params.id });
                    updatedQuestions.push({ _id: qDoc.id, ...cleanQ, testId: req.params.id });
                });
            }
            await batch.commit();
        }
        res.status(200).json({ test: { _id: req.params.id, ...testData }, questions: updatedQuestions });
    } catch (err) {
        console.error('Update test error:', err);
        res.status(500).json({ message: 'Error updating test and questions', error: err.message });
    }
};

const publishTest = async (req, res) => {
    try {
        await testsCollection.doc(req.params.id).update({ status: 'published', publishedAt: new Date().toISOString() });
        res.status(200).json({ _id: req.params.id, status: 'published' });
    } catch (err) {
        res.status(500).json({ message: 'Error publishing test', error: err.message });
    }
};

const getTestByLink = async (req, res) => {
    try {
        const querySnapshot = await testsCollection.where('uniqueLink', '==', req.params.link).where('status', '==', 'published').limit(1).get();
        if (querySnapshot.empty) return res.status(404).json({ message: 'Exam not found or not published' });
        
        const testDoc = querySnapshot.docs[0];
        const questionsSnapshot = await questionsCollection.where('testId', '==', testDoc.id).get();
        const questions = questionsSnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.status(200).json({ test: { _id: testDoc.id, ...testDoc.data() }, questions });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching test', error: err.message });
    }
};

const getPublishedTests = async (req, res) => {
    try {
        const querySnapshot = await testsCollection.where('status', '==', 'published').get();
        const tests = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
        res.status(200).json(tests);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching published tests', error: err.message });
    }
};

module.exports = { createTest, getTests, getTest, updateTest, publishTest, getTestByLink, getPublishedTests };
