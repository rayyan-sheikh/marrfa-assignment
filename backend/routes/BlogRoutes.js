const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  deleteBlog,
} = require('../controller/BlogController');

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', createBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
