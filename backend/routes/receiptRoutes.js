import express from 'express';
import Receipt from '../models/Receipt.js';


const router = express.Router();

// Get all receipts
router.get('/', async (req, res) => {
    try {
        const receipts = await Receipt.find().sort({ uploadedAt: -1 });
        res.json(receipts);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


export default router;
