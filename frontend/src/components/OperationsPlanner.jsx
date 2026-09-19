import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Tractor, 
  CloudRain, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Plus,
  Play
} from 'lucide-react';

export default function OperationsPlanner() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replanMsg, setReplanMsg] = useState(null);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/operations/schedule');
      const data = await res.json();
      setSchedule(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleSimulateRainReplan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/operations/replan-rain?rain_mm=22.0', { method: 'POST' });
      const data = await res.json();
      setReplanMsg(data);
      fetchSchedule();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={22} color="var(--emerald-400)" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Autonomous Farm Operations Planner (Module 6.4.10)
              </h2>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Translates multi-agent intelligence into daily and weekly executable resource-constrained schedules.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleSimulateRainReplan} 
              disabled={loading}
              className="btn btn-warning"
              style={{ fontSize: '0.82rem' }}
            >
              <CloudRain size={16} />
              <span>Simulate Rain Disruption Re-Plan</span>
            </button>
            <button 
              onClick={fetchSchedule} 
              disabled={loading}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <RefreshCw size={14} className={loading ? 'spin-icon' : ''} />
              <span>Refresh Schedule</span>
            </button>
          </div>
        </div>

        {/* Replan Notification */}
        {replanMsg && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid var(--amber-400)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 18px',
            marginTop: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <AlertTriangle size={18} color="var(--amber-400)" />
              <strong style={{ color: 'var(--amber-400)', fontSize: '0.92rem' }}>
                Weather Disruption Detected: {replanMsg.trigger_rainfall_mm}mm Rain
              </strong>
            </div>
            <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {replanMsg.replan_summary.map((line, idx) => (
                <li key={idx}>• {line}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Schedule Table & Cards */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
          Weekly Executable Farm Schedule
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {schedule.map((task) => {
            const isCritical = task.priority === 'Critical';
            const isHigh = task.priority === 'High';
            const isRescheduled = task.status.includes('Rescheduled') || task.status.includes('Postponed');

            return (
              <div 
                key={task.task_id}
                style={{
                  background: isRescheduled ? 'rgba(245, 158, 11, 0.05)' : 'rgba(255, 255, 255, 0.025)',
                  border: isRescheduled ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '10px', 
                    background: isCritical ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.15)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Calendar size={18} color={isCritical ? 'var(--rose-500)' : 'var(--emerald-400)'} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span className={`badge ${isCritical ? 'badge-rose' : (isHigh ? 'badge-amber' : 'badge-emerald')}`} style={{ fontSize: '0.68rem' }}>
                        {task.priority} Priority
                      </span>
                      <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                        {task.category}
                      </span>
                      <strong style={{ fontSize: '0.94rem', color: '#fff' }}>
                        {task.title}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} /> {task.scheduled_date} ({task.time_slot})
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={13} /> {task.assigned_worker}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Tractor size={13} /> {task.assigned_equipment}
                      </span>
                    </div>

                    {task.fertilizer_dosage && task.fertilizer_dosage !== 'None' && (
                      <span style={{ fontSize: '0.76rem', color: 'var(--emerald-400)', display: 'block', marginTop: '4px' }}>
                        Input Recipe: {task.fertilizer_dosage}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`badge ${isRescheduled ? 'badge-amber' : 'badge-emerald'}`}>
                    {task.status}
                  </span>
                  <button 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                    onClick={() => alert(`Task ${task.task_id} marked complete.`)}
                  >
                    <CheckCircle2 size={14} />
                    <span>Done</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
