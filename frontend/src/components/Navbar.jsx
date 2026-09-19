import React from 'react';
import { 
  Sprout, 
  Play, 
  Languages, 
  Radio, 
  RefreshCw,
  Layers,
  Sun,
  Moon,
  Home,
  LogOut,
  LogIn,
  User,
  ClipboardList
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
  isWsConnected,
  currentUser,
  onNavigate,
  onLogout,
  onOpenFarmerProfile
}) {
  const t = translations[language] || translations.English;

  return (
    <header className="glass-panel" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
      {/* Brand & Home Shortcut */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div 
          onClick={() => onNavigate && onNavigate('home')}
          style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
            cursor: 'pointer',
            border: '2px solid var(--emerald-400)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--card-bg)'
          }}
          title={t.home_nav}
        >
          <img src="/logo.png" alt="AgriPilot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 
              onClick={() => onNavigate && onNavigate('home')}
              style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', cursor: 'pointer', margin: 0 }}
            >
              Agri<span style={{ color: 'var(--emerald-500)' }}>Pilot</span>
            </h1>
            <span className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              {t.india_hub}
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            {t.brand_sub}
          </p>
        </div>
      </div>

      {/* Center Controls: Field Selector, Home Link, Theme & Language */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        
        {/* Home Button */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('home')}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            title={t.home_nav}
          >
            <Home size={15} color="var(--emerald-400)" />
            <span>{t.home_nav}</span>
          </button>
        )}

        {/* Farmer Profile & Input Calibration Modal Button */}
        {onOpenFarmerProfile && (
          <button
            onClick={onOpenFarmerProfile}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', border: '1px solid var(--emerald-400)' }}
            title="Farmer Farm Profile & Land/Fertilizer Calibration"
          >
            <ClipboardList size={15} color="var(--emerald-400)" />
            <span>{language === 'Hindi' ? 'खेत व खाद विवरण' : 'Farm Profile'}</span>
          </button>
        )}

        {/* Field Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={16} color="var(--text-muted)" />
          <select 
            value={selectedField} 
            onChange={(e) => setSelectedField(e.target.value)}
            className="select-control"
            style={{ minWidth: '200px', padding: '7px 12px', fontSize: '0.84rem' }}
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

      {/* Right Action: User Profile & Run Decision Cycle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        
        {/* User Info / Logout Button */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: 'var(--bg-inner-box)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '1.15rem' }}>{currentUser.avatar || '👨‍🌾'}</span>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block' }}>
                {currentUser.name}
              </strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--emerald-400)' }}>
                {currentUser.role}
              </span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--rose-500)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={t.logout_btn}
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        ) : (
          onNavigate && (
            <button
              onClick={() => onNavigate('login')}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <LogIn size={15} />
              <span>{t.login_btn}</span>
            </button>
          )
        )}

        <button 
          onClick={onRunCycle} 
          disabled={cycleLoading}
          className="btn btn-primary"
          style={{ minWidth: '180px' }}
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
