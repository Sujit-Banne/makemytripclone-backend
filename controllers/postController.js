const Post = require('../models/Post');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's posts
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id }).populate('userId', 'name email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    const newPost = new Post({
      title,
      content,
      userId: req.user._id
    });

    await newPost.save();
    const postWithUser = await newPost.populate('userId', 'name email');

    res.status(201).json({
      message: 'Post created successfully',
      post: postWithUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        ...(title ? { title } : {}),
        ...(content ? { content } : {}),
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const deleted = await Post.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
