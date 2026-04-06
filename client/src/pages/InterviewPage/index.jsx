// client/src/pages/InterviewPage/index.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getInterview, submitTextAnswer, transcribeAudio,
         submitCode, endInterview } from '../../services/interviewService';
import AudioPlayer from '../../components/AudioPlayer';
import VoiceRecorder from '../../components/VoiceRecorder';
import CodeEditor from '../../components/CodeEditor';

// States: 'speaking' | 'listening' | 'thinking' | 'farewell'

function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [state, setState] = useState('speaking'); // interviewer state machine
  const [audioBase64, setAudioBase64] = useState(location.state?.audioBase64 || null);
  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [textAnswer, setTextAnswer] = useState('');
  const [code, setCode] = useState('');
  const [answerMode, setAnswerMode] = useState('voice'); // 'voice' | 'text'

  useEffect(() => {
    const load = async () => {
      const data = await getInterview(id);
      setInterview(data);
      setCurrentQuestionNum(data.currentQuestion);
      setTotalQuestions(data.totalQuestions);
      if (data.questions?.length > 0) {
        setCurrentQuestion(data.questions[data.currentQuestion - 1] || data.questions[0]);
      }
      if (!location.state?.audioBase64) setState('listening');
    };
    load();
  }, [id]);

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
      const result = await submitTextAnswer(id, transcript);
      processAnswerResult(result);
    } catch { setState('listening'); }
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

  return (
    <div className="interview-page">
      <div className="interview-header">
        <span>Question {currentQuestionNum} of {totalQuestions}</span>
        <span className={`status-badge ${state}`}>{state}</span>
        <button onClick={handleEndInterview} className="end-btn">End Interview</button>
      </div>

      <AudioPlayer audioBase64={audioBase64} autoPlay onEnded={handleAudioEnded} />

      {currentQuestion && (
        <div className="question-card">
          <p className="question-text">{currentQuestion.text}</p>
          {currentQuestion.isCodeQuestion && (
            <pre className="code-snippet">{currentQuestion.codeSnippet}</pre>
          )}
        </div>
      )}

      {state === 'listening' && (
        <div className="answer-section">
          <div className="answer-mode-tabs">
            <button onClick={() => setAnswerMode('voice')} className={answerMode === 'voice' ? 'active' : ''}>Voice</button>
            <button onClick={() => setAnswerMode('text')} className={answerMode === 'text' ? 'active' : ''}>Text</button>
            {currentQuestion?.isCodeQuestion && (
              <button onClick={() => setAnswerMode('code')} className={answerMode === 'code' ? 'active' : ''}>Code</button>
            )}
          </div>

          {answerMode === 'voice' && <VoiceRecorder onSubmit={handleVoiceSubmit} />}
          {answerMode === 'text' && (
            <div className="text-answer">
              <textarea value={textAnswer} onChange={e => setTextAnswer(e.target.value)}
                placeholder="Type your answer..." rows={5} />
              <button onClick={handleTextSubmit}>Submit</button>
            </div>
          )}
          {answerMode === 'code' && (
            <div className="code-answer">
              <CodeEditor value={code} onChange={setCode} language="javascript" />
              <button onClick={handleCodeSubmit}>Submit Code</button>
            </div>
          )}
        </div>
      )}

      {state === 'thinking' && <div className="thinking-indicator">Natalie is thinking...</div>}
      {state === 'farewell' && <div className="farewell">Generating your feedback...</div>}
    </div>
  );
}

export default InterviewPage;