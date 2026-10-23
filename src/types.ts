export type LetterOption = 'A' | 'B' | 'C' | 'D';
export type AnswerOption = LetterOption | 'N/A';

export interface SectionDefinition {
  section_code: string;
  section_title: string;
  section_title_ar: string;
  reference: string;
  reference_ar: string;
  weight: number;
  owner_role: string;
  owner_role_ar: string;
}

export interface QuestionDefinition {
  question_code: string;
  section_code: string;
  short_label: string;
  short_label_ar: string;
  question_text: string;
  question_text_ar: string;
  guidance?: string;
  guidance_ar?: string;
  option_a: string;
  option_a_ar: string;
  option_b: string;
  option_b_ar: string;
  option_c: string;
  option_c_ar: string;
  option_d: string;
  option_d_ar: string;
  source_ref: string;
  allow_na: number; // 0 or 1
  is_gating: number; // 0 or 1
  gate_trigger?: string; // 'A' or 'A or B'
  gate_cap_level?: string; // e.g. 'Low'
  auto_source?: string; // 'Issue Closure Time'
}

export interface MaturityBand {
  level_name: string;
  level_name_ar: string;
  min_score: number;
  max_score: number;
  color: string;
  interpretation: string;
  interpretation_ar: string;
}

export interface AssessmentAnswer {
  question_code: string;
  section_code: string;
  short_label: string;
  short_label_ar: string;
  question_text: string;
  question_text_ar: string;
  selected_option: AnswerOption | '';
  points: number;
  comment: string;
  evidence: string;
  auto_calculated?: boolean;
  auto_note?: string;
  auto_note_ar?: string;
  locked?: boolean;
  is_gating?: number;
  gate_trigger?: string;
  gate_cap_level?: string;
}

export interface SectionScore {
  section_code: string;
  section_title: string;
  section_title_ar: string;
  reference: string;
  reference_ar: string;
  owner_role: string;
  owner_role_ar: string;
  weight: number;
  answered: number;
  applicable: number;
  points: number;
  max_points: number;
  score_pct: number;
  maturity_level: string;
}

export interface PeerBenchmarkOverall {
  value: number;
  p25: number;
  median: number;
  p75: number;
  average: number;
  percentile: number;
}

export interface PeerBenchmarkSection {
  code: string;
  title: string;
  title_ar: string;
  value: number;
  p25: number;
  median: number;
  p75: number;
  average: number;
  delta: number;
  percentile: number;
}

export interface PeerBenchmarkResult {
  enabled: boolean;
  available: boolean;
  min_peers: number;
  peer_count?: number;
  peer_group?: string;
  sector?: string;
  reason?: 'too_few_peers' | 'no_sector';
  as_of?: string;
  overall?: PeerBenchmarkOverall;
  sections?: PeerBenchmarkSection[];
}

export interface IAMaturityAction {
  id: string;
  assessment_id: string;
  entity: string;
  question_code: string;
  section_title: string;
  finding_title: string;
  priority: 'Immediate' | 'High' | 'Medium';
  timeframe: string;
  due_date: string;
  action_owner: string;
  current_level: string;
  current_state: string;
  target_level: string;
  recommended_action: string;
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface AuditIssue {
  id: string;
  entity: string;
  title: string;
  raised_on: string;
  closed_on?: string; // null/undefined if open
}

export interface EntityRecord {
  id: string;
  entity_name: string;
  sector: string;
  contact_email: string;
  is_active: boolean;
}

export type ReviewStatus =
  | 'Pending Review'
  | 'Under Review'
  | 'Clarification Required'
  | 'Resubmitted'
  | 'Reviewed'
  | 'Approved'
  | 'Returned'
  | 'Report Released';

export interface AssessmentDoc {
  id: string;
  name: string;
  docstatus: 0 | 1 | 2; // 0=Draft, 1=Submitted, 2=Cancelled
  entity: string;
  template: string;
  assessment_date: string;
  job_title: string;
  respondent: string;
  respondent_name: string;
  respondent_email: string;
  respondent_role: string;
  language: 'en' | 'ar';
  overall_score: number;
  overall_points: number;
  max_points: number;
  maturity_level: string;
  score_level: string;
  color: string;
  interpretation: string;
  interpretation_ar: string;
  gating_note: string;
  gating_note_ar: string;
  answered_count: number;
  question_count: number;
  na_count: number;
  findings_count: number;
  immediate_count: number;
  review_status: ReviewStatus;
  reviewer?: string;
  reviewed_on?: string;
  reviewer_comments?: string;
  modified: string;
  due_date?: string;
  answers: AssessmentAnswer[];
  section_scores: SectionScore[];
}

export interface SettingsConfig {
  points_a: number;
  points_b: number;
  points_c: number;
  points_d: number;
  weighting_method: 'Points' | 'Section Weights';
  bands: MaturityBand[];
  create_actions_for: 'A and B' | 'A, B and C';
  evidence_required_from: '' | 'C and D' | 'D only';
  enable_benchmarking: boolean;
  benchmark_peer_group: 'All entities' | 'Same sector';
  benchmark_min_peers: number;
  issue_lookback_months: number;
  issue_min_sample: number;
  closure_a_above: number;
  closure_b_above: number;
  closure_c_above: number;
  lock_auto_answers: boolean;
  client_show_summary: boolean;
  client_show_sections: boolean;
  client_show_benchmark: boolean;
  client_show_findings: boolean;
  client_show_roadmap: boolean;
  client_show_responses: boolean;
  client_show_reviewer_comments: boolean;
  client_show_scoring_method: boolean;
}

export type UserRole = 'respondent' | 'reviewer' | 'manager' | 'it_admin';

export interface CurrentUser {
  email: string;
  full_name: string;
  role: UserRole;
}

export type ActivityActionType =
  | 'ASSESSMENT_SUBMIT'
  | 'ASSESSMENT_RESUBMIT'
  | 'ASSESSMENT_DRAFT_SAVE'
  | 'PROFILE_UPDATE'
  | 'REPORT_DOWNLOAD'
  | 'MEMBER_INVITED'
  | 'SETTINGS_UPDATE'
  | 'EVIDENCE_UPLOAD'
  | 'CONTROL_UPDATE'
  | 'QUESTION_COMMENT_ADDED'
  | 'QUESTION_THREAD_RESOLVED'
  | 'SUBSCRIPTION_UPDATED'
  | 'WORKFLOW_CONFIG_UPDATED'
  | 'EMAIL_NOTIFICATION_TRIGGERED'
  | 'FRAPPE_EXPORT_GENERATED'
  | 'ADMIN_SETTINGS_UPDATED';

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  orgName: string;
  action: ActivityActionType;
  actionLabel: string;
  actionLabelAr: string;
  details: string;
  detailsAr: string;
  status: 'Success' | 'Warning' | 'Info';
  ipAddress?: string;
}

export type CommentAuthorRole = 'grc_consultant' | 'grc_manager' | 'customer';

export interface QuestionComment {
  id: string;
  assessment_id: string;
  question_code: string;
  author_id: string;
  author_name: string;
  author_role: CommentAuthorRole;
  author_title: string;
  created_at: string;
  message: string;
  status: 'open' | 'resolved';
  attachment?: string;
}

export interface TemplateVersionScoring {
  scale_type: string;
  scale_type_ar: string;
  point_options: Record<string, number>;
  gating_rules_summary: string;
  gating_rules_summary_ar: string;
  has_gating: boolean;
  weighting_method: string;
  weighting_method_ar: string;
  na_handling: string;
  na_handling_ar: string;
  automated_metrics: string;
  automated_metrics_ar: string;
  bands: {
    level: string;
    level_ar: string;
    range: string;
    color: string;
  }[];
}

export interface TemplateVersionDiffItem {
  category: 'framework' | 'scoring' | 'structure' | 'governance';
  title: string;
  title_ar: string;
  change_type: 'added' | 'modified' | 'removed';
  description: string;
  description_ar: string;
}

export interface TemplateVersion {
  version: string;
  name: string;
  name_ar: string;
  status: 'active' | 'superseded' | 'archived';
  status_label: string;
  status_label_ar: string;
  effective_period: string;
  effective_period_ar: string;
  framework: string;
  regulatory_alignment: string;
  regulatory_alignment_ar: string;
  summary: string;
  summary_ar: string;
  author: string;
  approved_by: string;
  sections_count: number;
  questions_count: number;
  domain_weights: {
    code: string;
    title: string;
    title_ar: string;
    weight_pct: number;
    questions_count: number;
  }[];
  scoring: TemplateVersionScoring;
  changelog: string[];
  changelog_ar: string[];
  diff_from_previous?: TemplateVersionDiffItem[];
}

export type NotificationTriggerType =
  | 'deadline_approaching'
  | 'deadline_overdue'
  | 'clarification_required'
  | 'report_released'
  | 'reminder_followup';

export interface EmailNotificationItem {
  id: string;
  assessment_id: string;
  assessment_name: string;
  entity_name: string;
  recipient_email: string;
  recipient_name: string;
  trigger_type: NotificationTriggerType;
  subject: string;
  subject_ar: string;
  body: string;
  body_ar: string;
  sent_at: string;
  status: 'delivered' | 'queued' | 'simulated';
  urgency: 'normal' | 'urgent' | 'critical';
  due_date?: string;
  days_until_deadline?: number;
}

export type SubscriptionTier = 'trial' | 'standard' | 'enterprise' | 'custom';

export interface PlanFeatureDefinition {
  id: string;
  name: string;
  name_ar: string;
  category: 'core' | 'analytics' | 'compliance' | 'collaboration' | 'infrastructure';
  enabled: boolean;
}

export interface TierDefinition {
  id: string;
  name: string;
  name_ar: string;
  tier_code: SubscriptionTier;
  price_sar_monthly: number;
  price_sar_annual: number;
  is_trial: boolean;
  trial_duration_days?: number;
  max_assessments: number;
  max_team_members: number;
  max_storage_gb: number;
  features: PlanFeatureDefinition[];
  frappe_doctype: string;
}

export interface SubscriptionPlan {
  plan_tier: SubscriptionTier;
  plan_name: string;
  plan_name_ar: string;
  status: 'active' | 'expiring_soon' | 'expired';
  trial_start_date: string;
  trial_end_date: string;
  days_remaining: number;
  trial_duration_days: number;
  max_assessments: number;
  used_assessments: number;
  max_team_members: number;
  used_team_members: number;
  max_storage_gb: number;
  used_storage_gb: number;
  features: string[];
  features_ar: string[];
  assigned_org_id?: string;
  assigned_org_name?: string;
}

export interface WorkflowConfig {
  require_dual_approval: boolean;
  allow_customer_reopen: boolean;
  clarification_sla_days: number;
  auto_remind_days_before_deadline: number;
  enforce_gating_caps: boolean;
  allow_self_assessment_draft: boolean;
  require_mandatory_evidence_for_c_d: boolean;
  enable_automated_email_dispatcher: boolean;
}

export interface FrappeDocTypeField {
  fieldname: string;
  label: string;
  fieldtype: string;
  reqd?: number;
  options?: string;
  description?: string;
}

export interface FrappeDocTypeExport {
  name: string;
  module: string;
  custom: number;
  is_submittable?: number;
  fields: FrappeDocTypeField[];
}

export interface FrappeSyncConfig {
  server_url: string;
  api_key: string;
  api_secret: string;
  app_module: string;
  sync_mode: 'standalone_export' | 'webhook_push' | 'rest_sync';
  last_sync: string;
  connected: boolean;
  enable_realtime_webhooks: boolean;
}

