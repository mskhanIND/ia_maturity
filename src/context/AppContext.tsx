import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AssessmentDoc,
  AssessmentAnswer,
  EntityRecord,
  AuditIssue,
  IAMaturityAction,
  SettingsConfig,
  MaturityBand,
  ActivityLog,
  QuestionComment,
  EmailNotificationItem,
  SubscriptionPlan,
  WorkflowConfig,
  FrappeSyncConfig
} from '../types';
import { QUESTIONS, SECTIONS, DEFAULT_BANDS, TEMPLATE_INFO } from '../data/templateData';
import {
  SEED_ENTITIES,
  SEED_ISSUES,
  SEED_CONTROLS,
  SEED_RISKS,
  SEED_ASSETS,
  SEED_INCIDENTS,
  SEED_FOLLOW_UPS,
  GRCControl,
  GRCRisk,
  GRCAsset,
  SecurityIncident,
  FollowUpLog
} from '../data/grcData';
import { INITIAL_ACTIVITY_LOGS } from '../data/activityLogData';
import { INITIAL_QUESTION_COMMENTS } from '../data/commentData';
import { INITIAL_EMAIL_NOTIFICATIONS } from '../data/emailNotificationData';
import { computeScores, PRIORITY, LETTERS } from '../utils/scoring';
import { calculateClosureStats, letterForClosureTime, describeClosureStats } from '../utils/issues';
import { Language } from '../utils/i18n';

export type AppView =
  | 'website_home'
  | 'website_products'
  | 'website_catalogue'
  | 'website_frameworks'
  | 'website_resources'
  | 'website_about'
  | 'website_contact'
  | 'website_faqs'
  | 'website_privacy'
  | 'website_terms'
  | 'portal_dashboard'
  | 'portal_organization'
  | 'portal_assessments'
  | 'portal_take_assessment'
  | 'portal_scorecard'
  | 'portal_controls'
  | 'portal_risks'
  | 'portal_assets'
  | 'portal_compliance'
  | 'portal_actions'
  | 'portal_secops'
  | 'portal_activity'
  | 'portal_settings'
  | 'workspace_pipeline'
  | 'workspace_surveys'
  | 'workspace_review_queue'
  | 'workspace_workload'
  | 'workspace_confirmations'
  | 'admin_settings';

export type UserPersona = 'guest' | 'customer_admin' | 'customer_assessor' | 'grc_consultant' | 'grc_manager' | 'it_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  persona: UserPersona;
  orgId: string;
  orgName: string;
  roleTitle: string;
  isVerified: boolean;
}

export const PRESET_USERS: Record<UserPersona, UserProfile> = {
  guest: {
    id: 'usr-guest',
    name: 'Guest Visitor',
    email: 'visitor@company.com',
    persona: 'guest',
    orgId: '',
    orgName: '',
    roleTitle: 'Prospective Client',
    isVerified: false,
  },
  customer_admin: {
    id: 'usr-sa1',
    name: 'Sarah Al-Ghamdi',
    email: 'sarah.ghamdi@alnoor-finance.sa',
    persona: 'customer_admin',
    orgId: 'ent-1',
    orgName: 'Al-Noor Financial Group',
    roleTitle: 'Chief Audit Executive (CAE)',
    isVerified: true,
  },
  customer_assessor: {
    id: 'usr-fa2',
    name: 'Fahad Al-Otaibi',
    email: 'fahad.otaibi@alnoor-finance.sa',
    persona: 'customer_assessor',
    orgId: 'ent-1',
    orgName: 'Al-Noor Financial Group',
    roleTitle: 'Senior Internal Audit Lead',
    isVerified: true,
  },
  grc_consultant: {
    id: 'usr-tm3',
    name: 'Tariq Al-Mansoor',
    email: 't.mansoor@irsaa.com',
    persona: 'grc_consultant',
    orgId: 'irsaa-hq',
    orgName: 'IRSAA Business Solutions',
    roleTitle: 'Senior GRC Consultant & Assessor',
    isVerified: true,
  },
  grc_manager: {
    id: 'usr-kz4',
    name: 'Dr. Khalid Al-Zahrani',
    email: 'k.zahrani@irsaa.com',
    persona: 'grc_manager',
    orgId: 'irsaa-hq',
    orgName: 'IRSAA Business Solutions',
    roleTitle: 'Director of GRC Advisory Services',
    isVerified: true,
  },
  it_admin: {
    id: 'usr-it5',
    name: 'Majed Al-Mutairi',
    email: 'm.mutairi@irsaa.com',
    persona: 'it_admin',
    orgId: 'irsaa-hq',
    orgName: 'IRSAA Technology & Security',
    roleTitle: 'Lead IT Systems & Infrastructure Admin',
    isVerified: true,
  },
};

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  view: AppView;
  setView: (view: AppView) => void;
  currentUser: UserProfile;
  switchPersona: (persona: UserPersona) => void;
  organizations: EntityRecord[];
  addOrganization: (org: Omit<EntityRecord, 'id'>) => string;
  assessments: AssessmentDoc[];
  activeAssessment: AssessmentDoc | null;
  setActiveAssessmentId: (id: string | null) => void;
  startAssessment: (entityName: string, role: string, jobTitle: string, lang: 'en' | 'ar') => string;
  updateAssessmentAnswer: (assessmentId: string, questionCode: string, option: string, comment?: string, evidence?: string) => void;
  submitAssessment: (assessmentId: string) => boolean;
  resubmitAssessment: (assessmentId: string) => void;
  reviewerUpdateStatus: (assessmentId: string, status: AssessmentDoc['review_status'], comments: string, releaseOfficialReport?: boolean) => void;
  auditIssues: AuditIssue[];
  addAuditIssue: (issue: Omit<AuditIssue, 'id'>) => void;
  auditActions: IAMaturityAction[];
  updateActionStatus: (id: string, status: IAMaturityAction['status']) => void;
  controls: GRCControl[];
  updateControl: (id: string, status: GRCControl['status'], testResult: GRCControl['testResult']) => void;
  risks: GRCRisk[];
  addRisk: (risk: Omit<GRCRisk, 'id'>) => void;
  assets: GRCAsset[];
  incidents: SecurityIncident[];
  followUps: FollowUpLog[];
  addFollowUpLog: (log: Omit<FollowUpLog, 'id' | 'logged_at'>) => void;
  settings: SettingsConfig;
  updateSettings: (newSettings: Partial<SettingsConfig>) => void;
  // Methodology Confirmation toggles (Scope Item 5)
  confirmPolicy: (key: 'q1Gating' | 'q20AllowNa' | 'q13IssueRegister' | 'equalWeights', value: boolean) => void;
  q1GatingEnabled: boolean;
  q20AllowNaEnabled: boolean;
  q13IssueRegisterEnabled: boolean;
  equalWeightsEnabled: boolean;
  // Auth & Org registration dialog
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showConsultationModal: boolean;
  setShowConsultationModal: (show: boolean) => void;
  registerCustomer: (email: string, fullName: string, orgName: string, sector: string) => void;
  logout: () => void;
  activityLogs: ActivityLog[];
  logActivity: (
    entry: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole' | 'orgName'> &
      Partial<Pick<ActivityLog, 'userId' | 'userName' | 'userRole' | 'orgName'>>
  ) => void;
  questionComments: QuestionComment[];
  addQuestionComment: (comment: {
    assessment_id: string;
    question_code: string;
    message: string;
    attachment?: string;
    status?: 'open' | 'resolved';
  }) => void;
  resolveQuestionThread: (
    assessment_id: string,
    question_code: string,
    status: 'open' | 'resolved'
  ) => void;
  notifications: EmailNotificationItem[];
  triggerEmailNotification: (params: Omit<EmailNotificationItem, 'id' | 'sent_at'>) => void;
  runBackgroundDeadlineCheck: () => number;
  subscription: SubscriptionPlan;
  updateSubscription: (newPlan: Partial<SubscriptionPlan>) => void;
  workflowConfig: WorkflowConfig;
  updateWorkflowConfig: (newConfig: Partial<WorkflowConfig>) => void;
  frappeConfig: FrappeSyncConfig;
  updateFrappeConfig: (newConfig: Partial<FrappeSyncConfig>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('iam_language') as Language) || 'en';
  });

  const [view, setView] = useState<AppView>('website_home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS.guest);
  const [organizations, setOrganizations] = useState<EntityRecord[]>(SEED_ENTITIES);
  const [auditIssues, setAuditIssues] = useState<AuditIssue[]>(SEED_ISSUES);
  const [controls, setControls] = useState<GRCControl[]>(SEED_CONTROLS);
  const [risks, setRisks] = useState<GRCRisk[]>(SEED_RISKS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [questionComments, setQuestionComments] = useState<QuestionComment[]>(INITIAL_QUESTION_COMMENTS);
  const [assets] = useState<GRCAsset[]>(SEED_ASSETS);
  const [incidents] = useState<SecurityIncident[]>(SEED_INCIDENTS);
  const [followUps, setFollowUps] = useState<FollowUpLog[]>(SEED_FOLLOW_UPS);
  const [notifications, setNotifications] = useState<EmailNotificationItem[]>(INITIAL_EMAIL_NOTIFICATIONS);

  const [subscription, setSubscription] = useState<SubscriptionPlan>({
    plan_tier: 'trial',
    plan_name: 'Trial Version (14-Day Evaluation)',
    plan_name_ar: 'النسخة التجريبية (تقييم مجاني 14 يوماً)',
    status: 'active',
    trial_start_date: '2026-10-18',
    trial_end_date: '2026-11-01',
    days_remaining: 9,
    trial_duration_days: 14,
    max_assessments: 5,
    used_assessments: 3,
    max_team_members: 5,
    used_team_members: 3,
    max_storage_gb: 5,
    used_storage_gb: 1.2,
    features: [
      '20-Question GIAS 2024 Maturity Assessment',
      'Unified Saudi Regulatory Catalog (NCA, SAMA, CMA, PDPL)',
      'Anonymous Peer Benchmarking (5+ Peers)',
      'Automated Issue Closure Metric Engine',
      'Board-Ready PDF Report & Radar Scorecards',
      'Threaded Consultant Clarifications',
      'Independent Frappe Framework Deployment Export',
    ],
    features_ar: [
      'استبيان نضج التدقيق الداخلي (20 سؤالاً معايير GIAS 2024)',
      'دليل الضوابط الرقابية الموحد للمملكة (NCA, SAMA, CMA, PDPL)',
      'المقارنة المعيارية المجهولة مع النظراء (5 جهات فأكثر)',
      'محرك الاحتساب الآلي لمتوسط إغلاق الملاحظات',
      'تصدير تقرير مجلس الإدارة وبطاقات الأداء الرادارية',
      'نظام استفسارات ونقاشات مراجعي الحوكمة المترابطة',
      'تصدير ونشر مستقل على بيئة منصة فرابي (Frappe Framework)',
    ],
  });

  const [workflowConfig, setWorkflowConfig] = useState<WorkflowConfig>({
    require_dual_approval: true,
    allow_customer_reopen: true,
    clarification_sla_days: 5,
    auto_remind_days_before_deadline: 2,
    enforce_gating_caps: true,
    allow_self_assessment_draft: true,
    require_mandatory_evidence_for_c_d: true,
    enable_automated_email_dispatcher: true,
  });

  const [frappeConfig, setFrappeConfig] = useState<FrappeSyncConfig>({
    server_url: 'https://erp.irsaa.sa',
    api_key: 'frappe_live_key_91024',
    api_secret: '********************',
    app_module: 'irsaa_grc',
    sync_mode: 'standalone_export',
    last_sync: '2026-10-23 07:30',
    connected: true,
    enable_realtime_webhooks: true,
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  // Policy Confirmations (from scope point 5)
  const [q1GatingEnabled, setQ1GatingEnabled] = useState(true);
  const [q20AllowNaEnabled, setQ20AllowNaEnabled] = useState(true);
  const [q13IssueRegisterEnabled, setQ13IssueRegisterEnabled] = useState(true);
  const [equalWeightsEnabled, setEqualWeightsEnabled] = useState(true);

  const [settings, setSettings] = useState<SettingsConfig>({
    points_a: 25,
    points_b: 50,
    points_c: 75,
    points_d: 100,
    weighting_method: 'Points',
    bands: DEFAULT_BANDS,
    create_actions_for: 'A and B',
    evidence_required_from: 'C and D',
    enable_benchmarking: true,
    benchmark_peer_group: 'All entities',
    benchmark_min_peers: 3,
    issue_lookback_months: 24,
    issue_min_sample: 4,
    closure_a_above: 12,
    closure_b_above: 9,
    closure_c_above: 6,
    lock_auto_answers: false,
    client_show_summary: true,
    client_show_sections: true,
    client_show_benchmark: true,
    client_show_findings: true,
    client_show_roadmap: true,
    client_show_responses: true,
    client_show_reviewer_comments: true,
    client_show_scoring_method: true,
  });

  // Seed sample assessments
  const [assessments, setAssessments] = useState<AssessmentDoc[]>(() => {
    // Generate initial submitted assessment for Al-Noor Finance
    const alNoorAnswers: AssessmentAnswer[] = QUESTIONS.map((q, idx) => {
      let sel = 'C';
      if (idx === 0) sel = 'C'; // Q1
      if (idx === 2) sel = 'B'; // Q3 finding
      if (idx === 4) sel = 'B'; // Q5 finding
      if (idx === 8) sel = 'D'; // Q9
      if (idx === 12) sel = 'D'; // Q13
      if (idx === 14) sel = 'A'; // Q15 immediate finding
      if (idx === 19) sel = 'C'; // Q20
      return {
        question_code: q.question_code,
        section_code: q.section_code,
        short_label: q.short_label,
        short_label_ar: q.short_label_ar,
        question_text: q.question_text,
        question_text_ar: q.question_text_ar,
        selected_option: sel as any,
        points: sel === 'A' ? 25 : sel === 'B' ? 50 : sel === 'C' ? 75 : 100,
        comment: sel === 'D' ? 'Certified by external assessor during 2025 QAIP review' : 'Internal charter and guidelines approved.',
        evidence: sel === 'D' ? 'QAIP_Certificate_2025.pdf' : '',
        is_gating: q.is_gating,
        gate_trigger: q.gate_trigger,
        gate_cap_level: q.gate_cap_level,
      };
    });

    const alNoorScore = computeScores(alNoorAnswers);

    const alNoorDoc: AssessmentDoc = {
      id: 'ASM-2026-001',
      name: 'ASM-2026-001 (Al-Noor Financial Group)',
      docstatus: 1, // Submitted
      entity: 'Al-Noor Financial Group',
      template: TEMPLATE_INFO.name,
      assessment_date: '2026-10-18',
      job_title: 'Chief Audit Executive (CAE)',
      respondent: 'sarah.ghamdi@alnoor-finance.sa',
      respondent_name: 'Sarah Al-Ghamdi',
      respondent_email: 'sarah.ghamdi@alnoor-finance.sa',
      respondent_role: 'Chief Audit Executive',
      language: 'en',
      overall_score: alNoorScore.overall_score,
      overall_points: alNoorScore.overall_points,
      max_points: alNoorScore.max_points,
      maturity_level: alNoorScore.maturity_level,
      score_level: alNoorScore.score_level,
      color: alNoorScore.color,
      interpretation: alNoorScore.interpretation,
      interpretation_ar: alNoorScore.interpretation_ar,
      gating_note: alNoorScore.gating_note,
      gating_note_ar: alNoorScore.gating_note_ar,
      answered_count: alNoorScore.answered_count,
      question_count: alNoorScore.question_count,
      na_count: alNoorScore.na_count,
      findings_count: alNoorScore.findings_count,
      immediate_count: alNoorScore.immediate_count,
      review_status: 'Approved',
      reviewer: 'Dr. Khalid Al-Zahrani',
      reviewed_on: '2026-10-21',
      reviewer_comments: 'Comprehensive responses verified. Quality assurance and independent confirmation provided for Section 3 & 5. Approved for release to Board Audit Committee.',
      modified: '2026-10-21 14:30',
      answers: alNoorAnswers,
      section_scores: alNoorScore.sections,
    };

    // Peer 2: Riyadh Medical
    const medAnswers: AssessmentAnswer[] = QUESTIONS.map((q, idx) => ({
      question_code: q.question_code,
      section_code: q.section_code,
      short_label: q.short_label,
      short_label_ar: q.short_label_ar,
      question_text: q.question_text,
      question_text_ar: q.question_text_ar,
      selected_option: (idx % 2 === 0 ? 'B' : 'C') as any,
      points: idx % 2 === 0 ? 50 : 75,
      comment: 'Reviewed against healthcare standards.',
      evidence: '',
    }));
    const medScore = computeScores(medAnswers);

    const medDoc: AssessmentDoc = {
      id: 'ASM-2026-002',
      name: 'ASM-2026-002 (Riyadh Medical Holding)',
      docstatus: 1,
      entity: 'Riyadh Medical Holding Company',
      template: TEMPLATE_INFO.name,
      assessment_date: '2026-09-30',
      job_title: 'Audit Committee Secretary',
      respondent: 'audit@riyadhmed.sa',
      respondent_name: 'Dr. Munir Al-Harbi',
      respondent_email: 'audit@riyadhmed.sa',
      respondent_role: 'Audit Committee Member',
      language: 'ar',
      overall_score: medScore.overall_score,
      overall_points: medScore.overall_points,
      max_points: medScore.max_points,
      maturity_level: medScore.maturity_level,
      score_level: medScore.score_level,
      color: medScore.color,
      interpretation: medScore.interpretation,
      interpretation_ar: medScore.interpretation_ar,
      gating_note: medScore.gating_note,
      gating_note_ar: medScore.gating_note_ar,
      answered_count: medScore.answered_count,
      question_count: medScore.question_count,
      na_count: medScore.na_count,
      findings_count: medScore.findings_count,
      immediate_count: medScore.immediate_count,
      review_status: 'Approved',
      reviewer: 'Tariq Al-Mansoor',
      reviewed_on: '2026-10-05',
      reviewer_comments: 'Good foundation in place. Improvement required in IT & cybersecurity audit capabilities.',
      modified: '2026-10-05 10:15',
      answers: medAnswers,
      section_scores: medScore.sections,
    };

    // Peer 3: Arabian Energy
    const nrgAnswers: AssessmentAnswer[] = QUESTIONS.map((q, idx) => ({
      question_code: q.question_code,
      section_code: q.section_code,
      short_label: q.short_label,
      short_label_ar: q.short_label_ar,
      question_text: q.question_text,
      question_text_ar: q.question_text_ar,
      selected_option: (idx % 3 === 0 ? 'D' : 'C') as any,
      points: idx % 3 === 0 ? 100 : 75,
      comment: 'Aligned with critical infrastructure cybersecurity and internal audit guidelines.',
      evidence: '',
    }));
    const nrgScore = computeScores(nrgAnswers);

    const nrgDoc: AssessmentDoc = {
      id: 'ASM-2026-003',
      name: 'ASM-2026-003 (Arabian Energy Technologies)',
      docstatus: 1,
      entity: 'Arabian Energy Technologies',
      template: TEMPLATE_INFO.name,
      assessment_date: '2026-10-01',
      job_title: 'Head of Internal Audit',
      respondent: 'grc@arabianenergy.sa',
      respondent_name: 'Eng. Saud Al-Dossary',
      respondent_email: 'grc@arabianenergy.sa',
      respondent_role: 'Chief Audit Executive',
      language: 'en',
      overall_score: nrgScore.overall_score,
      overall_points: nrgScore.overall_points,
      max_points: nrgScore.max_points,
      maturity_level: nrgScore.maturity_level,
      score_level: nrgScore.score_level,
      color: nrgScore.color,
      interpretation: nrgScore.interpretation,
      interpretation_ar: nrgScore.interpretation_ar,
      gating_note: nrgScore.gating_note,
      gating_note_ar: nrgScore.gating_note_ar,
      answered_count: nrgScore.answered_count,
      question_count: nrgScore.question_count,
      na_count: nrgScore.na_count,
      findings_count: nrgScore.findings_count,
      immediate_count: nrgScore.immediate_count,
      review_status: 'Approved',
      reviewer: 'Dr. Khalid Al-Zahrani',
      reviewed_on: '2026-10-08',
      reviewer_comments: 'High maturity organization. Good benchmarking benchmark for peers in the sector.',
      modified: '2026-10-08 16:00',
      answers: nrgAnswers,
      section_scores: nrgScore.sections,
    };

    // Assessment in progress: Saudi Logistics
    const logAnswers: AssessmentAnswer[] = QUESTIONS.map((q, idx) => ({
      question_code: q.question_code,
      section_code: q.section_code,
      short_label: q.short_label,
      short_label_ar: q.short_label_ar,
      question_text: q.question_text,
      question_text_ar: q.question_text_ar,
      selected_option: (idx < 12 ? (idx % 2 === 0 ? 'B' : 'A') : '') as any,
      points: idx < 12 ? (idx % 2 === 0 ? 50 : 25) : 0,
      comment: '',
      evidence: '',
    }));
    const logScore = computeScores(logAnswers);

    const logDoc: AssessmentDoc = {
      id: 'ASM-2026-004',
      name: 'ASM-2026-004 (Saudi Logistics & Supply Chain)',
      docstatus: 0, // Draft / In Progress
      entity: 'Saudi Logistics & Supply Chain Co.',
      template: TEMPLATE_INFO.name,
      assessment_date: '2026-10-22',
      job_title: 'Compliance & Audit Manager',
      respondent: 'compliance@saudilogistics.sa',
      respondent_name: 'Majed Al-Mutairi',
      respondent_email: 'compliance@saudilogistics.sa',
      respondent_role: 'Internal Audit Staff',
      language: 'ar',
      overall_score: logScore.overall_score,
      overall_points: logScore.overall_points,
      max_points: logScore.max_points,
      maturity_level: logScore.maturity_level,
      score_level: logScore.score_level,
      color: logScore.color,
      interpretation: logScore.interpretation,
      interpretation_ar: logScore.interpretation_ar,
      gating_note: logScore.gating_note,
      gating_note_ar: logScore.gating_note_ar,
      answered_count: logScore.answered_count,
      question_count: logScore.question_count,
      na_count: logScore.na_count,
      findings_count: logScore.findings_count,
      immediate_count: logScore.immediate_count,
      review_status: 'Pending Review',
      modified: '2026-10-22 18:20',
      due_date: '2026-10-25',
      answers: logAnswers,
      section_scores: logScore.sections,
    };

    return [alNoorDoc, medDoc, nrgDoc, logDoc];
  });

  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>('ASM-2026-001');

  // Generate Action items from assessment findings
  const [auditActions, setAuditActions] = useState<IAMaturityAction[]>(() => {
    return [
      {
        id: 'act-1',
        assessment_id: 'ASM-2026-001',
        entity: 'Al-Noor Financial Group',
        question_code: 'Q3',
        section_title: 'Governance, Independence & Ethics',
        finding_title: 'Q3 – Whistleblowing channel lacks certified fraud examiners and proactive analytics',
        priority: 'High',
        timeframe: '3–6 months',
        due_date: '2027-04-18',
        action_owner: 'Audit Committee / CAE',
        current_level: 'B – Foundational',
        current_state: 'Basic channel exists but is poorly communicated; fraud considered ad hoc',
        target_level: 'C – Established',
        recommended_action: 'Formal, confidential and anonymous channel with Audit Committee oversight; fraud risk built into the audit plan',
        status: 'In Progress',
      },
      {
        id: 'act-2',
        assessment_id: 'ASM-2026-001',
        entity: 'Al-Noor Financial Group',
        question_code: 'Q5',
        section_title: 'Risk-Based Audit Planning',
        finding_title: 'Q5 – Emerging risk horizon scanning not formalized',
        priority: 'High',
        timeframe: '3–6 months',
        due_date: '2027-04-18',
        action_owner: 'CAE',
        current_level: 'B – Foundational',
        current_state: 'Discussed informally but not documented',
        target_level: 'C – Established',
        recommended_action: 'Systematically identified through horizon scanning and included in the plan',
        status: 'Open',
      },
      {
        id: 'act-3',
        assessment_id: 'ASM-2026-001',
        entity: 'Al-Noor Financial Group',
        question_code: 'Q15',
        section_title: 'Resources, Performance & Quality Assurance',
        finding_title: 'Q15 – Formal competency framework with mandatory Saudi certifications missing',
        priority: 'Immediate',
        timeframe: '0–3 months',
        due_date: '2027-01-18',
        action_owner: 'CAE / HR',
        current_level: 'A – Ad hoc',
        current_state: 'No formal training program',
        target_level: 'B – Foundational',
        recommended_action: 'Formal competency framework with required certifications (CIA, CISA, CFE, SOCPA)',
        status: 'In Progress',
      },
    ];
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('iam_language', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const switchPersona = (persona: UserPersona) => {
    const user = PRESET_USERS[persona];
    setCurrentUser(user);
    if (persona === 'guest') {
      setView('website_home');
    } else if (persona === 'grc_consultant' || persona === 'grc_manager') {
      setView('workspace_pipeline');
    } else {
      setView('portal_dashboard');
    }
  };

  const logActivity = (
    entry: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole' | 'orgName'> &
      Partial<Pick<ActivityLog, 'userId' | 'userName' | 'userRole' | 'orgName'>>
  ) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: formatted,
      userId: entry.userId || currentUser.id || 'usr-active',
      userName: entry.userName || currentUser.name || 'Organization Member',
      userRole: entry.userRole || currentUser.roleTitle || 'Organization Member',
      orgName: entry.orgName || currentUser.orgName || 'Al-Noor Financial Group',
      action: entry.action,
      actionLabel: entry.actionLabel,
      actionLabelAr: entry.actionLabelAr,
      details: entry.details,
      detailsAr: entry.detailsAr,
      status: entry.status || 'Success',
      ipAddress: entry.ipAddress || '185.192.68.12 (Riyadh, SA)',
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const addOrganization = (org: Omit<EntityRecord, 'id'>): string => {
    const newId = `ent-${organizations.length + 1}`;
    const newOrg: EntityRecord = { ...org, id: newId };
    setOrganizations(prev => [...prev, newOrg]);
    return newOrg.entity_name;
  };

  const activeAssessment = assessments.find(a => a.id === activeAssessmentId) || null;

  const startAssessment = (
    entityName: string,
    role: string,
    jobTitle: string,
    lang: 'en' | 'ar'
  ): string => {
    const newId = `ASM-2026-${String(assessments.length + 1).padStart(3, '0')}`;
    const initialAnswers: AssessmentAnswer[] = QUESTIONS.map(q => {
      let autoCalc = false;
      let autoNote = '';
      let autoNoteAr = '';
      let sel: any = '';

      if (q.question_code === 'Q13' && q13IssueRegisterEnabled) {
        const stats = calculateClosureStats(entityName, auditIssues);
        if (stats && stats.count >= settings.issue_min_sample && stats.avgMonths !== null) {
          sel = letterForClosureTime(
            stats.avgMonths,
            settings.closure_a_above,
            settings.closure_b_above,
            settings.closure_c_above
          );
          autoCalc = true;
          const desc = describeClosureStats(stats);
          autoNote = desc.en;
          autoNoteAr = desc.ar;
        }
      }

      return {
        question_code: q.question_code,
        section_code: q.section_code,
        short_label: q.short_label,
        short_label_ar: q.short_label_ar,
        question_text: q.question_text,
        question_text_ar: q.question_text_ar,
        selected_option: sel,
        points: sel === 'A' ? 25 : sel === 'B' ? 50 : sel === 'C' ? 75 : sel === 'D' ? 100 : 0,
        comment: '',
        evidence: '',
        auto_calculated: autoCalc,
        auto_note: autoNote,
        auto_note_ar: autoNoteAr,
        is_gating: q1GatingEnabled ? q.is_gating : 0,
        gate_trigger: q.gate_trigger,
        gate_cap_level: q.gate_cap_level,
      };
    });

    const scores = computeScores(initialAnswers, settings);

    const newDoc: AssessmentDoc = {
      id: newId,
      name: `${newId} (${entityName})`,
      docstatus: 0,
      entity: entityName,
      template: TEMPLATE_INFO.name,
      assessment_date: new Date().toISOString().split('T')[0],
      job_title: jobTitle,
      respondent: currentUser.email,
      respondent_name: currentUser.name,
      respondent_email: currentUser.email,
      respondent_role: role,
      language: lang,
      overall_score: scores.overall_score,
      overall_points: scores.overall_points,
      max_points: scores.max_points,
      maturity_level: scores.maturity_level,
      score_level: scores.score_level,
      color: scores.color,
      interpretation: scores.interpretation,
      interpretation_ar: scores.interpretation_ar,
      gating_note: scores.gating_note,
      gating_note_ar: scores.gating_note_ar,
      answered_count: scores.answered_count,
      question_count: scores.question_count,
      na_count: scores.na_count,
      findings_count: scores.findings_count,
      immediate_count: scores.immediate_count,
      review_status: 'Pending Review',
      modified: new Date().toLocaleString(),
      answers: initialAnswers,
      section_scores: scores.sections,
    };

    setAssessments(prev => [newDoc, ...prev]);
    setActiveAssessmentId(newId);

    // Audit log new assessment
    logActivity({
      action: 'ASSESSMENT_DRAFT_SAVE',
      actionLabel: 'New Assessment Initialized',
      actionLabelAr: 'بدء مسودة تقييم جديدة',
      details: `Initialized new 20-question assessment ${newId} for ${entityName}.`,
      detailsAr: `تم إنشاء مسودة استبيان جديدة ${newId} للمنشأة ${entityName}.`,
      status: 'Info',
    });

    setView('portal_take_assessment');
    return newId;
  };

  const updateAssessmentAnswer = (
    assessmentId: string,
    questionCode: string,
    option: string,
    comment?: string,
    evidence?: string
  ) => {
    setAssessments(prev =>
      prev.map(doc => {
        if (doc.id !== assessmentId) return doc;

        const updatedAnswers = doc.answers.map(ans => {
          if (ans.question_code !== questionCode) return ans;
          return {
            ...ans,
            selected_option: option as any,
            points: option === 'A' ? 25 : option === 'B' ? 50 : option === 'C' ? 75 : option === 'D' ? 100 : 0,
            comment: comment !== undefined ? comment : ans.comment,
            evidence: evidence !== undefined ? evidence : ans.evidence,
          };
        });

        const scores = computeScores(updatedAnswers, settings);

        return {
          ...doc,
          answers: updatedAnswers,
          section_scores: scores.sections,
          overall_score: scores.overall_score,
          overall_points: scores.overall_points,
          max_points: scores.max_points,
          maturity_level: scores.maturity_level,
          score_level: scores.score_level,
          color: scores.color,
          interpretation: scores.interpretation,
          interpretation_ar: scores.interpretation_ar,
          gating_note: scores.gating_note,
          gating_note_ar: scores.gating_note_ar,
          answered_count: scores.answered_count,
          na_count: scores.na_count,
          findings_count: scores.findings_count,
          immediate_count: scores.immediate_count,
          modified: new Date().toLocaleString(),
        };
      })
    );
  };

  const submitAssessment = (assessmentId: string): boolean => {
    const target = assessments.find(a => a.id === assessmentId);
    if (!target) return false;

    // Check unanswered questions
    const unanswered = target.answers.filter(a => !a.selected_option);
    if (unanswered.length > 0) {
      return false;
    }

    // Generate Action items for Level A & B findings
    const newActions: IAMaturityAction[] = [];
    const baseDate = new Date();

    target.answers.forEach(a => {
      const opt = a.selected_option;
      if (opt === 'A' || opt === 'B') {
        const pr = PRIORITY[opt];
        const nextOpt = opt === 'A' ? 'B' : 'C';
        const qDef = QUESTIONS.find(q => q.question_code === a.question_code);
        const secDef = SECTIONS.find(s => s.section_code === a.section_code);

        const dueDate = new Date(baseDate);
        dueDate.setDate(dueDate.getDate() + pr.days);

        newActions.push({
          id: `act-${Date.now()}-${a.question_code}`,
          assessment_id: target.id,
          entity: target.entity,
          question_code: a.question_code,
          section_title: secDef?.section_title || a.section_code,
          finding_title: `${a.question_code} – ${a.short_label || a.question_text}`,
          priority: pr.priority,
          timeframe: pr.timeframe,
          due_date: dueDate.toISOString().split('T')[0],
          action_owner: secDef?.owner_role || 'CAE',
          current_level: `${opt} – ${opt === 'A' ? 'Ad hoc' : 'Foundational'}`,
          current_state: opt === 'A' ? qDef?.option_a || '' : qDef?.option_b || '',
          target_level: `${nextOpt} – ${nextOpt === 'B' ? 'Foundational' : 'Established'}`,
          recommended_action: nextOpt === 'B' ? qDef?.option_b || '' : qDef?.option_c || '',
          status: 'Open',
        });
      }
    });

    setAuditActions(prev => [...newActions, ...prev]);

    setAssessments(prev =>
      prev.map(doc => {
        if (doc.id !== assessmentId) return doc;
        return {
          ...doc,
          docstatus: 1, // Submitted
          review_status: 'Under Review',
          modified: new Date().toLocaleString(),
        };
      })
    );

    // Add follow-up record
    addFollowUpLog({
      assessment_id: target.id,
      entity_name: target.entity,
      action_type: 'Clarification Sent',
      logged_by: currentUser.name,
      notes: 'Customer submitted assessment. Allocated to GRC Review queue.',
    });

    // Audit log formal submission
    logActivity({
      action: 'ASSESSMENT_SUBMIT',
      actionLabel: 'Assessment Submitted',
      actionLabelAr: 'إرسال التقييم للاعتماد والمراجعة',
      details: `Submitted assessment ${target.name} (${target.entity}) with score ${target.overall_score}% (${target.maturity_level}) for formal IRSAA GRC review.`,
      detailsAr: `تم إرسال التقييم ${target.name} الخاص بـ ${target.entity} بنسبة ${target.overall_score}% (${target.maturity_level}) للمراجعة.`,
      status: 'Success',
    });

    return true;
  };

  const resubmitAssessment = (assessmentId: string) => {
    const target = assessments.find(a => a.id === assessmentId);
    setAssessments(prev =>
      prev.map(doc => {
        if (doc.id !== assessmentId) return doc;
        return {
          ...doc,
          review_status: 'Under Review',
          modified: new Date().toLocaleString(),
        };
      })
    );

    // Audit log resubmission
    logActivity({
      action: 'ASSESSMENT_RESUBMIT',
      actionLabel: 'Assessment Resubmitted',
      actionLabelAr: 'إعادة إرسال التقييم بعد الملاحظات',
      details: `Resubmitted assessment ${target?.name || assessmentId} with addressed reviewer clarifications.`,
      detailsAr: `تمت إعادة إرسال التقييم مع تلبية ملاحظات واستفسارات المراجع.`,
      status: 'Success',
    });
  };

  const triggerEmailNotification = (params: Omit<EmailNotificationItem, 'id' | 'sent_at'>) => {
    const newItem: EmailNotificationItem = {
      ...params,
      id: `eml-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sent_at: new Date().toLocaleString(),
    };
    setNotifications(prev => [newItem, ...prev]);

    logActivity({
      action: 'EMAIL_NOTIFICATION_TRIGGERED',
      actionLabel: 'Automated Email Notification Dispatched',
      actionLabelAr: 'إرسال إشعار بريد إلكتروني آلي للمالك',
      details: `Dispatched [${params.trigger_type}] to ${params.recipient_email} (${params.entity_name}): "${params.subject}"`,
      detailsAr: `تم إرسال إشعار [${params.trigger_type}] إلى ${params.recipient_email} الخاص بـ ${params.entity_name}.`,
      status: 'Info',
    });
  };

  const runBackgroundDeadlineCheck = (): number => {
    let triggeredCount = 0;
    const now = new Date();

    assessments.forEach(doc => {
      // Check approaching deadlines (e.g., within 3 days or overdue)
      if (doc.due_date && (doc.docstatus === 0 || doc.review_status === 'Clarification Required')) {
        const dueDate = new Date(doc.due_date);
        const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 3 && diffDays >= 0) {
          triggerEmailNotification({
            assessment_id: doc.id,
            assessment_name: doc.name,
            entity_name: doc.entity,
            recipient_email: doc.respondent_email || 'compliance@saudilogistics.sa',
            recipient_name: doc.respondent_name || 'Assessment Owner',
            trigger_type: 'deadline_approaching',
            subject: `[DEADLINE REMINDER] Assessment Deadline Approaching (${diffDays} days left): ${doc.entity}`,
            subject_ar: `[تذكير استحقاق] اقتراب موعد تسليم تقييم النضج (متبقي ${diffDays} أيام): ${doc.entity}`,
            body: `Dear ${doc.respondent_name || 'Assessment Lead'},\n\nThis is an automated notification from the IRSAA GRC platform. The submission deadline for your assessment (${doc.id}) is scheduled for ${doc.due_date}.\n\nProgress status: ${doc.answered_count}/${doc.question_count} questions completed.\n\nPlease finalize and submit your responses to ensure inclusion in the peer benchmarking index.\n\nIRSAA Advisory Services\nRiyadh, Kingdom of Saudi Arabia`,
            body_ar: `عزيزي ${doc.respondent_name || 'مسؤول التقييم'}،\n\nهذا إشعار آلي من منصة إرساء للحوكمة. موعد استحقاق تسليم التقييم (${doc.id}) محدد بتاريخ ${doc.due_date}.\n\nالتقدم الحالي: تم إنجاز ${doc.answered_count} من ${doc.question_count} سؤالاً.\n\nيرجى استكمال التقييم وإرساله لاعتماده وإدراجه في المقارنة المعيارية.\n\nإرساء لخدمات الحوكمة والاستشارات\nالرياض، المملكة العربية السعودية`,
            status: 'delivered',
            urgency: diffDays <= 1 ? 'critical' : 'urgent',
            due_date: doc.due_date,
            days_until_deadline: diffDays,
          });
          triggeredCount++;
        } else if (diffDays < 0) {
          triggerEmailNotification({
            assessment_id: doc.id,
            assessment_name: doc.name,
            entity_name: doc.entity,
            recipient_email: doc.respondent_email || 'compliance@saudilogistics.sa',
            recipient_name: doc.respondent_name || 'Assessment Owner',
            trigger_type: 'deadline_overdue',
            subject: `[OVERDUE ALERT] Assessment Submission is Overdue: ${doc.entity}`,
            subject_ar: `[تنبيه تأخير] تجاوز الموعد النهائي لتسليم التقييم: ${doc.entity}`,
            body: `Dear ${doc.respondent_name || 'Assessment Lead'},\n\nYour internal audit maturity assessment deadline (${doc.due_date}) has passed. Please contact the GRC lead or submit your draft immediately.\n\nIRSAA GRC Advisory\nRiyadh, Kingdom of Saudi Arabia`,
            body_ar: `عزيزي ${doc.respondent_name || 'مسؤول التقييم'}،\n\nنود إحاطتكم بتجاوز الموعد المحدد لتسليم التقييم (${doc.due_date}). يرجى استكمال التقديم أو التواصل مع فريق الاستشارات.\n\nإرساء لاستشارات الحوكمة\nالرياض، المملكة العربية السعودية`,
            status: 'delivered',
            urgency: 'critical',
            due_date: doc.due_date,
            days_until_deadline: diffDays,
          });
          triggeredCount++;
        }
      }
    });

    return triggeredCount;
  };

  const updateSubscription = (newPlan: Partial<SubscriptionPlan>) => {
    setSubscription(prev => ({ ...prev, ...newPlan }));
    logActivity({
      action: 'SUBSCRIPTION_UPDATED',
      actionLabel: 'Subscription Plan / Quota Adjusted',
      actionLabelAr: 'تعديل خطة الاشتراك وسعة الحصص',
      details: `Subscription updated to tier '${newPlan.plan_tier || subscription.plan_tier}' by IT Admin (${currentUser.name}).`,
      detailsAr: `تم تحديث خطة الاشتراك وحصص المنظومة من قبل إدارة تقنية المعلومات.`,
      status: 'Success',
    });
  };

  const updateWorkflowConfig = (newConfig: Partial<WorkflowConfig>) => {
    setWorkflowConfig(prev => ({ ...prev, ...newConfig }));
    logActivity({
      action: 'WORKFLOW_CONFIG_UPDATED',
      actionLabel: 'Workflow Gating Rules Updated',
      actionLabelAr: 'تحديث قواعد وبوابات محرك دورة العمل',
      details: `Workflow policies adjusted: Dual Approval=${newConfig.require_dual_approval ?? workflowConfig.require_dual_approval}, Clarification SLA=${newConfig.clarification_sla_days ?? workflowConfig.clarification_sla_days} days.`,
      detailsAr: `تم تعديل سياسات وبوابات اعتماد دورة العمل من قبل مسؤول النظام.`,
      status: 'Success',
    });
  };

  const updateFrappeConfig = (newConfig: Partial<FrappeSyncConfig>) => {
    setFrappeConfig(prev => ({ ...prev, ...newConfig }));
    logActivity({
      action: 'ADMIN_SETTINGS_UPDATED',
      actionLabel: 'Frappe Framework Integration Updated',
      actionLabelAr: 'تحديث إعدادات ربط وتكامل منصة فرابي',
      details: `Frappe configuration updated: Server=${newConfig.server_url || frappeConfig.server_url}, Mode=${newConfig.sync_mode || frappeConfig.sync_mode}.`,
      detailsAr: `تم تحديث إعدادات الربط مع بيئة فرابي فريموورك المستقلة.`,
      status: 'Success',
    });
  };

  const reviewerUpdateStatus = (
    assessmentId: string,
    status: AssessmentDoc['review_status'],
    comments: string,
    releaseOfficialReport = false
  ) => {
    const targetDoc = assessments.find(a => a.id === assessmentId);

    setAssessments(prev =>
      prev.map(doc => {
        if (doc.id !== assessmentId) return doc;
        return {
          ...doc,
          review_status: status,
          reviewer: currentUser.name,
          reviewed_on: new Date().toISOString().split('T')[0],
          reviewer_comments: comments,
          modified: new Date().toLocaleString(),
        };
      })
    );

    addFollowUpLog({
      assessment_id: assessmentId,
      entity_name: targetDoc?.entity || '',
      action_type: releaseOfficialReport ? 'Report Released' : 'Review Meeting',
      logged_by: currentUser.name,
      notes: `Review status updated to '${status}'. ${comments ? `Notes: ${comments}` : ''}`,
    });

    // Automated Notification 1: GRC Staff returns assessment for clarification
    if (status === 'Clarification Required' && targetDoc) {
      triggerEmailNotification({
        assessment_id: targetDoc.id,
        assessment_name: targetDoc.name,
        entity_name: targetDoc.entity,
        recipient_email: targetDoc.respondent_email,
        recipient_name: targetDoc.respondent_name,
        trigger_type: 'clarification_required',
        subject: `[ACTION REQUIRED] Assessment Clarification Requested: ${targetDoc.entity} (${targetDoc.id})`,
        subject_ar: `[إجراء مطلوب] مطلوب إيضاحات ومستندات داعمة على تقييم: ${targetDoc.entity} (${targetDoc.id})`,
        body: `Dear ${targetDoc.respondent_name},\n\nGRC Consultant ${currentUser.name} has reviewed your assessment submission and requested clarifications.\n\nReviewer Feedback Notes:\n"${comments || 'Please review question comments and attach supplementary evidence.'}"\n\nPlease log in to your Client Portal to view the threaded comments, respond with clarifications, and resubmit.\n\nSLA Target: ${workflowConfig.clarification_sla_days} business days.\n\nIRSAA GRC Advisory Services\nRiyadh, Kingdom of Saudi Arabia`,
        body_ar: `عزيزي ${targetDoc.respondent_name}،\n\nقام مستشار الحوكمة ${currentUser.name} بمراجعة تقييمكم وطلب استيضاحات وتفاصيل إضافية.\n\nملاحظات المراجع:\n"${comments || 'يرجى مراجعة الاستفسارات المحددة على الأسئلة وإرفاق الأدلة الثبوتية.'}"\n\nيرجى الدخول للبوابة للرد على الاستفسارات وإعادة الإرسال.\n\nالمهلة المحددة: ${workflowConfig.clarification_sla_days} أيام عمل.\n\nإرساء لاستشارات الحوكمة والمخاطر\nالرياض، المملكة العربية السعودية`,
        status: 'delivered',
        urgency: 'urgent',
      });
    }

    // Automated Notification 2: Official Report Release or Approval
    if ((releaseOfficialReport || status === 'Approved' || status === 'Report Released') && targetDoc) {
      triggerEmailNotification({
        assessment_id: targetDoc.id,
        assessment_name: targetDoc.name,
        entity_name: targetDoc.entity,
        recipient_email: targetDoc.respondent_email,
        recipient_name: targetDoc.respondent_name,
        trigger_type: 'report_released',
        subject: `[OFFICIAL RELEASE] Internal Audit Maturity Report Released for ${targetDoc.entity}`,
        subject_ar: `[إصدار رسمي] تم إصدار تقرير نضج وظيفة التدقيق الداخلي المعتمد لـ ${targetDoc.entity}`,
        body: `Dear ${targetDoc.respondent_name},\n\nWe are pleased to inform you that your Internal Audit Function Maturity Assessment (${targetDoc.id}) has been formally approved and released by ${currentUser.name}.\n\nMaturity Level: ${targetDoc.maturity_level} (${targetDoc.overall_score}%)\n\nYou can access your executive radar scorecards and download the certified board PDF report directly from the portal.\n\nDr. Khalid Al-Zahrani\nDirector of GRC Advisory Services\nIRSAA Business Solutions · Riyadh, Kingdom of Saudi Arabia`,
        body_ar: `سعادة ${targetDoc.respondent_name}،\n\nيسرنا إبلاغكم باعتماد وإصدار التقرير الرسمي لنضج التدقيق الداخلي الخاص بـ ${targetDoc.entity} (${targetDoc.id}) من قبل ${currentUser.name}.\n\nمستوى النضج: ${targetDoc.maturity_level} بنسبة (${targetDoc.overall_score}%).\n\nيمكنكم تنزيل التقرير الرسمي المعتمد واستعراض بطاقات الأداء الرادارية عبر بوابتكم.\n\nإرساء لحلول الأعمال · الرياض، المملكة العربية السعودية`,
        status: 'delivered',
        urgency: 'normal',
      });
    }
  };

  const addAuditIssue = (issue: Omit<AuditIssue, 'id'>) => {
    const newId = `iss-${auditIssues.length + 1}`;
    setAuditIssues(prev => [{ ...issue, id: newId }, ...prev]);
  };

  const updateActionStatus = (id: string, status: IAMaturityAction['status']) => {
    setAuditActions(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
  };

  const updateControl = (
    id: string,
    status: GRCControl['status'],
    testResult: GRCControl['testResult']
  ) => {
    setControls(prev =>
      prev.map(c => (c.id === id ? { ...c, status, testResult } : c))
    );
  };

  const addRisk = (risk: Omit<GRCRisk, 'id'>) => {
    const newId = `r-${risks.length + 1}`;
    setRisks(prev => [{ ...risk, id: newId }, ...prev]);
  };

  const addFollowUpLog = (log: Omit<FollowUpLog, 'id' | 'logged_at'>) => {
    const newLog: FollowUpLog = {
      ...log,
      id: `fol-${Date.now()}`,
      logged_at: new Date().toLocaleString(),
    };
    setFollowUps(prev => [newLog, ...prev]);
  };

  const updateSettings = (newSettings: Partial<SettingsConfig>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const confirmPolicy = (
    key: 'q1Gating' | 'q20AllowNa' | 'q13IssueRegister' | 'equalWeights',
    value: boolean
  ) => {
    if (key === 'q1Gating') setQ1GatingEnabled(value);
    if (key === 'q20AllowNa') setQ20AllowNaEnabled(value);
    if (key === 'q13IssueRegister') setQ13IssueRegisterEnabled(value);
    if (key === 'equalWeights') {
      setEqualWeightsEnabled(value);
      setSettings(prev => ({ ...prev, weighting_method: value ? 'Points' : 'Section Weights' }));
    }
  };

  const registerCustomer = (
    email: string,
    fullName: string,
    orgName: string,
    sector: string
  ) => {
    const orgId = addOrganization({
      entity_name: orgName,
      sector: sector || 'Banking & Finance',
      contact_email: email,
      is_active: true,
    });

    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: fullName,
      email: email,
      persona: 'customer_admin',
      orgId: orgId,
      orgName: orgName,
      roleTitle: 'Organization Administrator (CAE)',
      isVerified: true,
    };

    setCurrentUser(newProfile);
    setShowAuthModal(false);
    setView('portal_dashboard');
  };

  const addQuestionComment = (comment: {
    assessment_id: string;
    question_code: string;
    message: string;
    attachment?: string;
    status?: 'open' | 'resolved';
  }) => {
    const isConsultant = currentUser.persona === 'grc_consultant' || currentUser.persona === 'grc_manager';
    const authorRole = isConsultant ? (currentUser.persona as 'grc_consultant' | 'grc_manager') : 'customer';
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComment: QuestionComment = {
      id: `cmt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      assessment_id: comment.assessment_id,
      question_code: comment.question_code,
      author_id: currentUser.id,
      author_name: currentUser.name,
      author_role: authorRole,
      author_title: currentUser.roleTitle,
      created_at: formatted,
      message: comment.message,
      status: comment.status || 'open',
      attachment: comment.attachment,
    };

    setQuestionComments(prev => [...prev, newComment]);

    // If reviewer posted an inquiry on an assessment, transition review status to Clarification Required
    if (isConsultant && comment.status !== 'resolved') {
      setAssessments(prev =>
        prev.map(a => {
          if (a.id === comment.assessment_id && a.review_status !== 'Approved') {
            return {
              ...a,
              review_status: 'Clarification Required',
              modified: new Date().toLocaleString(),
            };
          }
          return a;
        })
      );
    }

    logActivity({
      action: 'QUESTION_COMMENT_ADDED',
      actionLabel: isConsultant ? 'Reviewer Feedback Posted' : 'Customer Clarification Replied',
      actionLabelAr: isConsultant ? 'إضافة استفسار تدقيق على السؤال' : 'رد العميل على استفسار التدقيق',
      details: `${currentUser.name} (${currentUser.roleTitle}) commented on question ${comment.question_code} (${comment.assessment_id}): "${comment.message.slice(0, 65)}..."`,
      detailsAr: `قام ${currentUser.name} بإضافة تعليق/رد على السؤال ${comment.question_code} بالتقييم ${comment.assessment_id}.`,
      status: 'Info',
    });
  };

  const resolveQuestionThread = (
    assessment_id: string,
    question_code: string,
    status: 'open' | 'resolved'
  ) => {
    setQuestionComments(prev =>
      prev.map(c => {
        if (c.assessment_id === assessment_id && c.question_code === question_code) {
          return { ...c, status };
        }
        return c;
      })
    );

    logActivity({
      action: 'QUESTION_THREAD_RESOLVED',
      actionLabel: status === 'resolved' ? 'Clarification Resolved' : 'Thread Reopened',
      actionLabelAr: status === 'resolved' ? 'تم اعتماد التوضيح وإغلاق الاستفسار' : 'إعادة فتح استفسار السؤال',
      details: `Clarification thread for question ${question_code} (${assessment_id}) marked as ${status} by ${currentUser.name}.`,
      detailsAr: `تم تحديث حالة استفسار السؤال ${question_code} بالتقييم ${assessment_id} إلى ${status}.`,
      status: status === 'resolved' ? 'Success' : 'Warning',
    });
  };

  const logout = () => {
    setCurrentUser(PRESET_USERS.guest);
    setView('website_home');
  };

  return (
    <AppContext.Provider
      value={{
        logout,
        language,
        setLanguage,
        view,
        setView,
        currentUser,
        switchPersona,
        organizations,
        addOrganization,
        assessments,
        activeAssessment,
        setActiveAssessmentId,
        startAssessment,
        updateAssessmentAnswer,
        submitAssessment,
        resubmitAssessment,
        reviewerUpdateStatus,
        auditIssues,
        addAuditIssue,
        auditActions,
        updateActionStatus,
        controls,
        updateControl,
        risks,
        addRisk,
        assets,
        incidents,
        followUps,
        addFollowUpLog,
        settings,
        updateSettings,
        confirmPolicy,
        q1GatingEnabled,
        q20AllowNaEnabled,
        q13IssueRegisterEnabled,
        equalWeightsEnabled,
        showAuthModal,
        setShowAuthModal,
        showConsultationModal,
        setShowConsultationModal,
        registerCustomer,
        activityLogs,
        logActivity,
        questionComments,
        addQuestionComment,
        resolveQuestionThread,
        notifications,
        triggerEmailNotification,
        runBackgroundDeadlineCheck,
        subscription,
        updateSubscription,
        workflowConfig,
        updateWorkflowConfig,
        frappeConfig,
        updateFrappeConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
