import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  Wrench, 
  RefreshCw, 
  FileText,
  Send
} from 'lucide-react';

export default function CrisisCenter() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [notes, setNotes] = useState('');

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crisis/incidents');
      const data = await res.json();
      setIncidents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleResolveIncident = async (incidentId, newStatus) => {
    try {
      await fetch('/api/crisis/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: incidentId,
          resolution_status: newStatus,
          agronomist_notes: notes || "Resolved via rapid crisis mitigation workflow."
        })
      });
      setNotes('');
      fetchIncidents();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={22} color="var(--rose-500)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Farm Crisis Response & Incident Management (Module 6.4.9)
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Rapid anomaly detection, structured emergency classification, and agronomist escalation workflows.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="badge badge-rose">
              {incidents.filter(i => i.resolution_status !== 'Resolved').length} Open Incidents
            </span>
            <button 
              onClick={fetchIncidents} 
              disabled={loading}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
              <span>Refresh Incidents</span>
            </button>
          </div>
        </div>
      </div>

      {/* Incidents Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {incidents.map((inc) => {
          const isCritical = inc.severity === 'Critical';
          const isHigh = inc.severity === 'High';
          const isResolved = inc.resolution_status === 'Resolved';

          return (
            <div 
              key={inc.incident_id}
              className="glass-panel"
              style={{
                padding: '22px',
                borderLeft: `5px solid ${isCritical ? 'var(--rose-500)' : (isHigh ? 'var(--amber-400)' : 'var(--emerald-400)')}`,
                background: isResolved ? 'rgba(15, 23, 42, 0.4)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {inc.incident_id}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                    {inc.type}
                  </h3>
                  <span className={`badge ${isCritical ? 'badge-rose' : (isHigh ? 'badge-amber' : 'badge-emerald')}`}>
                    {inc.severity} Severity
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-purple">
                    {inc.escalation_status}
                  </span>
                  <span className={`badge ${isResolved ? 'badge-emerald' : 'badge-amber'}`}>
                    {inc.resolution_status}
                  </span>
                </div>
              </div>

              {/* Details & Telemetry */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Affected: <strong style={{ color: '#fff' }}>{inc.affected_field_name}</strong></span>
                  <span>Detected: {inc.detected_at}</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: isCritical ? 'var(--rose-500)' : 'var(--amber-400)', fontWeight: 600 }}>
                  Trigger Condition: {inc.trigger_condition}
                </p>
              </div>

              {/* Recommended Actions */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Recommended Rapid Mitigation Protocol:
                </span>
                <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {inc.recommended_actions.map((act, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={14} color="var(--emerald-400)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assigned Resources & Resolution Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '14px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} /> Assigned: <strong>{inc.assigned_worker}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Wrench size={13} /> Tool: <strong>{inc.assigned_equipment}</strong>
                  </span>
                </div>

                {!isResolved && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Add agronomist sign-off note..."
                      className="input-control"
                      style={{ padding: '5px 10px', fontSize: '0.8rem', width: '220px' }}
                      value={selectedIncident === inc.incident_id ? notes : ''}
                      onChange={(e) => { setSelectedIncident(inc.incident_id); setNotes(e.target.value); }}
                    />
                    <button 
                      className="btn btn-primary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                      onClick={() => handleResolveIncident(inc.incident_id, 'Resolved')}
                    >
                      <CheckCircle2 size={14} />
                      <span>Sign & Resolve</span>
                    </button>
                  </div>
                )}
              </div>

              {inc.agronomist_notes && (
                <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Log Note: {inc.agronomist_notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
