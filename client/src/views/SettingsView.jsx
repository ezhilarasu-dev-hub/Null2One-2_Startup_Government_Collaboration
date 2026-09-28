import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, RotateCcw, ShieldCheck, Bell, User, CheckCircle2 } from 'lucide-react';

export default function SettingsView() {
  const { currentRole, resetAllData, showToast } = useApp();

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-desc">
            Manage your organization profile, workflow rules, and demo data environment.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Profile Card */}
        <div className="card">
          <h2 className="card-title">
            <User size={16} />
            <span>Profile & Organization</span>
          </h2>
          <div className="card-subtitle">Current active session parameters.</div>

          <div className="grid-2">
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={currentRole.userName} readOnly />
            </div>

            <div>
              <label className="form-label">Role Designation</label>
              <input type="text" className="form-input" value={currentRole.designation} readOnly />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Organization / Entity</label>
              <input type="text" className="form-input" value={currentRole.entity} readOnly />
            </div>
          </div>
        </div>

        {/* Workflow & GFR Rule Exemption Settings */}
        <div className="card">
          <h2 className="card-title">
            <ShieldCheck size={16} />
            <span>Procurement Framework Parameters</span>
          </h2>
          <div className="card-subtitle">Statutory guidelines governing pilot-to-commercial conversion.</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: '#334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div>
                <strong>Innovation Exemption Mode</strong>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Enables direct procurement conversion upon verified pilot KPIs under GFR Rule 149</div>
              </div>
              <span className="status-pill status-pill-success">Active</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div>
                <strong>Minimum Milestone Gate Required</strong>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Independent 3rd-party benchmark validation required before commercial sanction</div>
              </div>
              <span className="status-pill status-pill-open">4 of 4 Gates</span>
            </div>
          </div>
        </div>

        {/* Demo Workspace Reset */}
        <div className="card" style={{ border: '1px solid #CBD5E1' }}>
          <h2 className="card-title" style={{ color: '#0F172A' }}>
            <RotateCcw size={16} />
            <span>Demonstration Environment Reset</span>
          </h2>
          <div className="card-subtitle">
            Restore all challenges, candidate startups, proposals, and pilot metrics back to clean initial state.
          </div>

          <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '14px' }}>
            Resetting the environment will refresh the SQLite database with the standard enterprise dataset.
          </p>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              if (window.confirm("Reset all demonstration data back to initial state?")) {
                resetAllData();
              }
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Demo Workspace Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
