import React from 'react';
import { 
  Cpu, 
  Globe, 
  Sprout, 
  Bot, 
  Bug, 
  GitFork, 
  TrendingUp, 
  Calendar, 
  ShieldAlert, 
  Truck, 
  Brain, 
  Radio,
  ArrowRight,
  CheckCircle2,
  Zap,
  Droplet,
  CloudRain,
  Award,
  ShieldCheck,
  LogIn,
  Sun,
  Moon,
  ChevronRight,
  Activity,
  Compass
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function HomePage({ 
  onNavigate, 
  language, 
  theme, 
  setTheme, 
  setLanguage, 
  currentUser, 
  onLogout 
}) {
  const t = translations[language] || translations.English;

  const features = [
    {
      id: 'overview',
      icon: <Cpu size={26} color="var(--emerald-400)" />,
      title: t.feature_1_title,
      desc: t.feature_1_desc,
      tag: "Module 6.8",
      accent: "var(--emerald-400)"
    },
    {
      id: 'map',
      icon: <Globe size={26} color="var(--cyan-400)" />,
      title: t.feature_2_title,
      desc: t.feature_2_desc,
      tag: "Module 6.4.7",
      accent: "var(--cyan-400)"
    },
    {
      id: 'pest-vision',
      icon: <Bug size={26} color="var(--rose-500)" />,
      title: t.feature_3_title,
      desc: t.feature_3_desc,
      tag: "Module 6.4.4",
      accent: "var(--rose-500)"
    },
    {
      id: 'profit',
      icon: <TrendingUp size={26} color="var(--amber-400)" />,
      title: t.feature_4_title,
      desc: t.feature_4_desc,
      tag: "Module 6.4.11",
      accent: "var(--amber-400)"
    },
    {
      id: 'crop-rotation',
      icon: <GitFork size={26} color="var(--purple-400)" />,
      title: t.feature_5_title,
      desc: t.feature_5_desc,
      tag: "Module 6.4.3",
      accent: "var(--purple-400)"
    },
    {
      id: 'omnichannel',
      icon: <Radio size={26} color="var(--lime-400)" />,
      title: t.feature_6_title,
      desc: t.feature_6_desc,
      tag: "Sections 6.5 & 6.6",
      accent: "var(--lime-400)"
    }
  ];

  const regions = [
    { name: "Indore (MP)", spec: "Soybean, Wheat & Gram Cluster", code: "CENTRAL" },
    { name: "Khanna (Punjab)", spec: "Asia's Largest Grain APMC", code: "NORTH" },
    { name: "Nashik (Maharashtra)", spec: "Horticulture, Onion & Cotton", code: "WEST" },
    { name: "Rajkot (Gujarat)", spec: "Groundnut & Oilseeds Terminal", code: "COASTAL" },
    { name: "Guntur (AP)", spec: "Chilli & Commercial Cash Crops", code: "SOUTH" }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Floating Navigation Header */}
      <header className="glass-panel" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        margin: '0 0 24px 0',
        padding: '14px 28px',
        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        borderTop: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--emerald-500), var(--cyan-500))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
          }}>
            <Sprout size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                Agri<span style={{ color: 'var(--emerald-400)' }}>Pilot</span>
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                PS-6 AI
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
              {t.brand_sub}
            </span>
          </div>
        </div>

        {/* Right Controls: Language, Theme & Auth CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Language Switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px'
          }}>
            <button
              onClick={() => setLanguage('English')}
              style={{
                background: language === 'English' ? 'var(--emerald-500)' : 'transparent',
                color: language === 'English' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
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
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              हिन्दी
            </button>
          </div>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.76rem' }}
            title={theme === 'dark' ? t.light_mode : t.dark_mode}
          >
            {theme === 'dark' ? <Sun size={15} color="var(--amber-400)" /> : <Moon size={15} color="var(--cyan-400)" />}
            <span>{theme === 'dark' ? t.light_mode : t.dark_mode}</span>
          </button>

          {/* User Status / Login Action */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{currentUser.avatar || '👨‍🌾'}</span>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)', display: 'block' }}>
                    {currentUser.name}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--emerald-400)' }}>
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="btn btn-primary"
                style={{ fontSize: '0.82rem', padding: '7px 14px' }}
              >
                <span>{t.dashboard_nav}</span>
                <ChevronRight size={15} />
              </button>

              <button
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ fontSize: '0.76rem', padding: '6px 10px' }}
              >
                <span>{t.logout_btn}</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => onNavigate('login')}
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', padding: '7px 14px' }}
              >
                <LogIn size={15} />
                <span>{t.login_btn}</span>
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="btn btn-primary"
                style={{ fontSize: '0.82rem', padding: '7px 16px' }}
              >
                <span>{t.launch_dashboard}</span>
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '36px 0 48px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Glow pill badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid var(--emerald-400)',
          borderRadius: '999px',
          padding: '6px 18px',
          marginBottom: '20px',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-400)', boxShadow: '0 0 8px var(--emerald-400)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-400)', letterSpacing: '0.02em' }}>
            {t.hero_badge}
          </span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          maxWidth: '960px',
          margin: '0 auto 20px auto',
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em'
        }}>
          {t.hero_title}
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
          color: 'var(--text-secondary)',
          maxWidth: '820px',
          lineHeight: 1.6,
          margin: '0 auto 32px auto'
        }}>
          {t.hero_sub}
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '36px' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn btn-primary"
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              padding: '12px 28px',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 6px 24px rgba(16, 185, 129, 0.35)'
            }}
          >
            <span>{t.launch_dashboard}</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => onNavigate('login')}
            className="btn btn-secondary"
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <LogIn size={18} />
            <span>{t.farmer_login_cta}</span>
          </button>
        </div>

        {/* Live Farm Telemetry Ticker */}
        <div className="glass-panel" style={{
          maxWidth: '1020px',
          width: '100%',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          background: 'var(--card-bg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Droplet size={18} color="var(--cyan-400)" />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Soil Moisture</span>
              <strong style={{ display: 'block', fontSize: '0.86rem', color: 'var(--text-primary)' }}>52.4% (Optimal)</strong>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={18} color="var(--amber-400)" />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Penman-Monteith ET₀</span>
              <strong style={{ display: 'block', fontSize: '0.86rem', color: 'var(--text-primary)' }}>4.8 mm/day</strong>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CloudRain size={18} color="var(--rose-500)" />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>72h Rain Alert</span>
              <strong style={{ display: 'block', fontSize: '0.86rem', color: 'var(--text-primary)' }}>22.0 mm (Delay Valves)</strong>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'var(--border-glass)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingUp size={18} color="var(--emerald-400)" />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mandi Net Gain</span>
              <strong style={{ display: 'block', fontSize: '0.86rem', color: 'var(--emerald-400)' }}>+₹380/Qtl via PuLP</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Bar */}
      <section style={{ margin: '20px 0 40px 0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--emerald-400)', margin: 0 }}>4,500+</p>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              {t.stat_hectares}
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--cyan-400)', margin: 0 }}>1.2M+</p>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              {t.stat_water}
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--amber-400)', margin: 0 }}>+65.8%</p>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              {t.stat_profit}
            </span>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--purple-400)', margin: 0 }}>94.2%</p>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              {t.stat_accuracy}
            </span>
          </div>
        </div>
      </section>

      {/* 6-Feature Architectural Solutions Grid */}
      <section style={{ margin: '20px 0 48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {t.explore_features}
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            Engineered to solve smallholder fragmentation through continuous closed-loop sensing, constrained linear programming, and multi-agent coordination.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {features.map(f => (
            <div
              key={f.id}
              className="glass-panel"
              style={{
                padding: '26px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onClick={() => onNavigate('dashboard')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 16px rgba(0, 0, 0, 0.1)`
                  }}>
                    {f.icon}
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                    {f.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {f.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: f.accent }}>
                <span>Launch Interactive Module</span>
                <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Indian Agro-Climatic Zones & Regional Presence */}
      <section className="glass-panel" style={{ padding: '32px', margin: '20px 0 48px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Compass size={24} color="var(--emerald-400)" />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {t.trusted_by}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Micro-climate parameters, crop models, and regional APMC mandi intelligence are pre-calibrated for key Indian agrarian regions.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginTop: '20px'
        }}>
          {regions.map((reg, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  {reg.name}
                </strong>
                <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>
                  {reg.code}
                </span>
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                {reg.spec}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="glass-panel" style={{
        padding: '40px 24px',
        textAlign: 'center',
        margin: '0 0 32px 0',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.12))',
        border: '1px solid var(--emerald-400)'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '10px' }}>
          Ready to Experience Autonomous Farm Intelligence?
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 24px auto' }}>
          Explore the real-time closed-loop decision cycle, simulate 72-hour rain disruptions, or review expert agronomist recommendations.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn btn-primary"
            style={{ fontSize: '0.95rem', fontWeight: 800, padding: '12px 28px' }}
          >
            <span>{t.launch_dashboard}</span>
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => onNavigate('login')}
            className="btn btn-secondary"
            style={{ fontSize: '0.95rem', fontWeight: 700, padding: '12px 24px' }}
          >
            <LogIn size={16} />
            <span>{t.farmer_login_cta}</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '24px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span>AgriPilot — PS-6: Autonomous Farm-to-Field Advisory & Action Orchestration Agents</span>
        <span>🇮🇳 Built for Indian Agriculture • Open-Meteo & PuLP Optimized</span>
      </footer>

    </div>
  );
}
