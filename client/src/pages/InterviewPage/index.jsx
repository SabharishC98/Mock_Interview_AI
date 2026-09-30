// client/src/pages/InterviewPage/index.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getInterview, submitTextAnswer, transcribeAudio,
         submitCode, endInterview } from '../../services/interviewService';
import AudioPlayer from '../../components/AudioPlayer';
import VoiceRecorder from '../../components/VoiceRecorder';
import CodeEditor from '../../components/CodeEditor';
import './InterviewPage.css';

// States: 'speaking' | 'listening' | 'thinking' | 'farewell'

function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [state, setState] = useState('speaking');
  const [audioBase64, setAudioBase64] = useState(location.state?.audioBase64 || null);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [textAnswer, setTextAnswer] = useState('');
  const [code, setCode] = useState('');
  const [answerMode, setAnswerMode] = useState('voice');

  useEffect(() => {
    const load = async () => {
      const data = await getInterview(id);
      setCurrentQuestionNum(data.currentQuestion);
      setTotalQuestions(data.totalQuestions);
      if (data.questions?.length > 0) {
        setCurrentQuestion(data.questions[data.currentQuestion - 1] || data.questions[0]);
      }
      if (!location.state?.audioBase64) setState('listening');
    };
    load();
  }, [id, location.state?.audioBase64]);

  const handleAudioEnded = () => setState('listening');

  const processAnswerResult = (result) => {
    if (result.isComplete) {
      setState('farewell');
      setAudioBase64(result.audioBase64);
      setTimeout(() => handleEndInterview(), 5000);
    } else {
      setCurrentQuestion(result.nextQuestion);
      setCurrentQuestionNum(result.currentQuestion);
      setAudioBase64(result.audioBase64);
      setState('speaking');
    }
  };

  const handleVoiceSubmit = async (audioBlob) => {
    setState('thinking');
    try {
      const transcript = await transcribeAudio(audioBlob);
      if (!transcript || !transcript.trim()) {
        toast.error('No speech detected. Please speak clearly or type your answer.');
        setState('listening');
        return;
      }
      const result = await submitTextAnswer(id, transcript);
      processAnswerResult(result);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing speech answer.');
      setState('listening');
    }
  };

  const handleTextSubmit = async () => {
    if (!textAnswer.trim()) return;
    setState('thinking');
    try {
      const result = await submitTextAnswer(id, textAnswer);
      setTextAnswer('');
      processAnswerResult(result);
    } catch { setState('listening'); }
  };

  const handleCodeSubmit = async () => {
    setState('thinking');
    try {
      const result = await submitCode(id, code, 'javascript', currentQuestionNum);
      processAnswerResult(result);
    } catch { setState('listening'); }
  };

  const handleEndInterview = async () => {
    await endInterview(id);
    navigate(`/feedback/${id}`);
  };

  const progress = totalQuestions ? Math.min((currentQuestionNum / totalQuestions) * 100, 100) : 0;
  const statusLabel = state === 'speaking' ? 'Interviewer speaking' : state === 'listening' ? 'Your turn' : state === 'thinking' ? 'Reviewing your answer' : 'Session complete';

  return (
    <main className="interview-page">
      <header className="interview-header">
        <div className="interview-context">
          <span className="interview-eyebrow">LIVE PRACTICE</span>
          <span className="question-counter">Question {currentQuestionNum}<span> / {totalQuestions}</span></span>
        </div>
        <div className="interview-progress" aria-label={`Question ${currentQuestionNum} of ${totalQuestions}`}>
          <div className="interview-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="interview-header-actions">
          <span className={`status-badge ${state}`}><span className="status-dot" />{statusLabel}</span>
          <button onClick={handleEndInterview} className="end-btn">End session</button>
        </div>
      </header>

      <AudioPlayer audioBase64={audioBase64} autoPlay onEnded={handleAudioEnded} />

      <div className="interview-content">
        {currentQuestion && (
          <section className="question-card" aria-labelledby="question-heading">
            <div className="question-card-top"><span className="question-label">QUESTION {currentQuestionNum}</span>{currentQuestion.isCodeQuestion && <span className="question-type">Coding prompt</span>}</div>
            <h1 id="question-heading" className="question-text">{currentQuestion.text}</h1>
            {currentQuestion.isCodeQuestion && currentQuestion.codeSnippet && (
              <pre className="code-snippet">{currentQuestion.codeSnippet}</pre>
            )}
          </section>
        )}

        {state === 'listening' && (
          <section className="answer-section" aria-label="Your answer">
            <div className="answer-heading"><h2>Your response</h2><span>Choose how you’d like to answer</span></div>
            <div className="answer-mode-tabs" role="tablist" aria-label="Answer format">
              <button type="button" role="tab" aria-selected={answerMode === 'voice'} onClick={() => setAnswerMode('voice')} className={answerMode === 'voice' ? 'active' : ''}>Voice</button>
              <button type="button" role="tab" aria-selected={answerMode === 'text'} onClick={() => setAnswerMode('text')} className={answerMode === 'text' ? 'active' : ''}>Text</button>
              {currentQuestion?.isCodeQuestion && (
                <button type="button" role="tab" aria-selected={answerMode === 'code'} onClick={() => setAnswerMode('code')} className={answerMode === 'code' ? 'active' : ''}>Code</button>
              )}
            </div>

            {answerMode === 'voice' && <VoiceRecorder onSubmit={handleVoiceSubmit} />}
            {answerMode === 'text' && (
              <div className="text-answer">
                <textarea value={textAnswer} onChange={e => setTextAnswer(e.target.value)}
                  placeholder="Structure your response and explain your reasoning…" rows={5} />
                <button onClick={handleTextSubmit} disabled={!textAnswer.trim()}>Submit answer <span aria-hidden="true">→</span></button>
              </div>
            )}
            {answerMode === 'code' && (
              <div className="code-answer">
                <CodeEditor value={code} onChange={setCode} language="javascript" />
                <button onClick={handleCodeSubmit} disabled={!code.trim()}>Submit code <span aria-hidden="true">→</span></button>
              </div>
            )}
          </section>
        )}

        {state === 'thinking' && <div className="interview-state thinking-indicator"><span className="state-spinner" /><div><strong>Reviewing your response</strong><span>Take a breath — the next question is on its way.</span></div></div>}
        {state === 'farewell' && <div className="interview-state farewell"><span className="farewell-mark">✓</span><div><strong>That’s a wrap</strong><span>Preparing your feedback report…</span></div></div>}
      </div>
    </main>
  );
}

export default InterviewPage;
