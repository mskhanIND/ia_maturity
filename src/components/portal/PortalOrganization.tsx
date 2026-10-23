import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building,
  Users,
  Mail,
  Shield,
  Plus,
  CheckCircle,
  UserPlus,
  X,
  Edit2,
  Activity,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const PortalOrganization: React.FC = () => {
  const { language, currentUser, organizations, activityLogs, logActivity } = useApp();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'profile' | 'audit_log'>('profile');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Senior Internal Auditor');
  const [invitedList, setInvitedList] = useState<Array<{ name: string; email: string; role: string; status: string }>>([
    { name: 'Sarah Al-Ghamdi', email: 'sarah.ghamdi@alnoor-finance.sa', role: 'Organization Administrator (CAE)', status: 'Active' },
    { name: 'Fahad Al-Otaibi', email: 'fahad.otaibi@alnoor-finance.sa', role: 'Senior Internal Audit Lead', status: 'Active' },
    { name: 'Noura Al-Shehri', email: 'noura.s@alnoor-finance.sa', role: 'Compliance & Risk Officer', status: 'Active' },
  ]);

  // Profile editable state
  const defaultOrg = organizations.find(o => o.id === currentUser.orgId) || {
    entity_name: currentUser.orgName || 'Al-Noor Financial Group',
    sector: 'Banking & Finance',
    contact_email: currentUser.email || 'sarah.ghamdi@alnoor-finance.sa',
  };

  const [orgProfile, setOrgProfile] = useState({
    entity_name: defaultOrg.entity_name,
    sector: defaultOrg.sector,
    contact_email: defaultOrg.contact_email,
    headquarters: 'Riyadh, Kingdom of Saudi Arabia',
    regulators: 'SAMA, CMA, NCA, SDAIA',
    cr_number: '1010482910',
  });

  const [editSuccessMsg, setEditSuccessMsg] = useState(false);

  // Audit log filter & search
  const [logSearch, setLogSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.actionLabel.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      (log.detailsAr && log.detailsAr.includes(logSearch));
    if (!matchesSearch) return false;
    if (actionFilter === 'SUBMISSION') return log.action.includes('SUBMIT');
    if (actionFilter === 'PROFILE') return log.action.includes('PROFILE');
    if (actionFilter === 'DOWNLOAD') return log.action === 'REPORT_DOWNLOAD';
    if (actionFilter === 'MEMBER') return log.action === 'MEMBER_INVITED';
    return true;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember = {
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Invitation Sent',
    };

    setInvitedList(prev => [...prev, newMember]);

    // Audit log the invitation
    logActivity({
      action: 'MEMBER_INVITED',
      actionLabel: 'Colleague Invitation Dispatched',
      actionLabelAr: 'إرسال دعوة انضمام لزميل عمل',
      details: `Sent invitation to ${inviteEmail} with role: ${inviteRole}.`,
      detailsAr: `تم إرسال دعوة انضمام للمنظومة إلى ${inviteEmail} بصلاحية ${inviteRole}.`,
      status: 'Success',
    });

    setShowInviteModal(false);
    setInviteEmail('');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditModal(false);

    // Audit log the profile update
    logActivity({
      action: 'PROFILE_UPDATE',
      actionLabel: 'Legal Organization Profile Updated',
      actionLabelAr: 'تحديث البيانات النظامية للمنشأة',
      details: `Updated legal name to "${orgProfile.entity_name}", sector: ${orgProfile.sector}, headquarters: ${orgProfile.headquarters}, regulators: ${orgProfile.regulators}.`,
      detailsAr: `تم تحديث الاسم النظامي إلى "${orgProfile.entity_name}"، القطاع: ${orgProfile.sector}، والجهات التنظيمية.`,
      status: 'Success',
    });

    setEditSuccessMsg(true);
    setTimeout(() => setEditSuccessMsg(false), 4000);
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Details', 'Status'];
    const rows = activityLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.userName}"`,
      `"${l.userRole}"`,
      `"${l.actionLabel}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Activity_Log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-start max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? 'ملف المنشأة والرقابة والتدقيق' : 'Organization Profile & Audit Controls'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {isAr
              ? 'إدارة بيانات المنشأة، الصلاحيات، وسجل تدقيق العمليات المعتمد.'
              : 'Manage legal organization identity, member access, and enterprise audit trail.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAr ? 'دعوة زميل للمنشأة' : 'Invite Colleague'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'border-[#12506E] text-[#12506E]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{isAr ? 'الملف النظامي والمستخدمون' : 'Legal Profile & Members'}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_log')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit_log'
              ? 'border-[#12506E] text-[#12506E]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{isAr ? 'سجل تدقيق الأنشطة (Audit Trail)' : 'Enterprise Audit Activity Log'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 font-bold">
            {activityLogs.length}
          </span>
        </button>
      </div>

      {editSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-none" />
          <span>
            {isAr
              ? 'تم تحديث البيانات النظامية للمنشأة وتدوين العملية في سجل التدقيق بنجاح.'
              : 'Organization legal profile updated and recorded in the audit trail successfully.'}
          </span>
        </div>
      )}

      {/* TAB 1: Profile & Members */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Organization Details Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-bold text-gray-900">
                {isAr ? 'البيانات النظامية للمنشأة' : 'Legal Organization Profile'}
              </h3>
              <button
                onClick={() => setShowEditModal(true)}
                className="px-3 py-1 bg-gray-100 hover:bg-[#12506E] hover:text-white text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'تعديل البيانات' : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-gray-400 font-medium">Organization Name</div>
                <div className="text-sm font-bold text-gray-900 mt-0.5">{orgProfile.entity_name}</div>
              </div>
              <div>
                <div className="text-gray-400 font-medium">Economic Sector</div>
                <div className="text-sm font-bold text-[#12506E] mt-0.5">{orgProfile.sector}</div>
              </div>
              <div>
                <div className="text-gray-400 font-medium">Primary Contact / Admin</div>
                <div className="text-sm font-bold text-gray-900 mt-0.5">{orgProfile.contact_email}</div>
              </div>
              <div>
                <div className="text-gray-400 font-medium">Headquarters</div>
                <div className="text-xs font-semibold text-gray-800 mt-0.5">{orgProfile.headquarters}</div>
              </div>
              <div>
                <div className="text-gray-400 font-medium">Statutory Regulators</div>
                <div className="text-xs font-semibold text-gray-800 mt-0.5">{orgProfile.regulators}</div>
              </div>
              <div>
                <div className="text-gray-400 font-medium">Tenant Isolation Status</div>
                <div className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Strict Private Tenant (Active)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Departments & Branches */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
              {isAr ? 'الهيكل التنظيمي ونطاق التدقيق' : 'Organizational Departments & Audit Scope'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { dept: 'Internal Audit', lead: 'Sarah Al-Ghamdi', scope: 'Full Function · CAE' },
                { dept: 'Cybersecurity & IT', lead: 'Khaled Mansoor', scope: 'NCA ECC & CSF' },
                { dept: 'Risk & Compliance', lead: 'Noura Al-Shehri', scope: 'SAMA / CMA Scope' },
                { dept: 'Finance & Accounts', lead: 'Adel Al-Ghamdi', scope: 'Financial Controls' },
              ].map(d => (
                <div key={d.dept} className="p-3 bg-[#F4F6F8] rounded-lg border border-gray-200 space-y-1">
                  <div className="font-bold text-gray-900">{d.dept}</div>
                  <div className="text-gray-500 text-[11px]">Lead: {d.lead}</div>
                  <div className="text-[#12506E] text-[11px] font-semibold">{d.scope}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Authorized Users & Role Access Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden space-y-2 p-5">
            <h3 className="text-sm font-bold text-gray-900 pb-2">
              {isAr ? 'المستخدمون المصرح لهم بالدخول' : 'Authorized Members & Role Access'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                    <th className="p-3 text-start">Member Name</th>
                    <th className="p-3 text-start">Corporate Email</th>
                    <th className="p-3 text-start">Assigned Responsibility / Role</th>
                    <th className="p-3 text-start">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invitedList.map((usr, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{usr.name}</td>
                      <td className="p-3 text-gray-600 font-mono text-[11px]">{usr.email}</td>
                      <td className="p-3 text-gray-800 font-medium">{usr.role}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            usr.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {usr.status}
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

      {/* TAB 2: Enterprise Audit Activity Log */}
      {activeTab === 'audit_log' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#12506E]" />
                  <span>{isAr ? 'سجل تدقيق الأنشطة والعمليات' : 'Enterprise Audit Activity Log'}</span>
                </h3>
                <p className="text-xs text-gray-500">
                  {isAr
                    ? 'تسجيل دقيق وغير قابل للتعديل لكافة الإجراءات: إرسال التقييمات، تحديث الملفات وتنزيل التقارير.'
                    : 'Comprehensive, tamper-evident audit trail tracking user interactions, profile changes, and report downloads.'}
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 text-gray-600" />
                <span>{isAr ? 'تصدير السجل CSV' : 'Export Log CSV'}</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 rtl:right-3 rtl:left-auto" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={e => setLogSearch(e.target.value)}
                  placeholder={isAr ? 'بحث في سجل التدقيق...' : 'Search activity logs...'}
                  className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-gray-500 font-semibold">{isAr ? 'التصنيف:' : 'Filter:'}</span>
                {[
                  { key: 'ALL', label: 'All Events' },
                  { key: 'SUBMISSION', label: 'Submissions' },
                  { key: 'PROFILE', label: 'Profile Updates' },
                  { key: 'DOWNLOAD', label: 'Report Downloads' },
                  { key: 'MEMBER', label: 'Member Invites' },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setActionFilter(f.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      actionFilter === f.key
                        ? 'bg-[#12506E] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="overflow-x-auto border-t border-gray-100 pt-2">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                    <th className="p-3 text-start">Timestamp</th>
                    <th className="p-3 text-start">Actor & Role</th>
                    <th className="p-3 text-start">Action Type</th>
                    <th className="p-3 text-start">Audit Details</th>
                    <th className="p-3 text-start">IP / Origin</th>
                    <th className="p-3 text-start">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-gray-900">{log.userName}</div>
                        <div className="text-[10px] text-gray-500">{log.userRole}</div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.action === 'ASSESSMENT_SUBMIT'
                              ? 'bg-blue-100 text-blue-800'
                              : log.action === 'REPORT_DOWNLOAD'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.action === 'PROFILE_UPDATE'
                              ? 'bg-amber-100 text-amber-800'
                              : log.action === 'MEMBER_INVITED'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {isAr ? log.actionLabelAr : log.actionLabel}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700 max-w-sm leading-relaxed">
                        {isAr ? log.detailsAr : log.details}
                      </td>
                      <td className="p-3 font-mono text-[10px] text-gray-400 whitespace-nowrap">
                        {log.ipAddress || 'Internal'}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Recorded</span>
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

      {/* Edit Organization Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="bg-[#12506E] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {isAr ? 'تعديل البيانات النظامية للمنشأة' : 'Edit Legal Organization Profile'}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-cyan-200 hover:text-white p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'الاسم النظامي للمنشأة *' : 'Legal Organization Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.entity_name}
                  onChange={e => setOrgProfile({ ...orgProfile, entity_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'القطاع الاقتصادي *' : 'Economic Sector *'}
                </label>
                <select
                  value={orgProfile.sector}
                  onChange={e => setOrgProfile({ ...orgProfile, sector: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                >
                  <option value="Banking & Finance">Banking & Finance (SAMA / CMA regulated)</option>
                  <option value="Insurance">Insurance & Reinsurance</option>
                  <option value="Government & Public Sector">Government & Public Sector</option>
                  <option value="Healthcare">Healthcare & Life Sciences</option>
                  <option value="Energy & Utilities">Energy, Oil & Utilities</option>
                  <option value="Logistics & Transport">Logistics & Supply Chain</option>
                  <option value="Technology & Telecom">Telecom & ICT</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'البريد الرسمي للمشرف *' : 'Primary Contact Email *'}
                </label>
                <input
                  type="email"
                  required
                  value={orgProfile.contact_email}
                  onChange={e => setOrgProfile({ ...orgProfile, contact_email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'المقر الرئيسي *' : 'Headquarters Location *'}
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.headquarters}
                  onChange={e => setOrgProfile({ ...orgProfile, headquarters: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'الجهات التنظيمية *' : 'Statutory Regulators *'}
                </label>
                <input
                  type="text"
                  required
                  value={orgProfile.regulators}
                  onChange={e => setOrgProfile({ ...orgProfile, regulators: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white rounded-lg font-bold"
                >
                  {isAr ? 'حفظ وتسجيل التدقيق' : 'Save & Record Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="bg-[#12506E] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {isAr ? 'دعوة زميل إلى منظومة المنشأة' : 'Invite Colleague to Organization'}
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-cyan-200 hover:text-white p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4 text-xs">
              <p className="text-gray-600">
                {isAr
                  ? 'قم بإدخال البريد المهني لزميلك لتوجيه دعوة انضمام برمز تحقق خاص بالمنشأة.'
                  : 'Enter the corporate email of your colleague to generate a secure role-based invitation.'}
              </p>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'البريد الإلكتروني المهني *' : 'Corporate Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="name@alnoor-finance.sa"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'الصلاحية والمسؤولية *' : 'Assigned Role & Scope *'}
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                >
                  <option value="Senior Internal Auditor">Senior Internal Auditor (Respondent)</option>
                  <option value="Audit Manager">Audit Manager (Reviewer)</option>
                  <option value="Compliance & Risk Officer">Compliance & Risk Officer</option>
                  <option value="Organization Administrator">Organization Administrator (Full Access)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white rounded-lg font-bold"
                >
                  {isAr ? 'إرسال الدعوة وتسجيل العملية' : 'Send Invitation & Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
