import { TipService } from '../../services/tipService.js';
import { ErrorHandler } from '../../utils/errorHandler.js';

const tipService = new TipService();

export const getDailyTip = async (req, res, next) => {
  try {
    const tip = await tipService.getDailyTip();
    if (!tip) {
      return next(new ErrorHandler('לא נמצאו טיפים', 404));
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