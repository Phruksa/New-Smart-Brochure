import React, { useState, useEffect } from 'react';
import {
  Car,
  Search,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { CustomerProfile, CustomerSearchField } from '../types';
import { searchExistingCustomers } from '../data/customers';
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
  existingCustomer?: CustomerProfile | null;
  onSelectCustomer?: (customer: CustomerProfile | null) => void;
}

export const SmileMotorSearchCard: React.FC<SmileMotorSearchCardProps> = ({
  onSearch,
  onReset,
  onSwitchToHealth,
  initialParams,
  existingCustomer = null,
  onSelectCustomer,
}) => {
  // Mode selection: 'vehicle' (เลือกรุ่นรถ) | 'customer' (ลูกค้าเดิม)
  const [mode, setMode] = useState<'vehicle' | 'customer'>(
    existingCustomer ? 'customer' : 'vehicle'
  );
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [customerSearchField, setCustomerSearchField] = useState<CustomerSearchField>('insuredName');
  const [foundCustomer, setFoundCustomer] = useState<CustomerProfile | null>(existingCustomer);
  const [matchedCustomers, setMatchedCustomers] = useState<CustomerProfile[]>([]);
  const [hasCustomerSearched, setHasCustomerSearched] = useState<boolean>(false);

  useEffect(() => {
    if (existingCustomer) {
      setFoundCustomer(existingCustomer);
      setMode('customer');
    }
  }, [existingCustomer]);
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
      hasDashcam,
      true // isSearched = true to trigger vehicle sorting and recommendations
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
    setCustomerSearchQuery('');
    setCustomerSearchField('insuredName');
    setFoundCustomer(null);
    setMatchedCustomers([]);
    setHasCustomerSearched(false);
    onSelectCustomer?.(null);
    onReset();
  };

  // Clean short car code display (e.g. "110" or "320")
  const displayCarCode = carCode.includes('110')
    ? '110'
    : carCode.includes('320')
    ? '320'
    : carCode;

  // Handle customer search / selection for motor
  const handleSelectMotorCustomer = (cust: CustomerProfile) => {
    setFoundCustomer(cust);
    onSelectCustomer?.(cust);

    // Look for their motor policy to auto-populate vehicle fields
    const motorPolicy = cust.policies?.find(
      (p) => p.policyType === 'motor' || p.vehicleDetails || p.customPlanName?.includes('รถ')
    );

    if (motorPolicy?.vehicleDetails) {
      const vDetails = motorPolicy.vehicleDetails;
      let mappedBrand = 'TOYOTA';
      let mappedModel = 'Corolla Cross';
      let mappedYear = 2022;

      if (vDetails.brandModel?.includes('Toyota') || vDetails.brandModel?.includes('TOYOTA')) {
        mappedBrand = 'TOYOTA';
        if (vDetails.brandModel.includes('Corolla Cross')) mappedModel = 'Corolla Cross';
        else if (vDetails.brandModel.includes('Yaris')) mappedModel = 'Yaris Ativ';
        else if (vDetails.brandModel.includes('Camry')) mappedModel = 'Camry';
        else mappedModel = 'Corolla Cross';
      } else if (vDetails.brandModel?.includes('Honda') || vDetails.brandModel?.includes('HONDA')) {
        mappedBrand = 'HONDA';
        if (vDetails.brandModel.includes('City')) mappedModel = 'City';
        else if (vDetails.brandModel.includes('Civic')) mappedModel = 'Civic';
        else if (vDetails.brandModel.includes('CR-V')) mappedModel = 'CR-V';
        else mappedModel = 'City';
      } else if (vDetails.brandModel?.includes('Isuzu') || vDetails.brandModel?.includes('ISUZU')) {
        mappedBrand = 'ISUZU';
        mappedModel = 'D-MAX';
      }

      const yearMatch = vDetails.brandModel?.match(/20\d\d/);
      if (yearMatch) {
        mappedYear = parseInt(yearMatch[0], 10);
      }

      setSelectedBrand(mappedBrand);
      setSelectedModel(mappedModel);
      setSelectedYear(mappedYear);

      const info = CAR_BRANDS_DATA[mappedBrand]?.models[mappedModel];
      if (info) {
        const sub = info.subModels[0] || '';
        setSelectedSubModel(sub);
        setVehicleType(info.defaultVehicleType);
        setUsageType(info.defaultUsageType);
        setCarCode(info.defaultCarCode);
      }

      if (vDetails.sumInsured) {
        setMarketPrice(vDetails.sumInsured);
      } else if (motorPolicy.sumInsured) {
        setMarketPrice(motorPolicy.sumInsured);
      }

      if (vDetails.repairType?.includes('ศูนย์') || vDetails.repairType?.includes('ห้าง')) {
        setRepairPreference('dealer');
      } else {
        setRepairPreference('garage');
      }
    }
  };

  const handleCustomerSearchSubmit = (overrideField?: CustomerSearchField) => {
    const activeField = overrideField ?? customerSearchField;
    const allMatches = searchExistingCustomers(customerSearchQuery, activeField);
    const motorMatches = allMatches.filter((c) =>
      c.policies?.some(
        (p) =>
          p.policyType === 'motor' ||
          p.vehicleDetails ||
          p.customPlanName?.includes('รถ') ||
          p.customPlanName?.includes('พ.ร.บ.')
      )
    );
    const finalMatches = motorMatches.length > 0 ? motorMatches : allMatches;
    setMatchedCustomers(finalMatches);
    setHasCustomerSearched(true);
    if (finalMatches.length === 1) {
      handleSelectMotorCustomer(finalMatches[0]);
    } else {
      setFoundCustomer(null);
      onSelectCustomer?.(null);
    }
  };

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

        {/* Inner white card */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 p-3.5 sm:p-5 max-w-3xl mx-auto">
          {/* Card sub-header with Mode Switch */}
          <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100 flex-wrap">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              {mode === 'customer' ? 'เลือกลูกค้าเดิมเพื่อเช็คเบี้ยประกันรถยนต์' : 'กรอกข้อมูลเพื่อค้นหาแผนประกัน'}
            </h3>

            {/* Mode Selector: ระบุรุ่นรถยนต์ vs ลูกค้าเดิม */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('vehicle')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  mode === 'vehicle'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-blue-600" />
                <span>ระบุรุ่นรถยนต์</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('customer')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  mode === 'customer'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>ลูกค้าเดิม (รถยนต์/พ.ร.บ.)</span>
              </button>
            </div>
          </div>

          {mode === 'customer' ? (
            /* Mode 2: Existing Customer Lookup for Motor & Compulsory */
            <div className="space-y-3.5">
              {/* Search by insured, payer, ID card, passport, or license plate */}
              <div className="flex flex-col sm:flex-row items-stretch gap-1.5">
                <select
                  value={customerSearchField}
                  onChange={(e) => {
                    const nextField = e.target.value as CustomerSearchField;
                    setCustomerSearchField(nextField);
                    if (customerSearchQuery.trim() && hasCustomerSearched) {
                      handleCustomerSearchSubmit(nextField);
                    }
                  }}
                  aria-label="ประเภทข้อมูลที่ใช้ค้นหา"
                  className="sm:w-56 px-2.5 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0088cc] focus:ring-1 focus:ring-[#0088cc] cursor-pointer"
                >
                  <option value="insuredName">ชื่อ-สกุลผู้เอาประกัน</option>
                  <option value="insuredIdOrPassport">เลขบัตรประชาชน/Passport ผู้เอาประกัน</option>
                  <option value="payerName">ชื่อ-สกุลผู้ชำระเบี้ย</option>
                  <option value="payerIdOrPassport">เลขบัตรประชาชน/Passport ผู้ชำระเบี้ย</option>
                  <option value="applicationNumber">เลขที่ Application</option>
                </select>

                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customerSearchQuery}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomerSearchQuery(val);
                      if (!val.trim()) {
                        setHasCustomerSearched(false);
                        setMatchedCustomers([]);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCustomerSearchSubmit();
                      }
                    }}
                    placeholder={
                      customerSearchField === 'insuredName'
                        ? 'กรอกชื่อ-สกุลผู้เอาประกัน...'
                        : customerSearchField === 'insuredIdOrPassport'
                        ? 'กรอกเลขบัตรประชาชน/Passport ผู้เอาประกัน...'
                        : customerSearchField === 'payerName'
                        ? 'กรอกชื่อ-สกุลผู้ชำระเบี้ย...'
                        : customerSearchField === 'payerIdOrPassport'
                        ? 'กรอกเลขบัตรประชาชน/Passport ผู้ชำระเบี้ย...'
                        : 'กรอกเลขที่ Application (เช่น APP-2024-9012)...'
                    }
                    className="w-full px-3 py-2 pr-20 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0088cc] focus:ring-1 focus:ring-[#0088cc] text-xs sm:text-sm text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleCustomerSearchSubmit()}
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#00509d] hover:bg-[#003e7a] text-white rounded-md text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Search className="w-3 h-3" />
                    <span>ค้นหา</span>
                  </button>
                </div>
              </div>

              {/* Multiple matching customers list */}
              {hasCustomerSearched && matchedCustomers.length > 1 && (
                <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200 space-y-2">
                  <div className="text-[11px] font-bold text-[#00509d]">
                    พบข้อมูลลูกค้าที่ตรงกัน {matchedCustomers.length} รายการ (กรุณาเลือก 1 รายการ)
                  </div>
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
                    {matchedCustomers.map((cust) => {
                      const motorPolicies =
                        cust.policies?.filter(
                          (p) =>
                            p.policyType === 'motor' ||
                            p.vehicleDetails ||
                            p.customPlanName?.includes('รถ') ||
                            p.customPlanName?.includes('พ.ร.บ.')
                        ) || [];
                      const primaryMotor = motorPolicies[0];
                      const vDetails = primaryMotor?.vehicleDetails;
                      const custKey = cust.idCard || cust.passportNumber || cust.policyNumber;
                      const foundKey = foundCustomer
                        ? foundCustomer.idCard || foundCustomer.passportNumber || foundCustomer.policyNumber
                        : '';
                      const isSelected = Boolean(foundCustomer && foundKey === custKey);

                      return (
                        <button
                          key={custKey}
                          type="button"
                          onClick={() => handleSelectMotorCustomer(cust)}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-blue-50 border-[#0088cc] ring-1 ring-[#0088cc]'
                              : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate">
                              ผู้เอาประกัน: คุณ{cust.fullName}
                            </div>
                            <div className="text-[11px] text-blue-700 font-semibold truncate mt-0.5">
                              {vDetails
                                ? `🚗 ${vDetails.licensePlate || '-'} • ${vDetails.brandModel || 'รถยนต์ส่วนบุคคล'}`
                                : 'ยังไม่มีข้อมูลรถยนต์ในระบบ'}
                            </div>
                            <div className="text-[10.5px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              {cust.idCard ? (
                                <span>
                                  เลขบัตร: <strong className="text-slate-700">{cust.idCard}</strong>
                                </span>
                              ) : cust.passportNumber ? (
                                <span>
                                  Passport: <strong className="text-slate-700">{cust.passportNumber}</strong>
                                </span>
                              ) : null}
                              {cust.payerName && (
                                <span>
                                  ผู้ชำระเบี้ย:{' '}
                                  <strong className="text-slate-700">
                                    {cust.payerName}
                                    {cust.payerRelation && cust.payerRelation !== 'ตนเอง'
                                      ? ` (${cust.payerRelation})`
                                      : ''}
                                  </strong>
                                </span>
                              )}
                            </div>
                          </div>

                          <span
                            className={`shrink-0 text-[10.5px] px-2 py-0.5 rounded font-semibold ${
                              isSelected
                                ? 'bg-blue-200/80 text-blue-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {motorPolicies.length > 0
                              ? `รถยนต์ ${motorPolicies.length} ฉบับ`
                              : 'ไม่มีกรมธรรม์รถยนต์'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state when no matching customers found */}
              {hasCustomerSearched && matchedCustomers.length === 0 && !foundCustomer && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  {customerSearchQuery.trim()
                    ? `ไม่พบข้อมูลลูกค้าที่ตรงกับ "${customerSearchQuery.trim()}" กรุณาตรวจสอบผู้เอาประกัน ผู้ชำระเบี้ย เลขบัตรประชาชน Passport หรือทะเบียนรถ`
                    : 'กรุณากรอกชื่อผู้เอาประกัน ผู้ชำระเบี้ย เลขบัตรประชาชน Passport หรือทะเบียนรถเพื่อค้นหา'}
                </div>
              )}

              {/* Found Customer Details Box (Motor only) */}
              {foundCustomer && (() => {
                const motorPolicies = foundCustomer.policies?.filter(
                  (p) => p.policyType === 'motor' || p.vehicleDetails || p.customPlanName?.includes('รถ') || p.customPlanName?.includes('พ.ร.บ.')
                ) || [];
                const primaryMotor = motorPolicies[0];
                const vDetails = primaryMotor?.vehicleDetails;

                return (
                  <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs space-y-2">
                    <div className="flex items-center justify-between gap-1 text-blue-900 font-bold text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>ผู้เอาประกัน: คุณ{foundCustomer.fullName}</span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-900 font-bold shadow-2xs">
                        รถยนต์ {motorPolicies.length} ฉบับ
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                      {foundCustomer.idCard ? (
                        <span>
                          เลขบัตร: <strong className="text-slate-800">{foundCustomer.idCard}</strong>
                        </span>
                      ) : foundCustomer.passportNumber ? (
                        <span>
                          Passport: <strong className="text-slate-800">{foundCustomer.passportNumber}</strong>
                        </span>
                      ) : null}
                      {foundCustomer.payerName && (
                        <span>
                          ผู้ชำระเบี้ย:{' '}
                          <strong className="text-slate-800">
                            {foundCustomer.payerName}
                            {foundCustomer.payerRelation && foundCustomer.payerRelation !== 'ตนเอง'
                              ? ` (${foundCustomer.payerRelation})`
                              : ''}
                          </strong>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1 border-t border-blue-100 text-xs">
                      <div>
                        <span className="text-slate-500">รถยนต์ที่ถือครอง: </span>
                        <strong className="text-slate-900">{vDetails?.brandModel || `${selectedBrand} ${selectedModel}`}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">เลขทะเบียน: </span>
                        <strong className="text-blue-900 font-bold">{vDetails?.licensePlate || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">แผนเดิม: </span>
                        <strong className="text-slate-800">{primaryMotor?.customPlanName || 'ประกันรถยนต์'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">ทุนประกันเดิม: </span>
                        <strong className="text-slate-800">฿{((vDetails?.sumInsured || primaryMotor?.sumInsured || marketPrice) || 0).toLocaleString()}</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-blue-700 font-medium">
                      * ดึงข้อมูลยี่ห้อ {selectedBrand} {selectedModel} ปี {selectedYear} และทุนประกันมาให้อัตโนมัติแล้ว (คลิกค้นหาแผนประกันด้านล่างเพื่อเปรียบเทียบ)
                    </p>
                  </div>
                );
              })()}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2 px-3 rounded-lg border border-[#0088cc] text-[#0088cc] hover:bg-sky-50 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>รีเซ็ต</span>
                </button>

                <button
                  type="button"
                  onClick={handleSearchClick}
                  className="w-full py-2 px-3 rounded-lg bg-[#00509d] hover:bg-[#003e7a] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>ค้นหาแผนสำหรับรถคันนี้</span>
                </button>
              </div>
            </div>
          ) : (
            /* Mode 1: Vehicle Inputs Grid */
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

              {/* Action Buttons */}
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
          )}
        </div>
      </div>
    </div>
  );
};
