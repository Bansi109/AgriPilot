import React from 'react';
import { 
  Sprout, 
  Play, 
  Languages, 
  Radio, 
  RefreshCw,
  Layers,
  Sun,
  Moon
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function Navbar({ 
  selectedField, 
  setSelectedField, 
  fields, 
  language, 
  setLanguage, 
  theme,
  setTheme,
  onRunCycle, 
  cycleLoading, 
  activeIncidentsCount, 
  isWsConnected 
}) {
  const t = translations[language] || translations.English;

  return (
    <header className="glass-panel" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, #10b981, #059669)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
        }}>
          <Sprout size={26} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Agri<span style={{ color: 'var(--emerald-500)' }}>Pilot</span>
            </h1>
            <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              {t.ps6_badge}
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              {t.india_hub}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {t.brand_sub}
          </p>
        </div>
      </div>

      {/* Center Controls: Field Selector, Theme & Language */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
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
          <div style={{ display: 'flex', background: 'var(--bg-inner-box)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
            <button 
              onClick={() => setLanguage('English')} 
              style={{
                background: language === 'English' ? 'var(--emerald-500)' : 'transparent',
                color: language === 'English' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '5px 11px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('Hindi')} 
              style={{
                background: language === 'Hindi' ? 'var(--emerald-500)' : 'transparent',
                color: language === 'Hindi' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '5px 11px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn btn-secondary"
          style={{ padding: '7px 12px', fontSize: '0.82rem' }}
          title={theme === 'dark' ? t.light_mode : t.dark_mode}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} color="var(--amber-400)" />
              <span>{t.light_mode}</span>
            </>
          ) : (
            <>
              <Moon size={16} color="var(--blue-500)" />
              <span>{t.dark_mode}</span>
            </>
          )}
        </button>

        {/* Live Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 12px', background: 'var(--bg-inner-box)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-full)' }}>
          <span className="pulse-dot" style={{ background: isWsConnected ? '#10b981' : '#f59e0b' }}></span>
          <span style={{ fontSize: '0.76rem', color: isWsConnected ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
            {isWsConnected ? t.telemetry_live : t.polling_sync}
          </span>
        </div>
      </div>

      {/* Right Action: Run Decision Cycle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={onRunCycle} 
          disabled={cycleLoading}
          className="btn btn-primary"
          style={{ minWidth: '200px' }}
        >
          {cycleLoading ? (
            <>
              <RefreshCw size={16} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
              <span>{t.orchestrating}</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span>{t.run_cycle}</span>
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
