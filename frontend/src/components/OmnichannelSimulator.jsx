import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Send, 
  RefreshCw, 
  Terminal, 
  Droplet, 
  MessageSquare, 
  UserCheck, 
  Zap 
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function OmnichannelSimulator({ language }) {
  const [logs, setLogs] = useState({ dispatch_log: [], escalation_queue: [] });
  const [loading, setLoading] = useState(false);

  const t = translations[language] || translations.English;

  // IoT Valve Controller Form State
  const [valveId, setValveId] = useState('VALVE-N1-01');
  const [valveCmd, setValveCmd] = useState('VALVE_OPEN');
  const [valveDuration, setValveDuration] = useState(30);
  const [flowRate, setFlowRate] = useState(115.0);
  const [fertChannel, setFertChannel] = useState('A');
  const [iotStatusMsg, setIotStatusMsg] = useState(null);

  // Escalation Review Note
  const [reviewNote, setReviewNote] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/omnichannel/logs');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSendIoT = async () => {
    try {
      const res = await fetch('/api/omnichannel/iot-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valve_id: valveId,
          command: valveCmd,
          duration_minutes: parseInt(valveDuration),
          flow_rate_lpm: parseFloat(flowRate),
          fertigation_channel: fertChannel
        })
      });
      const data = await res.json();
      setIotStatusMsg(data);
      fetchLogs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReviewEscalation = async (escId, approved) => {
    try {
      await fetch('/api/omnichannel/review-escalation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          escalation_id: escId,
          approved: approved,
          reviewer_name: "Dr. R. K. Verma (Senior Agronomist)",
          decision_notes: reviewNote || (approved ? "Approved as per standard agronomic protocol." : "Disapproved due to weather constraints.")
        })
      });
      setReviewNote('');
      fetchLogs();
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
              <Radio size={22} color="var(--emerald-400)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {t.omni_title}
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {t.omni_sub}
            </p>
          </div>

          <button 
            onClick={fetchLogs} 
            disabled={loading}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
            <span>{t.refresh_dispatch}</span>
          </button>
        </div>
      </div>

      {/* Grid: IoT Controller & Smartphone SMS Simulator */}
      <div className="grid-cols-2">
        
        {/* Left: Smart IoT Solenoid Valve & Pump Actuator */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Zap size={18} color="var(--amber-400)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.iot_solenoid}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  {t.target_valve_label}
                </label>
                <select 
                  className="select-control" 
                  value={valveId} 
                  onChange={(e) => setValveId(e.target.value)}
                >
                  <option value="VALVE-N1-01">VALVE-N1-01 (North Plot Wheat)</option>
                  <option value="VALVE-S2-02">VALVE-S2-02 (South Plot Chickpea)</option>
                  <option value="VALVE-E3-03">VALVE-E3-03 (East Orchard Cotton)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  {t.relay_cmd_label}
                </label>
                <select 
                  className="select-control" 
                  value={valveCmd} 
                  onChange={(e) => setValveCmd(e.target.value)}
                >
                  <option value="VALVE_OPEN">VALVE_OPEN (Pulse Irrigation)</option>
                  <option value="VALVE_CLOSE">VALVE_CLOSE (Immediate Shut-off)</option>
                  <option value="INJECT_NUTRIENT">INJECT_NUTRIENT (Fertigation Venturi)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t.duration_min}</label>
                <input 
                  type="number" 
                  className="input-control" 
                  value={valveDuration} 
                  onChange={(e) => setValveDuration(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t.target_flow}</label>
                <input 
                  type="number" 
                  className="input-control" 
                  value={flowRate} 
                  onChange={(e) => setFlowRate(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>{t.fert_channel}</label>
                <select 
                  className="select-control" 
                  value={fertChannel} 
                  onChange={(e) => setFertChannel(e.target.value)}
                >
                  <option value="A">Channel A (Urea)</option>
                  <option value="B">Channel B (SOP)</option>
                  <option value="OFF">OFF (Water Only)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleSendIoT}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '4px' }}
            >
              <Send size={16} />
              <span>{t.broadcast_mqtt}</span>
            </button>
          </div>

          {/* MQTT Live JSON Telemetry Box */}
          {iotStatusMsg && (
            <div style={{ 
              background: 'var(--card-bg)', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border-glass)',
              padding: '14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--emerald-400)', marginBottom: '6px' }}>
                <Terminal size={14} />
                <strong>{t.mqtt_dispatched}:</strong>
              </div>
              <pre style={{ margin: 0, color: 'var(--text-secondary)', overflowX: 'auto' }}>
                {JSON.stringify(iotStatusMsg.mqtt_payload, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right: Offline SMS & Voice Advisory Simulator */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} color="var(--cyan-400)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {t.offline_sms_inbox}
              </h3>
            </div>
            <span className="badge badge-cyan">
              Twilio Sim Gateway
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            {t.sms_voice_sub}
          </p>

          {/* SMS Messages Stream */}
          <div style={{ 
            height: '320px', 
            background: 'var(--card-bg)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-glass)',
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {logs.dispatch_log.filter(l => l.channel.includes('SMS') || l.channel.includes('Twilio')).map(l => (
              <div 
                key={l.dispatch_id}
                style={{
                  background: 'rgba(16, 185, 129, 0.09)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '12px 12px 12px 2px',
                  padding: '12px 14px',
                  alignSelf: 'flex-start',
                  maxWidth: '92%'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>To: {l.recipient}</span>
                  <span>{l.timestamp}</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.45, margin: 0 }}>
                  {l.message_text}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--emerald-400)' }}>✓ {l.status}</span>
                  <span style={{ color: 'var(--text-muted)' }}>Lang: {l.language}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Bottom: Agronomist Expert Escalation Desk */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="var(--purple-400)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {t.escalation_desk}
            </h3>
          </div>
          <span className="badge badge-purple">
            {logs.escalation_queue.filter(e => e.status === 'Pending Review').length} {t.awaiting_signoff}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {logs.escalation_queue.map(esc => {
            const isApproved = esc.status === 'Approved';
            return (
              <div 
                key={esc.escalation_id}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>{esc.severity}</span>
                    <strong style={{ fontSize: '0.96rem', color: 'var(--text-primary)' }}>{esc.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({esc.field} • {esc.crop})</span>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {t.proposed_ai}: <strong>{esc.proposed_action}</strong>
                  </p>
                  <span style={{ fontSize: '0.74rem', color: 'var(--cyan-400)', display: 'block', marginTop: '4px' }}>
                    {t.confidence_score}: {Math.round(esc.ai_confidence * 100)}% • Submitted: {esc.submitted_at}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isApproved ? (
                    <span className="badge badge-emerald">
                      {t.approved_by} {esc.reviewer}
                    </span>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-primary"
                        style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        onClick={() => handleReviewEscalation(esc.escalation_id, true)}
                      >
                        <CheckCircle2 size={14} />
                        <span>{t.approve_action}</span>
                      </button>
                      <button 
                        className="btn btn-danger"
                        style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                        onClick={() => handleReviewEscalation(esc.escalation_id, false)}
                      >
                        <XCircle size={14} />
                        <span>{t.reject_action}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
