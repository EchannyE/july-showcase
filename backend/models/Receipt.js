import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const receiptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    imageUrl: {
      type: String,
    },
    ocrText: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
    },
    date: {
      type: String,
    },
    merchant: {
      type: String,
    },
    category: {
      type: String,
    },
    items: [itemSchema], // <-- New field for individual line items
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Receipt = mongoose.model('Receipt', receiptSchema);

export default Receipt;
