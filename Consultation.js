import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-react';

const APP_ID = 'fea72b57f8624686b8390e076dbda6d1';
const TOKEN = '007eJxTYNCXtFsz93zHJ+uGW5P+LTt2qXm3OuNl0+kTuqO4LgiWWPEoMKSlJpobJZmap1mYGZmYWZglWRhbGqQamJulJKUkmqUYbnm9P7MhkJEhIUWBhZEBAkF8DoaU/OSS/CJdQwYGAPNVIPI=';

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

  .con-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
  }

  .con-topbar {
    background: white;
    padding: 0 28px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 100;
  }

  .con-topbar-left { display: flex; align-items: center; gap: 12px; }

  .con-back {
    width: 38px; height: 38px; border-radius: 10px;
    border: 1px solid #eee; background: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.2s;
  }
  .con-back:hover { background: #fff5f5; border-color: #ffcdd2; }

  .con-title {
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 700; color: #1a1a2e;
  }

  .con-badge {
    background: #e3f2fd; color: #1565c0;
    font-size: 12px; font-weight: 700;
    padding: 4px 12px; border-radius: 20px;
    border: 1px solid #bbdefb;
  }

  .con-body {
    max-width: 860px; margin: 0 auto; padding: 28px 24px;
  }

  /* HERO */
  .con-hero {
    background: linear-gradient(135deg, #0d47a1, #1976d2, #42a5f5);
    border-radius: 20px; padding: 28px 32px;
    margin-bottom: 28px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
    box-shadow: 0 12px 40px rgba(25,118,210,0.3);
    animation: fadeUp 0.6s both;
  }

  .con-hero::before {
    content: '🎥';
    position: absolute; right: 30px; top: 50%;
    transform: translateY(-50%);
    font-size: 80px; opacity: 0.12;
  }

  .con-hero-text h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 22px; font-weight: 800; color: white; margin-bottom: 6px;
  }

  .con-hero-text p { font-size: 13px; color: rgba(255,255,255,0.8); }

  .con-hero-stats {
    display: flex; gap: 12px;
  }

  .con-hero-stat {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 12px; padding: 10px 16px; text-align: center;
  }

  .con-hero-stat-val {
    font-family: 'Outfit', sans-serif;
    font-size: 20px; font-weight: 800; color: white;
  }

  .con-hero-stat-label { font-size: 11px; color: rgba(255,255,255,0.75); }

  /* DOCTOR CARDS */
  .con-doctors { display: flex; flex-direction: column; gap: 16px; }

  .con-doc-card {
    background: white; border-radius: 20px;
    border: 1.5px solid #eee;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    overflow: hidden;
    transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
    animation: fadeUp 0.5s both;
  }

  .con-doc-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.1);
    border-color: #bbdefb;
  }

  .con-doc-card-inner {
    display: flex; align-items: center; gap: 16px;
    padding: 20px 24px;
  }

  .con-doc-avatar {
    width: 60px; height: 60px; border-radius: 18px;
    background: linear-gradient(135deg, #1976d2, #42a5f5);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(25,118,210,0.3);
  }

  .con-doc-info { flex: 1; }

  .con-doc-name {
    font-family: 'Outfit', sans-serif;
    font-size: 16px; font-weight: 800; color: #1a1a2e; margin-bottom: 3px;
  }

  .con-doc-spec {
    font-size: 13px; color: #888; margin-bottom: 8px;
  }

  .con-doc-chips { display: flex; gap: 8px; flex-wrap: wrap; }

  .con-chip {
    font-size: 11.5px; font-weight: 600;
    padding: 4px 10px; border-radius: 8px;
  }

  .con-chip-fee { background: #e8f5e9; color: #2e7d32; }
  .con-chip-exp { background: #e3f2fd; color: #1565c0; }
  .con-chip-lang { background: #f3e5f5; color: #6a1b9a; }

  .con-doc-right { text-align: center; flex-shrink: 0; }

  .con-status {
    font-size: 12px; font-weight: 700;
    padding: 5px 12px; border-radius: 20px;
    margin-bottom: 10px; display: inline-block;
  }

  .con-status.available { background: #e8f5e9; color: #2e7d32; }
  .con-status.busy { background: #fff5f5; color: #e53935; }

  .con-join-btn {
    padding: 11px 24px; border: none; border-radius: 50px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    display: block; width: 100%;
  }

  .con-join-btn.active {
    background: linear-gradient(135deg, #1976d2, #0d47a1);
    color: white;
    box-shadow: 0 4px 14px rgba(25,118,210,0.4);
  }

  .con-join-btn.active:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(25,118,210,0.5);
  }

  .con-join-btn.disabled {
    background: #f5f5f5; color: #bbb; cursor: not-allowed;
  }

  /* VIDEO CALL UI */
  .vc-root {
    position: fixed; inset: 0;
    background: #080c10;
    display: flex; flex-direction: column;
    z-index: 9999;
  }

  .vc-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px;
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .vc-doctor-info { display: flex; align-items: center; gap: 12px; }

  .vc-doc-avatar {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, #1976d2, #42a5f5);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  .vc-doc-name {
    font-family: 'Outfit', sans-serif;
    font-size: 15px; font-weight: 700; color: white;
  }

  .vc-status-dot {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #aaa;
  }

  .vc-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #4caf50;
    animation: vcPulse 1.5s infinite;
  }

  @keyframes vcPulse {
    0%,100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .vc-timer {
    font-family: 'DM Mono', monospace;
    font-size: 14px; color: #aaa;
    background: rgba(255,255,255,0.06);
    padding: 6px 14px; border-radius: 8px;
  }

  .vc-video-area {
    flex: 1; display: flex;
    align-items: center; justify-content: center;
    padding: 20px;
    position: relative;
  }

  .vc-main-video {
    width: 100%; max-width: 720px; height: 440px;
    background: #111820; border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }

  .vc-pip {
    position: absolute; bottom: 36px; right: 36px;
    width: 180px; height: 120px;
    background: #1a2332; border-radius: 12px;
    border: 2px solid rgba(255,255,255,0.15);
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px;
  }

  .vc-controls {
    padding: 20px 24px;
    background: rgba(255,255,255,0.03);
    border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: center;
    gap: 14px;
  }

  .vc-ctrl-btn {
    width: 52px; height: 52px; border-radius: 16px;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; transition: all 0.2s;
  }

  .vc-ctrl-btn.normal { background: rgba(255,255,255,0.1); color: white; }
  .vc-ctrl-btn.normal:hover { background: rgba(255,255,255,0.18); transform: scale(1.05); }
  .vc-ctrl-btn.off { background: rgba(229,57,53,0.2); color: #ef5350; }
  .vc-ctrl-btn.end {
    width: 64px; height: 52px; border-radius: 16px;
    background: #e53935; color: white;
    box-shadow: 0 4px 16px rgba(229,57,53,0.4);
  }
  .vc-ctrl-btn.end:hover { background: #c62828; transform: scale(1.05); }

  .vc-connecting {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 100%; gap: 16px; color: white;
  }

  .vc-connect-spinner {
    width: 48px; height: 48px;
    border: 3px solid rgba(255,255,255,0.1);
    border-top-color: #42a5f5;
    border-radius: 50%;
    animation: rxSpin 0.8s linear infinite;
  }

  @keyframes rxSpin { to { transform: rotate(360deg); } }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .con-doc-card:nth-child(1) { animation-delay: 0.1s; }
  .con-doc-card:nth-child(2) { animation-delay: 0.15s; }
  .con-doc-card:nth-child(3) { animation-delay: 0.2s; }
  .con-doc-card:nth-child(4) { animation-delay: 0.25s; }

  @media (max-width: 600px) {
    .con-doc-card-inner { flex-direction: column; }
    .con-hero { flex-direction: column; gap: 16px; }
  }
`;
document.head.appendChild(style);

const doctors = [
  { id: 1, name: 'Dr. Sneha Reddy', spec: 'Cardiologist', fee: 500, exp: '12 yrs', lang: 'Telugu, English', available: true,
    photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 2, name: 'Dr. Arjun Mehta', spec: 'General Physician', fee: 300, exp: '8 yrs', lang: 'Hindi, English', available: true,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Dr. Priya Krishnan', spec: 'Dermatologist', fee: 400, exp: '10 yrs', lang: 'Tamil, English', available: false,
    photo: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 4, name: 'Dr. Rahul Sharma', spec: 'Neurologist', fee: 600, exp: '15 yrs', lang: 'Hindi, English', available: true,
    photo: 'https://randomuser.me/api/portraits/men/75.jpg' },
];

function VideoCall({ doctor, onEnd }) {
  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [localTrack, setLocalTrack] = useState(null);
  const clientRef = useRef(null);
  const localVideoRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    const join = async () => {
      try {
        await client.join(APP_ID, 'doctor-1', TOKEN, null);
        if (cancelled) return;
        const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        if (cancelled) { micTrack.close(); camTrack.close(); return; }
        setLocalTrack({ mic: micTrack, cam: camTrack });
        camTrack.play(localVideoRef.current);
        await client.publish([micTrack, camTrack]);
        setJoined(true);
      } catch (err) {
        if (!cancelled) alert('Error: ' + err.message);
      }
    };

    join();
    return () => {
      cancelled = true;
      if (clientRef.current) { clientRef.current.leave(); clientRef.current = null; }
    };
  }, []);

  // Timer
  useEffect(() => {
    if (!joined) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [joined]);

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const leaveCall = async () => {
    localTrack?.mic?.close();
    localTrack?.cam?.close();
    if (clientRef.current) { await clientRef.current.leave(); }
    onEnd();
  };

  const toggleMic = async () => {
    if (localTrack?.mic) { await localTrack.mic.setEnabled(!micOn); setMicOn(!micOn); }
  };

  const toggleCam = async () => {
    if (localTrack?.cam) { await localTrack.cam.setEnabled(!camOn); setCamOn(!camOn); }
  };

  return (
    <div className="vc-root">
      {/* Video Topbar */}
      <div className="vc-topbar">
        <div className="vc-doctor-info">
          <img src={doctor.photo} alt={doctor.name}
            style={{width:38, height:38, borderRadius:10, objectFit:'cover',
            boxShadow:'0 2px 8px rgba(0,0,0,0.3)'}} />
          <div>
            <div className="vc-doc-name">{doctor.name}</div>
            <div className="vc-status-dot">
              <div className="vc-dot" />
              {joined ? 'Connected' : 'Connecting...'}
            </div>
          </div>
        </div>
        {joined && <div className="vc-timer">⏱ {formatTime(seconds)}</div>}
      </div>

      {/* Video Area */}
      <div className="vc-video-area">
        <div className="vc-main-video" ref={localVideoRef}>
          {!joined && (
            <div className="vc-connecting">
              <div className="vc-connect-spinner" />
              <p style={{fontFamily:'Outfit,sans-serif', fontSize:15}}>Connecting to {doctor.name}...</p>
              <p style={{fontSize:12, color:'#666'}}>Please allow camera & microphone access</p>
            </div>
          )}
        </div>

        {/* PiP */}
        <div className="vc-pip">
          <img src={doctor.photo} alt={doctor.name}
            style={{width:'100%', height:'100%', objectFit:'cover', opacity:0.9}} />
        </div>
      </div>

      {/* Controls */}
      <div className="vc-controls">
        <button className={`vc-ctrl-btn ${micOn ? 'normal' : 'off'}`} onClick={toggleMic}>
          {micOn ? '🎙️' : '🔇'}
        </button>
        <button className={`vc-ctrl-btn ${camOn ? 'normal' : 'off'}`} onClick={toggleCam}>
          {camOn ? '📷' : '🚫'}
        </button>
        <button className="vc-ctrl-btn normal">💬</button>
        <button className="vc-ctrl-btn normal">🔊</button>
        <button className="vc-ctrl-btn end" onClick={leaveCall}>📵</button>
      </div>
    </div>
  );
}

function Consultation() {
  const [activeCall, setActiveCall] = useState(null);
  const navigate = useNavigate();

  if (activeCall) {
    return <VideoCall doctor={activeCall} onEnd={() => setActiveCall(null)} />;
  }

  const availableCount = doctors.filter(d => d.available).length;

  return (
    <div className="con-root">

      {/* TOPBAR */}
      <div className="con-topbar">
        <div className="con-topbar-left">
          <button className="con-back" onClick={() => navigate('/dashboard')}>←</button>
          <span className="con-title">🎥 Online Consultation</span>
        </div>
        <span className="con-badge">{availableCount} Available</span>
      </div>

      <div className="con-body">

        {/* HERO */}
        <div className="con-hero">
          <div className="con-hero-text">
            <h2>Video Consultation</h2>
            <p>Connect with specialist doctors instantly from home</p>
          </div>
          <div className="con-hero-stats">
            <div className="con-hero-stat">
              <div className="con-hero-stat-val">{availableCount}</div>
              <div className="con-hero-stat-label">Available</div>
            </div>
            <div className="con-hero-stat">
              <div className="con-hero-stat-val">4</div>
              <div className="con-hero-stat-label">Doctors</div>
            </div>
            <div className="con-hero-stat">
              <div className="con-hero-stat-val">HD</div>
              <div className="con-hero-stat-label">Video</div>
            </div>
          </div>
        </div>

        {/* DOCTOR LIST */}
        <div className="con-doctors">
          {doctors.map(doc => (
            <div key={doc.id} className="con-doc-card">
              <div className="con-doc-card-inner">
                <img src={doc.photo} alt={doc.name}
                  style={{width:60, height:60, borderRadius:18, objectFit:'cover',
                  flexShrink:0, boxShadow:'0 4px 14px rgba(25,118,210,0.3)'}} />
                <div className="con-doc-info">
                  <div className="con-doc-name">{doc.name}</div>
                  <div className="con-doc-spec">{doc.spec}</div>
                  <div className="con-doc-chips">
                    <span className="con-chip con-chip-fee">₹{doc.fee}/session</span>
                    <span className="con-chip con-chip-exp">🏅 {doc.exp}</span>
                    <span className="con-chip con-chip-lang">🗣 {doc.lang}</span>
                  </div>
                </div>
                <div className="con-doc-right">
                  <div className={`con-status ${doc.available ? 'available' : 'busy'}`}>
                    {doc.available ? '🟢 Available' : '🔴 Busy'}
                  </div>
                  <button
                    className={`con-join-btn ${doc.available ? 'active' : 'disabled'}`}
                    onClick={() => doc.available && setActiveCall(doc)}
                    disabled={!doc.available}
                  >
                    {doc.available ? '🎥 Join Call' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Consultation;