import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Target,
  Search,
  FileCheck,
  Award,
  FlaskConical,
  Gauge,
  Briefcase,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export default function ProductGuideModal({ isOpen, onClose }) {
  const { setActiveTab, setCurrentRoleKey, showToast } = useApp();

  if (!isOpen) return null;

  const workflowSteps = [
    { num: '01', title: 'Publish Challenge', desc: 'Department specifies operational problems, expected outcomes, and KPI targets.', tab: 'challenges', role: 'dept' },
    { num: '02', title: 'Startup Discovery', desc: 'Identify verified deep-tech startups using multi-factor capability matching.', tab: 'startups', role: 'dept' },
    { num: '03', title: 'Eligibility Screening', desc: 'Screen DPIIT registration, experience, and statutory compliance undertakings.', tab: 'applications', role: 'dept' },
    { num: '04', title: 'Technical Evaluation', desc: 'Domain specialists objectively score technical fit, innovation, and feasibility.', tab: 'evaluations', role: 'evaluator' },
    { num: '05', title: 'Controlled Field Pilot', desc: 'Deploy structured trials across 4 milestone gates with objective testing.', tab: 'pilots', role: 'dept' },
    { num: '06', title: 'Performance Validation', desc: 'Audit live telemetry metrics against baseline tender specifications.', tab: 'performance', role: 'dept' },
    { num: '07', title: 'Procurement Sanction', desc: 'Authorize commercial contract execution under pilot innovation rules.', tab: 'procurement', role: 'procurement' },
    { num: '08', title: 'Statewide Scale-Up', desc: 'Replicate validated solution across multi-department and district utilities.', tab: 'scale', role: 'procurement' },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">ProcureSetu Portal Guide</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Public Procurement & Startup Collaboration Walkthrough
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
            ProcureSetu provides an evidence-based pathway for public departments to discover, test, and procure proven startup innovations through controlled pilots:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {workflowSteps.map((step) => (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '2px 6px', borderRadius: '4px' }}>
                    {step.num}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0F172A' }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setCurrentRoleKey(step.role);
                    setActiveTab(step.tab);
                    onClose();
                  }}
                  style={{ flexShrink: 0 }}
                >
                  <span>Open</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
