import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

export default function ExpertEvaluationView() {
  const { setActiveTab, currentRole, showToast } = useApp();
  const [evaluations, setEvaluations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Scoring controls
  const [scores, setScores] = useState({
    technical_score: 85,
    innovation_score: 90,
    feasibility_score: 82,
    cost_score: 78,
    team_score: 88,
    comments: 'WaterSense provides a validated acoustic edge detection algorithm with minimal false positive readings. Ready for municipal field pilot.'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resEval, resApp] = await Promise.all([
        fetch('/api/evaluations'),
        fetch('/api/applications')
      ]);

      if (resEval.ok && resApp.ok) {
        const evals = await resEval.json();
        const apps = await resApp.json();
        setEvaluations(evals);
        setApplications(apps);

        if (!selectedAppId && apps.length > 0) {
          setSelectedAppId(apps[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScoreChange = (key, val) => {
    setScores(prev => ({ ...prev, [key]: Number(val) }));
  };

  const totalScore = Number((
    (scores.technical_score * 0.30) +
    (scores.innovation_score * 0.25) +
    (scores.feasibility_score * 0.20) +
    (scores.cost_score * 0.15) +
    (scores.team_score * 0.10)
  ).toFixed(1));

  const handleDecision = async (decision) => {
    if (!selectedAppId) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: selectedAppId,
          expert_name: currentRole.userName || 'Dr. M. S. Swaminathan',
          technical_score: scores.technical_score,
          innovation_score: scores.innovation_score,
          feasibility_score: scores.feasibility_score,
          cost_score: scores.cost_score,
          team_score: scores.team_score,
          comments: scores.comments,
          decision
        })
      });

      if (res.ok) {
        showToast(
          decision === 'Approved for Pilot'
            ? "Pilot approved for procurement review."
            : "Evaluation saved."
        );
        fetchData();
        if (decision === 'Approved for Pilot') {
          setActiveTab('pilots');
        }
      } else {
        const err = await res.json();
        alert(err.error || "Unable to save evaluation.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to save changes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentApp = applications.find(a => a.id === selectedAppId);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Evaluations</h1>
          <p className="page-desc">
            Evaluate candidate startup proposals against technical and operational criteria.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('pilots')}
        >
          <span>Open Pilots</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Left Column: Proposals List */}
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>
            Proposals ({applications.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {applications.map((app) => {
              const isSelected = app.id === selectedAppId;
              const existingEval = evaluations.find(e => e.application_id === app.id);

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedAppId(app.id);
                    if (existingEval) {
                      setScores({
                        technical_score: existingEval.technical_score,
                        innovation_score: existingEval.innovation_score,
                        feasibility_score: existingEval.feasibility_score,
                        cost_score: existingEval.cost_score,
                        team_score: existingEval.team_score,
                        comments: existingEval.comments || ''
                      });
                    }
                  }}
                  style={{
                    border: isSelected ? '1px solid #0F172A' : '1px solid #E2E8F0',
                    background: isSelected ? '#FFFFFF' : '#FFFFFF',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0F172A' }}>
                      {app.startup_name}
                    </div>
                    {existingEval ? (
                      <span className="status-pill status-pill-success">{existingEval.total_score}/100</span>
                    ) : (
                      <span className="status-pill status-pill-review">Pending</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    {app.challenge_title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Scorecard Panel */}
        {currentApp ? (
          <div className="card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A' }}>
                  {currentApp.startup_name}
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Challenge: {currentApp.challenge_title} ({currentApp.department})
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
                  {totalScore}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>
                  SCORE / 100
                </div>
              </div>
            </div>

            {/* Proposal summary */}
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '20px', fontSize: '0.82rem' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}>
                Proposal Summary
              </div>
              <div style={{ color: '#334155' }}>{currentApp.proposal_summary}</div>
            </div>

            {/* Evaluation Criteria Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div className="score-row">
                <div className="score-meta">
                  <div className="score-name">Technical Fit</div>
                  <div className="score-weight">Weight: 30%</div>
                </div>
                <div className="score-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores.technical_score}
                    onChange={(e) => handleScoreChange('technical_score', e.target.value)}
                    style={{ flex: 1, accentColor: '#0F172A', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 600, width: '36px', textAlign: 'right', fontSize: '0.84rem' }}>
                    {scores.technical_score}
                  </span>
                </div>
              </div>

              <div className="score-row">
                <div className="score-meta">
                  <div className="score-name">Innovation</div>
                  <div className="score-weight">Weight: 25%</div>
                </div>
                <div className="score-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores.innovation_score}
                    onChange={(e) => handleScoreChange('innovation_score', e.target.value)}
                    style={{ flex: 1, accentColor: '#0F172A', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 600, width: '36px', textAlign: 'right', fontSize: '0.84rem' }}>
                    {scores.innovation_score}
                  </span>
                </div>
              </div>

              <div className="score-row">
                <div className="score-meta">
                  <div className="score-name">Feasibility</div>
                  <div className="score-weight">Weight: 20%</div>
                </div>
                <div className="score-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores.feasibility_score}
                    onChange={(e) => handleScoreChange('feasibility_score', e.target.value)}
                    style={{ flex: 1, accentColor: '#0F172A', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 600, width: '36px', textAlign: 'right', fontSize: '0.84rem' }}>
                    {scores.feasibility_score}
                  </span>
                </div>
              </div>

              <div className="score-row">
                <div className="score-meta">
                  <div className="score-name">Cost</div>
                  <div className="score-weight">Weight: 15%</div>
                </div>
                <div className="score-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores.cost_score}
                    onChange={(e) => handleScoreChange('cost_score', e.target.value)}
                    style={{ flex: 1, accentColor: '#0F172A', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 600, width: '36px', textAlign: 'right', fontSize: '0.84rem' }}>
                    {scores.cost_score}
                  </span>
                </div>
              </div>

              <div className="score-row">
                <div className="score-meta">
                  <div className="score-name">Team</div>
                  <div className="score-weight">Weight: 10%</div>
                </div>
                <div className="score-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores.team_score}
                    onChange={(e) => handleScoreChange('team_score', e.target.value)}
                    style={{ flex: 1, accentColor: '#0F172A', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 600, width: '36px', textAlign: 'right', fontSize: '0.84rem' }}>
                    {scores.team_score}
                  </span>
                </div>
              </div>
            </div>

            {/* Evaluator Comments */}
            <div className="form-group">
              <label className="form-label">Evaluator comments</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={scores.comments}
                onChange={(e) => handleScoreChange('comments', e.target.value)}
                placeholder="Provide objective technical commentary..."
              />
            </div>

            {/* Decision Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleDecision('Request Changes')}
                disabled={submitting}
              >
                <span>Request Changes</span>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleDecision('Save Evaluation')}
                disabled={submitting}
              >
                <span>Save Evaluation</span>
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleDecision('Approved for Pilot')}
                disabled={submitting}
              >
                <span>Approve for Pilot</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
            Select a proposal to view evaluation criteria.
          </div>
        )}
      </div>
    </div>
  );
}
