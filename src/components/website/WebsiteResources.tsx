import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, Shield, CheckCircle2, FileText } from 'lucide-react';

export const WebsiteResources: React.FC = () => {
  const { language, view, setView, setShowConsultationModal } = useApp();
  const isAr = language === 'ar';

  if (view === 'website_privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-start">
        <h1 className="text-3xl font-bold text-gray-900">
          {isAr ? 'إشعار الخصوصية وحماية البيانات' : 'Privacy Notice & Data Protection'}
        </h1>
        <div className="prose text-xs sm:text-sm text-gray-700 space-y-4 leading-relaxed bg-white p-8 rounded-xl border border-gray-200">
          <p>
            This Privacy Notice outlines how the IRSAA GRC platform (developed by IRSAA Business Solutions, Riyadh, Kingdom of Saudi Arabia) collects, uses, protects, and handles personal data and organization assessment information in compliance with the Saudi Personal Data Protection Law (PDPL) issued under Royal Decree No. (M/19) and its Implementing Regulations.
          </p>
          <h3 className="font-bold text-gray-900 text-base">1. Data Sovereignty & Hosting</h3>
          <p>
            All client data, responses, evidence documents, and audit issues are hosted strictly within sovereign Saudi cloud data centers (Oracle Cloud Jeddah / local Tier-3 facilities in Riyadh) and will never be transferred across borders without explicit regulatory exemption and client authorization.
          </p>
          <h3 className="font-bold text-gray-900 text-base">2. Multi-Tenant Organization Isolation</h3>
          <p>
            Customer organizations operate in isolated logical tenants. Users from one organization cannot access, view, or select records from another organization.
          </p>
          <h3 className="font-bold text-gray-900 text-base">3. Anonymous Peer Benchmarking</h3>
          <p>
            Peer benchmark comparisons utilize aggregated statistics (quartiles, median, percentiles) and only activate when at least 5 distinct peer entities exist. No entity identity, question responses, or identifying characteristics are ever revealed.
          </p>
        </div>
      </div>
    );
  }

  if (view === 'website_terms') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-start">
        <h1 className="text-3xl font-bold text-gray-900">
          {isAr ? 'شروط وأحكام الاستخدام' : 'Terms of Use'}
        </h1>
        <div className="prose text-xs sm:text-sm text-gray-700 space-y-4 leading-relaxed bg-white p-8 rounded-xl border border-gray-200">
          <p>
            By accessing or using the IRSAA GRC & Internal Audit platform, you agree to be bound by these Terms of Use and all applicable laws and regulations in the Kingdom of Saudi Arabia.
          </p>
          <h3 className="font-bold text-gray-900 text-base">1. Diagnostic Nature of Assessments</h3>
          <p>
            Self-assessments and maturity scores are diagnostic tools for governance enhancement and benchmarking. A high maturity score does not substitute for a statutory financial or external audit, nor does it guarantee compliance with regulatory directives.
          </p>
          <h3 className="font-bold text-gray-900 text-base">2. User Credentials & Access Control</h3>
          <p>
            Users are responsible for safeguarding corporate login credentials. Organization administrators have the authority to grant and revoke access for internal staff members.
          </p>
        </div>
      </div>
    );
  }

  // FAQs or About Us or Contact
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-start">
      {/* About Us Card */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {isAr ? 'عن إرساء لحلول الأعمال واستشارات الحوكمة' : 'About IRSAA Business Solutions & GRC Advisory'}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          IRSAA Business Solutions is a Saudi professional services firm headquartered in Riyadh, Kingdom of Saudi Arabia, specializing in Governance, Risk, Compliance (GRC), ERP enablement, and Internal Audit advisory. Our platform is designed to modernize internal audit functions and facilitate alignment with the 2024 IIA Global Internal Audit Standards and statutory mandates from NCA, SAMA, CMA, and SDAIA.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="p-4 rounded-lg bg-[#F4F6F8] space-y-1">
            <div className="font-bold text-gray-900">Certified Specialists</div>
            <div className="text-gray-500">CIA, CISA, CFE, SOCPA, and CRISC qualified practitioners.</div>
          </div>
          <div className="p-4 rounded-lg bg-[#F4F6F8] space-y-1">
            <div className="font-bold text-gray-900">National Frameworks</div>
            <div className="text-gray-500">Native mapping to SAMA CSF, NCA ECC, CMA regulations, and PDPL.</div>
          </div>
          <div className="p-4 rounded-lg bg-[#F4F6F8] space-y-1">
            <div className="font-bold text-gray-900">Data Sovereignty</div>
            <div className="text-gray-500">Hosted in Saudi Arabia with rigorous multi-tenant data protection.</div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions (FAQs)'}
        </h2>
        <div className="space-y-3">
          {[
            {
              q: isAr ? 'ما هو استبيان الـ 20 سؤالاً؟' : 'What is the 20-Question Internal Audit Maturity Assessment?',
              a: isAr
                ? 'استبيان معياري يغطي 6 مجالات حيوية متوافقة مع معايير التدقيق الداخلي العالمية IIA GIAS، يقيس نضج الوظيفة من المستوى الارتجالي وحتى الرائد.'
                : 'A comprehensive diagnostic derived from the IIA Global Internal Audit Standards covering Governance, Risk Planning, Methodology, Reporting, QAIP, and Strategic Tech Contribution.'
            },
            {
              q: isAr ? 'كيف يتم احتساب متوسط مدة إغلاق الملاحظات (السؤال Q13)؟' : 'How is question Q13 (Issue closure duration) calculated?',
              a: isAr
                ? 'يحتسب النظام تلقائياً متوسط الشهور اللازمة لإغلاق ملاحظات التدقيق من سجل الملاحظات خلال آخر 24 شهراً عند توفر 4 ملاحظات مغلقة على الأقل.'
                : 'The platform analyzes closed issues from the audit register over the lookback window (default 24 months) and derives average closure duration when sample criteria are met.'
            },
            {
              q: isAr ? 'هل تظهر بيانات منشأتي لأي جهة أخرى؟' : 'Can other organizations view my assessment scores or data?',
              a: isAr
                ? 'كلا على الإطلاق. تُعزل بيانات كل جهة بشكل كامل، ولا تظهر المقارنة المعيارية إلا كأرقام إحصائية مجمعة دون أي أسماء.'
                : 'Never. Each organization is strictly isolated in its own tenant. Peer benchmarking relies exclusively on anonymized aggregate quartiles with strict minimum-peer thresholds.'
            },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
              <h4 className="font-bold text-sm text-gray-900">{faq.q}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-[#12506E] text-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold">
            {isAr ? 'تواصل مع فريق الحوكمة والاستشارات' : 'Connect with the GRC Advisory Team'}
          </h3>
          <p className="text-xs text-cyan-100 max-w-lg">
            Have questions regarding questionnaire customization, ERP integration, or external quality assessments? Our advisory team is ready to assist.
          </p>
        </div>
        <button
          onClick={() => setShowConsultationModal(true)}
          className="px-5 py-2.5 bg-white text-[#12506E] font-bold text-xs rounded-lg shadow hover:bg-gray-100 transition-colors whitespace-nowrap"
        >
          {isAr ? 'طلب جلسة استشارية' : 'Book a Discovery Call'}
        </button>
      </div>
    </div>
  );
};
