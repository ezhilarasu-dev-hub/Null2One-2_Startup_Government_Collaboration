import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Check, X, ArrowRight } from 'lucide-react';

export default function EligibilityScreeningView() {
  const { setActiveTab, showToast } = useApp();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChecklist = async (appId, key, currentValue) => {
    try {
      const newValue = currentValue === 1 ? 0 : 1;
      const res = await fetch(`/api/applications/${appId}/checklist`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: newValue })
      });

      if (res.ok) {
        const result = await res.json();
        showToast("Checklist updated.");

        setApplications(prev => prev.map(a => {
          if (a.id === appId) {
            return { ...a, [key]: newValue };
          }
          return a;
        }));

        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(prev => ({
            ...prev,
            [key]: newValue
          }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isEligible = (app) => {
    if (!app) return false;
    return (
      Boolean(app.checklist_dpiit) &&
      Boolean(app.checklist_documents) &&
      Boolean(app.checklist_technology) &&
      Boolean(app.checklist_experience) &&
      Boolean(app.checklist_compliance)
    );
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-desc">
            Review submitted startup proposals and verify eligibility checklists.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('evaluations')}
        >
          <span>Go to Evaluations</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Applications Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Startup</th>
                <th>Challenge</th>
                <th>Submitted</th>
                <th>Eligibility</th>
                <th>Evaluation</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                    No applications submitted yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const eligible = isEligible(app);
                  return (
                    <tr key={app.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{app.startup_name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{app.dpiit_number}</div>
                      </td>
                      <td>
                        <div style={{ color: '#334155' }}>{app.challenge_title}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{app.department}</div>
                      </td>
                      <td>
                        {app.submitted_at
                          ? new Date(app.submitted_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Sep 25, 2026'}
                      </td>
                      <td>
                        {eligible ? (
                          <span className="status-pill status-pill-success">Eligible</span>
                        ) : (
                          <span className="status-pill status-pill-review">Under Review</span>
                        )}
                      </td>
                      <td>
                        {app.evaluation_score ? (
                          <span style={{ fontWeight: 600, color: '#0F172A' }}>{app.evaluation_score}/100</span>
                        ) : (
                          <span style={{ color: '#94A3B8' }}>Pending</span>
                        )}
                      </td>
                      <td>
                        <span className="status-pill status-pill-open">{app.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedApp(app)}
                        >
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail & Checklist Drawer Modal */}
      {selectedApp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Application: {selectedApp.startup_name}</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                  Target: {selectedApp.challenge_title}
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Proposal summary section */}
              <div style={{ marginBottom: '20px' }}>
                <div className="form-label">Proposal summary</div>
                <p style={{ fontSize: '0.84rem', color: '#334155', background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', lineHeight: 1.45 }}>
                  {selectedApp.proposal_summary}
                </p>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '6px' }}>
                  Proposed Budget: <strong>{selectedApp.proposed_budget}</strong> • Timeline: <strong>{selectedApp.proposed_timeline}</strong>
                </div>
              </div>

              {/* 5-Point Eligibility Checklist */}
              <div>
                <div className="form-label">Statutory compliance checklist</div>
                <div className="form-desc">Confirm all five prerequisites to qualify for technical evaluation.</div>

                <div style={{ marginTop: '8px' }}>
                  <div
                    className="check-item"
                    onClick={() => handleToggleChecklist(selectedApp.id, 'checklist_dpiit', selectedApp.checklist_dpiit)}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(selectedApp.checklist_dpiit)}
                      readOnly
                      style={{ marginTop: '2px', accentColor: '#0F172A' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                        1. DPIIT recognition certificate
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Registration #{selectedApp.dpiit_number} verified active.
                      </div>
                    </div>
                  </div>

                  <div
                    className="check-item"
                    onClick={() => handleToggleChecklist(selectedApp.id, 'checklist_documents', selectedApp.checklist_documents)}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(selectedApp.checklist_documents)}
                      readOnly
                      style={{ marginTop: '2px', accentColor: '#0F172A' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                        2. Statutory filings and GSTIN verification
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Incorporation certificate and tax compliance confirmed.
                      </div>
                    </div>
                  </div>

                  <div
                    className="check-item"
                    onClick={() => handleToggleChecklist(selectedApp.id, 'checklist_technology', selectedApp.checklist_technology)}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(selectedApp.checklist_technology)}
                      readOnly
                      style={{ marginTop: '2px', accentColor: '#0F172A' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                        3. Technical capability undertaking
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Demonstrated prototype readiness for municipal field conditions.
                      </div>
                    </div>
                  </div>

                  <div
                    className="check-item"
                    onClick={() => handleToggleChecklist(selectedApp.id, 'checklist_experience', selectedApp.checklist_experience)}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(selectedApp.checklist_experience)}
                      readOnly
                      style={{ marginTop: '2px', accentColor: '#0F172A' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                        4. Minimum 2 years operational track record
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Verified past deployment telemetry and case study validation.
                      </div>
                    </div>
                  </div>

                  <div
                    className="check-item"
                    onClick={() => handleToggleChecklist(selectedApp.id, 'checklist_compliance', selectedApp.checklist_compliance)}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(selectedApp.checklist_compliance)}
                      readOnly
                      style={{ marginTop: '2px', accentColor: '#0F172A' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#0F172A' }}>
                        5. GFR innovation exemption declaration
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Eligible for controlled pilot waiver under public procurement rules.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedApp(null)}
              >
                <span>Close</span>
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectedApp(null);
                  setActiveTab('evaluations');
                }}
              >
                <span>Proceed to Evaluation</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
