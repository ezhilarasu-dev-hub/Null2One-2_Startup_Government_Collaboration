import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  Send,
  Building,
  AlertCircle
} from 'lucide-react';

export default function MilestonePaymentsView() {
  const { showToast } = useApp();
  const [paymentsData, setPaymentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/payments');
      if (res.ok) {
        const data = await res.json();
        setPaymentsData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReleasePayment = async (paymentId, title, amount) => {
    try {
      setProcessingId(paymentId);
      const res = await fetch(`/api/payments/${paymentId}/pay`, {
        method: 'POST'
      });

      if (res.ok) {
        const result = await res.json();
        showToast(`PFMS Disbursement Released! ₹${amount.toLocaleString('en-IN')} paid for ${title}. Ref: ${result.transactionRef}`);
        fetchPayments();
      } else {
        alert("Payment release failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error releasing payment");
    } finally {
      setProcessingId(null);
    }
  };

  const formatINR = (val) => {
    return '₹' + (val || 0).toLocaleString('en-IN');
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Milestone-Based Payment Tracking</h1>
          <p className="page-desc">
            Module 11 — Transparent milestone escrows linked to verified technical performance gates.
          </p>
        </div>

        <span className="badge badge-neutral" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          Simulated PFMS (Public Financial Management System)
        </span>
      </div>

      {/* Demonstration Banner */}
      <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '10px 16px', borderRadius: '6px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#475569' }}>
        <AlertCircle size={18} color="#64748B" style={{ flexShrink: 0 }} />
        <span>
          <strong>Prototype Simulation Notice:</strong> This ledger demonstrates automated milestone-based fund release upon independent technical validation. No real financial transactions or banking credentials are used.
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Contract Value</div>
          <div className="stat-val">
            {paymentsData ? formatINR(paymentsData.summary.totalContractValue) : '₹6,00,000'}
          </div>
          <div className="stat-subtext">Cumulative Approved Pilots</div>
        </div>

        <div className="stat-card accent-green">
          <div className="stat-label">Disbursed (Paid)</div>
          <div className="stat-val" style={{ color: '#15803D' }}>
            {paymentsData ? formatINR(paymentsData.summary.paidAmount) : '₹4,25,000'}
          </div>
          <div className="stat-subtext">Verified Milestone Deliverables</div>
        </div>

        <div className="stat-card accent-amber">
          <div className="stat-label">Escrowed (Pending)</div>
          <div className="stat-val" style={{ color: '#B45309' }}>
            {paymentsData ? formatINR(paymentsData.summary.pendingAmount) : '₹1,75,000'}
          </div>
          <div className="stat-subtext">Awaiting Validation Gates</div>
        </div>
      </div>

      {/* Milestone Payments Table */}
      <div className="card">
        <h2 className="card-title">
          <CreditCard size={18} color="#133E87" />
          Milestone Disbursement Ledger
        </h2>
        <div className="card-subtitle">
          Payments automatically unlocked as milestone gates in Module 7 & 9 achieve verified status.
        </div>

        <div className="table-responsive">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Milestone Details</th>
                <th>Startup & Project</th>
                <th>Department</th>
                <th>Amount</th>
                <th>Status</th>
                <th>PFMS Ref / Date</th>
                <th style={{ textAlign: 'right' }}>Disbursement Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentsData?.payments.map((p) => {
                const isPaid = p.status === 'Paid';
                const isProcessing = processingId === p.id;

                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0B2545' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Milestone Gate #{p.milestone_number}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>{p.startup_name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        {p.challenge_title}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.82rem' }}>{p.department}</span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, color: '#0B2545', fontSize: '0.92rem' }}>
                        {formatINR(p.amount)}
                      </span>
                    </td>

                    <td>
                      {isPaid ? (
                        <span className="badge badge-scaled">
                          <CheckCircle2 size={12} />
                          <span>Paid</span>
                        </span>
                      ) : (
                        <span className="badge badge-evaluation">
                          <Clock size={12} />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    <td>
                      <div style={{ fontSize: '0.78rem', color: isPaid ? '#15803D' : '#94A3B8' }}>
                        {p.transaction_ref || 'Awaiting Gate Clearance'}
                      </div>
                      {p.paid_date && (
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                          Disbursed on {p.paid_date}
                        </div>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {isPaid ? (
                        <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 600 }}>
                          Disbursed ✓
                        </span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={isProcessing}
                          onClick={() => handleReleasePayment(p.id, p.title, p.amount)}
                        >
                          <Send size={13} />
                          <span>{isProcessing ? 'Releasing...' : 'Release Payment'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
