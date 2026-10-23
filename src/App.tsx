import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { ConsultationModal } from './components/ConsultationModal';

// Website views
import { WebsiteHome } from './components/website/WebsiteHome';
import { WebsiteCatalogue } from './components/website/WebsiteCatalogue';
import { WebsiteFrameworks } from './components/website/WebsiteFrameworks';
import { WebsiteResources } from './components/website/WebsiteResources';

// Portal views
import { PortalLayout } from './components/portal/PortalLayout';
import { PortalDashboard } from './components/portal/PortalDashboard';
import { PortalAssessments } from './components/portal/PortalAssessments';
import { PortalTakeAssessment } from './components/portal/PortalTakeAssessment';
import { PortalScorecard } from './components/portal/PortalScorecard';
import { PortalOrganization } from './components/portal/PortalOrganization';
import { PortalControls } from './components/portal/PortalControls';
import { PortalRisks } from './components/portal/PortalRisks';
import { PortalCompliance } from './components/portal/PortalCompliance';
import { PortalAuditActions } from './components/portal/PortalAuditActions';
import { PortalSecOps } from './components/portal/PortalSecOps';
import { PortalSettings } from './components/portal/PortalSettings';
import { PortalActivityLog } from './components/portal/PortalActivityLog';

// IT Administration Console
import { ITAdminSettings } from './components/admin/ITAdminSettings';

// Workspace views
import { WorkspaceLayout } from './components/workspace/WorkspaceLayout';
import { WorkspacePipeline } from './components/workspace/WorkspacePipeline';
import { WorkspaceReviewQueue } from './components/workspace/WorkspaceReviewQueue';
import { WorkspaceSurveys } from './components/workspace/WorkspaceSurveys';
import { WorkspaceWorkload } from './components/workspace/WorkspaceWorkload';
import { WorkspaceConfirmations } from './components/workspace/WorkspaceConfirmations';

export const AppContent: React.FC = () => {
  const { view, currentUser, setView, setShowAuthModal } = useApp();

  const isCustomer = currentUser.persona === 'customer_admin' || currentUser.persona === 'customer_assessor';
  const isGrcStaff = currentUser.persona === 'grc_consultant' || currentUser.persona === 'grc_manager';

  // Route 1: Customer Portal Layout - ONLY accessible if logged in as customer
  if (view.startsWith('portal_')) {
    if (!isCustomer) {
      // If unauthenticated guest or non-customer, protect portal and prompt customer sign in
      return (
        <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
          <Header />
          <main className="flex-1">
            <WebsiteHome />
          </main>
          <Footer />
          <AuthModal />
          <ConsultationModal />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
        <Header />
        <PortalLayout>
          {view === 'portal_dashboard' && <PortalDashboard />}
          {view === 'portal_assessments' && <PortalAssessments />}
          {view === 'portal_take_assessment' && <PortalTakeAssessment />}
          {view === 'portal_scorecard' && <PortalScorecard />}
          {view === 'portal_organization' && <PortalOrganization />}
          {view === 'portal_controls' && <PortalControls />}
          {view === 'portal_risks' && <PortalRisks />}
          {view === 'portal_assets' && <PortalRisks />}
          {view === 'portal_compliance' && <PortalCompliance />}
          {view === 'portal_actions' && <PortalAuditActions />}
          {view === 'portal_secops' && <PortalSecOps />}
          {view === 'portal_activity' && <PortalActivityLog />}
          {view === 'portal_settings' && <PortalSettings />}
        </PortalLayout>
        <Footer />
        <AuthModal />
        <ConsultationModal />
      </div>
    );
  }

  // Route 2: IT & System Administration Console
  if (view === 'admin_settings') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
        <Header />
        <main className="flex-1">
          <ITAdminSettings />
        </main>
        <Footer />
        <AuthModal />
        <ConsultationModal />
      </div>
    );
  }

  // Route 3: Internal GRC Team Workspace - ONLY accessible if logged in as GRC Staff
  if (view.startsWith('workspace_')) {
    if (!isGrcStaff) {
      // Non-GRC team member cannot view workspace; redirect to home
      return (
        <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
          <Header />
          <main className="flex-1">
            <WebsiteHome />
          </main>
          <Footer />
          <AuthModal />
          <ConsultationModal />
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
        <Header />
        <WorkspaceLayout>
          {view === 'workspace_pipeline' && <WorkspacePipeline />}
          {view === 'workspace_review_queue' && <WorkspaceReviewQueue />}
          {view === 'workspace_surveys' && <WorkspaceSurveys />}
          {view === 'workspace_workload' && <WorkspaceWorkload />}
          {view === 'workspace_confirmations' && <WorkspaceConfirmations />}
        </WorkspaceLayout>
        <Footer />
        <AuthModal />
        <ConsultationModal />
      </div>
    );
  }

  // Route 3: Public Website
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
      <Header />
      <main className="flex-1">
        {view === 'website_home' && <WebsiteHome />}
        {view === 'website_products' && <WebsiteHome />}
        {view === 'website_catalogue' && <WebsiteCatalogue />}
        {view === 'website_frameworks' && <WebsiteFrameworks />}
        {(view === 'website_resources' ||
          view === 'website_about' ||
          view === 'website_contact' ||
          view === 'website_faqs' ||
          view === 'website_privacy' ||
          view === 'website_terms') && <WebsiteResources />}
      </main>
      <Footer />
      <AuthModal />
      <ConsultationModal />
    </div>
  );
};
