import Topic from '../models/Topic.js';
import User from '../models/User.js';

export const getTopics = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
  
      const totalTopics = await Topic.countDocuments();
      const topics = await Topic.find()
        .populate('author', 'username')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startIndex);
  
      res.json({
        topics,
        currentPage: page,
        totalPages: Math.ceil(totalTopics / limit),
        totalTopics
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching topics', error: error.message });
    }
  };

export const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('author', 'username')
      .populate('replies.author', 'username');
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topic', error: error.message });
  }
};

export const createTopic = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newTopic = new Topic({
      title,
      content,
      author: req.user._id
    });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: 'Error creating topic', error: error.message });
  }
};

export const createReply = async (req, res) => {
  try {
    const { content } = req.body;
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    topic.replies.push({
      content,
      author: req.user._id
    });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ message: 'Error creating reply', error: error.message });
  }
};

export const searchTopics = async (req, res) => {
    try {
      const { query } = req.query;
      const topics = await Topic.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } }
        ]
      }).populate('author', 'username').sort({ createdAt: -1 });
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: 'Error searching topics', error: error.message });
    }
  };


  export const deleteTopic = async (req, res) => {
    try {
      const topic = await Topic.findById(req.params.id);
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }
      await topic.remove();
      res.json({ message: 'Topic deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting topic', error: error.message });
    }
  };
  
  export const deleteReply = async (req, res) => {
    try {
      const topic = await Topic.findById(req.params.topicId);
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' });
      }
      topic.replies = topic.replies.filter(reply => reply._id.toString() !== req.params.replyId);
      await topic.save();
      res.json({ message: 'Reply deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting reply', error: error.message });
    }
  };