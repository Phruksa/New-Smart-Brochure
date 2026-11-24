import React from 'react';
import {
  X,
  FileText,
  Printer,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';
import { InsuranceDocumentItem } from '../data/insuranceDocuments';

interface InsuranceDocumentModalProps {
  document: InsuranceDocumentItem | null;
  onClose: () => void;
  onGoToQuoting?: (category: 'health' | 'motor' | 'premium-code', subType?: string) => void;
  onShowToast?: (msg: string) => void;
}

export const InsuranceDocumentModal: React.FC<InsuranceDocumentModalProps> = ({
  document,
  onClose,
  onGoToQuoting,
  onShowToast,
}) => {
  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    onShowToast?.(`ดาวน์โหลด ${document.title} เรียบร้อยแล้ว 📥`);
  };

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: `เอกสารแผนประกันภัย ${document.title} - สยามสไมล์ โบรกเกอร์`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        onShowToast?.(`แชร์ ${document.title} เรียบร้อยแล้ว`);
      } catch (err) {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${document.title}\nดูเอกสารแผนประกันภัย สยามสไมล์: ${window.location.href}`
        );
        onShowToast?.(`คัดลอกลิงก์แชร์ "${document.title}" เรียบร้อยแล้ว 📋`);
      } catch (err) {
        onShowToast?.(`แชร์เอกสาร: ${document.title}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#003e7a] to-[#00509d] text-white flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-sky-100">
                {document.categoryLabel}
              </span>
              <span className="text-[11px] font-medium text-sky-200">
                {document.docTypeLabel} ({document.fileFormat})
              </span>
              <span className="text-[11px] text-sky-300">
                • {document.updatedDate}
              </span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base md:text-lg text-white mt-0.5 truncate" title={document.title}>
              {document.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="ปิดหน้าต่าง"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 text-slate-800 text-xs sm:text-sm">
          {/* Top Info Banner */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  {document.subtitle}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  บริษัทผู้รับประกัน / ผู้ให้บริการ: <strong className="text-slate-700">{document.underwriter}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <div className="bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg text-right">
                  <div className="text-[10px] text-sky-700 font-bold">อัตราเบี้ยเริ่มต้น</div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#00509d]">
                    {document.premiumStartingText}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {document.description}
            </p>
          </div>

          {/* If there is an official image brochure (e.g. Motor Class 1, Motor 2+, Conditions) */}
          {document.imagePath ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>ตัวอย่างเอกสารแผ่นพับโบรชัวร์ทางการ</span>
                </span>
                <a
                  href={document.imagePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>เปิดรูปขนาดเต็ม</span>
                </a>
              </div>
              <div className="bg-slate-900/5 rounded-xl p-2 sm:p-3 border border-slate-200 flex items-center justify-center max-h-[60vh] overflow-y-auto">
                <img
                  src={document.imagePath}
                  alt={document.title}
                  className="max-h-[56vh] w-auto object-contain rounded-lg shadow-sm border border-slate-200"
                />
              </div>
            </div>
          ) : (
            /* Structured Coverage Table / Sheet */
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00509d] border-b border-slate-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>สรุปผลประโยชน์และความคุ้มครองสำคัญตามเอกสาร</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {document.keyHighlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 font-medium leading-relaxed">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>

              {/* Policy notes */}
              <div className="mt-3 p-3 rounded-lg bg-sky-50/70 border border-sky-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-sky-950 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>ข้อมูลเพิ่มเติมและการรับประกัน</span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-slate-600">
                  • <strong>วงเงินความคุ้มครอง:</strong> {document.sumInsuredText}
                  <br />
                  • <strong>การแบ่งชำระ:</strong> รองรับการหักชำระรายเดือนผ่านบัญชีเงินเดือน หรือชำระรายปี
                  <br />
                  • <strong>ช่องทางติดต่อ:</strong> บริษัท สยามสไมล์ โบรกเกอร์ (ประเทศไทย) จำกัด โทร. 1434 (ตลอด 24 ชั่วโมง)
                </p>
              </div>
            </div>
          )}

          {/* Highlights checklist if image was shown */}
          {document.imagePath && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
              <div className="text-xs font-bold text-slate-800">
                จุดเด่นความคุ้มครองที่ระบุในเอกสาร:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {document.keyHighlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-4 sm:px-6 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto"
              title="พิมพ์เอกสารนี้"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>พิมพ์เอกสาร</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto"
              title="บันทึกเอกสาร"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>บันทึกไฟล์</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto"
              title="แชร์เอกสารนี้"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-600" />
              <span>แชร์เอกสาร</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              ปิด
            </button>

            {document.targetQuotingAction && onGoToQuoting && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToQuoting(
                    document.targetQuotingAction!.category,
                    document.targetQuotingAction!.subType
                  );
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00509d] to-[#0088cc] hover:from-[#003e7a] hover:to-[#0077b6] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{document.targetQuotingAction.buttonLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
