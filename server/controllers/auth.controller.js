const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db } = require('../firebase.admin');

const usersCollection = db ? db.collection('users') : null;

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const querySnapshot = await usersCollection.where('email', '==', email).get();
    if (!querySnapshot.empty) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const userDoc = await usersCollection.add({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'candidate',
      createdAt: new Date().toISOString()
    });

    const userData = { _id: userDoc.id, name, email, role: role || 'candidate' };
    const token = jwt.sign({ id: userDoc.id, role: userData.role }, process.env.JWT_SECRET || 'fallback_secret_mocker', { expiresIn: '1d' });

    res.status(201).json({ user: userData, token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Attempt real login with Firestore
    let user;
    let userId;
    
    try {
      const querySnapshot = await usersCollection.where('email', '==', email).get();
      if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          userId = userDoc.id;
          user = { _id: userId, ...userDoc.data() };
          
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (dbError) {
      console.warn('--- FIRESTORE UNAVAILABLE, CHECKING MOCK CREDENTIALS ---');
    }

    // Mock Fallback for Demo Accounts
    if (!user && password === 'password123') {
      if (email === 'admin@mocker.com') {
        user = { _id: 'mock-admin', name: 'Demo Creator', email, role: 'creator' };
      } else if (email === 'student@mocker.com') {
        user = { _id: 'mock-student', name: 'Demo Candidate', email, role: 'candidate' };
      }
    }

    if (!user) return res.status(404).json({ message: 'User not found or database error' });

    const token = jwt.sign({ id: user._id || user.id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret_mocker', { expiresIn: '1d' });
    res.status(200).json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error('--- LOGIN ERROR ---');
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
      if (req.user.id.startsWith('mock-')) {
          const isCreator = req.user.role === 'creator';
          return res.status(200).json({ 
              _id: req.user.id, 
              name: isCreator ? 'Demo Creator' : 'Demo Candidate', 
              email: isCreator ? 'admin@mocker.com' : 'student@mocker.com', 
              role: req.user.role 
          });
      }
      const userDoc = await usersCollection.doc(req.user.id).get();
      if (!userDoc.exists) return res.status(404).json({ message: 'User not found' });
      
      const user = userDoc.data();
      delete user.password;
      res.status(200).json({ _id: userDoc.id, ...user });
  } catch (err) {
      console.error('getMe error:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const googleAuth = async (req, res) => {
  const { email, name, role } = req.body;
  console.log('--- GOOGLE AUTH ATTEMPT:', { email, name, role });

  if (!email) {
      console.error('--- GOOGLE AUTH FAILED: No email provided');
      return res.status(400).json({ message: 'Email is required' });
  }

  try {
    let userData = null;
    let userId = null;

    // 1. Try Firestore Lookup
    try {
      if (!usersCollection) {
          console.warn('--- GOOGLE AUTH: db link is null, skipping to mock');
          throw new Error('Firestore not initialized');
      }

      console.log('--- GOOGLE AUTH: Searching Firestore...');
      const querySnapshot = await usersCollection.where('email', '==', email).get();
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        userId = userDoc.id;
        const data = userDoc.data();
        userData = { _id: userId, name: data.name || name, email: data.email || email, role: data.role || 'candidate' };
        console.log('--- GOOGLE AUTH: Found existing user in DB');
      } else {
        console.log('--- GOOGLE AUTH: Creating new user document...');
        const dummyPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);
        const newRole = role || 'candidate';
        const userDoc = await usersCollection.add({ 
          name, 
          email, 
          password: dummyPassword, 
          role: newRole,
          createdAt: new Date().toISOString()
        });
        userId = userDoc.id;
        userData = { _id: userId, name, email, role: newRole };
        console.log('--- GOOGLE AUTH: New user created in DB');
      }
    } catch (dbError) {
      console.warn('--- GOOGLE AUTH: Database operation failed, falling back to MOCK MODE ---');
      console.warn('DB Error info:', dbError.message);
      
      userId = `mock-google-${email.split('@')[0]}`;
      userData = { 
        _id: userId, 
        name: name || 'Demo User', 
        email, 
        role: role || 'candidate' 
      };
    }

    // 2. Token Generation
    console.log('--- GOOGLE AUTH: Generating JWT for user:', userId);
    const token = jwt.sign(
        { id: userId, role: userData.role }, 
        process.env.JWT_SECRET || 'fallback_secret_mocker', 
        { expiresIn: '7d' }
    );
    
    console.log('--- GOOGLE AUTH: Flow Complete, sending success');
    return res.status(200).json({ user: userData, token });

  } catch (err) {
    console.error('--- CRITICAL FAILURE IN GOOGLE AUTH FLOW ---');
    console.error(err);
    return res.status(500).json({ 
        message: 'Google authentication failed', 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

const updateRole = async (req, res) => {
    const { role } = req.body;
    try {
        let userId = req.user.id;
        
        if (!userId.startsWith('mock-')) {
            await usersCollection.doc(userId).update({ role });
        }
        
        // Always generate new token with updated role
        const token = jwt.sign(
            { id: userId, role }, 
            process.env.JWT_SECRET || 'fallback_secret_mocker', 
            { expiresIn: '7d' }
        );
        
        res.status(200).json({ message: 'Role updated successfully', role, token });
    } catch (err) {
        console.error('updateRole error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { register, login, getMe, googleAuth, updateRole };
