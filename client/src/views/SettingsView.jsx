import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  RotateCcw,
  ShieldCheck,
  Bell,
  User,
  CheckCircle2,
  Server,
  Activity,
  Lock,
  Globe
} from 'lucide-react';

export default function SettingsView() {
  const { currentRole, resetAllData, showToast } = useApp();

  const [notificationToggles, setNotificationToggles] = useState({
    pilotBreachAlerts: true,
    milestonePaymentTriggers: true,
    weeklyDigest: false,
    smsOfficerAlerts: true
  });

  const handleToggle = (key) => {
    setNotificationToggles(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast("Notification preference updated.");
      return updated;
    });
  };

  const integrations = [
    {
      name: "DPIIT Startup India Portal API",
      type: "Statutory Registry Integration",
      endpoint: "https://api.startupindia.gov.in/v2/verify",
      lastSync: "Today, 14:15 IST",
      status: "Connected"
    },
    {
      name: "GeM (Government e-Marketplace) Connector",
      type: "Public Procurement Gateway",
      endpoint: "https://gem.gov.in/api/v4/direct-purchase",
      lastSync: "Today, 11:30 IST",
      status: "Connected"
    },
    {
      name: "PFMS (Public Financial Management System)",
      type: "Treasury & Milestone Disbursal",
      endpoint: "https://pfms.nic.in/gateway/disburse",
      lastSync: "Today, 09:45 IST",
      status: "Connected"
    },
    {
      name: "STQC Directorate Biometric & Security Audit API",
      type: "Compliance & Testing Registry",
      endpoint: "https://stqc.gov.in/api/v1/cert-verify",
      lastSync: "Yesterday, 18:20 IST",
      status: "Connected"
    }
  ];

  const auditLogs = [
    { id: 1, action: "GFR 2017 Rule 149 Exemption Verified", entity: "Public Works Department", officer: "R. K. Sharma (Procurement Officer)", time: "2026-09-28 14:32 IST", status: "Audited" },
    { id: 2, action: "Milestone Disbursal Approved ₹1,00,000", entity: "PFMS Payment Gateway", officer: "Finance Division Auditor", time: "2026-09-28 11:15 IST", status: "Executed" },
    { id: 3, action: "Third-Party Benchmark Certified (94.2% accuracy)", entity: "National Water Academy", officer: "Dr. M. S. Swaminathan", time: "2026-09-27 16:45 IST", status: "Certified" },
    { id: 4, action: "DPIIT Statutory Verification Passed (DIPP78214)", entity: "Startup India Portal API", officer: "System Auto-Check", time: "2026-09-27 10:20 IST", status: "Verified" },
    { id: 5, action: "Role Switched to State Procurement Authority", entity: "Session Controller", officer: "Administrative Session", time: "2026-09-26 09:00 IST", status: "Logged" }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-desc">
            Manage organization parameters, connected government registries, and audit logs.
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
          <div className="card-subtitle">Active designated procurement session parameters.</div>

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
              <label className="form-label">Organization / Ministry / Department</label>
              <input type="text" className="form-input" value={currentRole.entity} readOnly />
            </div>
          </div>
        </div>

        {/* Workflow & GFR Rule Exemption Settings */}
        <div className="card">
          <h2 className="card-title">
            <ShieldCheck size={16} />
            <span>Procurement Framework & Statutory Parameters</span>
          </h2>
          <div className="card-subtitle">Statutory guidelines governing pilot-to-commercial conversion.</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: '#334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div>
                <strong>Innovation Exemption Mode (GFR Rule 149)</strong>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Enables direct commercial conversion upon verified pilot KPIs without repeated tendering</div>
              </div>
              <span className="status-pill status-pill-success">Active & Sanctioned</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div>
                <strong>Statutory Milestone Gate Compliance</strong>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Requires independent 3rd-party ground-truth validation report prior to commercial sanction</div>
              </div>
              <span className="status-pill status-pill-open">4 of 4 Gates Enforced</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div>
                <strong>DPIIT Registration Verification Gate</strong>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Automated validation against Central Startup India database for eligibility screening</div>
              </div>
              <span className="status-pill status-pill-success">Automated Check</span>
            </div>
          </div>
        </div>

        {/* Connected Government API Registries */}
        <div className="card">
          <h2 className="card-title">
            <Globe size={16} />
            <span>Integrated Government Gateways & Registries</span>
          </h2>
          <div className="card-subtitle">Active system connectors with national procurement and financial repositories.</div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Gateway / Registry</th>
                  <th>Function</th>
                  <th>API Endpoint</th>
                  <th>Last Sync</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{item.name}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{item.type}</span>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.74rem', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.endpoint}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{item.lastSync}</span>
                    </td>
                    <td>
                      <span className="status-pill status-pill-success">
                        <CheckCircle2 size={11} style={{ display: 'inline', marginRight: '4px' }} />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card">
          <h2 className="card-title">
            <Bell size={16} />
            <span>Automated Notification & Escalation Rules</span>
          </h2>
          <div className="card-subtitle">Configured alert triggers for nodal officers and evaluation committees.</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0F172A' }}>Critical Pilot KPI Variance Alert</div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Dispatch high-priority alert if pilot variance falls below 85% target threshold</div>
              </div>
              <input
                type="checkbox"
                checked={notificationToggles.pilotBreachAlerts}
                onChange={() => handleToggle('pilotBreachAlerts')}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0F172A' }}>Milestone Payment Payout Triggers</div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Notify Finance Division upon milestone sign-off for PFMS fund release</div>
              </div>
              <input
                type="checkbox"
                checked={notificationToggles.milestonePaymentTriggers}
                onChange={() => handleToggle('milestonePaymentTriggers')}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0F172A' }}>SMS Notification to Nodal Officers</div>
                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Send instantaneous SMS dispatch for new applications and evaluation deadlines</div>
              </div>
              <input
                type="checkbox"
                checked={notificationToggles.smsOfficerAlerts}
                onChange={() => handleToggle('smsOfficerAlerts')}
              />
            </label>
          </div>
        </div>

        {/* Security & System Audit Trail */}
        <div className="card">
          <h2 className="card-title">
            <Activity size={16} />
            <span>Recent System & Security Audit Trail</span>
          </h2>
          <div className="card-subtitle">Immutable chronological log of statutory actions and authority approvals.</div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Event / Action</th>
                  <th>Department / Registry</th>
                  <th>Authority / Sign-off</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{log.action}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#475569' }}>{log.entity}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{log.officer}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{log.time}</span>
                    </td>
                    <td>
                      <span className="status-pill status-pill-success">{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            Resetting the environment will refresh the dataset with all 10 challenges, 16 startups, 20 applications, 8 evaluations, and 6 pilots.
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
