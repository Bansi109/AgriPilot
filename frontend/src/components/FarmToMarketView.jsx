import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Store, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  Phone,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function FarmToMarketView({ field }) {
  const [f2mData, setF2mData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchF2M = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/farm-to-market?crop=${field?.crop || 'Wheat'}&maturity_pct=95.0`);
      const data = await res.json();
      setF2mData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchF2M();
  }, [field]);

  const bestMandi = f2mData?.best_mandi_recommendation;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={22} color="var(--cyan-400)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Farm-to-Market Autonomous Coordination (Module 6.4.12)
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Coordinates post-harvest logistics, freight transport booking, and APMC terminal price optimization.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-emerald">
              {f2mData?.harvest_readiness_status || 'Ready for Immediate Harvest'}
            </span>
            <button 
              onClick={fetchF2M} 
              disabled={loading}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
              <span>Refresh Logistics</span>
            </button>
          </div>
        </div>

        {/* Expected Production Metrics */}
        {f2mData?.total_estimated_production && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.025)', 
            padding: '16px 20px', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-glass)',
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Estimated Harvest Volume:</span>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {f2mData.total_estimated_production.tonnes} Tonnes ({f2mData.total_estimated_production.quintals} Quintals)
              </p>
            </div>

            {bestMandi && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Top Terminal Payout:</span>
                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald-400)', marginTop: '2px' }}>
                  ₹{bestMandi.total_expected_payout_inr?.toLocaleString()} (₹{bestMandi.net_price_per_qtl}/Qtl net)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Regional Mandis Comparison Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
          Regional APMC Mandi Net Realization Comparison
        </h3>

        <div style={{ overflowX: 'auto', marginBottom: '18px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>Mandi APMC Terminal</th>
                <th style={{ padding: '10px 12px' }}>Distance & Transit</th>
                <th style={{ padding: '10px 12px' }}>Gross Modal Price</th>
                <th style={{ padding: '10px 12px' }}>Freight Cost</th>
                <th style={{ padding: '10px 12px', color: 'var(--emerald-400)' }}>Net Realized Price</th>
                <th style={{ padding: '10px 12px' }}>Total Expected Payout</th>
                <th style={{ padding: '10px 12px' }}>Queue Wait</th>
                <th style={{ padding: '10px 12px' }}>Payment Speed</th>
              </tr>
            </thead>
            <tbody>
              {(f2mData?.all_mandi_comparisons || []).map((m, idx) => {
                const isBest = idx === 0;
                return (
                  <tr 
                    key={m.mandi_id} 
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: isBest ? 'rgba(16, 185, 129, 0.08)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '12px', fontWeight: 700, color: '#fff' }}>
                      {m.mandi_name}
                      {isBest && <span className="badge badge-emerald" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>Top Pick</span>}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{m.distance_km} km ({m.transit_time})</td>
                    <td style={{ padding: '12px', color: '#fff' }}>₹{m.gross_price_per_qtl}</td>
                    <td style={{ padding: '12px', color: 'var(--rose-500)' }}>-₹{m.freight_per_qtl}/Qtl</td>
                    <td style={{ padding: '12px', color: 'var(--emerald-400)', fontWeight: 800 }}>₹{m.net_realized_price_per_qtl}/Qtl</td>
                    <td style={{ padding: '12px', color: isBest ? 'var(--emerald-400)' : '#fff', fontWeight: 700 }}>₹{m.total_net_payout_inr?.toLocaleString()}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{m.queue_wait_hours} hrs</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{m.settlement}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Grid: Allocated Logistics Fleet & Pre-Dispatch Checklist */}
      <div className="grid-cols-2">
        
        {/* Allocated Logistics Fleet */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Truck size={18} color="var(--emerald-400)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Allocated Transport Logistics Fleet
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(f2mData?.allocated_logistics || []).map(v => (
              <div 
                key={v.vehicle_id}
                style={{
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.94rem', color: '#fff', display: 'block' }}>
                    {v.type} ({v.vehicle_id})
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Capacity: {v.capacity_tonnes} Tonnes ({v.capacity_quintals} Qtl) • Rate: ₹{v.rate_per_km}/km
                  </span>
                  <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--emerald-400)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={13} /> {v.driver_name} ({v.driver_phone})
                  </div>
                </div>

                <span className="badge badge-emerald">
                  {v.availability}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-Dispatch Checklist */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle2 size={18} color="var(--amber-400)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Autonomous Dispatch Verification Protocol
            </h3>
          </div>

          <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(f2mData?.dispatch_checklist || []).map((item, idx) => (
              <li 
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.86rem',
                  color: 'var(--text-primary)'
                }}
              >
                <CheckCircle2 size={16} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
