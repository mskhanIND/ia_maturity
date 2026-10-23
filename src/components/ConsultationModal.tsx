import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, Shield, Calendar, Send } from 'lucide-react';

export const ConsultationModal: React.FC = () => {
  const { language, showConsultationModal, setShowConsultationModal, addFollowUpLog, currentUser } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [org, setOrg] = useState(currentUser.orgName || '');
  const [service, setService] = useState('IIA GIAS External Quality Assessment (QAIP)');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');

  if (!showConsultationModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFollowUpLog({
      assessment_id: 'CONSULT-REQ',
      entity_name: org || 'Prospective Client',
      action_type: 'Review Meeting',
      logged_by: name,
      notes: `Consultation requested for ${service}. Preferred timeline: ${preferredDate || 'Earliest available'}. Comments: ${notes}`,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
        <div className="bg-[#12506E] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-300" />
            <h3 className="font-bold text-base">
              {language === 'ar' ? 'طلب استشارة GRC وتدقيق داخلي' : 'Request GRC & Audit Consultation'}
            </h3>
          </div>
          <button
            onClick={() => {
              setShowConsultationModal(false);
              setSubmitted(false);
            }}
            className="text-cyan-200 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">
                {language === 'ar' ? 'تم استلام طلبكم بنجاح' : 'Consultation Request Received'}
              </h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'سيتواصل معك أحد كبار مستشاري إرساء لحلول الأعمال (IRSAA) خلال 24 ساعة لترتيب الجلسة الاستشارية.'
                  : 'An IRSAA Senior GRC Consultant will contact you within 24 hours to schedule the discovery session and review your scope.'}
              </p>
              <button
                onClick={() => {
                  setShowConsultationModal(false);
                  setSubmitted(false);
                }}
                className="px-5 py-2 bg-[#12506E] text-white rounded-lg text-sm font-semibold hover:bg-[#0e4058]"
              >
                {language === 'ar' ? 'إغلاق' : 'Close Window'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-gray-600">
                {language === 'ar'
                  ? 'احصل على استشارة متخصصة من خبراء معتمدين في معايير التدقيق الداخلي العالمية ومتطلبات الجهات التنظيمية السعودية.'
                  : 'Receive specialized advisory from certified professionals (CIA, CISA, CFE) covering IIA Standards, SAMA, CMA, and NCA requirements.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {language === 'ar' ? 'الاسم *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {language === 'ar' ? 'البريد الإلكتروني *' : 'Work Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {language === 'ar' ? 'المنشأة *' : 'Organization Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {language === 'ar' ? 'نوع الخدمة المطلوبة *' : 'Requested Advisory Service *'}
                </label>
                <select
                  value={service}
                  onChange={e => setService(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                >
                  <option value="IIA GIAS External Quality Assessment (QAIP)">
                    IIA GIAS External Quality Assessment (5-year QAIP)
                  </option>
                  <option value="NCA Essential Cybersecurity Controls (ECC) Gap Assessment">
                    NCA ECC-1:2018 Cybersecurity Gap Assessment
                  </option>
                  <option value="SAMA Cybersecurity Framework Readiness Audit">
                    SAMA Cybersecurity Framework Readiness Audit
                  </option>
                  <option value="CMA Corporate Governance & Audit Committee Advisory">
                    CMA Corporate Governance & Audit Committee Advisory
                  </option>
                  <option value="PDPL Privacy Impact & DPO Enablement">
                    PDPL Privacy Impact & DPO Enablement
                  </option>
                  <option value="Internal Audit Co-Sourcing & Specialized IT Audit">
                    Internal Audit Co-Sourcing & Specialized IT Audit
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {language === 'ar' ? 'الموعد المفضل' : 'Preferred Timeline / Date'}
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={e => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {language === 'ar' ? 'ملاحظات أو استفسارات إضافية' : 'Specific Inquiries or Scope Notes'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Seeking gap analysis before upcoming external regulatory audit..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#12506E] hover:bg-[#0e4058] text-white text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'ar' ? 'إرسال طلب الاستشارة' : 'Submit Consultation Request'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
