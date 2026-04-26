const { db, admin } = require('../firebase.admin');

const sessionsCollection = db.collection('sessions');
const testsCollection = db.collection('tests');
const questionsCollection = db.collection('questions');
const resultsCollection = db.collection('results');

const SAMPLE_QUESTIONS = [
    { title: 'React Fragments', marks: 2, correctAnswers: ['B'] },
    { title: 'useEffect Hook', marks: 2, correctAnswers: ['C'] },
    { title: 'useMemo Hook', marks: 3, correctAnswers: ['B'] },
    { title: 'Key Prop', marks: 2, correctAnswers: ['C'] },
    { title: 'Update State', marks: 3, correctAnswers: ['B'] }
];

const startSession = async (req, res) => {
    const { testId } = req.body;
    try {
        const testDoc = await testsCollection.doc(testId).get();
        if (!testDoc.exists) return res.status(404).json({ message: 'Test not found' });

        const sessionData = {
            testId,
            candidateId: req.user.id,
            startTime: new Date().toISOString(),
            status: 'active',
            violations: 0
        };
        const sessionDoc = await sessionsCollection.add(sessionData);
        res.status(201).json({ session: { _id: sessionDoc.id, ...sessionData } });
    } catch (err) {
        console.error('Start session error:', err);
        // Fallback for demo
        const mockSession = {
            _id: `mock-session-${Date.now()}`,
            testId,
            candidateId: req.user?.id || 'mock-user',
            startTime: new Date().toISOString(),
            status: 'active',
            violations: 0
        };
        res.status(201).json({ session: mockSession });
    }
};

const logViolation = async (req, res) => {
    const { sessionId } = req.params;
    const { type, count } = req.body;
    try {
        await sessionsCollection.doc(sessionId).update({
            violations: admin.firestore.FieldValue.increment(1)
        });
        res.status(200).json({ success: true });
    } catch (err) {
        console.warn('Error logging violation, continuing in mock mode:', err.message);
        res.status(200).json({ success: true, mock: true });
    }
};

const submitExam = async (req, res) => {
    const { sessionId } = req.params;
    const { answers } = req.body; // Map: { questionIdx: 'A' }
    try {
        const endTime = new Date().toISOString();
        let session = { testId: 'mock-test', candidateId: req.user?.id || 'mock-user' };
        let questions = SAMPLE_QUESTIONS;

        // Try to get real data from DB
        try {
            await sessionsCollection.doc(sessionId).update({ status: 'submitted', endTime });
            const sessionDoc = await sessionsCollection.doc(sessionId).get();
            if (sessionDoc.exists) {
                session = sessionDoc.data();
                const questionsSnapshot = await questionsCollection.where('testId', '==', session.testId).get();
                if (!questionsSnapshot.empty) {
                    questions = questionsSnapshot.docs.map(doc => doc.data());
                }
            }
        } catch (dbErr) {
            console.warn('DB Error in submission, using fallback logic:', dbErr.message);
        }

        let totalMarks = 0, scoredMarks = 0;
        let correct = 0, incorrect = 0, attempted = 0;

        questions.forEach((q, idx) => {
            const marks = q.marks || 1;
            totalMarks += marks;
            const selectedOpt = answers[idx];
            
            if (selectedOpt) {
                attempted += 1;
                const isCorrect = q.correctAnswers && q.correctAnswers.includes(selectedOpt);
                if (isCorrect) {
                   scoredMarks += marks;
                   correct += 1;
                } else {
                   scoredMarks -= (q.negativeMarks || 0);
                   incorrect += 1;
                }
            }
        });

        const unattempted = questions.length - attempted;
        const accuracy = attempted > 0 ? (correct / attempted * 100).toFixed(2) : 0;

        const resultData = {
            sessionId,
            testId: session.testId,
            candidateId: session.candidateId,
            totalMarks,
            scoredMarks: Math.max(0, scoredMarks),
            attempted,
            unattempted,
            correct,
            incorrect,
            accuracy,
            submittedAt: new Date().toISOString()
        };

        // Try to save result to DB
        let resultId = `mock-result-${Date.now()}`;
        try {
            const resultDoc = await resultsCollection.add(resultData);
            resultId = resultDoc.id;
        } catch (saveErr) {
            console.warn('Could not save result to DB:', saveErr.message);
        }

        res.status(200).json({ 
            success: true, 
            result: { _id: resultId, ...resultData },
            questions // Return questions so frontend can show results page immediately
        });
    } catch (err) {
        console.error('Final submission error:', err);
        res.status(500).json({ message: 'Error submitting exam', error: err.message });
    }
};

module.exports = { startSession, logViolation, submitExam };
