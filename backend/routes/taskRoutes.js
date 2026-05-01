const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/roleMiddleware');

router.route('/')
  .post(authenticate, authorizeAdmin, createTask)
  .get(authenticate, getTasks);

router.route('/:id')
  .put(authenticate, updateTask)
  .delete(authenticate, authorizeAdmin, deleteTask);

module.exports = router;
