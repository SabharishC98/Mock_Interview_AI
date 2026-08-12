// server/src/middleware/upload.middleware.js
import multer from 'multer';

const storage = multer.memoryStorage();
const resumeFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files allowed'), false);
};

const audioFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) cb(null, true);
  else cb(new Error('Only audio files allowed'), false);
};

const uploadResumeInstance = multer({ storage, fileFilter: resumeFileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadAudioInstance = multer({ storage, fileFilter: audioFileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

export const uploadResume = uploadResumeInstance.single('resume');
export const uploadAudio = uploadAudioInstance.single('audio');