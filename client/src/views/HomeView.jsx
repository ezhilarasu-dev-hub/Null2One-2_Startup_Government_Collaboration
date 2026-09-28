import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Plus, Target, FileCheck, FlaskConical, TrendingUp } from 'lucide-react';

export default function HomeView({ onOpenCreateChallenge }) {
  const { currentRole, setActiveTab, setSelectedChallengeId } = useApp();
  const [challenges, setChallenges] = useState([]);
  const [overviewStats, setOverviewStats] = useState({
    activeChallenges: 10,
    applicationsReceived: 20,
    pilotsRunning: 3,
    solutionsScaled: 5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/challenges').then(res => res.json()).catch(() => []),
      fetch('/api/overview').then(res => res.json()).catch(() => null)
    ]).then(([chalData, ovData]) => {
      if (Array.isArray(chalData)) setChallenges(chalData);
      if (ovData && ovData.cards) {
        setOverviewStats({
          activeChallenges: ovData.cards.activeChallenges || 10,
          applicationsReceived: ovData.cards.applicationsReceived || 20,
          pilotsRunning: ovData.cards.pilotsRunning || 3,
          solutionsScaled: ovData.cards.solutionsScaled || 5
        });
      }
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
      challenge: 'AI-Based Water Leakage Detection',
      stage: 'Ground-truth pilot benchmark verified (94.2%)',
      time: '2 hours ago'
    },
    {
      startup: 'EduVision',
      challenge: 'Automated School Attendance Verification',
      stage: 'STQC DPDP compliance clearance issued',
      time: 'Yesterday'
    },
    {
      startup: 'KrishiSheet ColdTech',
      challenge: 'Decentralized Solar Cold Storage for Perishable Crops',
      stage: 'Proposal approved for 5MT farm pilot',
      time: '2 days ago'
    },
    {
      startup: 'VanaDrishti Drones',
      challenge: 'Autonomous Forest Fire Early Warning',
      stage: 'Commercial procurement sanctioned (GFR 149)',
      time: '3 days ago'
    },
    {
      startup: 'CivicPulse Insights',
      challenge: 'Real-Time Industrial Effluent Monitoring',
      stage: 'Solution scaled across 5 departments',
      time: '4 days ago'
    },
    {
      startup: 'BhuJal Analytics',
      challenge: 'Groundwater Aquifer Depletion Telemetry',
      stage: 'Expert evaluation completed (85.5/100)',
      time: '5 days ago'
    }
  ];

  return (
    <div className="page-container">
      {/* Greeting Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">{currentRole.greeting}</h1>
        <p className="page-desc">
          Official prototype dashboard for public procurement of innovation. You have {currentRole.pendingTasks?.length || 3} items requiring administrative attention.
        </p>
      </div>

      {/* Program High-Level Stat Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '16px 20px', cursor: 'pointer' }} onClick={() => setActiveTab('challenges')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Challenges</span>
            <Target size={16} color="#0284C7" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>{overviewStats.activeChallenges}</div>
          <div style={{ fontSize: '0.74rem', color: '#16A34A', marginTop: '4px' }}>Across 8 Ministries</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', cursor: 'pointer' }} onClick={() => setActiveTab('applications')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Proposals Received</span>
            <FileCheck size={16} color="#2563EB" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>{overviewStats.applicationsReceived}</div>
          <div style={{ fontSize: '0.74rem', color: '#0284C7', marginTop: '4px' }}>DPIIT Startups Screened</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', cursor: 'pointer' }} onClick={() => setActiveTab('pilots')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Controlled Pilots</span>
            <FlaskConical size={16} color="#D97706" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>6</div>
          <div style={{ fontSize: '0.74rem', color: '#D97706', marginTop: '4px' }}>3 Active, 3 Validated</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', cursor: 'pointer' }} onClick={() => setActiveTab('scale')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Scaled Solutions</span>
            <TrendingUp size={16} color="#16A34A" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A' }}>{overviewStats.solutionsScaled}</div>
          <div style={{ fontSize: '0.74rem', color: '#16A34A', marginTop: '4px' }}>Statewide Deployments</div>
        </div>
      </div>

      {/* Action Required Items */}
      <div style={{ marginBottom: '32px' }}>
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
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>
          Recent activity & procurement milestones
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
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A' }}>
              Active innovation challenges pipeline
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Showing {challenges.length} challenges published across participating government departments</div>
          </div>

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
                    <td>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{c.applications_count}</span>
                      <span style={{ fontSize: '0.74rem', color: '#64748B', marginLeft: '4px' }}>proposals</span>
                    </td>
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
