import React from 'react';
import {
  Menu,
  LayoutGrid,
  ClipboardList,
  Bell,
  User,
  History,
  Settings,
} from 'lucide-react';
import { ExportMeta, CustomerProfile } from '../types';

interface SmileSaleHeaderProps {
  onToggleSidebar: () => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
  onOpenPreview?: () => void;
  onOpenPlanSettings?: () => void;
  onPrint: () => void;
  historyCount: number;
  markedCount: number;
  exportMeta: ExportMeta;
  existingCustomer?: CustomerProfile | null;
  selectedPlansCount?: number;
  currentView?: 'portal' | 'selection' | 'comparison' | 'premium-code';
  insuranceCategory?: 'health' | 'motor';
  onNavigateView?: (view: 'portal' | 'selection' | 'comparison' | 'premium-code') => void;
  onSaveSmartBrochure?: () => void;
}

export const SmileSaleHeader: React.FC<SmileSaleHeaderProps> = ({
  onToggleSidebar,
  onOpenHistory,
  onOpenExport,
  onOpenPreview,
  onOpenPlanSettings,
  onPrint,
  historyCount,
  markedCount,
  exportMeta,
  existingCustomer,
  selectedPlansCount = 0,
  currentView = 'portal',
  insuranceCategory = 'health',
  onNavigateView,
  onSaveSmartBrochure,
}) => {
  const agentDisplayName = exportMeta.agentFirstName
    ? `${exportMeta.agentFirstName} (${exportMeta.agentOfficeCode || '05741'})`
    : 'บรรจง (05741)';

  const getHeaderTitle = () => {
    if (currentView === 'portal') return 'หน้าทางเข้าหลัก • เช็คราคาและเอกสารประกันภัย';
    if (currentView === 'premium-code') return 'ระบบโค๊ดเบี้ยประกันภัย';
    if (currentView === 'comparison') return 'ตารางเปรียบเทียบผลประโยชน์';
    return insuranceCategory === 'motor' ? 'เช็คราคาประกันรถยนต์ (Smile Motor)' : 'เช็คราคาประกันสุขภาพ (Smile Health)';
  };

  return (
    <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200 shadow-2xs">
      <div className="px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Hamburger & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="เปิด/ปิดเมนูแถบข้าง"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm sm:text-base md:text-lg font-extrabold text-[#00509d] tracking-tight">
              {getHeaderTitle()}
            </h1>

            {/* Quick Navigation to Portal */}
            {currentView !== 'portal' && (
              <button
                type="button"
                onClick={() => onNavigateView?.('portal')}
                className="text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#00509d] font-bold px-2 py-0.5 rounded-md border border-slate-200 transition-colors cursor-pointer"
                title="กลับไปหน้าทางเข้าหลัก"
              >
                ← หน้าทางเข้า
              </button>
            )}

            {currentView === 'premium-code' ? (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300 hidden sm:inline-block">
                ชีวิต • บ้าน • เดินทาง
              </span>
            ) : currentView !== 'portal' ? (
              <button
                type="button"
                onClick={() => onNavigateView?.('premium-code')}
                className="text-[11px] bg-blue-50 hover:bg-blue-100 text-[#00509d] font-bold px-2.5 py-0.5 rounded-lg border border-blue-200 transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer"
                title="เปิดระบบคำนวณโค๊ดเบี้ยประกัน"
              >
                <span>โค๊ดเบี้ยประกัน</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Grid App Launcher */}
          <button
            type="button"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="เมนูระบบแอปพลิเคชัน"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>

          {/* History / Clipboard Tasks */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="ประวัติการบันทึกเอกสารเปรียบเทียบ"
          >
            <ClipboardList className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
            {markedCount > 0 && (
              <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="การแจ้งเตือน"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          {/* User Profile Badge (Orange/Gold badge as in screenshot) */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center font-bold text-xs shadow-2xs border-2 border-white ring-1 ring-amber-300">
              <span className="text-[10px]">สยาม</span>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-800">
              {agentDisplayName}
            </span>
          </div>
        </div>
      </div>

      {/* Subheader / Breadcrumb */}
      <div className="px-4 sm:px-6 py-1.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentView === 'portal' ? (
            <span className="font-semibold text-slate-700">หน้าทางเข้าหลัก (Portal)</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onNavigateView?.('portal')}
                className="hover:text-blue-600 hover:underline cursor-pointer font-medium text-slate-600"
              >
                หน้าทางเข้า
              </button>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-800">
                {currentView === 'premium-code'
                  ? 'โค๊ดเบี้ยประกัน'
                  : currentView === 'comparison'
                  ? 'เปรียบเทียบแผน'
                  : insuranceCategory === 'motor'
                  ? 'เช็คราคาประกันรถยนต์'
                  : 'เช็คราคาประกันสุขภาพ'}
              </span>
            </div>
          )}

          {existingCustomer && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
              ลูกค้าเดิม: คุณ{existingCustomer.fullName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden sm:inline">บริษัท สยามสไมล์ โบรกเกอร์ (ประเทศไทย) จำกัด</span>
        </div>
      </div>
    </header>
  );
};
