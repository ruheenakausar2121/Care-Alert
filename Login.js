import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Inject global styles
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  .login-root {
    min-height: 100vh;
    background: #f0f4f8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    position: relative;
  }

  /* Animated background blobs */
  .blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    animation: blobFloat 8s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
  .blob-1 { width: 500px; height: 500px; background: #e53935; top: -100px; left: -100px; animation-delay: 0s; }
  .blob-2 { width: 400px; height: 400px; background: #ff8a80; bottom: -100px; right: -100px; animation-delay: 3s; }
  .blob-3 { width: 300px; height: 300px; background: #ffcdd2; top: 40%; left: 40%; animation-delay: 1.5s; }

  @keyframes blobFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30px) scale(1.05); }
  }

  /* Main card */
  .login-wrapper {
    display: flex;
    width: 900px;
    min-height: 560px;
    background: white;
    border-radius: 32px;
    box-shadow: 0 40px 120px rgba(229,57,53,0.15), 0 8px 32px rgba(0,0,0,0.08);
    overflow: hidden;
    position: relative;
    z-index: 1;
    animation: cardIn 0.8s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(40px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Left panel — 3D illustration side */
  .login-left {
    width: 45%;
    background: linear-gradient(145deg, #c62828 0%, #e53935 40%, #ef5350 100%);
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }

  .login-left::before {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    top: -80px; right: -80px;
  }

  .login-left::after {
    content: '';
    position: absolute;
    width: 200px; height: 200px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    bottom: -50px; left: -50px;
  }

  .left-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .left-logo-icon {
    width: 42px; height: 42px;
    background: white;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  .left-logo-text {
    font-family: 'Outfit', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: white;
    letter-spacing: -0.5px;
  }

  /* 3D Scene */
  .scene-3d {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  .floating-card {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 20px;
    padding: 24px;
    width: 200px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3);
    animation: float3d 4s ease-in-out infinite;
    transform-style: preserve-3d;
  }

  @keyframes float3d {
    0%, 100% { transform: translateY(0) rotateX(5deg) rotateY(-5deg); }
    50% { transform: translateY(-16px) rotateX(-5deg) rotateY(5deg); }
  }

  .card-pulse {
    width: 56px; height: 56px;
    background: white;
    border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    margin-bottom: 14px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    animation: heartbeat 1.5s ease-in-out infinite;
  }

  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    15% { transform: scale(1.15); }
    30% { transform: scale(1); }
    45% { transform: scale(1.08); }
  }

  .card-title {
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: white;
    margin-bottom: 6px;
  }

  .card-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.75);
    line-height: 1.5;
  }

  .vitals-row {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }

  .vital-chip {
    background: rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 11px;
    color: white;
    font-weight: 500;
    flex: 1;
    text-align: center;
  }

  /* Floating orbs */
  .orb {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    animation: orbFloat 6s ease-in-out infinite;
  }

  .orb-1 { width: 60px; height: 60px; top: 20%; right: 10%; animation-delay: 0s; }
  .orb-2 { width: 40px; height: 40px; bottom: 25%; left: 8%; animation-delay: 2s; }
  .orb-3 { width: 25px; height: 25px; top: 60%; right: 20%; animation-delay: 1s; }

  @keyframes orbFloat {
    0%, 100% { transform: translateY(0); opacity: 0.6; }
    50% { transform: translateY(-20px); opacity: 1; }
  }

  .left-tagline {
    position: relative;
    z-index: 1;
  }

  .left-tagline h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: white;
    line-height: 1.4;
    margin-bottom: 8px;
  }

  .left-tagline p {
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    line-height: 1.6;
  }

  /* Right panel — form */
  .login-right {
    flex: 1;
    padding: 52px 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .form-header {
    margin-bottom: 36px;
    animation: fadeUp 0.6s 0.2s both;
  }

  .form-header h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 30px;
    font-weight: 800;
    color: #1a1a2e;
    letter-spacing: -0.8px;
    margin-bottom: 8px;
  }

  .form-header p {
    font-size: 14px;
    color: #888;
  }

  .tab-switcher {
    display: flex;
    background: #f5f5f5;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 28px;
    animation: fadeUp 0.6s 0.3s both;
  }

  .tab-btn {
    flex: 1;
    padding: 10px;
    border: none;
    background: none;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s;
    color: #999;
  }

  .tab-btn.active {
    background: white;
    color: #e53935;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }

  .input-group {
    margin-bottom: 18px;
    animation: fadeUp 0.6s 0.4s both;
  }

  .input-label {
    font-size: 12.5px;
    font-weight: 600;
    color: #555;
    margin-bottom: 7px;
    display: block;
    letter-spacing: 0.3px;
  }

  .input-wrap {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    padding: 13px 14px 13px 42px;
    border: 2px solid #eee;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #1a1a2e;
    background: #fafafa;
    transition: all 0.2s;
    outline: none;
  }

  .form-input:focus {
    border-color: #e53935;
    background: white;
    box-shadow: 0 0 0 4px rgba(229,57,53,0.08);
  }

  .error-msg {
    background: #fff5f5;
    border: 1px solid #ffcdd2;
    color: #c62828;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 16px;
    animation: shake 0.4s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  .submit-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #e53935, #c62828);
    color: white;
    border: none;
    border-radius: 14px;
    font-family: 'Outfit', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: all 0.25s;
    box-shadow: 0 8px 24px rgba(229,57,53,0.35);
    margin-top: 6px;
    animation: fadeUp 0.6s 0.5s both;
    position: relative;
    overflow: hidden;
  }

  .submit-btn::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s, height 0.4s;
  }

  .submit-btn:hover::after { width: 300px; height: 300px; }
  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(229,57,53,0.45); }
  .submit-btn:active { transform: translateY(0); }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .switch-text {
    text-align: center;
    margin-top: 20px;
    font-size: 13.5px;
    color: #888;
    animation: fadeUp 0.6s 0.6s both;
  }

  .switch-link {
    color: #e53935;
    font-weight: 600;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
  }

  .switch-link:hover { text-decoration: underline; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive */
  @media (max-width: 700px) {
    .login-left { display: none; }
    .login-wrapper { width: 95vw; }
    .login-right { padding: 36px 28px; }
  }
`;
document.head.appendChild(style);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth.*\)/, ''));
    }
    setLoading(false);
  };

  return (
    <div className="login-root">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-wrapper">
        {/* Left Panel */}
        <div className="login-left">
          <div className="left-logo">
            <div className="left-logo-icon">🏥</div>
           <span className="left-logo-text">Care-Alert</span>
          </div>

          <div className="scene-3d">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="floating-card">
              <div className="card-pulse">❤️</div>
              <div className="card-title">Health Monitor</div>
              <div className="card-sub">Real-time vitals tracking & doctor consultations</div>
              <div className="vitals-row">
                <div className="vital-chip">💓 72 bpm</div>
                <div className="vital-chip">🩸 98%</div>
              </div>
            </div>
          </div>

          <div className="left-tagline">
            <h2>Your Health,<br />Our Priority 🩺</h2>
            <p>Book appointments, order medicines, and consult doctors — all in one place.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right">
          <div className="form-header">
            <h1>{isRegister ? 'Create Account' : 'Welcome Back!'}</h1>
            <p>{isRegister ? 'JoinCare-Alert  today — it\'s free!' : 'Sign in to yourCare-Alert  account'}</p>
          </div>

          {/* Tab Switcher */}
          <div className="tab-switcher">
            <button className={`tab-btn ${!isRegister ? 'active' : ''}`} onClick={() => { setIsRegister(false); setError(''); }}>
              Sign In
            </button>
            <button className={`tab-btn ${isRegister ? 'active' : ''}`} onClick={() => { setIsRegister(true); setError(''); }}>
              Register
            </button>
          </div>

          {error && <div className="error-msg">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">📧</span>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? '⏳ Please wait...' : isRegister ? '🚀 Create Account' : '👋 Sign In'}
            </button>
          </form>

          <p className="switch-text">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button className="switch-link" onClick={() => { setIsRegister(!isRegister); setError(''); }}>
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;