import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Plus } from 'lucide-react';

export default function HomeView({ onOpenCreateChallenge }) {
  const { currentRole, setActiveTab, setSelectedChallengeId } = useApp();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/challenges')
      .then(res => res.json())
      .then(data => {
        setChallenges(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <span className="status-pill status-pill-open">Open</span>;
      case 'Evaluation':
        return <span className="status-pill status-pill-review">Evaluation</span>;
      case 'Pilot':
        return <span className="status-pill status-pill-open">Pilot</span>;
      case 'Procurement Review':
        return <span className="status-pill status-pill-review">Under Review</span>;
      case 'Scaled':
        return <span className="status-pill status-pill-success">Scaled</span>;
      default:
        return <span className="status-pill status-pill-draft">{status}</span>;
    }
  };

  const recentActivities = [
    {
      startup: 'WaterSense',
      challenge: 'Water Leakage Detection',
      stage: 'Pilot completed',
      time: '2 hours ago'
    },
    {
      startup: 'EcoTrack',
      challenge: 'Municipal Solid Waste Monitoring',
      stage: 'New application received',
      time: 'Yesterday'
    },
    {
      startup: 'CivicLens',
      challenge: 'Automated Pothole Detection',
      stage: 'Evaluation submitted',
      time: '3 days ago'
    },
    {
      startup: 'AquaTech',
      challenge: 'Industrial Effluent Monitoring',
      stage: 'Challenge published',
      time: '4 days ago'
    }
  ];

  return (
    <div className="page-container">
      {/* Greeting Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 className="page-title">{currentRole.greeting}</h1>
        <p className="page-desc">
          You have {currentRole.pendingTasks?.length || 3} items that need your attention.
        </p>
      </div>

      {/* Action Required Items */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentRole.pendingTasks?.map((task, idx) => (
            <div key={task.id || idx} className="action-required-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.86rem', color: '#64748B', fontWeight: 600 }}>
                  {idx + 1}.
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#0F172A' }}>
                  {task.label}
                </span>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setActiveTab(task.targetTab)}
              >
                <span>{task.btnText}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>
          Recent activity
        </h2>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '4px 18px' }}>
          {recentActivities.map((act, index) => (
            <div key={index} className="activity-row">
              <div>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{act.startup}</span>
                <span style={{ color: '#94A3B8', margin: '0 8px' }}>•</span>
                <span style={{ color: '#475569' }}>{act.challenge}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: '#64748B' }}>{act.stage}</span>
                <span style={{ color: '#94A3B8', fontSize: '0.78rem' }}>{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Activity Table */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A' }}>
            Current activity
          </h2>

          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenCreateChallenge}
          >
            <Plus size={14} />
            <span>Create Challenge</span>
          </button>
        </div>

        <div className="table-container">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Challenge</th>
                  <th>Department</th>
                  <th>Applications</th>
                  <th>Current Stage</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{c.title}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{c.required_technology}</div>
                    </td>
                    <td>{c.department}</td>
                    <td>{c.applications_count}</td>
                    <td>{c.stage}</td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedChallengeId(c.id);
                          if (c.status === 'Open') setActiveTab('applications');
                          else if (c.status === 'Evaluation') setActiveTab('evaluations');
                          else if (c.status === 'Pilot') setActiveTab('pilots');
                          else if (c.status === 'Procurement Review') setActiveTab('procurement');
                          else if (c.status === 'Scaled') setActiveTab('scale');
                          else setActiveTab('challenges');
                        }}
                      >
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
