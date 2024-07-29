import { TipService } from '../../services/tipService.js';
import { ErrorHandler } from '../../utils/errorHandler.js';

export class TipController {
  constructor(tipService) {
    this.tipService = tipService;
  }

  async getDailyTip(req, res, next) {
    try {
      const tip = await this.tipService.getDailyTip();
      res.json(tip);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
}

export const tipController = new TipController(new TipService());