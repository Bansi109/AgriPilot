import React, { useState } from 'react';
import { 
  Sprout, 
  Smartphone, 
  KeyRound, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  Sun, 
  Moon,
  Sparkles,
  Lock,
  Phone
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function LoginPage({ 
  onLogin, 
  onNavigate, 
  language, 
  setLanguage, 
  theme, 
  setTheme 
}) {
  const t = translations[language] || translations.English;

  const [activeTab, setActiveTab] = useState('otp'); // 'otp' | 'id'
  const [mobile, setMobile] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [kisanId, setKisanId] = useState('KISAN-INDORE-2026');
  const [password, setPassword] = useState('agripilot123');
  const [selectedRole, setSelectedRole] = useState('Farmer'); // 'Farmer' | 'Extension' | 'Agronomist'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e) => {
    e?.preventDefault();
    if (!mobile || mobile.length < 10) {
      setErrorMsg(language === 'Hindi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setOtpCode('123456'); // Pre-fill simulated OTP for effortless testing
      setLoading(false);
    }, 450);
  };

  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg(language === 'Hindi' ? 'कृपया 6 अंकों का OTP दर्ज करें' : 'Please enter the 6-digit OTP');
      return;
    }

    const userData = {
      name: selectedRole === 'Agronomist' ? 'Dr. R. K. Verma' : 'Ramesh Patel',
      role: selectedRole === 'Agronomist' ? 'Senior Agronomist (ICAR)' : 'Progressive Farmer',
      phone: `+91 ${mobile}`,
      avatar: selectedRole === 'Agronomist' ? '🔬' : '👨‍🌾',
      field_id: 'FIELD-NORTH-01',
      region: 'Indore (MP)'
    };

    onLogin(userData);
  };

  const handleIdLogin = (e) => {
    e?.preventDefault();
    if (!kisanId) {
      setErrorMsg(language === 'Hindi' ? 'कृपया किसान ID या ईमेल दर्ज करें' : 'Please enter Kisan ID or email');
      return;
    }

    const isAgronomist = selectedRole === 'Agronomist' || kisanId.toLowerCase().includes('verma');
    const userData = {
      name: isAgronomist ? 'Dr. R. K. Verma' : 'Ramesh Patel',
      role: isAgronomist ? 'Senior Agronomist (ICAR)' : 'Progressive Farmer',
      phone: '+91 98765 43210',
      avatar: isAgronomist ? '🔬' : '👨‍🌾',
      field_id: 'FIELD-NORTH-01',
      region: 'Indore (MP)'
    };

    onLogin(userData);
  };

  const handleQuickDemo = (role) => {
    if (role === 'farmer') {
      onLogin({
        name: 'Ramesh Patel',
        role: 'Progressive Farmer',
        phone: '+91 98765 43210',
        avatar: '👨‍🌾',
        field_id: 'FIELD-NORTH-01',
        region: 'Indore (Madhya Pradesh)'
      });
    } else {
      onLogin({
        name: 'Dr. R. K. Verma',
        role: 'Senior Agronomist (ICAR)',
        phone: '+91 94250 88712',
        avatar: '🔬',
        field_id: 'ALL-ZONES',
        region: 'National Agricultural Extension'
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px 16px'
    }}>
      {/* Top Bar with Back to Home, Language & Theme Controls */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => onNavigate('home')}
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <ArrowLeft size={15} />
          <span>{t.back_to_home}</span>
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Language Switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px'
          }}>
            <button
              onClick={() => setLanguage('English')}
              style={{
                background: language === 'English' ? 'var(--emerald-500)' : 'transparent',
                color: language === 'English' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '3px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('Hindi')}
              style={{
                background: language === 'Hindi' ? 'var(--emerald-500)' : 'transparent',
                color: language === 'Hindi' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '3px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              हिन्दी
            </button>
          </div>

          {/* Theme switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.74rem' }}
          >
            {theme === 'dark' ? <Sun size={14} color="var(--amber-400)" /> : <Moon size={14} color="var(--cyan-400)" />}
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '32px 28px',
        border: '1px solid var(--border-glass)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--emerald-500), var(--cyan-500))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Sprout size={30} color="#fff" />
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {t.login_title}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {t.login_subtitle}
          </p>
        </div>

        {/* Tab Switcher: Mobile OTP vs Kisan ID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: 'var(--bg-glass)',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '20px',
          border: '1px solid var(--border-glass)'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('otp'); setErrorMsg(''); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'otp' ? 'var(--card-bg)' : 'transparent',
              color: activeTab === 'otp' ? 'var(--emerald-400)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'otp' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Smartphone size={15} />
            <span>{t.tab_otp}</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('id'); setErrorMsg(''); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'id' ? 'var(--card-bg)' : 'transparent',
              color: activeTab === 'id' ? 'var(--emerald-400)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'id' ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <KeyRound size={15} />
            <span>{t.tab_id}</span>
          </button>
        </div>

        {/* Role Selector */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            {t.role_label}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { key: 'Farmer', label: t.role_farmer },
              { key: 'Extension', label: t.role_extension },
              { key: 'Agronomist', label: t.role_agronomist }
            ].map(r => (
              <button
                key={r.key}
                type="button"
                onClick={() => setSelectedRole(r.key)}
                style={{
                  padding: '6px 4px',
                  borderRadius: 'var(--radius-sm)',
                  border: selectedRole === r.key ? '1px solid var(--emerald-400)' : '1px solid var(--border-glass)',
                  background: selectedRole === r.key ? 'rgba(16, 185, 129, 0.12)' : 'var(--card-bg)',
                  color: selectedRole === r.key ? 'var(--emerald-400)' : 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: selectedRole === r.key ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid var(--rose-500)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            marginBottom: '14px',
            fontSize: '0.78rem',
            color: 'var(--rose-500)'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Tab 1: Mobile OTP Form */}
        {activeTab === 'otp' && (
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                {t.mobile_label}
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)'
                }}>
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  className="input-control"
                  placeholder={t.mobile_placeholder}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  style={{ flex: 1, fontSize: '0.9rem', letterSpacing: '0.04em' }}
                  disabled={otpSent}
                />
              </div>
            </div>

            {otpSent && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid var(--emerald-400)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  marginBottom: '10px',
                  fontSize: '0.76rem',
                  color: 'var(--emerald-400)'
                }}>
                  {t.otp_sent_to} +91 {mobile}
                </div>

                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  {t.enter_otp}
                </label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  style={{
                    fontSize: '1.2rem',
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    fontWeight: 800,
                    color: 'var(--emerald-400)'
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: 800, marginTop: '6px' }}
            >
              {otpSent ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>{t.verify_login}</span>
                </>
              ) : (
                <>
                  <Smartphone size={16} />
                  <span>{loading ? 'Sending OTP...' : t.send_otp}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Kisan ID / Password Form */}
        {activeTab === 'id' && (
          <form onSubmit={handleIdLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                {t.kisan_id_label}
              </label>
              <input
                type="text"
                className="input-control"
                value={kisanId}
                onChange={(e) => setKisanId(e.target.value)}
                placeholder="e.g. KISAN-INDORE-2026"
                style={{ fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                {t.password_label}
              </label>
              <input
                type="password"
                className="input-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ fontSize: '0.88rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: 800 }}
            >
              <Lock size={16} />
              <span>{t.login_btn_submit}</span>
            </button>
          </form>
        )}

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '22px 0 16px 0',
          color: 'var(--text-muted)',
          fontSize: '0.72rem',
          textTransform: 'uppercase',
          fontWeight: 700
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
          <span>{t.or_demo_login}</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
        </div>

        {/* 1-Click Instant Demo Login Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handleQuickDemo('farmer')}
            className="btn btn-secondary"
            style={{
              width: '100%',
              justifyContent: 'space-between',
              padding: '8px 14px',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>👨‍🌾</span>
              <strong style={{ color: 'var(--text-primary)' }}>{t.demo_farmer}</strong>
            </div>
            <ChevronRight size={14} color="var(--emerald-400)" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('agronomist')}
            className="btn btn-secondary"
            style={{
              width: '100%',
              justifyContent: 'space-between',
              padding: '8px 14px',
              fontSize: '0.8rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>🔬</span>
              <strong style={{ color: 'var(--text-primary)' }}>{t.demo_agronomist}</strong>
            </div>
            <ChevronRight size={14} color="var(--purple-400)" />
          </button>
        </div>

      </div>
    </div>
  );
}
