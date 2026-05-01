const express = require('express');
const router = express.Router();
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/projectController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/roleMiddleware');

router.route('/')
  .post(authenticate, authorizeAdmin, createProject)
  .get(authenticate, getProjects);

router.route('/:id')
  .put(authenticate, authorizeAdmin, updateProject)
  .delete(authenticate, authorizeAdmin, deleteProject);

module.exports = router;
