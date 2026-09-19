import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Wind, 
  CloudRain, 
  Thermometer, 
  Clock, 
  ShieldCheck, 
  ShieldAlert,
  Sparkles,
  Camera
} from 'lucide-react';

export default function PestVisionLab({ weatherData }) {
  const [selectedPreset, setSelectedPreset] = useState('Yellow_Rust');
  const [visionResult, setVisionResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const presets = [
    { key: 'Yellow_Rust', label: 'Yellow / Stripe Rust', crop: 'Wheat', icon: '🌾' },
    { key: 'Early_Blight', label: 'Early Blight (Alternaria)', crop: 'Tomato', icon: '🍅' },
    { key: 'Late_Blight', label: 'Late Blight (Phytophthora)', crop: 'Potato', icon: '🥔' },
    { key: 'Powdery_Mildew', label: 'Powdery Mildew', crop: 'Chickpea', icon: '🌱' },
    { key: 'Fall_Armyworm', label: 'Fall Armyworm (FAW)', crop: 'Maize', icon: '🌽' },
    { key: 'Healthy', label: 'Healthy Green Foliage', crop: 'All Crops', icon: '✨' }
  ];

  const runAnalysis = async (presetKey, fileObj = null) => {
    setAnalyzing(true);
    try {
      const formData = new FormData();
      if (fileObj) {
        formData.append('file', fileObj);
      } else {
        formData.append('preset_pathology', presetKey || selectedPreset);
      }
      formData.append('crop', 'Wheat');
      formData.append('ambient_temp_c', weatherData?.current?.temperature_c || 24.5);
      formData.append('ambient_rh_pct', weatherData?.current?.humidity_percent || 78.0);
      formData.append('wind_speed_kmh', weatherData?.current?.wind_speed_kmh || 8.4);
      formData.append('rain_next_6h_mm', weatherData?.current?.precipitation_current_mm || 0.0);
      formData.append('days_until_harvest', 35);

      const res = await fetch('/api/pest/analyze', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setVisionResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis(selectedPreset);
  }, [selectedPreset]);

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      runAnalysis(null, file);
    }
  };

  const solver = visionResult?.spray_window_solver;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bug size={22} color="var(--rose-500)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Vision-Based Pest Outbreak Early Containment & Spray Solver (Module 6.4.4)
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Drone and smartphone leaf computer vision detection with micro-climate infection risk correlation.
            </p>
          </div>

          {/* Upload Button */}
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <Camera size={16} />
            <span>Upload Leaf Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Preset pathology quick-selector */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
            Test Sample Feeds:
          </span>
          {presets.map(p => (
            <button
              key={p.key}
              onClick={() => { setUploadedFile(null); setSelectedPreset(p.key); }}
              className={`btn ${selectedPreset === p.key && !uploadedFile ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis View: Image Inspection + Spray Constraints */}
      <div className="grid-cols-2">
        
        {/* Left: Annotated Vision Canvas & Diagnostic Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Leaf Pathology Inspection
            </h3>
            {visionResult && (
              <span className={`badge ${visionResult.diagnosis_key === 'Healthy' ? 'badge-emerald' : 'badge-rose'}`}>
                {visionResult.severity_tier}
              </span>
            )}
          </div>

          {/* Image Display */}
          <div style={{ 
            height: '340px', 
            background: 'rgba(10, 15, 29, 0.9)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-glass)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: '16px'
          }}>
            {visionResult?.annotated_image_base64 ? (
              <img 
                src={visionResult.annotated_image_base64} 
                alt="Pathology Inspection" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>Loading Vision Stream...</span>
            )}

            {analyzing && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="badge badge-emerald">Segmenting Micro-Lesions...</span>
              </div>
            )}
          </div>

          {/* Diagnostic Details */}
          {visionResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  {visionResult.diagnosis}
                </span>
                <span className="badge badge-cyan">
                  Confidence: {Math.round(visionResult.confidence_score * 100)}%
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {visionResult.symptoms}
              </p>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                <strong style={{ color: 'var(--emerald-400)' }}>Chemical Rx:</strong> {visionResult.recommended_treatment}
                <br />
                <strong style={{ color: 'var(--lime-400)', marginTop: '4px', display: 'inline-block' }}>Organic / Bio-control:</strong> {visionResult.organic_treatment}
              </div>
            </div>
          )}
        </div>

        {/* Right: Spray Window Constraint Solver & Micro-Climate Infection Meter */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              Precision Spray Window Solver
            </h3>
            {solver && (
              <span className={`badge ${solver.can_spray_now ? 'badge-emerald' : 'badge-rose'}`}>
                {solver.can_spray_now ? 'Window Approved' : 'Spray On Hold'}
              </span>
            )}
          </div>

          {/* Infection Risk Meter */}
          {visionResult && (
            <div style={{ 
              background: 'rgba(0, 0, 0, 0.25)', 
              padding: '14px 18px', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '18px',
              border: '1px solid var(--border-glass)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Micro-Climate Infection Risk (RH + Temp):
                </span>
                <strong style={{ fontSize: '0.92rem', color: visionResult.infection_risk_index > 65 ? 'var(--rose-500)' : 'var(--emerald-400)' }}>
                  {visionResult.infection_risk_index}/100 ({visionResult.risk_verdict})
                </strong>
              </div>

              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${visionResult.infection_risk_index}%`, 
                  height: '100%', 
                  background: visionResult.infection_risk_index > 65 ? 'var(--rose-500)' : 'var(--emerald-400)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {/* Mathematical Constraints Checklist */}
          {solver && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.86rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Safety & Residue Constraints
              </h4>

              {solver.constraints.map((c, i) => (
                <div 
                  key={i}
                  style={{
                    background: c.passed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                    border: `1px solid ${c.passed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.3)'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {c.passed ? <ShieldCheck size={16} color="var(--emerald-400)" /> : <ShieldAlert size={16} color="var(--rose-500)" />}
                      <strong style={{ fontSize: '0.86rem', color: '#fff' }}>{c.name}</strong>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: c.passed ? 'var(--emerald-400)' : 'var(--rose-500)', fontWeight: 600 }}>
                      {c.measured} (Req: {c.threshold})
                    </span>
                  </div>
                  {!c.passed && (
                    <p style={{ fontSize: '0.76rem', color: 'var(--rose-500)', marginTop: '4px' }}>
                      Violation: {c.reason_if_failed}
                    </p>
                  )}
                </div>
              ))}

              {/* Recommended Window Banner */}
              <div style={{ 
                marginTop: '12px', 
                background: solver.can_spray_now ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                border: `1px solid ${solver.can_spray_now ? 'var(--emerald-400)' : 'var(--amber-400)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px'
              }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Recommended Action Window
                </span>
                <p style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                  {solver.recommended_time_slot}
                </p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                  Statutory Pre-Harvest Interval (PHI): <strong>{solver.phi_days_required} days</strong> (Remaining to harvest: {solver.days_to_harvest} days)
                </span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
