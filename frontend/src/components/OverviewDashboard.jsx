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

export default function OverviewDashboard({ 
  cycleData, 
  weatherData, 
  field, 
  onNavigateTab 
}) {
  const stepData = cycleData || {};
  const currentStep = 8; // Full cycle completed

  const steps = [
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="var(--emerald-400)" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Closed-Loop Autonomous Decision Cycle (Section 6.8)
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-emerald">
              <CheckCircle2 size={12} /> Cycle {stepData.decision_cycle_id || 'ACTIVE'} Completed ({stepData.cycle_duration_ms || 420}ms)
            </span>
          </div>
        </div>

        {/* Stepper Nodes */}
        <div className="cycle-stepper">
          {steps.map((s, idx) => (
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
                Step {s.num}: {s.label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ 
          background: 'rgba(16, 185, 129, 0.08)', 
          border: '1px solid rgba(16, 185, 129, 0.2)', 
          borderRadius: 'var(--radius-sm)', 
          padding: '10px 14px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontSize: '0.82rem'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            <strong>Autonomous Closed Loop:</strong> Field telemetry ingested → Specialist agents evaluated → Multi-constraint plan solved → IoT valve & offline SMS triggered → Results stored in Knowledge Graph.
          </span>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
            onClick={() => onNavigateTab('knowledge-graph')}
          >
            <span>View Memory Graph</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* High-Level Metric Cards */}
      <div className="grid-cols-4">
        {/* Soil Moisture */}
        <div className="glass-panel metric-card">
          <div className="metric-title">
            <span>Soil Moisture</span>
            <Droplet size={18} color="var(--emerald-400)" />
          </div>
          <div className="metric-value">
            {field?.soil_moisture_pct || 52.4}%
          </div>
          <div className="metric-footer">
            <span style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>Optimal Field Capacity</span>
            <span>(Root depth 30cm)</span>
          </div>
        </div>

        {/* Penman-Monteith ET0 */}
        <div className="glass-panel metric-card cyan">
          <div className="metric-title">
            <span>Penman-Monteith ET₀</span>
            <Sun size={18} color="var(--cyan-400)" />
          </div>
          <div className="metric-value">
            {currentEt0} <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>mm/day</span>
          </div>
          <div className="metric-footer">
            <span style={{ color: 'var(--cyan-400)' }}>1–7 Day Loss Projections Calibrated</span>
          </div>
        </div>

        {/* Anomaly Threat Tier */}
        <div className="glass-panel metric-card rose">
          <div className="metric-title">
            <span>Risk Detection</span>
            <AlertCircle size={18} color="var(--rose-500)" />
          </div>
          <div className="metric-value" style={{ fontSize: '1.45rem', color: 'var(--rose-500)' }}>
            {stepData?.step_4_risk_assessment?.threat_tier || 'CRITICAL THREAT'}
          </div>
          <div className="metric-footer">
            <span>Anomaly Score: {stepData?.step_4_risk_assessment?.anomaly_score || 45}/100</span>
          </div>
        </div>

        {/* Economic Profit Gain */}
        <div className="glass-panel metric-card amber">
          <div className="metric-title">
            <span>Net Margin Boost</span>
            <TrendingUp size={18} color="var(--amber-400)" />
          </div>
          <div className="metric-value" style={{ color: 'var(--amber-400)' }}>
            +{stepData?.step_5_simulation_and_profit?.net_profit_increase_pct || 32.5}%
          </div>
          <div className="metric-footer">
            <span>PuLP Constrained Optimizer Result</span>
          </div>
        </div>
      </div>

      {/* 72-Hour Rain Alert Banner & Simulation Advice */}
      {hasRainAlert && (
        <div className="glass-panel" style={{ 
          borderLeft: '5px solid var(--amber-400)', 
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
              <CloudRain size={22} color="var(--amber-400)" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--amber-400)', marginBottom: '2px' }}>
                72-Hour Precipitation Alert ({rain72h.toFixed(1)} mm Predicted)
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                {weatherData?.irrigation_advice || "SUPPRESS IRRIGATION: Sufficient natural precipitation incoming to replenish root zone."}
              </p>
            </div>
          </div>
          <button 
            className="btn btn-warning"
            onClick={() => onNavigateTab('map')}
          >
            <span>Simulate What-If</span>
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
              <Radio size={18} color="var(--emerald-400)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                {field?.name || "North Plot"} — Live Status
              </h3>
            </div>
            <span className="badge badge-emerald">
              {field?.crop || "Wheat"} ({field?.current_stage || "Vegetative"})
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Nitrogen</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '3px' }}>
                {field?.soil_n_mg_kg || 154} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>mg/kg</span>
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--amber-400)' }}>Deficit (-26 mg/kg)</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Soil pH</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '3px' }}>
                {field?.soil_ph || 7.2}
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--emerald-400)' }}>Optimal (6.0 - 7.5)</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Canopy Cover</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '3px' }}>
                {field?.canopy_cover_pct || 68}%
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--emerald-400)' }}>High Biomass</span>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Smart Drip Valve</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '3px' }}>
                {field?.pump_status || "STANDBY"}
              </p>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Valve ID: {field?.valve_id || "VALVE-N1-01"}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Pest Flag: <strong style={{ color: 'var(--rose-500)' }}>{field?.active_pest_status || "Yellow Rust Spores"}</strong>
            </span>
            <button 
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => onNavigateTab('pest-vision')}
            >
              <span>Scan Leaf Imagery</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Autonomous Orchestrated Action Plan */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--amber-400)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                Autonomous Execution Plan ({stepData?.step_6_operations_plan?.plan_id || 'PLAN-AUTO'})
              </h3>
            </div>
            <span className="badge badge-amber">
              {stepData?.step_6_operations_plan?.urgency || 'High Priority'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {(stepData?.step_6_operations_plan?.action_items || []).slice(0, 3).map((act, i) => (
              <div key={i} style={{ 
                background: 'rgba(255, 255, 255, 0.025)', 
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
                    <strong style={{ fontSize: '0.86rem', color: '#fff' }}>
                      {act.command} ({act.target_device})
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {act.description}
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
              SMS Advisory sent in <strong>हिन्दी</strong> via Twilio Simulator
            </span>
            <button 
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => onNavigateTab('omnichannel')}
            >
              <span>View Omnichannel Inbox</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
