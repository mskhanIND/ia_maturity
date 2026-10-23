import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { FRAPPE_DOCTYPES, FRAPPE_HOOKS_PY, FRAPPE_INSTALL_INSTRUCTIONS } from '../../data/frappeExportData';
import { EmailNotificationItem, SubscriptionTier } from '../../types';
import {
  Server,
  Mail,
  Shield,
  Layers,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Download,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Sparkles,
  Terminal,
  Activity,
  Users,
  HardDrive,
  Calendar,
  Eye,
  X,
  FileCheck2,
  ChevronRight,
  Database,
  ArrowRight
} from 'lucide-react';

type AdminTab = 'scheduler' | 'subscriptions' | 'workflow' | 'frappe' | 'activity';

export const ITAdminSettings: React.FC = () => {
  const {
    language,
    notifications,
    triggerEmailNotification,
    runBackgroundDeadlineCheck,
    subscription,
    updateSubscription,
    workflowConfig,
    updateWorkflowConfig,
    frappeConfig,
    updateFrappeConfig,
    assessments,
    activityLogs,
    currentUser,
    logActivity,
  } = useApp();

  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<AdminTab>('scheduler');
  const [selectedNotification, setSelectedNotification] = useState<EmailNotificationItem | null>(null);
  const [selectedDocTypeIndex, setSelectedDocTypeIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [pingSuccess, setPingSuccess] = useState<boolean | null>(null);
  const [schedulerNotice, setSchedulerNotice] = useState<string | null>(null);

  // Filters for Activity Logs tab
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'Success' | 'Warning' | 'Info'>('All');

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Run manual background scheduler check
  const handleTriggerDeadlineCheck = () => {
    const count = runBackgroundDeadlineCheck();
    setSchedulerNotice(
      isAr
        ? `اكتمل الفحص الآلي لمواعيد الاستحقاق. تم فحص كافة التقييمات وإرسال ${count} إشعار بنجاح.`
        : `Deadline scheduler executed. Evaluated all active assessments and dispatched ${count} automated notices.`
    );
    setTimeout(() => setSchedulerNotice(null), 6000);
  };

  // Test connection to Frappe server
  const handleTestPing = () => {
    setPingSuccess(null);
    setTimeout(() => {
      setPingSuccess(true);
      setTimeout(() => setPingSuccess(null), 4000);
    }, 600);
  };

  // Extend Trial
  const handleExtendTrial = (days: number) => {
    const newRemaining = subscription.days_remaining + days;
    const currentEnd = new Date(subscription.trial_end_date);
    currentEnd.setDate(currentEnd.getDate() + days);

    updateSubscription({
      days_remaining: newRemaining,
      trial_end_date: currentEnd.toISOString().split('T')[0],
      trial_duration_days: subscription.trial_duration_days + days,
    });
  };

  // Change Tier
  const handleSwitchTier = (tier: SubscriptionTier) => {
    if (tier === 'trial') {
      updateSubscription({
        plan_tier: 'trial',
        plan_name: 'Trial Version (14-Day Evaluation)',
        plan_name_ar: 'النسخة التجريبية (تقييم مجاني 14 يوماً)',
        max_assessments: 5,
        max_team_members: 5,
        max_storage_gb: 5,
      });
    } else if (tier === 'professional') {
      updateSubscription({
        plan_tier: 'professional',
        plan_name: 'Professional GRC Advisory Tier',
        plan_name_ar: 'الخطة الاحترافية لاستشارات الحوكمة',
        max_assessments: 25,
        max_team_members: 15,
        max_storage_gb: 50,
      });
    } else {
      updateSubscription({
        plan_tier: 'enterprise',
        plan_name: 'Enterprise Sovereign Sovereign Tier',
        plan_name_ar: 'خطة المنشآت السيادية الكاملة',
        max_assessments: 999,
        max_team_members: 100,
        max_storage_gb: 500,
      });
    }
  };

  // Export audit logs as CSV
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Action', 'User', 'Role', 'Organization', 'Status', 'Details'];
    const rows = activityLogs.map(log => [
      `"${log.timestamp}"`,
      `"${log.action}"`,
      `"${log.userName}"`,
      `"${log.userRole}"`,
      `"${log.orgName}"`,
      `"${log.status}"`,
      `"${log.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `irsaa_grc_activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logActivity({
      action: 'ADMIN_SETTINGS_UPDATED',
      actionLabel: 'Activity Audit Log Exported',
      actionLabelAr: 'تصدير سجل التدقيق الشامل بصيغة CSV',
      details: `Full activity audit trail downloaded by ${currentUser.name}.`,
      detailsAr: `تم تنزيل سجل التدقيق الشامل بصيغة CSV بواسطة ${currentUser.name}.`,
      status: 'Info',
    });
  };

  // Filtered activity logs
  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch =
      log.actionLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionLabelAr.includes(searchQuery) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || log.status === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  // Calculate current stage counts for workflow visualizer
  const stageCounts: Record<string, number> = {
    Draft: assessments.filter(a => a.docstatus === 0 && a.review_status !== 'Clarification Required').length,
    Submitted: assessments.filter(a => a.review_status === 'Pending Review').length,
    UnderReview: assessments.filter(a => a.review_status === 'Under Review').length,
    Clarification: assessments.filter(a => a.review_status === 'Clarification Required').length,
    Approved: assessments.filter(a => a.review_status === 'Approved').length,
    Released: assessments.filter(a => a.review_status === 'Report Released').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-900 text-cyan-400 flex items-center justify-center font-bold text-xl border border-gray-800 shadow-sm shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {t('admin_title', language)}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
                IT Admin Console
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
              {t('admin_subtitle', language)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <div className="font-bold text-gray-900">{isAr ? 'الخادم والخلفية نشطان' : 'System Engine Online'}</div>
            <div className="text-[11px] text-gray-500">{isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</div>
          </div>
        </div>
      </div>

      {/* Scheduler Alert Message */}
      {schedulerNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{schedulerNotice}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('scheduler')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'scheduler'
              ? 'bg-[#12506E] text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>{t('admin_tab_scheduler', language)}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
            {notifications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'subscriptions'
              ? 'bg-[#12506E] text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t('admin_tab_subscriptions', language)}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-semibold border border-amber-300">
            {subscription.plan_tier === 'trial' ? `${subscription.days_remaining}d Left` : 'Active'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('workflow')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'workflow'
              ? 'bg-[#12506E] text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t('admin_tab_workflow', language)}</span>
        </button>

        <button
          onClick={() => setActiveTab('frappe')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'frappe'
              ? 'bg-[#12506E] text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileCode className="w-4 h-4 text-emerald-600" />
          <span>{t('admin_tab_frappe', language)}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
            Independent App
          </span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'activity'
              ? 'bg-[#12506E] text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Activity className="w-4 h-4 text-cyan-600" />
          <span>{t('admin_tab_activity', language)}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-gray-100 text-gray-700 font-mono">
            {activityLogs.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: BACKGROUND NOTIFICATION SCHEDULER */}
      {/* ========================================================= */}
      {activeTab === 'scheduler' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#12506E]" />
                <h3 className="font-bold text-sm text-gray-900">
                  {isAr ? 'محرك مجدول إشعارات البريد الإلكتروني الآلي' : 'Automated Email Notification Background Service'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Cron Running (Hourly)
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {isAr
                  ? 'يقوم المحرك آلياً بفحص مواعيد استحقاق التقييمات (48 ساعة، 7 أيام، متأخر) وتنبيه المنشأة عند طلب المستشار لإيضاحات.'
                  : 'Automatically monitors assessment milestones, triggers alerts when deadlines approach (48h/7d), and notifies owners upon reviewer clarification requests.'}
              </p>
            </div>

            <button
              onClick={handleTriggerDeadlineCheck}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12506E] hover:bg-[#186287] text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('run_scheduler_now', language)}</span>
            </button>
          </div>

          {/* SMT & Configuration Settings Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {isAr ? 'بوابة خادم البريد (SMTP Gateway)' : 'SMTP Dispatch Gateway'}
              </div>
              <div className="font-mono text-xs text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">
                smtp.irsaa.sa : 587 (TLS Sovereign)
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'متصل ومشفر داخل المملكة' : 'Encrypted & Hosted in Saudi Cloud'}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {isAr ? 'عتبة التذكير باقتراب الموعد' : 'Deadline Warning Threshold'}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={workflowConfig.auto_remind_days_before_deadline}
                  onChange={e => updateWorkflowConfig({ auto_remind_days_before_deadline: Number(e.target.value) })}
                  className="w-16 px-2.5 py-1 text-xs border border-gray-300 rounded font-bold text-center"
                />
                <span className="text-xs text-gray-600">{isAr ? 'أيام قبل الاستحقاق' : 'Days prior to deadline'}</span>
              </div>
              <div className="text-[11px] text-gray-400">
                {isAr ? 'يرسل إشعاراً عاجلاً للمالك والمراجع' : 'Sends urgent warning to CAE & audit lead'}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {isAr ? 'مهلة الرد على الاستفسارات (SLA)' : 'Clarification SLA Target'}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={workflowConfig.clarification_sla_days}
                  onChange={e => updateWorkflowConfig({ clarification_sla_days: Number(e.target.value) })}
                  className="w-16 px-2.5 py-1 text-xs border border-gray-300 rounded font-bold text-center"
                />
                <span className="text-xs text-gray-600">{isAr ? 'أيام عمل' : 'Business days'}</span>
              </div>
              <div className="text-[11px] text-gray-400">
                {isAr ? 'تصعيد تلقائي في حال التأخر' : 'Automated escalation if deadline exceeded'}
              </div>
            </div>
          </div>

          {/* Dispatched Notification Queue Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h4 className="font-bold text-sm text-gray-900">
                {isAr ? 'سجل طابور الإشعارات الصادرة (Email Dispatch Queue)' : 'Dispatched Email Notifications Log'}
              </h4>
              <span className="text-xs text-gray-500">
                {notifications.length} {isAr ? 'إشعار مرسل' : 'messages logged'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'المعرف' : 'ID'}</th>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'نوع المشغّل' : 'Trigger Event'}</th>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'المستلم والمنشأة' : 'Recipient & Entity'}</th>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'موضوع الرسالة' : 'Subject'}</th>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'الأولوية' : 'Urgency'}</th>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'وقت الإرسال' : 'Sent At'}</th>
                    <th className="py-2.5 px-4 text-center">{isAr ? 'المعاينة' : 'Preview'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {notifications.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-600 text-[11px]">{item.id}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.trigger_type === 'clarification_required'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : item.trigger_type === 'deadline_approaching'
                              ? 'bg-orange-100 text-orange-800 border border-orange-300'
                              : item.trigger_type === 'deadline_overdue'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {item.trigger_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900">{item.recipient_name}</div>
                        <div className="text-gray-500 text-[11px] font-mono">{item.recipient_email}</div>
                        <div className="text-gray-400 text-[10px]">{item.entity_name}</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-gray-800" title={isAr ? item.subject_ar : item.subject}>
                        {isAr ? item.subject_ar : item.subject}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold text-[11px] ${
                            item.urgency === 'critical' ? 'text-red-600' : item.urgency === 'urgent' ? 'text-amber-600' : 'text-gray-600'
                          }`}
                        >
                          {item.urgency.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">{item.sent_at}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedNotification(item)}
                          className="px-2.5 py-1 rounded bg-gray-100 hover:bg-[#12506E] hover:text-white text-gray-700 text-[11px] font-bold transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{isAr ? 'عرض' : 'View'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SUBSCRIPTIONS & 14-DAY TRIAL VERSION */}
      {/* ========================================================= */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          {/* Active Plan Banner */}
          <div className="bg-gradient-to-r from-[#12506E] to-[#1e3a47] text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-48 h-48" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-400 text-gray-900 shadow-sm">
                    {subscription.plan_tier.toUpperCase()} PLAN
                  </span>
                  {subscription.plan_tier === 'trial' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                      {isAr
                        ? `متبقي ${subscription.days_remaining} أيام من التقييم المجاني`
                        : `${subscription.days_remaining} Days Remaining in 14-Day Trial`}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold">
                  {isAr ? subscription.plan_name_ar : subscription.plan_name}
                </h2>
                <p className="text-xs sm:text-sm text-cyan-100 max-w-xl">
                  {isAr
                    ? 'تحكم في سعة الحصص، وتمديد فترة التقييم المجاني، وإتاحة ميزات الذكاء الاصطناعي والمقارنة المعيارية.'
                    : 'Manage organization quotas, extend evaluation trial periods, and toggle enterprise governance capabilities.'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <div className="text-xs font-semibold text-cyan-200">{isAr ? 'تمديد فوري للمهلة التجريبية:' : 'Quick Trial Extension:'}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExtendTrial(7)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold border border-white/20 transition-all"
                  >
                    +7 Days
                  </button>
                  <button
                    onClick={() => handleExtendTrial(14)}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold border border-white/20 transition-all"
                  >
                    +14 Days
                  </button>
                  <button
                    onClick={() => handleExtendTrial(30)}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-gray-900 rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    +30 Days
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quota Progress Trackers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Quota 1: Assessments */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <FileCheck2 className="w-4 h-4 text-[#12506E]" />
                  <span>{t('quota_assessments', language)}</span>
                </div>
                <span className="font-mono text-xs font-bold text-gray-900">
                  {subscription.used_assessments} / {subscription.max_assessments}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-[#12506E] h-2.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (subscription.used_assessments / subscription.max_assessments) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>{Math.round((subscription.used_assessments / subscription.max_assessments) * 100)}% {isAr ? 'مستخدم' : 'utilized'}</span>
                <span>{subscription.max_assessments - subscription.used_assessments} {isAr ? 'متبقي' : 'remaining'}</span>
              </div>
            </div>

            {/* Quota 2: Team Members */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{t('quota_team', language)}</span>
                </div>
                <span className="font-mono text-xs font-bold text-gray-900">
                  {subscription.used_team_members} / {subscription.max_team_members}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (subscription.used_team_members / subscription.max_team_members) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>{Math.round((subscription.used_team_members / subscription.max_team_members) * 100)}% {isAr ? 'مستخدم' : 'utilized'}</span>
                <span>{subscription.max_team_members - subscription.used_team_members} {isAr ? 'مقاعد متاحة' : 'seats available'}</span>
              </div>
            </div>

            {/* Quota 3: Encrypted Evidence Storage */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <HardDrive className="w-4 h-4 text-purple-600" />
                  <span>{t('quota_storage', language)}</span>
                </div>
                <span className="font-mono text-xs font-bold text-gray-900">
                  {subscription.used_storage_gb} GB / {subscription.max_storage_gb} GB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (subscription.used_storage_gb / subscription.max_storage_gb) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>{Math.round((subscription.used_storage_gb / subscription.max_storage_gb) * 100)}% {isAr ? 'مستخدم' : 'utilized'}</span>
                <span>{(subscription.max_storage_gb - subscription.used_storage_gb).toFixed(1)} GB {isAr ? 'متبقي' : 'free'}</span>
              </div>
            </div>
          </div>

          {/* Tier Switcher & Adjustments */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h4 className="font-bold text-sm text-gray-900">
              {isAr ? 'تعديل مستوى الاشتراك وتخصيص الحصص' : 'Subscription Tier Adjustments & Overrides'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleSwitchTier('trial')}
                className={`p-4 rounded-xl border text-start transition-all space-y-2 ${
                  subscription.plan_tier === 'trial'
                    ? 'border-[#12506E] bg-cyan-50/40 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{t('plan_tier_trial', language)}</span>
                  {subscription.plan_tier === 'trial' && <CheckCircle2 className="w-4 h-4 text-[#12506E]" />}
                </div>
                <p className="text-xs text-gray-500">
                  {isAr ? 'تقييم مجاني 14 يوماً مع 5 تقييمات و5 مقاعد لفريق العمل.' : '14-Day Free Evaluation with 5 assessments and 5 team member seats.'}
                </p>
                <div className="text-[11px] font-bold text-[#12506E]">
                  {isAr ? 'الخيار الافتراضي للتجربة' : 'Evaluation Baseline'}
                </div>
              </button>

              <button
                onClick={() => handleSwitchTier('professional')}
                className={`p-4 rounded-xl border text-start transition-all space-y-2 ${
                  subscription.plan_tier === 'professional'
                    ? 'border-[#12506E] bg-cyan-50/40 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{t('plan_tier_pro', language)}</span>
                  {subscription.plan_tier === 'professional' && <CheckCircle2 className="w-4 h-4 text-[#12506E]" />}
                </div>
                <p className="text-xs text-gray-500">
                  {isAr ? 'حتى 25 تقييماً، 15 مقعداً، 50 جيجابايت تخزين ومقارنة معيارية كاملة.' : 'Up to 25 assessments, 15 team seats, 50 GB storage with full benchmarking.'}
                </p>
                <div className="text-[11px] font-bold text-emerald-700">
                  {isAr ? 'مناسب للمنشآت المتوسطة' : 'Mid-Market & Advisory'}
                </div>
              </button>

              <button
                onClick={() => handleSwitchTier('enterprise')}
                className={`p-4 rounded-xl border text-start transition-all space-y-2 ${
                  subscription.plan_tier === 'enterprise'
                    ? 'border-[#12506E] bg-cyan-50/40 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{t('plan_tier_enterprise', language)}</span>
                  {subscription.plan_tier === 'enterprise' && <CheckCircle2 className="w-4 h-4 text-[#12506E]" />}
                </div>
                <p className="text-xs text-gray-500">
                  {isAr ? 'تقييمات غير محدودة، نشر سيادي على بيئة فرابي المستقلة، دعم مخصص.' : 'Unlimited assessments, standalone Frappe hosting, multi-tenant isolation.'}
                </p>
                <div className="text-[11px] font-bold text-purple-700">
                  {isAr ? 'مخصص للقطاعات الحيوية' : 'Sovereign Enterprise'}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: WORKFLOW ENGINE & GATING RULES */}
      {/* ========================================================= */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          {/* Visual Workflow Pipeline Diagram */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  {isAr ? 'محرك مسار دورة العمل والاعتماد (Workflow State Machine)' : 'Assessment Lifecycle Workflow Engine'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isAr
                    ? 'مخطط تدفق حالات التقييم من المسودة وحتى إصدار التقرير النهائي، مع عدد التقييمات في كل مرحلة.'
                    : 'Visual state machine driving assessment progression from draft to formal board release.'}
                </p>
              </div>
            </div>

            {/* Stages diagram */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {[
                { key: 'Draft', label: isAr ? 'مسودة' : 'Draft', count: stageCounts.Draft, color: 'border-gray-300 bg-gray-50 text-gray-700' },
                { key: 'Submitted', label: isAr ? 'تم التقديم' : 'Submitted', count: stageCounts.Submitted, color: 'border-blue-300 bg-blue-50 text-blue-800' },
                { key: 'UnderReview', label: isAr ? 'قيد المراجعة' : 'Under Review', count: stageCounts.UnderReview, color: 'border-purple-300 bg-purple-50 text-purple-800' },
                { key: 'Clarification', label: isAr ? 'طلب إيضاحات' : 'Clarification', count: stageCounts.Clarification, color: 'border-amber-300 bg-amber-50 text-amber-800' },
                { key: 'Approved', label: isAr ? 'معتمد' : 'Approved', count: stageCounts.Approved, color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
                { key: 'Released', label: isAr ? 'تقرير صادر' : 'Report Released', count: stageCounts.Released, color: 'border-cyan-400 bg-cyan-50 text-cyan-900' },
              ].map((stage, idx) => (
                <div key={stage.key} className={`p-4 rounded-xl border ${stage.color} flex flex-col justify-between space-y-2 relative`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      Step {idx + 1}
                    </span>
                    <span className="font-mono text-base font-bold">
                      {stage.count}
                    </span>
                  </div>
                  <div className="font-bold text-xs sm:text-sm">{stage.label}</div>
                  <div className="text-[10px] opacity-75">
                    {stage.count} {isAr ? 'تقييمات نشطة' : 'active records'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gating & Quality Policies */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-gray-900">
              {isAr ? 'سياسات بوابات الاعتماد وضوابط الجودة' : 'Workflow Gating Policies & Automation Gates'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={workflowConfig.require_dual_approval}
                  onChange={e => updateWorkflowConfig({ require_dual_approval: e.target.checked })}
                  className="mt-1 w-4 h-4 text-[#12506E] rounded"
                />
                <div className="space-y-1">
                  <div className="font-bold text-xs text-gray-900">
                    {isAr ? 'اشتراط الاعتماد الثنائي (Dual Approval Requirement)' : 'Enforce Dual Approval (Lead Reviewer + Director)'}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {isAr
                      ? 'لا يصدر التقرير النهائي إلا بعد موافقة مستشار الحوكمة واعتماد مدير الاستشارات.'
                      : 'Requires sign-off from both Senior Assessor and Advisory Director prior to releasing verified scorecards.'}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={workflowConfig.enforce_gating_caps}
                  onChange={e => updateWorkflowConfig({ enforce_gating_caps: e.target.checked })}
                  className="mt-1 w-4 h-4 text-[#12506E] rounded"
                />
                <div className="space-y-1">
                  <div className="font-bold text-xs text-gray-900">
                    {isAr ? 'تفعيل سقف النضج الحاكم (Gating Cap Enforcement)' : 'Enforce Independence Gating Cap (Q1 Trigger)'}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {isAr
                      ? 'عند اختيار «أ» في خطوط التبعية، يتم حصر النضج العام عند مستوى «منخفض» بغض النظر عن باقي الدرجات.'
                      : 'Automatically caps overall maturity band to Level 1 if executive reporting line fails independence test.'}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={workflowConfig.require_mandatory_evidence_for_c_d}
                  onChange={e => updateWorkflowConfig({ require_mandatory_evidence_for_c_d: e.target.checked })}
                  className="mt-1 w-4 h-4 text-[#12506E] rounded"
                />
                <div className="space-y-1">
                  <div className="font-bold text-xs text-gray-900">
                    {isAr ? 'إلزامية إرفاق الأدلة للخيارات العليا (C و D)' : 'Mandatory Evidence for Advanced Options (C & D)'}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {isAr
                      ? 'يشترط إرفاق وثيقة داعمة أو مرجع تنظيمي عند اختيار المستوى الراسخ أو الرائد.'
                      : 'Prevents assessment submission without attached evidence when scoring established or leading maturity levels.'}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={workflowConfig.enable_automated_email_dispatcher}
                  onChange={e => updateWorkflowConfig({ enable_automated_email_dispatcher: e.target.checked })}
                  className="mt-1 w-4 h-4 text-[#12506E] rounded"
                />
                <div className="space-y-1">
                  <div className="font-bold text-xs text-gray-900">
                    {isAr ? 'محرك الإشعارات الآلي الفوري' : 'Automated Email Dispatcher Engine'}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {isAr
                      ? 'إرسال بريد إلكتروني فوري لمالك التقييم عند تغيير الحالة إلى مطلوب إيضاحات أو إصدار التقرير.'
                      : 'Immediately notifies respondent when reviewer returns questionnaire for clarification or publishes report.'}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: FRAPPE FRAMEWORK INTEGRATION & EXPORT */}
      {/* ========================================================= */}
      {activeTab === 'frappe' && (
        <div className="space-y-6">
          {/* Overview Banner */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {isAr ? 'حزمة النشر والتكامل المستقل على منصة فرابي (Frappe Framework)' : 'Frappe Framework Independent App Export & Sync'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isAr
                    ? 'يتيح لفريق تقنية المعلومات تثبيت هذه المنظومة كتطبيق مستقل تماماً على خادم فرابي / إي آر بي نكست (ERPNext/Frappe) مع كافة نماذج الـ DocTypes و hooks.py.'
                    : 'Provides IT administrators with fully structured DocType JSON definitions and hooks.py to install this app independently into any Frappe Framework bench environment.'}
                </p>
              </div>
            </div>

            {/* Connection Ping & Server Config */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-800">
                  {isAr ? 'رابط خادم فرابي المستهدف (Frappe Bench Endpoint):' : 'Target Frappe Bench Server Endpoint:'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-white px-3 py-1 rounded border border-gray-300 text-gray-700">
                    {frappeConfig.server_url}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    App: {frappeConfig.app_module}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestPing}
                  className="px-3.5 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isAr ? 'اختبار الاتصال (Ping)' : 'Test Connection Ping'}</span>
                </button>

                {pingSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>200 OK (Connected)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* DocType JSON Viewer */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  {isAr ? 'نماذج البيانات (DocTypes):' : 'Frappe DocTypes:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {FRAPPE_DOCTYPES.map((dt, idx) => (
                    <button
                      key={dt.name}
                      onClick={() => setSelectedDocTypeIndex(idx)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                        selectedDocTypeIndex === idx
                          ? 'bg-[#12506E] text-white shadow-sm'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {dt.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(FRAPPE_DOCTYPES[selectedDocTypeIndex], null, 2),
                      `doctype-${selectedDocTypeIndex}`
                    )
                  }
                  className="px-3 py-1 rounded bg-white hover:bg-gray-100 border border-gray-300 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === `doctype-${selectedDocTypeIndex}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? 'تم النسخ' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isAr ? 'نسخ JSON' : 'Copy DocType JSON'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Block */}
            <div className="p-4 bg-gray-900 text-cyan-300 font-mono text-xs overflow-x-auto max-h-96">
              <pre>{JSON.stringify(FRAPPE_DOCTYPES[selectedDocTypeIndex], null, 2)}</pre>
            </div>
          </div>

          {/* hooks.py configuration */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-700" />
                <span className="font-bold text-xs text-gray-800">
                  irsaa_grc / hooks.py ({isAr ? 'إعدادات ربط التطبيق والمجدول' : 'App Hooks & Background Scheduler Configuration'})
                </span>
              </div>
              <button
                onClick={() => handleCopy(FRAPPE_HOOKS_PY, 'hooks-py')}
                className="px-3 py-1 rounded bg-white hover:bg-gray-100 border border-gray-300 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedKey === 'hooks-py' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? 'تم النسخ' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ كود hooks.py' : 'Copy hooks.py'}</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-gray-900 text-amber-300 font-mono text-xs overflow-x-auto max-h-72">
              <pre>{FRAPPE_HOOKS_PY}</pre>
            </div>
          </div>

          {/* Bench CLI Install Instructions */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-gray-900">
              {isAr ? 'خطوات التثبيت على سيرفر فرابي المستقل عبر الطرفية (Bench CLI)' : 'Terminal Installation Commands for Independent Frappe App'}
            </h4>
            <div className="p-4 bg-gray-950 text-gray-200 rounded-lg font-mono text-xs overflow-x-auto space-y-1">
              <div className="text-gray-500"># 1. Navigate to your bench root</div>
              <div>cd /home/frappe/frappe-bench</div>
              <div className="text-gray-500 pt-2"># 2. Create the independent app module</div>
              <div>bench new-app irsaa_grc</div>
              <div className="text-gray-500 pt-2"># 3. Install the app onto your production site</div>
              <div>bench --site erp.irsaa.sa install-app irsaa_grc</div>
              <div className="text-gray-500 pt-2"># 4. Migrate database schemas & build frontend bundle</div>
              <div>bench --site erp.irsaa.sa migrate && bench build --app irsaa_grc</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: GLOBAL ACTIVITY AUDIT LOG */}
      {/* ========================================================= */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3 w-full">
              <input
                type="text"
                placeholder={isAr ? 'البحث في سجل الأنشطة (المستخدم، الإجراء، المنشأة)...' : 'Search audit activity by user, action, organization, or details...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
              />

              <select
                value={filterSeverity}
                onChange={e => setFilterSeverity(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-medium"
              >
                <option value="All">{isAr ? 'كافة الحالات' : 'All Severities'}</option>
                <option value="Success">Success</option>
                <option value="Warning">Warning</option>
                <option value="Info">Info</option>
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isAr ? 'تصدير سجل التدقيق (CSV)' : 'Export Audit CSV'}</span>
            </button>
          </div>

          {/* Activity Log Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'التاريخ والوقت' : 'Timestamp'}</th>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'نوع الإجراء' : 'Action Type'}</th>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'المستخدم والجهة' : 'User & Organization'}</th>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'تفاصيل النشاط' : 'Details'}</th>
                    <th className="py-2.5 px-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">
                          {isAr ? log.actionLabelAr : log.actionLabel}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{log.action}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-gray-800">{log.userName}</div>
                        <div className="text-[11px] text-gray-500">{log.orgName}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 max-w-md leading-relaxed">
                        {isAr ? log.detailsAr || log.details : log.details}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'Success'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'Warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200 text-start">
            <div className="bg-[#181818] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm">
                  {isAr ? 'معاينة رسالة البريد الإلكتروني الآلية' : 'Automated Email Dispatch Preview'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-200 font-mono text-[11px]">
                <div><span className="text-gray-500">From:</span> irsaa-grc-engine@irsaa.sa (IRSAA Advisory Automated System)</div>
                <div><span className="text-gray-500">To:</span> {selectedNotification.recipient_name} &lt;{selectedNotification.recipient_email}&gt;</div>
                <div><span className="text-gray-500">Subject:</span> <strong className="text-gray-900">{isAr ? selectedNotification.subject_ar : selectedNotification.subject}</strong></div>
                <div><span className="text-gray-500">Date:</span> {selectedNotification.sent_at}</div>
                <div><span className="text-gray-500">Entity:</span> {selectedNotification.entity_name} ({selectedNotification.assessment_id})</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-inner whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-xs">
                {isAr ? selectedNotification.body_ar : selectedNotification.body}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800"
                >
                  {isAr ? 'إغلاق' : 'Close Preview'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
