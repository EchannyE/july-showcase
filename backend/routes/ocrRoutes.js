import express from 'express';
import multer from 'multer';

import { getReceipts, uploadReceiptAndProcessOCR } from '../controllers/ocrController.js';

const router = express.Router();

// Custom multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Optional: filter for image/PDF
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/upload', upload.single('image'), uploadReceiptAndProcessOCR);
router.get('/receipts', getReceipts);

export default router;
export const ocrRoutes = router;
