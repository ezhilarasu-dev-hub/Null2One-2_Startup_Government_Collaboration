import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, ArrowRight, ArrowLeft, Check, Bookmark } from 'lucide-react';

export default function StartupDiscoveryView() {
  const {
    selectedChallengeId,
    setSelectedChallengeId,
    selectedStartupId,
    setSelectedStartupId,
    setActiveTab,
    showToast
  } = useApp();

  const [startups, setStartups] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [search, setSearch] = useState('');
  const [techFilter, setTechFilter] = useState('All');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Profile modal state
  const [activeProfile, setActiveProfile] = useState(null);

  // 3-step application modal state
  const [isApplying, setIsApplying] = useState(false);
  const [appStep, setAppStep] = useState(1);
  const [applyingChallengeId, setApplyingChallengeId] = useState(null);
  const [proposalPitch, setProposalPitch] = useState('');
  const [proposedBudget, setProposedBudget] = useState('₹38,50,000');
  const [proposedTimeline, setProposedTimeline] = useState('90 Days');
  const [submittedAppResult, setSubmittedAppResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/challenges')
      .then(res => res.json())
      .then(data => {
        setChallenges(data);
        if (selectedChallengeId) {
          const match = data.find(c => c.id === parseInt(selectedChallengeId));
          if (match) setActiveChallenge(match);
        } else if (data.length > 0) {
          const def = data.find(c => c.id === 3) || data[0];
          setActiveChallenge(def);
          setSelectedChallengeId(def.id);
        }
      });
  }, []);

  useEffect(() => {
    fetchStartups();
  }, [selectedChallengeId, search, techFilter, industryFilter]);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const chId = selectedChallengeId || (activeChallenge ? activeChallenge.id : '');
      let url = `/api/startups?challengeId=${chId}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (techFilter !== 'All') url += `&technology=${encodeURIComponent(techFilter)}`;
      if (industryFilter !== 'All') url += `&industry=${encodeURIComponent(industryFilter)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStartups(data);

        if (selectedStartupId) {
          const target = data.find(s => s.id === parseInt(selectedStartupId));
          if (target) setActiveProfile(target);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartApplication = (startup) => {
    setActiveProfile(null);
    setApplyingChallengeId(selectedChallengeId || (activeChallenge ? activeChallenge.id : 3));
    setAppStep(1);
    setSubmittedAppResult(null);
    setIsApplying(true);
  };

  const handleSubmitApplication = async () => {
    try {
      setSubmitting(true);
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_id: applyingChallengeId,
          startup_id: activeProfile?.id || selectedStartupId || 1,
          proposal_summary: proposalPitch || 'Field pilot deployment and telemetry benchmark validation proposal.',
          proposed_budget: proposedBudget,
          proposed_timeline: proposedTimeline
        })
      });

      if (res.ok) {
        const data = await res.json();
        const ch = challenges.find(c => c.id === applyingChallengeId);
        setSubmittedAppResult({
          appId: `APP-2026-${data.id}`,
          challengeTitle: ch ? ch.title : 'Challenge',
          currentStage: 'Eligibility Screening',
          nextStep: 'Department verification of statutory DPIIT compliance and technical proposal.'
        });
        showToast("Application submitted.");
      } else {
        const err = await res.json();
        alert(err.error || "Submission failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Search Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="page-title">Startups</h1>
        <p className="page-desc">What solution are you looking for?</p>

        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px' }}
              placeholder="Search startups, technologies, solutions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              className="form-select"
              style={{ width: '140px' }}
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
            >
              <option value="All">All Technologies</option>
              <option value="IoT">IoT</option>
              <option value="ML">Machine Learning</option>
              <option value="Vision">Computer Vision</option>
              <option value="Acoustic">Acoustic</option>
              <option value="CleanTech">CleanTech</option>
            </select>

            <select
              className="form-select"
              style={{ width: '150px' }}
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="All">All Industries</option>
              <option value="Water">Water & Sanitation</option>
              <option value="Infrastructure">Urban Infrastructure</option>
              <option value="Education">Education</option>
              <option value="Energy">Renewable Energy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suggested Matches Context Bar */}
      {activeChallenge && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', marginBottom: '20px', fontSize: '0.82rem' }}>
          <div>
            <span style={{ color: '#64748B' }}>Suggested matches for: </span>
            <strong style={{ color: '#0F172A' }}>{activeChallenge.title}</strong>
            <span style={{ color: '#64748B' }}> ({activeChallenge.department})</span>
          </div>

          <select
            className="form-select"
            style={{ width: '220px', padding: '4px 8px', fontSize: '0.78rem' }}
            value={selectedChallengeId || ''}
            onChange={(e) => {
              const id = parseInt(e.target.value);
              setSelectedChallengeId(id);
              const found = challenges.find(c => c.id === id);
              if (found) setActiveChallenge(found);
            }}
          >
            {challenges.map(c => (
              <option key={c.id} value={c.id}>Challenge: {c.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Startup Grid */}
      <div className="grid-3">
        {startups.map((s) => (
          <div
            key={s.id}
            className="card"
            style={{
              marginBottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0F172A' }}>
                    {s.name}
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{s.solution}</div>
                </div>

                <span className="status-pill status-pill-success">
                  {s.matchScore}% Match
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, margin: '8px 0 12px' }}>
                {s.short_description || s.description?.slice(0, 110) + '...'}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                {s.technology?.split(',').map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.72rem',
                      background: '#F1F5F9',
                      color: '#475569',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '0.76rem', color: '#64748B', display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #F1F5F9' }}>
                <span>Eligibility: <strong style={{ color: '#065F46' }}>Eligible</strong></span>
                <span>{s.experience_years || 3} yrs exp</span>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
                onClick={() => setActiveProfile(s)}
              >
                <span>View Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Startup Profile Modal */}
      {activeProfile && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{activeProfile.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  {activeProfile.solution} • {activeProfile.location || 'New Delhi, India'}
                </div>
              </div>
              <button
                onClick={() => setActiveProfile(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: '16px' }}>
                <div className="form-label">About the company</div>
                <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                  {activeProfile.description}
                </p>
              </div>

              <div className="grid-2" style={{ marginBottom: '16px' }}>
                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>DPIIT Registration</div>
                  <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.86rem' }}>{activeProfile.dpiit_number}</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase' }}>Operational Experience</div>
                  <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.86rem' }}>{activeProfile.experience_years} Years Active</div>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div className="form-label">Core technologies</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {activeProfile.technology?.split(',').map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.76rem', background: '#F1F5F9', color: '#334155', padding: '3px 8px', borderRadius: '4px' }}>
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div className="form-label">Previous deployments</div>
                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                  {activeProfile.past_deployments || 'Municipal pipe monitoring trials across 3 smart cities in northern districts.'}
                </p>
              </div>

              <div>
                <div className="form-label">Target challenge</div>
                <div style={{ fontSize: '0.82rem', color: '#0F172A', background: '#F8FAFC', padding: '8px 12px', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  {activeChallenge ? activeChallenge.title : 'Municipal Challenge'} ({activeProfile.matchScore}% suggested match)
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  showToast("Profile saved to watchlist.");
                  setActiveProfile(null);
                }}
              >
                <span>Save</span>
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleStartApplication(activeProfile)}
              >
                <span>Apply to Challenge</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Application Flow Modal */}
      {isApplying && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Application Flow</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                  Step {appStep} of 3: {
                    appStep === 1 ? 'Eligibility Verification' :
                    appStep === 2 ? 'Proposal Summary' : 'Review & Submit'
                  }
                </div>
              </div>
              <button
                onClick={() => setIsApplying(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {submittedAppResult ? (
                <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ECFDF5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Check size={20} />
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                    Application submitted successfully.
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
                    Reference ID: <strong>{submittedAppResult.appId}</strong>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0', textAlign: 'left', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <span style={{ color: '#64748B' }}>Challenge: </span>
                      <strong>{submittedAppResult.challengeTitle}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Current Stage: </span>
                      <span className="status-pill status-pill-review">{submittedAppResult.currentStage}</span>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Next Step: </span>
                      <span>{submittedAppResult.nextStep}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {appStep === 1 && (
                    <div>
                      <div className="form-group">
                        <label className="form-label">Target challenge</label>
                        <select
                          className="form-select"
                          value={applyingChallengeId || ''}
                          onChange={(e) => setApplyingChallengeId(parseInt(e.target.value))}
                        >
                          {challenges.map(c => (
                            <option key={c.id} value={c.id}>{c.title} ({c.department})</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', marginTop: '12px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                          Statutory Eligibility Checklist
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div>✓ Verified DPIIT Recognition Certificate</div>
                          <div>✓ Valid GSTIN and Incorporation Filings</div>
                          <div>✓ Technical Compatibility Undertaking</div>
                          <div>✓ Minimum 2 Years Domain Experience</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {appStep === 2 && (
                    <div>
                      <div className="form-group">
                        <label className="form-label">Proposal pitch</label>
                        <div className="form-desc">Summarize your operational approach and deployment methodology.</div>
                        <textarea
                          className="form-textarea"
                          rows={4}
                          value={proposalPitch}
                          onChange={(e) => setProposalPitch(e.target.value)}
                          placeholder="Provide a concise description of your technical solution and pilot readiness..."
                        />
                      </div>

                      <div className="grid-2">
                        <div className="form-group">
                          <label className="form-label">Proposed budget</label>
                          <input
                            type="text"
                            className="form-input"
                            value={proposedBudget}
                            onChange={(e) => setProposedBudget(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Proposed timeline</label>
                          <input
                            type="text"
                            className="form-input"
                            value={proposedTimeline}
                            onChange={(e) => setProposedTimeline(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {appStep === 3 && (
                    <div>
                      <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.84rem' }}>
                        <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                          Review Proposal Submission
                        </div>
                        <div style={{ color: '#475569', marginBottom: '10px' }}>
                          Target: {challenges.find(c => c.id === applyingChallengeId)?.title || 'Challenge'}
                        </div>
                        <div style={{ color: '#334155', marginBottom: '10px', lineHeight: 1.45 }}>
                          "{proposalPitch || 'Field pilot deployment and telemetry benchmark validation proposal.'}"
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                          Budget: {proposedBudget} • Timeline: {proposedTimeline}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              {submittedAppResult ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setIsApplying(false);
                    setActiveTab('applications');
                  }}
                >
                  <span>Go to Applications</span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <>
                  {appStep > 1 && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setAppStep(s => s - 1)}
                      disabled={submitting}
                    >
                      <ArrowLeft size={13} />
                      <span>Back</span>
                    </button>
                  )}

                  {appStep < 3 ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setAppStep(s => s + 1)}
                    >
                      <span>Continue</span>
                      <ArrowRight size={13} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleSubmitApplication}
                      disabled={submitting}
                    >
                      <span>{submitting ? 'Submitting...' : 'Submit Application'}</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
