// server/src/routes/history.routes.js
import { Router } from 'express';
import authenticate from '../middleware/auth.middleware.js';
import Interview from '../models/Interview.model.js';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [entries, total] = await Promise.all([
      Interview.find({ userId: req.user._id })
        .sort({ createdAt: -1 }).skip(skip).limit(limit)
        .select('role status overallScore totalQuestions createdAt'),
      Interview.countDocuments({ userId: req.user._id }),
    ]);
    res.json({ success: true, data: { entries, totalEntries: total,
      totalPages: Math.ceil(total / limit), currentPage: page } });
  } catch (err) { next(err); }
});

router.delete('/clear', async (req, res, next) => {
  try {
    await Interview.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'All interviews cleared' });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Interview.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Interview deleted' });
  } catch (err) { next(err); }
});

export default router;