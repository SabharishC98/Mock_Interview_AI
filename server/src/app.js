import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('dotenv').config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(o => o.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(allowedOpt => {
      if (!/^https?:\/\//i.test(allowedOpt)) {
        return origin === `https://${allowedOpt}` || origin === `http://${allowedOpt}`;
      }
      return origin === allowedOpt;
    });

    if (
      isAllowed ||
      origin.endsWith('.vercel.app') ||
      /^https?:\/\/localhost(:\d+)?$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const MONGO_URI = process.env.MONGODB_URI;
console.log('Connecting to:', MONGO_URI); // shows exact URI being used

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4, // ← forces IPv4, fixes Node v24 SRV bug
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });