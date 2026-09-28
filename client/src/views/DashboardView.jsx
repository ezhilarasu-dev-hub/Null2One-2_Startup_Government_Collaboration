import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  FileCheck,
  FlaskConical,
  Award,
  Briefcase,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function DashboardView({ onOpenCreateChallenge }) {
  const { setActiveTab, setSelectedChallengeId, currentRole } = useApp();
  const [overview, setOverview] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resOverview, resChallenges] = await Promise.all([
        fetch('/api/overview'),
        fetch('/api/challenges')
      ]);

      if (resOverview.ok && resChallenges.ok) {
        const dataOverview = await resOverview.json();
        const dataChallenges = await resChallenges.json();
        setOverview(dataOverview);
        setChallenges(dataChallenges);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Open': return 'badge-open';
      case 'Evaluation': return 'badge-evaluation';
      case 'Pilot': return 'badge-pilot';
      case 'Procurement Review': return 'badge-procurement';
      case 'Scaled': return 'badge-scaled';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Government Procurement Dashboard</h1>
          <p className="page-desc">
            Startup Friendly Public Procurement Mechanism • GFR 2017 Innovation Lifecycle Management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-primary"
            onClick={onOpenCreateChallenge}
          >
            <PlusCircle size={16} />
            <span>Create New Challenge</span>
          </button>
        </div>
      </div>

      {/* Overview Cards (6 metrics) */}
      <div className="grid-6" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-label">Active Challenges</div>
          <div className="stat-val">{overview ? overview.cards.activeChallenges : '5'}</div>
          <div className="stat-subtext">Across 5 State Depts</div>
        </div>

        <div className="stat-card accent-navy">
          <div className="stat-label">Applications</div>
          <div className="stat-val">{overview ? overview.cards.applicationsReceived : '8'}</div>
          <div className="stat-subtext">DPIIT Verified Startups</div>
        </div>

        <div className="stat-card accent-amber">
          <div className="stat-label">Pending Evaluations</div>
          <div className="stat-val">{overview ? overview.cards.pendingEvaluations : '4'}</div>
          <div className="stat-subtext">Expert Technical Scoring</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pilots Running</div>
          <div className="stat-val">{overview ? overview.cards.pilotsRunning : '3'}</div>
          <div className="stat-subtext">Controlled Live Deployments</div>
        </div>

        <div className="stat-card accent-green">
          <div className="stat-label">Procurement Sanctions</div>
          <div className="stat-val">{overview ? overview.cards.procurementDecisions : '2'}</div>
          <div className="stat-subtext">Rule 149 Exemptions</div>
        </div>

        <div className="stat-card accent-green">
          <div className="stat-label">Solutions Scaled</div>
          <div className="stat-val">{overview ? overview.cards.solutionsScaled : '2'}</div>
          <div className="stat-subtext">State-wide Multi-District</div>
        </div>
      </div>

      {/* Procurement Pipeline Visualization (01 to 07) */}
      <div className="pipeline-container">
        <div className="pipeline-header">
          <div>
            <h2 className="card-title">
              <TrendingUp size={18} color="#133E87" />
              Public Innovation Procurement Pipeline
            </h2>
            <div className="card-subtitle" style={{ marginBottom: 0 }}>
              End-to-end evidence-based adoption lifecycle from problem identification to statewide scale-up.
            </div>
          </div>
          <span className="badge badge-open" style={{ fontSize: '0.74rem' }}>Live Tracking</span>
        </div>

        <div className="pipeline-flow">
          <div className="pipeline-step completed" onClick={() => setActiveTab('challenges')} style={{ cursor: 'pointer' }}>
            <div className="pipeline-step-num">STAGE 01</div>
            <div className="pipeline-step-name">Challenge</div>
            <div className="pipeline-step-count">5 Active</div>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step completed" onClick={() => setActiveTab('startups')} style={{ cursor: 'pointer' }}>
            <div className="pipeline-step-num">STAGE 02</div>
            <div className="pipeline-step-name">Discovery</div>
            <div className="pipeline-step-count">8 Startups</div>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step active" onClick={() => setActiveTab('evaluations')} style={{ cursor: 'pointer' }}>
            <div className="pipeline-step-num">STAGE 03</div>
            <div className="pipeline-step-name">Evaluation</div>
            <div className="pipeline-step-count">4 Under Scoring</div>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step active" onClick={() => setActiveTab('pilots')} style={{ cursor: 'pointer' }}>
            <div className="pipeline-step-num">STAGE 04</div>
            <div className="pipeline-step-name">Pilot</div>
            <div className="pipeline-step-count">3 Running</div>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step completed" onClick={() => setActiveTab('performance')} style={{ cursor: 'pointer' }}>
            <div className="pipeline-step-num">STAGE 05</div>
            <div className="pipeline-step-name">Validation</div>
            <div className="pipeline-step-count">3 Verified</div>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step active" onClick={() => setActiveTab('procurement')} style={{ cursor: 'pointer' }}>
            <div className="pipeline-step-num">STAGE 06</div>
            <div className="pipeline-step-name">Procurement</div>
            <div className="pipeline-step-count">2 Decisions</div>
          </div>

          <div className="pipeline-arrow">→</div>

          <div className="pipeline-step completed" onClick={() => setActiveTab('scale')} style={{ cursor: 'pointer' }}>
            <div className="pipeline-step-num">STAGE 07</div>
            <div className="pipeline-step-name">Scale-Up</div>
            <div className="pipeline-step-count">2 Scaled</div>
          </div>
        </div>
      </div>

      {/* Challenges & Procurement Pipeline Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h2 className="card-title">
              <Target size={18} color="#133E87" />
              Active Department Challenges
            </h2>
            <div className="card-subtitle" style={{ marginBottom: 0 }}>
              Official challenges published across departments under Problem Statement SIH26136.
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('challenges')}
          >
            <span>View All Challenges</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Department</th>
                <th>Applications</th>
                <th>Stage</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0B2545' }}>{c.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {c.required_technology}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{c.department}</span>
                  </td>
                  <td>
                    <span className="badge badge-neutral">
                      {c.applications_count} Startups
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
                      {c.stage}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedChallengeId(c.id);
                          setActiveTab('startups');
                        }}
                        title="Find matching startups for this challenge"
                      >
                        Match Startups
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedChallengeId(c.id);
                          if (c.status === 'Pilot') {
                            setActiveTab('pilots');
                          } else if (c.status === 'Evaluation') {
                            setActiveTab('evaluations');
                          } else if (c.status === 'Procurement Review') {
                            setActiveTab('procurement');
                          } else if (c.status === 'Scaled') {
                            setActiveTab('scale');
                          } else {
                            setActiveTab('challenges');
                          }
                        }}
                      >
                        Open Stage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
