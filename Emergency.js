import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

  .em-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
  }

  .em-topbar {
    background: white;
    padding: 0 28px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 100;
  }

  .em-topbar-left { display: flex; align-items: center; gap: 12px; }

  .em-back {
    width: 38px; height: 38px;
    border-radius: 10px; border: 1px solid #eee;
    background: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.2s;
  }
  .em-back:hover { background: #fff5f5; border-color: #ffcdd2; }

  .em-title {
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 700; color: #1a1a2e;
  }

  .em-badge {
    background: #fff5f5; color: #e53935;
    font-size: 12px; font-weight: 700;
    padding: 4px 12px; border-radius: 20px;
    border: 1px solid #ffcdd2;
  }

  .em-body {
    max-width: 900px;
    margin: 0 auto;
    padding: 28px 24px;
  }

  /* SOS SECTION */
  .em-sos-section {
    background: linear-gradient(135deg, #b71c1c 0%, #e53935 50%, #ef5350 100%);
    border-radius: 24px;
    padding: 36px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
    box-shadow: 0 16px 48px rgba(229,57,53,0.35);
    animation: fadeUp 0.6s both;
  }

  .em-sos-section::before {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    top: -100px; right: -80px;
  }

  .em-sos-section::after {
    content: '';
    position: absolute;
    width: 200px; height: 200px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
    bottom: -60px; left: -40px;
  }

  .em-sos-title {
    font-family: 'Outfit', sans-serif;
    font-size: 22px; font-weight: 800;
    color: white; margin-bottom: 6px;
    position: relative; z-index: 1;
  }

  .em-sos-sub {
    font-size: 13px; color: rgba(255,255,255,0.8);
    margin-bottom: 28px;
    position: relative; z-index: 1;
  }

  .em-sos-btn {
    width: 130px; height: 130px;
    border-radius: 50%;
    background: white;
    border: none; cursor: pointer;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    margin: 0 auto;
    box-shadow: 0 0 0 12px rgba(255,255,255,0.15), 0 0 0 24px rgba(255,255,255,0.08);
    transition: all 0.2s;
    position: relative; z-index: 1;
    animation: sosPulse 2s ease-in-out infinite;
  }

  @keyframes sosPulse {
    0%,100% { box-shadow: 0 0 0 12px rgba(255,255,255,0.15), 0 0 0 24px rgba(255,255,255,0.08); }
    50% { box-shadow: 0 0 0 18px rgba(255,255,255,0.2), 0 0 0 36px rgba(255,255,255,0.05); }
  }

  .em-sos-btn:hover { transform: scale(1.06); }
  .em-sos-btn:active { transform: scale(0.96); }

  .em-sos-btn-icon { font-size: 40px; line-height: 1; }
  .em-sos-btn-text {
    font-family: 'Outfit', sans-serif;
    font-size: 16px; font-weight: 800;
    color: #e53935; letter-spacing: 2px;
    margin-top: 4px;
  }

  .em-sos-hint {
    font-size: 12px; color: rgba(255,255,255,0.7);
    margin-top: 20px;
    position: relative; z-index: 1;
  }

  /* LOCATION ALERT */
  .em-location-alert {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 14px;
    padding: 12px 18px;
    margin-top: 20px;
    display: flex; align-items: center; gap: 10px;
    position: relative; z-index: 1;
  }

  .em-location-text { font-size: 13px; color: white; font-weight: 500; }

  /* GRID */
  .em-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  /* CARDS */
  .em-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border: 1px solid rgba(0,0,0,0.04);
    animation: fadeUp 0.6s both;
  }

  .em-card-header {
    padding: 18px 20px 14px;
    border-bottom: 1px solid #f5f5f5;
    display: flex; align-items: center; justify-content: space-between;
  }

  .em-card-title {
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700; color: #1a1a2e;
  }

  .em-card-count {
    font-size: 12px; font-weight: 700;
    background: #fff5f5; color: #e53935;
    padding: 3px 10px; border-radius: 20px;
    border: 1px solid #ffcdd2;
  }

  /* ADD FORM */
  .em-form { padding: 16px 20px; }

  .em-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #eee;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: #1a1a2e;
    background: #fafafa;
    outline: none;
    transition: all 0.2s;
    margin-bottom: 10px;
  }

  .em-input:focus {
    border-color: #e53935;
    background: white;
    box-shadow: 0 0 0 3px rgba(229,57,53,0.08);
  }

  .em-add-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #e53935, #c62828);
    color: white; border: none; border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(229,57,53,0.3);
  }

  .em-add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(229,57,53,0.4); }
  .em-add-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* CONTACTS LIST */
  .em-contacts { padding: 8px 0; }

  .em-contact-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid #fafafa;
    transition: background 0.2s;
  }

  .em-contact-item:last-child { border-bottom: none; }
  .em-contact-item:hover { background: #fff5f5; }

  .em-contact-avatar {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, #e53935, #ff7043);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700; color: white;
    flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(229,57,53,0.25);
  }

  .em-contact-info { flex: 1; }
  .em-contact-name {
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 700; color: #1a1a2e;
  }
  .em-contact-relation {
    font-size: 12px; color: #e53935; font-weight: 600; margin-bottom: 2px;
  }
  .em-contact-phone { font-size: 12px; color: #888; }

  .em-delete-btn {
    width: 32px; height: 32px;
    border-radius: 8px; border: 1px solid #ffcdd2;
    background: #fff5f5; color: #e53935;
    cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .em-delete-btn:hover { background: #e53935; color: white; }

  .em-empty {
    padding: 32px; text-align: center;
  }
  .em-empty-icon { font-size: 36px; margin-bottom: 10px; }
  .em-empty-text { font-size: 13px; color: #888; }

  /* TIPS */
  .em-tips { padding: 12px 20px; }

  .em-tip-item {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid #fafafa;
  }
  .em-tip-item:last-child { border-bottom: none; }

  .em-tip-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }

  .em-tip-title { font-size: 13px; font-weight: 600; color: #1a1a2e; margin-bottom: 2px; }
  .em-tip-desc { font-size: 12px; color: #888; line-height: 1.5; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .em-card:nth-child(1) { animation-delay: 0.1s; }
  .em-card:nth-child(2) { animation-delay: 0.2s; }

  @media (max-width: 700px) {
    .em-grid { grid-template-columns: 1fr; }
  }
`;
document.head.appendChild(style);

function Emergency() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [currentUid, setCurrentUid] = useState(null);
  const [sosTriggered, setSosTriggered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUid(user.uid);
        fetchContacts(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchContacts = async (uid) => {
    const q = query(collection(db, 'emergency_contacts'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    setContacts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addContact = async () => {
    if (!name || !phone || !relation) return alert('Please fill all fields!');
    setLoading(true);
    try {
      await addDoc(collection(db, 'emergency_contacts'), {
        uid: currentUid, name, phone, relation, createdAt: new Date()
      });
      setName(''); setPhone(''); setRelation('');
      fetchContacts(currentUid);
    } catch (err) { alert('Error: ' + err.message); }
    setLoading(false);
  };

  const deleteContact = async (id) => {
    await deleteDoc(doc(db, 'emergency_contacts', id));
    fetchContacts(currentUid);
  };

  const handleSOS = () => {
    if (contacts.length === 0) return alert('Add emergency contacts first!');
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ latitude, longitude });
      setSosTriggered(true);
      alert(`🚨 SOS Triggered!\nLocation: ${latitude}, ${longitude}\nContacts notified: ${contacts.map(c => c.name).join(', ')}\n\n(Twilio SMS coming soon!)`);
      setTimeout(() => setSosTriggered(false), 5000);
    }, () => alert('Could not get location!'));
  };

  return (
    <div className="em-root">

      {/* TOPBAR */}
      <div className="em-topbar">
        <div className="em-topbar-left">
          <button className="em-back" onClick={() => navigate('/dashboard')}>←</button>
          <span className="em-title">🚨 Emergency</span>
        </div>
        <span className="em-badge">{contacts.length} Contacts</span>
      </div>

      <div className="em-body">

        {/* SOS SECTION */}
        <div className="em-sos-section">
          <div className="em-sos-title">Emergency SOS Alert</div>
          <div className="em-sos-sub">Press the button to instantly alert all your emergency contacts</div>

          <button className="em-sos-btn" onClick={handleSOS}>
            <span className="em-sos-btn-icon">🚨</span>
            <span className="em-sos-btn-text">SOS</span>
          </button>

          <div className="em-sos-hint">Hold to send location + SMS to all contacts</div>

          {location && sosTriggered && (
            <div className="em-location-alert">
              <span>📍</span>
              <span className="em-location-text">
                Location captured: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        {/* GRID */}
        <div className="em-grid">

          {/* ADD CONTACT */}
          <div className="em-card">
            <div className="em-card-header">
              <span className="em-card-title">➕ Add Emergency Contact</span>
            </div>
            <div className="em-form">
              <input className="em-input" placeholder="👤 Full Name" value={name} onChange={e => setName(e.target.value)} />
              <input className="em-input" placeholder="📞 Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
              <input className="em-input" placeholder="💞 Relation (e.g. Mom, Dad)" value={relation} onChange={e => setRelation(e.target.value)} />
              <button className="em-add-btn" onClick={addContact} disabled={loading}>
                {loading ? '⏳ Adding...' : '+ Add Contact'}
              </button>
            </div>

            {/* Tips */}
            <div className="em-card-header" style={{marginTop:4}}>
              <span className="em-card-title">⚡ Emergency Tips</span>
            </div>
            <div className="em-tips">
              {[
                { icon: '🚑', bg: '#fff5f5', title: 'Call 108', desc: 'National ambulance service — free & 24/7' },
                { icon: '🔥', bg: '#fff8e1', title: 'Call 101', desc: 'Fire emergency — dial immediately' },
                { icon: '👮', bg: '#e3f2fd', title: 'Call 100', desc: 'Police emergency helpline' },
              ].map((t, i) => (
                <div className="em-tip-item" key={i}>
                  <div className="em-tip-icon" style={{background: t.bg}}>{t.icon}</div>
                  <div>
                    <div className="em-tip-title">{t.title}</div>
                    <div className="em-tip-desc">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTACTS LIST */}
          <div className="em-card">
            <div className="em-card-header">
              <span className="em-card-title">👥 Emergency Contacts</span>
              <span className="em-card-count">{contacts.length} saved</span>
            </div>
            <div className="em-contacts">
              {contacts.length === 0 ? (
                <div className="em-empty">
                  <div className="em-empty-icon">👥</div>
                  <div className="em-empty-text">No contacts added yet.<br />Add someone who can help in emergencies.</div>
                </div>
              ) : (
                contacts.map(c => (
                  <div className="em-contact-item" key={c.id}>
                    <div className="em-contact-avatar">{c.name?.charAt(0).toUpperCase()}</div>
                    <div className="em-contact-info">
                      <div className="em-contact-relation">{c.relation}</div>
                      <div className="em-contact-name">{c.name}</div>
                      <div className="em-contact-phone">📞 {c.phone}</div>
                    </div>
                    <button className="em-delete-btn" onClick={() => deleteContact(c.id)}>🗑️</button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Emergency;