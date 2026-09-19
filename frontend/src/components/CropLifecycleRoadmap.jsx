import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Droplet, 
  Bug, 
  Sun,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function CropLifecycleRoadmap({ field }) {
  const [selectedCrop, setSelectedCrop] = useState(field?.crop || 'Wheat');
  const [lifecycleData, setLifecycleData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLifecycle = async (cropName) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/crop/lifecycle?crop=${cropName}&sowing_date=${field?.sowing_date || '2026-08-05'}&soil_moisture=${field?.soil_moisture_pct || 52.4}`);
      const data = await res.json();
      setLifecycleData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLifecycle(selectedCrop);
  }, [selectedCrop, field]);

  const cropIcons = {
    Wheat: '🌾',
    Chickpea: '🌱',
    Cotton: '🌿',
    Maize: '🌽',
    Groundnut: '🥜'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner: Dynamic Crop Switcher */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sprout size={20} color="var(--emerald-400)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Crop Lifecycle & Monthly Care Intelligence (Module 6.4.6)
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Growth-stage farming roadmap dynamically updated by micro-climate telemetry and field sensing.
            </p>
          </div>

          {/* Dynamic Crop Switching Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '4px' }}>
              Switch Crop:
            </span>
            {(lifecycleData?.available_crops_for_switching || ['Wheat', 'Chickpea', 'Cotton', 'Maize', 'Groundnut']).map(c => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`btn ${c === selectedCrop ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              >
                <span>{cropIcons[c] || '🌱'}</span>
                <span>{c}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Core Progress Bar */}
        {lifecycleData && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.025)', 
            padding: '16px 20px', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                Lifecycle Progress: <strong>Day {lifecycleData.days_after_sowing}</strong> of {lifecycleData.total_crop_duration_days} days
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
                {lifecycleData.growth_progress_percentage}% Completed • {lifecycleData.days_until_harvest} Days to Harvest
              </span>
            </div>

            {/* Custom Glowing Progress Bar */}
            <div style={{ 
              width: '100%', 
              height: '10px', 
              background: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${lifecycleData.growth_progress_percentage}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, var(--emerald-500), var(--emerald-400))',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        )}
      </div>

      {/* The 4 Core Questions Banner */}
      {lifecycleData?.core_question_answers && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--emerald-400)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              1. What Stage Is My Crop In?
            </span>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
              {lifecycleData.core_question_answers.what_stage_am_i_in}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--amber-400)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              2. What Should I Do Now?
            </span>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--amber-400)', marginTop: '4px' }}>
              {lifecycleData.core_question_answers.what_should_i_do_now}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--cyan-400)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              3. What To Prepare For Next?
            </span>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>
              {lifecycleData.core_question_answers.what_should_i_prepare_for_next}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--purple-400)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              4. How Does Plan Adapt?
            </span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
              {lifecycleData.core_question_answers.how_does_plan_adapt}
            </p>
          </div>
        </div>
      )}

      {/* Month-Wise & Growth Stage-Wise Farming Roadmap */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', color: '#fff' }}>
          Stage-Wise Agronomic Care Roadmap ({selectedCrop})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(lifecycleData?.all_stages || []).map((stage, idx) => {
            const isCurrent = stage.stage_id === lifecycleData?.current_stage?.stage_id;
            const isPast = stage.days_range[1] < (lifecycleData?.days_after_sowing || 0);

            return (
              <div 
                key={stage.stage_id}
                style={{
                  background: isCurrent ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isCurrent ? '2px solid var(--emerald-400)' : '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  boxShadow: isCurrent ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      background: isCurrent ? 'var(--emerald-500)' : (isPast ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)'),
                      color: isCurrent ? '#fff' : (isPast ? 'var(--emerald-400)' : 'var(--text-muted)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {stage.stage_id}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: isCurrent ? 'var(--emerald-400)' : '#fff' }}>
                        {stage.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Day {stage.days_range[0]} to Day {stage.days_range[1]} • Water Budget: {stage.water_req_mm} mm
                      </span>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="badge badge-emerald">
                      Active Live Stage
                    </span>
                  ) : (
                    isPast ? (
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                        Completed
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>
                        Upcoming
                      </span>
                    )
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '12px' }}>
                  {/* Focus & Monitoring */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Field Monitoring Focus
                    </span>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                      {stage.monitoring_focus}
                    </p>
                    <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--rose-500)' }}>
                      <strong>Critical Risk:</strong> {stage.critical_vulnerability}
                    </div>
                  </div>

                  {/* Tasks Checklist */}
                  <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Care Plan Tasks
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {stage.tasks_now.map((task, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                          <CheckCircle2 size={14} color="var(--emerald-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
