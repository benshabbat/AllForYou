import Tip from '../models/Tip.js';

export class TipService {
  async getDailyTip() {
    const count = await Tip.countDocuments();
    const random = Math.floor(Math.random() * count);
    return Tip.findOne().skip(random);
  }

  async createTip(tipData) {
    const tip = new Tip(tipData);
    return tip.save();
  }

  async getAllTips() {
    return Tip.find();
  }
}