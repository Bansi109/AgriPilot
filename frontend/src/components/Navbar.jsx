import React from 'react';
import { 
  Sprout, 
  Activity, 
  Play, 
  AlertTriangle, 
  Languages, 
  Radio, 
  RefreshCw,
  Layers
} from 'lucide-react';

export default function Navbar({ 
  selectedField, 
  setSelectedField, 
  fields, 
  language, 
  setLanguage, 
  onRunCycle, 
  cycleLoading, 
  activeIncidentsCount, 
  isWsConnected 
}) {
  return (
    <header className="glass-panel" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '42px', 
          height: '42px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, #10b981, #059669)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
        }}>
          <Sprout size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Agri<span style={{ color: 'var(--emerald-400)' }}>Pilot</span>
            </h1>
            <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              PS-6 Autonomous AI
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Farm-to-Field Advisory & Action Orchestration Agents
          </p>
        </div>
      </div>

      {/* Center Controls: Field Selector & Language */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Field Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={16} color="var(--text-muted)" />
          <select 
            value={selectedField} 
            onChange={(e) => setSelectedField(e.target.value)}
            className="select-control"
            style={{ minWidth: '220px', padding: '7px 12px', fontSize: '0.84rem' }}
          >
            {fields.map(f => (
              <option key={f.field_id} value={f.field_id}>
                {f.name} ({f.crop})
              </option>
            ))}
          </select>
        </div>

        {/* Language Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Languages size={16} color="var(--text-muted)" />
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
            <button 
              onClick={() => setLanguage('English')} 
              style={{
                background: language === 'English' ? 'var(--emerald-500)' : 'transparent',
                color: language === 'English' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('Hindi')} 
              style={{
                background: language === 'Hindi' ? 'var(--emerald-500)' : 'transparent',
                color: language === 'Hindi' ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Live Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 12px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-full)' }}>
          <span className="pulse-dot" style={{ background: isWsConnected ? 'var(--emerald-400)' : 'var(--amber-400)' }}></span>
          <span style={{ fontSize: '0.76rem', color: isWsConnected ? 'var(--emerald-400)' : 'var(--amber-400)', fontWeight: 600 }}>
            {isWsConnected ? 'Telemetry Live' : 'Polling Sync'}
          </span>
        </div>
      </div>

      {/* Right Action: Run Closed-Loop Cycle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={onRunCycle} 
          disabled={cycleLoading}
          className="btn btn-primary"
          style={{ minWidth: '190px' }}
        >
          {cycleLoading ? (
            <>
              <RefreshCw size={16} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Orchestrating...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span>Run Decision Cycle</span>
            </>
          )}
        </button>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
