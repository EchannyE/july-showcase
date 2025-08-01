import { createWorker } from 'tesseract.js';
import Receipt from '../models/Receipt.js';
import parseTransaction from '../utils/parseTransaction.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { convert } from 'pdf-poppler'; // 📦 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to convert PDF to images
const convertPdfToImages = async (pdfPath, outputDir) => {
  const opts = {
    format: 'jpeg',
    out_dir: outputDir,
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    page: null, // all pages
  };
  await convert(pdfPath, opts);
  return fs.readdirSync(outputDir)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg'))
    .map(file => path.join(outputDir, file));
};

export const uploadReceiptAndProcessOCR = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const isPdf = mimeType === 'application/pdf';

    const worker = await createWorker('eng');
    let extractedText = '';

    if (isPdf) {
      const outputDir = path.join(__dirname, '../../temp', Date.now().toString());
      fs.mkdirSync(outputDir, { recursive: true });
      const imagePaths = await convertPdfToImages(filePath, outputDir);

      for (const imagePath of imagePaths) {
        const { data: { text } } = await worker.recognize(imagePath);
        extractedText += text + '\n';
      }
    } else {
      const { data: { text } } = await worker.recognize(filePath);
      extractedText = text;
    }

    await worker.terminate();

    // Extract structured transaction data
    const transactionData = parseTransaction(extractedText);

    if (!transactionData.merchant || !transactionData.amount || !transactionData.date) {
      return res.status(422).json({
        message: 'Failed to parse transaction details from receipt',
        extractedText,
      });
    }

    const receipt = new Receipt({
      user: req.user ? req.user._id : null,
      imageUrl: `/uploads/${req.file.filename}`,
      ocrText: extractedText,
      category: transactionData.category,
      amount: transactionData.amount,
      date: transactionData.date,
      merchant: transactionData.merchant,
      items: transactionData.items,
      uploadedAt: new Date(),
    });

    await receipt.save();

    res.status(201).json({
      message: 'Receipt uploaded and processed successfully',
      receipt,
    });

  } catch (error) {
    console.error('OCR processing error:', error);
    res.status(500).json({
      message: 'Failed to process receipt',
      error: error.message,
    });
  }
};
export const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ uploadedAt: -1 });

    const formatted = receipts.map((receipt) => ({
      id: receipt._id,
      imageUrl: receipt.imageUrl,
      merchant: receipt.merchant,
      amount: receipt.amount,
      category: receipt.category,
      date: receipt.date,
      uploadedAt: receipt.uploadedAt,
      ocrText: receipt.ocrText, // Optional: for debugging
      items: receipt.items || [],
    }));

    res.status(200).json({ success: true, receipts: formatted });
  } catch (err) {
    console.error('Error fetching receipts:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

