const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  googleAuth,
  updateRole,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  forgotUsername,
  updateProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.post('/update-role', protect, updateRole);
router.post('/update-profile', protect, updateProfile);

// Email verification
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

// Forgot credentials
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/forgot-username', forgotUsername);

module.exports = router;
