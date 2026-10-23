# AlphaX GRC & Audit Platform
*Enterprise Governance, Risk, Compliance & Internal Audit Platform by IRSAA Business Solutions*

## Overview
AlphaX GRC & Audit Platform is an enterprise-grade bilingual (English/Arabic) web application designed for Saudi organizations, internal audit departments, audit committees, and GRC professionals. Built on modern React 19 + TypeScript + Vite and Tailwind CSS, the platform bridges the gap between the new **IIA Global Internal Audit Standards (GIAS 2024 / 2025)** and Saudi regulatory mandates from the **National Cybersecurity Authority (NCA ECC)**, **Saudi Central Bank (SAMA CSF)**, **Capital Market Authority (CMA Corporate Governance)**, and **SDAIA Personal Data Protection Law (PDPL)**.

---

## Architecture & Scope

### 1. Public Website (`grc.muftaah.com` / `alphaxerp.com`)
- **Bilingual Experience**: English & Arabic with full RTL / LTR layout switching and typography (Noto Sans Arabic).
- **Product & Services**: Highlighting Internal Audit Maturity, Control Catalogs, Enterprise Risk Matrix, and Action Remediations.
- **Saudi Regulatory Directory**: Sector-specific applicability mapping (Banking, Healthcare, Government, Listed entities, Logistics, Energy).
- **Assessment Catalogue**: Diagnostic surveys including the flagship 20-Question IIA GIAS maturity evaluation.
- **Corporate Transparency**: About IRSAA, FAQs, Privacy Notice (compliant with Saudi PDPL), and Terms of Use.

### 2. Customer Registration & Tenant Isolation
- **Work Email Registration**: Onboarding with email OTP verification simulation.
- **Organization Setup**: Setting up legal entity name, commercial sector, city, and primary contact.
- **Tenancy Isolation**: Strict organization-level logical partitioning. Customers cannot see, list, or search other customer organizations.
- **Role-Based Access Control (RBAC)**:
  - Organization Administrator (CAE / Audit Director)
  - Senior Internal Auditor / Assessor
  - Action Owner / Department Process Lead
  - Board / Audit Committee Viewer

### 3. Customer Self-Management Portal
Left sidebar navigation with searchable tables, status badges, filters, and quick actions:
1. **Dashboard**: Pending assessments, completion progress, scorecards, risks, and overdue actions.
2. **Organization**: Entity profile, departments, audit scope, and colleague invitation workflow.
3. **Assessments & Surveys**: The flagship 20-Question assessment with autosave, comment notes, and evidence file attachments.
4. **Scorecards & Reports**: Board-ready reports, visual section bar charts, anonymous peer benchmarking (quartiles and percentiles), and clear distinction between *Preliminary Self-Assessment* vs *Official Approved Report*.
5. **Control Catalog**: Mapped against NCA ECC, SAMA CSF, CMA, and IIA GIAS with test results and evidence counts.
6. **Risk Management & Asset Risk Register**: 5x5 Likelihood x Impact matrix, inherent vs. residual scores, and treatment plans.
7. **Compliance Management**: National regulatory universe readiness and compliance percentages.
8. **Audit Findings & Actions**: Action item tracker derived from assessment findings with deadlines and owners.
9. **Security Operations**: Incident and vulnerability logs with severity ratings and response leads.
10. **Settings**: Organization preferences, notification alerts, and language configuration.

### 4. Internal Survey Management Workspace (IRSAA Team)
Dedicated workspace for IRSAA GRC advisory consultants and managers:
- **8-Stage Assessment Pipeline**:
  `Draft → In Progress → Submitted → Under Review → Clarification Required → Resubmitted → Approved → Report Released`
- **Engagement & Follow-up History**: Logging customer follow-up actions (Email Reminders, Phone Calls, Review Meetings).
- **Technical Review & Approval Queue**: Detailed response inspection, evidence verification, clarification requests, and official report release.
- **Consultant Workload Monitor**: Active review allocations and overdue SLA tracking.
- **Methodology Policy Confirmations**: Real-time switches for Q1 gating cap, Q20 N/A allowance, Q13 issue register auto-derivation, and question weights.

---

## Methodology Policy Confirmations (Scope Item 5)
Before implementation, the platform provides live toggles to configure:
1. **Q1 Gating Cap**: Caps overall maturity level at *Low* if reporting line (Q1) is answered *A* (reports only to CEO/CFO without direct Audit Committee reporting).
2. **Q20 N/A Allowance**: Allows non-regulated entities to mark Q20 *Not Applicable*, automatically removing it from the denominator.
3. **Q13 Auto-Derivation**: Auto-calculates average closure duration from the audit issue register over the last 24 months (minimum sample of 4 issues).
4. **Question Weighting**: Configurable between Equal Weighting (Points method) and Section Weights.

---

## Deployment & Development
- **Node.js**: v22+
- **Dev Server**: `npm run dev` (starts on port 3000, host `0.0.0.0`)
- **Production Build**: `npm run build`
