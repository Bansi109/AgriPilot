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

  // Feed filter and status toast state
  const [feedFilter, setFeedFilter] = useState('ALL'); // 'ALL' | 'MQTT' | 'SMS'
  const [toastMsg, setToastMsg] = useState(null);

  // Custom SMS Dispatch State
  const [smsPhone, setSmsPhone] = useState('9876543210');
  const [smsText, setSmsText] = useState('AgriPilot: Field North-01 drip irrigation active for 30 mins.');
  const [smsSending, setSmsSending] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/omnichannel/logs?_t=${Date.now()}`);
      const data = await res.json();
      setLogs(data);
      setToastMsg(language === 'Hindi' ? 'डिस्पैच फीड ताज़ा हो गई!' : 'Dispatch Feed Refreshed!');
      setTimeout(() => setToastMsg(null), 2500);
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
      setFeedFilter('ALL');
      await fetchLogs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendSMS = async (e) => {
    e?.preventDefault();
    if (!smsText) return;
    setSmsSending(true);
    try {
      await fetch('/api/omnichannel/sms-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: smsPhone,
          message_en: smsText,
          message_hi: smsText,
          language_preference: language
        })
      });
      setFeedFilter('ALL');
      await fetchLogs();
    } catch (e) {
      console.error(e);
    } finally {
      setSmsSending(false);
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {toastMsg && (
              <span className="badge badge-emerald" style={{ fontSize: '0.74rem', animation: 'fadeIn 0.2s ease' }}>
                ✓ {toastMsg}
              </span>
            )}
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

        {/* Right: Dispatch Stream & Offline SMS Simulator */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} color="var(--cyan-400)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {t.offline_sms_inbox}
              </h3>
            </div>
            
            {/* Feed Filter Chips */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-glass)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              {['ALL', 'MQTT', 'SMS'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFeedFilter(f)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '3px',
                    border: 'none',
                    background: feedFilter === f ? 'var(--emerald-500)' : 'transparent',
                    color: feedFilter === f ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {f === 'ALL' ? 'All' : (f === 'MQTT' ? '⚡ MQTT' : '📱 SMS')}
                </button>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            {t.sms_voice_sub}
          </p>

          {/* Unified Dispatch Stream (MQTT + SMS) */}
          <div style={{ 
            height: '240px', 
            background: 'var(--card-bg)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-glass)',
            padding: '14px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '14px'
          }}>
            {logs.dispatch_log
              .filter(l => {
                if (feedFilter === 'MQTT') return l.channel.includes('MQTT') || l.channel.includes('IoT');
                if (feedFilter === 'SMS') return l.channel.includes('SMS') || l.channel.includes('Twilio');
                return true;
              })
              .map(l => {
                const isMqtt = l.channel.includes('MQTT') || l.channel.includes('IoT');
                return (
                  <div 
                    key={l.dispatch_id}
                    style={{
                      background: isMqtt ? 'rgba(6, 182, 212, 0.09)' : 'rgba(16, 185, 129, 0.09)',
                      border: `1px solid ${isMqtt ? 'rgba(6, 182, 212, 0.3)' : 'rgba(16, 185, 129, 0.25)'}`,
                      borderRadius: '10px',
                      padding: '10px 12px',
                      alignSelf: 'flex-start',
                      width: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span className={`badge ${isMqtt ? 'badge-cyan' : 'badge-emerald'}`} style={{ fontSize: '0.62rem' }}>
                        {isMqtt ? '⚡ MQTT Hardware Command' : '📱 Cellular SMS Alert'}
                      </span>
                      <span>{l.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.4, margin: '4px 0', fontFamily: isMqtt ? 'var(--font-mono)' : 'inherit' }}>
                      {l.message_text}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '0.7rem' }}>
                      <span>To: <strong>{l.recipient}</strong></span>
                      <span style={{ color: isMqtt ? 'var(--cyan-400)' : 'var(--emerald-400)', fontWeight: 700 }}>✓ {l.status}</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Interactive SMS Alert Form */}
          <form onSubmit={handleSendSMS} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-control"
                placeholder="Recipient Mobile (+91...)"
                value={smsPhone}
                onChange={(e) => setSmsPhone(e.target.value)}
                style={{ flex: 1, fontSize: '0.78rem' }}
              />
              <button
                type="submit"
                disabled={smsSending}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
              >
                <Send size={13} />
                <span>{smsSending ? 'Dispatching...' : 'Dispatch SMS'}</span>
              </button>
            </div>
          </form>

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
