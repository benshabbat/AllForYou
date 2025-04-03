import Topic from '../models/Topic.js';
import { ERROR_MESSAGES } from '../../constants/errorMessages.js';

// Pagination helper
const paginate = async (model, query, page, limit, populateFields = '') => {
  const startIndex = (page - 1) * limit;
  const totalDocuments = await model.countDocuments(query);
  const results = await model
    .find(query)
    .populate(populateFields)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  return {
    results,
    currentPage: page,
    totalPages: Math.ceil(totalDocuments / limit),
    totalDocuments,
  };
};

// Get all topics with pagination
export const getTopics = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await paginate(Topic, {}, page, limit, 'author username');
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: ERROR_MESSAGES.FETCH_ERROR, error: error.message });
  }
};

// Get a single topic by ID
export const getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate('author', 'username')
      .populate('replies.author', 'username');
    if (!topic) {
      return res.status(404).json({ message: ERROR_MESSAGES.TOPIC_NOT_FOUND });
    }
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: ERROR_MESSAGES.FETCH_ERROR, error: error.message });
  }
};

// Create a new topic
export const createTopic = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newTopic = new Topic({
      title,
      content,
      author: req.user._id,
    });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: ERROR_MESSAGES.CREATE_ERROR, error: error.message });
  }
};

// Create a reply to a topic
export const createReply = async (req, res) => {
  try {
    const { content } = req.body;
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: ERROR_MESSAGES.TOPIC_NOT_FOUND });
    }
    topic.replies.push({
      content,
      author: req.user._id,
    });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ message: ERROR_MESSAGES.CREATE_ERROR, error: error.message });
  }
};

// Search topics by title or content
export const searchTopics = async (req, res) => {
  try {
    const { query } = req.query;
    const topics = await Topic.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: ERROR_MESSAGES.SEARCH_ERROR, error: error.message });
  }
};

// Delete a topic
export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: ERROR_MESSAGES.TOPIC_NOT_FOUND });
    }
    await topic.remove();
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: ERROR_MESSAGES.DELETE_ERROR, error: error.message });
  }
};

// Delete a reply from a topic
export const deleteReply = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: ERROR_MESSAGES.TOPIC_NOT_FOUND });
    }
    topic.replies = topic.replies.filter((reply) => reply._id.toString() !== req.params.replyId);
    await topic.save();
    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: ERROR_MESSAGES.DELETE_ERROR, error: error.message });
  }
};