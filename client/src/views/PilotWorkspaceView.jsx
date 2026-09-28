import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Check } from 'lucide-react';

export default function PilotWorkspaceView() {
  const { setActiveTab, showToast } = useApp();
  const [pilots, setPilots] = useState([]);
  const [selectedPilotId, setSelectedPilotId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pilots');
      if (res.ok) {
        const data = await res.json();
        setPilots(data);
        if (data.length > 0 && !selectedPilotId) {
          setSelectedPilotId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMilestone = async (pilotId, milestoneNumber, newStatus) => {
    try {
      const res = await fetch(`/api/pilots/${pilotId}/milestone`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneNumber, status: newStatus })
      });

      if (res.ok) {
        showToast("Milestone updated.");
        fetchPilots();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentPilot = pilots.find(p => p.id === selectedPilotId) || pilots[0];

  const milestonesList = currentPilot ? [
    { num: 1, title: currentPilot.milestone1_title || 'Initial Deployment', dueDate: 'Month 1', status: currentPilot.milestone1_status },
    { num: 2, title: currentPilot.milestone2_title || 'Acoustic Testing', dueDate: 'Month 2', status: currentPilot.milestone2_status },
    { num: 3, title: currentPilot.milestone3_title || 'Performance Validation', dueDate: 'Month 3', status: currentPilot.milestone3_status },
    { num: 4, title: currentPilot.milestone4_title || 'Final Review & Audit', dueDate: 'Month 3 End', status: currentPilot.milestone4_status }
  ] : [];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Pilots</h1>
          <p className="page-desc">
            Track pilot milestones and field deployment progress.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('performance')}
        >
          <span>View Performance</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Pilots Summary Table */}
      <div className="table-container" style={{ marginBottom: '24px' }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Startup</th>
                <th>Challenge</th>
                <th>Start Date</th>
                <th>Progress</th>
                <th>KPI Target</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pilots.map((p) => {
                const isSelected = p.id === (currentPilot ? currentPilot.id : null);
                return (
                  <tr
                    key={p.id}
                    style={{ background: isSelected ? '#F8FAFC' : 'transparent' }}
                  >
                    <td>
                      <strong style={{ color: '#0F172A' }}>{p.startup_name}</strong>
                    </td>
                    <td>{p.challenge_title}</td>
                    <td>{p.start_date || 'Aug 01, 2026'}</td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{p.milestones_completed || 3} of 4</span> milestones
                    </td>
                    <td>{p.kpi_achieved || '94.2% accuracy'}</td>
                    <td>
                      <span className={`status-pill ${p.status === 'Completed' ? 'status-pill-success' : 'status-pill-open'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedPilotId(p.id)}
                      >
                        <span>{isSelected ? 'Active' : 'Open Workspace'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Pilot Workspace */}
      {currentPilot && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                Pilot Workspace
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                Pilot: {currentPilot.challenge_title}
              </h2>
              <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '2px' }}>
                Startup: <strong>{currentPilot.startup_name}</strong> • Department: {currentPilot.department || 'Public Works Department'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="status-pill status-pill-open" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                Status: {currentPilot.status}
              </span>
            </div>
          </div>

          {/* Simple Process Timeline: Pilot Started → Deployment → Testing → Validation → Decision */}
          <div style={{ marginBottom: '24px', background: '#F8FAFC', padding: '14px 18px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
              Timeline
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                <span>Pilot Started</span>
              </div>
              <span style={{ color: '#CBD5E1' }}>→</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                <span>Deployment</span>
              </div>
              <span style={{ color: '#CBD5E1' }}>→</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                <span>Testing</span>
              </div>
              <span style={{ color: '#CBD5E1' }}>→</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB' }} />
                <span>Validation</span>
              </div>
              <span style={{ color: '#CBD5E1' }}>→</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }} />
                <span>Decision</span>
              </div>
            </div>
          </div>

          {/* Milestones List */}
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>
              Milestone Deliverables
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {milestonesList.map((m) => {
                const isCompleted = m.status === 'Completed';
                return (
                  <div
                    key={m.num}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isCompleted ? '#ECFDF5' : '#F1F5F9',
                          color: isCompleted ? '#065F46' : '#64748B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.74rem',
                          fontWeight: 600
                        }}
                      >
                        {isCompleted ? <Check size={13} /> : m.num}
                      </div>

                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0F172A' }}>
                          {m.title}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                          Due: {m.dueDate}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`status-pill ${isCompleted ? 'status-pill-success' : 'status-pill-review'}`}>
                        {m.status}
                      </span>

                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleUpdateMilestone(
                          currentPilot.id,
                          m.num,
                          isCompleted ? 'In Progress' : 'Completed'
                        )}
                      >
                        <span>Update Status</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
