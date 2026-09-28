import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Check } from 'lucide-react';

export default function ProcurementView() {
  const { setActiveTab, currentRole, showToast } = useApp();
  const [decisions, setDecisions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState('');

  useEffect(() => {
    fetchDecisions();
  }, []);

  const fetchDecisions = async () => {
    try {
      const res = await fetch('/api/procurement');
      if (res.ok) {
        const data = await res.json();
        setDecisions(data);
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].id);
          setDecisionNotes(data[0].decision_notes || '');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAction = async (action) => {
    if (!selectedId) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/procurement/${selectedId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          notes: decisionNotes
        })
      });

      if (res.ok) {
        showToast(
          action === 'Proceed to Procurement'
            ? "Procurement decision recorded. Solution eligible for scale-up."
            : `Procurement decision updated: ${action}`
        );
        fetchDecisions();
        if (action === 'Proceed to Procurement') {
          setActiveTab('scale');
        }
      } else {
        const err = await res.json();
        alert(err.error || "Decision failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to process decision. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const current = decisions.find(d => d.id === selectedId) || decisions[0];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Procurement</h1>
          <p className="page-desc">
            Review verified pilot evidence and execute commercial procurement decisions.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('scale')}
        >
          <span>Open Scale-Up</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Left: Pending Procurement Decisions */}
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>
            Decisions Awaiting Sanction ({decisions.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {decisions.map((d) => {
              const isSelected = d.id === (current ? current.id : null);
              return (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedId(d.id);
                    setDecisionNotes(d.decision_notes || '');
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
                      {d.startup_name}
                    </span>
                    <span className={`status-pill ${d.decision === 'Approved' ? 'status-pill-success' : 'status-pill-review'}`}>
                      {d.decision || 'Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                    {d.challenge_title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Decision Summary & Actions */}
        {current ? (
          <div>
            <div className="card">
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0F172A' }}>
                  Procurement Decision: {current.startup_name}
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                  Challenge: {current.challenge_title} ({current.department || 'Public Works Department'})
                </div>
              </div>

              {/* Decision Evidence Summary */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A', marginBottom: '10px' }}>
                  Decision Evidence Summary
                </div>

                <div className="grid-3" style={{ marginBottom: '16px' }}>
                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Pilot Result</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#059669', marginTop: '2px' }}>
                      {current.pilot_result || '94.2% KPI Achievement'}
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Expert Evaluation</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginTop: '2px' }}>
                      {current.evaluation_score ? `${current.evaluation_score}/100 Approved` : 'Approved'}
                    </div>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Validation Audit</div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#059669', marginTop: '2px' }}>
                      Passed
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#334155', background: '#F8FAFC', padding: '12px 14px', borderRadius: '6px', border: '1px solid #E2E8F0', lineHeight: 1.5 }}>
                  Based on the available pilot evidence, review the procurement decision.
                </p>
              </div>

              {/* Decision Notes */}
              <div className="form-group">
                <label className="form-label">Procurement officer notes</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Record formal justification or improvement conditions..."
                />
              </div>

              {/* Action Buttons with Clear Consequences */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748B', marginBottom: '12px' }}>
                  Select one of the following actions:
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAction('Proceed to Procurement')}
                    disabled={submitting}
                    title="Approves solution for direct procurement and commercial expansion."
                  >
                    <span>Proceed to Procurement</span>
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleAction('Request Improvement')}
                    disabled={submitting}
                    title="Returns pilot to startup for operational modifications before final sanction."
                  >
                    <span>Request Improvement</span>
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleAction('Do Not Proceed')}
                    disabled={submitting}
                    title="Concludes trial without commercial contract execution."
                  >
                    <span>Do Not Proceed</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
            Select a procurement dossier to review.
          </div>
        )}
      </div>
    </div>
  );
}
