import Tip from '../models/Tip.js';

export class TipService {
  async getDailyTip() {
    const count = await Tip.countDocuments();
    const random = Math.floor(Math.random() * count);
    return Tip.findOne().skip(random);
  }
}