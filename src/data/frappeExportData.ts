import { FrappeDocTypeExport } from '../types';

export const FRAPPE_DOCTYPES: FrappeDocTypeExport[] = [
  {
    name: 'IRSAA Assessment',
    module: 'IRSAA GRC',
    custom: 0,
    is_submittable: 1,
    fields: [
      { fieldname: 'naming_series', label: 'Series', fieldtype: 'Select', options: 'ASM-.YYYY.-.####', reqd: 1 },
      { fieldname: 'entity', label: 'Customer Organization', fieldtype: 'Link', options: 'Company', reqd: 1 },
      { fieldname: 'template_version', label: 'Template Version', fieldtype: 'Data', reqd: 1 },
      { fieldname: 'assessment_date', label: 'Assessment Date', fieldtype: 'Date', reqd: 1 },
      { fieldname: 'due_date', label: 'Submission Due Date', fieldtype: 'Date', reqd: 0 },
      { fieldname: 'respondent_name', label: 'Respondent Full Name', fieldtype: 'Data', reqd: 1 },
      { fieldname: 'respondent_email', label: 'Respondent Email', fieldtype: 'Data', reqd: 1 },
      { fieldname: 'job_title', label: 'Job Role / Title', fieldtype: 'Data' },
      { fieldname: 'overall_score', label: 'Overall Score (%)', fieldtype: 'Percent', reqd: 0 },
      { fieldname: 'maturity_level', label: 'Maturity Level', fieldtype: 'Select', options: 'Level 1 - Ad hoc\nLevel 2 - Foundational\nLevel 3 - Established\nLevel 4 - Advanced\nLevel 5 - Leading' },
      { fieldname: 'review_status', label: 'Review Status', fieldtype: 'Select', options: 'Draft\nSubmitted\nUnder Review\nClarification Required\nResubmitted\nApproved\nReport Released', reqd: 1 },
      { fieldname: 'reviewer', label: 'Assigned GRC Reviewer', fieldtype: 'Link', options: 'User' },
      { fieldname: 'answers', label: 'Questionnaire Responses', fieldtype: 'Table', options: 'IRSAA Assessment Answer' },
      { fieldname: 'clarification_threads', label: 'Clarification Threads', fieldtype: 'Table', options: 'IRSAA Clarification Thread' }
    ]
  },
  {
    name: 'IRSAA Assessment Answer',
    module: 'IRSAA GRC',
    custom: 0,
    fields: [
      { fieldname: 'question_code', label: 'Question Code', fieldtype: 'Data', reqd: 1 },
      { fieldname: 'section_code', label: 'Section Code', fieldtype: 'Data', reqd: 1 },
      { fieldname: 'selected_option', label: 'Selected Option', fieldtype: 'Select', options: '\nA\nB\nC\nD\nN/A' },
      { fieldname: 'points', label: 'Points Earned', fieldtype: 'Int' },
      { fieldname: 'comment', label: 'Customer Response Comment', fieldtype: 'Small Text' },
      { fieldname: 'evidence_attachment', label: 'Attached Evidence URL / File', fieldtype: 'Attach' },
      { fieldname: 'is_gating', label: 'Is Gating Rule', fieldtype: 'Check' },
      { fieldname: 'reviewer_notes', label: 'Reviewer Feedback Notes', fieldtype: 'Small Text' }
    ]
  },
  {
    name: 'IRSAA Clarification Thread',
    module: 'IRSAA GRC',
    custom: 0,
    fields: [
      { fieldname: 'question_code', label: 'Question Code', fieldtype: 'Data', reqd: 1 },
      { fieldname: 'author_name', label: 'Author Name', fieldtype: 'Data', reqd: 1 },
      { fieldname: 'author_role', label: 'Author Role', fieldtype: 'Select', options: 'grc_consultant\ngrc_manager\ncustomer' },
      { fieldname: 'message', label: 'Message Content', fieldtype: 'Text', reqd: 1 },
      { fieldname: 'created_at', label: 'Created At', fieldtype: 'Datetime', reqd: 1 },
      { fieldname: 'status', label: 'Thread Status', fieldtype: 'Select', options: 'open\nresolved' }
    ]
  },
  {
    name: 'IRSAA Audit Action',
    module: 'IRSAA GRC',
    custom: 0,
    fields: [
      { fieldname: 'assessment', label: 'Assessment Reference', fieldtype: 'Link', options: 'IRSAA Assessment', reqd: 1 },
      { fieldname: 'question_code', label: 'Question Code', fieldtype: 'Data', reqd: 1 },
      { fieldname: 'finding_title', label: 'Audit Finding Title', fieldtype: 'Data', reqd: 1 },
      { fieldname: 'priority', label: 'Priority Tier', fieldtype: 'Select', options: 'Immediate\nHigh\nMedium', reqd: 1 },
      { fieldname: 'due_date', label: 'Remediation Due Date', fieldtype: 'Date', reqd: 1 },
      { fieldname: 'action_owner', label: 'Responsible Owner', fieldtype: 'Data', reqd: 1 },
      { fieldname: 'recommended_action', label: 'Recommended Action', fieldtype: 'Text', reqd: 1 },
      { fieldname: 'status', label: 'Action Status', fieldtype: 'Select', options: 'Open\nIn Progress\nCompleted\nCancelled', reqd: 1 }
    ]
  }
];

export const FRAPPE_HOOKS_PY = `# Frappe Framework Integration Configuration
# App: irsaa_grc (IRSAA GRC & Internal Audit Excellence)
# Location: Riyadh, Kingdom of Saudi Arabia

app_name = "irsaa_grc"
app_title = "IRSAA GRC & Audit Excellence"
app_publisher = "IRSAA Business Solutions"
app_description = "Saudi Governance, Risk, Compliance & IIA GIAS 2024 Audit Maturity Platform"
app_icon = "octicon octicon-shield-check"
app_color = "#12506E"
app_email = "grc-support@irsaa.sa"
app_license = "Proprietary"

# Includes in <head>
# ------------------
# include js, css files in header of desk.html
app_include_css = "/assets/irsaa_grc/css/irsaa_grc.css"
app_include_js = "/assets/irsaa_grc/js/irsaa_grc_bundle.js"

# Scheduled Tasks for Background Notifications
# ---------------------------------------------
scheduler_events = {
    "hourly": [
        "irsaa_grc.tasks.check_assessment_deadlines"
    ],
    "daily": [
        "irsaa_grc.tasks.send_clarification_sla_reminders",
        "irsaa_grc.tasks.sync_peer_benchmarking_stats"
    ]
}

# DocType Events for Automated Notification Triggers
# --------------------------------------------------
doc_events = {
    "IRSAA Assessment": {
        "on_update": "irsaa_grc.api.on_assessment_status_change",
        "on_submit": "irsaa_grc.api.on_assessment_submitted"
    }
}

# Portal Menu Items
# -----------------
portal_menu_items = [
    {
        "title": "GRC Assessment Portal",
        "route": "/grc-portal",
        "role": "Customer"
    },
    {
        "title": "Advisory Review Workspace",
        "route": "/grc-workspace",
        "role": "GRC Auditor"
    }
]
`;

export const FRAPPE_INSTALL_INSTRUCTIONS = `
### Standalone Independent Frappe App Deployment Guide

You can install and run this application directly as an independent Frappe app on your Frappe / ERPNext server:

\`\`\`bash
# 1. Connect to your Frappe bench environment
cd /home/frappe/frappe-bench

# 2. Create the independent app module
bench new-app irsaa_grc --no-git

# 3. Copy the exported DocTypes and hooks into the app directory:
#    irsaa_grc/irsaa_grc/doctype/irsaa_assessment/
#    irsaa_grc/irsaa_grc/doctype/irsaa_audit_action/
#    irsaa_grc/hooks.py

# 4. Install the app onto your target site:
bench --site [your-site-name] install-app irsaa_grc

# 5. Run database migrations to provision database schemas:
bench --site [your-site-name] migrate

# 6. Build production frontend assets:
bench build --app irsaa_grc

# 7. Start the Frappe background scheduler for automated email notices:
bench enable-scheduler
\`\`\`
`;
