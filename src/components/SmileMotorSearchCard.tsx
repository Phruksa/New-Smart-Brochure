import React, { useState } from 'react';
import {
  Car,
  Search,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import {
  CAR_BRANDS_DATA,
  POPULAR_YEARS,
  VEHICLE_TYPE_OPTIONS,
  USAGE_TYPE_OPTIONS,
  CAR_CODE_OPTIONS,
  calculateEstimatedCarPrice,
  SmileMotorPlan,
  generateSmileMotorPlans,
} from '../data/motorData';

export interface MotorSearchParams {
  brand: string;
  model: string;
  year: number;
  vehicleType: string;
  usageType: string;
  carCode: string;
  subModel: string;
  marketPrice: number;
  repairPreference: 'garage' | 'dealer';
  hasDashcam: boolean;
  includeCmi: boolean;
}

interface SmileMotorSearchCardProps {
  onSearch: (params: MotorSearchParams, plans: SmileMotorPlan[]) => void;
  onReset: () => void;
  onSwitchToHealth: () => void;
  initialParams?: Partial<MotorSearchParams>;
}

export const SmileMotorSearchCard: React.FC<SmileMotorSearchCardProps> = ({
  onSearch,
  onReset,
  onSwitchToHealth,
  initialParams,
}) => {
  // Brand selection - default to ISUZU matching user's requested specification
  const brandList = Object.keys(CAR_BRANDS_DATA);
  const [selectedBrand, setSelectedBrand] = useState<string>(
    initialParams?.brand || (brandList.includes('ISUZU') ? 'ISUZU' : brandList[0] || 'TOYOTA')
  );

  // Model selection
  const availableModels = CAR_BRANDS_DATA[selectedBrand]
    ? Object.keys(CAR_BRANDS_DATA[selectedBrand].models)
    : [];
  const [selectedModel, setSelectedModel] = useState<string>(
    initialParams?.model && availableModels.includes(initialParams.model)
      ? initialParams.model
      : availableModels.includes('D-MAX')
      ? 'D-MAX'
      : availableModels[0] || 'Yaris Ativ'
  );

  // Year selection
  const [selectedYear, setSelectedYear] = useState<number>(initialParams?.year || 2024);

  // Sub-model selection
  const currentModelInfo = CAR_BRANDS_DATA[selectedBrand]?.models[selectedModel];
  const availableSubModels = currentModelInfo?.subModels || [];
  const [selectedSubModel, setSelectedSubModel] = useState<string>(
    initialParams?.subModel && availableSubModels.includes(initialParams.subModel)
      ? initialParams.subModel
      : availableSubModels.includes('D-MAX 4DR. 1900CC')
      ? 'D-MAX 4DR. 1900CC'
      : availableSubModels[0] || 'รุ่นมาตรฐาน'
  );

  // Auto-defaulted vehicle specifications:
  // ประเภทรถยนต์, ประเภทการใช้งาน, รหัสรถยนต์
  const [vehicleType, setVehicleType] = useState<string>(
    initialParams?.vehicleType || currentModelInfo?.defaultVehicleType || VEHICLE_TYPE_OPTIONS[0]
  );
  const [usageType, setUsageType] = useState<string>(
    initialParams?.usageType || currentModelInfo?.defaultUsageType || USAGE_TYPE_OPTIONS[0]
  );
  const [carCode, setCarCode] = useState<string>(
    initialParams?.carCode || currentModelInfo?.defaultCarCode || '110'
  );

  // Car price at insurance date (ราคารถยนต์ ณ วันที่ทำประกัน)
  const [marketPrice, setMarketPrice] = useState<number>(() =>
    initialParams?.marketPrice || calculateEstimatedCarPrice(selectedBrand, selectedModel, selectedYear, selectedSubModel)
  );

  // Additional options
  const [repairPreference, setRepairPreference] = useState<'garage' | 'dealer'>(
    initialParams?.repairPreference || 'garage'
  );
  const [hasDashcam, setHasDashcam] = useState<boolean>(initialParams?.hasDashcam ?? true);
  const [includeCmi, setIncludeCmi] = useState<boolean>(initialParams?.includeCmi ?? true);

  // Effect: When Brand changes, adjust Model and submodel and re-run auto-defaults
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const models = Object.keys(CAR_BRANDS_DATA[brand]?.models || {});
    const newModel = models[0] || '';
    setSelectedModel(newModel);

    const modelInfo = CAR_BRANDS_DATA[brand]?.models[newModel];
    if (modelInfo) {
      const sub = modelInfo.subModels[0] || '';
      setSelectedSubModel(sub);
      // Auto-default ประเภทรถยนต์ ประเภทการใช้งาน รหัสรถยนต์
      setVehicleType(modelInfo.defaultVehicleType);
      setUsageType(modelInfo.defaultUsageType);
      setCarCode(modelInfo.defaultCarCode);

      const estimated = calculateEstimatedCarPrice(brand, newModel, selectedYear, sub);
      setMarketPrice(estimated);
    }
  };

  // Effect: When Model changes, update submodel and auto-default classification
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    const modelInfo = CAR_BRANDS_DATA[selectedBrand]?.models[model];
    if (modelInfo) {
      const sub = modelInfo.subModels[0] || '';
      setSelectedSubModel(sub);
      // Auto-default ประเภทรถยนต์ ประเภทการใช้งาน รหัสรถยนต์
      setVehicleType(modelInfo.defaultVehicleType);
      setUsageType(modelInfo.defaultUsageType);
      setCarCode(modelInfo.defaultCarCode);

      const estimated = calculateEstimatedCarPrice(selectedBrand, model, selectedYear, sub);
      setMarketPrice(estimated);
    }
  };

  // Effect: When Year changes, recalculate estimated car price
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const estimated = calculateEstimatedCarPrice(selectedBrand, selectedModel, year, selectedSubModel);
    setMarketPrice(estimated);
  };

  // Handle Search submit
  const handleSearchClick = () => {
    const params: MotorSearchParams = {
      brand: selectedBrand,
      model: selectedModel,
      year: selectedYear,
      vehicleType,
      usageType,
      carCode,
      subModel: selectedSubModel,
      marketPrice,
      repairPreference,
      hasDashcam,
      includeCmi,
    };
    const plans = generateSmileMotorPlans(
      selectedBrand,
      selectedModel,
      selectedYear,
      carCode,
      marketPrice,
      repairPreference,
      hasDashcam
    );
    onSearch(params, plans);
  };

  // Handle Reset
  const handleResetForm = () => {
    const defaultBrand = 'ISUZU';
    const defaultModel = 'D-MAX';
    const defaultYear = 2024;
    const defaultSub = 'D-MAX 4DR. 1900CC';

    setSelectedBrand(defaultBrand);
    setSelectedModel(defaultModel);
    setSelectedYear(defaultYear);
    setSelectedSubModel(defaultSub);

    const info = CAR_BRANDS_DATA[defaultBrand]?.models[defaultModel];
    setVehicleType(info?.defaultVehicleType || 'รถยนต์นั่งส่วนบุคคลไม่เกิน 7 คน');
    setUsageType(info?.defaultUsageType || 'รถยนต์นั่งส่วนบุคคล');
    setCarCode(info?.defaultCarCode || '110');
    setMarketPrice(580000);
    setRepairPreference('garage');
    setHasDashcam(true);
    setIncludeCmi(true);
    onReset();
  };

  // Clean short car code display (e.g. "110" or "320")
  const displayCarCode = carCode.includes('110')
    ? '110'
    : carCode.includes('320')
    ? '320'
    : carCode;

  return (
    <div className="w-full">
      {/* Outer light blue container - sleek & compact */}
      <div className="bg-[#ebf4fa] rounded-xl p-3 sm:p-4 md:p-5 border border-[#d6e7f5]">
        {/* Section title & Category toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00509d] text-white flex items-center justify-center shadow-xs">
              <Car className="w-4 h-4 text-sky-200" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-sm sm:text-base leading-tight">
                เช็คราคาประกันรถยนต์
              </h2>
            </div>
          </div>

          {/* Toggle between Health & Motor check */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-sky-200/80 shadow-2xs text-xs font-bold">
            <button
              type="button"
              onClick={onSwitchToHealth}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>เช็คราคาประกันสุขภาพ</span>
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg bg-[#00509d] text-white shadow-xs flex items-center gap-1.5 font-extrabold"
            >
              <Car className="w-3.5 h-3.5 text-sky-200" />
              <span>เช็คราคาประกันรถยนต์</span>
            </button>
          </div>
        </div>

        {/* Inner white card - styled cleanly with identical look & feel to Health insurance card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-3.5 sm:p-5 max-w-3xl mx-auto">
          {/* Card sub-header */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              กรอกข้อมูลเพื่อค้นหาแผนประกัน
            </h3>
          </div>

          {/* Input Fields Grid matching the screenshot exact layout */}
          <div className="space-y-3.5 sm:space-y-4">
            {/* ROW 1: ยี่ห้อรถยนต์ | รุ่นรถยนต์ | ปีที่ผลิตรถยนต์ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
              {/* ยี่ห้อรถยนต์ */}
              <div className="relative border border-slate-300 rounded-md bg-white focus-within:border-[#0088cc] focus-within:ring-1 focus-within:ring-[#0088cc] transition-all">
                <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] text-slate-500 font-normal leading-none pointer-events-none select-none">
                  ยี่ห้อรถยนต์
                </label>
                <div className="relative flex items-center">
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-[13px] text-slate-800 font-normal py-2 px-2.5 pr-7 focus:outline-none appearance-none cursor-pointer"
                  >
                    {brandList.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* รุ่นรถยนต์ */}
              <div className="relative border border-slate-300 rounded-md bg-white focus-within:border-[#0088cc] focus-within:ring-1 focus-within:ring-[#0088cc] transition-all">
                <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] text-slate-500 font-normal leading-none pointer-events-none select-none">
                  รุ่นรถยนต์
                </label>
                <div className="relative flex items-center">
                  <select
                    value={selectedModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-[13px] text-slate-800 font-normal py-2 px-2.5 pr-7 focus:outline-none appearance-none cursor-pointer"
                  >
                    {availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* ปีที่ผลิตรถยนต์ */}
              <div className="relative border border-slate-300 rounded-md bg-white focus-within:border-[#0088cc] focus-within:ring-1 focus-within:ring-[#0088cc] transition-all">
                <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] text-slate-500 font-normal leading-none pointer-events-none select-none">
                  ปีที่ผลิตรถยนต์
                </label>
                <div className="relative flex items-center">
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
                    className="w-full bg-transparent text-xs sm:text-[13px] text-slate-800 font-normal py-2 px-2.5 pr-7 focus:outline-none appearance-none cursor-pointer"
                  >
                    {POPULAR_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* ROW 2: ประเภทรถยนต์ | ประเภทการใช้งาน | รหัสรถยนต์ : 110 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 items-center">
              {/* ประเภทรถยนต์ */}
              <div className="relative border border-slate-300 rounded-md bg-white focus-within:border-[#0088cc] focus-within:ring-1 focus-within:ring-[#0088cc] transition-all">
                <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] text-slate-500 font-normal leading-none pointer-events-none select-none">
                  ประเภทรถยนต์
                </label>
                <div className="relative flex items-center">
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-[13px] text-slate-800 font-normal py-2 px-2.5 pr-7 focus:outline-none appearance-none cursor-pointer truncate"
                  >
                    {VEHICLE_TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* ประเภทการใช้งาน */}
              <div className="relative border border-slate-300 rounded-md bg-white focus-within:border-[#0088cc] focus-within:ring-1 focus-within:ring-[#0088cc] transition-all">
                <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] text-slate-500 font-normal leading-none pointer-events-none select-none">
                  ประเภทการใช้งาน
                </label>
                <div className="relative flex items-center">
                  <select
                    value={usageType}
                    onChange={(e) => setUsageType(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-[13px] text-slate-800 font-normal py-2 px-2.5 pr-7 focus:outline-none appearance-none cursor-pointer truncate"
                  >
                    {USAGE_TYPE_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* รหัสรถยนต์ : 110 */}
              <div className="py-2 px-1 text-slate-600 text-xs sm:text-[13px] font-normal flex items-center">
                <span>
                  รหัสรถยนต์ : <span className="text-slate-800 font-medium">{displayCarCode}</span>
                </span>
              </div>
            </div>

            {/* ROW 3: รุ่นย่อยรถยนต์ (spans 2 cols) | ราคารถยนต์ ณ วันที่ทำประกัน : 580,000.00 บาท */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 items-center">
              {/* รุ่นย่อยรถยนต์ */}
              <div className="sm:col-span-2 relative border border-slate-300 rounded-md bg-white focus-within:border-[#0088cc] focus-within:ring-1 focus-within:ring-[#0088cc] transition-all">
                <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] text-slate-500 font-normal leading-none pointer-events-none select-none">
                  รุ่นย่อยรถยนต์
                </label>
                <div className="relative flex items-center">
                  <select
                    value={selectedSubModel}
                    onChange={(e) => {
                      setSelectedSubModel(e.target.value);
                      const estimated = calculateEstimatedCarPrice(
                        selectedBrand,
                        selectedModel,
                        selectedYear,
                        e.target.value
                      );
                      setMarketPrice(estimated);
                    }}
                    className="w-full bg-transparent text-xs sm:text-[13px] text-slate-800 font-normal py-2 px-2.5 pr-7 focus:outline-none appearance-none cursor-pointer truncate"
                  >
                    {availableSubModels.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* ราคารถยนต์ ณ วันที่ทำประกัน : 580,000.00 บาท */}
              <div className="py-1 px-1 text-slate-600 text-xs sm:text-[13px] leading-snug">
                <span>
                  ราคารถยนต์ ณ วันที่ทำประกัน :{' '}
                  <span className="text-slate-800 font-medium">
                    {marketPrice.toLocaleString('th-TH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="block sm:inline sm:ml-1 text-slate-600">บาท</span>
                </span>
              </div>
            </div>

            {/* Action Buttons - Compact 2-button grid identical to SmileSaleSearchCard */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full py-2 px-3 rounded-lg border border-[#0088cc] text-[#0088cc] hover:bg-sky-50 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ย้อนกลับ</span>
              </button>

              <button
                type="button"
                onClick={handleSearchClick}
                className="w-full py-2 px-3 rounded-lg bg-[#00509d] hover:bg-[#003e7a] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>ค้นหาแผนประกัน</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
