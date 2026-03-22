import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  .dash-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  /* Ambient bg */
  .dash-root::before {
    content: '';
    position: fixed;
    top: -200px; left: -200px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(229,57,53,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .dash-root::after {
    content: '';
    position: fixed;
    bottom: -150px; right: -150px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(25,118,210,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* TOPBAR */
  .dash-topbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(229,57,53,0.1);
    padding: 0 32px;
    height: 68px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
  }

  .topbar-logo {
    display: flex; align-items: center; gap: 10px;
  }

  .topbar-logo-icon {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, #e53935, #c62828);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 14px rgba(229,57,53,0.35);
    animation: logoPulse 3s ease-in-out infinite;
  }

  @keyframes logoPulse {
    0%,100% { box-shadow: 0 4px 14px rgba(229,57,53,0.35); }
    50% { box-shadow: 0 4px 24px rgba(229,57,53,0.6); }
  }

  .topbar-logo-text {
    font-family: 'Outfit', sans-serif;
    font-size: 20px; font-weight: 800;
    color: #1a1a2e; letter-spacing: -0.5px;
  }
  .topbar-logo-text span { color: #e53935; }

  .topbar-right { display: flex; align-items: center; gap: 12px; }

  .topbar-user {
    display: flex; align-items: center; gap: 10px;
    background: #f8f8f8;
    border-radius: 50px;
    padding: 6px 16px 6px 6px;
    border: 1px solid #eee;
  }

  .user-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e53935, #1976d2);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: white;
  }

  .user-email {
    font-size: 13px; color: #444; font-weight: 500;
    max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }

  .sos-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #e53935, #c62828);
    color: white; border: none; border-radius: 50px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; letter-spacing: 0.5px;
    box-shadow: 0 4px 16px rgba(229,57,53,0.4);
    animation: sosPulse 2s infinite;
    transition: transform 0.2s;
  }

  @keyframes sosPulse {
    0%,100% { box-shadow: 0 4px 16px rgba(229,57,53,0.4); }
    50% { box-shadow: 0 4px 28px rgba(229,57,53,0.7); }
  }

  .sos-btn:hover { transform: scale(1.05); }

  .logout-btn {
    padding: 9px 18px;
    background: white; color: #666;
    border: 1px solid #ddd; border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .logout-btn:hover { background: #fff5f5; color: #e53935; border-color: #ffcdd2; }

  /* MAIN */
  .dash-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
    position: relative; z-index: 1;
  }

  /* WELCOME BANNER */
  .welcome-banner {
    background: linear-gradient(135deg, #c62828 0%, #e53935 50%, #ef5350 100%);
    border-radius: 24px;
    padding: 32px 36px;
    margin-bottom: 28px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 16px 48px rgba(229,57,53,0.3);
    animation: bannerIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes bannerIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .welcome-banner::before {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    top: -100px; right: -60px;
  }
  .welcome-banner::after {
    content: '';
    position: absolute;
    width: 200px; height: 200px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%;
    bottom: -60px; right: 200px;
  }

  .welcome-content { position: relative; z-index: 1; }

  .welcome-greeting {
    font-family: 'Outfit', sans-serif;
    font-size: 28px; font-weight: 800;
    color: white; letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .welcome-sub { font-size: 14px; color: rgba(255,255,255,0.8); }

  .welcome-stats {
    display: flex; gap: 24px; margin-top: 24px;
  }

  .welcome-stat {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 16px;
    padding: 14px 20px;
    min-width: 120px;
    transition: transform 0.2s;
  }
  .welcome-stat:hover { transform: translateY(-3px); }

  .ws-value {
    font-family: 'Outfit', sans-serif;
    font-size: 24px; font-weight: 800;
    color: white; line-height: 1;
    margin-bottom: 4px;
  }
  .ws-label { font-size: 12px; color: rgba(255,255,255,0.75); }

  /* VITALS ROW */
  .vitals-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .vital-card {
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border: 1px solid rgba(0,0,0,0.04);
    position: relative;
    overflow: hidden;
    transition: transform 0.25s, box-shadow 0.25s;
    animation: cardIn 0.6s both;
  }

  .vital-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.1);
  }

  .vital-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    border-radius: 20px 20px 0 0;
  }

  .vital-card.red::before { background: linear-gradient(90deg, #e53935, #ef5350); }
  .vital-card.blue::before { background: linear-gradient(90deg, #1976d2, #42a5f5); }
  .vital-card.green::before { background: linear-gradient(90deg, #2e7d32, #66bb6a); }
  .vital-card.orange::before { background: linear-gradient(90deg, #e65100, #ffa726); }

  .vital-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    margin-bottom: 14px;
    animation: iconFloat 3s ease-in-out infinite;
  }

  @keyframes iconFloat {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  .vital-card.red .vital-icon { background: #fff5f5; animation-delay: 0s; }
  .vital-card.blue .vital-icon { background: #e3f2fd; animation-delay: 0.5s; }
  .vital-card.green .vital-icon { background: #f1f8e9; animation-delay: 1s; }
  .vital-card.orange .vital-icon { background: #fff3e0; animation-delay: 1.5s; }

  .vital-value {
    font-family: 'Outfit', sans-serif;
    font-size: 26px; font-weight: 800;
    color: #1a1a2e; letter-spacing: -0.5px;
    margin-bottom: 4px;
  }

  .vital-label { font-size: 12px; color: #888; font-weight: 500; }

  .vital-bar {
    height: 4px; background: #f0f0f0;
    border-radius: 4px; margin-top: 12px; overflow: hidden;
  }

  .vital-bar-fill {
    height: 100%; border-radius: 4px;
    transition: width 1.5s ease;
  }

  .vital-card.red .vital-bar-fill { background: linear-gradient(90deg, #e53935, #ef5350); }
  .vital-card.blue .vital-bar-fill { background: linear-gradient(90deg, #1976d2, #42a5f5); }
  .vital-card.green .vital-bar-fill { background: linear-gradient(90deg, #2e7d32, #66bb6a); }
  .vital-card.orange .vital-bar-fill { background: linear-gradient(90deg, #e65100, #ffa726); }

  /* SECTION TITLE */
  .section-title {
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 700;
    color: #1a1a2e; letter-spacing: -0.3px;
    margin-bottom: 16px;
  }

  /* QUICK ACTIONS GRID */
  .actions-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .action-card {
    background: white;
    border-radius: 20px;
    padding: 24px 16px;
    text-align: center;
    cursor: pointer;
    border: none;
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border: 1px solid rgba(0,0,0,0.04);
    animation: cardIn 0.6s both;
    position: relative;
    overflow: hidden;
  }

  .action-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--card-color);
    opacity: 0;
    transition: opacity 0.25s;
    border-radius: 20px;
  }

  .action-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0,0,0,0.12);
  }

  .action-card:hover::after { opacity: 0.05; }

  .action-icon-wrap {
    width: 60px; height: 60px;
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    margin: 0 auto 14px;
    transition: transform 0.25s;
    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  }

  .action-card:hover .action-icon-wrap { transform: scale(1.1) rotate(-5deg); }

  .action-name {
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px; font-weight: 700;
    color: #1a1a2e; margin-bottom: 4px;
  }

  .action-desc { font-size: 11.5px; color: #999; line-height: 1.4; }

  /* BOTTOM GRID */
  .bottom-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .info-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border: 1px solid rgba(0,0,0,0.04);
    animation: cardIn 0.6s both;
  }

  .info-card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid #f5f5f5;
  }

  .info-card-title {
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700; color: #1a1a2e;
  }

  .info-card-badge {
    font-size: 11px; font-weight: 700;
    padding: 4px 10px; border-radius: 20px;
  }

  .tip-item {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid #f9f9f9;
  }
  .tip-item:last-child { border-bottom: none; padding-bottom: 0; }

  .tip-icon {
    width: 38px; height: 38px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }

  .tip-title { font-size: 13.5px; font-weight: 600; color: #1a1a2e; margin-bottom: 3px; }
  .tip-desc { font-size: 12px; color: #888; line-height: 1.5; }

  .med-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 0;
    border-bottom: 1px solid #f9f9f9;
  }
  .med-item:last-child { border-bottom: none; padding-bottom: 0; }

  .med-icon {
    width: 38px; height: 38px; border-radius: 12px;
    background: #fff5f5;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }

  .med-name { font-size: 13px; font-weight: 600; color: #1a1a2e; }
  .med-dose { font-size: 11.5px; color: #888; margin-top: 2px; }
  .med-time {
    margin-left: auto;
    font-size: 11px; font-weight: 600;
    background: #fff5f5; color: #e53935;
    padding: 4px 10px; border-radius: 8px;
    white-space: nowrap;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .vital-card:nth-child(1) { animation-delay: 0.1s; }
  .vital-card:nth-child(2) { animation-delay: 0.15s; }
  .vital-card:nth-child(3) { animation-delay: 0.2s; }
  .vital-card:nth-child(4) { animation-delay: 0.25s; }
  .action-card:nth-child(1) { animation-delay: 0.2s; }
  .action-card:nth-child(2) { animation-delay: 0.25s; }
  .action-card:nth-child(3) { animation-delay: 0.3s; }
  .action-card:nth-child(4) { animation-delay: 0.35s; }
  .action-card:nth-child(5) { animation-delay: 0.4s; }
  .action-card:nth-child(6) { animation-delay: 0.45s; }
  .action-card:nth-child(7) { animation-delay: 0.5s; }
  .action-card:nth-child(8) { animation-delay: 0.55s; }

  @media (max-width: 768px) {
    .vitals-row { grid-template-columns: repeat(2,1fr); }
    .actions-grid { grid-template-columns: repeat(2,1fr); }
    .bottom-grid { grid-template-columns: 1fr; }
    .welcome-stats { flex-wrap: wrap; }
  }
`;
document.head.appendChild(style);

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate('/');
      else setUser(currentUser);
    });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12, animation: 'logoPulse 1s infinite' }}>🏥</div>
        <p style={{ fontFamily: 'Outfit, sans-serif', color: '#888' }}>Loading your dashboard...</p>
      </div>
    </div>
  );

  const initials = user.email?.slice(0, 2).toUpperCase();

  const actions = [
    { icon: '🏥', name: 'Find Hospital', desc: 'Nearest clinics & hospitals', color: '#e3f2fd', route: '/find-hospital', cardColor: '#1976d2' },
    { icon: '📅', name: 'Book Appointment', desc: 'Schedule doctor visit', color: '#f1f8e9', route: '/book-appointment', cardColor: '#2e7d32' },
    { icon: '🎥', name: 'Video Consult', desc: 'Talk to doctor online', color: '#f3e5f5', route: '/consultation', cardColor: '#7b1fa2' },
    { icon: '💊', name: 'Order Medicines', desc: 'Home delivery available', color: '#fff3e0', route: '/order-medicines', cardColor: '#e65100' },
    { icon: '📋', name: 'Prescriptions', desc: 'View doctor Rx', color: '#e8f5e9', route: '/prescription', cardColor: '#388e3c' },
    { icon: '🩹', name: 'First Aid', desc: 'Emergency procedures', color: '#fce4ec', route: '/first-aid', cardColor: '#c2185b' },
    { icon: '🚨', name: 'Emergency', desc: 'SOS & contacts', color: '#ffebee', route: '/emergency', cardColor: '#b71c1c' },
    { icon: '📊', name: 'Health Records', desc: 'Your medical history', color: '#e8eaf6', route: '/dashboard', cardColor: '#3949ab' },
  ];

  return (
    <div className="dash-root">

      {/* TOPBAR */}
      <div className="dash-topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-icon">🏥</div>
          <span className="topbar-logo-text">Care-<span>Alert</span></span>
        </div>
        <div className="topbar-right">
          <div className="topbar-user">
            <img
  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=e53935&color=fff&size=34&rounded=true&bold=true`}
  alt="avatar"
  style={{width:34, height:34, borderradius:'50%', flexshrink:0}}
/>
            <span className="user-email">{user.email}</span>
          </div>
          <button className="sos-btn" onClick={() => navigate('/emergency')}>🚨 SOS</button>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      <div className="dash-main">

        {/* WELCOME BANNER */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <div className="welcome-greeting">Good day, {user.email?.split('@')[0]} 👋</div>
            <div className="welcome-sub">Here's your health overview for today</div>
            <div className="welcome-stats">
              <div className="welcome-stat">
                <div className="ws-value">2</div>
                <div className="ws-label">📅 Appointments</div>
              </div>
              <div className="welcome-stat">
                <div className="ws-value">4</div>
                <div className="ws-label">💊 Medicines</div>
              </div>
              <div className="welcome-stat">
                <div className="ws-value">83</div>
                <div className="ws-label">❤️ Health Score</div>
              </div>
              <div className="welcome-stat">
                <div className="ws-value">3</div>
                <div className="ws-label">🚨 Contacts</div>
              </div>
            </div>
          </div>
        </div>

        {/* VITALS */}
        <div className="section-title">📊 Today's Vitals</div>
        <div className="vitals-row">
          <div className="vital-card red">
            <div className="vital-icon">❤️</div>
            <div className="vital-value">72 <span style={{fontSize:14,color:'#888'}}>bpm</span></div>
            <div className="vital-label">Heart Rate</div>
            <div className="vital-bar"><div className="vital-bar-fill" style={{width:'72%'}} /></div>
          </div>
          <div className="vital-card blue">
            <div className="vital-icon">🩸</div>
            <div className="vital-value">118<span style={{fontSize:14,color:'#888'}}>/78</span></div>
            <div className="vital-label">Blood Pressure</div>
            <div className="vital-bar"><div className="vital-bar-fill" style={{width:'60%'}} /></div>
          </div>
          <div className="vital-card green">
            <div className="vital-icon">🫁</div>
            <div className="vital-value">98 <span style={{fontSize:14,color:'#888'}}>%</span></div>
            <div className="vital-label">SpO₂ Level</div>
            <div className="vital-bar"><div className="vital-bar-fill" style={{width:'98%'}} /></div>
          </div>
          <div className="vital-card orange">
            <div className="vital-icon">🧪</div>
            <div className="vital-value">95 <span style={{fontSize:14,color:'#888'}}>mg/dL</span></div>
            <div className="vital-label">Blood Sugar</div>
            <div className="vital-bar"><div className="vital-bar-fill" style={{width:'50%'}} /></div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="section-title">⚡ Quick Actions</div>
        <div className="actions-grid">
          {actions.map((a, i) => (
            <button key={i} className="action-card"
              style={{'--card-color': a.cardColor}}
              onClick={() => navigate(a.route)}>
              <div className="action-icon-wrap" style={{background: a.color}}>
                {a.icon}
              </div>
              <div className="action-name">{a.name}</div>
              <div className="action-desc">{a.desc}</div>
            </button>
          ))}
        </div>

        {/* BOTTOM */}
        <div className="bottom-grid">

          {/* Today's Medicines */}
          <div className="info-card">
            <div className="info-card-header">
              <span className="info-card-title">💊 Today's Medicines</span>
              <span className="info-card-badge" style={{background:'#fff5f5',color:'#e53935'}}>4 Due</span>
            </div>
            {[
              { name: 'Metformin 500mg', dose: '1 tablet after meal', time: '8:00 AM ✓' },
              { name: 'Amlodipine 5mg', dose: '1 tablet before meal', time: '2:00 PM' },
              { name: 'Vitamin D3 60K', dose: 'Once weekly', time: 'Today' },
              { name: 'Pantoprazole 40mg', dose: '1 tablet empty stomach', time: '9:00 PM' },
            ].map((m, i) => (
              <div className="med-item" key={i}>
                <div className="med-icon">💊</div>
                <div>
                  <div className="med-name">{m.name}</div>
                  <div className="med-dose">{m.dose}</div>
                </div>
                <div className="med-time">{m.time}</div>
              </div>
            ))}
          </div>

          {/* Health Tips */}
          <div className="info-card">
            <div className="info-card-header">
              <span className="info-card-title">🌟 Daily Health Tips</span>
              <span className="info-card-badge" style={{background:'#f1f8e9',color:'#2e7d32'}}>Today</span>
            </div>
            {[
              { icon: '🚶', bg: '#e3f2fd', title: '10,000 Steps Goal', desc: 'You\'ve walked 6,240 steps today. Keep moving!' },
              { icon: '💧', bg: '#e0f7fa', title: 'Stay Hydrated', desc: 'Drink 8 glasses of water. Dehydration worsens BP.' },
              { icon: '😴', bg: '#f3e5f5', title: 'Sleep 7–8 Hours', desc: 'Good sleep reduces heart disease risk by 34%.' },
            ].map((t, i) => (
              <div className="tip-item" key={i}>
                <div className="tip-icon" style={{background: t.bg}}>{t.icon}</div>
                <div>
                  <div className="tip-title">{t.title}</div>
                  <div className="tip-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;