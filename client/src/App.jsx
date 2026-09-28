import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import ProductGuideModal from './components/ProductGuideModal';

// Views
import HomeView from './views/HomeView';
import ChallengesView from './views/ChallengesView';
import StartupDiscoveryView from './views/StartupDiscoveryView';
import EligibilityScreeningView from './views/EligibilityScreeningView';
import ExpertEvaluationView from './views/ExpertEvaluationView';
import PilotWorkspaceView from './views/PilotWorkspaceView';
import PerformanceView from './views/PerformanceView';
import ProcurementView from './views/ProcurementView';
import ScaleUpView from './views/ScaleUpView';
import DocumentsView from './views/DocumentsView';
import SettingsView from './views/SettingsView';

import { CheckCircle } from 'lucide-react';

function AppContent() {
  const {
    activeTab,
    setActiveTab,
    toastMessage
  } = useApp();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showCreateChallengeModal, setShowCreateChallengeModal] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
      case 'dashboard':
        return (
          <HomeView
            onOpenCreateChallenge={() => {
              setActiveTab('challenges');
              setShowCreateChallengeModal(true);
            }}
          />
        );
      case 'challenges':
        return (
          <ChallengesView
            showCreateModalDirectly={showCreateChallengeModal}
            onCloseModalDirectly={() => setShowCreateChallengeModal(false)}
          />
        );
      case 'startups':
        return <StartupDiscoveryView />;
      case 'applications':
        return <EligibilityScreeningView />;
      case 'evaluations':
        return <ExpertEvaluationView />;
      case 'pilots':
        return <PilotWorkspaceView />;
      case 'performance':
        return <PerformanceView />;
      case 'procurement':
        return <ProcurementView />;
      case 'scale':
        return <ScaleUpView />;
      case 'documents':
        return <DocumentsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <HomeView
            onOpenCreateChallenge={() => {
              setActiveTab('challenges');
              setShowCreateChallengeModal(true);
            }}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation (240px wide) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Top Header with Search, Help, Notifications, User Profile */}
        <Topbar onOpenHelp={() => setIsHelpOpen(true)} />

        {/* View Component with generous whitespace & progressive disclosure */}
        {renderActiveView()}

        {/* Product Guide & Tour Modal */}
        <ProductGuideModal
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: '#0F172A',
              color: '#FFFFFF',
              padding: '10px 16px',
              borderRadius: '6px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.84rem',
              fontWeight: 500,
              maxWidth: '420px',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <CheckCircle size={16} color="#10B981" style={{ flexShrink: 0 }} />
            <span>{toastMessage.msg}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
