import React, { useState } from 'react';
import { InsurancePlan, CustomerProfile, CustomerPolicyItem, PlanCategory, PayerOrganizationType } from '../types';
import { formatCurrency, getPlanTargetAudience, getPlanPrimaryAudience } from '../data/plans';
import { calculatePolicyDuration } from '../data/customers';
import {
  Check,
  Layers,
  UserCheck,
  Calendar,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Plus,
  FileText,
  Car,
  Home,
  Shield,
  Building,
  Landmark,
  Users,
  Heart,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  CreditCard,
  Share2,
  ExternalLink,
  ShoppingCart,
  Scale,
  Eye,
  Search,
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { ForwardCustomerModal, PlanCodeProposalData } from './ForwardCustomerModal';

interface PlanSelectorProps {
  allPlans: InsurancePlan[];
  selectedPlanIds: string[];
  onTogglePlan: (planId: string) => void;
  onSetSelection: (planIds: string[]) => void;
  currentAge?: number | null;
  existingCustomer?: CustomerProfile | null;
  onResetCustomer?: () => void;
  onOpenPlanSettings?: () => void;
  onGoToComparison?: () => void;
  onViewPlanDetail?: (plan: InsurancePlan) => void;
  onAssignPlanToCustomer?: (customer: CustomerProfile, newPolicy: CustomerPolicyItem) => void;
  onShowToast?: (msg: string) => void;
  payerType?: PayerOrganizationType;
  isSearchActive?: boolean;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  allPlans,
  selectedPlanIds,
  onTogglePlan,
  onSetSelection,
  currentAge = null,
  existingCustomer = null,
  onResetCustomer,
  onOpenPlanSettings,
  onGoToComparison,
  onViewPlanDetail,
  onAssignPlanToCustomer,
  onShowToast,
  payerType,
  isSearchActive = false,
}) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'health' | 'pa'>('all');
  const [customerPolicyFilter, setCustomerPolicyFilter] = useState<'all' | 'health_pa' | 'motor' | 'other'>('all');
  const [selectedAudienceFilter, setSelectedAudienceFilter] = useState<
    'all' | 'government' | 'office' | 'general'
  >('all');
  const [showAllRegardlessOfSearch, setShowAllRegardlessOfSearch] = useState<boolean>(false);
  const [interestedToastPlanName, setInterestedToastPlanName] = useState<string | null>(null);

  // Sync audience filter when payerType changes from search (only when isSearchActive is true)
  React.useEffect(() => {
    if (!isSearchActive) {
      setSelectedAudienceFilter('all');
      setShowAllRegardlessOfSearch(false);
      return;
    }
    if (payerType === 'government') {
      setSelectedAudienceFilter('government');
      setShowAllRegardlessOfSearch(false);
    } else if (payerType === 'private') {
      setSelectedAudienceFilter('office');
      setShowAllRegardlessOfSearch(false);
    } else if (payerType === 'general') {
      setSelectedAudienceFilter('general');
      setShowAllRegardlessOfSearch(false);
    }
  }, [payerType, isSearchActive]);

  // Buy Insurance & Forward Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState<boolean>(false);
  const [selectedPlanForAction, setSelectedPlanForAction] = useState<InsurancePlan | null>(null);

  const MAX_SELECTION = 3;
  const isMaxSelected = selectedPlanIds.length >= MAX_SELECTION;

  const getPlanProposalData = (plan: InsurancePlan): PlanCodeProposalData => {
    const isPa = plan.category === 'pa';
    const accidentCoverage = plan.paSchedule?.permanentDisability || plan.life.accidentGeneral || 200000;
    return {
      insuranceType: isPa ? 'pa' : 'health',
      planCode: plan.code,
      planName: plan.name,
      quotingCode: `SSM-${plan.code.toUpperCase()}-WEB`,
      sumInsuredText: isPa
        ? `วงเงินเสียชีวิต/ทุพพลภาพ ฿${formatCurrency(accidentCoverage)} / ค่ารักษาอุบัติเหตุ ฿${formatCurrency(plan.opd.accident || 20000)}`
        : `ค่าห้อง ฿${formatCurrency(plan.roomNormal.perNight)}/คืน (ผู้ป่วยใน IPD รวม ฿${formatCurrency(plan.medicalGeneralPerVisit + plan.surgeryPerDisorder)})`,
      premiumAmount: plan.monthlyPremium,
      premiumModeText: 'รายเดือน',
      annualEquivalentText: `฿${formatCurrency(plan.annualPremium)}/ปี`,
      monthlyAmount: plan.monthlyPremium,
      annualAmount: plan.annualPremium,
      highlights: [
        isPa
          ? `ความคุ้มครองอุบัติเหตุ 24 ชั่วโมง ทั่วโลก`
          : `คุ้มครองผู้ป่วยใน (IPD) ค่าห้อง ฿${formatCurrency(plan.roomNormal.perNight)}/คืน`,
        plan.opd.illness.covered
          ? `มี OPD โรคทั่วไป ฿${formatCurrency(plan.opd.illness.perVisit || 500)}/ครั้ง (${plan.opd.illness.maxVisitsPerYear || 9} ครั้ง/ปี)`
          : isPa
          ? `ค่ารักษาพยาบาลอุบัติเหตุ ฿${formatCurrency(plan.opd.accident)}/ครั้ง`
          : `คุ้มครองอุบัติเหตุฉุกเฉินและเสียชีวิต ฿${formatCurrency(plan.life.accidentGeneral || 200000)}`,
        `ชำระเบี้ยรายเดือนเริ่มต้นเพียง ฿${formatCurrency(plan.monthlyPremium)}/เดือน หรือ ฿${formatCurrency(plan.annualPremium)}/ปี`,
        `ออกกรมธรรม์ออนไลน์ มีผลคุ้มครองตามเงื่อนไขทันที`,
      ],
      taxDeductible: plan.category === 'health' ? Math.min(plan.annualPremium, 25000) : 0,
    };
  };

  const handleBuyPlanClick = (plan: InsurancePlan, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlanForAction(plan);
    setIsPaymentModalOpen(true);
  };

  const handleForwardPlanClick = (plan: InsurancePlan, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlanForAction(plan);
    setIsForwardModalOpen(true);
  };

  const handlePaymentSuccess = (issuedPolicy: CustomerPolicyItem) => {
    if (selectedPlanForAction) {
      const targetCustomer: CustomerProfile = existingCustomer || {
        idCard: '1100200300400',
        fullName: 'คุณลูกค้าสยามสไมล์',
        birthDate: '1995-05-15',
        age: 30,
        phone: '081-445-6789',
        policyNumber: issuedPolicy.policyNumber,
        existingPlanId: selectedPlanForAction.id,
        startDate: issuedPolicy.startDate,
        lossClaimRate: 0,
        lossClaimStatus: '0% (กรมธรรม์ใหม่)',
        lineOaRegistered: true,
        lineOaStatusText: 'ชำระเงินออนไลน์แล้ว',
        policies: [issuedPolicy],
      };
      onAssignPlanToCustomer?.(targetCustomer, issuedPolicy);
    }
  };

  const handleInterestedClick = (plan: InsurancePlan, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedPlanIds.includes(plan.id)) {
      if (selectedPlanIds.length < MAX_SELECTION) {
        onTogglePlan(plan.id);
        setInterestedToastPlanName(`บันทึกความสนใจ ${plan.name} เรียบร้อยแล้ว (เลือก ${selectedPlanIds.length + 1}/3 แผน)`);
      } else {
        setInterestedToastPlanName(`เลือกเปรียบเทียบได้สูงสุด ${MAX_SELECTION} แผน กรุณายกเลิกแผนเดิมก่อน`);
      }
    } else {
      onTogglePlan(plan.id);
      setInterestedToastPlanName(`ยกเลิกความสนใจ ${plan.name} แล้ว`);
    }
    setTimeout(() => {
      setInterestedToastPlanName(null);
    }, 3200);
  };

  const existingCustomerPlan = existingCustomer
    ? allPlans.find((p) => p.id === existingCustomer.existingPlanId) || null
    : null;

  const isExistingPlanSelected = existingCustomerPlan
    ? selectedPlanIds.includes(existingCustomerPlan.id)
    : false;

  const policyDuration = existingCustomer
    ? calculatePolicyDuration(existingCustomer.startDate)
    : null;

  const filteredPlans = allPlans.filter((plan) => {
    if (activeCategoryTab === 'health' && plan.category !== 'health') return false;
    if (activeCategoryTab === 'pa' && plan.category !== 'pa') return false;
    if (selectedAudienceFilter !== 'all') {
      const primaryAud = getPlanPrimaryAudience(plan.id);
      if (
        primaryAud.audienceGroup !== selectedAudienceFilter &&
        !primaryAud.tags.includes(selectedAudienceFilter)
      ) {
        return false;
      }
    }
    // Filter by age when search is active and user has not toggled showAllRegardlessOfSearch
    if (currentAge !== null && isSearchActive && !showAllRegardlessOfSearch) {
      if (currentAge < plan.minAge || currentAge > plan.maxAge) {
        return false;
      }
    }
    return true;
  });

  // Reference plan when at least 1 plan is selected
  const referencePlan = selectedPlanIds.length > 0
    ? allPlans.find((p) => p.id === selectedPlanIds[0]) || null
    : null;
  const referenceAudienceInfo = referencePlan
    ? getPlanPrimaryAudience(referencePlan.id)
    : null;

  const healthPlansCount = allPlans.filter((p) => p.category === 'health').length;
  const paPlansCount = allPlans.filter((p) => p.category === 'pa').length;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-3.5 sm:p-5 mb-4">
      {/* 1. ข้อมูลลูกค้าเดิมและแผนที่ถือครอง: แสดงเฉพาะประกันสุขภาพและอุบัติเหตุ (Health & PA) */}
      {existingCustomer && (() => {
        const customerPolicies: CustomerPolicyItem[] =
          existingCustomer.policies && existingCustomer.policies.length > 0
            ? existingCustomer.policies
            : [
                {
                  policyNumber: existingCustomer.policyNumber,
                  planId: existingCustomer.existingPlanId,
                  policyType: 'health',
                  startDate: existingCustomer.startDate,
                  lossClaimRate: existingCustomer.lossClaimRate,
                  lossClaimStatus: existingCustomer.lossClaimStatus,
                },
              ];

        const getPolicyType = (pol: CustomerPolicyItem): 'health' | 'pa' | 'motor' | 'fire' | 'life' | 'other' => {
          if (pol.policyType) return pol.policyType;
          if (
            pol.vehicleDetails ||
            pol.customPlanName?.includes('รถ') ||
            pol.customPlanName?.includes('พ.ร.บ.') ||
            pol.policyNumber.startsWith('VMI') ||
            pol.policyNumber.startsWith('CMI')
          ) {
            return 'motor';
          }
          if (
            pol.customPlanName?.includes('อัคคีภัย') ||
            pol.customPlanName?.includes('บ้าน') ||
            pol.policyNumber.startsWith('FIR')
          ) {
            return 'fire';
          }
          const plan = allPlans.find((p) => p.id === pol.planId);
          if (plan?.category === 'pa' || pol.policyNumber.includes('PA')) return 'pa';
          return 'health';
        };

        // แยกเฉพาะกรมธรรม์สุขภาพและอุบัติเหตุ (Health & PA) ตามที่ผู้ใช้ระบุ
        const healthPaPolicies = customerPolicies.filter((p) => {
          const type = getPolicyType(p);
          return type === 'health' || type === 'pa';
        });

        const healthOnlyCount = healthPaPolicies.filter((p) => getPolicyType(p) === 'health').length;
        const paOnlyCount = healthPaPolicies.filter((p) => getPolicyType(p) === 'pa').length;

        if (healthPaPolicies.length === 0) {
          return (
            <div className="mb-5 rounded-xl border border-sky-200 bg-sky-50/60 p-4 text-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#00509d]" />
                  <span className="font-bold text-slate-900 text-sm">
                    ผู้เอาประกัน: คุณ{existingCustomer.fullName} (อายุ {existingCustomer.age} ปี)
                  </span>
                  {existingCustomer.payerName && existingCustomer.payerRelation !== 'ตนเอง' && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-white text-slate-700 font-medium border border-sky-200">
                      ผู้ชำระเบี้ย: {existingCustomer.payerName}
                    </span>
                  )}
                </div>
                {onResetCustomer && (
                  <button
                    type="button"
                    onClick={onResetCustomer}
                    className="text-xs text-[#0088cc] hover:text-[#00509d] underline font-medium cursor-pointer"
                  >
                    เปลี่ยนลูกค้า
                  </button>
                )}
              </div>
              <p className="text-slate-600 text-xs mt-2">
                คุณ{existingCustomer.fullName} ถือครองเฉพาะกรมธรรม์ประเภทอื่น (เช่น ประกันภัยรถยนต์) และยังไม่มีกรมธรรม์ประกันสุขภาพหรืออุบัติเหตุในระบบ ท่านสามารถเลือกดูและสมัครแผนความคุ้มครองสุขภาพหรือ PA ใหม่ด้านล่างเพื่อเพิ่มความคุ้มครองได้ทันที
              </p>
            </div>
          );
        }

        const displayedCustomerPolicies = healthPaPolicies.filter((pol) => {
          if (customerPolicyFilter === 'all') return true;
          const type = getPolicyType(pol);
          if (customerPolicyFilter === 'health_pa') return type === 'health';
          if (customerPolicyFilter === 'motor') return type === 'pa';
          return true;
        });

        let totalExistingMonthly = 0;

        healthPaPolicies.forEach((pol) => {
          const plan = pol.planId ? allPlans.find((p) => p.id === pol.planId) : undefined;
          totalExistingMonthly += plan?.monthlyPremium ?? pol.monthlyPremium ?? 0;
        });

        return (
          <div className="mb-5 rounded-xl border border-blue-200/80 bg-white shadow-xs overflow-hidden">
            {/* Header: Customer Info & Status Bar - แสดงเฉพาะประกันสุขภาพและ PA */}
            <div className="bg-blue-50/70 px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <UserCheck className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      ผู้เอาประกัน: คุณ{existingCustomer.fullName}
                    </span>
                    <span className="text-xs text-slate-500">
                      (อายุ {existingCustomer.age} ปี)
                    </span>
                    <span className="text-xs font-semibold text-[#00509d]">
                      • รวม {healthPaPolicies.length} กรมธรรม์ (สุขภาพ/PA)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 mt-0.5 text-xs text-slate-500 flex-wrap">
                    {existingCustomer.payerName && (
                      <>
                        <span>
                          ผู้ชำระเบี้ย:{' '}
                          <strong className="text-slate-700">
                            {existingCustomer.payerName}
                            {existingCustomer.payerRelation && existingCustomer.payerRelation !== 'ตนเอง'
                              ? ` (${existingCustomer.payerRelation})`
                              : ''}
                          </strong>
                        </span>
                        <span className="text-slate-300">•</span>
                      </>
                    )}
                    <span>LINE OA: <strong className="text-slate-700">{existingCustomer.lineOaStatusText}</strong></span>
                  </div>
                </div>
              </div>

              {onResetCustomer && (
                <button
                  type="button"
                  onClick={onResetCustomer}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline self-start sm:self-center cursor-pointer transition-colors"
                >
                  เปลี่ยนลูกค้า
                </button>
              )}
            </div>

            {/* Filter Tabs for Health and PA only */}
            {healthPaPolicies.length > 1 && healthOnlyCount > 0 && paOnlyCount > 0 && (
              <div className="bg-white px-3.5 py-2 border-b border-slate-100 flex items-center gap-1.5 flex-wrap text-xs">
                <button
                  type="button"
                  onClick={() => setCustomerPolicyFilter('all')}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                    customerPolicyFilter === 'all'
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  ทั้งหมด ({healthPaPolicies.length})
                </button>

                <button
                  type="button"
                  onClick={() => setCustomerPolicyFilter('health_pa')}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                    customerPolicyFilter === 'health_pa'
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-blue-500" />
                  <span>ประกันสุขภาพ ({healthOnlyCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomerPolicyFilter('motor')}
                  className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer flex items-center gap-1 ${
                    customerPolicyFilter === 'motor'
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Shield className="w-3 h-3 text-blue-500" />
                  <span>ประกันอุบัติเหตุ PA ({paOnlyCount})</span>
                </button>
              </div>
            )}

            {/* Policies list in clean minimal blue-tinted rows (Health & PA only) */}
            <div className="divide-y divide-slate-100">
              {displayedCustomerPolicies.map((pol, idx) => {
                const type = getPolicyType(pol);
                const plan = pol.planId ? allPlans.find((p) => p.id === pol.planId) : undefined;
                const duration = calculatePolicyDuration(pol.startDate);
                const isSelected = pol.planId ? selectedPlanIds.includes(pol.planId) : false;
                const monthly = plan?.monthlyPremium ?? pol.monthlyPremium ?? 0;
                const lossRate = pol.lossClaimRate ?? existingCustomer.lossClaimRate;
                const lossStatusDisplay =
                  lossRate !== undefined && lossRate !== null
                    ? `${lossRate}%`
                    : (pol.lossClaimStatus || existingCustomer.lossClaimStatus || '0%').replace(/\s*\([^)]*\)/g, '').trim();

                const displayName = plan?.name || pol.customPlanName || pol.planId || pol.policyNumber;

                return (
                  <div
                    key={`${pol.policyNumber}-${idx}`}
                    className="p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 hover:bg-blue-50/20 transition-colors"
                  >
                    {/* Left: Plan Info & Indicators */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-x-2 gap-y-1 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {displayName}
                        </span>

                        <span className="text-slate-300">•</span>

                        <span className="text-xs font-semibold text-[#00509d]">
                          {plan?.category === 'pa' || type === 'pa' ? 'ประกันอุบัติเหตุ PA' : 'ประกันสุขภาพ'}
                        </span>

                        <span className="text-slate-300">•</span>

                        <span className="text-xs text-slate-600">
                          เลขที่: <strong className="font-mono font-medium text-slate-800">{pol.policyNumber}</strong>
                        </span>
                      </div>

                      {/* Dates & Loss Claim status */}
                      <div className="flex items-center gap-2 sm:gap-4 mt-1.5 text-xs text-slate-500 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>วันที่เริ่ม: <strong className="text-slate-700 font-medium">{pol.startDate}</strong></span>
                        </div>
                        {pol.endDate && (
                          <>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                              <span>สิ้นสุด: <strong className="text-slate-700 font-medium">{pol.endDate}</strong></span>
                            </div>
                          </>
                        )}
                        <span className="text-slate-300">•</span>
                        <div>
                          <span>ระยะเวลา: <strong className="text-blue-900 font-semibold">{duration.displayText}</strong></span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <div>
                          <span>ประวัติเคลม: <strong className="text-slate-700 font-medium">{lossStatusDisplay}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Premium & Action Button */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-left lg:text-right">
                        <div className="text-xs sm:text-sm font-bold text-slate-900">
                          {formatCurrency(monthly)} <span className="text-[11px] text-slate-500 font-normal">บาท/เดือน</span>
                        </div>
                      </div>

                      {/* Compare toggle button if it's a selectable health/PA plan */}
                      {plan ? (
                        <button
                          type="button"
                          onClick={() => onTogglePlan(plan.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-2xs ${
                            isSelected
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-blue-200" />
                              <span>อยู่ในตาราง</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 text-blue-600" />
                              <span>เปรียบเทียบ</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>คุ้มครองอยู่</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total summary bar across health and PA held policies */}
            {healthPaPolicies.length > 1 && (
              <div className="bg-blue-50/50 px-4 py-2.5 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-slate-700">
                    รวมเบี้ยแผนสุขภาพและอุบัติเหตุเดิมที่ถือครอง ({healthPaPolicies.length} กรมธรรม์):
                  </span>
                  {healthOnlyCount > 0 && (
                    <span className="text-[11px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      สุขภาพ {healthOnlyCount} ฉบับ
                    </span>
                  )}
                  {paOnlyCount > 0 && (
                    <span className="text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      PA {paOnlyCount} ฉบับ
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1.5 self-start sm:self-auto">
                  <span className="font-bold text-blue-900 text-xs sm:text-sm">
                    {formatCurrency(totalExistingMonthly)} บาท/เดือน
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Visual Section Divider: มินิมอล เรียบร้อย */}
      {existingCustomer && (
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <div className="relative inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-500 shadow-2xs">
            <Layers className="w-3 h-3 text-blue-600" />
            <span>เลือกแผนใหม่ด้านล่างเพื่อเปรียบเทียบ / Top-up</span>
          </div>
        </div>
      )}

      {/* Age filter banner if NO existing customer but age filter is active */}
      {!existingCustomer && currentAge !== null && (
        <div className="mb-3.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span className="font-semibold text-slate-700">
              กรองตามอายุ: {currentAge} ปี
            </span>
          </div>

          {onResetCustomer && (
            <button
              type="button"
              onClick={onResetCustomer}
              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              เปลี่ยนข้อมูล
            </button>
          )}
        </div>
      )}

      {/* Clean & Minimal Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {existingCustomer ? 'เลือกแผนที่จะเปรียบเทียบ / Top-up' : 'เลือกแผนเปรียบเทียบ'}
          </h2>
          <span className="text-[11px] text-slate-400">
            (สูงสุด {MAX_SELECTION} แผน)
          </span>
        </div>

        {/* Minimal Category Tabs & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
          {/* Category Tabs */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveCategoryTab('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeCategoryTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ทั้งหมด ({allPlans.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryTab('health')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeCategoryTab === 'health'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              สุขภาพ ({healthPlansCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategoryTab('pa')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeCategoryTab === 'pa'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              PA30 ({paPlansCount})
            </button>
          </div>

          {/* Selection Counter Pill */}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
              selectedPlanIds.length > 0
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            เลือก {selectedPlanIds.length}/{MAX_SELECTION}
          </span>

          {selectedPlanIds.length > 0 && (
            <button
              onClick={() => onSetSelection([])}
              className="text-[11px] text-slate-400 hover:text-rose-600 cursor-pointer underline ml-0.5"
            >
              ล้าง
            </button>
          )}
        </div>
      </div>

      {/* Target Audience Segment Bar: ข้าราชการ (สีทอง) / หน่วยงานเอกชน (สีเขียว) / บุคคลทั่วไป (สีน้ำเงิน) */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 text-xs border-b border-slate-100/90 scrollbar-none flex-wrap">
        <span className="font-semibold text-slate-700 shrink-0 text-[11px] flex items-center gap-1">
          <span>ประเภทหน่วยงานผู้ชำระเบี้ย:</span>
        </span>
        <button
          type="button"
          onClick={() => {
            setSelectedAudienceFilter('all');
            setShowAllRegardlessOfSearch(true);
          }}
          className={`px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
            selectedAudienceFilter === 'all'
              ? 'bg-slate-800 text-white font-bold shadow-2xs'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          แสดงทั้งหมด
        </button>

        {/* กลุ่มข้าราชการ - สีทอง */}
        <button
          type="button"
          onClick={() => {
            setSelectedAudienceFilter('government');
            setShowAllRegardlessOfSearch(false);
          }}
          className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-1.5 border ${
            selectedAudienceFilter === 'government'
              ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white font-bold shadow-xs border-amber-500 ring-1 ring-amber-400'
              : 'bg-amber-50/90 text-amber-900 hover:bg-amber-100 border-amber-300'
          }`}
        >
          <Landmark className={`w-3.5 h-3.5 shrink-0 ${selectedAudienceFilter === 'government' ? 'text-white' : 'text-amber-700'}`} />
          <span>ข้าราชการและรัฐวิสาหกิจ</span>
        </button>

        {/* หน่วยงานเอกชน - สีเขียว */}
        <button
          type="button"
          onClick={() => {
            setSelectedAudienceFilter('office');
            setShowAllRegardlessOfSearch(false);
          }}
          className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-1.5 border ${
            selectedAudienceFilter === 'office'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-xs border-emerald-600 ring-1 ring-emerald-500'
              : 'bg-emerald-50/90 text-emerald-800 hover:bg-emerald-100 border-emerald-300'
          }`}
        >
          <Building className={`w-3.5 h-3.5 shrink-0 ${selectedAudienceFilter === 'office' ? 'text-white' : 'text-emerald-700'}`} />
          <span>หน่วยงานเอกชน</span>
        </button>

        {/* บุคคลทั่วไป - สีน้ำเงิน */}
        <button
          type="button"
          onClick={() => {
            setSelectedAudienceFilter('general');
            setShowAllRegardlessOfSearch(false);
          }}
          className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer flex items-center gap-1.5 border ${
            selectedAudienceFilter === 'general'
              ? 'bg-gradient-to-r from-blue-600 to-sky-700 text-white font-bold shadow-xs border-blue-600 ring-1 ring-blue-500'
              : 'bg-blue-50/90 text-blue-800 hover:bg-blue-100 border-blue-300'
          }`}
        >
          <Users className={`w-3.5 h-3.5 shrink-0 ${selectedAudienceFilter === 'general' ? 'text-white' : 'text-blue-700'}`} />
          <span>บุคคลทั่วไป</span>
        </button>
      </div>

      {filteredPlans.length === 0 ? (
        <div className="mt-4 p-8 text-center bg-slate-50/90 rounded-2xl border border-slate-200">
          <Search className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">ไม่พบแผนประกันที่ตรงตามเงื่อนไขที่ค้นหา</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            ไม่พบแผนประกันสำหรับเงื่อนไขอายุ {currentAge ?? '-'} ปี หรือกลุ่มที่ระบุ กรุณาตรวจสอบช่วงอายุหรือคลิกดูแผนทั้งหมด
          </p>
          <button
            type="button"
            onClick={() => {
              setShowAllRegardlessOfSearch(true);
              setSelectedAudienceFilter('all');
              setActiveCategoryTab('all');
            }}
            className="mt-3 px-4 py-1.5 rounded-lg bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>แสดงแผนทั้งหมด ({allPlans.length} แผน)</span>
          </button>
        </div>
      ) : (
        /* Plan Selection Grid - Minimal, Crisp & Balanced */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-3">
          {filteredPlans.map((plan) => {
          const isSelected = selectedPlanIds.includes(plan.id);
          const isExistingCustomerPlan = existingCustomer?.existingPlanId === plan.id;
          const isPa = plan.category === 'pa';
          const primaryAudience = getPlanPrimaryAudience(plan.id);

          // Check age eligibility if age filter is specified from search
          const isAgeIneligible =
            currentAge !== null && (currentAge < plan.minAge || currentAge > plan.maxAge);

          // ข้อ 3: เมื่อกดเลือก 1 แผน ให้เช็คหน่วยงานและอายุให้เลือกได้เฉพาะแบบเดียวกัน อันอื่นให้ Disable ไว้
          let isAudienceMismatch = false;
          let isAgeMismatch = false;

          if (referencePlan && !isSelected) {
            if (referenceAudienceInfo) {
              isAudienceMismatch =
                primaryAudience.audienceGroup !== referenceAudienceInfo.audienceGroup;
            }
            isAgeMismatch =
              plan.minAge !== referencePlan.minAge || plan.maxAge !== referencePlan.maxAge;
          }

          const isCriteriaMismatch = isAudienceMismatch || isAgeMismatch;
          const isDisabled =
            (!isSelected && isMaxSelected) || isAgeIneligible || isCriteriaMismatch;

          return (
            <div
              key={plan.id}
              onClick={() => {
                if (isSelected) {
                  onTogglePlan(plan.id);
                } else if (!isDisabled) {
                  onTogglePlan(plan.id);
                }
              }}
              className={`relative rounded-xl p-3 transition-all duration-150 text-left flex flex-col justify-between border select-none ${
                isAgeIneligible
                  ? 'border-slate-200 bg-slate-50/60 opacity-40 cursor-not-allowed'
                  : isCriteriaMismatch
                  ? 'border-dashed border-slate-300 bg-slate-50/60 opacity-55 cursor-not-allowed'
                  : isSelected
                  ? 'border-blue-600 bg-blue-50/20 shadow-xs ring-1 ring-blue-600 cursor-pointer'
                  : isDisabled
                  ? 'border-slate-200 bg-slate-50/40 opacity-50 cursor-not-allowed'
                  : 'border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-xs cursor-pointer active:scale-[0.99]'
              }`}
            >
              {/* Header: Name + Status Badge + Checkbox */}
              <div>
                <div className="flex items-start justify-between gap-1.5 mb-1.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">
                        {plan.name}
                      </span>
                    </div>
                    {/* ตัด Text สุขภาพ และ อุบัติเหตุ PA ออก (แสดงเฉพาะกรณีเป็นแผนเดิมที่ถือครอง) */}
                    {isExistingCustomerPlan && (
                      <span className="text-[10px] text-amber-600 font-medium block mt-0.5">
                        ⭐ แผนเดิมที่ถือครอง
                      </span>
                    )}
                  </div>

                  <span
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 text-[10px] transition-colors mt-0.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : isCriteriaMismatch || isAgeIneligible
                        ? 'border border-slate-200 bg-slate-100 text-slate-400'
                        : 'border border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    {isCriteriaMismatch || isAgeIneligible ? (
                      <Lock className="w-2.5 h-2.5" />
                    ) : (
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    )}
                  </span>
                </div>

                {/* กลุ่มเป้าหมาย: แสดงแผนละ 1 ประเภท (ข้าราชการ: สีทอง, หน่วยงานเอกชน: สีเขียว, บุคคลทั่วไป: สีน้ำเงิน) */}
                <div className="my-1.5 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-semibold border ${primaryAudience.badgeColor}`}
                  >
                    {primaryAudience.audienceGroup === 'government' ? (
                      <Landmark className="w-3 h-3 text-amber-700 shrink-0" />
                    ) : primaryAudience.audienceGroup === 'office' ? (
                      <Building className="w-3 h-3 text-emerald-700 shrink-0" />
                    ) : (
                      <Users className="w-3 h-3 text-blue-700 shrink-0" />
                    )}
                    <span>{primaryAudience.label}</span>
                  </span>
                </div>

                {/* Age Range */}
                <div className="text-[11px] text-slate-400 mt-1">
                  <span>อายุ </span>
                  <span
                    className={
                      isAgeIneligible
                        ? 'text-rose-600 font-bold'
                        : 'text-slate-600 font-medium'
                    }
                  >
                    {plan.ageRangeText}
                  </span>
                  {isAgeIneligible && (
                    <span className="text-[10px] text-rose-600 ml-1">(ไม่ตรงเกณฑ์)</span>
                  )}
                </div>
              </div>

              {/* Price & Action Buttons Footer (หน้าการ์ด) */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-2">
                {/* เบี้ยแสดงแยกเป็นรายเดือน รายปี (รูปแบบเหมือนกันในโทน rgb(20, 152, 232)) */}
                <div className="grid grid-cols-2 gap-2 py-0.5">
                  {/* กล่องซ้าย: ชำระรายเดือน */}
                  <div className="bg-[#1498e8]/[0.08] hover:bg-[#1498e8]/[0.13] border border-[#1498e8]/30 hover:border-[#1498e8]/60 rounded-xl p-2 flex flex-col justify-between transition-colors shadow-2xs">
                    <span className="text-[10px] text-[#0d7bc2] font-semibold leading-none">
                      ชำระรายเดือน
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#09598e] mt-1 tracking-tight">
                      {formatCurrency(plan.monthlyPremium)}{' '}
                      <span className="text-[9.5px] font-medium text-[#1498e8]">
                        บาท/เดือน
                      </span>
                    </span>
                  </div>

                  {/* กล่องขวา: ชำระรายปี */}
                  <div className="bg-[#1498e8]/[0.08] hover:bg-[#1498e8]/[0.13] border border-[#1498e8]/30 hover:border-[#1498e8]/60 rounded-xl p-2 flex flex-col justify-between transition-colors shadow-2xs">
                    <span className="text-[10px] text-[#0d7bc2] font-semibold leading-none">
                      ชำระรายปี
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#09598e] mt-1 tracking-tight">
                      {formatCurrency(plan.annualPremium)}{' '}
                      <span className="text-[9.5px] font-medium text-[#1498e8]">
                        บาท/ปี
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons on Card Face: ปุ่มดูรายละเอียด (ขนาดเล็กลง py-1.5) + ปุ่มซื้อแผนประกันนี้ (ขนาดใหญ่ py-2 เต็มแถว) */}
                <div className="space-y-1.5 pt-0.5">
                  {/* ปุ่ม "ดูรายละเอียด" - ขนาดเล็กลง (py-1.5) */}
                  <button
                    type="button"
                    disabled={isAgeIneligible}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onViewPlanDetail) {
                        onViewPlanDetail(plan);
                      } else {
                        onSetSelection([plan.id]);
                        onGoToComparison?.();
                      }
                    }}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98] ${
                      isAgeIneligible
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                        : 'bg-white hover:bg-[#0f9fe5]/10 text-[#0f9fe5] border border-[#0f9fe5] shadow-2xs'
                    }`}
                    title={`ดูรายละเอียดตารางความคุ้มครอง ${plan.name} (1 แผน)`}
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0f9fe5] shrink-0" />
                    <span>ดูรายละเอียด</span>
                  </button>

                  {/* ปุ่ม "ซื้อแผนประกันนี้" - ขนาดใหญ่เต็มแถว (py-2 w-full) (ตัดปุ่มแชร์ออก) */}
                  <a
                    href="https://prmorder.uatsiamsmile.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] ${
                      isAgeIneligible
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 pointer-events-none'
                        : 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-700 hover:via-sky-700 hover:to-cyan-700 text-white shadow-blue-500/20 hover:shadow-md'
                    }`}
                    title={`ซื้อแผนประกันนี้ ${plan.name} - สั่งซื้อออนไลน์ที่ https://prmorder.uatsiamsmile.com/`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                    <span>ซื้อแผนประกันนี้</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Comparison Action Bar: เลือกก่อน ไม่เกิน 3 แล้วค่อยกดเปรียบเทียบ */}
      <div className="mt-4 pt-3.5 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-slate-50 p-3 sm:p-4 rounded-xl border border-blue-100/90 shadow-2xs">
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              แผนที่เลือกเปรียบเทียบ:
            </span>
          </div>

          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              selectedPlanIds.length > 0
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {selectedPlanIds.length} / {MAX_SELECTION} แผน
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedPlanIds.map((id) => {
              const p = allPlans.find((x) => x.id === id);
              return p ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-blue-200 text-blue-900 text-xs font-bold rounded-lg shadow-2xs"
                >
                  <span>{p.code}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePlan(id);
                    }}
                    className="hover:text-rose-600 text-slate-400 cursor-pointer ml-0.5 font-bold"
                    title="ลบแผนนี้"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}

            {selectedPlanIds.length === 0 && (
              <span className="text-xs text-slate-400 italic">
                (กรุณาเลือก 1 - 3 แผนด้านบน แล้วกดปุ่มเปรียบเทียบ)
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={selectedPlanIds.length === 0}
          onClick={onGoToComparison}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            selectedPlanIds.length > 0
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25 active:scale-[0.98]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
          title={selectedPlanIds.length > 0 ? 'เปิดหน้าเปรียบเทียบรายละเอียดแผน' : 'กรุณาเลือกแผนอย่างน้อย 1 แผน'}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          <span>กดเปรียบเทียบแผน ({selectedPlanIds.length} แผน)</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* Interest Feedback Toast */}
      {interestedToastPlanName && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>บันทึกความสนใจ <strong>{interestedToastPlanName}</strong> เรียบร้อยแล้ว (เลือกอยู่ในตาราง)</span>
        </div>
      )}

      {/* Payment Modal for Purchasing Plan directly from Card Face */}
      {selectedPlanForAction && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedPlanForAction(null);
          }}
          proposal={getPlanProposalData(selectedPlanForAction)}
          customerName={existingCustomer?.fullName || 'คุณลูกค้าสยามสไมล์'}
          customerPhone={existingCustomer?.phone || '081-445-6789'}
          onPaymentSuccess={handlePaymentSuccess}
          onShowToast={onShowToast}
        />
      )}

      {/* Forward Customer Modal for sharing proposal directly from Card Face */}
      {selectedPlanForAction && (
        <ForwardCustomerModal
          isOpen={isForwardModalOpen}
          onClose={() => {
            setIsForwardModalOpen(false);
            setSelectedPlanForAction(null);
          }}
          proposal={getPlanProposalData(selectedPlanForAction)}
          existingCustomer={existingCustomer}
          onAssignToCustomer={onAssignPlanToCustomer}
          onProceedToPayment={(custName, custPhone) => {
            setIsForwardModalOpen(false);
            setIsPaymentModalOpen(true);
          }}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
