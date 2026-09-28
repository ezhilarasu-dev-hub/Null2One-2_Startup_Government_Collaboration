import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, X, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ChallengesView({ showCreateModalDirectly, onCloseModalDirectly }) {
  const { setActiveTab, setSelectedChallengeId, showToast } = useApp();
  const [challenges, setChallenges] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(showCreateModalDirectly || false);
  const [step, setStep] = useState(1);
  const [showConfirmPublish, setShowConfirmPublish] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: 'AI-Based Water Leakage Detection',
    department: 'Public Works Department',
    problem_description: 'Acoustic and sensor detection of subterranean pipeline leaks in municipal supply feeder lines.',
    expected_outcome: 'Pinpoint underground pipeline leaks within a 5-meter radius and reduce non-revenue water loss.',
    expected_kpis: '90% detection accuracy, response notification under 30 minutes',
    pilot_duration: '3 Months',
    budget_range: '₹30,00,000 - ₹50,00,000',
    eligibility_requirements: 'DPIIT recognized startup, minimum 2 years relevant experience',
    required_technology: 'IoT Sensors, Acoustic Telemetry, Machine Learning',
    submission_deadline: '2026-11-30'
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await fetch('/api/challenges');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublish = async () => {
    try {
      setSubmitting(true);
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'Open'
        })
      });

      if (res.ok) {
        const created = await res.json();
        showToast("Challenge published.");
        setIsModalOpen(false);
        setShowConfirmPublish(false);
        setStep(1);
        if (onCloseModalDirectly) onCloseModalDirectly();
        fetchChallenges();
        setSelectedChallengeId(created.id);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to publish challenge.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to save changes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesDept = deptFilter === 'All' || c.department.includes(deptFilter);
    return matchesSearch && matchesStatus && matchesDept;
  });

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

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Challenges</h1>
          <p className="page-desc">Create and manage procurement challenges.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setStep(1);
            setIsModalOpen(true);
          }}
        >
          <Plus size={15} />
          <span>Create Challenge</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="toolbar-bar">
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94A3B8' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '32px' }}
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            className="form-select"
            style={{ width: '140px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Evaluation">Evaluation</option>
            <option value="Pilot">Pilot</option>
            <option value="Procurement Review">Under Review</option>
            <option value="Scaled">Scaled</option>
          </select>

          <select
            className="form-select"
            style={{ width: '180px' }}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Public Works">Public Works</option>
            <option value="Urban Development">Urban Development</option>
            <option value="Pollution Control">Pollution Control</option>
            <option value="Healthcare">Healthcare</option>
          </select>
        </div>
      </div>

      {/* Professional Challenges Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Department</th>
                <th>Created</th>
                <th>Applications</th>
                <th>Current Stage</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredChallenges.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                    No challenges match your filter.
                  </td>
                </tr>
              ) : (
                filteredChallenges.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{c.title}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{c.required_technology}</div>
                    </td>
                    <td>{c.department}</td>
                    <td>{c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Sep 24, 2026'}</td>
                    <td>{c.applications_count}</td>
                    <td>{c.stage}</td>
                    <td>{getStatusBadge(c.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setSelectedChallengeId(c.id);
                          setActiveTab('startups');
                        }}
                      >
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-step Modal for Create Challenge */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <div className="modal-title">Create Challenge</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                  Step {step} of 4: {
                    step === 1 ? 'Problem Description' :
                    step === 2 ? 'Expected Outcome & KPIs' :
                    step === 3 ? 'Eligibility & Experience' : 'Review & Publish'
                  }
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseModalDirectly) onCloseModalDirectly();
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {step === 1 && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Challenge title</label>
                    <div className="form-desc">What problem are you trying to solve?</div>
                    <input
                      type="text"
                      className="form-input"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. AI-Based Water Leakage Detection"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Issuing department</label>
                    <input
                      type="text"
                      className="form-input"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Problem description</label>
                    <div className="form-desc">Explain the specific municipal or operational bottleneck.</div>
                    <textarea
                      className="form-textarea"
                      name="problem_description"
                      value={formData.problem_description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Expected outcome</label>
                    <div className="form-desc">What measurable operational result do you expect?</div>
                    <textarea
                      className="form-textarea"
                      name="expected_outcome"
                      value={formData.expected_outcome}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target KPIs</label>
                    <div className="form-desc">Quantifiable success indicators for the field pilot.</div>
                    <input
                      type="text"
                      className="form-input"
                      name="expected_kpis"
                      value={formData.expected_kpis}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Pilot duration</label>
                      <input
                        type="text"
                        className="form-input"
                        name="pilot_duration"
                        value={formData.pilot_duration}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Estimated budget</label>
                      <input
                        type="text"
                        className="form-input"
                        name="budget_range"
                        value={formData.budget_range}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Required technology</label>
                    <div className="form-desc">Specify domain technologies (e.g. IoT Sensors, Computer Vision).</div>
                    <input
                      type="text"
                      className="form-input"
                      name="required_technology"
                      value={formData.required_technology}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Eligibility requirements</label>
                    <div className="form-desc">Statutory criteria and experience expectations.</div>
                    <textarea
                      className="form-textarea"
                      name="eligibility_requirements"
                      value={formData.eligibility_requirements}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Application deadline</label>
                    <input
                      type="date"
                      className="form-input"
                      name="submission_deadline"
                      value={formData.submission_deadline}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                      {formData.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '10px' }}>
                      {formData.department} • Budget: {formData.budget_range} • Pilot: {formData.pilot_duration}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.45, marginBottom: '8px' }}>
                      {formData.problem_description}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                      <strong>Target KPIs:</strong> {formData.expected_kpis}
                    </div>
                  </div>

                  {showConfirmPublish ? (
                    <div style={{ padding: '12px', background: '#FEF3C7', borderRadius: '6px', border: '1px solid #FCD34D', fontSize: '0.82rem', color: '#92400E' }}>
                      <strong>Publish this challenge?</strong>
                      <div style={{ marginTop: '2px' }}>
                        This will make the challenge visible to eligible startups in discovery.
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                      Review the details above before publishing. You can edit challenge parameters later if needed.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              {step > 1 && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setShowConfirmPublish(false);
                    setStep(s => s - 1);
                  }}
                  disabled={submitting}
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
              )}

              {step < 4 ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setStep(s => s + 1)}
                >
                  <span>Continue</span>
                  <ArrowRight size={13} />
                </button>
              ) : !showConfirmPublish ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowConfirmPublish(true)}
                >
                  <span>Publish Challenge</span>
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handlePublish}
                  disabled={submitting}
                >
                  <span>{submitting ? 'Publishing...' : 'Confirm & Publish'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
