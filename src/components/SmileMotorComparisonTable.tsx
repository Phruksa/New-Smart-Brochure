import React, { useState, useMemo, useEffect } from 'react';
import {
  Car,
  Check,
  ArrowLeft,
  X,
  ShoppingCart,
  PhoneCall,
  SlidersHorizontal,
  Sparkles,
  Plus,
  FileText,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  Search,
  Eye,
  BookmarkPlus,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { SmileMotorPlan } from '../data/motorData';
import { MotorSearchParams } from './SmileMotorSearchCard';

export const MOTOR_CLASS_1_CONDITIONS: string[] = [
  'สำหรับรหัสรถ 110 รถยนต์นั่งใช้ส่วนบุคคล ไม่ใช้รับจ้างหรือให้เช่า และสำหรับรหัสรถ 320 รถบรรทุกใช้เพื่อการพาณิชย์ ไม่เกิน 4 ตัน ไม่ใช้เพื่อการบรรทุกและขนส่งสินค้าที่มีความเสี่ยงสูง เช่น เชื้อเพลิง กรด แก๊ส',
  'รับประกันซ่อมอู่สำหรับรถที่มีอายุ 2-15* ปี, ซ่อมศูนย์ สำหรับรถที่มีอายุ 2-7* ปี (*กรุณาตรวจสอบแผนประกันภัยตามรุ่นรถยนต์)',
  'อัตราเบี้ยประกันข้างต้นไม่รวม พ.ร.บ.',
  'สงวนสิทธิ์รับประกันตามยี่ห้อ/รุ่นรถ ที่กำหนด ไม่รวมถึงรุ่นรถไฟฟ้า (EV)',
  'ทุนประกันไม่เกิน 80% ของมูลค่ารถยนต์ ณ วันที่กรมธรรม์มีผลคุ้มครอง',
  'คุ้มครองอุปกรณ์ตกแต่งที่ติดตั้งตามมาตรฐานโรงงาน หรือศูนย์จำหน่ายรถยนต์เต็มวงเงิน (วงเงินคุ้มครองรวมอยู่ในทุนประกันภัยแล้ว)',
  'ให้ความคุ้มครองอุปกรณ์ตกแต่งเพิ่มเติม นอกเหนือจากที่มีการติดตั้งมาจากโรงงานประกอบรถยนต์หรือศูนย์จำหน่ายในวงเงินไม่เกิน 10,000 บาท (วงเงินคุ้มครองรวมอยู่ในทุนประกันภัยแล้ว) แต่ไม่รวมถึง สติกเกอร์ วัสดุเคฟล่า ฝากระโปรงคาร์บอน การเคลือบแก้วหรือเคลือบสี โครงเหล็ก ตู้บรรทุก เครื่องทำความเย็น เครื่องกำเนิดไฟฟ้า แหนบ-เพลาดัดแปลง อุปกรณ์ยกต่างๆ เช่น เครน ดัมพ์ เฮี้ยบ',
  'หากมีการติดตั้งอุปกรณ์ตกแต่งเพิ่มเติมหลังจากถ่ายภาพเพื่อรับประกัน อุปกรณ์ดังกล่าวจะไม่ได้รับความคุ้มครอง เว้นแต่จะแจ้งให้บริษัททราบทันที เพื่อให้ได้รับความคุ้มครองตามเงื่อนไขของกรมธรรม์',
  'ไม่รับประกันภัยรถยนต์ที่มีการติดตั้งตู้บรรทุก คอกเหล็ก ดั้มพ์ เครน เฮี้ยบ รถยนต์ที่มีการดัดแปลงกระบะท้าย ดัดแปลงสภาพเป็นรถยนต์โดยสาร รถที่ใช้เพื่อการแข่งขัน รถโหลดเตี้ย รถยกสูง รถที่ใช้เพื่อการฉุกเฉิน เช่น รถพยาบาล รถกู้ภัย รถยนต์ที่เลขทะเบียนทุกตัวเป็นตัวเลข รถยนต์ที่ใช้เป็นตัวอย่าง (รถ Demo) รถยนต์ที่ใช้ทดลองขับ (รถ Test Drive)',
  'ภาพถ่ายรถยนต์ที่ขอเอาประกันภัย ต้องมีวันที่กำกับ ซึ่งต้องเป็นวันที่ก่อนหรือหลังวันคุ้มครองไม่เกิน 7 วัน หากพบว่ารถยนต์มีความเสียหายก่อนการรับประกันภัย บริษัทอาจพิจารณาปฏิเสธการรับประกันภัย หรือบริษัทฯ จะไม่ให้ความคุ้มครองสำหรับบาดแผลหรือความเสียหายที่เกิดมาก่อน',
];

export const MOTOR_CLASS_2PLUS_CONDITIONS: string[] = [
  'สำหรับรหัสรถ 110 รถยนต์นั่งใช้ส่วนบุคคล ไม่ใช้รับจ้างหรือให้เช่า และสำหรับรหัสรถ 320 รถบรรทุกใช้เพื่อการพาณิชย์ ไม่เกิน 4 ตัน ไม่ใช้เพื่อการบรรทุกและขนส่งสินค้าที่มีความเสี่ยงสูง เช่น เชื้อเพลิง กรด แก๊ส',
  'รับประกันภัยเฉพาะรถยนต์ยี่ห้อ CHEVROLET, FORD, HONDA, ISUZU, MAZDA, MG, MITSUBISHI, NISSAN, SUZUKI และ TOYOTA (กลุ่ม 3,4,5) เท่านั้น',
  'รับประกันสำหรับรถที่มีอายุ 2-30* ปี (กรุณาตรวจสอบแผนรับประกันตามรุ่นรถ)',
  'อัตราเบี้ยประกันข้างต้นไม่รวม พ.ร.บ.',
  'สงวนสิทธิ์รับประกันตามยี่ห้อ/รุ่นรถ ที่กำหนด ไม่รวมถึงรุ่นรถไฟฟ้า (EV)',
  'มูลค่ารถยนต์ ณ วันที่ทำประกันต้องไม่เกิน 2,000,000 บาท และไม่ต่ำกว่าทุนประกันภัยตามแผนประกันภัยที่เลือกซื้อ',
  'คุ้มครองอุปกรณ์ตกแต่งที่ติดตั้งตามมาตรฐานโรงงาน หรือศูนย์จำหน่ายรถยนต์เต็มวงเงิน (วงเงินคุ้มครองรวมอยู่ในทุนประกันภัยแล้ว)',
  'ให้ความคุ้มครองอุปกรณ์ตกแต่งเพิ่มเติม นอกเหนือจากที่มีการติดตั้งมาจากโรงงานประกอบรถยนต์หรือศูนย์จำหน่ายในวงเงินไม่เกิน 10,000 บาท (วงเงินคุ้มครองรวมอยู่ในทุนประกันภัยแล้ว) แต่ไม่รวมถึง สติกเกอร์ วัสดุเคฟล่า ฝากระโปรงคาร์บอน การเคลือบแก้วหรือเคลือบสี โครงเหล็ก ตู้บรรทุก เครื่องทำความเย็น เครื่องกำเนิดไฟฟ้า แหนบ-เพลาดัดแปลง อุปกรณ์ยกต่างๆ เช่น เครน ดัมพ์ เฮี้ยบ',
  'ไม่รับประกันภัยรถยนต์ที่มีการติดตั้งตู้บรรทุก คอกเหล็ก ดั้มพ์ เครน เฮี้ยบ รถยนต์ที่มีการดัดแปลงกระบะท้าย ดัดแปลงสภาพเป็นรถยนต์โดยสาร รถที่ใช้เพื่อการแข่งขัน รถโหลดเตี้ย รถยกสูง รถที่ใช้เพื่อการฉุกเฉิน เช่น รถพยาบาล รถกู้ภัย รถยนต์ที่เลขทะเบียนทุกตัวเป็นตัวเลข รถยนต์ที่ใช้เป็นตัวอย่าง (รถ Demo) รถยนต์ที่ใช้ทดลองขับ (รถ Test Drive)',
];

interface SmileMotorComparisonTableProps {
  selectedPlans: SmileMotorPlan[];
  allPlans: SmileMotorPlan[];
  searchParams: MotorSearchParams | null;
  onBackToSelection: () => void;
  onRemovePlan?: (planId: string) => void;
  onAddPlan?: (planId: string) => void;
  onOpenBrochure?: (type: 'class1' | '2plus') => void;
  onOpenPreview?: () => void;
  onSaveBrochure?: () => void;
  onShowToast?: (msg: string) => void;
}

export const SmileMotorComparisonTable: React.FC<SmileMotorComparisonTableProps> = ({
  selectedPlans: initialSelectedPlans,
  allPlans,
  searchParams,
  onBackToSelection,
  onRemovePlan,
  onAddPlan,
  onOpenBrochure,
  onOpenPreview,
  onSaveBrochure,
  onShowToast,
}) => {
  const MAX_SELECTION = 3;

  // Staged plans selection (matching Health Insurance ComparisonTable mechanism)
  const [stagedPlanIds, setStagedPlanIds] = useState<string[]>(() =>
    initialSelectedPlans.map((p) => p.id)
  );
  const [displayedPlanIds, setDisplayedPlanIds] = useState<string[]>(() =>
    initialSelectedPlans.map((p) => p.id)
  );

  // Filter mode: 'all' vs 'diff'
  const [filterMode, setFilterMode] = useState<'all' | 'diff'>('all');
  const [highlightDiffs, setHighlightDiffs] = useState<boolean>(true);

  // Terms view mode: 'class1' | 'class2plus' | 'both'
  const [termsTab, setTermsTab] = useState<'class1' | 'class2plus' | 'both'>('class1');

  // Sync staged & displayed plan IDs when initialSelectedPlans changes
  useEffect(() => {
    const ids = initialSelectedPlans.map((p) => p.id);
    setStagedPlanIds(ids);
    setDisplayedPlanIds(ids);
  }, [initialSelectedPlans]);

  // Active plans currently shown in the comparison table
  const displayedPlans = useMemo(() => {
    return displayedPlanIds
      .map((id) => allPlans.find((p) => p.id === id))
      .filter((p): p is SmileMotorPlan => p !== undefined);
  }, [displayedPlanIds, allPlans]);

  // Auto-switch terms tab based on displayed plans
  useEffect(() => {
    const hasClass1 = displayedPlans.some((p) => p.insuranceClass === '1');
    const hasClass2 = displayedPlans.some((p) => p.insuranceClass === '2+');
    if (hasClass1 && !hasClass2) {
      setTermsTab('class1');
    } else if (!hasClass1 && hasClass2) {
      setTermsTab('class2plus');
    } else if (hasClass1 && hasClass2) {
      setTermsTab('both');
    }
  }, [displayedPlanIds]);

  // Staged plans currently selected in the 4 slots
  const stagedPlans = useMemo(() => {
    return stagedPlanIds
      .map((id) => allPlans.find((p) => p.id === id))
      .filter((p): p is SmileMotorPlan => p !== undefined);
  }, [stagedPlanIds, allPlans]);

  // Check if there are newly selected plans waiting for user to click "กดเปรียบเทียบแผน"
  const hasPendingChanges = useMemo(() => {
    if (stagedPlanIds.length !== displayedPlanIds.length) return true;
    return stagedPlanIds.some((id) => !displayedPlanIds.includes(id));
  }, [stagedPlanIds, displayedPlanIds]);

  // Helper handlers for Slot actions
  const handleStageSwapPlan = (oldPlanId: string, newPlanId: string) => {
    if (!newPlanId) return;
    const nextStaged = stagedPlanIds.map((id) => (id === oldPlanId ? newPlanId : id));
    setStagedPlanIds(nextStaged);
    setDisplayedPlanIds(nextStaged);
    const swappedPlan = allPlans.find((p) => p.id === newPlanId);
    onShowToast?.(`เปลี่ยนเป็นแผน ${swappedPlan?.name || ''} เรียบร้อยแล้ว`);
  };

  const handleStageAddPlan = (newPlanId: string) => {
    if (!newPlanId) return;
    if (stagedPlanIds.includes(newPlanId)) return;
    if (stagedPlanIds.length >= MAX_SELECTION) {
      onShowToast?.(`สามารถเปรียบเทียบได้สูงสุด ${MAX_SELECTION} แผน`);
      return;
    }
    const nextStaged = [...stagedPlanIds, newPlanId];
    setStagedPlanIds(nextStaged);
    setDisplayedPlanIds(nextStaged);
    const addedPlan = allPlans.find((p) => p.id === newPlanId);
    onShowToast?.(`เพิ่มแผน ${addedPlan?.name || ''} ในตารางเปรียบเทียบแล้ว`);
  };

  const handleStageRemovePlan = (planId: string) => {
    if (stagedPlanIds.length <= 1) {
      onShowToast?.('ต้องมีแผนอย่างน้อย 1 แผนในตารางเปรียบเทียบ');
      return;
    }
    const nextStaged = stagedPlanIds.filter((id) => id !== planId);
    setStagedPlanIds(nextStaged);
    setDisplayedPlanIds(nextStaged);
    onRemovePlan?.(planId);
    const removedPlan = allPlans.find((p) => p.id === planId);
    onShowToast?.(`นำ ${removedPlan?.name || 'แผน'} ออกจากการเปรียบเทียบแล้ว`);
  };

  const handleApplyComparison = () => {
    setDisplayedPlanIds(stagedPlanIds);
    const planNames = stagedPlanIds
      .map((id) => allPlans.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    onShowToast?.(`จัดตารางเปรียบเทียบ ${stagedPlanIds.length} แผนเรียบร้อยแล้ว: ${planNames}`);
  };

  // Helper to check difference across displayed plans
  const hasDiff = (extractor: (p: SmileMotorPlan) => string | number | boolean): boolean => {
    if (displayedPlans.length <= 1) return false;
    const firstVal = extractor(displayedPlans[0]);
    return displayedPlans.some((p) => extractor(p) !== firstVal);
  };

  const isRowVisible = (isDifferent: boolean): boolean => {
    if (filterMode === 'diff') return isDifferent;
    return true;
  };

  const getRowDiffClass = (isDifferent: boolean): string => {
    if (highlightDiffs && isDifferent && displayedPlans.length > 1) {
      return 'bg-amber-50/70 text-amber-950 font-semibold transition-colors';
    }
    return '';
  };

  // Count differences across motor comparison fields
  const differentCount = useMemo(() => {
    if (displayedPlans.length <= 1) return 0;
    let diffs = 0;
    if (hasDiff((p) => p.monthlyPremium)) diffs++;
    if (hasDiff((p) => p.annualPremium)) diffs++;
    if (hasDiff((p) => p.sumInsured)) diffs++;
    if (hasDiff((p) => p.repairType)) diffs++;
    if (hasDiff((p) => p.insuranceClass)) diffs++;
    if (hasDiff((p) => p.thirdPartyPropertyDamage)) diffs++;
    if (hasDiff((p) => p.bailBond)) diffs++;
    return diffs;
  }, [displayedPlans]);

  // Car age calculation
  const carYear = searchParams?.year || 2024;
  const currentYear = new Date().getFullYear();
  const carAge = Math.max(1, currentYear - carYear);
  const totalColumnsCount = displayedPlans.length + 1;

  return (
    <div className="w-full space-y-4 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Top Floating Notification Toast (แบบเดียวกับ screenshot: แสดงตารางเปรียบเทียบผลประโยชน์ความคุ้มครอง) */}
      <div className="fixed top-16 right-4 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700/80 text-xs flex items-center gap-2 backdrop-blur-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          แสดงตารางเปรียบเทียบผลประโยชน์ความคุ้มครอง {displayedPlans.map((p) => p.name).join(', ')} ({displayedPlans.length} แผน)
        </span>
      </div>

      {/* Top Navigation Bar: ตรงตาม screenshot รูปแบบเดียวกับประกันสุขภาพเป๊ะๆ */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToSelection}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors cursor-pointer border border-slate-200 shrink-0"
              title="ย้อนกลับไปหน้าเลือกแผน"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span
                  onClick={onBackToSelection}
                  className="hover:text-blue-600 hover:underline cursor-pointer"
                >
                  หน้าเลือกแผน
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-blue-700 font-bold">
                  รายละเอียดการเปรียบเทียบ ({displayedPlanIds.length}/{MAX_SELECTION} แผน)
                </span>
              </div>
              <h1 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                ตารางเปรียบเทียบผลประโยชน์ความคุ้มครอง
              </h1>
            </div>
          </div>

          {/* Quick Actions (พรีวิวแผนก่อนส่ง/พิมพ์, บันทึกชุดแผนนี้) */}
          <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                if (onOpenPreview) {
                  onOpenPreview();
                } else {
                  window.print();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/90 hover:bg-blue-100 text-[#00509d] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              title="พรีวิวเอกสารเปรียบเทียบก่อนสั่งพิมพ์หรือส่งออก"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>พรีวิวแผนก่อนส่ง/พิมพ์</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSaveBrochure) {
                  onSaveBrochure();
                } else {
                  onShowToast?.(`บันทึกชุดแผนเปรียบเทียบ Smile Motor (${displayedPlans.length} แผน) เรียบร้อยแล้ว`);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>บันทึกชุดแผนนี้</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Comparison Container (iPad & Desktop optimized) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Integrated Function Toolbar: จัดการแผนที่เปรียบเทียบ (x/3 แผน) */}
        <div className="no-print p-3 sm:p-4 bg-slate-50/90 border-b border-slate-200 space-y-3">
          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Layers className="w-4 h-4 text-blue-600" />
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  จัดการแผนที่เปรียบเทียบ ({stagedPlanIds.length}/{MAX_SELECTION} แผน):
                </span>
                <span className="text-[11px] text-slate-500">
                  (สามารถเลือกเพิ่ม ลด หรือเปลี่ยนแผนได้ทันที)
                </span>
              </div>
            </div>

            {/* ข้อมูลการกรองจากส่วน "เช็คราคาประกันรถยนต์" */}
            <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-200/80 text-xs text-slate-700 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>ข้อมูลค้นหา (เช็คราคาประกันรถยนต์):</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-slate-500">ยี่ห้อ:</span>
                <span className="font-bold text-slate-900">{searchParams?.brand || 'ISUZU'}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="text-slate-500">รุ่น:</span>
                <span className="font-bold text-slate-900">{searchParams?.model || 'D-MAX'}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="text-slate-500">ปีที่ผลิต:</span>
                <span className="font-semibold text-slate-800">{carYear}</span>
                <span className="text-slate-600 ml-0.5 font-medium">(อายุรถ {carAge} ปี)</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="text-slate-500">รหัสรถ:</span>
                <span className="font-bold text-[#00509d] bg-sky-100/70 px-1.5 py-0.5 rounded text-[11px]">
                  {searchParams?.carCode ? (searchParams.carCode.includes('110') ? '110' : '320') : '110'}
                </span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="text-slate-500">ราคารถยนต์:</span>
                <span className="font-bold text-slate-900">
                  ฿{(searchParams?.marketPrice || 580000).toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท
                </span>
              </span>
            </div>

            {/* 4 Interactive Slots Display: 3 ช่องเลือกแผน + Layout ที่ 4 ช่องเปรียบเทียบแผน */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-stretch">
              {[0, 1, 2].map((slotIdx) => {
                const plan = stagedPlans[slotIdx];
                const unselectedPlans = allPlans.filter((p) => !stagedPlanIds.includes(p.id));
                const isNewlyStaged = plan ? !displayedPlanIds.includes(plan.id) : false;

                if (plan) {
                  return (
                    <div
                      key={plan.id}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between gap-1.5 shadow-2xs transition-all h-full min-h-[76px] ${
                        isNewlyStaged
                          ? 'border-amber-400 bg-amber-50/70 ring-1 ring-amber-300'
                          : 'border-blue-200 bg-blue-50/50'
                      }`}
                    >
                      {/* Top Row: Slot Badge + Plan Name + Actions */}
                      <div className="flex items-center justify-between gap-1.5 w-full">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          {isNewlyStaged ? (
                            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-white shrink-0 animate-pulse">
                              ช่องที่ {slotIdx + 1}
                            </span>
                          ) : (
                            <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white shrink-0">
                              ช่องที่ {slotIdx + 1}
                            </span>
                          )}
                          <span className="font-bold text-slate-900 text-xs truncate" title={plan.name}>
                            {plan.name}
                          </span>
                        </div>

                        {/* Actions: Swap & Remove */}
                        <div className="flex items-center gap-1 shrink-0">
                          {unselectedPlans.length > 0 && (
                            <select
                              aria-label={`เปลี่ยนแผนช่องที่ ${slotIdx + 1}`}
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleStageSwapPlan(plan.id, e.target.value);
                                }
                              }}
                              className="text-[10.5px] font-semibold bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-400 text-blue-700 rounded-md px-1.5 py-0.5 cursor-pointer transition-colors shadow-2xs max-w-[85px] truncate"
                              title="เปลี่ยนเป็นแผนอื่น"
                            >
                              <option value="" disabled>เปลี่ยนแผน</option>
                              {unselectedPlans.map((up) => (
                                <option key={up.id} value={up.id}>
                                  {up.name} ({up.sumInsuredText})
                                </option>
                              ))}
                            </select>
                          )}

                          <button
                            type="button"
                            onClick={() => handleStageRemovePlan(plan.id)}
                            className="p-1 rounded-md bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-300 cursor-pointer transition-colors shadow-2xs"
                            title={`ลบ ${plan.name} ออกจากการเปรียบเทียบ`}
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Row: Premium Badges (Monthly & Annual) */}
                      <div className="grid grid-cols-2 gap-1.5 w-full text-[10.5px]">
                        <div className="bg-white/90 border border-blue-100 rounded-md px-1.5 py-0.5 flex items-center justify-between text-slate-600 shadow-2xs">
                          <span className="text-[9.5px] text-slate-500 font-medium">รายเดือน</span>
                          <strong className="text-slate-900 font-bold ml-1">
                            ฿{plan.monthlyPremium.toLocaleString()} บาท
                          </strong>
                        </div>
                        <div className="bg-white/90 border border-blue-100 rounded-md px-1.5 py-0.5 flex items-center justify-between text-slate-600 shadow-2xs">
                          <span className="text-[9.5px] text-slate-500 font-medium">รายปี</span>
                          <strong className="text-[#00509d] font-bold ml-1">
                            ฿{plan.annualPremium.toLocaleString()} บาท
                          </strong>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Empty Slot: แสดงเป็น "ช่องที่ 1", "ช่องที่ 2", "ช่องที่ 3"
                return (
                  <div
                    key={`empty-slot-${slotIdx}`}
                    className="p-2.5 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 hover:bg-sky-50/70 transition-all flex flex-col justify-between gap-1.5 h-full min-h-[76px]"
                  >
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 shrink-0">
                          ช่องที่ {slotIdx + 1}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          (ว่าง)
                        </span>
                      </div>
                    </div>

                    <div className="w-full">
                      {unselectedPlans.length > 0 ? (
                        <select
                          aria-label={`กดเพิ่มแผนในช่องที่ ${slotIdx + 1}`}
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStageAddPlan(e.target.value);
                            }
                          }}
                          className="w-full text-xs font-bold bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-500 hover:border-blue-600 rounded-lg py-1 px-2 cursor-pointer transition-all shadow-2xs text-center truncate"
                        >
                          <option value="" disabled>+ กดเพิ่มแผน</option>
                          {unselectedPlans.map((up) => (
                            <option key={up.id} value={up.id}>
                              + {up.name} (รายเดือน ฿{up.monthlyPremium.toLocaleString()} • รายปี ฿{up.annualPremium.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="w-full text-center text-[10.5px] text-slate-400 py-1 font-medium bg-white/70 rounded-md border border-slate-200">
                          ครบทุกแผนแล้ว
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Layout ที่ 4: ปุ่มเปรียบเทียบแผน */}
              <div className="p-2.5 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50/40 flex flex-col justify-center items-center h-full min-h-[76px]">
                <div className="w-full">
                  <button
                    type="button"
                    onClick={handleApplyComparison}
                    className="w-full text-xs font-bold bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white border-2 border-blue-600 rounded-lg py-1.5 px-2 cursor-pointer transition-all shadow-2xs text-center flex items-center justify-center gap-1.5 active:scale-95"
                    title="กดปุ่มเพื่อจัดตารางเปรียบเทียบแผนตามที่เลือก"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                    <span>กดเปรียบเทียบแผน</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notice bar when changes are pending */}
            {hasPendingChanges && (
              <div className="mt-2.5 p-2.5 sm:p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-amber-950 shadow-2xs animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
                  <span>
                    <strong>เลือกแผนใหม่เพิ่มแล้ว ({stagedPlanIds.length} แผน):</strong> ต้องกดปุ่ม <strong>"กดเปรียบเทียบแผน" (ในช่องที่ 4)</strong> ก่อน ถึงจะจัดตารางจัดการแผนที่เปรียบเทียบ
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleApplyComparison}
                  className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-amber-600/25 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>กดเปรียบเทียบแผนทันที</span>
                </button>
              </div>
            )}
          </div>

          {/* Main Controls Row (โหมดแสดงผล, เน้นจุดต่างกัน, พรีวิว) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                โหมด:
              </span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    filterMode === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  แสดงทั้งหมด
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('diff')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 ${
                    filterMode === 'diff'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>เฉพาะจุดที่ต่างกัน</span>
                  <span
                    className={`px-1 py-0.2 rounded text-[10px] font-bold ${
                      filterMode === 'diff'
                        ? 'bg-amber-700 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {differentCount}
                  </span>
                </button>
              </div>

              {/* Highlight differences toggle */}
              <label
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer select-none transition-colors shadow-2xs ml-1 ${
                  highlightDiffs
                    ? 'bg-transparent border-amber-400 text-amber-900 font-semibold'
                    : 'bg-transparent border-slate-200 text-slate-700 font-medium hover:bg-slate-50/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={highlightDiffs}
                  onChange={() => setHighlightDiffs(!highlightDiffs)}
                  className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                />
                <span className="text-[11px] sm:text-xs">
                  เน้นสีจุดที่ต่างกัน
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3 text-xs self-start md:self-center flex-wrap">
              <span className="text-slate-500 text-[11px] sm:text-xs">
                เปรียบเทียบ <strong className="text-slate-800">{displayedPlans.length}</strong> แผน
              </span>

              <button
                type="button"
                onClick={() => {
                  if (onOpenPreview) {
                    onOpenPreview();
                  } else {
                    window.print();
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50/90 hover:bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                title="พรีวิวเอกสารเปรียบเทียบ"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>พรีวิวแผน</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Insurance Comparison Table (รูปแบบเป๊ะตาม Screenshot Health Insurance) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px] md:min-w-[720px]">
            {/* Header Row */}
            <thead>
              <tr className="bg-gradient-to-r from-sky-800 via-sky-700 to-blue-800 text-white">
                {/* Coverage Column Header */}
                <th className="p-3 md:p-3.5 w-[34%] text-left font-bold text-sm md:text-base tracking-wide border-r border-sky-600/50">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-sky-200" />
                    <span>ความคุ้มครอง</span>
                  </div>
                </th>

                {/* Selected Plans Headers */}
                {displayedPlans.map((plan) => {
                  const columnWidth = `${66 / displayedPlans.length}%`;

                  return (
                    <th
                      key={plan.id}
                      className="p-3 md:p-3.5 text-center border-r border-sky-600/50 align-top relative group"
                      style={{ width: columnWidth }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {/* Delete button on column header */}
                        {displayedPlans.length > 1 && (
                          <div className="no-print w-full flex justify-end -mb-2">
                            <button
                              type="button"
                              onClick={() => handleStageRemovePlan(plan.id)}
                              className="p-0.5 rounded-full bg-sky-900/70 hover:bg-rose-600 text-sky-200 hover:text-white cursor-pointer transition-colors shadow-2xs"
                              title={`ลบ ${plan.name} ออกจากตาราง`}
                            >
                              <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        )}

                        <span className="inline-block bg-sky-100 text-sky-800 border border-sky-300 font-bold text-[9px] uppercase px-2 py-0.5 rounded-full shadow-2xs">
                          {plan.insuranceClass === '1'
                            ? plan.repairType === 'dealer'
                              ? 'แผนประกันชั้น 1 ซ่อมศูนย์'
                              : 'แผนประกันชั้น 1 ซ่อมอู่'
                            : 'แผนประกันชั้น 2+ ซ่อมอู่'}
                        </span>
                        <div className="inline-block bg-white/20 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-md text-sm md:text-base font-black tracking-wide border border-sky-300/30">
                          {plan.name}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {/* ============================================================== */}
              {/* SECTION 0: เกณฑ์อายุรถยนต์ที่รับประกันภัย */}
              {/* ============================================================== */}
              <tr className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
                <td className="py-2 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold text-slate-900">เกณฑ์อายุรถยนต์ที่รับประกันภัย</span>
                  </div>
                </td>
                {displayedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-2 px-3 sm:px-4 text-center border-r border-slate-200 text-xs md:text-sm"
                  >
                    <span className="font-bold text-slate-800 block">
                      {plan.eligibleAgeText}
                    </span>
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ตรงเกณฑ์ ({carYear})
                    </span>
                  </td>
                ))}
              </tr>

              {/* ============================================================== */}
              {/* SECTION 1: ความคุ้มครองความรับผิดต่อบุคคลภายนอก */}
              {/* ============================================================== */}
              <tr className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white font-bold border-y border-sky-400/60 shadow-xs">
                <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white shrink-0 drop-shadow-2xs" />
                    <span className="drop-shadow-2xs">ส่วนที่ 1 : ความคุ้มครองความรับผิดต่อบุคคลภายนอก</span>
                  </div>
                </td>
              </tr>

              {/* Subsection 1 Header */}
              <tr className="bg-slate-100/80 font-bold text-slate-800 border-y border-slate-200 text-xs">
                <td colSpan={totalColumnsCount} className="py-2 px-3 sm:px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                    <span>1. ความคุ้มครองความรับผิดต่อบุคคลภายนอก (วงเงินสูงสุดไม่เกิน)</span>
                  </div>
                </td>
              </tr>

              {/* Row 1.1 */}
              {isRowVisible(false) && (
                <tr className="hover:bg-slate-50/80 border-b border-slate-100">
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      1.1 ชีวิต ร่างกาย หรืออนามัย เฉพาะส่วนเกินวงเงินสูงสุดตาม พ.ร.บ. รวมแล้วไม่เกิน ต่อคน
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-bold text-slate-800 text-xs md:text-sm">
                      1,000,000
                    </td>
                  ))}
                </tr>
              )}

              {/* Row 1.2 */}
              {isRowVisible(false) && (
                <tr className="hover:bg-slate-50/80 border-b border-slate-100">
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      1.2 ชีวิต ร่างกาย หรืออนามัย เฉพาะส่วนเกินวงเงินสูงสุดตาม พ.ร.บ. รวมแล้วไม่เกิน ต่อครั้ง
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-bold text-slate-800 text-xs md:text-sm">
                      20,000,000
                    </td>
                  ))}
                </tr>
              )}

              {/* Row 1.3 */}
              {isRowVisible(hasDiff((p) => p.thirdPartyPropertyDamage)) && (
                <tr className={`hover:bg-slate-50/80 border-b border-slate-100 ${getRowDiffClass(hasDiff((p) => p.thirdPartyPropertyDamage))}`}>
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      1.3 ความเสียหายของทรัพย์สินบุคคลภายนอก ต่อครั้ง
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-bold text-slate-800 text-xs md:text-sm">
                      {p.thirdPartyPropertyDamage.toLocaleString()}
                    </td>
                  ))}
                </tr>
              )}

              {/* ============================================================== */}
              {/* SECTION 2: ความคุ้มครองความเสียหายต่อรถยนต์ที่ทำประกัน */}
              {/* ============================================================== */}
              <tr className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white font-bold border-y border-sky-400/60 shadow-xs">
                <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-white shrink-0 drop-shadow-2xs" />
                    <span className="drop-shadow-2xs">ส่วนที่ 2 : ความคุ้มครองความเสียหายต่อรถยนต์ที่ทำประกัน</span>
                  </div>
                </td>
              </tr>

              {/* Subsection 2 Header */}
              <tr className="bg-slate-100/80 font-bold text-slate-800 border-y border-slate-200 text-xs">
                <td colSpan={totalColumnsCount} className="py-2 px-3 sm:px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                    <span>1. ความเสียหายต่อรถยนต์ที่ทำประกัน (วงเงินสูงสุดไม่เกิน)</span>
                  </div>
                </td>
              </tr>

              {/* Row 2.1 ทุนประกันภัย */}
              {isRowVisible(hasDiff((p) => p.sumInsured)) && (
                <tr className={`hover:bg-slate-50/80 border-b border-slate-100 ${getRowDiffClass(hasDiff((p) => p.sumInsured))}`}>
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-bold text-slate-900">
                      2.1 ทุนประกันภัย (วงเงินสูงสุด)
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-extrabold text-blue-900 text-xs md:text-sm">
                      {p.sumInsured.toLocaleString()}
                    </td>
                  ))}
                </tr>
              )}

              {/* Row 2.2 ภัยจากการชน */}
              {isRowVisible(hasDiff((p) => p.insuranceClass)) && (
                <tr className={`hover:bg-slate-50/80 border-b border-slate-100 ${getRowDiffClass(hasDiff((p) => p.insuranceClass))}`}>
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      2.2 ภัยจากการชนกับยานพาหนะทางบกและสามารถระบุคู่กรณีได้
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-bold text-slate-800 text-xs md:text-sm">
                      ตามทุนประกันภัย
                    </td>
                  ))}
                </tr>
              )}

              {/* Row 2.3 สูญหาย ไฟไหม้ */}
              {isRowVisible(false) && (
                <tr className="hover:bg-slate-50/80 border-b border-slate-100">
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      2.3 กรณีเสียหายที่เกิดจากภัย สูญหาย ไฟไหม้
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-bold text-slate-800 text-xs md:text-sm">
                      ตามทุนประกันภัย
                    </td>
                  ))}
                </tr>
              )}

              {/* Row 2.4 น้ำท่วม */}
              {isRowVisible(false) && (
                <tr className="hover:bg-slate-50/80 border-b border-slate-100">
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      2.4 กรณีเสียหายจากภัย น้ำท่วม
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-bold text-slate-800 text-xs md:text-sm">
                      ตามทุนประกันภัย
                    </td>
                  ))}
                </tr>
              )}

              {/* Row 2.5 Deductible */}
              {isRowVisible(hasDiff((p) => p.deductible)) && (
                <tr className={`hover:bg-slate-50/80 border-b border-slate-100 ${getRowDiffClass(hasDiff((p) => p.deductible))}`}>
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      2.5 ค่าเสียหายส่วนแรก (Deductible)
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-bold text-emerald-700 text-xs md:text-sm">
                      0
                    </td>
                  ))}
                </tr>
              )}

              {/* Row 2.6 รูปแบบการซ่อม */}
              {isRowVisible(hasDiff((p) => p.repairType)) && (
                <tr className={`hover:bg-slate-50/80 border-b border-slate-100 ${getRowDiffClass(hasDiff((p) => p.repairType))}`}>
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      2.6 รูปแบบการจัดซ่อม
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-semibold text-slate-800 text-xs md:text-sm">
                      {p.repairType === 'dealer' ? 'ซ่อมศูนย์ (ห้าง)' : 'ซ่อมอู่มาตรฐานสยามสไมล์'}
                    </td>
                  ))}
                </tr>
              )}

              {/* ============================================================== */}
              {/* SECTION 3: ความคุ้มครองเพิ่มเติม */}
              {/* ============================================================== */}
              <tr className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white font-bold border-y border-sky-400/60 shadow-xs">
                <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-white shrink-0 drop-shadow-2xs" />
                    <span className="drop-shadow-2xs">ส่วนที่ 3 : ความคุ้มครองเพิ่มเติม</span>
                  </div>
                </td>
              </tr>

              {/* Subsection 3 Header */}
              <tr className="bg-slate-100/80 font-bold text-slate-800 border-y border-slate-200 text-xs">
                <td colSpan={totalColumnsCount} className="py-2 px-3 sm:px-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                    <span>1. ความคุ้มครองเพิ่มเติม</span>
                  </div>
                </td>
              </tr>

              {/* Row 3.1 อุบัติเหตุส่วนบุคคล */}
              {isRowVisible(false) && (
                <tr className="hover:bg-slate-50/80 border-b border-slate-100">
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      3.1 การประกันอุบัติเหตุส่วนบุคคลเพื่อผู้ขับขี่ และผู้โดยสาร ต่อคน
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-bold text-slate-800 text-xs md:text-sm">
                      100,000 x 5 ที่นั่ง
                    </td>
                  ))}
                </tr>
              )}

              {/* Row 3.2 ค่ารักษาพยาบาล */}
              {isRowVisible(false) && (
                <tr className="hover:bg-slate-50/80 border-b border-slate-100">
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      3.2 ค่ารักษาพยาบาลเพื่อผู้ขับขี่ และผู้โดยสาร ต่อคน
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-bold text-slate-800 text-xs md:text-sm">
                      100,000 x 5 ที่นั่ง
                    </td>
                  ))}
                </tr>
              )}

              {/* Row 3.3 ประกันตัวผู้ขับขี่ */}
              {isRowVisible(hasDiff((p) => p.bailBond)) && (
                <tr className={`hover:bg-slate-50/80 border-b border-slate-100 ${getRowDiffClass(hasDiff((p) => p.bailBond))}`}>
                  <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200">
                    <div className="font-medium text-slate-800">
                      3.3 การประกันตัวผู้ขับขี่ ต่อครั้ง (วงเงินสูงสุดไม่เกิน)
                    </div>
                  </td>
                  {displayedPlans.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 font-bold text-slate-800 text-xs md:text-sm">
                      {p.bailBond.toLocaleString()}
                    </td>
                  ))}
                </tr>
              )}

              {/* ============================================================== */}
              {/* สิทธิพิเศษเพิ่มเติม */}
              {/* ============================================================== */}
              <tr className="bg-[#eaf4fc] border-t border-b border-[#cce4f7]">
                <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm font-bold text-[#00509d]">
                  สิทธิพิเศษเพิ่มเติม
                </td>
              </tr>

              {/* บริการช่วยเหลือฉุกเฉิน: 4 ไอคอนแนวนอน (พ่วงแบตฯ, เปลี่ยนยาง, เติมน้ำมัน, รถลาก) */}
              <tr className="bg-white border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200 font-medium text-slate-800 align-middle">
                  บริการช่วยเหลือฉุกเฉิน
                </td>
                {displayedPlans.map((p) => (
                  <td key={p.id} className="py-3 px-3 sm:px-4 text-center border-r border-slate-200 align-middle">
                    <div className="flex items-center justify-center gap-4 sm:gap-6">
                      {/* พ่วงแบตฯ */}
                      <div className="flex flex-col items-center justify-center gap-1 min-w-[44px]">
                        <svg className="w-5 h-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 2h4a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm3 5.5l-4 6.5h3.5v5l4-6.5h-3.5v-5z" />
                        </svg>
                        <span className="text-[10px] text-[#0088cc] font-medium tracking-tight">
                          พ่วงแบตฯ
                        </span>
                      </div>

                      {/* เปลี่ยนยาง */}
                      <div className="flex flex-col items-center justify-center gap-1 min-w-[44px]">
                        <svg className="w-5 h-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21.71 6.29l-3-3a1 1 0 0 0-1.42 0l-3.3 3.3a6.5 6.5 0 0 0-6.9 1.18 6.5 6.5 0 0 0-1.07 7.74l-4.5 4.5a1 1 0 0 0 0 1.41l1.42 1.42a1 1 0 0 0 1.41 0l4.5-4.5a6.5 6.5 0 0 0 7.74-1.07 6.5 6.5 0 0 0 1.18-6.9l3.3-3.3a1 1 0 0 0 0-1.42z" />
                        </svg>
                        <span className="text-[10px] text-[#0088cc] font-medium tracking-tight">
                          เปลี่ยนยาง
                        </span>
                      </div>

                      {/* เติมน้ำมัน */}
                      <div className="flex flex-col items-center justify-center gap-1 min-w-[44px]">
                        <svg className="w-5 h-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 5h-1V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 13H6v-6h8v6zm0-8H6V5h8v5zm4 1h-2V7h2v4z" />
                        </svg>
                        <span className="text-[10px] text-[#0088cc] font-medium tracking-tight">
                          เติมน้ำมัน
                        </span>
                      </div>

                      {/* รถลาก */}
                      <div className="flex flex-col items-center justify-center gap-1 min-w-[44px]">
                        <svg className="w-5 h-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 8h-3V4H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h1a3 3 0 0 0 6 0h4a3 3 0 0 0 6 0h2a1 1 0 0 0 1-1v-6l-3-4zM6 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM16 12V9.5h2.5l1.9 2.5H16z" />
                        </svg>
                        <span className="text-[10px] text-[#0088cc] font-medium tracking-tight">
                          รถลาก
                        </span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* ============================================================== */}
              {/* SECTION 5: เบี้ยประกันภัย (ชำระรายเดือน / ชำระรายปี) */}
              {/* ============================================================== */}
              <tr className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white font-bold border-y border-sky-400/60 shadow-xs">
                <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-white shrink-0 drop-shadow-2xs" />
                    <span className="drop-shadow-2xs">เบี้ยประกันภัย (ชำระรายเดือน / ชำระรายปี)</span>
                  </div>
                </td>
              </tr>

              {/* แถวที่ 1: รายเดือน */}
              <tr className="bg-white border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200 font-bold text-slate-800">
                  รายเดือน
                </td>
                {displayedPlans.map((p) => (
                  <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 align-middle">
                    <div className="text-sm md:text-base font-extrabold text-[#00509d]">
                      {p.monthlyPremium.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-500">บาท/เดือน</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* แถวที่ 2: รายปี */}
              <tr className="bg-white border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 sm:px-4 text-xs md:text-sm border-r border-slate-200 font-bold text-slate-800">
                  รายปี
                </td>
                {displayedPlans.map((p) => (
                  <td key={p.id} className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-200 align-middle">
                    <div className="text-sm md:text-base font-extrabold text-[#00509d]">
                      {p.annualPremium.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-500">บาท/ปี</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* แถวที่ 3: ปุ่มดำเนินการ / สั่งซื้อออนไลน์ */}
              <tr className="bg-slate-50/70 border-t border-slate-200 no-print">
                <td className="py-3 px-3 sm:px-4 border-r border-slate-200 align-middle">
                  {/* ช่องว่างซ้ายมือ */}
                </td>
                {displayedPlans.map((plan) => (
                  <td
                    key={plan.id}
                    className="py-3 px-3 sm:px-4 text-center border-r border-slate-200 align-middle"
                  >
                    <div className="flex justify-center">
                      <a
                        href="https://prmorder.uatsiamsmile.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full max-w-[200px] py-2 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                        title={`ซื้อแผนประกันนี้ ${plan.name} - สั่งซื้อออนไลน์ที่ https://prmorder.uatsiamsmile.com/`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                        <span>ซื้อแผนประกันนี้</span>
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terms and Conditions Section: แยกเงื่อนไขสำหรับประกันชั้น 1 และ ชั้น 2 */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200">
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>เงื่อนไขการรับประกัน</span>
              </h2>

              {/* Tabs for Class 1 / Class 2+ / Both */}
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold no-print">
                <button
                  type="button"
                  onClick={() => setTermsTab('class1')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    termsTab === 'class1'
                      ? 'bg-white text-blue-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>ประกันภัยชั้น 1 (10 ข้อ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTermsTab('class2plus')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                    termsTab === 'class2plus'
                      ? 'bg-white text-blue-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>ประกันภัยชั้น 2+ (9 ข้อ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTermsTab('both')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    termsTab === 'both'
                      ? 'bg-white text-blue-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  แสดงทั้ง 2 ชั้น
                </button>
              </div>
            </div>

            {/* Content for Class 1 (10 Clauses) */}
            {(termsTab === 'class1' || termsTab === 'both') && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 bg-blue-50/80 px-2.5 py-1.5 rounded-lg border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                  <span>เงื่อนไขการรับประกันภัย: ประกันภัยชั้น 1 (SMILE MOTOR 1)</span>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700 leading-relaxed">
                  {MOTOR_CLASS_1_CONDITIONS.map((cond, idx) => (
                    <li key={`c1-${idx}`}>{cond}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Content for Class 2+ (9 Clauses ตามรูปภาพ) */}
            {(termsTab === 'class2plus' || termsTab === 'both') && (
              <div className={`space-y-2 ${termsTab === 'both' ? 'pt-4 border-t border-slate-150' : ''}`}>
                <div className="flex items-center gap-2 text-xs font-bold text-sky-900 bg-sky-50/80 px-2.5 py-1.5 rounded-lg border border-sky-200">
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                  <span>เงื่อนไขการรับประกันภัย: ประกันภัยชั้น 2+ (SMILE MOTOR 2+)</span>
                </div>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-700 leading-relaxed">
                  {MOTOR_CLASS_2PLUS_CONDITIONS.map((cond, idx) => (
                    <li key={`c2-${idx}`}>{cond}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Official Legal & Coordinator Notes */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
              <div className="flex flex-col sm:flex-row justify-between gap-1 text-slate-700">
                <span>
                  <strong>ผู้ประสานงานโครงการ:</strong> ชื่อ-นามสกุล ..............................................................
                </span>
                <span>
                  <strong>โทรศัพท์:</strong> ..............................................................
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-1 text-slate-600">
                <span>
                  <strong>ผู้ดำเนินโครงการ:</strong> บริษัท สยามสไมล์ โบรกเกอร์ (ประเทศไทย) จำกัด
                </span>
                <span className="text-slate-500">ใบอนุญาตเลขที่ ว00017/2553</span>
              </div>
              <div>
                <strong>บริษัทผู้รับประกันภัย:</strong> บริษัท ชับบ์สามัคคีประกันภัย จำกัด (มหาชน)
              </div>
              <div className="text-rose-600 font-medium pt-1 text-[10.5px]">
                <strong>คำเตือน:</strong> ผู้ขอเอาประกันภัย ควรศึกษาทำความเข้าใจรายละเอียดความคุ้มครองและเงื่อนไขก่อนตัดสินใจทำประกันภัย เมื่อได้รับกรมธรรม์แล้ว โปรดศึกษารายละเอียดข้อกำหนดและเงื่อนไขในกรมธรรม์ หากมีปัญหาร้องเรียนข้อข้องใจ เกี่ยวกับการประกันภัย กรุณาติดต่อ 1434
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
