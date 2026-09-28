import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, HelpCircle, CheckCircle2, FileText, ChevronRight, X } from 'lucide-react';

export default function Topbar({ onOpenHelp }) {
  const {
    currentRole,
    unreadCount,
    notifications,
    fetchNotifications,
    setActiveTab,
    setSelectedStartupId,
    setSelectedChallengeId
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  // Debounced Search API call
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowSearchDropdown(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="app-header">
      {/* Global Search with Autocomplete */}
      <div className="header-search" ref={searchRef}>
        <Search size={15} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search challenges, startups, pilots..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowSearchDropdown(true)}
        />

        {showSearchDropdown && searchResults && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '6px',
              background: '#FFFFFF',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              maxHeight: '340px',
              overflowY: 'auto',
              zIndex: 50,
              padding: '6px'
            }}
          >
            {searchResults.challenges?.length > 0 && (
              <div style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Challenges
                </div>
                {searchResults.challenges.map((c) => (
                  <div
                    key={`c-${c.id}`}
                    onClick={() => {
                      setSelectedChallengeId(c.id);
                      setActiveTab('challenges');
                      setShowSearchDropdown(false);
                    }}
                    style={{
                      padding: '7px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{c.title}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{c.department}</span>
                  </div>
                ))}
              </div>
            )}

            {searchResults.startups?.length > 0 && (
              <div style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Startups
                </div>
                {searchResults.startups.map((s) => (
                  <div
                    key={`s-${s.id}`}
                    onClick={() => {
                      setSelectedStartupId(s.id);
                      setActiveTab('startups');
                      setShowSearchDropdown(false);
                    }}
                    style={{
                      padding: '7px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{s.name}</span>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>{s.solution}</span>
                  </div>
                ))}
              </div>
            )}

            {searchResults.challenges?.length === 0 && searchResults.startups?.length === 0 && (
              <div style={{ padding: '14px', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>
                No matching results for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Help / Guide */}
        <button
          className="header-btn"
          onClick={onOpenHelp}
          title="Product Tour & Guide"
        >
          <HelpCircle size={16} />
          <span>Help</span>
        </button>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="icon-btn"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {showNotifDropdown && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '6px',
                width: '340px',
                background: '#FFFFFF',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                zIndex: 60,
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>Notifications</span>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{unreadCount} unread</span>
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: '0.82rem' }}>
                    All caught up.
                  </div>
                ) : (
                  notifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleMarkAsRead(n.id)}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid #F1F5F9',
                        background: n.is_read ? '#FFFFFF' : '#F8FAFC',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0F172A' }}>{n.title}</span>
                        {!n.is_read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563EB' }} />}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B', lineHeight: 1.35 }}>{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '2px',
              background: 'var(--govt-navy)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            {currentRole.avatarText || 'U'}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)' }}>
              {currentRole.userName}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {currentRole.title}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
