// server/src/routes/interview.routes.js
import { Router } from 'express';
import {
  startInterview, submitTextAnswer, submitVoiceAnswer,
  submitCode, endInterview, getInterview, transcribeOnly, speakText,
} from '../controllers/interview.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import { uploadAudio } from '../middleware/upload.middleware.js';

const router = Router();
router.use(authenticate);
router.post('/start', startInterview);
router.post('/transcribe', uploadAudio, transcribeOnly); // must be before /:id routes
router.post('/speak', speakText);
router.get('/:id', getInterview);
router.post('/:id/answer', submitTextAnswer);
router.post('/:id/voice-answer', uploadAudio, submitVoiceAnswer);
router.post('/:id/code', submitCode);
router.post('/:id/end', endInterview);
export default router;