import React from 'react';
import { useApp, ROLES } from '../context/AppContext';
import {
  Home,
  Target,
  Search,
  FileCheck,
  Award,
  FlaskConical,
  Gauge,
  Briefcase,
  TrendingUp,
  FolderOpen,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    currentRoleKey,
    setCurrentRoleKey,
    currentRole,
    unreadCount,
    showToast
  } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'startups', label: 'Startups', icon: Search },
    { id: 'applications', label: 'Applications', icon: FileCheck },
    { id: 'evaluations', label: 'Evaluations', icon: Award },
    { id: 'pilots', label: 'Pilots', icon: FlaskConical },
    { id: 'performance', label: 'Performance', icon: Gauge },
    { id: 'procurement', label: 'Procurement', icon: Briefcase },
    { id: 'scale', label: 'Scale-Up', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setCurrentRoleKey(newRole);
    showToast(`Viewing as: ${ROLES[newRole]?.title || newRole}`);
  };

  return (
    <aside className="sidebar">
      {/* Brand Identity */}
      <div className="sidebar-brand">
        <div className="platform-emblem">
          <div className="emblem-icon">PS</div>
          <div>
            <div className="platform-title">ProcureSetu</div>
            <div className="platform-subtitle">Public Procurement Portal</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.id === 'applications' && unreadCount > 0 && (
                <span className="nav-badge">{unreadCount}</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile & Demo Role Switcher */}
      <div className="sidebar-footer">
        <div className="user-profile-row">
          <div className="user-avatar">
            {currentRole.avatarText || 'U'}
          </div>
          <div className="user-meta">
            <div className="user-name">{currentRole.userName}</div>
            <div className="user-role-text">{currentRole.designation}</div>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Viewing as
          </label>
          <select
            className="role-select-box"
            value={currentRoleKey}
            onChange={handleRoleChange}
          >
            <option value="dept">Department</option>
            <option value="startup">Startup</option>
            <option value="evaluator">Evaluator</option>
            <option value="procurement">Procurement Officer</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
