const express = require('express');
const router = express.Router();
const { signup, login, getUsers } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/roleMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', authenticate, authorizeAdmin, getUsers);

module.exports = router;
