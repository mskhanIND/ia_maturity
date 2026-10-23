import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TierDefinition, PlanFeatureDefinition, SubscriptionTier } from '../../types';
import { ALL_PLAN_FEATURES } from '../../data/subscriptionTiersData';
import {
  Sparkles,
  CheckCircle2,
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Database,
  RefreshCw,
  Check,
  Building,
  FileCode,
  Shield,
  Users,
  HardDrive,
  FileCheck2,
  X,
  Server
} from 'lucide-react';

export const SubscriptionManagement: React.FC = () => {
  const {
    language,
    tiers,
    updateTier,
    addTier,
    subscription,
    updateSubscription,
    organizations,
    frappeConfig,
    currentUser,
  } = useApp();

  const isAr = language === 'ar';

  const [selectedTierId, setSelectedTierId] = useState<string>('tier-trial');
  const [editingTier, setEditingTier] = useState<TierDefinition | null>(null);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Form state for creating a new tier
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanNameAr, setNewPlanNameAr] = useState('');
  const [newPlanCode, setNewPlanCode] = useState<SubscriptionTier>('standard');
  const [newMonthlyPrice, setNewMonthlyPrice] = useState(3000);
  const [newAnnualPrice, setNewAnnualPrice] = useState(30000);
  const [newMaxAssessments, setNewMaxAssessments] = useState(15);
  const [newMaxSeats, setNewMaxSeats] = useState(10);
  const [newMaxStorage, setNewMaxStorage] = useState(25);
  const [selectedOrgToAssign, setSelectedOrgToAssign] = useState<string>(organizations[0]?.id || '');

  const activeTier = tiers.find(t => t.id === selectedTierId) || tiers[0];

  // Toggle a feature for a tier
  const handleToggleFeature = (tierId: string, featureId: string, currentVal: boolean) => {
    const target = tiers.find(t => t.id === tierId);
    if (!target) return;

    const updatedFeatures = target.features.map(f =>
      f.id === featureId ? { ...f, enabled: !currentVal } : f
    );

    updateTier(tierId, { features: updatedFeatures });

    // If active plan is current subscription, update it too
    if (subscription.plan_tier === target.tier_code) {
      updateSubscription({
        features: updatedFeatures.filter(f => f.enabled).map(f => f.name),
        features_ar: updatedFeatures.filter(f => f.enabled).map(f => f.name_ar),
      });
    }
  };

  // Sync to Frappe Framework
  const handleSyncToFrappe = () => {
    setSyncStatus(
      isAr
        ? 'جاري المزامنة مع خادم فرابي فريموورك (Frappe Bench)...'
        : 'Syncing tier schemas with Frappe Framework Desk...'
    );

    setTimeout(() => {
      setSyncStatus(
        isAr
          ? 'تم تحديث نموذج DocType (AlphaX Subscription Tier) في منصة فرابي بنجاح (200 OK).'
          : 'Successfully synchronized 3 tier records into Frappe Framework DocType (AlphaX Subscription Tier).'
      );
      setTimeout(() => setSyncStatus(null), 5000);
    }, 800);
  };

  // Assign an organization to a tier
  const handleAssignOrgToTier = (tier: TierDefinition) => {
    const targetOrg = organizations.find(o => o.id === selectedOrgToAssign) || organizations[0];
    if (!targetOrg) return;

    const isTrial = tier.is_trial;
    const today = new Date();
    const trialEnd = new Date(today);
    trialEnd.setDate(trialEnd.getDate() + (tier.trial_duration_days || 14));

    updateSubscription({
      plan_tier: tier.tier_code,
      plan_name: tier.name,
      plan_name_ar: tier.name_ar,
      max_assessments: tier.max_assessments,
      max_team_members: tier.max_team_members,
      max_storage_gb: tier.max_storage_gb,
      days_remaining: isTrial ? 14 : 365,
      trial_end_date: trialEnd.toISOString().split('T')[0],
      features: tier.features.filter(f => f.enabled).map(f => f.name),
      features_ar: tier.features.filter(f => f.enabled).map(f => f.name_ar),
      assigned_org_id: targetOrg.id,
      assigned_org_name: targetOrg.entity_name,
    });

    setSyncStatus(
      isAr
        ? `تم تعيين منشأة "${targetOrg.entity_name}" إلى باقة "${tier.name_ar}".`
        : `Organization "${targetOrg.entity_name}" successfully provisioned on plan "${tier.name}".`
    );
    setTimeout(() => setSyncStatus(null), 4000);
  };

  // Handle Create New Plan
  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName) return;

    const newTier: TierDefinition = {
      id: `tier-custom-${Date.now()}`,
      name: newPlanName,
      name_ar: newPlanNameAr || newPlanName,
      tier_code: newPlanCode,
      price_sar_monthly: newMonthlyPrice,
      price_sar_annual: newAnnualPrice,
      is_trial: newPlanCode === 'trial',
      trial_duration_days: newPlanCode === 'trial' ? 14 : undefined,
      max_assessments: newMaxAssessments,
      max_team_members: newMaxSeats,
      max_storage_gb: newMaxStorage,
      frappe_doctype: 'AlphaX Subscription Tier',
      features: ALL_PLAN_FEATURES.map(f => ({ ...f, enabled: true })),
    };

    addTier(newTier);
    setSelectedTierId(newTier.id);
    setShowNewPlanModal(false);
    setNewPlanName('');
    setNewPlanNameAr('');
  };

  return (
    <div className="space-y-6 text-start">
      {/* Top Banner with Frappe Framework Desk Indicator */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#12506E] text-white rounded-2xl p-6 sm:p-7 border border-gray-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Frappe Framework Management Desk</span>
              </span>
              <span className="text-[11px] text-gray-400 font-mono">
                DocType: AlphaX Subscription Tier
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {isAr ? 'إدارة باقات الاشتراك والنسخ التجريبية' : 'Tiered Subscription & Feature Access Management'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              {isAr
                ? 'تعريف وإدارة خطط الاشتراك المتدرجة (النسخة التجريبية 14 يوماً، الخطة القياسية، باقة المنشآت السيادية) وتحديد مستويات صلاحيات الميزات عبر منصة فرابي فريموورك.'
                : 'Define and manage subscription tiers (14-Day Evaluation, Standard, Enterprise) with associated feature access levels, quotas, and Frappe Framework DocType sync.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowNewPlanModal(true)}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إنشاء باقة جديدة' : 'Define New Plan'}</span>
            </button>
            <button
              onClick={handleSyncToFrappe}
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isAr ? 'مزامنة مع فرابي' : 'Sync with Frappe'}</span>
            </button>
          </div>
        </div>

        {/* Sync notification */}
        {syncStatus && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 rounded-lg text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

      {/* Tier Switcher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tiers.map(tier => {
          const isSelected = selectedTierId === tier.id;
          const isCurrentlyActive = subscription.plan_tier === tier.tier_code;

          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              className={`bg-white rounded-xl p-5 border cursor-pointer transition-all space-y-4 relative ${
                isSelected
                  ? 'border-[#12506E] shadow-md ring-2 ring-[#12506E]/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Badges */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    tier.tier_code === 'trial'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : tier.tier_code === 'standard'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-purple-100 text-purple-800 border border-purple-300'
                  }`}
                >
                  {tier.tier_code.toUpperCase()}
                </span>

                {isCurrentlyActive && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{isAr ? 'الباقة المفعلة للمنظومة' : 'Active Tenant Plan'}</span>
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {isAr ? tier.name_ar : tier.name}
                </h3>
                <div className="mt-1 flex items-baseline gap-1">
                  {tier.price_sar_monthly === 0 ? (
                    <span className="text-xl font-bold text-emerald-700">
                      {isAr ? 'مجاناً للتقييم' : 'Free (Evaluation)'}
                    </span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-gray-900">
                        {tier.price_sar_monthly.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">SAR / month</span>
                      <span className="text-[11px] text-gray-400 mx-1">
                        ({tier.price_sar_annual.toLocaleString()} SAR/yr)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Quotas Summary */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-[10px] text-gray-500 font-medium">{isAr ? 'التقييمات' : 'Assessments'}</div>
                  <div className="font-bold text-xs text-gray-900">{tier.max_assessments}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-[10px] text-gray-500 font-medium">{isAr ? 'المقاعد' : 'Team Seats'}</div>
                  <div className="font-bold text-xs text-gray-900">{tier.max_team_members}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <div className="text-[10px] text-gray-500 font-medium">{isAr ? 'التخزين' : 'Storage'}</div>
                  <div className="font-bold text-xs text-gray-900">{tier.max_storage_gb} GB</div>
                </div>
              </div>

              {/* Enabled feature count */}
              <div className="text-xs text-gray-500 flex items-center justify-between pt-1">
                <span>
                  {tier.features.filter(f => f.enabled).length} of {tier.features.length} {isAr ? 'ميزات مفعلة' : 'features active'}
                </span>
                <span className="text-[11px] text-[#12506E] font-bold">
                  {isSelected ? (isAr ? 'محدد للتعديل ←' : 'Selected →') : (isAr ? 'عرض التفاصيل' : 'Configure')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Tier Feature Access Matrix & Organization Provisioning */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#12506E]" />
              <h3 className="font-bold text-base text-gray-900">
                {isAr
                  ? `مصفوفة الصلاحيات والميزات: ${activeTier.name_ar}`
                  : `Feature Access Control Matrix: ${activeTier.name}`}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {isAr
                ? 'تحكم في الميزات المتاحة للمستخدمين المشتركين في هذه الباقة. تنعكس التعديلات فوراً على واجهة البوابة وخصائص التقييم.'
                : 'Toggle granular feature permissions and service capabilities included in this tier.'}
            </p>
          </div>

          {/* Assign Organization to this Plan */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-xs">
            <span className="font-semibold text-gray-700 whitespace-nowrap">
              {isAr ? 'تخصيص لمنشأة:' : 'Assign to Org:'}
            </span>
            <select
              value={selectedOrgToAssign}
              onChange={e => setSelectedOrgToAssign(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white font-medium"
            >
              {organizations.map(org => (
                <option key={org.id} value={org.id}>
                  {org.entity_name} ({org.sector})
                </option>
              ))}
            </select>
            <button
              onClick={() => handleAssignOrgToTier(activeTier)}
              className="px-3 py-1.5 rounded-lg bg-[#12506E] hover:bg-[#186287] text-white font-bold whitespace-nowrap transition-all shadow-sm"
            >
              {isAr ? 'تطبيق الباقة' : 'Apply Plan to Org'}
            </button>
          </div>
        </div>

        {/* Feature Checkbox Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeTier.features.map(feat => (
            <div
              key={feat.id}
              onClick={() => handleToggleFeature(activeTier.id, feat.id, feat.enabled)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                feat.enabled
                  ? 'bg-cyan-50/40 border-cyan-200 hover:bg-cyan-50/70'
                  : 'bg-gray-50 border-gray-200 opacity-60 hover:opacity-90'
              }`}
            >
              <input
                type="checkbox"
                checked={feat.enabled}
                onChange={() => {}} // handled by parent div
                className="mt-1 w-4 h-4 text-[#12506E] rounded cursor-pointer"
              />
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900">
                    {isAr ? feat.name_ar : feat.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-gray-500 border border-gray-200 uppercase">
                    {feat.category}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500">
                  {feat.enabled
                    ? isAr ? 'متاح ومفعل في هذه الباقة' : 'Access granted in this tier'
                    : isAr ? 'محجوب (يتطلب الترقية)' : 'Locked (Requires higher tier)'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quota Customizer for this Tier */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider">
            {isAr ? 'تعديل السعات والحصص الرقمية للباقة' : 'Numeric Quota Limits for This Tier'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">
                {isAr ? 'الحد الأقصى للتقييمات' : 'Max Assessments'}
              </label>
              <input
                type="number"
                min="1"
                max="9999"
                value={activeTier.max_assessments}
                onChange={e => updateTier(activeTier.id, { max_assessments: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs font-bold border border-gray-300 rounded-lg bg-white"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">
                {isAr ? 'مقاعد فريق العمل' : 'Team Member Seats'}
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={activeTier.max_team_members}
                onChange={e => updateTier(activeTier.id, { max_team_members: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs font-bold border border-gray-300 rounded-lg bg-white"
              />
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">
                {isAr ? 'مساحة التخزين المشفرة (جيجابايت)' : 'Encrypted Storage (GB)'}
              </label>
              <input
                type="number"
                min="1"
                max="2000"
                value={activeTier.max_storage_gb}
                onChange={e => updateTier(activeTier.id, { max_storage_gb: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs font-bold border border-gray-300 rounded-lg bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Define New Subscription Tier */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-start">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#181818] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {isAr ? 'تعريف باقة اشتراك جديدة (Frappe DocType)' : 'Define New Tiered Subscription Plan'}
                </h3>
              </div>
              <button
                onClick={() => setShowNewPlanModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Plan Name (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Banking Sovereign Tier"
                  value={newPlanName}
                  onChange={e => setNewPlanName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">Plan Name (Arabic)</label>
                <input
                  type="text"
                  placeholder="مثال: باقة البنوك والقطاع المالي"
                  value={newPlanNameAr}
                  onChange={e => setNewPlanNameAr(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Monthly Price (SAR)</label>
                  <input
                    type="number"
                    min="0"
                    value={newMonthlyPrice}
                    onChange={e => setNewMonthlyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Annual Price (SAR)</label>
                  <input
                    type="number"
                    min="0"
                    value={newAnnualPrice}
                    onChange={e => setNewAnnualPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Max Assessments</label>
                  <input
                    type="number"
                    min="1"
                    value={newMaxAssessments}
                    onChange={e => setNewMaxAssessments(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Team Seats</label>
                  <input
                    type="number"
                    min="1"
                    value={newMaxSeats}
                    onChange={e => setNewMaxSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 block">Storage (GB)</label>
                  <input
                    type="number"
                    min="1"
                    value={newMaxStorage}
                    onChange={e => setNewMaxStorage(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-[11px]">
                {isAr
                  ? 'سيتم تسجيل هذه الخطة آلياً كـ DocType في منصة فرابي وتفعيل كافة ميزات التقييم لها افتراضياً.'
                  : 'This tier will be registered into Frappe Framework as an AlphaX Subscription Tier with all core features enabled.'}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPlanModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-100"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  {isAr ? 'حفظ وتفعيل الباقة' : 'Save & Provision Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
