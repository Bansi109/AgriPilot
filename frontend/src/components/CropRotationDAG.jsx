import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Droplet, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function CropRotationDAG({ language = 'Hindi' }) {
  const t = translations[language] || translations.English;
  const [currentCrop, setCurrentCrop] = useState('Rice');
  const [waterBudget, setWaterBudget] = useState(450);
  const [rotationData, setRotationData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRotation = async (crop, budget) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/crop/rotation?current_crop=${crop}&water_budget_mm=${budget}`);
      const data = await res.json();
      setRotationData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRotation(currentCrop, waterBudget);
  }, [currentCrop, waterBudget]);

  const candidateCrops = [
    { key: "Rice", label: language === 'Hindi' ? "धान (Rice)" : "Rice" },
    { key: "Wheat", label: language === 'Hindi' ? "गेहूं (Wheat)" : "Wheat" },
    { key: "Chickpea", label: language === 'Hindi' ? "चना (Chickpea)" : "Chickpea" },
    { key: "Cotton", label: language === 'Hindi' ? "कपास (Cotton)" : "Cotton" },
    { key: "Potato", label: language === 'Hindi' ? "आलू (Potato)" : "Potato" },
    { key: "Tomato", label: language === 'Hindi' ? "टमाटर (Tomato)" : "Tomato" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitFork size={22} color="var(--emerald-500)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t.dag_title}
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {t.dag_sub}
            </p>
          </div>

          {/* Current Crop Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t.standing_crop}:</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {candidateCrops.map(c => (
                <button
                  key={c.key}
                  onClick={() => setCurrentCrop(c.key)}
                  className={`btn ${c.key === currentCrop ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Water budget slider */}
        <div style={{ 
          background: 'var(--bg-inner-box)', 
          padding: '14px 20px', 
          borderRadius: 'var(--radius-sm)', 
          border: '1px solid var(--border-glass)',
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Droplet size={18} color="var(--cyan-400)" />
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.water_budget_label}:
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, maxWidth: '400px' }}>
            <input 
              type="range" 
              min="200" 
              max="900" 
              step="25"
              value={waterBudget} 
              onChange={(e) => setWaterBudget(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#0284c7' }}
            />
            <strong style={{ color: 'var(--cyan-400)', minWidth: '70px', fontSize: '0.92rem' }}>
              {waterBudget} mm
            </strong>
          </div>
        </div>
      </div>

      {/* Top Successor & DAG Transition Cards */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t.dag_rankings} ({currentCrop} • {language === 'Hindi' ? `कुल: ${rotationData?.current_family}` : `Family: ${rotationData?.current_family}`})
          </h3>
          <span className="badge badge-emerald">
            {t.top_successor}: {rotationData?.top_successor}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
          {(rotationData?.recommendations || []).map((rec, i) => (
            <div 
              key={rec.crop}
              style={{
                background: rec.is_prohibited ? 'rgba(244, 63, 94, 0.05)' : (i === 0 ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-inner-box)'),
                border: rec.is_prohibited ? '1px solid rgba(244, 63, 94, 0.4)' : (i === 0 ? '2px solid var(--emerald-500)' : '1px solid var(--border-glass)'),
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {rec.crop}
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {language === 'Hindi' ? 'कुल' : 'Family'}: {rec.family} • {rec.category}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    fontFamily: 'var(--font-heading)', 
                    fontSize: '1.4rem', 
                    fontWeight: 800, 
                    color: rec.is_prohibited ? 'var(--rose-500)' : (i === 0 ? 'var(--emerald-500)' : 'var(--text-primary)') 
                  }}>
                    {rec.transition_score}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>/100 {language === 'Hindi' ? 'स्कोर' : 'Score'}</span>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', fontSize: '0.78rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{language === 'Hindi' ? 'मृदा सुधार (+35%)' : 'Soil Recovery (+35%)'}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{rec.soil_score}</strong>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{rec.soil_detail}</p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{language === 'Hindi' ? 'जल उपलब्धता (+25%)' : 'Water Feasibility (+25%)'}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{rec.water_score}</strong>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{rec.water_detail}</p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{language === 'Hindi' ? 'रोग चक्र विच्छेद (+15%)' : 'Pathogen Break (+15%)'}</span>
                    <strong style={{ color: rec.is_prohibited ? 'var(--rose-500)' : 'var(--emerald-500)' }}>
                      {rec.pathogen_score}
                    </strong>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: rec.is_prohibited ? 'var(--rose-500)' : 'var(--emerald-500)' }}>
                    {rec.pathogen_verdict}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {language === 'Hindi' ? 'अनुमानित मंडी आय: ' : 'Expected Mandi Gross: '}
                  <strong style={{ color: 'var(--text-primary)' }}>₹{rec.expected_profit_ha?.toLocaleString()}/ha</strong>
                </span>
                {rec.is_prohibited ? (
                  <span className="badge badge-rose">{language === 'Hindi' ? 'सख्त वर्जित' : 'Prohibited'}</span>
                ) : (
                  i === 0 && <span className="badge badge-emerald">{language === 'Hindi' ? 'सर्वोत्तम चयन' : 'Optimal Choice'}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Companion Intercropping & Land Equivalent Ratio (LER) Calculator */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
          {t.intercropping_title}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {(rotationData?.intercropping_options || []).map((strat, i) => (
            <div key={i} style={{ 
              background: 'var(--bg-inner-box)', 
              padding: '18px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border-glass)' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>{strat.pair}</strong>
                <span className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>
                  LER: {strat.ler}
                </span>
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--emerald-500)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                {strat.ler_advantage}
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {strat.agronomic_benefit}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reference Succession Rules Matrix Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
          {t.matrix_title}
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px' }}>{language === 'Hindi' ? 'पूर्ववर्ती फसल' : 'Predecessor Crop'}</th>
                <th style={{ padding: '10px 12px' }}>{language === 'Hindi' ? 'कटाई पश्चात मृदा स्थिति' : 'Post-Harvest Soil Condition'}</th>
                <th style={{ padding: '10px 12px' }}>{language === 'Hindi' ? 'अनुशंसित अगली फसल' : 'Recommended Successor'}</th>
                <th style={{ padding: '10px 12px' }}>{language === 'Hindi' ? 'जैविक N क्रेडिट व लक्ष्य' : 'Biological N Credit & Goal'}</th>
                <th style={{ padding: '10px 12px' }}>{language === 'Hindi' ? 'रोग चक्र प्रभाव' : 'Pathogen Disruption Effect'}</th>
              </tr>
            </thead>
            <tbody>
              {(rotationData?.succession_rules_table || []).map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{row.predecessor}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{row.post_soil}</td>
                  <td style={{ padding: '12px', color: 'var(--emerald-500)', fontWeight: 700 }}>{row.successors.join(' / ')}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                    <strong>{row.goal}</strong>
                    <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)' }}>{row.n_credit_kg_ha}</span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{row.pathogen_disruption}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
