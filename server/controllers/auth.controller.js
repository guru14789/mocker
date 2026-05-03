const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { db } = require('../firebase.admin');

// ─── Mock Database (Fallback) ────────────────────────────────────────────────
// If Firebase is not configured or fails, we use this in-memory store for testing
let mockUsers = []; 
const usersCollection = db ? db.collection('users') : null;

// Helper to query users (works for both Firebase and Mock)
const findUserByField = async (field, value) => {
  if (db) {
    try {
      const snap = await usersCollection.where(field, '==', value).get();
      return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
    } catch (err) {
      if (err.code === 16 || err.message.includes('unauthenticated')) {
        console.warn(`⚠️ Firebase Unauthenticated. Falling back to Mock store for ${field}=${value}`);
      } else {
        throw err;
      }
    }
  }
  // Mock Fallback
  return mockUsers.find(u => u[field] === value) || null;
};

const addUser = async (userData) => {
  if (db) {
    try {
      const docRef = await usersCollection.add(userData);
      return { id: docRef.id, ...userData };
    } catch (err) {
      if (err.code === 16 || err.message.includes('unauthenticated')) {
        console.warn('⚠️ Firebase Unauthenticated. Saving to Mock store instead.');
      } else {
        throw err;
      }
    }
  }
  // Mock Fallback
  const newUser = { id: `mock_${Date.now()}`, ...userData };
  mockUsers.push(newUser);
  return newUser;
};

const updateUser = async (id, data) => {
  if (db && !id.startsWith('mock_')) {
    try {
      await usersCollection.doc(id).update(data);
      return true;
    } catch (err) {
      console.warn('Firebase update failed, trying mock update');
    }
  }
  const idx = mockUsers.findIndex(u => u.id === id);
  if (idx !== -1) {
    mockUsers[idx] = { ...mockUsers[idx], ...data };
    return true;
  }
  return false;
};

// ─── Email Transporter ───────────────────────────────────────────────────────
// Uses Ethereal (test) or configured SMTP. Falls back gracefully.
const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  // Fallback: Ethereal (dev only) — logs preview URL to console
  return null;
};

const sendEmail = async (to, subject, html) => {
  try {
    let transporter = createTransporter();
    if (!transporter) {
      // Create Ethereal test account on the fly
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Mocker Platform" <noreply@mocker.com>',
      to,
      subject,
      html,
    });

    // Log preview URL for Ethereal accounts
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Email Preview URL:', previewUrl);
    }
    return true;
  } catch (err) {
    console.error('Email send error:', err.message);
    return false;
  }
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  const { username, name, email, password, mobile, profile, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }

  try {
    // Check duplicate email
    const existingEmail = await findUserByField('email', email);
    if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

    // Check duplicate username
    const existingUser = await findUserByField('username', username);
    if (existingUser) return res.status(400).json({ message: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

    const userData = {
      username,
      name: name || username,
      email,
      password: hashedPassword,
      mobile: mobile || '',
      profile: profile || 'aspirant',
      role: role || 'candidate',
      isVerified: false,
      verificationToken,
      verificationExpires,
      createdAt: new Date().toISOString(),
    };

    const user = await addUser(userData);

    // Send verification email
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyLink = `${clientUrl}/verify-email?token=${verificationToken}&id=${user.id}`;

    const emailHtml = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #0F172A; padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: -0.5px;">MOCKER</h1>
          <p style="color: #64748B; margin: 8px 0 0; font-size: 13px;">Exam Proctoring Platform</p>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="color: #0F172A; margin: 0 0 12px; font-size: 20px;">Verify Your Email Address</h2>
          <p style="color: #64748B; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Hi <strong>${name || username}</strong>, welcome to Mocker! Please click the button below to verify your email address and activate your account.
          </p>
          <a href="${verifyLink}" style="display: inline-block; background: #0F172A; color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase;">
            Verify My Email
          </a>
          <p style="color: #94A3B8; font-size: 12px; margin: 24px 0 0;">
            This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `;

    await sendEmail(email, 'Verify your Mocker account', emailHtml);
    
    console.log('\n--- DEVELOPMENT AUTH HELPER ---');
    console.log('User:', username);
    console.log('Activation Link:', verifyLink);
    console.log('-------------------------------\n');

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      requiresVerification: true,
      email,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserById = async (id) => {
  if (db && !id.startsWith('mock_')) {
    try {
      const doc = await usersCollection.doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (err) {
      console.warn('Firebase get failed, trying mock store');
    }
  }
  return mockUsers.find(u => u.id === id) || null;
};

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────
const verifyEmail = async (req, res) => {
  const { token, id } = req.query;

  if (!token || !id) return res.status(400).json({ message: 'Invalid verification link' });

  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) return res.status(200).json({ message: 'Email already verified', alreadyVerified: true });
    if (user.verificationToken !== token) return res.status(400).json({ message: 'Invalid verification token' });
    if (new Date(user.verificationExpires) < new Date()) {
      return res.status(400).json({ message: 'Verification link has expired. Please register again.' });
    }

    await updateUser(id, {
      isVerified: true,
      verificationToken: null,
      verificationExpires: null,
    });

    res.status(200).json({ message: 'Email verified successfully! You can now log in.', verified: true });
  } catch (err) {
    console.error('verifyEmail error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── RESEND VERIFICATION ──────────────────────────────────────────────────────
const resendVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await findUserByField('email', email);
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    if (user.isVerified) return res.status(400).json({ message: 'Email is already verified' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await updateUser(user.id, { verificationToken, verificationExpires });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verifyLink = `${clientUrl}/verify-email?token=${verificationToken}&id=${user.id}`;

    const emailHtml = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #0F172A; padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">MOCKER</h1>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="color: #0F172A; margin: 0 0 12px;">New Verification Link</h2>
          <p style="color: #64748B; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Here's a fresh verification link for your Mocker account.
          </p>
          <a href="${verifyLink}" style="display: inline-block; background: #0F172A; color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase;">
            Verify My Email
          </a>
          <p style="color: #94A3B8; font-size: 12px; margin: 24px 0 0;">Expires in 24 hours.</p>
        </div>
      </div>
    `;

    await sendEmail(email, 'New verification link — Mocker', emailHtml);
    res.status(200).json({ message: 'Verification email sent' });
  } catch (err) {
    console.error('resendVerification error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  const { identifier, password } = req.body; // identifier = email OR username
  if (!identifier || !password) return res.status(400).json({ message: 'All fields are required' });

  try {
    let user;
    let userId;

    try {
      // Try email first
      user = await findUserByField('email', identifier);
      if (!user) {
        // Try username
        user = await findUserByField('username', identifier);
      }
      
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Check verification
        if (!user.isVerified) {
          return res.status(403).json({
            message: 'Please verify your email before logging in.',
            requiresVerification: true,
            email: user.email,
          });
        }
      }
    } catch (dbError) {
      console.warn('--- FIRESTORE UNAVAILABLE, CHECKING MOCK CREDENTIALS ---');
    }

    // Mock Fallback for Demo Accounts
    if (!user && password === 'password123') {
      if (identifier === 'admin@mocker.com' || identifier === 'admin') {
        user = { _id: 'mock-admin', name: 'Demo Creator', username: 'admin', email: 'admin@mocker.com', role: 'creator', isVerified: true };
      } else if (identifier === 'student@mocker.com' || identifier === 'student') {
        user = { _id: 'mock-student', name: 'Demo Candidate', username: 'student', email: 'student@mocker.com', role: 'candidate', isVerified: true };
      }
    }

    if (!user) return res.status(404).json({ message: 'User not found or invalid credentials' });

    const token = jwt.sign(
      { id: user._id || user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_mocker',
      { expiresIn: '1d' }
    );
    res.status(200).json({
      user: { 
        _id: user._id, 
        name: user.name, 
        username: user.username, 
        email: user.email, 
        role: user.role, 
        profile: user.profile,
        profileCompleted: user.profileCompleted || false
      },
      token,
    });
  } catch (err) {
    console.error('--- LOGIN ERROR ---', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await findUserByField('email', email);
    // Always return success to prevent email enumeration
    if (!user) return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await updateUser(user.id, { resetToken, resetExpires });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}&id=${user.id}`;

    const emailHtml = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #0F172A; padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">MOCKER</h1>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="color: #0F172A; margin: 0 0 12px;">Reset Your Password</h2>
          <p style="color: #64748B; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            We received a request to reset your password. Click the button below to set a new password. This link expires in 1 hour.
          </p>
          <a href="${resetLink}" style="display: inline-block; background: #0F172A; color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase;">
            Reset Password
          </a>
          <p style="color: #94A3B8; font-size: 12px; margin: 24px 0 0;">If you didn't request this, ignore this email — your password is unchanged.</p>
        </div>
      </div>
    `;

    await sendEmail(email, 'Reset your Mocker password', emailHtml);

    console.log('\n--- DEVELOPMENT AUTH HELPER ---');
    console.log('Action: Password Reset');
    console.log('User:', user.username);
    console.log('Reset Link:', resetLink);
    console.log('-------------------------------\n');

    res.status(200).json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  const { token, id, newPassword } = req.body;
  if (!token || !id || !newPassword) return res.status(400).json({ message: 'All fields are required' });

  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: 'Invalid reset link' });

    if (user.resetToken !== token) return res.status(400).json({ message: 'Invalid or expired reset token' });
    if (new Date(user.resetExpires) < new Date()) return res.status(400).json({ message: 'Reset link has expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await updateUser(id, { password: hashedPassword, resetToken: null, resetExpires: null });

    res.status(200).json({ message: 'Password reset successfully! You can now log in.' });
  } catch (err) {
    console.error('resetPassword error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── FORGOT USERNAME ──────────────────────────────────────────────────────────
const forgotUsername = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await findUserByField('email', email);
    if (!user) return res.status(200).json({ message: 'If this email exists, the username has been sent.' });
    const emailHtml = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #0F172A; padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">MOCKER</h1>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="color: #0F172A; margin: 0 0 12px;">Your Username</h2>
          <p style="color: #64748B; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Here's the username associated with this email address:
          </p>
          <div style="background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 22px; font-weight: 900; color: #0F172A; letter-spacing: -0.5px;">${user.username || 'N/A'}</span>
          </div>
          <p style="color: #94A3B8; font-size: 12px; margin: 0;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `;

    await sendEmail(email, 'Your Mocker username', emailHtml);
    res.status(200).json({ message: 'If this email exists, the username has been sent.' });
  } catch (err) {
    console.error('forgotUsername error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── GET ME ───────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    if (req.user.id.startsWith('mock-')) {
      const isCreator = req.user.role === 'creator';
      return res.status(200).json({
        _id: req.user.id,
        name: isCreator ? 'Demo Creator' : 'Demo Candidate',
        username: isCreator ? 'admin' : 'student',
        email: isCreator ? 'admin@mocker.com' : 'student@mocker.com',
        role: req.user.role,
        profile: 'aspirant',
      });
    }
    const userDoc = await usersCollection.doc(req.user.id).get();
    if (!userDoc.exists) return res.status(404).json({ message: 'User not found' });

    const user = userDoc.data();
    delete user.password;
    delete user.verificationToken;
    delete user.resetToken;
    res.status(200).json({ _id: userDoc.id, ...user });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── GOOGLE AUTH ──────────────────────────────────────────────────────────────
const googleAuth = async (req, res) => {
  const { email, name, role } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    let userData = null;
    let userId = null;

    try {
      if (!usersCollection) throw new Error('Firestore not initialized');

      const querySnapshot = await usersCollection.where('email', '==', email).get();
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        userId = userDoc.id;
        const data = userDoc.data();
        userData = { _id: userId, name: data.name || name, username: data.username || email.split('@')[0], email: data.email || email, role: data.role || 'candidate' };
      } else {
        const dummyPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);
        const newRole = role || 'candidate';
        const username = email.split('@')[0];
        const userDoc = await usersCollection.add({
          username,
          name,
          email,
          password: dummyPassword,
          role: newRole,
          mobile: '',
          profile: 'aspirant',
          isVerified: true, // Google accounts are pre-verified
          createdAt: new Date().toISOString(),
        });
        userId = userDoc.id;
        userData = { _id: userId, name, username, email, role: newRole };
      }
    } catch (dbError) {
      console.warn('--- GOOGLE AUTH: DB unavailable, using MOCK MODE ---');
      userId = `mock-google-${email.split('@')[0]}`;
      userData = { _id: userId, name: name || 'Demo User', username: email.split('@')[0], email, role: role || 'candidate' };
    }

    const token = jwt.sign(
      { id: userId, role: userData.role },
      process.env.JWT_SECRET || 'fallback_secret_mocker',
      { expiresIn: '7d' }
    );
    return res.status(200).json({ 
      user: {
        ...userData,
        profileCompleted: userData.profileCompleted || false
      }, 
      token 
    });
  } catch (err) {
    console.error('--- CRITICAL FAILURE IN GOOGLE AUTH FLOW ---', err);
    return res.status(500).json({ message: 'Google authentication failed', error: err.message });
  }
};

// ─── UPDATE ROLE ──────────────────────────────────────────────────────────────
const updateRole = async (req, res) => {
  const { role } = req.body;
  try {
    let userId = req.user.id;
    if (!userId.startsWith('mock-')) {
      await usersCollection.doc(userId).update({ role });
    }
    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'fallback_secret_mocker', { expiresIn: '7d' });
    res.status(200).json({ message: 'Role updated successfully', role, token });
  } catch (err) {
    console.error('updateRole error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  const profileData = req.body;
  try {
    const userId = req.user.id;
    await updateUser(userId, { 
      ...profileData, 
      profileCompleted: true 
    });
    res.status(200).json({ message: 'Profile updated successfully', profileCompleted: true });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login, getMe, googleAuth, updateRole, updateProfile, verifyEmail, resendVerification, forgotPassword, resetPassword, forgotUsername };
