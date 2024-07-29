import { TipService } from '../../services/tipService.js';
import { ErrorHandler } from '../../utils/errorHandler.js';

export class TipController {
  constructor(tipService) {
    this.tipService = tipService;
  }

  async getDailyTip(req, res, next) {
    try {
      const tip = await this.tipService.getDailyTip();
      if (!tip) {
        return next(new ErrorHandler('לא נמצאו טיפים', 404));
      }
      res.json(tip);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }

  async createTip(req, res, next) {
    try {
      const tip = await this.tipService.createTip(req.body);
      res.status(201).json(tip);
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  async getAllTips(req, res, next) {
    try {
      const tips = await this.tipService.getAllTips();
      res.json(tips);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
}

export const tipController = new TipController(new TipService());