import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  FlaskConical,
  Briefcase,
  TrendingUp,
  CreditCard,
  Target
} from 'lucide-react';

export default function NotificationsView() {
  const { notifications, fetchNotifications, setActiveTab, showToast } = useApp();

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'challenge': return <Target size={18} color="#1D4ED8" />;
      case 'application': return <FileCheck size={18} color="#059669" />;
      case 'evaluation': return <Award size={18} color="#7C3AED" />;
      case 'pilot': return <FlaskConical size={18} color="#2563EB" />;
      case 'performance': return <AlertCircle size={18} color="#D97706" />;
      case 'procurement': return <Briefcase size={18} color="#15803D" />;
      case 'payment': return <CreditCard size={18} color="#0284C7" />;
      case 'scale': return <TrendingUp size={18} color="#16A34A" />;
      default: return <Bell size={18} color="#64748B" />;
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">System Notifications & Audit Log</h1>
          <p className="page-desc">
            Module 13 — Event-driven activity feed tracking procurement milestones and inter-departmental triggers.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            notifications.forEach(n => {
              if (!n.is_read) handleMarkAsRead(n.id);
            });
            showToast("All notifications marked as read.");
          }}
        >
          <CheckCircle2 size={14} />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkAsRead(n.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '8px',
                  background: n.is_read ? '#FFFFFF' : '#EFF6FF',
                  border: n.is_read ? '1px solid #E2E8F0' : '1px solid #BFDBFE',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ padding: '8px', background: '#FFFFFF', borderRadius: '6px', border: '1px solid #E2E8F0', marginTop: '2px' }}>
                    {getIconForType(n.type)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0B2545' }}>
                        {n.title}
                      </span>
                      {!n.is_read && (
                        <span className="badge badge-open" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                          New
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.84rem', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                      {n.message}
                    </p>

                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '6px' }}>
                      {n.created_at}
                    </div>
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (n.type === 'challenge') setActiveTab('challenges');
                      else if (n.type === 'application') setActiveTab('applications');
                      else if (n.type === 'evaluation') setActiveTab('evaluations');
                      else if (n.type === 'pilot') setActiveTab('pilots');
                      else if (n.type === 'performance') setActiveTab('performance');
                      else if (n.type === 'procurement') setActiveTab('procurement');
                      else if (n.type === 'payment') setActiveTab('payments');
                      else if (n.type === 'scale') setActiveTab('scale');
                    }}
                  >
                    View Stage →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
