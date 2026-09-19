import React, { useState } from 'react';
import { 
  Globe, 
  Droplet, 
  CloudRain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Play,
  ArrowRight,
  ShieldAlert,
  Zap,
  DollarSign
} from 'lucide-react';

export default function DigitalTwinMap({ 
  fields, 
  selectedFieldId, 
  onSelectField 
}) {
  const [scenarioType, setScenarioType] = useState('irrigation');
  const [incomingRain, setIncomingRain] = useState(18.0);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  const activeField = fields.find(f => f.field_id === selectedFieldId) || fields[0];

  const handleRunSimulation = async (sType) => {
    setSimLoading(true);
    try {
      const res = await fetch('/api/twin/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_id: activeField.field_id,
          scenario_type: sType || scenarioType,
          incoming_rain_mm_72h: incomingRain
        })
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSimLoading(false);
    }
  };

  React.useEffect(() => {
    handleRunSimulation(scenarioType);
  }, [selectedFieldId, scenarioType, incomingRain]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & GIS Plot Layout */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={20} color="var(--emerald-400)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Farm Digital Twin & Multi-Plot GIS Layout (Module 6.4.7)
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Virtual representation of farm topology, soil hydration zones, and smart solenoid nodes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {fields.map(f => (
              <button
                key={f.field_id}
                onClick={() => onSelectField(f.field_id)}
                className={`btn ${f.field_id === activeField.field_id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              >
                {f.name.split('—')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Plot Heatmap Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '18px' }}>
          {fields.map(f => {
            const isSelected = f.field_id === activeField.field_id;
            const moistureColor = f.soil_moisture_pct > 60 ? 'var(--cyan-400)' : (f.soil_moisture_pct > 40 ? 'var(--emerald-400)' : 'var(--amber-400)');
            
            return (
              <div 
                key={f.field_id}
                onClick={() => onSelectField(f.field_id)}
                style={{
                  background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '2px solid var(--emerald-400)' : '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.96rem' }}>
                    {f.name}
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                    {f.crop} ({f.variety.split(' ')[0]})
                  </span>
                </div>

                {/* SVG Visual Field Contour / Moisture Heatmap */}
                <div style={{ 
                  height: '110px', 
                  background: 'rgba(10, 15, 29, 0.8)', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  {/* Grid Lines */}
                  <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.25 }}>
                    <defs>
                      <pattern id={`grid-${f.field_id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#fff" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#grid-${f.field_id})`} />
                  </svg>

                  {/* Heatmap Contour Blob */}
                  <div style={{
                    width: `${f.soil_moisture_pct * 1.8}px`,
                    height: `${f.soil_moisture_pct * 1.1}px`,
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    background: `radial-gradient(circle, ${moistureColor} 0%, rgba(16, 185, 129, 0.05) 75%)`,
                    filter: 'blur(14px)',
                    opacity: 0.7
                  }} />

                  {/* Solenoid Node Icon */}
                  <div style={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    zIndex: 2
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: f.pump_status === 'OPEN' ? 'var(--emerald-500)' : 'rgba(30, 41, 59, 0.9)',
                      border: '2px solid #fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                    }}>
                      <Droplet size={14} color="#fff" />
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '1px 6px', borderRadius: '4px' }}>
                      {f.valve_id}
                    </span>
                  </div>
                </div>

                {/* Metrics Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Moisture</span>
                    <p style={{ fontWeight: 700, color: moistureColor, fontSize: '0.95rem' }}>{f.soil_moisture_pct}%</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Nitrogen</span>
                    <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{f.soil_n_mg_kg} <span style={{ fontSize: '0.65rem' }}>mg/kg</span></p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Area</span>
                    <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{f.area_ha} <span style={{ fontSize: '0.65rem' }}>ha</span></p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What-If Simulation Studio */}
      <div className="glass-panel glass-panel-glow" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={20} color="var(--amber-400)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                What-If Simulation Studio: Decision Engine
              </h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Evaluate and stress-test agricultural alternatives before committing physical resources or dispatching IoT valves.
            </p>
          </div>

          {/* Scenario Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setScenarioType('irrigation')}
              className={`btn ${scenarioType === 'irrigation' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.82rem' }}
            >
              <CloudRain size={15} />
              <span>Irrigate Now vs Delay Rain</span>
            </button>
            <button
              onClick={() => setScenarioType('fertigation')}
              className={`btn ${scenarioType === 'fertigation' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.82rem' }}
            >
              <Droplet size={15} />
              <span>Broadcast vs Precision Drip NPK</span>
            </button>
            <button
              onClick={() => setScenarioType('harvest')}
              className={`btn ${scenarioType === 'harvest' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.82rem' }}
            >
              <DollarSign size={15} />
              <span>Early Harvest vs Peak Mandi</span>
            </button>
          </div>
        </div>

        {/* Rain Forecast Slider if Irrigation Scenario */}
        {scenarioType === 'irrigation' && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.025)', 
            padding: '14px 20px', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-glass)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CloudRain size={20} color="var(--cyan-400)" />
              <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                Simulate 72-Hour Incoming Rain Volume:
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, maxWidth: '450px' }}>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="1"
                value={incomingRain} 
                onChange={(e) => setIncomingRain(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--cyan-400)' }}
              />
              <span style={{ fontWeight: 700, color: 'var(--cyan-400)', minWidth: '70px', fontSize: '0.95rem' }}>
                {incomingRain.toFixed(1)} mm
              </span>
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison Cards */}
        {simulationResult && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              
              {/* Option A Card */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                position: 'relative'
              }}>
                <span className="badge badge-rose" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  Conventional / Reactive
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: '#fff' }}>
                  {simulationResult.option_a.label}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Water Consumption</span>
                    <strong style={{ fontSize: '0.88rem', color: '#fff' }}>
                      {simulationResult.option_a.water_consumed_liters?.toLocaleString()} Liters
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Operational Cost</span>
                    <strong style={{ fontSize: '0.88rem', color: '#fff' }}>
                      ₹{simulationResult.option_a.operational_cost_inr?.toLocaleString()}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Projected Soil Moisture</span>
                    <strong style={{ fontSize: '0.88rem', color: simulationResult.option_a.projected_soil_moisture_pct > 85 ? 'var(--rose-500)' : '#fff' }}>
                      {simulationResult.option_a.projected_soil_moisture_pct}%
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Risk Index</span>
                    <span className={`badge ${simulationResult.option_a.risk_index > 50 ? 'badge-rose' : 'badge-amber'}`}>
                      {simulationResult.option_a.risk_index}/100 Risk
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--rose-500)', lineHeight: 1.4, background: 'rgba(244, 63, 94, 0.08)', padding: '10px', borderRadius: '6px' }}>
                  ⚠️ {simulationResult.option_a.risk_notes}
                </p>
              </div>

              {/* Option B Card (AI Recommended) */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '2px solid var(--emerald-400)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                position: 'relative',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)'
              }}>
                <span className="badge badge-emerald" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  ⭐ AI Autonomous Choice
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: 'var(--emerald-400)' }}>
                  {simulationResult.option_b.label}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Water Consumption</span>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--emerald-400)' }}>
                      {simulationResult.option_b.water_consumed_liters?.toLocaleString()} Liters (Saved {simulationResult.water_saved_liters?.toLocaleString()} L)
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Operational Cost</span>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--emerald-400)' }}>
                      ₹{simulationResult.option_b.operational_cost_inr?.toLocaleString()} (Saved ₹{simulationResult.cost_saved_inr?.toLocaleString()})
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Projected Soil Moisture</span>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--emerald-400)' }}>
                      {simulationResult.option_b.projected_soil_moisture_pct}% (Aerated Root Zone)
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Risk Index</span>
                    <span className="badge badge-emerald">
                      {simulationResult.option_b.risk_index}/100 Low Risk
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--emerald-400)', lineHeight: 1.4, background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '6px' }}>
                  ✓ {simulationResult.option_b.risk_notes}
                </p>
              </div>

            </div>

            {/* AI Decision & Agronomic Explanation Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05))',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
                  Autonomous Agent Recommendation
                </span>
                <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
                  {simulationResult.explanation}
                </p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => alert(`Applied ${simulationResult.ai_decision} to ${activeField.name}. Schedule updated.`)}
              >
                <CheckCircle2 size={16} />
                <span>Apply This Decision</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
