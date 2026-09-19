import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Brain, 
  History, 
  Sparkles, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function KnowledgeGraphView({ language }) {
  const [graphData, setGraphData] = useState(null);
  const [selectedType, setSelectedType] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const t = translations[language] || translations.English;

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge-graph');
      const data = await res.json();
      setGraphData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];
  const insights = graphData?.insights || [];

  const nodeColor = (type) => {
    switch (type) {
      case 'Field': return 'var(--emerald-400)';
      case 'Season': return 'var(--cyan-400)';
      case 'Crop': return 'var(--lime-400)';
      case 'PestEvent': return 'var(--rose-500)';
      case 'Intervention': return 'var(--amber-400)';
      case 'Outcome': return 'var(--purple-400)';
      default: return 'var(--text-primary)';
    }
  };

  const filteredNodes = selectedType === 'ALL' ? nodes : nodes.filter(n => n.type === selectedType);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={22} color="var(--purple-400)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t.kg_title}
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {t.kg_sub}
            </p>
          </div>

          {/* Node Filter */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'Field', 'Crop', 'PestEvent', 'Intervention', 'Outcome'].map(typeKey => (
              <button
                key={typeKey}
                onClick={() => setSelectedType(typeKey)}
                className={`btn ${selectedType === typeKey ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.78rem', padding: '5px 10px' }}
              >
                {typeKey}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Pill Bar */}
        {graphData?.summary && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
            <span className="badge badge-emerald">
              {graphData.summary.total_fields_tracked} {t.fields_tracked}
            </span>
            <span className="badge badge-cyan">
              {graphData.summary.seasons_recorded} {t.seasons_logged}
            </span>
            <span className="badge badge-purple">
              {graphData.summary.crops_logged} {t.crops_logged}
            </span>
            <span className="badge badge-amber">
              {t.hist_gain}: {graphData.summary.historical_yield_gain_avg}
            </span>
          </div>
        )}
      </div>

      {/* Visual Graph View & Historical Insights */}
      <div className="grid-cols-2">
        
        {/* Left: Interactive Node Map */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
            {t.graph_entities} ({filteredNodes.length} Nodes)
          </h3>

          <div style={{ 
            height: '380px', 
            background: 'var(--card-bg)', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-glass)',
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignContent: 'flex-start'
          }}>
            {filteredNodes.map(node => (
              <div 
                key={node.id}
                style={{
                  background: 'var(--bg-glass)',
                  border: `1px solid ${nodeColor(node.type)}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08)`
                }}
              >
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  background: nodeColor(node.type),
                  boxShadow: `0 0 8px ${nodeColor(node.type)}`
                }} />
                <div>
                  <strong style={{ fontSize: '0.84rem', color: 'var(--text-primary)', display: 'block' }}>
                    {node.label}
                  </strong>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Type: {node.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span>Green: Fields</span>
            <span>Lime: Crops</span>
            <span>Red: Pests</span>
            <span>Amber: Interventions</span>
            <span>Purple: Outcomes</span>
          </div>
        </div>

        {/* Right: Cross-Season Experiential Lessons */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={18} color="var(--amber-400)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.historical_lessons}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {insights.map(ins => (
              <div 
                key={ins.insight_id}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.94rem', color: 'var(--text-primary)' }}>
                    {ins.title}
                  </strong>
                  <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                    {ins.category}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
                  {ins.lesson_learned}
                </p>

                <div style={{ 
                  background: 'rgba(16, 185, 129, 0.08)', 
                  borderLeft: '3px solid var(--emerald-400)', 
                  padding: '8px 12px', 
                  borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                  fontSize: '0.78rem',
                  color: 'var(--emerald-400)'
                }}>
                  <strong>{t.actionable_rule}:</strong> {ins.actionable_rule}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
