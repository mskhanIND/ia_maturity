import { AuditIssue, EntityRecord } from '../types';

export interface SaudiFramework {
  id: string;
  name: string;
  name_ar: string;
  authority: string;
  authority_ar: string;
  version: string;
  description: string;
  description_ar: string;
  sectors: string[];
  totalControls: number;
  badgeColor: string;
  category: 'Cybersecurity' | 'Financial & Corporate Governance' | 'Privacy & Data' | 'Internal Audit';
}

export const SAUDI_FRAMEWORKS: SaudiFramework[] = [
  {
    id: 'nca-ecc',
    name: 'NCA Essential Cybersecurity Controls (ECC-1:2018)',
    name_ar: 'الضوابط الأساسية للأمن السيبراني (ECC-1:2018)',
    authority: 'National Cybersecurity Authority (NCA)',
    authority_ar: 'الهيئة الوطنية للأمن السيبراني',
    version: '1:2018',
    description: 'Mandatory cybersecurity controls for all government entities and critical national infrastructure organizations in Saudi Arabia.',
    description_ar: 'ضوابط أمن سيبراني إلزامية لجميع الجهات الحكومية ومؤسسات البنية التحتية الحيوية في المملكة العربية السعودية.',
    sectors: ['Government', 'Banking & Finance', 'Energy & Utilities', 'Healthcare', 'Telecommunications'],
    totalControls: 114,
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    category: 'Cybersecurity',
  },
  {
    id: 'sama-csf',
    name: 'SAMA Cybersecurity Framework',
    name_ar: 'إطار العمل للأمن السيبراني (البنك المركزي السعودي)',
    authority: 'Saudi Central Bank (SAMA)',
    authority_ar: 'البنك المركزي السعودي (ساما)',
    version: '2017/2023',
    description: 'Mandatory cybersecurity governance, risk management, and operational resilience standard for banking, fintech, and insurance entities.',
    description_ar: 'معيار حوكمة وإدارة مخاطر ومرونة تشغيلية للأمن السيبراني إلزامي للقطاع المصرفي والتقنية المالية والتأمين.',
    sectors: ['Banking & Finance', 'Insurance', 'Fintech', 'Financing Companies'],
    totalControls: 160,
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    category: 'Financial & Corporate Governance',
  },
  {
    id: 'cma-cgr',
    name: 'CMA Corporate Governance Regulations',
    name_ar: 'لائحة حوكمة الشركات (هيئة السوق المالية)',
    authority: 'Capital Market Authority (CMA)',
    authority_ar: 'هيئة السوق المالية',
    version: '2023 Updated',
    description: 'Governance rules governing board composition, audit committee responsibilities, internal audit mandate, and disclosure for listed companies.',
    description_ar: 'قواعد الحوكمة المنظمة لتشكيل المجلس ومسؤوليات لجنة المراجعة واختصاصات التدقيق الداخلي والإفصاح للشركات المدرجة.',
    sectors: ['Listed Companies', 'Capital Market Institutions', 'Investment Funds'],
    totalControls: 98,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    category: 'Financial & Corporate Governance',
  },
  {
    id: 'pdpl-sdaia',
    name: 'Personal Data Protection Law (PDPL)',
    name_ar: 'نظام حماية البيانات الشخصية ولائحته التنفيذية',
    authority: 'SDAIA',
    authority_ar: 'الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)',
    version: '2024 Final Regulations',
    description: 'Protects personal data privacy, regulates cross-border data transfer, mandates DPO appointments, and requires privacy impact assessments.',
    description_ar: 'حماية خصوصية البيانات الشخصية وتنظيم نقل البيانات عبر الحدود وإلزامية تعيين مسؤول حماية البيانات وتقييم أثر الخصوصية.',
    sectors: ['All Entities', 'Healthcare', 'Banking & Finance', 'E-Commerce', 'Government'],
    totalControls: 45,
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    category: 'Privacy & Data',
  },
  {
    id: 'iia-gias',
    name: 'IIA Global Internal Audit Standards (GIAS)',
    name_ar: 'معايير التدقيق الداخلي العالمية الصادرة عن IIA',
    authority: 'Institute of Internal Auditors (IIA)',
    authority_ar: 'معهد المدققين الداخليين العالمي',
    version: '2024 / Effective 2025',
    description: 'New unified 5-domain structure governing the purpose, ethics, governance, management, and performance of internal audit worldwide.',
    description_ar: 'الهيكل الجديد الموحد المكون من 5 مجالات حاكمة لغرض وأخلاقيات وحوكمة وإدارة وأداء التدقيق الداخلي عالمياً.',
    sectors: ['All Entities', 'Corporate', 'Government', 'Financial Services'],
    totalControls: 52,
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    category: 'Internal Audit',
  },
];

export interface GRCControl {
  id: string;
  framework_id: string;
  code: string;
  title: string;
  title_ar: string;
  domain: string;
  owner: string;
  status: 'Implemented' | 'In Progress' | 'Not Implemented' | 'Not Applicable';
  testResult: 'Effective' | 'Partially Effective' | 'Ineffective' | 'Untested';
  evidenceCount: number;
}

export const SEED_CONTROLS: GRCControl[] = [
  {
    id: 'ctrl-1',
    framework_id: 'nca-ecc',
    code: 'ECC-1-1-1',
    title: 'Cybersecurity Strategy approval and formal alignment with organization mission',
    title_ar: 'اعتماد استراتيجية الأمن السيبراني ومواءمتها مع رسالة الجهة',
    domain: 'Cybersecurity Governance',
    owner: 'CISO',
    status: 'Implemented',
    testResult: 'Effective',
    evidenceCount: 3,
  },
  {
    id: 'ctrl-2',
    framework_id: 'iia-gias',
    code: 'GIAS-2.1',
    title: 'Internal Audit Charter approved annually by the Audit Committee',
    title_ar: 'اعتماد ميثاق التدقيق الداخلي سنوياً من لجنة المراجعة',
    domain: 'Governance & Independence',
    owner: 'Chief Audit Executive',
    status: 'Implemented',
    testResult: 'Effective',
    evidenceCount: 2,
  },
  {
    id: 'ctrl-3',
    framework_id: 'cma-cgr',
    code: 'CMA-AC-14',
    title: 'Audit Committee quarterly review of financial statements and internal control systems',
    title_ar: 'مراجعة ربع سنوية من لجنة المراجعة للقوائم المالية وأنظمة الرقابة الداخلية',
    domain: 'Audit Committee Oversight',
    owner: 'Audit Committee Secretary',
    status: 'Implemented',
    testResult: 'Effective',
    evidenceCount: 4,
  },
  {
    id: 'ctrl-4',
    framework_id: 'sama-csf',
    code: 'SAMA-BCP-3',
    title: 'Annual Disaster Recovery and Cyber Incident Simulation Exercise',
    title_ar: 'تمرين سنوي لاختبار التعافي من الكوارث ومحاكاة الحوادث السيبرانية',
    domain: 'Operational Resilience',
    owner: 'Head of IT Operations',
    status: 'In Progress',
    testResult: 'Partially Effective',
    evidenceCount: 1,
  },
  {
    id: 'ctrl-5',
    framework_id: 'pdpl-sdaia',
    code: 'PDPL-DPO-01',
    title: 'Formal appointment and registration of Data Protection Officer (DPO)',
    title_ar: 'تعيين مسؤول حماية البيانات الشخصية والتسجيل لدى الهيئة',
    domain: 'Data Protection Officer',
    owner: 'Chief Legal Officer',
    status: 'Implemented',
    testResult: 'Effective',
    evidenceCount: 1,
  },
  {
    id: 'ctrl-6',
    framework_id: 'iia-gias',
    code: 'GIAS-9.4',
    title: 'Continuous dynamic risk assessment informing the audit universe',
    title_ar: 'تقييم ديناميكي مستمر للمخاطر لتحديث نطاق مهام التدقيق',
    domain: 'Audit Planning',
    owner: 'Audit Manager',
    status: 'In Progress',
    testResult: 'Partially Effective',
    evidenceCount: 1,
  },
];

export interface GRCRisk {
  id: string;
  code: string;
  title: string;
  title_ar: string;
  category: 'Operational' | 'Cybersecurity' | 'Compliance' | 'Strategic' | 'Financial';
  likelihood: 1 | 2 | 3 | 4 | 5; // 1 to 5
  impact: 1 | 2 | 3 | 4 | 5; // 1 to 5
  inherentScore: number;
  treatment: 'Mitigate' | 'Accept' | 'Transfer' | 'Avoid';
  residualScore: number;
  owner: string;
  status: 'Open' | 'Under Review' | 'Treated';
}

export const SEED_RISKS: GRCRisk[] = [
  {
    id: 'r-1',
    code: 'RSK-CYB-01',
    title: 'Ransomware disruption of core banking transactions and data integrity',
    title_ar: 'انقطاع المعاملات المصرفية الأساسية وسلامة البيانات بسبب برمجيات الفدية',
    category: 'Cybersecurity',
    likelihood: 3,
    impact: 5,
    inherentScore: 15,
    treatment: 'Mitigate',
    residualScore: 6,
    owner: 'CISO',
    status: 'Treated',
  },
  {
    id: 'r-2',
    code: 'RSK-CMP-02',
    title: 'Non-compliance with SDAIA cross-border data transfer guidelines leading to penalties',
    title_ar: 'عدم الالتزام بضوابط نقل البيانات عبر الحدود الصادرة عن سدايا وفرض غرامات',
    category: 'Compliance',
    likelihood: 4,
    impact: 4,
    inherentScore: 16,
    treatment: 'Mitigate',
    residualScore: 8,
    owner: 'Compliance Officer',
    status: 'Under Review',
  },
  {
    id: 'r-3',
    code: 'RSK-AUD-03',
    title: 'Delay in remediation of high-priority internal audit findings exceeding 6 months',
    title_ar: 'تأخر معالجة ملاحظات التدقيق الداخلي عالية الأولوية لأكثر من 6 أشهر',
    category: 'Operational',
    likelihood: 4,
    impact: 3,
    inherentScore: 12,
    treatment: 'Mitigate',
    residualScore: 6,
    owner: 'Chief Audit Executive',
    status: 'Open',
  },
  {
    id: 'r-4',
    code: 'RSK-GOV-04',
    title: 'Failure to rotate external audit firm within mandatory CMA statutory term',
    title_ar: 'عدم تدوير مراجع الحسابات الخارجي خلال المدة النظامية المقررة من هيئة السوق',
    category: 'Governance' as any,
    likelihood: 1,
    impact: 4,
    inherentScore: 4,
    treatment: 'Avoid',
    residualScore: 1,
    owner: 'Board Secretary',
    status: 'Treated',
  },
];

export interface GRCAsset {
  id: string;
  assetTag: string;
  name: string;
  name_ar: string;
  type: 'Hardware' | 'Software' | 'Database' | 'Cloud Infrastructure' | 'Facility';
  classification: 'Top Secret' | 'Confidential' | 'Restricted' | 'Public';
  owner: string;
  custodian: string;
  vulnerabilitiesCount: number;
}

export const SEED_ASSETS: GRCAsset[] = [
  {
    id: 'ast-1',
    assetTag: 'AST-SRV-01',
    name: 'Core ERP & Financial Ledger (SAP/Oracle on Oracle Cloud Jeddah)',
    name_ar: 'نظام إدارة الموارد والقيد المحاسبي الأساسي (سحابة جدة)',
    type: 'Cloud Infrastructure',
    classification: 'Confidential',
    owner: 'Chief Financial Officer',
    custodian: 'Head of Infrastructure',
    vulnerabilitiesCount: 1,
  },
  {
    id: 'ast-2',
    assetTag: 'AST-DB-02',
    name: 'Customer KYC & National ID Vault (Saudi Data Sovereignty Zone)',
    name_ar: 'قاعدة بيانات اعرف عميلك والهوية الوطنية (نطاق السيادة الوطنية للبيانات)',
    type: 'Database',
    classification: 'Top Secret',
    owner: 'Chief Risk Officer',
    custodian: 'Database Administrator Lead',
    vulnerabilitiesCount: 0,
  },
  {
    id: 'ast-3',
    assetTag: 'AST-APP-03',
    name: 'IRSAA GRC Assessment & Audit Workspace',
    name_ar: 'منصة إرساء للحوكمة والتدقيق الداخلي',
    type: 'Software',
    classification: 'Restricted',
    owner: 'Chief Audit Executive',
    custodian: 'IRSAA Support Lead',
    vulnerabilitiesCount: 0,
  },
];

export interface SecurityIncident {
  id: string;
  ticket: string;
  title: string;
  title_ar: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  reported_on: string;
  status: 'Investigating' | 'Contained' | 'Remediated' | 'Closed';
  assigned_to: string;
}

export const SEED_INCIDENTS: SecurityIncident[] = [
  {
    id: 'inc-1',
    ticket: 'SEC-2026-089',
    title: 'Phishing attempt targeting finance department payroll credentials',
    title_ar: 'محاولة تصيد إلكتروني تستهدف بيانات اعتماد مسيرات رواتب المالية',
    severity: 'Medium',
    reported_on: '2026-09-14',
    status: 'Remediated',
    assigned_to: 'Cyber Incident Response Team',
  },
  {
    id: 'inc-2',
    ticket: 'SEC-2026-104',
    title: 'Unusual outbound data transfer anomaly detected on staging proxy',
    title_ar: 'رصد نشاط غير معتاد لنقل بيانات صادرة على خادم البيئة التجريبية',
    severity: 'Low',
    reported_on: '2026-10-10',
    status: 'Closed',
    assigned_to: 'SOC Analyst',
  },
];

export const SEED_ENTITIES: EntityRecord[] = [
  {
    id: 'ent-1',
    entity_name: 'Al-Noor Financial Group',
    sector: 'Banking & Finance',
    contact_email: 'sarah.ghamdi@alnoor-finance.sa',
    is_active: true,
  },
  {
    id: 'ent-2',
    entity_name: 'Saudi Logistics & Supply Chain Co.',
    sector: 'Logistics & Transport',
    contact_email: 'compliance@saudilogistics.sa',
    is_active: true,
  },
  {
    id: 'ent-3',
    entity_name: 'Riyadh Medical Holding Company',
    sector: 'Healthcare',
    contact_email: 'audit@riyadhmed.sa',
    is_active: true,
  },
  {
    id: 'ent-4',
    entity_name: 'Al-Fursan Retail & E-Commerce',
    sector: 'Retail & Consumer Goods',
    contact_email: 'ia@alfursan.com.sa',
    is_active: true,
  },
  {
    id: 'ent-5',
    entity_name: 'Arabian Energy Technologies',
    sector: 'Energy & Utilities',
    contact_email: 'grc@arabianenergy.sa',
    is_active: true,
  },
];

export const SEED_ISSUES: AuditIssue[] = [
  {
    id: 'iss-1',
    entity: 'Al-Noor Financial Group',
    title: 'Formal conflict-of-interest declarations missing for 2 audit committee members',
    raised_on: '2025-06-15',
    closed_on: '2025-10-18', // 4.1 months
  },
  {
    id: 'iss-2',
    entity: 'Al-Noor Financial Group',
    title: 'Disaster recovery simulation failover tests documentation incomplete',
    raised_on: '2025-08-01',
    closed_on: '2025-12-05', // 4.1 months
  },
  {
    id: 'iss-3',
    entity: 'Al-Noor Financial Group',
    title: 'Privileged access review not conducted quarterly for core ERP',
    raised_on: '2025-11-10',
    closed_on: '2026-03-02', // 3.7 months
  },
  {
    id: 'iss-4',
    entity: 'Al-Noor Financial Group',
    title: 'Audit issue follow-up escalation matrix lacked explicit Board oversight',
    raised_on: '2026-01-12',
    closed_on: '2026-05-15', // 4.1 months
  },
  {
    id: 'iss-5',
    entity: 'Al-Noor Financial Group',
    title: 'Vendor cybersecurity third-party risk assessment incomplete for cloud provider',
    raised_on: '2026-03-20',
    closed_on: '2026-07-25', // 4.2 months
  },
];

export interface FollowUpLog {
  id: string;
  assessment_id: string;
  entity_name: string;
  action_type: 'Reminder Email' | 'Phone Call' | 'Review Meeting' | 'Clarification Sent' | 'Report Released';
  logged_by: string;
  logged_at: string;
  notes: string;
}

export const SEED_FOLLOW_UPS: FollowUpLog[] = [
  {
    id: 'fol-1',
    assessment_id: 'ASM-2026-001',
    entity_name: 'Al-Noor Financial Group',
    action_type: 'Review Meeting',
    logged_by: 'Tariq Al-Mansoor (GRC Consultant)',
    logged_at: '2026-10-18 11:30',
    notes: 'Discussed Q1 gating confirmation and Q13 average issue closure derivation with CAE.',
  },
  {
    id: 'fol-2',
    assessment_id: 'ASM-2026-002',
    entity_name: 'Saudi Logistics & Supply Chain Co.',
    action_type: 'Reminder Email',
    logged_by: 'System Automated Scheduler',
    logged_at: '2026-10-21 09:00',
    notes: 'Automated reminder sent to complete Section 4 & 5 answers before month-end deadline.',
  },
];
