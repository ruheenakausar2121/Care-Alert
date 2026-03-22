import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

  .fa-root {
    min-height: 100vh;
    background: #f0f4f8;
    font-family: 'DM Sans', sans-serif;
  }

  .fa-topbar {
    background: white;
    padding: 0 28px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    position: sticky; top: 0; z-index: 100;
  }

  .fa-topbar-left { display: flex; align-items: center; gap: 12px; }

  .fa-back {
    width: 38px; height: 38px;
    border-radius: 10px; border: 1px solid #eee;
    background: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.2s;
  }
  .fa-back:hover { background: #fff5f5; border-color: #ffcdd2; }

  .fa-title {
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 700; color: #1a1a2e;
  }

  .fa-badge {
    background: #fff5f5; color: #e53935;
    font-size: 12px; font-weight: 700;
    padding: 4px 12px; border-radius: 20px;
    border: 1px solid #ffcdd2;
  }

  .fa-body {
    max-width: 960px;
    margin: 0 auto;
    padding: 28px 24px;
  }

  /* HERO BANNER */
  .fa-hero {
    background: linear-gradient(135deg, #b71c1c, #e53935, #ef5350);
    border-radius: 20px;
    padding: 28px 32px;
    margin-bottom: 28px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
    box-shadow: 0 12px 40px rgba(229,57,53,0.25);
    animation: fadeUp 0.6s both;
  }

  .fa-hero::before {
    content: '🩹';
    position: absolute;
    right: 30px; top: 50%;
    transform: translateY(-50%);
    font-size: 80px; opacity: 0.15;
  }

  .fa-hero-text h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 22px; font-weight: 800; color: white;
    margin-bottom: 6px;
  }

  .fa-hero-text p { font-size: 13px; color: rgba(255,255,255,0.8); }

  .fa-emergency-numbers {
    display: flex; gap: 10px; flex-wrap: wrap;
  }

  .fa-num-chip {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 10px;
    padding: 8px 14px;
    text-align: center;
  }

  .fa-num-val {
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 800; color: white;
  }

  .fa-num-label { font-size: 10px; color: rgba(255,255,255,0.75); }

  /* LAYOUT */
  .fa-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 20px;
  }

  /* CATEGORY LIST */
  .fa-categories {
    display: flex; flex-direction: column; gap: 8px;
  }

  .fa-cat-btn {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
    background: white; border-radius: 14px;
    border: 1.5px solid #eee;
    cursor: pointer; transition: all 0.2s;
    text-align: left;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    animation: fadeUp 0.5s both;
  }

  .fa-cat-btn:hover {
    border-color: #ffcdd2;
    box-shadow: 0 4px 16px rgba(229,57,53,0.1);
    transform: translateX(3px);
  }

  .fa-cat-btn.active {
    border-color: #e53935;
    background: #fff5f5;
    box-shadow: 0 4px 16px rgba(229,57,53,0.15);
  }

  .fa-cat-icon {
    width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
    transition: transform 0.2s;
  }

  .fa-cat-btn:hover .fa-cat-icon,
  .fa-cat-btn.active .fa-cat-icon { transform: scale(1.1); }

  .fa-cat-name {
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 700; color: #1a1a2e;
  }

  .fa-cat-count {
    font-size: 11px; color: #888; margin-top: 2px;
  }

  .fa-cat-arrow {
    margin-left: auto; font-size: 14px; color: #ccc;
    transition: color 0.2s;
  }

  .fa-cat-btn.active .fa-cat-arrow { color: #e53935; }

  /* STEPS PANEL */
  .fa-steps-panel {
    background: white; border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    border: 1px solid rgba(0,0,0,0.04);
    overflow: hidden;
    animation: fadeUp 0.5s both;
  }

  .fa-steps-header {
    background: linear-gradient(135deg, #c62828, #e53935);
    padding: 24px 28px;
    position: relative; overflow: hidden;
  }

  .fa-steps-header::after {
    content: '';
    position: absolute;
    width: 150px; height: 150px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    top: -50px; right: -30px;
  }

  .fa-steps-title {
    font-family: 'Outfit', sans-serif;
    font-size: 20px; font-weight: 800; color: white;
    margin-bottom: 4px;
    position: relative; z-index: 1;
  }

  .fa-steps-sub {
    font-size: 13px; color: rgba(255,255,255,0.8);
    position: relative; z-index: 1;
  }

  .fa-steps-body { padding: 24px 28px; }

  .fa-step-item {
    display: flex; gap: 16px; align-items: flex-start;
    padding: 14px 0;
    border-bottom: 1px solid #f5f5f5;
    animation: fadeUp 0.4s both;
  }

  .fa-step-item:last-child { border-bottom: none; }

  .fa-step-num {
    width: 32px; height: 32px; border-radius: 10px;
    background: linear-gradient(135deg, #e53935, #c62828);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 800; color: white;
    flex-shrink: 0;
    box-shadow: 0 3px 10px rgba(229,57,53,0.3);
  }

  .fa-step-text {
    font-size: 14px; color: #333; line-height: 1.6;
    padding-top: 5px;
  }

  /* EMPTY STATE */
  .fa-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 300px; text-align: center;
  }

  .fa-empty-icon { font-size: 52px; margin-bottom: 14px; opacity: 0.5; }
  .fa-empty-text {
    font-family: 'Outfit', sans-serif;
    font-size: 16px; font-weight: 600; color: #888;
  }
  .fa-empty-sub { font-size: 13px; color: #bbb; margin-top: 6px; }

  /* WARNING BOX */
  .fa-warning {
    background: #fff8e1; border: 1px solid #ffe082;
    border-radius: 12px; padding: 14px 16px;
    display: flex; gap: 10px; align-items: flex-start;
    margin-top: 20px;
  }

  .fa-warning-text { font-size: 13px; color: #5d4037; line-height: 1.6; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fa-cat-btn:nth-child(1) { animation-delay: 0.05s; }
  .fa-cat-btn:nth-child(2) { animation-delay: 0.1s; }
  .fa-cat-btn:nth-child(3) { animation-delay: 0.15s; }
  .fa-cat-btn:nth-child(4) { animation-delay: 0.2s; }
  .fa-cat-btn:nth-child(5) { animation-delay: 0.25s; }
  .fa-cat-btn:nth-child(6) { animation-delay: 0.3s; }

  .fa-step-item:nth-child(1) { animation-delay: 0.05s; }
  .fa-step-item:nth-child(2) { animation-delay: 0.1s; }
  .fa-step-item:nth-child(3) { animation-delay: 0.15s; }
  .fa-step-item:nth-child(4) { animation-delay: 0.2s; }

  @media (max-width: 700px) {
    .fa-layout { grid-template-columns: 1fr; }
    .fa-hero { flex-direction: column; gap: 16px; }
  }
`;
document.head.appendChild(style);

const firstAidData = [
  {
    id: 1, title: '🩸 Bleeding', icon: '🩸', bg: '#fff5f5',
    severity: 'High', steps: [
      'Apply firm pressure with a clean cloth',
      'Keep pressure for 10-15 minutes continuously',
      'Do not remove cloth if soaked — add more on top',
      'Elevate the injured area above heart level if possible',
      'Call 108 if bleeding does not stop within 15 minutes',
    ]
  },
  {
    id: 2, title: '🔥 Burns', icon: '🔥', bg: '#fff8e1',
    severity: 'High', steps: [
      'Cool the burn under cold running water for 10 minutes',
      'Do NOT use ice, butter, or toothpaste',
      'Cover loosely with a clean non-fluffy bandage',
      'Do NOT pop blisters — risk of infection',
      'Seek medical help for burns larger than palm size',
    ]
  },
  {
    id: 3, title: '🫀 Heart Attack', icon: '🫀', bg: '#fce4ec',
    severity: 'Critical', steps: [
      'Call 108 immediately — every second counts',
      'Make person sit or lie down comfortably',
      'Loosen tight clothing around neck and chest',
      'Give aspirin (325mg) if available and not allergic',
      'Start CPR if person becomes unconscious',
    ]
  },
  {
    id: 4, title: '🤕 Head Injury', icon: '🤕', bg: '#e8eaf6',
    severity: 'High', steps: [
      'Keep the person still — do not move unnecessarily',
      'Apply ice pack wrapped in cloth to reduce swelling',
      'Do NOT give food or water',
      'Watch for signs: vomiting, confusion, unequal pupils',
      'Call 108 immediately if unconscious or seizures occur',
    ]
  },
  {
    id: 5, title: '🐍 Snake Bite', icon: '🐍', bg: '#e8f5e9',
    severity: 'Critical', steps: [
      'Keep person calm and completely still',
      'Remove tight items — rings, watches near the bite',
      'Do NOT suck out venom or cut the wound',
      'Keep bitten limb below heart level',
      'Rush to hospital immediately — time is critical',
    ]
  },
  {
    id: 6, title: '⚡ Electric Shock', icon: '⚡', bg: '#fffde7',
    severity: 'Critical', steps: [
      'Do NOT touch the person directly',
      'Switch off power source or use dry wood to separate',
      'Call 108 immediately',
      'Check breathing — start CPR if unconscious',
      'Treat any burns after ensuring safety',
    ]
  },
];

function FirstAid() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="fa-root">

      {/* TOPBAR */}
      <div className="fa-topbar">
        <div className="fa-topbar-left">
          <button className="fa-back" onClick={() => navigate('/dashboard')}>←</button>
          <span className="fa-title">🩹 First Aid Guide</span>
        </div>
        <span className="fa-badge">6 Emergencies</span>
      </div>

      <div className="fa-body">

        {/* HERO */}
        <div className="fa-hero">
          <div className="fa-hero-text">
            <h2>Emergency First Aid Guide</h2>
            <p>Quick steps for common medical emergencies</p>
          </div>
          <div className="fa-emergency-numbers">
            {[
              { num: '108', label: 'Ambulance' },
              { num: '102', label: 'Blood Bank' },
              { num: '104', label: 'Health Line' },
            ].map((n, i) => (
              <div className="fa-num-chip" key={i}>
                <div className="fa-num-val">{n.num}</div>
                <div className="fa-num-label">{n.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LAYOUT */}
        <div className="fa-layout">

          {/* CATEGORIES */}
          <div className="fa-categories">
            {firstAidData.map(item => (
              <button
                key={item.id}
                className={`fa-cat-btn ${selected?.id === item.id ? 'active' : ''}`}
                onClick={() => setSelected(selected?.id === item.id ? null : item)}
              >
                <div className="fa-cat-icon" style={{background: item.bg}}>{item.icon}</div>
                <div>
                  <div className="fa-cat-name">{item.title}</div>
                  <div className="fa-cat-count">{item.steps.length} steps</div>
                </div>
                <span className="fa-cat-arrow">›</span>
              </button>
            ))}
          </div>

          {/* STEPS PANEL */}
          <div className="fa-steps-panel">
            {selected ? (
              <>
                <div className="fa-steps-header">
                  <div className="fa-steps-title">{selected.title}</div>
                  <div className="fa-steps-sub">{selected.steps.length} steps · {selected.severity} severity</div>
                </div>
                <div className="fa-steps-body">
                  {selected.steps.map((step, i) => (
                    <div className="fa-step-item" key={i} style={{animationDelay: `${i * 0.08}s`}}>
                      <div className="fa-step-num">{i + 1}</div>
                      <div className="fa-step-text">{step}</div>
                    </div>
                  ))}
                  <div className="fa-warning">
                    <span>⚠️</span>
                    <span className="fa-warning-text">
                      This is basic first aid guidance only. Always call 108 for serious emergencies and seek professional medical help immediately.
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="fa-empty">
                <div className="fa-empty-icon">👈</div>
                <div className="fa-empty-text">Select an emergency</div>
                <div className="fa-empty-sub">Click any category to see first aid steps</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default FirstAid;