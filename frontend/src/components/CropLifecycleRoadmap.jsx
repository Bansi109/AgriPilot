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
import { translations } from '../i18n/translations';

export default function CropLifecycleRoadmap({ field, language = 'Hindi' }) {
  const t = translations[language] || translations.English;
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

  const cropLabels = {
    Wheat: language === 'Hindi' ? 'गेहूं (Wheat)' : 'Wheat',
    Chickpea: language === 'Hindi' ? 'चना (Chickpea)' : 'Chickpea',
    Cotton: language === 'Hindi' ? 'कपास (Cotton)' : 'Cotton',
    Maize: language === 'Hindi' ? 'मक्का (Maize)' : 'Maize',
    Groundnut: language === 'Hindi' ? 'मूंगफली (Groundnut)' : 'Groundnut'
  };

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
              <Sprout size={20} color="var(--emerald-500)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t.lifecycle_title}
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {t.lifecycle_sub}
            </p>
          </div>

          {/* Dynamic Crop Switching Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginRight: '4px', fontWeight: 700 }}>
              {t.switch_crop}:
            </span>
            {(lifecycleData?.available_crops_for_switching || ['Wheat', 'Chickpea', 'Cotton', 'Maize', 'Groundnut']).map(c => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`btn ${c === selectedCrop ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.82rem', padding: '6px 14px' }}
              >
                <span>{cropIcons[c] || '🌱'}</span>
                <span>{cropLabels[c] || c}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Core Progress Bar */}
        {lifecycleData && (
          <div style={{ 
            background: 'var(--bg-inner-box)', 
            padding: '16px 20px', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                {t.lifecycle_progress}: <strong>{language === 'Hindi' ? `दिन ${lifecycleData.days_after_sowing}` : `Day ${lifecycleData.days_after_sowing}`}</strong> / {lifecycleData.total_crop_duration_days} {language === 'Hindi' ? 'दिन' : 'days'}
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
                {lifecycleData.growth_progress_percentage}% {language === 'Hindi' ? 'पूर्ण' : 'Completed'} • {lifecycleData.days_until_harvest} {t.days_to_harvest}
              </span>
            </div>

            {/* Custom Glowing Progress Bar */}
            <div style={{ 
              width: '100%', 
              height: '10px', 
              background: 'var(--bg-surface-elevated)', 
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${lifecycleData.growth_progress_percentage}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #10b981, #059669)',
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
          <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--emerald-500)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.q1_title}
            </span>
            <p style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {language === 'Hindi' 
                ? `चरण 2: वनस्पति विकास एवं शाखाएं (दिन ${lifecycleData.days_after_sowing} / ${lifecycleData.total_crop_duration_days})`
                : lifecycleData.core_question_answers.what_stage_am_i_in}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--amber-500)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.q2_title}
            </span>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--amber-500)', marginTop: '4px' }}>
              {language === 'Hindi'
                ? "नाइट्रोजन की पहली टॉप-ड्रेसिंग (यूरिया 65 किग्रा/हेक्टेयर) और पीला रतुआ रोग की नियमित जांच करें।"
                : lifecycleData.core_question_answers.what_should_i_do_now}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--cyan-400)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.q3_title}
            </span>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {language === 'Hindi'
                ? "झंडा पत्ती (Flag Leaf) निकलने वाली है। सूक्ष्म पोषक तत्व (जिंक व बोरॉन) के छिड़काव की तैयारी रखें।"
                : lifecycleData.core_question_answers.what_should_i_prepare_for_next}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '16px 18px', borderLeft: '4px solid var(--purple-400)' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              {t.q4_title}
            </span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
              {language === 'Hindi'
                ? "यदि बारिश होती है तो सिंचाई अपने-आप रुक जाती है, और कीट का प्रकोप होने पर तत्काल स्प्रे कार्य योजना में जुड़ जाता है।"
                : lifecycleData.core_question_answers.how_does_plan_adapt}
            </p>
          </div>
        </div>
      )}

      {/* Month-Wise & Growth Stage-Wise Farming Roadmap */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px', color: 'var(--text-primary)' }}>
          {t.stage_roadmap} ({cropLabels[selectedCrop] || selectedCrop})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(lifecycleData?.all_stages || []).map((stage) => {
            const isCurrent = stage.stage_id === lifecycleData?.current_stage?.stage_id;
            const isPast = stage.days_range[1] < (lifecycleData?.days_after_sowing || 0);

            return (
              <div 
                key={stage.stage_id}
                style={{
                  background: isCurrent ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-inner-box)',
                  border: isCurrent ? '2px solid var(--emerald-500)' : '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  boxShadow: isCurrent ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '34px', 
                      height: '34px', 
                      borderRadius: '50%', 
                      background: isCurrent ? 'var(--emerald-500)' : (isPast ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface-elevated)'),
                      color: isCurrent ? '#fff' : (isPast ? 'var(--emerald-500)' : 'var(--text-muted)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      {stage.stage_id}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: isCurrent ? 'var(--emerald-500)' : 'var(--text-primary)' }}>
                        {stage.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {language === 'Hindi' ? `दिन ${stage.days_range[0]} से ${stage.days_range[1]}` : `Day ${stage.days_range[0]} to Day ${stage.days_range[1]}`} • {language === 'Hindi' ? `जल आवश्यकता: ${stage.water_req_mm} mm` : `Water Budget: ${stage.water_req_mm} mm`}
                      </span>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="badge badge-emerald">
                      {t.active_stage}
                    </span>
                  ) : (
                    isPast ? (
                      <span className="badge" style={{ background: 'rgba(100, 116, 139, 0.15)', color: 'var(--text-muted)' }}>
                        {language === 'Hindi' ? 'पूर्ण' : 'Completed'}
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(100, 116, 139, 0.1)', color: 'var(--text-muted)' }}>
                        {language === 'Hindi' ? 'आगामी' : 'Upcoming'}
                      </span>
                    )
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginTop: '12px' }}>
                  {/* Focus & Monitoring */}
                  <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      {t.field_focus}
                    </span>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                      {stage.monitoring_focus}
                    </p>
                    <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--rose-500)' }}>
                      <strong>{language === 'Hindi' ? 'संवेदनशील जोखिम:' : 'Critical Risk:'}</strong> {stage.critical_vulnerability}
                    </div>
                  </div>

                  {/* Tasks Checklist */}
                  <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      {t.care_tasks}
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {stage.tasks_now.map((task, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                          <CheckCircle2 size={14} color="var(--emerald-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
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
