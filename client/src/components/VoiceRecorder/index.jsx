// client/src/components/VoiceRecorder/index.jsx
import { useState, useRef, useEffect } from 'react';
import './VoiceRecorder.css';

const MAX_RECORD_TIME = 300; // 5 minutes

function VoiceRecorder({ onSubmit, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    let timerId;
    if (isRecording) {
      timerId = setInterval(() => {
        setRecordingTime(prev => {
          if (prev + 1 >= MAX_RECORD_TIME) { stopRecording(); return MAX_RECORD_TIME; }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isRecording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    chunksRef.current = [];
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach(t => t.stop());
    };
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(250);
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSubmit = () => { if (audioBlob) onSubmit(audioBlob); };
  const handleReset = () => { setAudioBlob(null); setAudioUrl(null); setRecordingTime(0); };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="voice-recorder">
      {!audioBlob ? (
        <>
          <div className="recorder-hint"><span className="recorder-dot" />{isRecording ? 'Recording your response' : 'Take a moment, then answer in your own words'}</div>
          <button onClick={isRecording ? stopRecording : startRecording} disabled={disabled}
            className={`record-btn ${isRecording ? 'recording' : ''}`}>
            <span className="record-symbol" aria-hidden="true">{isRecording ? '■' : '●'}</span>
            {isRecording ? `Stop recording · ${formatTime(recordingTime)}` : 'Start recording'}
          </button>
          <span className="recorder-limit">Up to 5 minutes · You can review before submitting</span>
        </>
      ) : (
        <div className="preview">
          <audio src={audioUrl} controls />
          <div className="preview-actions">
            <button className="preview-submit" onClick={handleSubmit}>Submit answer</button>
            <button className="preview-reset" onClick={handleReset}>Record again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoiceRecorder;
