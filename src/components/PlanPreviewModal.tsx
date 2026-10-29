import React, { useState, useMemo } from 'react';
import { InsurancePlan, ExportMeta, CustomerProfile } from '../types';
import { formatCurrency } from '../data/plans';
import { exportToPdf, triggerPrint } from '../utils/pdfExport';
import { PolicyTermsNotice } from './PolicyTermsNotice';
import {
  X,
  Printer,
  FileDown,
  Eye,
  Check,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Calendar,
  AlertCircle,
  ShieldCheck,
  HeartPulse,
  Activity,
  Sparkles,
  User,
  Phone,
} from 'lucide-react';

interface PlanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlans: InsurancePlan[];
  allPlans: InsurancePlan[];
  exportMeta: ExportMeta;
  existingCustomer?: CustomerProfile | null;
  userAge?: number | null;
  onOpenExportSettings?: () => void;
  onSaveToHistory?: () => void;
}

export const PlanPreviewModal: React.FC<PlanPreviewModalProps> = ({
  isOpen,
  onClose,
  selectedPlans,
  allPlans,
  exportMeta,
  existingCustomer,
  userAge,
  onOpenExportSettings,
  onSaveToHistory,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const useTemplateBg = true;

  // If existing customer plan is available
  const existingCustomerPlan = useMemo(() => {
    if (!existingCustomer) return null;
    return allPlans.find((p) => p.id === existingCustomer.existingPlanId) || null;
  }, [existingCustomer, allPlans]);

  const isExistingPlanSelected = useMemo(() => {
    if (!existingCustomerPlan) return false;
    return selectedPlans.some((p) => p.id === existingCustomerPlan.id);
  }, [existingCustomerPlan, selectedPlans]);

  // Combined plans calculation
  const plansForCombined = useMemo(() => {
    if (selectedPlans.length === 0) return [];
    if (
      existingCustomer &&
      existingCustomerPlan &&
      selectedPlans.length === 1 &&
      !isExistingPlanSelected
    ) {
      return [existingCustomerPlan, selectedPlans[0]];
    }
    return selectedPlans;
  }, [selectedPlans, existingCustomer, existingCustomerPlan, isExistingPlanSelected]);

  const combinedTotals = useMemo(() => {
    if (plansForCombined.length <= 1) return null;

    const monthlyPremium = plansForCombined.reduce((sum, p) => sum + p.monthlyPremium, 0);
    const annualPremium = plansForCombined.reduce((sum, p) => sum + p.annualPremium, 0);

    const roomNormalPerNight = plansForCombined.reduce((sum, p) => sum + p.roomNormal.perNight, 0);
    const roomNormalMaxLimit = plansForCombined.reduce((sum, p) => sum + p.roomNormal.maxLimit, 0);

    const roomICUPerNight = plansForCombined.reduce((sum, p) => sum + p.roomICU.perNight, 0);
    const roomICUMaxLimit = plansForCombined.reduce((sum, p) => sum + p.roomICU.maxLimit, 0);
    const roomCombinedMaxLimit = roomNormalMaxLimit + roomICUMaxLimit;

    const medicalGeneral = plansForCombined.reduce((sum, p) => sum + p.medicalGeneralPerVisit, 0);
    const surgery = plansForCombined.reduce((sum, p) => sum + p.surgeryPerDisorder, 0);
    const inpatientMedicalSubtotal = medicalGeneral + surgery;

    const doctorVisitPerNight = plansForCombined.reduce((sum, p) => sum + p.doctorVisitPerNight.perNight, 0);
    const doctorVisitMaxLimit = plansForCombined.reduce((sum, p) => sum + p.doctorVisitPerNight.maxLimit, 0);
    const inpatientMedicalMaxLimit = roomNormalMaxLimit + medicalGeneral + surgery + doctorVisitMaxLimit;

    const opdAccident = plansForCombined.reduce((sum, p) => sum + p.opd.accident, 0);
    const opdCoveredPlans = plansForCombined.filter((p) => p.opd.illness.covered);
    const hasOpdIllness = opdCoveredPlans.length > 0;
    const opdIllnessPerVisit = opdCoveredPlans.reduce((sum, p) => sum + (p.opd.illness.perVisit || 0), 0);

    const dailyComp = plansForCombined.reduce((sum, p) => sum + p.dailyCompensation.perNight, 0);
    const lifeAccident = plansForCombined.reduce((sum, p) => sum + p.life.accidentGeneral, 0);
    const lifeMurder = plansForCombined.reduce((sum, p) => sum + p.life.murderAssault, 0);
    const lifeMotorcycle = plansForCombined.reduce((sum, p) => sum + p.life.motorcycle, 0);
    const lifeFuneral = plansForCombined.reduce((sum, p) => sum + p.life.funeralBenefit, 0);

    const paPermanentDisability = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.permanentDisability ?? p.life.accidentGeneral),
      0
    );
    const paTwoLimbsOrEyes = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.twoLimbsOrEyes ?? p.life.accidentGeneral),
      0
    );
    const paOneLimbOrEye = plansForCombined.reduce(
      (sum, p) => sum + (p.paSchedule?.oneLimbOrEye ?? Math.round(p.life.accidentGeneral * 0.6)),
      0
    );

    const minEligibleAge = Math.max(...plansForCombined.map((p) => p.minAge));
    const maxEligibleAge = Math.min(...plansForCombined.map((p) => p.maxAge));

    const existingMonthly = existingCustomerPlan ? existingCustomerPlan.monthlyPremium : 0;
    const addedMonthly = Math.max(0, monthlyPremium - existingMonthly);

    return {
      monthlyPremium,
      annualPremium,
      roomNormalPerNight,
      roomNormalMaxLimit,
      roomICUPerNight,
      roomICUMaxLimit,
      roomCombinedMaxLimit,
      medicalGeneral,
      surgery,
      inpatientMedicalSubtotal,
      doctorVisitPerNight,
      doctorVisitMaxLimit,
      inpatientMedicalMaxLimit,
      opdAccident,
      hasOpdIllness,
      opdIllnessPerVisit,
      dailyComp,
      lifeAccident,
      lifeMurder,
      lifeMotorcycle,
      lifeFuneral,
      paPermanentDisability,
      paTwoLimbsOrEyes,
      paOneLimbOrEye,
      minEligibleAge,
      maxEligibleAge,
      addedMonthly,
    };
  }, [plansForCombined, existingCustomerPlan]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 130));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 70));
  const handleZoomReset = () => setZoomLevel(100);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setErrorMsg(null);
    setExportSuccess(false);

    if (onSaveToHistory) {
      onSaveToHistory();
    }

    try {
      const planCodes = selectedPlans.map((p) => p.code).join('-');
      const clientName = exportMeta.customerName.trim()
        ? `_${exportMeta.customerName.trim().replace(/\s+/g, '_')}`
        : '';
      const fileName = `พรีวิวแผนประกันภัย${clientName}_${planCodes}_${new Date().toISOString().slice(0, 10)}.pdf`;

      const success = await exportToPdf('plan-preview-document-element', fileName);
      if (success) {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3500);
      } else {
        setErrorMsg('ไม่สามารถสร้างไฟล์ PDF จากพรีวิวได้ แนะนำให้กดปุ่ม "พิมพ์" ทางบราวเซอร์แทน');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการประมวลผล PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrintDocument = () => {
    if (onSaveToHistory) {
      onSaveToHistory();
    }
    // Small timeout to allow UI state to settle
    setTimeout(() => {
      triggerPrint();
    }, 150);
  };

  const customerDisplayName =
    exportMeta.customerName.trim() ||
    (existingCustomer ? existingCustomer.fullName : 'ลูกค้าทั่วไป (ไม่ระบุชื่อ)');

  const agentDisplayName =
    `${exportMeta.agentFirstName} ${exportMeta.agentLastName}`.trim() || 'ตัวแทนสยามสไมล์';

  const totalColumnsCount = selectedPlans.length + (combinedTotals ? 2 : 1);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <header className="no-print bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-md">
        {/* Left: Title & Info */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                พรีวิวแผนและเอกสารข้อเสนอ (Smart Brochure Preview)
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {selectedPlans.length} แผน
              </span>
            </div>
          </div>
        </div>

        {/* Center: Zoom Controls */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
            title="ลดขนาดแสดงผล"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] text-slate-300 min-w-[42px] text-center">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
            title="เพิ่มขนาดแสดงผล"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomReset}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer ml-0.5"
            title="รีเซ็ตขนาด 100%"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={handlePrintDocument}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-blue-400/40 bg-blue-900/60 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="สั่งพิมพ์เอกสารพรีวิวทางเครื่องพิมพ์หรือเซฟเป็น PDF ทางบราวเซอร์"
          >
            <Printer className="w-3.5 h-3.5 text-blue-200" />
            <span>พิมพ์</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            title="ดาวน์โหลดไฟล์ PDF โดยตรง"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>กำลังสร้าง PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>ส่งออก PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
            title="ปิดหน้าต่างพรีวิว"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Notifications banner if any */}
      {errorMsg && (
        <div className="no-print bg-rose-600 text-white px-4 py-2 text-xs flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="underline cursor-pointer">
            ปิด
          </button>
        </div>
      )}

      {exportSuccess && (
        <div className="no-print bg-emerald-600 text-white px-4 py-2 text-xs flex items-center justify-center gap-2 shrink-0">
          <Check className="w-4 h-4" />
          <span>ดาวน์โหลดเอกสาร PDF จากพรีวิวเรียบร้อยแล้ว!</span>
        </div>
      )}

      {/* Document Viewport (Scrollable with zoom scaling) */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 flex justify-center bg-slate-800/60">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="w-full max-w-4xl"
        >
          {/* Printable Document Sheet Container */}
          <div
            id="plan-preview-document-element"
            className="relative bg-white text-slate-900 shadow-2xl rounded-2xl border border-slate-200 overflow-hidden min-h-[1200px]"
          >
            {/* Template Background Graphic Layer (Official Siam Smile ISO A4) */}
            {useTemplateBg && (
              <div className="absolute top-0 inset-x-0 pointer-events-none select-none z-0">
                <img
                  src="/assets/siam-smile-brochure-template.png"
                  alt="Siam Smile Official Brochure Template"
                  crossOrigin="anonymous"
                  className="w-full h-auto object-cover object-top"
                />
              </div>
            )}

            {/* Document Content Layer */}
            <div
              className={`relative z-10 p-5 sm:p-7 md:p-8 space-y-6 ${
                useTemplateBg ? 'pt-[225px] sm:pt-[255px] md:pt-[280px]' : ''
              }`}
            >
              {/* Header: Siam Smile Official Branding (Only shown if template bg not active) */}
              {!useTemplateBg && (
                <div className="border-b-2 border-[#00509d] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#00509d] text-white font-extrabold text-xs tracking-wider uppercase">
                        SMILE HEALTH
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        บริษัท สยามสไมล์โบรกเกอร์ (ประเทศไทย) จำกัด
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#003e7a] tracking-tight mt-1.5">
                      ข้อเสนอและเปรียบเทียบผลประโยชน์ความคุ้มครอง
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Smart Brochure - เอกสารประกอบการพิจารณาเลือกแผนประกันภัยสุขภาพและอุบัติเหตุ
                    </p>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
                    <div className="flex sm:justify-end items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>วันที่จัดทำ: <strong className="text-slate-800">{exportMeta.date}</strong></span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      รหัสสำนักงาน/ตัวแทน: <strong className="font-mono text-slate-700">{exportMeta.agentOfficeCode || '-'}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison Matrix Table */}
              <div className="border border-sky-200/80 rounded-xl overflow-hidden bg-white/95 backdrop-blur-2xs shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  {/* Header Row */}
                  <thead>
                    <tr className="bg-gradient-to-r from-sky-800 via-sky-700 to-blue-800 text-white">
                      {/* Coverage Column Header */}
                      <th className="p-3 w-[32%] text-left font-bold text-sm tracking-wide border-r border-sky-600/50">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-sky-200" />
                          <span>ความคุ้มครอง</span>
                        </div>
                      </th>

                      {/* Selected Plans Headers */}
                      {selectedPlans.map((plan) => {
                        const isExistingCustomerPlan = existingCustomer?.existingPlanId === plan.id;
                        return (
                          <th
                            key={plan.id}
                            className="p-3 text-center border-r border-sky-600/50 align-top relative"
                          >
                            <div className="flex flex-col items-center gap-1">
                              {isExistingCustomerPlan && (
                                <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[9px] uppercase px-2 py-0.5 rounded-full shadow-2xs">
                                  แผนเดิมของลูกค้า
                                </span>
                              )}
                              {plan.category === 'pa' ? (
                                <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[9px] uppercase px-2 py-0.5 rounded-full shadow-2xs">
                                  แผนอุบัติเหตุ PA
                                </span>
                              ) : (
                                <span className="inline-block bg-sky-100 text-sky-800 border border-sky-300 font-bold text-[9px] uppercase px-2 py-0.5 rounded-full shadow-2xs">
                                  แผนประกันสุขภาพ
                                </span>
                              )}
                              <div className="inline-block bg-white/20 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-black tracking-wide border border-sky-300/30">
                                {plan.name}
                              </div>
                            </div>
                          </th>
                        );
                      })}

                      {/* Combined Total Column Header */}
                      {combinedTotals && (
                        <th
                          className="p-3 text-center bg-gradient-to-b from-[#094f92] via-[#00509d] to-[#003e7a] text-white border-l-2 border-sky-300 align-top shadow-md"
                        >
                          <div className="flex flex-col items-center gap-1">
                            {existingCustomer ? (
                              <span className="inline-flex items-center gap-1 bg-sky-100/90 text-sky-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-sky-200 shadow-2xs">
                                <Sparkles className="w-3 h-3 text-sky-700" />
                                กรณีลูกค้าเดิม (Top-up)
                              </span>
                            ) : (
                              <span className="inline-block bg-sky-100/90 text-sky-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-sky-200 shadow-2xs">
                                ความคุ้มครองรวม
                              </span>
                            )}

                            <div className="inline-block bg-white text-[#00509d] px-2.5 py-0.5 rounded-md text-xs sm:text-sm font-black tracking-wide shadow-xs">
                              ช่องรวมค่ารักษาพยาบาล
                            </div>

                            <div className="text-[10px] text-sky-100 font-medium">
                              {existingCustomer ? 'สิทธิประโยชน์รวมแผนเดิมและแผนใหม่' : 'สิทธิประโยชน์ความคุ้มครองรวม'}
                            </div>
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {/* ============================================================== */}
                    {/* SECTION 0: เกณฑ์อายุที่รับประกันภัย */}
                    {/* ============================================================== */}
                    <tr className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold text-slate-900">เกณฑ์อายุที่รับประกันภัย</span>
                        </div>
                      </td>
                      {selectedPlans.map((plan) => {
                        const isMatchAge =
                          userAge !== null && userAge !== undefined
                            ? userAge >= plan.minAge && userAge <= plan.maxAge
                            : true;
                        return (
                          <td
                            key={plan.id}
                            className="py-2 px-3 sm:px-4 text-center border-r border-slate-200 text-xs"
                          >
                            <span className="font-bold text-slate-800 block">{plan.ageRangeText}</span>
                            {userAge !== null && userAge !== undefined && (
                              <span
                                className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  isMatchAge
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {isMatchAge ? 'ตรงเกณฑ์' : 'ไม่ตรงเกณฑ์'}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] text-xs border-l-2 border-[#b9ddf8] font-bold text-[#00509d]">
                          {combinedTotals.minEligibleAge} - {combinedTotals.maxEligibleAge} ปี
                          <span className="block text-[10px] text-sky-700 font-normal">
                            (ช่วงอายุที่สมัครคู่กันได้)
                          </span>
                        </td>
                      )}
                    </tr>

                    {/* ============================================================== */}
                    {/* SECTION 1: ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล */}
                    {/* ============================================================== */}
                    <tr className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white font-bold border-y border-sky-400/60 shadow-xs">
                      <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-white shrink-0 drop-shadow-2xs" />
                          <span className="drop-shadow-2xs">ส่วนที่ 1 : ความคุ้มครองค่าห้อง ค่าอาหาร และค่าบริการพยาบาล</span>
                        </div>
                      </td>
                    </tr>

                    {/* Subsection 1 Header */}
                    <tr className="bg-slate-100/80 font-bold text-slate-800 border-y border-slate-200 text-xs">
                      <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                          <span>1. ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล กรณีผู้ป่วยใน</span>
                        </div>
                      </td>
                    </tr>

                    {/* Row 1.1 */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          1.1 ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล ผู้ป่วยปกติ ต่อคืน
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                          สูงสุดไม่เกิน 45 คืนต่อครั้ง ต่อโรค
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {formatCurrency(plan.roomNormal.perNight)}
                          </div>
                          <div className="text-[10.5px] font-semibold text-sky-600">
                            {formatCurrency(plan.roomNormal.maxLimit)}
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <div className="font-black text-[#00509d] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.roomNormalPerNight)}
                          </div>
                          <div className="text-[10.5px] font-bold text-sky-700">
                            {formatCurrency(combinedTotals.roomNormalMaxLimit)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Row 1.2 */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          1.2 ค่าห้อง ค่าอาหาร และค่าบริการพยาบาล ผู้ป่วยหนัก (ICU) ต่อคืน
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                          สูงสุดไม่เกิน 15 วัน
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {formatCurrency(plan.roomICU.perNight)}
                          </div>
                          <div className="text-[10.5px] font-semibold text-sky-600">
                            {formatCurrency(plan.roomICU.maxLimit)}
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <div className="font-black text-[#00509d] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.roomICUPerNight)}
                          </div>
                          <div className="text-[10.5px] font-bold text-sky-700">
                            {formatCurrency(combinedTotals.roomICUMaxLimit)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Row 1.3 */}
                    <tr className="bg-sky-50/50 border-b border-sky-100 hover:bg-sky-50 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                          <span>1.3 รวมวงเงินค่าห้องปกติ + ICU สูงสุดต่อครั้ง</span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500">
                          (คำนวณจากห้องปกติ 45 คืน + ICU 30 คืน)
                        </div>
                      </td>
                      {selectedPlans.map((plan) => {
                        const planRoomMax = plan.roomNormal.maxLimit + plan.roomICU.maxLimit;
                        return (
                          <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100 font-semibold text-sky-800 text-xs sm:text-sm">
                            {formatCurrency(planRoomMax)}
                          </td>
                        );
                      })}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                          <div className="font-black text-[#003e7a] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.roomCombinedMaxLimit)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* ============================================================== */}
                    {/* SECTION 2: ค่ารักษาพยาบาลทั่วไป และ การผ่าตัด */}
                    {/* ============================================================== */}
                    <tr className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white font-bold border-y border-sky-400/60 shadow-xs">
                      <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-white shrink-0 drop-shadow-2xs" />
                          <span className="drop-shadow-2xs">ส่วนที่ 2 : ความคุ้มครองค่ารักษาพยาบาลทั่วไป และ การผ่าตัด (IPD)</span>
                        </div>
                      </td>
                    </tr>

                    {/* Subsection 2 Header */}
                    <tr className="bg-slate-100/80 font-bold text-slate-800 border-y border-slate-200 text-xs">
                      <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                          <span>2. ค่ารักษาพยาบาล กรณีผู้ป่วยใน</span>
                        </div>
                      </td>
                    </tr>

                    {/* Row 2.1 */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          2.1 ค่ารักษาพยาบาล และค่าบริการทั่วไป ต่อครั้ง
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {formatCurrency(plan.medicalGeneralPerVisit)}
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <div className="font-black text-[#00509d] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.medicalGeneral)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Row 2.2 */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          2.2 การรักษาโดยการผ่าตัด ต่อโรค
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500">
                          (เบิกตามค่าใช้จ่ายจริง ไม่เกินวงเงินในแผน)
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {formatCurrency(plan.surgeryPerDisorder)}
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <div className="font-black text-[#00509d] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.surgery)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Row 2.3 */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          2.3 การดูแลโดยแพทย์ (ค่าแพทย์เยี่ยมไข้ ผู้ป่วยใน) สูงสุดต่อคืน
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-sky-600 font-normal">
                          สูงสุดไม่เกิน 45 คืน ต่อครั้ง ต่อโรค
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {formatCurrency(plan.doctorVisitPerNight.perNight)}
                          </div>
                          <div className="text-[10.5px] font-semibold text-sky-600">
                            {formatCurrency(plan.doctorVisitPerNight.maxLimit)}
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <div className="font-black text-[#00509d] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.doctorVisitPerNight)}
                          </div>
                          <div className="text-[10.5px] font-bold text-sky-700">
                            {formatCurrency(combinedTotals.doctorVisitMaxLimit)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Row 2.4 - Subtotal Inpatient */}
                    <tr className="bg-[#f0f7fd]/70 border-b border-sky-200 hover:bg-sky-50 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="flex items-center gap-1.5 text-sky-950 font-bold">
                          <HeartPulse className="w-3.5 h-3.5 text-[#00509d] shrink-0" />
                          <span>2.4 รวมค่ารักษาพยาบาลผู้ป่วยใน (ค่ารักษาทั่วไป + ค่าผ่าตัด)</span>
                        </div>
                        <div className="text-[10px] text-sky-700 font-semibold mt-0.5">
                          {existingCustomer
                            ? `⭐ รวมค่ารักษาพยาบาลกรณีลูกค้าเดิม (Top-up เพิ่มจากแผนเดิม ${existingCustomerPlan?.code || ''})`
                            : '⭐ รวมค่ารักษาทั่วไป + ค่าผ่าตัด ต่อการรักษาครั้งหนึ่ง'}
                        </div>
                      </td>
                      {selectedPlans.map((plan) => {
                        const planMedicalSubtotal = plan.medicalGeneralPerVisit + plan.surgeryPerDisorder;
                        return (
                          <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                            <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                              {formatCurrency(planMedicalSubtotal)}
                            </div>
                          </td>
                        );
                      })}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                          <div className="font-black text-[#003e7a] text-xs sm:text-sm md:text-base">
                            {formatCurrency(combinedTotals.inpatientMedicalSubtotal)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Row 2.5 - Max Inpatient Limit */}
                    <tr className="bg-sky-50/40 border-b border-slate-200 hover:bg-sky-100/40 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                          <Activity className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>2.5 รวมผลประโยชน์ค่ารักษาผู้ป่วยในสูงสุด ต่อครั้ง ต่อโรค</span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500">
                          (รวมค่าห้องปกติ 45 คืน + ค่ารักษาทั่วไป + ผ่าตัด + ค่าแพทย์ 45 คืน)
                        </div>
                      </td>
                      {selectedPlans.map((plan) => {
                        const planInpatientMax =
                          plan.roomNormal.maxLimit +
                          plan.medicalGeneralPerVisit +
                          plan.surgeryPerDisorder +
                          plan.doctorVisitPerNight.maxLimit;
                        return (
                          <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                            <div className="font-black text-blue-900 text-xs sm:text-sm">
                              {formatCurrency(planInpatientMax)}
                            </div>
                          </td>
                        );
                      })}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#e5f1fc] border-l-2 border-[#9eccf5]">
                          <div className="font-black text-[#003e7a] text-xs sm:text-sm md:text-base">
                            {formatCurrency(combinedTotals.inpatientMedicalMaxLimit)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* ============================================================== */}
                    {/* SECTION 3: ค่ารักษาพยาบาลฉุกเฉิน และ OPD */}
                    {/* ============================================================== */}
                    <tr className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white font-bold border-y border-sky-400/60 shadow-xs">
                      <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-white shrink-0 drop-shadow-2xs" />
                          <span className="drop-shadow-2xs">ส่วนที่ 3 : ความคุ้มครองค่ารักษาพยาบาลฉุกเฉิน และ OPD</span>
                        </div>
                      </td>
                    </tr>

                    {/* Subsection 3 Header */}
                    <tr className="bg-slate-100/80 font-bold text-slate-800 border-y border-slate-200 text-xs">
                      <td colSpan={totalColumnsCount} className="py-1.5 px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                          <span>3. ค่ารักษาพยาบาลฉุกเฉิน และ ผู้ป่วยนอก</span>
                        </div>
                      </td>
                    </tr>

                    {/* Row 3.1 - Emergency Accident */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          3.1 ค่ารักษาพยาบาลฉุกเฉินเนื่องจากอุบัติเหตุ (ภายใน 24 ชม.)
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {formatCurrency(plan.opd.accident)}
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <div className="font-black text-[#00509d] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.opdAccident)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Row 3.2 - OPD General Illness */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          3.2 ค่ารักษาพยาบาลผู้ป่วยนอก (OPD โรคทั่วไป) ต่อครั้ง
                        </div>
                        <div className="text-[10px] text-slate-500">
                          (สูงสุดตามเงื่อนไขของแต่ละแผน)
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          {plan.category === 'health' && plan.opd.illness.covered ? (
                            <div>
                              <div className="font-bold text-emerald-700 text-xs sm:text-sm">
                                {formatCurrency(plan.opd.illness.perVisit || 0)}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                (สูงสุด {plan.opd.illness.maxVisitsPerYear || 30} ครั้ง/ปี)
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">- ไม่คุ้มครอง -</span>
                          )}
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          {combinedTotals.hasOpdIllness ? (
                            <div className="font-black text-emerald-800 text-xs sm:text-sm">
                              {formatCurrency(combinedTotals.opdIllnessPerVisit)}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                      )}
                    </tr>

                    {/* Row 3.3 - Dialysis/Chemo */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          3.3 ค่าล้างไต / เคมีบำบัด / รังสีรักษา
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <span className="text-xs text-slate-700">
                            {plan.category === 'health' ? 'คุ้มครองตามจริงในวงเงิน' : '- ไม่คุ้มครอง -'}
                          </span>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8] text-xs font-semibold text-blue-900">
                          คุ้มครองตามจริงในวงเงิน
                        </td>
                      )}
                    </tr>

                    {/* ============================================================== */}
                    {/* SECTION 4: ผลประโยชน์การเสียชีวิต สูญเสียอวัยวะ และอุบัติเหตุ (PA) */}
                    {/* ============================================================== */}
                    <tr className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white font-bold border-y border-sky-400/60 shadow-xs">
                      <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-white shrink-0 drop-shadow-2xs" />
                          <span className="drop-shadow-2xs">ส่วนที่ 4 : ผลประโยชน์การเสียชีวิต สูญเสียอวัยวะ และอุบัติเหตุ (PA)</span>
                        </div>
                      </td>
                    </tr>

                    {/* Row 4.1 - Accident General */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          4.1 กรณีเสียชีวิต สูญเสียอวัยวะ หรือทุพพลภาพถาวรสิ้นเชิง จากอุบัติเหตุทั่วไป (อบ.2)
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {formatCurrency(plan.life.accidentGeneral)}
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <div className="font-black text-[#00509d] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.lifeAccident)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Row 4.2 - Motorcycle */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          4.2 กรณีขับขี่หรือโดยสารรถจักรยานยนต์
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {formatCurrency(plan.life.motorcycle)}
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <div className="font-black text-[#00509d] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.lifeMotorcycle)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Row 4.3 - Murder */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          4.3 กรณีถูกฆาตกรรม หรือถูกทำร้ายร่างกาย
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">
                            {formatCurrency(plan.life.murderAssault)}
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <div className="font-black text-[#00509d] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.lifeMurder)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Row 4.4 - Funeral Benefit */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          4.4 ค่าปลงศพหรือจัดการงานศพ กรณีเสียชีวิตจากการเจ็บป่วย
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          (ระยะเวลารอคอย 180 วัน)
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          {plan.category === 'pa' ? (
                            <div>
                              <div className="text-slate-400 font-medium text-xs">-</div>
                              <div className="text-[10px] text-slate-400">ไม่มีค่าปลงศพ</div>
                            </div>
                          ) : (
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              {formatCurrency(plan.life.funeralBenefit)}
                            </div>
                          )}
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <div className="font-black text-[#00509d] text-xs sm:text-sm">
                            {formatCurrency(combinedTotals.lifeFuneral)}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* ============================================================== */}
                    {/* SECTION 5: สิทธิประโยชน์พิเศษ และ ค่าชดเชยรายวัน */}
                    {/* ============================================================== */}
                    <tr className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white font-bold border-y border-sky-400/60 shadow-xs">
                      <td colSpan={totalColumnsCount} className="py-2.5 px-3 sm:px-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-white shrink-0 drop-shadow-2xs" />
                          <span className="drop-shadow-2xs">ส่วนที่ 5 : สิทธิประโยชน์พิเศษ และ ค่าชดเชยรายวัน</span>
                        </div>
                      </td>
                    </tr>

                    {/* Row 5.1 - Daily Compensation */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          5.1 เงินชดเชยรายวันระหว่างรักษาตัวในโรงพยาบาล (IPD) สูงสุด 365 วัน
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          {plan.dailyCompensation.perNight > 0 ? (
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">
                              {formatCurrency(plan.dailyCompensation.perNight)}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">- ไม่มีสิทธิ์ -</span>
                          )}
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          {combinedTotals.dailyComp > 0 ? (
                            <div className="font-black text-[#00509d] text-xs sm:text-sm">
                              {formatCurrency(combinedTotals.dailyComp)}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>
                      )}
                    </tr>

                    {/* Row 5.2 - Cashless Card */}
                    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 sm:px-4 text-xs border-r border-slate-100 pl-5 sm:pl-6">
                        <div className="text-slate-800 font-medium">
                          5.3 บริการประสานงานสินไหมและเครือข่ายโรงพยาบาล (Cashless Card)
                        </div>
                      </td>
                      {selectedPlans.map((plan) => (
                        <td key={plan.id} className="py-2 px-3 sm:px-4 text-center border-r border-slate-100">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            ใช้สิทธิ์ได้ไม่ต้องสำรองจ่าย
                          </span>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8]">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            บัตรเดียวครอบคลุมทุกแผน
                          </span>
                        </td>
                      )}
                    </tr>
                  </tbody>

                  {/* Table Footer: สอดคล้องกับ ComparisonTable */}
                  <tfoot>
                    {/* หัวแถว: เบี้ยประกันภัย */}
                    <tr className="bg-gradient-to-r from-sky-800 via-sky-700 to-blue-800 text-white border-t-2 border-sky-400">
                      <td
                        colSpan={totalColumnsCount}
                        className="py-2.5 px-3 sm:px-4 font-bold text-xs tracking-wide text-white"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-sky-200" />
                          <span>เบี้ยประกันภัย (ชำระรายเดือน / ชำระรายปี)</span>
                        </div>
                      </td>
                    </tr>

                    {/* แถวที่ 1: รายเดือน */}
                    <tr className="bg-white border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 sm:px-4 text-xs border-r border-slate-100 font-bold text-slate-800">
                        รายเดือน
                      </td>
                      {selectedPlans.map((plan) => (
                        <td
                          key={plan.id}
                          className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-100 align-middle"
                        >
                          <div className="text-sm font-extrabold text-[#00509d]">
                            {formatCurrency(plan.monthlyPremium)}{' '}
                            <span className="text-xs font-normal text-slate-500">บาท/เดือน</span>
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8] align-middle">
                          <div className="text-sm font-extrabold text-[#00509d]">
                            {formatCurrency(combinedTotals.monthlyPremium)}{' '}
                            <span className="text-xs font-normal text-slate-500">บาท/เดือน</span>
                          </div>
                          {existingCustomer && combinedTotals.addedMonthly > 0 && (
                            <div className="text-[10px] font-bold text-sky-800 mt-0.5">
                              (เพิ่ม +{formatCurrency(combinedTotals.addedMonthly)} บาท/เดือน)
                            </div>
                          )}
                        </td>
                      )}
                    </tr>

                    {/* แถวที่ 2: รายปี */}
                    <tr className="bg-white border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 sm:px-4 text-xs border-r border-slate-100 font-bold text-slate-800">
                        รายปี
                      </td>
                      {selectedPlans.map((plan) => (
                        <td
                          key={plan.id}
                          className="py-2.5 px-3 sm:px-4 text-center border-r border-slate-100 align-middle"
                        >
                          <div className="text-sm font-extrabold text-[#00509d]">
                            {formatCurrency(plan.annualPremium)}{' '}
                            <span className="text-xs font-normal text-slate-500">บาท/ปี</span>
                          </div>
                        </td>
                      ))}
                      {combinedTotals && (
                        <td className="py-2.5 px-3 sm:px-4 text-center bg-[#f0f7fd] border-l-2 border-[#b9ddf8] align-middle">
                          <div className="text-sm font-extrabold text-[#00509d]">
                            {formatCurrency(combinedTotals.annualPremium)}{' '}
                            <span className="text-xs font-normal text-slate-500">บาท/ปี</span>
                          </div>
                        </td>
                      )}
                    </tr>
                  </tfoot>
                </table>
            </div>

            {/* Terms and Exceptions Component */}
            <div className="pt-2">
              <PolicyTermsNotice
                coordinatorName={exportMeta.coordinatorName}
                coordinatorPhone={exportMeta.coordinatorPhone}
                className="bg-white/95 backdrop-blur-2xs border-sky-200/80 shadow-xs"
              />
            </div>

            {/* Official Siam Smile Template Footer */}
            {useTemplateBg && (
              <div className="pt-3 pb-1 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-sky-100">
                <div className="flex flex-col items-start text-left gap-0.5">
                  <span className="font-medium text-slate-600">บริษัท สยามสไมล์โบรกเกอร์ (ประเทศไทย) จำกัด</span>
                  <span className="text-sky-800 font-semibold">ศูนย์บริการลูกค้าสัมพันธ์ สยามสไมล์ โทร. 1434 • www.siamsmile.co.th</span>
                </div>
                <div className="text-left sm:text-right text-[11px] text-slate-600 space-y-0.5 shrink-0">
                  <div className="flex sm:justify-end items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>วันที่จัดทำ: {exportMeta.date}</span>
                  </div>
                  <div className="text-slate-800 font-semibold flex sm:justify-end items-center gap-1 text-[11px]">
                    <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>ผู้แทน: <strong className="text-blue-950 font-bold">{agentDisplayName}</strong></span>
                  </div>
                  <div className="text-[10px] text-slate-600 flex sm:justify-end items-center gap-1">
                    <Phone className="w-3 h-3 text-sky-600 shrink-0" />
                    <span>เบอร์โทรศัพท์: <strong className="font-mono text-slate-800">{exportMeta.agentPhone || '-'}</strong></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
