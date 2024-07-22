import mongoose from 'mongoose';

const ScanHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productCode: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
});

const ScanHistory = mongoose.model('ScanHistory', ScanHistorySchema);

export default ScanHistory;