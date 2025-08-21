import { TipService } from '../../services/tipService.js';
import { ErrorHandler } from '../../utils/errorHandler.js';

const tipService = new TipService();

export const getDailyTip = async (req, res, next) => {
  try {
    const tip = await tipService.getDailyTip();
    if (!tip) {
      // החזרת טיפ לדוגמה כאשר אין טיפים במסד הנתונים
      return res.json({
        _id: 'sample1',
        title: 'טיפ יומי',
        content: 'זכור לשתות הרבה מים בזמן הבישול ולשמור על תזונה מאוזנת!',
        category: 'general',
        createdAt: new Date()
      });
    }
    res.json(tip);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};

export const createTip = async (req, res, next) => {
  try {
    const tip = await tipService.createTip(req.body);
    res.status(201).json(tip);
  } catch (error) {
    next(new ErrorHandler(error.message, 400));
  }
};

export const getAllTips = async (req, res, next) => {
  try {
    const tips = await tipService.getAllTips();
    res.json(tips);
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
};