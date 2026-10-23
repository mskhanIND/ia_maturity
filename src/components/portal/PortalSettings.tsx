import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Globe, Shield, Bell, CheckCircle, Activity, ArrowRight } from 'lucide-react';

export const PortalSettings: React.FC = () => {
  const { language, setLanguage, currentUser, logActivity, setView } = useApp();
  const isAr = language === 'ar';
  const [notifyReview, setNotifyReview] = useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [notifySubmissions, setNotifySubmissions] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    logActivity({
      action: 'SETTINGS_UPDATE',
      actionLabel: 'Default Language Preference Updated',
      actionLabelAr: 'تحديث تفضيلات اللغة الافتراضية',
      details: `Switched portal language to ${lang === 'ar' ? 'العربية' : 'English'}.`,
      detailsAr: `تم تغيير لغة البوابة إلى ${lang === 'ar' ? 'العربية' : 'الإنجليزية'}.`,
      status: 'Info',
    });
  };

  const handleToggleNotification = (type: string, val: boolean) => {
    logActivity({
      action: 'SETTINGS_UPDATE',
      actionLabel: 'Notification Preference Modified',
      actionLabelAr: 'تعديل إعدادات التنبيهات والإشعارات',
      details: `Updated ${type} alert preference to ${val ? 'Enabled' : 'Disabled'}.`,
      detailsAr: `تم تعديل إعداد إشعارات ${type} إلى ${val ? 'مفعل' : 'معطل'}.`,
      status: 'Info',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-start max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isAr ? 'إعدادات المنشأة والحساب' : 'Organization & Account Settings'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {isAr
            ? 'تفضيلات اللغة، إشعارات المتابعة والتقارير، وإعدادات الوصول الآمن.'
            : 'Language preferences, email reminders, and organization tenant configuration.'}
        </p>
      </div>

      {/* Language Preference Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#12506E]" />
          <span>{isAr ? 'لغة الواجهة والتقارير الافتراضية' : 'Default Interface & Report Language'}</span>
        </h3>

        <div className="flex gap-4 text-xs font-semibold">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              language === 'en'
                ? 'bg-[#12506E] text-white border-[#12506E]'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            English (Left-to-Right)
          </button>
          <button
            onClick={() => handleLanguageChange('ar')}
            className={`px-4 py-2 rounded-lg border transition-all ${
              language === 'ar'
                ? 'bg-[#12506E] text-white border-[#12506E]'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            العربية (من اليمين إلى اليسار)
          </button>
        </div>
      </div>

      {/* Notifications Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#12506E]" />
            <span>{isAr ? 'تنبيهات المتابعة والإشعارات' : 'Notifications & Follow-up Reminders'}</span>
          </h3>
          {saveSuccess && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {isAr ? 'تم الحفظ وتدوين التدقيق' : 'Saved & Audit Logged'}
            </span>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyReview}
              onChange={e => {
                setNotifyReview(e.target.checked);
                handleToggleNotification('Consultant Feedback', e.target.checked);
              }}
              className="rounded text-[#12506E]"
            />
            <span>Email notification when GRC consultant issues formal review feedback</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyDeadlines}
              onChange={e => {
                setNotifyDeadlines(e.target.checked);
                handleToggleNotification('Action Deadlines', e.target.checked);
              }}
              className="rounded text-[#12506E]"
            />
            <span>Automatic monthly reminders for open audit finding action deadlines</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notifySubmissions}
              onChange={e => {
                setNotifySubmissions(e.target.checked);
                handleToggleNotification('Colleague Submissions', e.target.checked);
              }}
              className="rounded text-[#12506E]"
            />
            <span>Notify Organization Administrator when colleague submits an assessment section</span>
          </label>
        </div>
      </div>

      {/* Audit Trail & Compliance Verification Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#12506E]" />
            <span>{isAr ? 'سجل تدقيق المنشأة والامتثال' : 'Enterprise Audit Activity Trail'}</span>
          </h3>
          <button
            onClick={() => setView('portal_organization')}
            className="text-[#12506E] font-bold hover:underline flex items-center gap-1"
          >
            <span>{isAr ? 'عرض السجل الكامل' : 'View Full Audit Trail'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
        <p className="text-gray-600">
          {isAr
            ? 'كافة أنشطة مستخدمي المنشأة (إرسال التقييمات، تعديل الملفات وتنزيل التقارير) تسجل تلقائياً مع التوقيت وعنوان IP لضمان معايير الامتثال والحوكمة.'
            : 'All organizational actions including assessment submissions, profile changes, and report downloads are immutably logged with timestamp and user attribution.'}
        </p>
      </div>

      {/* Security & Sovereignty Card */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-2 text-xs">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Data Sovereignty & Encryption</span>
        </h3>
        <p className="text-gray-600">
          Organization data is encrypted using AES-256 and hosted within local Saudi cloud availability domains. Compliance with NCA Cloud Cybersecurity Controls (CCC) is continuously audited.
        </p>
      </div>
    </div>
  );
};
