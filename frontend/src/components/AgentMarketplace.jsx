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

export default function AgentMarketplace() {
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

  const agentIcons = {
    weather: <CloudSun size={24} color="var(--cyan-400)" />,
    soil: <Flask size={24} color="var(--emerald-400)" />,
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
              <Bot size={22} color="var(--emerald-400)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Adaptive Farm Agent Marketplace (Module 6.4.8)
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Modular specialist agents activated on-demand and orchestrated by the Core Closed-Loop Engine.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-emerald">
              {marketplaceData?.active_agents_count || 7} / 7 Agents Active
            </span>
            <button 
              onClick={fetchMarketplace} 
              disabled={loading}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
              <span>Refresh Marketplace</span>
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
                      background: 'rgba(255, 255, 255, 0.04)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid var(--border-glass)'
                    }}>
                      {agentIcons[key] || <Bot size={22} color="#fff" />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                        {ag.agent}
                      </h3>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Specialist Module • Last Run: {ag.timestamp?.split(' ')[1] || 'Live'}
                      </span>
                    </div>
                  </div>

                  <span className={`badge ${isCritical ? 'badge-rose' : (isWarning ? 'badge-amber' : 'badge-emerald')}`}>
                    {risk}
                  </span>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  {ag.summary}
                </p>
              </div>

              {/* Real-Time Metrics Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                {ag.metrics && Object.entries(ag.metrics).map(([k, v]) => {
                  if (typeof v === 'boolean') {
                    return (
                      <span key={k} className="badge" style={{ background: v ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: v ? 'var(--rose-500)' : 'var(--emerald-400)', fontSize: '0.7rem' }}>
                        {k.replace(/_/g, ' ')}: {v ? 'YES' : 'NO'}
                      </span>
                    );
                  }
                  return (
                    <span key={k} className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                      {k.replace(/_/g, ' ')}: <strong style={{ color: '#fff' }}>{String(v)}</strong>
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
