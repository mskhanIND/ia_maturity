import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import {
  X,
  Mail,
  Lock,
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Shield,
  User,
  Sparkles,
  Briefcase
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    language,
    showAuthModal,
    setShowAuthModal,
    registerCustomer,
    switchPersona,
    setView
  } = useApp();

  const isAr = language === 'ar';

  // Primary tab: 'customer' or 'grc_staff'
  const [authCategory, setAuthCategory] = useState<'customer' | 'grc_staff'>('customer');

  // Customer sub-flow: 'signin' | 'signup' | 'verify' | 'org_setup'
  const [customerMode, setCustomerMode] = useState<'signin' | 'signup' | 'verify' | 'org_setup'>('signin');

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [sector, setSector] = useState('Banking & Finance');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!showAuthModal) return null;

  // Handle Step 1 of Customer Registration: Email -> Code
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      setError(isAr ? 'يرجى إدخال البريد المهني والاسم الكامل.' : 'Please provide your work email and full name.');
      return;
    }
    setError('');
    setOtpCode('849201'); // Pre-fill mock OTP for seamless testing
    setCustomerMode('verify');
  };

  // Handle Step 2: Verification
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '849201' && otpCode.length < 4) {
      setError(isAr ? 'رمز التحقق غير صحيح. استخدم الرمز 849201 للتجربة.' : 'Invalid code. Use code 849201 for test login.');
      return;
    }
    setError('');
    setCustomerMode('org_setup');
  };

  // Handle Step 3: Organization creation
  const handleCompleteOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName) {
      setError(isAr ? 'يرجى إدخال الاسم النظامي للمنشأة.' : 'Please enter your legal organization name.');
      return;
    }
    registerCustomer(email, fullName, orgName, sector);
  };

  // Handle Customer direct sign in
  const handleCustomerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(isAr ? 'يرجى إدخال البريد الإلكتروني المسجل.' : 'Please enter your registered email.');
      return;
    }
    switchPersona('customer_admin');
    setShowAuthModal(false);
    setView('portal_dashboard');
  };

  // Quick Demo Customer Login
  const handleQuickCustomerDemo = () => {
    switchPersona('customer_admin');
    setShowAuthModal(false);
    setView('portal_dashboard');
  };

  // GRC Staff Login Handlers
  const handleGrcConsultantLogin = () => {
    switchPersona('grc_consultant');
    setShowAuthModal(false);
    setView('workspace_pipeline');
  };

  const handleGrcManagerLogin = () => {
    switchPersona('grc_manager');
    setShowAuthModal(false);
    setView('workspace_pipeline');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
        {/* Top Brand Header */}
        <div className="bg-[#181818] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#12506E] to-[#0a2f42] text-white font-black flex items-center justify-center text-sm border border-[#2b7296]">
              αX
            </div>
            <div>
              <h3 className="font-bold text-base leading-none text-white">
                AlphaX GRC
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">
                IRSAA Business Solutions · Riyadh, Kingdom of Saudi Arabia
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-gray-400 hover:text-white p-1 rounded-md"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Category Switcher: Customer vs GRC Staff */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            onClick={() => {
              setAuthCategory('customer');
              setError('');
            }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              authCategory === 'customer'
                ? 'border-[#12506E] text-[#12506E] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>{isAr ? 'بوابة العميل والمنشآت' : 'Customer Portal'}</span>
          </button>

          <button
            onClick={() => {
              setAuthCategory('grc_staff');
              setError('');
            }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              authCategory === 'grc_staff'
                ? 'border-amber-600 text-amber-700 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'فريق عمل إرساء (داخلي)' : 'IRSAA GRC Team'}</span>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {/* =========================================
              CATEGORY 1: CUSTOMER PORTAL
             ========================================= */}
          {authCategory === 'customer' && (
            <div>
              {/* Customer sub-tabs: Sign In vs Register */}
              {(customerMode === 'signin' || customerMode === 'signup') && (
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                  <div className="flex gap-4 text-xs font-bold">
                    <button
                      onClick={() => {
                        setCustomerMode('signin');
                        setError('');
                      }}
                      className={
                        customerMode === 'signin'
                          ? 'text-[#12506E] border-b-2 border-[#12506E] pb-1'
                          : 'text-gray-500 hover:text-gray-900 pb-1'
                      }
                    >
                      {isAr ? 'تسجيل الدخول' : 'Sign In'}
                    </button>
                    <button
                      onClick={() => {
                        setCustomerMode('signup');
                        setError('');
                      }}
                      className={
                        customerMode === 'signup'
                          ? 'text-[#12506E] border-b-2 border-[#12506E] pb-1'
                          : 'text-gray-500 hover:text-gray-900 pb-1'
                      }
                    >
                      {isAr ? 'تسجيل منشأة جديدة' : 'Register Organization'}
                    </button>
                  </div>

                  <span className="text-[10px] text-gray-400 uppercase font-semibold">
                    Client Access
                  </span>
                </div>
              )}

              {/* Sub-mode: Customer Sign In */}
              {customerMode === 'signin' && (
                <div className="space-y-4">
                  <form onSubmit={handleCustomerSignIn} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {isAr ? 'البريد المهني المسجل *' : 'Registered Work Email *'}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="e.g. sarah.ghamdi@alnoor-finance.sa"
                          className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {isAr ? 'كلمة المرور *' : 'Password *'}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#12506E] hover:bg-[#0e4058] text-white text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>{isAr ? 'دخول إلى بوابة العميل' : 'Sign In to Portal'}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </form>

                  {/* 1-Click Quick Customer Demo Button */}
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleQuickCustomerDemo}
                      className="w-full py-2.5 px-3 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-[#12506E] text-xs font-bold rounded-lg flex items-center justify-between transition-colors shadow-sm"
                    >
                      <div className="text-start">
                        <div className="font-extrabold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                          <span>{isAr ? 'دخول تجريبي سريع: بنك النور' : 'Quick Demo: Customer CAE'}</span>
                        </div>
                        <div className="text-[10px] text-cyan-800 font-normal mt-0.5">
                          Sarah Al-Ghamdi · Al-Noor Financial Group
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180 flex-none text-[#12506E]" />
                    </button>
                  </div>
                </div>
              )}

              {/* Sub-mode: Customer Sign Up Step 1 */}
              {customerMode === 'signup' && (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAr
                      ? 'سجّل باستخدام بريدك المهني لإنشاء مساحة عمل خاصة بمنشأتك والحصول على صلاحية المشرف.'
                      : 'Register using your corporate email to initialize an isolated organization tenant and become Organization Administrator.'}
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Al-Ghamdi"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {isAr ? 'البريد الإلكتروني المهني *' : 'Work Email Address *'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@company.sa"
                        className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#12506E] hover:bg-[#0e4058] text-white text-sm font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>{isAr ? 'إرسال رمز التحقق' : 'Send Verification Code'}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </form>
              )}

              {/* Sub-mode: Customer Verify Code */}
              {customerMode === 'verify' && (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg text-xs text-cyan-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-700 mt-0.5 flex-none" />
                    <div>
                      {isAr
                        ? `تم إرسال رمز التحقق إلى ${email}. للتجربة تم إدخال الرمز 849201 تلقائياً.`
                        : `We sent a confirmation code to ${email}. Mock code 849201 is pre-filled for testing.`}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {isAr ? 'رمز التحقق (6 أرقام) *' : '6-Digit Verification Code *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      className="w-full px-3 py-2.5 text-center tracking-widest text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-[#12506E] hover:bg-[#0e4058] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    {isAr ? 'تأكيد الرمز والمتابعة' : 'Verify & Continue Setup'}
                  </button>
                </form>
              )}

              {/* Sub-mode: Customer Organization Setup */}
              {customerMode === 'org_setup' && (
                <form onSubmit={handleCompleteOrg} className="space-y-4">
                  <p className="text-xs text-gray-600">
                    {isAr
                      ? 'قم بإدخال بيانات منشأتك لتفعيل بوابة الحوكمة الخاصة بك.'
                      : 'Enter your legal organization details to initialize your isolated customer tenant.'}
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {isAr ? 'الاسم النظامي للمنشأة *' : 'Organization Legal Name *'}
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
                      <input
                        type="text"
                        required
                        value={orgName}
                        onChange={e => setOrgName(e.target.value)}
                        placeholder="e.g. Al-Noor Financial Group"
                        className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {isAr ? 'القطاع الاقتصادي *' : 'Economic Sector *'}
                    </label>
                    <select
                      value={sector}
                      onChange={e => setSector(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                    >
                      <option value="Banking & Finance">Banking & Finance (SAMA / CMA regulated)</option>
                      <option value="Insurance">Insurance & Reinsurance</option>
                      <option value="Government & Public Sector">Government & Public Sector</option>
                      <option value="Healthcare">Healthcare & Life Sciences</option>
                      <option value="Energy & Utilities">Energy, Oil & Utilities</option>
                      <option value="Logistics & Transport">Logistics & Supply Chain</option>
                      <option value="Retail & Consumer Goods">Retail & E-Commerce</option>
                      <option value="Technology & Telecom">Telecom & ICT</option>
                    </select>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 mt-0.5 flex-none" />
                    <div>
                      {isAr
                        ? 'بصفتك المشرف الأول، يمكنك دعوة زملائك في الإدارة ولن تظهر منشأتك لأي عميل آخر.'
                        : 'As the first user, you become the Organization Administrator. Colleagues must be invited by you; other customers cannot view your profile.'}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                  >
                    {isAr ? 'إنشاء ملف المنشأة والدخول' : 'Create Organization Profile & Enter'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* =========================================
              CATEGORY 2: IRSAA GRC STAFF ACCESS
             ========================================= */}
          {authCategory === 'grc_staff' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-700 mt-0.5 flex-none" />
                <div className="leading-relaxed">
                  <b>{isAr ? 'منطقة إدارية مقيدة:' : 'Restricted Internal Workspace:'}</b>{' '}
                  {isAr
                    ? 'هذه المساحة مخصصة لمستشاري ومراجعي شركة إرساء فقط لإدارة الاستبيانات ومراجعة تقييمات العملاء وإصدار التقارير المعتمدة.'
                    : 'Reserved strictly for authorized IRSAA GRC Advisory consultants and directors to review client submissions, manage survey versions, and release official reports.'}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  {isAr ? 'اختر حساب موظف GRC للدخول:' : 'Authorized IRSAA GRC Staff Credentials:'}
                </div>

                {/* Staff Member 1: Consultant */}
                <button
                  type="button"
                  onClick={handleGrcConsultantLogin}
                  className="w-full p-3.5 bg-white hover:bg-amber-50/50 border border-gray-200 hover:border-amber-300 rounded-xl text-start flex items-center justify-between transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm flex-none group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      TM
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-amber-900">
                        Tariq Al-Mansoor
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Senior GRC Consultant & Assessor
                      </div>
                      <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                        t.mansoor@irsaa.com · Primary Reviewer
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-700 rtl:rotate-180 flex-none" />
                </button>

                {/* Staff Member 2: Director */}
                <button
                  type="button"
                  onClick={handleGrcManagerLogin}
                  className="w-full p-3.5 bg-white hover:bg-amber-50/50 border border-gray-200 hover:border-amber-300 rounded-xl text-start flex items-center justify-between transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm flex-none group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      KZ
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-950">
                        Dr. Khalid Al-Zahrani
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Director of GRC Advisory Services
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                        k.zahrani@irsaa.com · Final Report Sign-off
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-700 rtl:rotate-180 flex-none" />
                </button>
              </div>

              <div className="text-[11px] text-gray-400 text-center pt-2">
                {isAr
                  ? 'ملاحظة: تظهر مساحة عمل فريق GRC حصرياً بعد تسجيل الدخول كفريق استشاري'
                  : 'Notice: GRC Team Workspace becomes accessible only upon authenticated staff login'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
