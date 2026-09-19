import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Scale, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  CheckCircle2, 
  Percent,
  Coins
} from 'lucide-react';

export default function MarketProfitOptimizer({ field }) {
  const [selectedCrop, setSelectedCrop] = useState(field?.crop || 'Wheat');
  const [marketData, setMarketData] = useState(null);
  const [profitData, setProfitData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMarketAndProfit = async (crop) => {
    setLoading(true);
    try {
      const [mRes, pRes] = await Promise.all([
        fetch(`/api/market/analysis?crop=${crop}&maturity_pct=88.0`),
        fetch(`/api/profit/optimize?crop=${crop}&area_ha=${field?.area_ha || 2.4}`)
      ]);
      const mData = await mRes.json();
      const pData = await pRes.json();
      setMarketData(mData);
      setProfitData(pData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketAndProfit(selectedCrop);
  }, [selectedCrop, field]);

  const cropOptions = ["Wheat", "Chickpea", "Cotton", "Maize", "Groundnut", "Potato"];

  const forecast = marketData?.forecast_30d || [];
  const maxPrice = forecast.length ? Math.max(...forecast.map(d => d.projected_price_inr_qtl)) : 3000;
  const minPrice = forecast.length ? Math.min(...forecast.map(d => d.projected_price_inr_qtl)) : 2000;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={22} color="var(--amber-400)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Mandi Market Intelligence & Farm Profit Optimizer (Modules 6.4.5 & 6.4.11)
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              7–30 day commodity price forecasts and PuLP linear programming profit optimization.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {cropOptions.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`btn ${c === selectedCrop ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', padding: '5px 12px' }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mandi Price Forecast & Harvest Timing Advice */}
      <div className="grid-cols-2">
        
        {/* Left: 30-Day Mandi Price Curve */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                30-Day APMC Price Forecast: {selectedCrop}
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Hub: {marketData?.mandi_hub}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--amber-400)' }}>
                ₹{marketData?.current_modal_price?.toFixed(0)}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                MSP: ₹{marketData?.msp?.toFixed(0)} (+₹{marketData?.price_above_msp})
              </span>
            </div>
          </div>

          {/* SVG Price Trend Line Chart */}
          <div style={{ 
            height: '220px', 
            background: 'rgba(10, 15, 29, 0.8)', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-glass)',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '4px',
            position: 'relative'
          }}>
            {forecast.map((pt, idx) => {
              const heightPct = Math.max(15, ((pt.projected_price_inr_qtl - minPrice) / Math.max(1, (maxPrice - minPrice))) * 85);
              const isPeak = pt.day === marketData?.peak_price_window?.day;

              return (
                <div 
                  key={pt.day}
                  style={{
                    flex: 1,
                    height: `${heightPct}%`,
                    background: isPeak ? 'var(--amber-400)' : 'linear-gradient(180deg, var(--emerald-400), rgba(16, 185, 129, 0.2))',
                    borderRadius: '2px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title={`Day ${pt.day} (${pt.date}): ₹${pt.projected_price_inr_qtl} / Qtl`}
                >
                  {isPeak && (
                    <div style={{
                      position: 'absolute',
                      top: '-26px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--amber-400)',
                      color: '#000',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '3px',
                      whiteSpace: 'nowrap'
                    }}>
                      Peak ₹{pt.projected_price_inr_qtl}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>Today (Day 1)</span>
            <span>Day 15 (Mid-Window)</span>
            <span>Day 30 (Maturity Horizon)</span>
          </div>
        </div>

        {/* Right: Harvest Timing & Mandi Decision Banner */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                Harvest Timing Advisory
              </h3>
              <span className="badge badge-amber">
                {marketData?.projected_trend?.split(' ')[0] || 'Bullish'}
              </span>
            </div>

            <div style={{ 
              background: 'rgba(245, 158, 11, 0.08)', 
              border: '1px solid rgba(245, 158, 11, 0.25)', 
              padding: '16px', 
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px'
            }}>
              <strong style={{ fontSize: '0.98rem', color: 'var(--amber-400)' }}>
                {marketData?.harvest_timing_advice?.decision}
              </strong>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                {marketData?.harvest_timing_advice?.reasoning}
              </p>
              <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>
                💡 <strong>Action:</strong> {marketData?.harvest_timing_advice?.action}
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.025)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Daily Mandi Arrival Pace:</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              {marketData?.daily_arrivals_mt} Metric Tonnes / day
            </p>
            <span style={{ fontSize: '0.74rem', color: 'var(--emerald-400)' }}>
              Arrival Elasticity: Normal market liquidity; low risk of distress discounting.
            </span>
          </div>
        </div>

      </div>

      {/* PuLP Mathematical Profit Optimizer Comparison */}
      {profitData && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={20} color="var(--emerald-400)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  PuLP Mathematical Profit Optimization: Conventional vs AgriPilot
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Constrained optimization model evaluated over {profitData.field_area_ha} hectares at ₹{profitData.mandi_price_inr_qtl}/Qtl.
              </p>
            </div>

            <span className="badge badge-emerald" style={{ fontSize: '0.86rem', padding: '6px 14px' }}>
              +{profitData.economic_impact_summary.profit_increase_pct}% Net Profit Gain (+₹{profitData.economic_impact_summary.profit_increase_inr_ha?.toLocaleString()}/ha)
            </span>
          </div>

          {/* Comparison Table */}
          <div style={{ overflowX: 'auto', marginBottom: '18px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px' }}>Agricultural Parameter</th>
                  <th style={{ padding: '10px 14px' }}>Conventional Practice</th>
                  <th style={{ padding: '10px 14px', color: 'var(--emerald-400)' }}>AgriPilot Precision Engine</th>
                  <th style={{ padding: '10px 14px' }}>Net Impact / Savings</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#fff' }}>Crop Yield</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{profitData.conventional_practice.yield_qtl_ha} Qtl/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-400)', fontWeight: 700 }}>{profitData.agripilot_optimized.yield_qtl_ha} Qtl/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-400)' }}>+14.0% Yield Boost</td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#fff' }}>Gross Revenue</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>₹{profitData.conventional_practice.gross_revenue_inr_ha?.toLocaleString()}/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-400)', fontWeight: 700 }}>₹{profitData.agripilot_optimized.gross_revenue_inr_ha?.toLocaleString()}/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-400)' }}>+₹{(profitData.agripilot_optimized.gross_revenue_inr_ha - profitData.conventional_practice.gross_revenue_inr_ha)?.toLocaleString()}/ha</td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#fff' }}>Fertilizer + Chemical Cost</td>
                  <td style={{ padding: '12px 14px', color: 'var(--rose-500)' }}>
                    ₹{(profitData.conventional_practice.input_costs_inr_ha.fertilizer + profitData.conventional_practice.input_costs_inr_ha.pesticide)?.toLocaleString()}/ha
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-400)', fontWeight: 700 }}>
                    ₹{(profitData.agripilot_optimized.input_costs_inr_ha.fertilizer + profitData.agripilot_optimized.input_costs_inr_ha.pesticide)?.toLocaleString()}/ha
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-400)' }}>
                    Saved ₹{profitData.economic_impact_summary.input_cost_reduction_inr_ha?.toLocaleString()}/ha
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#fff' }}>Water Consumption</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{profitData.conventional_practice.water_consumed_m3_ha?.toLocaleString()} m³/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-400)', fontWeight: 700 }}>{profitData.agripilot_optimized.water_consumed_m3_ha?.toLocaleString()} m³/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--cyan-400)' }}>Saved {profitData.economic_impact_summary.water_saved_pct}% Freshwater</td>
                </tr>

                <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#fff', fontSize: '0.98rem' }}>Net Farm Profit (Per Hectare)</td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>₹{profitData.conventional_practice.net_profit_inr_ha?.toLocaleString()}</td>
                  <td style={{ padding: '14px', color: 'var(--emerald-400)', fontWeight: 800, fontSize: '1.1rem' }}>₹{profitData.agripilot_optimized.net_profit_inr_ha?.toLocaleString()}</td>
                  <td style={{ padding: '14px', color: 'var(--emerald-400)', fontWeight: 800 }}>+₹{profitData.economic_impact_summary.profit_increase_inr_ha?.toLocaleString()} (+{profitData.economic_impact_summary.profit_increase_pct}%)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ 
            background: 'rgba(16, 185, 129, 0.08)', 
            border: '1px solid rgba(16, 185, 129, 0.25)', 
            padding: '14px 18px', 
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.86rem'
          }}>
            <span>
              Total Farm Gain across {profitData.field_area_ha} ha: <strong>+₹{profitData.economic_impact_summary.total_field_gain_inr?.toLocaleString()}</strong>
            </span>
            <span className="badge badge-emerald">
              ROI Multiplier: {profitData.economic_impact_summary.roi_multiplier}x
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
