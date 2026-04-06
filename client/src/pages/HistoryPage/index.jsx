import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteHistoryItem, clearHistory } from '../../services/historyService.js';
import InterviewCard from '../../components/InterviewCard/index.jsx';
import toast from 'react-hot-toast';
import './HistoryPage.css';

const PER_PAGE = 9;

function HistoryPage() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async (p = page) => {
    setLoading(true);
    try {
      const data = await getHistory(p, PER_PAGE);
      setInterviews(data.entries);
      setTotalPages(data.totalPages);
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const handleDelete = async (interviewId) => {
    setInterviews(prev => prev.filter(i => i._id !== interviewId));
    try { await deleteHistoryItem(interviewId); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); load(page); }
  };

  const handleClear = async () => {
    if (!confirm('Delete all interview history? This cannot be undone.')) return;
    try { await clearHistory(); setInterviews([]); setTotalPages(1); toast.success('History cleared'); }
    catch { toast.error('Failed to clear history'); }
  };

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div>
            <h1>Interview history</h1>
            <p>Review your past sessions and track your progress</p>
          </div>
          <div className="history-actions">
            <button onClick={() => navigate('/setup')} className="new-btn">+ New interview</button>
            {interviews.length > 0 && (
              <button onClick={handleClear} className="clear-btn">Clear all</button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="history-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="card-skeleton" />)}
          </div>
        ) : interviews.length === 0 ? (
          <div className="history-empty">
            <div className="empty-icon">📂</div>
            <h3>No interviews yet</h3>
            <p>Start your first mock interview to see your history here</p>
            <button onClick={() => navigate('/setup')} className="new-btn">Start practicing →</button>
          </div>
        ) : (
          <>
            <div className="history-grid">
              {interviews.map(interview => (
                <InterviewCard key={interview._id} interview={interview} onDelete={handleDelete} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
export default HistoryPage;