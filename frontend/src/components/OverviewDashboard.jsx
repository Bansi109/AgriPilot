import React from 'react';
import { 
  Droplet, 
  Sun, 
  FlaskConical, 
  AlertCircle, 
  TrendingUp, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  CloudRain,
  ShieldAlert,
  Radio,
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function OverviewDashboard({ 
  cycleData, 
  weatherData, 
  field, 
  onNavigateTab,
  language = 'Hindi'
}) {
  const t = translations[language] || translations.English;
  const stepData = cycleData || {};
  const currentStep = 8;

  const steps = language === 'Hindi' ? [
    { num: 1, label: "फसल जीवन चक्र", icon: "🌱" },
    { num: 2, label: "डिजिटल ट्विन", icon: "🌐" },
    { num: 3, label: "विशेषज्ञ एजेंट्स", icon: "🤖" },
    { num: 4, label: "जोखिम पहचान", icon: "⚠️" },
    { num: 5, label: "व्हाट-इफ व लाभ", icon: "📊" },
    { num: 6, label: "कार्य योजना", icon: "📅" },
    { num: 7, label: "खेत से मंडी", icon: "🚛" },
    { num: 8, label: "क्रियान्वयन व सीख", icon: "🔄" }
  ] : [
    { num: 1, label: "Crop Lifecycle", icon: "🌱" },
    { num: 2, label: "Digital Twin", icon: "🌐" },
    { num: 3, label: "Marketplace", icon: "🤖" },
    { num: 4, label: "Risk Detection", icon: "⚠️" },
    { num: 5, label: "What-If & Profit", icon: "📊" },
    { num: 6, label: "Ops Planner", icon: "📅" },
    { num: 7, label: "Farm-to-Market", icon: "🚛" },
    { num: 8, label: "Execute & Learn", icon: "🔄" }
  ];

  const rain72h = weatherData?.next_72h_rain_mm || 18.0;
  const hasRainAlert = weatherData?.rain_alert_72h ?? true;
  const currentEt0 = weatherData?.current?.et0_penman_monteith_mm_day || 4.2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Closed-Loop 8-Step Decision Stepper */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="var(--emerald-500)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
              {t.closed_loop_title}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-emerald">
              <CheckCircle2 size={12} /> {t.cycle_completed}: {stepData.decision_cycle_id || 'CYCLE-2026-0001'} ({stepData.cycle_duration_ms || 420}ms)
            </span>
          </div>
        </div>

        {/* Stepper Nodes */}
        <div className="cycle-stepper">
          {steps.map((s) => (
            <div 
              key={s.num} 
              className={`step-node ${s.num <= currentStep ? 'completed' : ''} ${s.num === currentStep ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (s.num === 1) onNavigateTab('lifecycle');
                if (s.num === 2) onNavigateTab('map');
                if (s.num === 3) onNavigateTab('marketplace');
                if (s.num === 4) onNavigateTab('crisis');
                if (s.num === 5) onNavigateTab('profit');
                if (s.num === 6) onNavigateTab('planner');
                if (s.num === 7) onNavigateTab('farm-market');
                if (s.num === 8) onNavigateTab('omnichannel');
              }}
            >
              <div className="step-node-icon">
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
              </div>
              <span className="step-label">
                {s.num}: {s.label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ 
          background: 'rgba(16, 185, 129, 0.08)', 
          border: '1px solid rgba(16, 185, 129, 0.25)', 
          borderRadius: 'var(--radius-sm)', 
          padding: '10px 14px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            <strong>{language === 'Hindi' ? 'स्वायत्त क्लोज्ड-लूप चक्र:' : 'Autonomous Closed Loop:'}</strong> {language === 'Hindi' 
              ? 'सेंसर टेलीमेट्री → विशेषज्ञ एजेंट्स विश्लेषण → गणितीय कार्य योजना → IoT वाल्व व SMS डिस्पैच → मौसमी यादों में संचयन।'
              : 'Field telemetry ingested → Specialist agents evaluated → Multi-constraint plan solved → IoT valve & offline SMS triggered → Results stored in Knowledge Graph.'}
          </span>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '5px 12px', fontSize: '0.78rem' }}
            onClick={() => onNavigateTab('knowledge-graph')}
          >
            <span>{t.view_memory_graph}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* High-Level Metric Cards */}
      <div className="grid-cols-4">
        {/* Soil Moisture */}
        <div className="glass-panel metric-card">
          <div className="metric-title">
            <span>{t.soil_moisture}</span>
            <Droplet size={18} color="var(--emerald-500)" />
          </div>
          <div className="metric-value">
            {field?.soil_moisture_pct || 52.4}%
          </div>
          <div className="metric-footer">
            <span style={{ color: 'var(--emerald-500)', fontWeight: 700 }}>{t.optimal_capacity}</span>
            <span>(30cm)</span>
          </div>
        </div>

        {/* Penman-Monteith ET0 */}
        <div className="glass-panel metric-card cyan">
          <div className="metric-title">
            <span>{t.penman_monteith}</span>
            <Sun size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value">
            {currentEt0} <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>mm/day</span>
          </div>
          <div className="metric-footer">
            <span style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>{t.loss_calibrated}</span>
          </div>
        </div>

        {/* Anomaly Threat Tier */}
        <div className="glass-panel metric-card rose">
          <div className="metric-title">
            <span>{t.risk_detection}</span>
            <AlertCircle size={18} color="var(--rose-500)" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.45rem', color: 'var(--rose-500)' }}>
            {language === 'Hindi' ? 'उच्च चेतावनी' : (stepData?.step_4_risk_assessment?.threat_tier || 'CRITICAL THREAT')}
          </div>
          <div className="metric-footer">
            <span>{t.anomaly_score}: {stepData?.step_4_risk_assessment?.anomaly_score || 45}/100</span>
          </div>
        </div>

        {/* Economic Profit Gain */}
        <div className="glass-panel metric-card amber">
          <div className="metric-title">
            <span>{t.net_margin_boost}</span>
            <TrendingUp size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value" style={{ color: 'var(--amber-400)' }}>
            +{stepData?.step_5_simulation_and_profit?.net_profit_increase_pct || 32.5}%
          </div>
          <div className="metric-footer">
            <span>{t.pulp_result}</span>
          </div>
        </div>
      </div>

      {/* 72-Hour Rain Alert Banner & Simulation Advice */}
      {hasRainAlert && (
        <div className="glass-panel" style={{ 
          borderLeft: '5px solid var(--amber-500)', 
          background: 'rgba(245, 158, 11, 0.08)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '50%', 
              background: 'rgba(245, 158, 11, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <CloudRain size={22} color="var(--amber-500)" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--amber-500)', marginBottom: '2px' }}>
                {t.rain_alert_title} ({rain72h.toFixed(1)} mm {t.rain_predicted})
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                {language === 'Hindi' 
                  ? "सिंचाई तुरंत रोकें: अगले 72 घंटे में पर्याप्त बारिश होने का अनुमान है जिससे जलभराव रुक सकता है और पानी की बचत होगी।"
                  : (weatherData?.irrigation_advice || "SUPPRESS IRRIGATION: Natural rainfall incoming to replenish root zone.")}
              </p>
            </div>
          </div>
          <button 
            className="btn btn-warning"
            onClick={() => onNavigateTab('map')}
          >
            <span>{t.simulate_what_if}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Two Column Grid: Live Field Status & Orchestrated Actions */}
      <div className="grid-cols-2">
        {/* Active Field Digital Twin Snapshot */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={18} color="var(--emerald-500)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {field?.name || "North Plot"} — {t.live_status}
              </h3>
            </div>
            <span className="badge badge-emerald">
              {field?.crop || "Wheat"} ({field?.current_stage || "Vegetative"})
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--bg-inner-box)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{t.available_n}</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '3px' }}>
                {field?.soil_n_mg_kg || 154} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>mg/kg</span>
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--amber-500)', fontWeight: 600 }}>{language === 'Hindi' ? 'कमी (-26 mg/kg)' : 'Deficit (-26 mg/kg)'}</span>
            </div>

            <div style={{ background: 'var(--bg-inner-box)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{t.soil_ph}</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '3px' }}>
                {field?.soil_ph || 7.2}
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--emerald-500)', fontWeight: 600 }}>{language === 'Hindi' ? 'अनुकूलतम (6.0 - 7.5)' : 'Optimal (6.0 - 7.5)'}</span>
            </div>

            <div style={{ background: 'var(--bg-inner-box)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{t.canopy_cover}</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '3px' }}>
                {field?.canopy_cover_pct || 68}%
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--emerald-500)', fontWeight: 600 }}>{language === 'Hindi' ? 'सघन बायोमास' : 'High Biomass'}</span>
            </div>

            <div style={{ background: 'var(--bg-inner-box)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{t.smart_valve}</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '3px' }}>
                {field?.pump_status || "STANDBY"}
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>ID: {field?.valve_id || "VALVE-N1-01"}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {language === 'Hindi' ? 'सक्रिय कीट चेतावनी: ' : 'Pest Flag: '}
              <strong style={{ color: 'var(--rose-500)' }}>
                {language === 'Hindi' ? 'पीला रतुआ (Yellow Rust)' : (field?.active_pest_status || "Yellow Rust Focus")}
              </strong>
            </span>
            <button 
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => onNavigateTab('pest-vision')}
            >
              <span>{t.scan_leaf}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Autonomous Orchestrated Action Plan */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--amber-500)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t.autonomous_plan} ({stepData?.step_6_operations_plan?.plan_id || 'PLAN-AUTO'})
              </h3>
            </div>
            <span className="badge badge-amber">
              {language === 'Hindi' ? 'उच्च प्राथमिकता' : (stepData?.step_6_operations_plan?.urgency || 'High Priority')}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {(stepData?.step_6_operations_plan?.action_items || []).slice(0, 3).map((act, i) => (
              <div key={i} style={{ 
                background: 'var(--bg-inner-box)', 
                padding: '12px 14px', 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                      {act.category}
                    </span>
                    <strong style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                      {act.command} ({act.target_device})
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {language === 'Hindi' && act.command === 'VALVE_CLOSE' 
                      ? "आगामी भारी बारिश के कारण सिंचाई वाल्व बंद करने का आदेश भेजा गया है ताकि जलभराव न हो।"
                      : (language === 'Hindi' && act.category?.includes('Pest')
                        ? "पीला रतुआ रोकथाम हेतु प्रोपिकोनाज़ोल का सुबह शांत हवा में छिड़काव अनुमोदित किया गया है।"
                        : act.description)}
                  </p>
                </div>
                <span className="badge badge-purple" style={{ fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
                  {act.execution_mode?.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {language === 'Hindi' ? 'SMS सलाह हिन्दी में भेजी गई (Twilio सिमुलेटर)' : 'SMS Advisory sent in Hindi via Twilio Simulator'}
            </span>
            <button 
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => onNavigateTab('omnichannel')}
            >
              <span>{t.view_omni}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
