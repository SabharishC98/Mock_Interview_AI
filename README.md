# 🎙 InterviewAI — AI-Powered Mock Interview Platform

A full-stack web application that simulates realistic technical interviews using AI. Upload your resume, practice with AI interviewer **Natalie**, get scored across 5 categories, and track your progress over time.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 Resume-Based Questions | AI analyzes your resume and generates personalized interview questions |
| 🎙 Voice Interviews | Record verbal answers, transcribed automatically via AssemblyAI |
| 🔊 AI Voice | AI interviewer Natalie speaks questions aloud via Murf AI TTS |
| 💻 Live Coding | Built-in code editor for coding challenges with AI evaluation |
| 📊 AI Scoring | Detailed feedback with scores across 5 performance categories |
| 📁 Interview History | Track all past interviews with scores and feedback |
| 🎯 Multi-Role Support | Frontend, Backend, Full Stack, Data Analyst, DevOps, Mobile |
| 🔐 Authentication | Secure JWT-based login and registration |

---

## 🛠 Tech Stack

### Frontend
- **React** + Vite
- **React Router** — client-side routing
- **Axios** — HTTP requests
- **React Hot Toast** — notifications

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** — authentication
- **Multer** — file uploads
- **pdfjs-dist** — PDF text extraction

### AI & External Services
- **Google Gemini** — question generation, follow-ups, feedback
- **AssemblyAI** — speech-to-text transcription
- **Murf AI** — text-to-speech (AI interviewer voice)
- **Groq** (optional) — alternative LLM if Gemini quota is exceeded

---

## 📁 Project Structure

```
ai-mock-interview/
├── server/                    # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js         # dotenv loader
│   │   │   └── gemini.config.js
│   │   ├── constants/
│   │   │   └── prompts.js     # AI prompt templates
│   │   ├── controllers/
│   │   │   ├── interview.controller.js
│   │   │   └── resume.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── upload.middleware.js
│   │   ├── models/
│   │   │   ├── User.model.js
│   │   │   ├── Resume.model.js
│   │   │   └── Interview.model.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── resume.routes.js
│   │   │   ├── interview.routes.js
│   │   │   └── history.routes.js
│   │   ├── services/
│   │   │   ├── gemini.service.js
│   │   │   ├── assemblyai.service.js
│   │   │   ├── murf.service.js
│   │   │   ├── resume.service.js
│   │   │   └── interview.service.js
│   │   ├── utils/
│   │   │   └── prompts.utils.js
│   │   └── app.js
│   ├── .env                   # ← not committed
│   ├── .env.example
│   └── package.json
│
└── client/                    # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── AudioPlayer/
    │   │   ├── CodeEditor/
    │   │   ├── InterviewCard/
    │   │   ├── Navbar/
    │   │   ├── ProtectedRoute/
    │   │   ├── ScoreCard/
    │   │   └── VoiceRecorder/
    │   ├── contexts/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── FeedbackPage/
    │   │   ├── HistoryPage/
    │   │   ├── HomePage/
    │   │   ├── InterviewPage/
    │   │   ├── InterviewSetupPage/
    │   │   └── LoginPage/
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── interviewService.js
    │   │   └── historyService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- API keys for Gemini, AssemblyAI, and Murf AI

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-mock-interview.git
cd ai-mock-interview
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your keys:

```bash
cd server
copy .env.example .env
```

Edit `server/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mockinterview
JWT_SECRET=your_long_random_secret_key
GEMINI_API_KEY=your_gemini_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
MURF_API_KEY=your_murf_api_key
GROQ_API_KEY=your_groq_api_key
PORT=5000
```

### 4. Run the application

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
node src/app.js

# Terminal 2 — Frontend
cd client
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 🔑 Getting API Keys

| Service | Link | Free Tier |
|---|---|---|
| Google Gemini | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) | 1500 req/day (with billing enabled) |
| AssemblyAI | [assemblyai.com](https://www.assemblyai.com) | 100 hours free |
| Murf AI | [murf.ai](https://murf.ai) | Limited free tier |
| Groq (alternative) | [console.groq.com](https://console.groq.com) | Generous free tier |
| MongoDB Atlas | [cloud.mongodb.com](https://cloud.mongodb.com) | 512MB free |

---

## 📱 App Flow

```
Register / Login
      ↓
Upload Resume (PDF)
      ↓
Select Role + Difficulty
      ↓
AI generates personalized questions
      ↓
Interview with Natalie (voice + text + code)
      ↓
AI evaluates each answer in real-time
      ↓
Detailed feedback report (5 categories)
      ↓
View history & track progress
```

---

## 📊 Scoring Categories

| Category | What it measures |
|---|---|
| 🧠 Technical Knowledge | Depth and accuracy of technical answers |
| 🔍 Problem Solving | Approach to breaking down and solving problems |
| 💬 Communication | Clarity and structure of explanations |
| 💻 Code Quality | Correctness, efficiency, and style of code |
| 🤝 Behavioural Fit | Teamwork, leadership, and situational responses |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Resume
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resume/upload` | Upload PDF resume |
| GET | `/api/resume` | Get saved resume |

### Interview
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/interview/start` | Start new interview |
| POST | `/api/interview/transcribe` | Transcribe audio |
| GET | `/api/interview/:id` | Get interview by ID |
| POST | `/api/interview/:id/answer` | Submit text answer |
| POST | `/api/interview/:id/voice-answer` | Submit voice answer |
| POST | `/api/interview/:id/code` | Submit code answer |
| POST | `/api/interview/:id/end` | End interview + generate feedback |

### History
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/history` | Get paginated history |
| DELETE | `/api/history/:id` | Delete interview |
| DELETE | `/api/history/clear` | Clear all history |

---

## 🐛 Common Issues

**MongoDB connection refused**
- Check IP is whitelisted in Atlas Network Access (`0.0.0.0/0`)
- Add `family: 4` to mongoose.connect options (fixes Node v24 DNS issue)

**Gemini API key invalid**
- Create key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Enable billing on Google Cloud for higher quotas

**429 Rate Limited**
- Switch to Groq as alternative (free, no billing needed)
- Wait for daily quota reset

**Audio not playing**
- Browser may block autoplay — click anywhere on the page first
- Check Murf API key is valid

---

## 📄 License

MIT License — free to use and modify.

---

## 🙏 Acknowledgements

- [Google Gemini](https://ai.google.dev) — AI question generation and feedback
- [AssemblyAI](https://assemblyai.com) — Speech recognition
- [Murf AI](https://murf.ai) — AI voice synthesis
- [MongoDB Atlas](https://cloud.mongodb.com) — Database hosting
