import React, { useState, useEffect } from 'react'

const ACCENT = '#F5A623', GREEN = '#4ADE80', RED = '#F87171', BLUE = '#60A5FA', PURPLE = '#A78BFA'

const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch(e) { return d } }
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))
const todayKey = () => new Date().toISOString().slice(0,10)

const playSound = (t) => {
  const audio = new Audio(`/sounds/${t}.mp3`);
  audio.volume = 0.3;
  audio.play().catch(() => {}); 
}

function launchConfetti() {
  const colors = [ACCENT, GREEN, BLUE, PURPLE, RED];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.left = Math.random() * 100 + 'vw';
    c.style.animationDuration = (Math.random() * 2 + 2) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

function CircleProgress({ pct, size = 80, stroke = 6, color = ACCENT, label }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, dash = (pct / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} 
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: '0.6s' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold' }}>
          {pct}%
        </div>
      </div>
      {label && <span style={{ fontSize: 10, marginTop: 5, color: '#94a3b8' }}>{label}</span>}
    </div>
  )
}

export default function App() {
  const [tasks, setTasks] = useState(() => load('tasks', []))
  const [xp, setXp] = useState(() => load('app_xp', 0))
  const [level, setLevel] = useState(() => load('app_level', 1))

  useEffect(() => {
    save('app_xp', xp)
    const nextLevelXp = level * 500
    if (xp >= nextLevelXp) {
      setLevel(l => l + 1); playSound('levelup'); launchConfetti()
    }
  }, [xp, level])

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id && !t.done) { setXp(x => x + 50); playSound('success') }
      return t.id === id ? { ...t, done: !t.done } : t
    }))
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
          <b style={{ color: ACCENT }}>NÍVEL {level}</b>
          <span style={{ color: '#64748b' }}>{xp} / {level * 500} XP</span>
        </div>
        <div style={{ height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${(xp / (level * 500)) * 100}%`, height: '100%', background: ACCENT, transition: '0.5s' }} />
        </div>
      </header>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 40 }}>
        <CircleProgress pct={75} label="HOJE" />
        <CircleProgress pct={60} color={PURPLE} label="SEMANA" />
      </div>

      <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 24, marginBottom: 15 }}>Tarefas</h2>
      {tasks.length === 0 && <p style={{ color: '#475569' }}>Nenhuma tarefa para hoje.</p>}
      {tasks.map(t => (
        <div key={t.id} onClick={() => toggleTask(t.id)} style={{ 
          background: '#0f172a', padding: '16px', borderRadius: '12px', marginBottom: '10px',
          border: `1px solid ${t.done ? GREEN : '#1e293b'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10
        }}>
          <span style={{ fontSize: 20 }}>{t.done ? '✅' : '⭕'}</span>
          <span style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#475569' : '#f1f5f9' }}>{t.name}</span>
        </div>
      ))}
    </div>
  )
}