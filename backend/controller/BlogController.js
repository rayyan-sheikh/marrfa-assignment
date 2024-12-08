const Blog = require('../model/Blog')


const getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const getBlogById = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const createBlog = async (req, res) => {
    try {
      const { title, content, author, tags, image } = req.body;
  
      const newBlog = new Blog({
        title,
        content,
        author,
        tags,
        image,
      });
  
      const savedBlog = await newBlog.save();
      res.status(201).json(savedBlog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const deleteBlog = async (req, res) => {
    try {
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
  
      if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });
  
      res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  module.exports = {
    getAllBlogs,
    getBlogById,
    createBlog,
    deleteBlog,
  };