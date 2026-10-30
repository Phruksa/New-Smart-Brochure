import React, { useState } from 'react';
import {
  Car,
  ShieldCheck,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  FileText,
  PhoneCall,
  Clock,
  CheckCircle2,
  Calendar,
  X,
  ExternalLink,
  ChevronDown,
  Info,
  ShoppingCart,
  Wrench,
  AlertCircle,
  RotateCcw,
  Building,
  SlidersHorizontal,
} from 'lucide-react';
import {
  SmileMotorPlan,
} from '../data/motorData';
import { MotorSearchParams } from './SmileMotorSearchCard';
import { SmileMotorComparisonTable } from './SmileMotorComparisonTable';

interface SmileMotorPlansSectionProps {
  plans: SmileMotorPlan[];
  searchParams: MotorSearchParams | null;
  viewMode?: 'selection' | 'comparison';
  onViewModeChange?: (mode: 'selection' | 'comparison') => void;
  onOpenPreview?: (selectedPlans: SmileMotorPlan[]) => void;
  onShowToast?: (msg: string) => void;
}

export const SmileMotorPlansSection: React.FC<SmileMotorPlansSectionProps> = ({
  plans: initialPlans,
  searchParams,
  viewMode: propViewMode,
  onViewModeChange,
  onOpenPreview,
  onShowToast,
}) => {
  // Active brochure image preview modal ('class1' | '2plus' | null)
  const [brochureImageModal, setBrochureImageModal] = useState<'class1' | '2plus' | null>(null);

  // Plan detail modal for individual plan
  const [detailModalPlan, setDetailModalPlan] = useState<SmileMotorPlan | null>(null);

  // View state: 'selection' (การ์ดเลือกแผน 4 คอลัมน์) | 'comparison' (ตารางเปรียบเทียบแบบประกันสุขภาพ ไม่เอา Pop Up)
  const [internalViewMode, setInternalViewMode] = useState<'selection' | 'comparison'>('selection');
  const viewMode = propViewMode !== undefined ? propViewMode : internalViewMode;

  const handleSetViewMode = (mode: 'selection' | 'comparison') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  // Filter tab for motor plans ('all' | 'class1' | '2plus')
  const [classFilterTab, setClassFilterTab] = useState<'all' | 'class1' | '2plus'>('all');

  const plans = initialPlans;

  // Selected plan IDs for comparison (max 3 plans)
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([
    'motor-class1-garage',
    'motor-smile-2plus-200000',
  ]);

  const MAX_SELECTION = 3;

  const handleTogglePlan = (planId: string) => {
    setSelectedPlanIds((prev) => {
      if (prev.includes(planId)) {
        return prev.filter((id) => id !== planId);
      }
      if (prev.length >= MAX_SELECTION) {
        onShowToast?.(`สามารถเลือกเปรียบเทียบได้สูงสุด ${MAX_SELECTION} แผน`);
        return prev;
      }
      return [...prev, planId];
    });
  };

  const selectedPlans = plans.filter((p) => selectedPlanIds.includes(p.id));

  // Filter plans based on class filter tab
  const filteredPlans = plans.filter((p) => {
    if (classFilterTab === 'class1') return p.insuranceClass === '1';
    if (classFilterTab === '2plus') return p.insuranceClass === '2+';
    return true;
  });

  const class1Count = plans.filter((p) => p.insuranceClass === '1').length;
  const class2PlusCount = plans.filter((p) => p.insuranceClass === '2+').length;

  // เมื่อผู้ใช้กดเปรียบเทียบแผน: แสดงตารางเปรียบเทียบเต็มหน้า แบบประกันสุขภาพ ไม่เอา Pop Up
  if (viewMode === 'comparison') {
    return (
      <>
        <SmileMotorComparisonTable
          selectedPlans={selectedPlans}
          allPlans={plans}
          searchParams={searchParams}
          onBackToSelection={() => {
            handleSetViewMode('selection');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRemovePlan={(planId) => {
            setSelectedPlanIds((prev) => prev.filter((id) => id !== planId));
          }}
          onAddPlan={(planId) => {
            handleTogglePlan(planId);
          }}
          onOpenBrochure={(type) => setBrochureImageModal(type)}
          onOpenPreview={() => onOpenPreview?.(selectedPlans)}
          onSaveBrochure={() => {
            onShowToast?.(`บันทึกชุดแผน Smile Motor (${selectedPlans.length} แผน) ลงระบบเรียบร้อยแล้ว ☁️`);
          }}
          onShowToast={onShowToast}
        />

        {/* Official Brochure Image Viewer Modal */}
        {brochureImageModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[96vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>
                      {brochureImageModal === 'class1'
                        ? 'โบรชัวร์ทางการ: ประกันภัยรถยนต์ชั้น 1 (SMILE MOTOR 1088 & 1488 PRO)'
                        : 'โบรชัวร์ทางการ: SMILE MOTOR 2+ ประกันภัยรถยนต์ภาคสมัครใจ'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    บริษัท สยามสไมล์ โบรกเกอร์ (ประเทศไทย) จำกัด • บริษัท ชับบ์สามัคคีประกันภัย จำกัด (มหาชน)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBrochureImageModal(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-slate-100 flex items-center justify-center">
                <img
                  src={
                    brochureImageModal === 'class1'
                      ? '/assets/aistudio/___________________1_update_04_06_69_3471d9f5.png'
                      : '/assets/aistudio/_________________Smile_Motor_-____________2__0_e9491c8c.jpg'
                  }
                  alt="โบรชัวร์ประกันภัยรถยนต์ทางการ สยามสไมล์"
                  className="max-h-[82vh] w-auto object-contain rounded-lg shadow-md border border-slate-200"
                />
              </div>

              <div className="px-4 py-2.5 bg-slate-900 text-slate-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Center 1434 (บริการ 24 ชั่วโมง)</span>
                  </span>
                  <span>Line ID: @siamsmile</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={
                      brochureImageModal === 'class1'
                        ? '/assets/aistudio/___________________1_update_04_06_69_3471d9f5.png'
                        : '/assets/aistudio/_________________Smile_Motor_-____________2__0_e9491c8c.jpg'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>เปิดภาพเต็ม</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setBrochureImageModal(null)}
                    className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-3.5 sm:p-5 mb-4">
      {/* Header Bar - Exactly styled like Health Insurance PlanSelector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            เลือกแผนเปรียบเทียบ
          </h2>
          <span className="text-[11px] text-slate-400">
            (สูงสุด {MAX_SELECTION} แผน)
          </span>
          {searchParams && (
            <span className="text-[11px] font-semibold text-[#00509d] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              {searchParams.brand} {searchParams.model} ({searchParams.year})
            </span>
          )}
        </div>

        {/* Minimal Category Tabs & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
          {/* Category Tabs */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setClassFilterTab('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                classFilterTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ทั้งหมด ({plans.length})
            </button>
            <button
              type="button"
              onClick={() => setClassFilterTab('class1')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                classFilterTab === 'class1'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ชั้น 1 ({class1Count})
            </button>
            <button
              type="button"
              onClick={() => setClassFilterTab('2plus')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                classFilterTab === '2plus'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ชั้น 2+ ({class2PlusCount})
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
              onClick={() => setSelectedPlanIds([])}
              className="text-[11px] text-slate-400 hover:text-rose-600 cursor-pointer underline ml-0.5"
            >
              ล้าง
            </button>
          )}
        </div>
      </div>

      {/* Plan Selection Grid - ปรับเป็น 4 การ์ด ตามรูปแบบประกันสุขภาพ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-3.5">
        {filteredPlans.map((plan) => {
          const isSelected = selectedPlanIds.includes(plan.id);

          return (
            <div
              key={plan.id}
              onClick={() => handleTogglePlan(plan.id)}
              className={`relative rounded-2xl p-4 transition-all duration-150 text-left flex flex-col justify-between border select-none ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/20 shadow-xs ring-1 ring-blue-600 cursor-pointer'
                  : 'border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-xs cursor-pointer active:scale-[0.99]'
              }`}
            >
              {/* Header: Name + Checkbox */}
              <div>
                <div className="flex items-start justify-between gap-1.5 mb-1.5">
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-900 text-sm block truncate" title={plan.name}>
                      {plan.name}
                    </span>
                  </div>

                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs transition-colors mt-0.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </div>
              </div>

              {/* Price & Action Buttons Footer (Identical to PlanSelector) */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-2.5">
                {/* เบี้ยแสดงแยกเป็นรายเดือน รายปี (รูปแบบเหมือนกันในโทน rgb(20, 152, 232)) */}
                <div className="grid grid-cols-2 gap-2 py-0.5">
                  {/* กล่องซ้าย: ชำระรายเดือน */}
                  <div className="bg-[#1498e8]/[0.08] hover:bg-[#1498e8]/[0.13] border border-[#1498e8]/30 hover:border-[#1498e8]/60 rounded-xl p-2.5 flex flex-col justify-between transition-colors shadow-2xs">
                    <span className="text-[10px] text-[#0d7bc2] font-semibold leading-none">
                      ชำระรายเดือน
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#09598e] mt-1 tracking-tight">
                      {plan.monthlyPremium.toLocaleString()}{' '}
                      <span className="text-[9.5px] font-medium text-[#1498e8]">
                        บาท/เดือน
                      </span>
                    </span>
                  </div>

                  {/* กล่องขวา: ชำระรายปี */}
                  <div className="bg-[#1498e8]/[0.08] hover:bg-[#1498e8]/[0.13] border border-[#1498e8]/30 hover:border-[#1498e8]/60 rounded-xl p-2.5 flex flex-col justify-between transition-colors shadow-2xs">
                    <span className="text-[10px] text-[#0d7bc2] font-semibold leading-none">
                      ชำระรายปี
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#09598e] mt-1 tracking-tight">
                      {plan.annualPremium.toLocaleString()}{' '}
                      <span className="text-[9.5px] font-medium text-[#1498e8]">
                        บาท/ปี
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons: ดูรายละเอียด + ซื้อแผนประกันนี้ */}
                <div className="space-y-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailModalPlan(plan);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-[0.98] bg-white hover:bg-[#0f9fe5]/10 text-[#0f9fe5] border border-[#0f9fe5]"
                    title={`ดูรายละเอียดตารางความคุ้มครอง ${plan.name}`}
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0f9fe5] shrink-0" />
                    <span>ดูรายละเอียด</span>
                  </button>

                  <a
                    href="https://prmorder.uatsiamsmile.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] bg-[#0088cc] hover:bg-[#0077b6] text-white"
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

      {/* Comparison Action Bar: ปรับให้เหมือนกับประกันสุขภาพ (ตรงตาม Screenshot) */}
      <div className="mt-4 p-3 sm:p-4 rounded-xl border border-slate-100 bg-[#f8fafc] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              แผนที่เลือกเปรียบเทียบ:
            </span>
          </div>

          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              selectedPlanIds.length > 0
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {selectedPlanIds.length} / {MAX_SELECTION} แผน
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedPlanIds.map((id) => {
              const p = plans.find((x) => x.id === id);
              return p ? (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-blue-200 text-blue-900 text-xs font-bold rounded-lg shadow-2xs"
                >
                  <span>{p.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlan(id);
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
          onClick={() => {
            if (selectedPlanIds.length === 0) {
              onShowToast?.('กรุณาเลือกอย่างน้อย 1 แผนเพื่อเปรียบเทียบ');
              return;
            }
            handleSetViewMode('comparison');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
    </div>

      {/* Plan Detail Modal */}
      {detailModalPlan && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-gradient-to-r from-[#003e7a] to-[#00509d] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{detailModalPlan.name}</h3>
                <p className="text-xs text-sky-200 mt-0.5">{detailModalPlan.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalPlan(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              {/* Premium Summary Box */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-2.5 text-center">
                  <div className="text-[10.5px] text-[#00509d] font-bold">เบี้ยรายเดือน</div>
                  <div className="text-base font-extrabold text-[#00509d] mt-0.5">
                    ฿{detailModalPlan.monthlyPremium.toLocaleString()}/ด.
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
                  <div className="text-[10.5px] text-slate-600 font-bold">เบี้ยรายปี</div>
                  <div className="text-base font-extrabold text-slate-800 mt-0.5">
                    ฿{detailModalPlan.annualPremium.toLocaleString()}/ปี
                  </div>
                </div>
              </div>

              {/* Coverage list */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <h4 className="font-bold text-slate-800">รายละเอียดความคุ้มครอง:</h4>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>ทุนประกันภัย:</strong> {detailModalPlan.sumInsuredText}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>ค่าเสียหายส่วนแรก:</strong> 0 บาท (ไม่มี Deductible)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>ความรับผิดต่อบุคคลภายนอก:</strong> ชีวิต 1,000,000 บ./คน, ทรัพย์สิน 1,000,000 บ./ครั้ง</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>อุบัติเหตุและค่ารักษาพยาบาล:</strong> 100,000 บ. x 5 ที่นั่ง</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>ประกันตัวผู้ขับขี่:</strong> {detailModalPlan.insuranceClass === '1' ? (detailModalPlan.name.includes('1488') ? '300,000 บาท' : '200,000 บาท') : '1,000,000 บาท'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>ยิ้มแจ้ง ยามฉุกเฉิน 1434:</strong> พ่วงแบตฯ, เปลี่ยนยาง, เติมน้ำมัน, รถยก/รถสไลด์ ตลอด 24 ชม.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDetailModalPlan(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                ปิด
              </button>
              <a
                href="https://prmorder.uatsiamsmile.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-lg bg-[#00509d] text-white text-xs font-bold hover:bg-[#003e7a] flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>ซื้อแผนประกันนี้</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Official Brochure Image Viewer Modal */}
      {brochureImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[96vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>
                    {brochureImageModal === 'class1'
                      ? 'โบรชัวร์ทางการ: ประกันภัยรถยนต์ชั้น 1 (SMILE MOTOR 1088 & 1488 PRO)'
                      : 'โบรชัวร์ทางการ: SMILE MOTOR 2+ ประกันภัยรถยนต์ภาคสมัครใจ'}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  บริษัท สยามสไมล์ โบรกเกอร์ (ประเทศไทย) จำกัด • บริษัท ชับบ์สามัคคีประกันภัย จำกัด (มหาชน)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBrochureImageModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-slate-100 flex items-center justify-center">
              <img
                src={
                  brochureImageModal === 'class1'
                    ? '/assets/aistudio/___________________1_update_04_06_69_3471d9f5.png'
                    : '/assets/aistudio/_________________Smile_Motor_-____________2__0_e9491c8c.jpg'
                }
                alt="โบรชัวร์ประกันภัยรถยนต์ทางการ สยามสไมล์"
                className="max-h-[82vh] w-auto object-contain rounded-lg shadow-md border border-slate-200"
              />
            </div>

            <div className="px-4 py-2.5 bg-slate-900 text-slate-300 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Center 1434 (บริการ 24 ชั่วโมง)</span>
                </span>
                <span>Line ID: @siamsmile</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={
                    brochureImageModal === 'class1'
                      ? '/assets/aistudio/___________________1_update_04_06_69_3471d9f5.png'
                      : '/assets/aistudio/_________________Smile_Motor_-____________2__0_e9491c8c.jpg'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>เปิดภาพเต็ม</span>
                </a>
                <button
                  type="button"
                  onClick={() => setBrochureImageModal(null)}
                  className="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
