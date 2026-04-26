const express = require('express');
const router = express.Router();
const { generateQuestions } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/generate', protect, generateQuestions);

module.exports = router;
