import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  CloudSun, 
  FlaskRound as Flask, 
  Leaf, 
  Bug, 
  TrendingUp, 
  Tractor, 
  Users, 
  RefreshCw, 
  CheckCircle,
  Activity,
  AlertCircle
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function AgentMarketplace({ language = 'Hindi' }) {
  const t = translations[language] || translations.English;
  const [marketplaceData, setMarketplaceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMarketplace = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/status');
      const data = await res.json();
      setMarketplaceData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const agentNamesHindi = {
    weather: "मौसम विशेषज्ञ (Weather Agent)",
    soil: "मृदा व उर्वरक विशेषज्ञ (Soil Agent)",
    crop_health: "फसल स्वास्थ्य विशेषज्ञ (Crop Health)",
    pest: "कीट व रोग विशेषज्ञ (Pest Agent)",
    market: "मंडी भाव विशेषज्ञ (Market Agent)",
    machinery: "कृषि मशीनरी विशेषज्ञ (Machinery)",
    labor: "श्रम व मजदूर विशेषज्ञ (Labor Agent)"
  };

  const agentIcons = {
    weather: <CloudSun size={24} color="var(--cyan-400)" />,
    soil: <Flask size={24} color="var(--emerald-500)" />,
    crop_health: <Leaf size={24} color="var(--lime-400)" />,
    pest: <Bug size={24} color="var(--rose-500)" />,
    market: <TrendingUp size={24} color="var(--amber-400)" />,
    machinery: <Tractor size={24} color="var(--purple-400)" />,
    labor: <Users size={24} color="var(--blue-500)" />
  };

  const agents = marketplaceData?.agents || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={22} color="var(--emerald-500)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {language === 'Hindi' ? 'अनुकूलनीय कृषि विशेषज्ञ एजेंट मार्केटप्लेस' : 'Adaptive Farm Agent Marketplace'}
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {language === 'Hindi'
                ? 'मांग अनुसार सक्रिय होने वाले 7 स्वतंत्र AI विशेषज्ञ एजेंट, जिनका समन्वय कोर क्लोज्ड-लूप इंजन करता है।'
                : 'Modular specialist agents activated on-demand and orchestrated by the Core Closed-Loop Engine.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-emerald">
              {marketplaceData?.active_agents_count || 7} / 7 {language === 'Hindi' ? 'एजेंट सक्रिय' : 'Agents Active'}
            </span>
            <button 
              onClick={fetchMarketplace} 
              disabled={loading}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
              <span>{language === 'Hindi' ? 'मार्केटप्लेस ताज़ा करें' : 'Refresh Marketplace'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Specialist Agents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        {Object.entries(agents).map(([key, ag]) => {
          const risk = ag.risk_level || 'Normal';
          const isCritical = risk === 'Critical';
          const isWarning = risk === 'Warning' || risk === 'High';

          return (
            <div 
              key={key} 
              className="glass-panel"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isCritical ? '1px solid rgba(244, 63, 94, 0.4)' : (isWarning ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-glass)')
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '12px', 
                      background: 'var(--bg-inner-box)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid var(--border-glass)'
                    }}>
                      {agentIcons[key] || <Bot size={22} color="var(--text-primary)" />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {language === 'Hindi' ? (agentNamesHindi[key] || ag.agent) : ag.agent}
                      </h3>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {language === 'Hindi' ? 'सक्रिय AI एजेंट' : 'Specialist Agent'} • {ag.timestamp?.split(' ')[1] || 'Live'}
                      </span>
                    </div>
                  </div>

                  <span className={`badge ${isCritical ? 'badge-rose' : (isWarning ? 'badge-amber' : 'badge-emerald')}`}>
                    {language === 'Hindi' ? (isCritical ? 'गंभीर' : (isWarning ? 'सावधानी' : 'सामान्य')) : risk}
                  </span>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', background: 'var(--bg-inner-box)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  {ag.summary}
                </p>
              </div>

              {/* Real-Time Metrics Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                {ag.metrics && Object.entries(ag.metrics).map(([k, v]) => {
                  if (typeof v === 'boolean') {
                    return (
                      <span key={k} className="badge" style={{ background: v ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: v ? 'var(--rose-500)' : 'var(--emerald-500)', fontSize: '0.7rem' }}>
                        {k.replace(/_/g, ' ')}: {v ? 'YES' : 'NO'}
                      </span>
                    );
                  }
                  return (
                    <span key={k} className="badge" style={{ background: 'var(--bg-inner-box)', color: 'var(--text-secondary)', fontSize: '0.7rem', border: '1px solid var(--border-glass)' }}>
                      {k.replace(/_/g, ' ')}: <strong style={{ color: 'var(--text-primary)' }}>{String(v)}</strong>
                    </span>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
