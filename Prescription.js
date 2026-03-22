import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');

  .rx-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
  }

  .rx-topbar {
    background: white;
    padding: 0 28px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 100;
  }

  .rx-topbar-left { display: flex; align-items: center; gap: 12px; }

  .rx-back {
    width: 38px; height: 38px;
    border-radius: 10px; border: 1px solid #eee;
    background: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.2s;
  }
  .rx-back:hover { background: #fff5f5; border-color: #ffcdd2; }

  .rx-title {
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 700; color: #1a1a2e;
  }

  .rx-badge {
    background: #fff5f5; color: #e53935;
    font-size: 12px; font-weight: 700;
    padding: 4px 12px; border-radius: 20px;
    border: 1px solid #ffcdd2;
  }

  .rx-body {
    max-width: 860px;
    margin: 0 auto;
    padding: 28px 24px;
  }

  /* LOADING */
  .rx-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    min-height: 60vh; gap: 14px;
  }

  .rx-spinner {
    width: 44px; height: 44px;
    border: 4px solid #ffcdd2;
    border-top-color: #e53935;
    border-radius: 50%;
    animation: rxSpin 0.8s linear infinite;
  }

  @keyframes rxSpin { to { transform: rotate(360deg); } }

  /* EMPTY */
  .rx-empty {
    text-align: center; padding: 60px 20px;
    background: white; border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }
  .rx-empty-icon { font-size: 52px; margin-bottom: 14px; }
  .rx-empty-title {
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px;
  }
  .rx-empty-sub { font-size: 14px; color: #888; }

  /* PRESCRIPTION CARD */
  .rx-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    border: 1px solid rgba(0,0,0,0.04);
    margin-bottom: 20px;
    animation: fadeUp 0.5s both;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .rx-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.1);
  }

  /* Card Header — looks like a real prescription pad */
  .rx-card-header {
    background: linear-gradient(135deg, #c62828, #e53935);
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
  }

  .rx-card-header::before {
    content: 'Rx';
    position: absolute;
    right: 20px; top: 50%;
    transform: translateY(-50%);
    font-family: 'DM Mono', monospace;
    font-size: 64px; font-weight: 500;
    color: rgba(255,255,255,0.08);
    line-height: 1;
  }

  .rx-doctor-info { position: relative; z-index: 1; }

  .rx-doctor-name {
    font-family: 'Outfit', sans-serif;
    font-size: 17px; font-weight: 800; color: white;
    margin-bottom: 4px;
  }

  .rx-doctor-label {
    font-size: 12px; color: rgba(255,255,255,0.75);
  }

  .rx-date-badge {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 10px;
    padding: 8px 14px;
    text-align: center;
    position: relative; z-index: 1;
  }

  .rx-date-val {
    font-family: 'DM Mono', monospace;
    font-size: 13px; font-weight: 500; color: white;
  }

  .rx-date-label { font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 2px; }

  /* Card Body */
  .rx-card-body { padding: 20px 24px; }

  .rx-section-label {
    font-size: 11px; font-weight: 700;
    color: #888; text-transform: uppercase;
    letter-spacing: 1px; margin-bottom: 10px;
  }

  /* Medicines */
  .rx-medicines { margin-bottom: 18px; }

  .rx-med-list {
    display: flex; flex-wrap: wrap; gap: 8px;
  }

  .rx-med-chip {
    display: flex; align-items: center; gap: 6px;
    background: #fff5f5; color: #c62828;
    border: 1px solid #ffcdd2;
    border-radius: 10px; padding: 7px 12px;
    font-size: 13px; font-weight: 600;
    transition: all 0.2s;
  }

  .rx-med-chip:hover {
    background: #e53935; color: white;
    border-color: #e53935;
  }

  /* Notes */
  .rx-notes-box {
    background: #fffde7;
    border: 1px solid #fff9c4;
    border-radius: 12px;
    padding: 14px 16px;
    display: flex; gap: 10px; align-items: flex-start;
  }

  .rx-notes-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .rx-notes-text { font-size: 13.5px; color: #5d4037; line-height: 1.6; }

  /* Card Footer */
  .rx-card-footer {
    padding: 14px 24px;
    border-top: 1px solid #f5f5f5;
    display: flex; align-items: center; justify-content: space-between;
    background: #fafafa;
  }

  .rx-footer-info { font-size: 12px; color: #888; }

  .rx-print-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 8px;
    border: 1px solid #eee; background: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600; color: #555;
    cursor: pointer; transition: all 0.2s;
  }

  .rx-print-btn:hover { border-color: #e53935; color: #e53935; background: #fff5f5; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .rx-card:nth-child(1) { animation-delay: 0.1s; }
  .rx-card:nth-child(2) { animation-delay: 0.2s; }
  .rx-card:nth-child(3) { animation-delay: 0.3s; }
`;
document.head.appendChild(style);

function Prescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const snapshot = await getDocs(collection(db, 'prescription'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrescriptions(data);
      setLoading(false);
    };
    fetchPrescriptions();
  }, []);

  if (loading) return (
    <div className="rx-root">
      <div className="rx-loading">
        <div className="rx-spinner" />
        <p style={{ fontFamily: 'Outfit, sans-serif', color: '#888' }}>Loading prescriptions...</p>
      </div>
    </div>
  );

  return (
    <div className="rx-root">

      {/* TOPBAR */}
      <div className="rx-topbar">
        <div className="rx-topbar-left">
          <button className="rx-back" onClick={() => navigate('/dashboard')}>←</button>
          <span className="rx-title">📋 My Prescriptions</span>
        </div>
        <span className="rx-badge">{prescriptions.length} Total</span>
      </div>

      <div className="rx-body">

        {prescriptions.length === 0 ? (
          <div className="rx-empty">
            <div className="rx-empty-icon">📋</div>
            <div className="rx-empty-title">No Prescriptions Found</div>
            <div className="rx-empty-sub">Your doctor's prescriptions will appear here</div>
          </div>
        ) : (
          prescriptions.map((p, i) => (
            <div className="rx-card" key={p.id}>

              {/* Header */}
              <div className="rx-card-header">
                <div className="rx-doctor-info">
                  <div className="rx-doctor-name">👨‍⚕️ {p.doctorName || 'Doctor'}</div>
                  <div className="rx-doctor-label">Prescription #{i + 1}</div>
                </div>
                <div className="rx-date-badge">
                  <div className="rx-date-val">{p.date || 'N/A'}</div>
                  <div className="rx-date-label">Date</div>
                </div>
              </div>

              {/* Body */}
              <div className="rx-card-body">

                {/* Medicines */}
                <div className="rx-medicines">
                  <div className="rx-section-label">💊 Prescribed Medicines</div>
                  <div className="rx-med-list">
                    {(Array.isArray(p.medicines) ? p.medicines : [p.medicines]).map((med, j) => (
                      <span className="rx-med-chip" key={j}>
                        💊 {med}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {p.notes && (
                  <div>
                    <div className="rx-section-label">📝 Doctor's Notes</div>
                    <div className="rx-notes-box">
                      <span className="rx-notes-icon">📝</span>
                      <span className="rx-notes-text">{p.notes}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="rx-card-footer">
                <span className="rx-footer-info">🏥 Issued by {p.doctorName || 'Doctor'}</span>
                <button className="rx-print-btn" onClick={() => window.print()}>
                  🖨️ Print
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Prescription;