import React, { useState } from 'react';
import { useApp, UserPersona } from '../context/AppContext';
import { t } from '../utils/i18n';
import {
  Globe,
  Shield,
  UserCheck,
  Building2,
  FileCheck2,
  LogIn,
  LogOut,
  ChevronDown,
  Bell,
  Server,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    view,
    setView,
    currentUser,
    switchPersona,
    logout,
    setShowAuthModal,
    setShowConsultationModal,
    subscription,
    notifications,
  } = useApp();

  const isAr = language === 'ar';
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const isCustomer = currentUser.persona === 'customer_admin' || currentUser.persona === 'customer_assessor';
  const isGrcStaff = currentUser.persona === 'grc_consultant' || currentUser.persona === 'grc_manager';
  const isItAdmin = currentUser.persona === 'it_admin';

  const availablePersonas: { key: UserPersona; label: string; desc: string }[] = isCustomer
    ? [
        { key: 'customer_admin', label: 'Sarah Al-Ghamdi', desc: 'Chief Audit Executive (CAE) · Admin' },
        { key: 'customer_assessor', label: 'Fahad Al-Otaibi', desc: 'Senior Audit Lead · Respondent' },
      ]
    : isGrcStaff || isItAdmin
    ? [
        { key: 'grc_consultant', label: 'Tariq Al-Mansoor', desc: 'Senior GRC Consultant & Assessor' },
        { key: 'grc_manager', label: 'Dr. Khalid Al-Zahrani', desc: 'Director of GRC Advisory Services' },
        { key: 'it_admin', label: 'Majed Al-Mutairi', desc: 'Lead IT Systems & Infrastructure Admin' },
      ]
    : [];

  return (
    <header className="bg-[#181818] text-white sticky top-0 z-50 border-b border-gray-800 shadow-md">
      {/* Top Banner with Persona Quick-Switch and Brand Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand Link */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('website_home')}
              className="flex items-center gap-3 group text-start focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-[#12506E] flex items-center justify-center font-bold text-white text-base tracking-wider border border-[#2b7296] shadow-sm">
                IRSAA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    {t('brand_product', language)}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-800 text-cyan-300 border border-gray-700 hidden sm:inline-block">
                    GIAS 2024
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 hidden sm:block">
                  {t('location_hq', language)}
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Links: Strict role-based visibility */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setView('website_home')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                view.startsWith('website') ? 'bg-[#12506E] text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {t('nav_home', language)}
            </button>
            <button
              onClick={() => setView('website_catalogue')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                view === 'website_catalogue' ? 'bg-[#12506E] text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {t('nav_catalogue', language)}
            </button>
            <button
              onClick={() => setView('website_frameworks')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                view === 'website_frameworks' ? 'bg-[#12506E] text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {t('nav_frameworks', language)}
            </button>

            {/* Client Portal: ONLY visible if logged in as a customer */}
            {(currentUser.persona === 'customer_admin' || currentUser.persona === 'customer_assessor') && (
              <button
                onClick={() => setView('portal_dashboard')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  view.startsWith('portal') ? 'bg-[#12506E] text-white shadow-sm' : 'text-cyan-400 hover:text-cyan-300 hover:bg-gray-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{t('portal_access', language)}</span>
              </button>
            )}

            {/* GRC Team Workspace: ONLY visible if logged in as GRC team */}
            {(currentUser.persona === 'grc_consultant' || currentUser.persona === 'grc_manager') && (
              <button
                onClick={() => setView('workspace_pipeline')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  view.startsWith('workspace') ? 'bg-amber-700 text-white shadow-sm' : 'text-amber-400 hover:text-amber-300 hover:bg-gray-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('workspace_access', language)}</span>
              </button>
            )}

            {/* IT Admin Console Link: Accessible to IT Admin, GRC Manager, or for evaluation */}
            {(currentUser.persona === 'it_admin' || currentUser.persona === 'grc_manager' || isCustomer) && (
              <button
                onClick={() => setView('admin_settings')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  view === 'admin_settings' ? 'bg-cyan-700 text-white shadow-sm' : 'text-cyan-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>{t('admin_access', language)}</span>
              </button>
            )}
          </nav>

          {/* Right Tools: Trial Pill, Notification Bell, Language Switcher, Persona Switcher, Sign In/Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 14-Day Trial Version Pill */}
            {subscription.plan_tier === 'trial' && (
              <button
                onClick={() => setView('admin_settings')}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/70 text-amber-300 border border-amber-600/70 hover:bg-amber-900 transition-colors"
                title="14-Day Free Evaluation Trial · Click to manage in IT Admin"
              >
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>14d Trial ({subscription.days_remaining}d left)</span>
              </button>
            )}

            {/* Background Notification Center Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="relative p-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                title={isAr ? 'إشعارات النظام والبريد الإلكتروني' : 'Automated Email & Background Notifications'}
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-gray-900 font-bold text-[9px] flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotificationsDropdown && (
                <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-80 sm:w-96 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in text-start">
                  <div className="px-4 py-3 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-xs text-white">
                        {isAr ? 'الإشعارات الآلية الصادرة' : 'Automated Email Dispatch Log'}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowNotificationsDropdown(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-800 text-xs">
                    {notifications.slice(0, 5).map(n => (
                      <div key={n.id} className="p-3 hover:bg-gray-800/60 transition-colors space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span
                            className={`font-semibold px-1.5 py-0.2 rounded ${
                              n.trigger_type === 'clarification_required'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : n.trigger_type === 'deadline_approaching'
                                ? 'bg-orange-950 text-orange-300 border border-orange-800'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {n.trigger_type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="font-mono">{n.sent_at}</span>
                        </div>
                        <div className="font-bold text-gray-200 truncate">
                          {isAr ? n.subject_ar : n.subject}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">
                          To: {n.recipient_name} ({n.recipient_email})
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-gray-950 border-t border-gray-800 text-center">
                    <button
                      onClick={() => {
                        setView('admin_settings');
                        setShowNotificationsDropdown(false);
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      {isAr ? 'عرض كافة الإشعارات في لوحة الإدارة ←' : 'Open Dispatch Queue in IT Admin Console →'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border border-gray-700 hover:border-cyan-500 bg-gray-900/60 text-gray-200 transition-colors"
              title="Toggle English / Arabic"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('switch_lang', language)}</span>
            </button>

            {/* Persona switcher only visible for authenticated users */}
            {currentUser.persona !== 'guest' && availablePersonas.length > 0 && (
              <div className="relative group">
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200"
                  title="Switch User Role within your organization or advisory team"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden xl:inline text-gray-400">
                    {isCustomer ? 'Client:' : isItAdmin ? 'IT Admin:' : 'Staff:'}
                  </span>
                  <span className="font-semibold text-white max-w-[120px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-1 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl py-2 hidden group-hover:block z-50 text-start">
                  <div className="px-3 py-1.5 border-b border-gray-800 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    {isCustomer ? currentUser.orgName : 'IRSAA Platform Administration'}
                  </div>
                  {availablePersonas.map(p => (
                    <button
                      key={p.key}
                      onClick={() => switchPersona(p.key)}
                      className={`w-full text-start px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-gray-800 transition-colors ${
                        currentUser.persona === p.key ? 'bg-cyan-950/50 text-cyan-300 font-semibold border-l-2 border-cyan-400' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-white">{p.label}</span>
                      <span className="text-[11px] text-gray-400">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Authentication Action: Sign In or Sign Out */}
            {currentUser.persona === 'guest' ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#12506E] hover:bg-[#186287] text-white transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('sign_in', language)}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowConsultationModal(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-700/80 hover:bg-emerald-600 text-white transition-all"
                >
                  <span>{t('request_consultation', language)}</span>
                </button>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                  title="Sign out of session"
                >
                  <LogOut className="w-3 h-3 text-red-400" />
                  <span>{t('sign_out', language)}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
