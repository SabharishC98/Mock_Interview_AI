import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume, getResume, startInterview } from '../../services/interviewService.js';
import toast from 'react-hot-toast';
import './InterviewSetupPage.css';

const ROLES = [
  { id: 'frontend', label: 'Frontend Engineer', icon: '🎨' },
  { id: 'backend', label: 'Backend Engineer', icon: '⚙️' },
  { id: 'fullstack', label: 'Full Stack Engineer', icon: '🔗' },
  { id: 'data-analyst', label: 'Data Analyst', icon: '📊' },
  { id: 'devops', label: 'DevOps Engineer', icon: '🚀' },
  { id: 'mobile', label: 'Mobile Engineer', icon: '📱' },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Junior', questions: 3, desc: 'Entry-level questions, 3 rounds' },
  { id: 'medium', label: 'Mid-level', questions: 5, desc: 'Standard mix, 5 rounds' },
  { id: 'hard', label: 'Senior', questions: 8, desc: 'Deep dives, 8 rounds' },
];

function InterviewSetupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    getResume()
      .then(data => {
        if (data) {
          setResumeText(data.text);
          setResumeFileName(data.fileName);
        }
      })
      .catch(() => {});
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadResume(file);
      setResumeText(data.text);
      setResumeFileName(data.fileName);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleStart = async () => {
    if (!resumeText) return toast.error('Please upload your resume first');
    setStarting(true);
    try {
      const difficulty = DIFFICULTIES.find(d => d.id === selectedDifficulty);
      const result = await startInterview(selectedRole, resumeText, difficulty.questions);
      navigate(`/interview/${result.interview._id}`, {
        state: { audioBase64: result.audioBase64 },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setStarting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!selectedRole;
    if (step === 2) return !!selectedDifficulty;
    if (step === 3) return !!resumeText;
    return false;
  };

  return (
    <div className="setup-page">
      <div className="setup-container">

        {/* Progress steps */}
        <div className="setup-progress">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`progress-step ${step === n ? 'active' : ''} ${step > n ? 'done' : ''}`}
            >
              <div className="step-dot">{step > n ? '✓' : n}</div>
              <span>{n === 1 ? 'Role' : n === 2 ? 'Difficulty' : 'Resume'}</span>
            </div>
          ))}
        </div>

        <div className="setup-card">

          {/* Step 1 — Role */}
          {step === 1 && (
            <div className="setup-step">
              <h2>What role are you interviewing for?</h2>
              <p>Natalie will tailor every question to your target position</p>
              <div className="roles-grid">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    className={`role-btn ${selectedRole === role.id ? 'selected' : ''}`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <span className="role-icon">{role.icon}</span>
                    <span>{role.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Difficulty */}
          {step === 2 && (
            <div className="setup-step">
              <h2>Choose your difficulty level</h2>
              <p>This determines question complexity and session length</p>
              <div className="difficulty-list">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d.id}
                    className={`difficulty-btn ${selectedDifficulty === d.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDifficulty(d.id)}
                  >
                    <div className="difficulty-info">
                      <strong>{d.label}</strong>
                      <span>{d.desc}</span>
                    </div>
                    <div className="difficulty-check">
                      {selectedDifficulty === d.id ? '●' : '○'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Resume */}
          {step === 3 && (
            <div className="setup-step">
              <h2>Upload your resume</h2>
              <p>We'll extract your experience to generate personalised questions</p>
              <label
                className={`upload-zone ${resumeFileName ? 'has-file' : ''} ${uploading ? 'uploading' : ''}`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  hidden
                />
                {uploading ? (
                  <div className="upload-state">
                    <div className="spinner large" />
                    <span>Parsing resume…</span>
                  </div>
                ) : resumeFileName ? (
                  <div className="upload-state success">
                    <span className="upload-check">✓</span>
                    <strong>{resumeFileName}</strong>
                    <span>Click to replace</span>
                  </div>
                ) : (
                  <div className="upload-state">
                    <span className="upload-icon">📄</span>
                    <strong>Drop your PDF here</strong>
                    <span>or click to browse — max 5MB</span>
                  </div>
                )}
              </label>
            </div>
          )}

          {/* Footer navigation */}
          <div className="setup-footer">
            {step > 1 && (
              <button className="back-btn" onClick={() => setStep(s => s - 1)}>
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                className="next-btn"
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
              >
                Continue →
              </button>
            ) : (
              <button
                className="start-btn"
                onClick={handleStart}
                disabled={!canProceed() || starting}
              >
                {starting ? (
                  <><span className="btn-spinner" /> Preparing interview…</>
                ) : (
                  '🎙 Start interview'
                )}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default InterviewSetupPage;