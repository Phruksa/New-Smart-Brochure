import React, { useState } from 'react';
import {
  HeartHandshake,
  Car,
  FileText,
  Search,
  ArrowRight,
  Sparkles,
  Eye,
  Share2,
} from 'lucide-react';
import {
  INSURANCE_DOCUMENTS,
  DOCUMENT_CATEGORIES,
  InsuranceDocumentItem,
} from '../data/insuranceDocuments';
import { InsuranceDocumentModal } from './InsuranceDocumentModal';

interface InsurancePortalViewProps {
  onSelectCategory: (category: 'health' | 'motor') => void;
  onGoToPremiumCode?: (type?: string) => void;
  onShowToast?: (msg: string) => void;
}

export const InsurancePortalView: React.FC<InsurancePortalViewProps> = ({
  onSelectCategory,
  onGoToPremiumCode,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('health');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalDocument, setActiveModalDocument] = useState<InsuranceDocumentItem | null>(null);

  // Quick Price Check Buttons list (ปรับให้เล็กลง เป็นปุ่มกะทัดรัด และรองรับการเพิ่มแผนประกันอื่นในอนาคต)
  const priceCheckButtons = [
    {
      id: 'health',
      title: 'เช็คราคาประกันสุขภาพ',
      shortLabel: 'ประกันสุขภาพ',
      icon: HeartHandshake,
      iconColor: 'text-[#00509d] bg-sky-50 border-sky-100',
      hoverBorder: 'hover:border-[#00509d]',
      onClick: () => onSelectCategory('health'),
    },
    {
      id: 'motor',
      title: 'เช็คราคาประกันรถยนต์',
      shortLabel: 'ประกันรถยนต์',
      icon: Car,
      iconColor: 'text-[#0088cc] bg-blue-50 border-blue-100',
      hoverBorder: 'hover:border-[#0088cc]',
      onClick: () => onSelectCategory('motor'),
    },
  ];

  // Filter documents based on product category and search
  const filteredDocuments = INSURANCE_DOCUMENTS.filter((doc) => {
    const matchesCategory = doc.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDocumentClick = (doc: InsuranceDocumentItem) => {
    setActiveModalDocument(doc);
  };

  // Handle Share document (Native share or copy to clipboard)
  const handleShareDocument = async (doc: InsuranceDocumentItem) => {
    const shareData = {
      title: doc.title,
      text: `เอกสารแผนประกันภัย ${doc.title} - สยามสไมล์ โบรกเกอร์`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        onShowToast?.(`แชร์ ${doc.title} เรียบร้อยแล้ว`);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${doc.title}\nดูเอกสารแผนประกันภัย สยามสไมล์: ${window.location.href}`
        );
        onShowToast?.(`คัดลอกลิงก์แชร์ "${doc.title}" เรียบร้อยแล้ว 📋`);
      } catch (err) {
        onShowToast?.(`แชร์เอกสาร: ${doc.title}`);
      }
    }
  };

  const handleQuotingRedirect = (
    category: 'health' | 'motor' | 'premium-code',
    subType?: string
  ) => {
    if (category === 'health' || category === 'motor') {
      onSelectCategory(category);
    } else if (category === 'premium-code' && onGoToPremiumCode) {
      onGoToPremiumCode(subType);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-200 pb-8">
      {/* 1. Portal Hero Header */}
      <section className="text-center pt-2 sm:pt-4 max-w-4xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Siam Smile Insurance Portal • ศูนย์บริการและเช็คราคาประกันภัย</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          ยินดีต้อนรับสู่ <span className="text-[#00509d]">ระบบเช็คราคา</span> และ{' '}
          <span className="text-[#0088cc]">เอกสารแผนประกันภัย</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          เลือกเช็คราคาเบี้ยประกันทันใจ หรือเลือกเปิดดูและแชร์เอกสารโบรชัวร์แผนประกันทุกหมวดหมู่
        </p>

        <div className="border-b border-dotted border-[#9dc4e8] w-full max-w-2xl mx-auto pt-2" />
      </section>

      {/* 2. SECTION 1: ปุ่มเช็คราคา (ปรับให้เล็กลง เหลือแค่ปุ่ม และรองรับการเพิ่มแผนประกันในอนาคต) */}
      <section aria-labelledby="price-check-heading" className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
          <h2 id="price-check-heading" className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0088cc]" />
            <span>เลือกเช็คราคาประกันภัย</span>
          </h2>
          <span className="text-[11px] text-slate-400">
            (คลิกเพื่อคำนวณเบี้ยทันที)
          </span>
        </div>

        {/* Compact Scalable Price Check Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {priceCheckButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={btn.onClick}
                className={`p-3 rounded-xl border border-slate-200/90 bg-white ${btn.hoverBorder} hover:shadow-xs hover:bg-slate-50/80 transition-all text-left flex items-center justify-between gap-2.5 cursor-pointer shadow-2xs group active:scale-[0.98]`}
                title={btn.title}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg ${btn.iconColor} border flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-800 group-hover:text-slate-900 block truncate">
                      {btn.title}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. SECTION 2: เอกสารและโบรชัวร์แผนประกัน (แสดงแค่ชื่อแผน และปุ่มดูเอกสาร แชร์เอกสาร) */}
      <section aria-labelledby="documents-library-heading" className="space-y-3.5 pt-2">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-200/80 pb-2.5">
          <div>
            <h2 id="documents-library-heading" className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00509d]" />
              <span>เอกสารและโบรชัวร์แผนประกันภัย</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              เลือกตามผลิตภัณฑ์เพื่อดูเอกสารหรือแชร์ข้อมูลให้ลูกค้า
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อแผนประกัน..."
              className="w-full px-3 py-1.5 pl-8 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#0088cc] focus:ring-1 focus:ring-[#0088cc] bg-white text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Product Category Tabs (เลือกตามผลิตภัณฑ์โดยตรง ไม่มี 'ทั้งหมด') */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          {DOCUMENT_CATEGORIES.map((cat) => {
            const count = INSURANCE_DOCUMENTS.filter((d) => d.category === cat.id).length;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#00509d] text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Document Cards Grid - แสดงแค่ชื่อแผน และปุ่มดูเอกสาร แชร์เอกสาร */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all p-3.5 sm:p-4 flex flex-col justify-between gap-3 text-left"
            >
              {/* ชื่อแผนประกันเท่านั้น */}
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2" title={doc.title}>
                    {doc.title}
                  </h3>
                </div>
              </div>

              {/* ปุ่มดูเอกสาร และ แชร์เอกสาร */}
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDocumentClick(doc)}
                  className="py-1.5 px-2.5 rounded-lg bg-[#00509d] hover:bg-[#003e7a] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-[0.98]"
                  title="เปิดดูเอกสาร"
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span>ดูเอกสาร</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareDocument(doc)}
                  className="py-1.5 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98]"
                  title="แชร์เอกสารนี้"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>แชร์เอกสาร</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-xs sm:text-sm">ไม่พบเอกสารในหมวดนี้</h3>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('health');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              แสดงเอกสารประกันสุขภาพ
            </button>
          </div>
        )}
      </section>

      {/* Document Viewer Modal */}
      {activeModalDocument && (
        <InsuranceDocumentModal
          document={activeModalDocument}
          onClose={() => setActiveModalDocument(null)}
          onGoToQuoting={handleQuotingRedirect}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
