import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Check } from 'lucide-react';

export default function PerformanceView() {
  const { setActiveTab, showToast } = useApp();
  const [reports, setReports] = useState([]);
  const [selectedPilotId, setSelectedPilotId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [expertComments, setExpertComments] = useState('');
  const [govtFeedback, setGovtFeedback] = useState('');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const res = await fetch('/api/performance');
      if (res.ok) {
        const data = await res.json();
        setReports(data);
        if (data.length > 0 && !selectedPilotId) {
          setSelectedPilotId(data[0].pilot_id);
          setExpertComments(data[0].expert_comments || '');
          setGovtFeedback(data[0].govt_feedback || '');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleValidationAction = async (action) => {
    if (!selectedPilotId) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/performance/${selectedPilotId}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          expertComments,
          govtFeedback
        })
      });

      if (res.ok) {
        showToast("Pilot approved for procurement review.");
        fetchPerformanceData();
        if (action === 'Approve Pilot') {
          setActiveTab('procurement');
        }
      } else {
        const err = await res.json();
        alert(err.error || "Unable to update validation.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to save changes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const currentReport = reports.find(r => r.pilot_id === selectedPilotId) || reports[0];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Performance</h1>
          <p className="page-desc">
            Review field pilot KPI benchmarks and audit validation reports.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('procurement')}
        >
          <span>Open Procurement Decision</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        {/* Left: Pilot selector */}
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>
            Pilot Reports ({reports.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {reports.map((r) => {
              const isSelected = r.pilot_id === (currentReport ? currentReport.pilot_id : null);
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    setSelectedPilotId(r.pilot_id);
                    setExpertComments(r.expert_comments || '');
                    setGovtFeedback(r.govt_feedback || '');
                  }}
                  style={{
                    border: isSelected ? '1px solid #0F172A' : '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0F172A' }}>
                      {r.startup_name}
                    </span>
                    <span className="status-pill status-pill-success">
                      {r.validation_status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    {r.challenge_title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Focused KPI Performance Card */}
        {currentReport ? (
          <div>
            <div className="card">
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A' }}>
                  {currentReport.startup_name} — {currentReport.challenge_title}
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  Testing Agency: <strong>{currentReport.testing_agency || 'National Water Academy & CPWD'}</strong>
                </div>
              </div>

              {/* Important KPIs only */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A', marginBottom: '12px' }}>
                  Pilot Benchmark Indicators
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* KPI 1 */}
                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0F172A' }}>
                        Detection Accuracy
                      </span>
                      <span className="status-pill status-pill-success">
                        Achieved
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '28px', fontSize: '0.84rem' }}>
                      <div>
                        <span style={{ color: '#64748B', fontSize: '0.74rem', display: 'block' }}>Target</span>
                        <strong style={{ color: '#0F172A' }}>90%</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', fontSize: '0.74rem', display: 'block' }}>Actual</span>
                        <strong style={{ color: '#059669', fontSize: '1rem' }}>94.2%</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', fontSize: '0.74rem', display: 'block' }}>Variance</span>
                        <span style={{ color: '#059669', fontWeight: 600 }}>+4.2% above target</span>
                      </div>
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0F172A' }}>
                        Response Time
                      </span>
                      <span className="status-pill status-pill-success">
                        Achieved
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '28px', fontSize: '0.84rem' }}>
                      <div>
                        <span style={{ color: '#64748B', fontSize: '0.74rem', display: 'block' }}>Target</span>
                        <strong style={{ color: '#0F172A' }}>30 min</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', fontSize: '0.74rem', display: 'block' }}>Actual</span>
                        <strong style={{ color: '#059669', fontSize: '1rem' }}>22 min</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', fontSize: '0.74rem', display: 'block' }}>Variance</span>
                        <span style={{ color: '#059669', fontWeight: 600 }}>8 min faster than target</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Summary & Decision */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '6px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                  Independent Audit Sign-Off
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '12px' }}>
                  National Water Academy certification confirms test results meet public tender requirements.
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Validation remarks</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={expertComments}
                    onChange={(e) => setExpertComments(e.target.value)}
                    placeholder="Enter final validation notes..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleValidationAction('Request Clarification')}
                  disabled={submitting}
                >
                  <span>Request Clarification</span>
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleValidationAction('Approve Pilot')}
                  disabled={submitting}
                >
                  <span>Approve Pilot</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
            Select a pilot to review performance benchmarks.
          </div>
        )}
      </div>
    </div>
  );
}
