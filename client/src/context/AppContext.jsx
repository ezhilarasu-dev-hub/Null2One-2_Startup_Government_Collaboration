import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const ROLES = {
  dept: {
    id: 'dept',
    title: 'Department',
    userName: 'Rajesh Kumar',
    designation: 'Executive Engineer',
    entity: 'Public Works Department',
    avatarText: 'RK',
    greeting: 'Welcome, Rajesh Kumar',
    pendingTasks: [
      { id: 1, label: 'Review 2 startup applications', targetTab: 'applications', btnText: 'Review' },
      { id: 2, label: 'Validate 1 pilot', targetTab: 'performance', btnText: 'Open pilot' },
      { id: 3, label: 'Approve 1 procurement decision', targetTab: 'procurement', btnText: 'Review' }
    ]
  },
  startup: {
    id: 'startup',
    title: 'Startup',
    userName: 'Vikram Roy',
    designation: 'Founder & Director',
    entity: 'WaterSense Solutions Pvt Ltd',
    avatarText: 'VR',
    greeting: 'Welcome, Vikram Roy',
    pendingTasks: [
      { id: 1, label: 'Submit Milestone 4 pilot deliverables', targetTab: 'pilots', btnText: 'Update' },
      { id: 2, label: 'Review 3 open challenges', targetTab: 'challenges', btnText: 'Browse' }
    ]
  },
  evaluator: {
    id: 'evaluator',
    title: 'Evaluator',
    userName: 'Dr. K. S. Sharma',
    designation: 'Technical Committee Member',
    entity: 'State Technical Advisory Board',
    avatarText: 'KS',
    greeting: 'Welcome, Dr. K. S. Sharma',
    pendingTasks: [
      { id: 1, label: 'Score 1 candidate technical proposal', targetTab: 'evaluations', btnText: 'Evaluate' },
      { id: 2, label: 'Review pilot benchmark audit', targetTab: 'performance', btnText: 'Inspect' }
    ]
  },
  procurement: {
    id: 'procurement',
    title: 'Procurement Officer',
    userName: 'Priya Sharma',
    designation: 'Senior Procurement Officer',
    entity: 'Public Procurement Division',
    avatarText: 'PS',
    greeting: 'Welcome, Priya Sharma',
    pendingTasks: [
      { id: 1, label: 'Authorize 1 procurement decision', targetTab: 'procurement', btnText: 'Review' },
      { id: 2, label: 'Review statewide expansion plan', targetTab: 'scale', btnText: 'View' }
    ]
  }
};

export function AppProvider({ children }) {
  const [currentRoleKey, setCurrentRoleKey] = useState('dept');
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedStartupId, setSelectedStartupId] = useState(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentRole = ROLES[currentRoleKey] || ROLES.dept;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        const unread = data.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const resetAllData = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        showToast("Demonstration workspace reset to initial state.");
        fetchNotifications();
        setCurrentRoleKey('dept');
        setActiveTab('home');
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to reset:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ROLES,
        currentRoleKey,
        setCurrentRoleKey,
        currentRole,
        activeTab,
        setActiveTab,
        notifications,
        unreadCount,
        fetchNotifications,
        selectedStartupId,
        setSelectedStartupId,
        selectedChallengeId,
        setSelectedChallengeId,
        resetAllData,
        showToast,
        toastMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
