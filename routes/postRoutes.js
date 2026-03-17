const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getPosts,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

// Public route
router.get('/', getPosts);

// Protected routes
router.get('/user/posts', authMiddleware, getUserPosts);
router.post('/', authMiddleware, createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
