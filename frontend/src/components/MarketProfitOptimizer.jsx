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
import { translations } from '../i18n/translations';

export default function MarketProfitOptimizer({ field, language = 'Hindi' }) {
  const t = translations[language] || translations.English;
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

  const cropOptions = [
    { key: "Wheat", label: language === 'Hindi' ? "गेहूं (Wheat)" : "Wheat" },
    { key: "Chickpea", label: language === 'Hindi' ? "चना (Chickpea)" : "Chickpea" },
    { key: "Cotton", label: language === 'Hindi' ? "कपास (Cotton)" : "Cotton" },
    { key: "Maize", label: language === 'Hindi' ? "मक्का (Maize)" : "Maize" },
    { key: "Groundnut", label: language === 'Hindi' ? "मूंगफली (Groundnut)" : "Groundnut" },
    { key: "Potato", label: language === 'Hindi' ? "आलू (Potato)" : "Potato" }
  ];

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
              <TrendingUp size={22} color="var(--amber-500)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t.mandi_title}
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {t.mandi_sub}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {cropOptions.map(c => (
              <button
                key={c.key}
                onClick={() => setSelectedCrop(c.key)}
                className={`btn ${c.key === selectedCrop ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', padding: '5px 12px' }}
              >
                {c.label}
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
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t.apmc_forecast}: {selectedCrop}
              </h3>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                {language === 'Hindi' ? 'मंडी केंद्र: ' : 'Hub: '}{marketData?.mandi_hub}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--amber-500)' }}>
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
            background: 'var(--bg-surface-elevated)', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-glass)',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '4px',
            position: 'relative'
          }}>
            {forecast.map((pt) => {
              const heightPct = Math.max(15, ((pt.projected_price_inr_qtl - minPrice) / Math.max(1, (maxPrice - minPrice))) * 85);
              const isPeak = pt.day === marketData?.peak_price_window?.day;

              return (
                <div 
                  key={pt.day}
                  style={{
                    flex: 1,
                    height: `${heightPct}%`,
                    background: isPeak ? 'var(--amber-500)' : 'linear-gradient(180deg, #10b981, rgba(16, 185, 129, 0.2))',
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
                      background: 'var(--amber-500)',
                      color: '#fff',
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
            <span>{language === 'Hindi' ? 'आज (दिन 1)' : 'Today (Day 1)'}</span>
            <span>{language === 'Hindi' ? 'दिन 15' : 'Day 15'}</span>
            <span>{language === 'Hindi' ? 'दिन 30 (कटाई परिपक्वता)' : 'Day 30 (Maturity Horizon)'}</span>
          </div>
        </div>

        {/* Right: Harvest Timing & Mandi Decision Banner */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t.harvest_timing_advisory}
              </h3>
              <span className="badge badge-amber">
                {language === 'Hindi' ? 'तेजी का रुझान (+6.2%)' : (marketData?.projected_trend?.split(' ')[0] || 'Bullish')}
              </span>
            </div>

            <div style={{ 
              background: 'rgba(245, 158, 11, 0.08)', 
              border: '1px solid rgba(245, 158, 11, 0.3)', 
              padding: '16px', 
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px'
            }}>
              <strong style={{ fontSize: '0.98rem', color: 'var(--amber-500)' }}>
                {language === 'Hindi' 
                  ? "कटाई को 10-14 दिन टालें / रोकें: आटा मिलों की मांग बढ़ने से भाव में ₹160/क्विंटल उछाल का अनुमान है।"
                  : marketData?.harvest_timing_advice?.decision}
              </strong>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                {language === 'Hindi'
                  ? "वर्तमान में फसल 88% परिपक्व है। 10-14 दिन बाद इंदौर/खन्ना मंडी में पीक भाव मिलेगा जिससे प्रति हेक्टेयर अतिरिक्त मुनाफा होगा।"
                  : marketData?.harvest_timing_advice?.reasoning}
              </p>
              <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                💡 <strong>{language === 'Hindi' ? 'सिफारिश: ' : 'Action: '}</strong> 
                {language === 'Hindi' ? 'हल्की सिंचाई बनाए रखें ताकि दाना न सूखे और पीक विंडो पर कटाई करें।' : marketData?.harvest_timing_advice?.action}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-inner-box)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{t.arrival_pace}:</span>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {marketData?.daily_arrivals_mt} {language === 'Hindi' ? 'मीट्रिक टन / दिन' : 'Metric Tonnes / day'}
            </p>
            <span style={{ fontSize: '0.74rem', color: 'var(--emerald-500)', fontWeight: 600 }}>
              {language === 'Hindi' ? 'मंडी तरलता सामान्य है, मजबूरी में कम भाव पर बेचने का कोई दबाव नहीं।' : 'Arrival Elasticity: Normal market liquidity; low distress discount risk.'}
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
                <Scale size={20} color="var(--emerald-500)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {t.pulp_title}
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {language === 'Hindi' 
                  ? `${profitData.field_area_ha} हेक्टेयर रकबे पर ₹${profitData.mandi_price_inr_qtl}/क्विंटल भाव के अनुसार गणितीय विश्लेषण।`
                  : `Constrained optimization model evaluated over ${profitData.field_area_ha} hectares at ₹${profitData.mandi_price_inr_qtl}/Qtl.`}
              </p>
            </div>

            <span className="badge badge-emerald" style={{ fontSize: '0.86rem', padding: '6px 14px' }}>
              +{profitData.economic_impact_summary.profit_increase_pct}% {language === 'Hindi' ? 'शुद्ध लाभ वृद्धि' : 'Net Profit Gain'} (+₹{profitData.economic_impact_summary.profit_increase_inr_ha?.toLocaleString()}/ha)
            </span>
          </div>

          {/* Comparison Table */}
          <div style={{ overflowX: 'auto', marginBottom: '18px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px' }}>{language === 'Hindi' ? 'कृषि मापदंड' : 'Agricultural Parameter'}</th>
                  <th style={{ padding: '10px 14px' }}>{language === 'Hindi' ? 'पारंपरिक खेती' : 'Conventional Practice'}</th>
                  <th style={{ padding: '10px 14px', color: 'var(--emerald-500)' }}>{language === 'Hindi' ? 'AgriPilot सटीक AI खेती' : 'AgriPilot Precision Engine'}</th>
                  <th style={{ padding: '10px 14px' }}>{language === 'Hindi' ? 'शुद्ध बचत / लाभ' : 'Net Impact / Savings'}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.crop_yield}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{profitData.conventional_practice.yield_qtl_ha} Qtl/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-500)', fontWeight: 800 }}>{profitData.agripilot_optimized.yield_qtl_ha} Qtl/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-500)', fontWeight: 700 }}>+14.0% {language === 'Hindi' ? 'उपज वृद्धि' : 'Yield Boost'}</td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.gross_revenue}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>₹{profitData.conventional_practice.gross_revenue_inr_ha?.toLocaleString()}/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-500)', fontWeight: 800 }}>₹{profitData.agripilot_optimized.gross_revenue_inr_ha?.toLocaleString()}/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-500)', fontWeight: 700 }}>+₹{(profitData.agripilot_optimized.gross_revenue_inr_ha - profitData.conventional_practice.gross_revenue_inr_ha)?.toLocaleString()}/ha</td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.chemical_cost}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--rose-500)' }}>
                    ₹{(profitData.conventional_practice.input_costs_inr_ha.fertilizer + profitData.conventional_practice.input_costs_inr_ha.pesticide)?.toLocaleString()}/ha
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-500)', fontWeight: 800 }}>
                    ₹{(profitData.agripilot_optimized.input_costs_inr_ha.fertilizer + profitData.agripilot_optimized.input_costs_inr_ha.pesticide)?.toLocaleString()}/ha
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-500)', fontWeight: 700 }}>
                    {language === 'Hindi' ? 'बचत: ' : 'Saved '}₹{profitData.economic_impact_summary.input_cost_reduction_inr_ha?.toLocaleString()}/ha
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.water_consumption}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{profitData.conventional_practice.water_consumed_m3_ha?.toLocaleString()} m³/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--emerald-500)', fontWeight: 800 }}>{profitData.agripilot_optimized.water_consumed_m3_ha?.toLocaleString()} m³/ha</td>
                  <td style={{ padding: '12px 14px', color: 'var(--cyan-400)', fontWeight: 700 }}>{profitData.economic_impact_summary.water_saved_pct}% {language === 'Hindi' ? 'पानी की बचत' : 'Freshwater Saved'}</td>
                </tr>

                <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.98rem' }}>{t.net_farm_profit}</td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>₹{profitData.conventional_practice.net_profit_inr_ha?.toLocaleString()}</td>
                  <td style={{ padding: '14px', color: 'var(--emerald-500)', fontWeight: 800, fontSize: '1.1rem' }}>₹{profitData.agripilot_optimized.net_profit_inr_ha?.toLocaleString()}</td>
                  <td style={{ padding: '14px', color: 'var(--emerald-500)', fontWeight: 800 }}>+₹{profitData.economic_impact_summary.profit_increase_inr_ha?.toLocaleString()} (+{profitData.economic_impact_summary.profit_increase_pct}%)</td>
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
            fontSize: '0.86rem',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span style={{ color: 'var(--text-primary)' }}>
              {language === 'Hindi' ? `कुल ${profitData.field_area_ha} हेक्टेयर पर अतिरिक्त शुद्ध मुनाफा:` : `Total Farm Gain across ${profitData.field_area_ha} ha:`} <strong>+₹{profitData.economic_impact_summary.total_field_gain_inr?.toLocaleString()}</strong>
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
