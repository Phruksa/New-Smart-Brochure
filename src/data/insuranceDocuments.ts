export interface InsuranceDocumentItem {
  id: string;
  category: 'health' | 'motor' | 'life' | 'miscellaneous' | 'critical_illness';
  categoryLabel: string;
  title: string;
  subtitle: string;
  badge?: string;
  description: string;
  keyHighlights: string[];
  docType: 'brochure' | 'coverage_summary' | 'condition' | 'rate_sheet';
  docTypeLabel: string;
  updatedDate: string;
  fileFormat: 'PNG' | 'JPG' | 'PDF';
  imagePath?: string;
  sumInsuredText: string;
  premiumStartingText: string;
  targetQuotingAction?: {
    category: 'health' | 'motor' | 'premium-code';
    subType?: string;
    buttonLabel: string;
  };
  underwriter: string;
}

export const INSURANCE_DOCUMENTS: InsuranceDocumentItem[] = [
  // 1. ประกันสุขภาพ (Health Insurance)
  {
    id: 'doc-health-smile-15',
    category: 'health',
    categoryLabel: 'ประกันสุขภาพ',
    title: 'โบรชัวร์แผนประกันสุขภาพ Smile Health แผน 15-I และ 15-O',
    subtitle: 'ความคุ้มครองเหมาจ่ายค่ารักษาพยาบาลผู้ป่วยใน (IPD) และทางเลือกผู้ป่วยนอก (OPD)',
    badge: 'ยอดนิยม',
    description: 'แผนความคุ้มครองสุขภาพมาตรฐานสำหรับกลุ่มข้าราชการ พนักงานรัฐวิสาหกิจ และพนักงานเอกชน คุ้มครองค่าห้อง ค่าผ่าตัด และค่ารักษาพยาบาลทั่วไป',
    keyHighlights: [
      'ค่าห้องสูงสุด ฿1,500 - ฿2,000 ต่อคืน',
      'เหมาจ่ายค่าผ่าตัดและหัตถการทางการแพทย์',
      'ค่ารักษาพยาบาลทั่วไปกรณีผู้ป่วยใน (IPD)',
      'เลือกเพิ่มความคุ้มครองผู้ป่วยนอก (OPD) แผน 15-O ได้',
      'แบ่งชำระเบี้ยรายเดือนเริ่มต้นเพียง ฿430/เดือน',
    ],
    docType: 'brochure',
    docTypeLabel: 'โบรชัวร์ทางการ',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'PDF',
    sumInsuredText: 'วงเงินสูงสุด ฿300,000 / ครั้ง',
    premiumStartingText: 'เริ่มต้น ฿430/เดือน (฿5,160/ปี)',
    targetQuotingAction: {
      category: 'health',
      buttonLabel: 'เช็คราคา Smile Health 15',
    },
    underwriter: 'สยามสไมล์ โบรกเกอร์ / ชับบ์สามัคคีประกันภัย',
  },
  {
    id: 'doc-health-smile-610',
    category: 'health',
    categoryLabel: 'ประกันสุขภาพ',
    title: 'เอกสารสรุปความคุ้มครอง Smile Health แผน 610-I และ 610-O (พรีเมียม)',
    subtitle: 'ยกระดับการรักษาพยาบาล เหมาจ่ายระดับสูง ค่าห้องสูงสุด ฿6,000/คืน',
    badge: 'พรีเมียม',
    description: 'เอกสารแจกแจงสิทธิประโยชน์แผนสุขภาพระดับพรีเมียม เหมาะสำหรับผู้ที่ต้องการความคุ้มครองค่าห้องระดับ VIP โรงพยาบาลชั้นนำทั่วประเทศ',
    keyHighlights: [
      'ค่าห้องและค่าอาหารสูงสุด ฿6,000 ต่อคืน',
      'วงเงินค่าผ่าตัดเหมาจ่ายตามจริงสูงสุด ฿100,000',
      'มีวงเงินคุ้มครองค่าแพทย์เยี่ยมไข้ประจำวัน',
      'แผน 610-O รวมวงเงิน OPD สูงสุด ฿1,500/ครั้ง (สูงสุด 30 ครั้ง/ปี)',
      'ไม่ต้องสำรองจ่ายเมื่อเข้ารับการรักษาในเครือข่ายกว่า 400 แห่ง',
    ],
    docType: 'coverage_summary',
    docTypeLabel: 'สรุปผลประโยชน์',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'PDF',
    sumInsuredText: 'วงเงินค่ารักษาเหมาจ่ายสูงสุด ฿600,000 / ปี',
    premiumStartingText: 'เริ่มต้น ฿590/เดือน (฿7,080/ปี)',
    targetQuotingAction: {
      category: 'health',
      buttonLabel: 'เช็คราคา Smile Health 610',
    },
    underwriter: 'สยามสไมล์ โบรกเกอร์ / ทิพยประกันภัย',
  },

  // 2. ประกันรถยนต์ (Motor Insurance)
  {
    id: 'doc-motor-class1',
    category: 'motor',
    categoryLabel: 'ประกันรถยนต์',
    title: 'โบรชัวร์ทางการ: Smile Motor ประกันภัยรถยนต์ ชั้น 1 (1088 & 1488 PRO)',
    subtitle: 'ความคุ้มครองชั้น 1 ครบวงจร ซ่อมอู่มาตรฐาน (1088) และซ่อมศูนย์ห้าง (1488)',
    badge: 'ทางการ',
    description: 'เอกสารแผ่นพับโบรชัวร์ทางการสำหรับประกันภัยรถยนต์ชั้น 1 รหัส 110 และ 320 คุ้มครองตัวรถชน สูญหาย ไฟไหม้ น้ำท่วม และความรับผิดต่อบุคคลภายนอก',
    keyHighlights: [
      'Smile Motor 1088 (ซ่อมอู่): เบี้ย ฿1,088/เดือน หรือ ฿13,000/ปี',
      'Smile Motor 1488 (ซ่อมศูนย์): เบี้ย ฿1,488/เดือน หรือ ฿17,800/ปี',
      'ไม่มีค่าเสียหายส่วนแรก (Deductible 0 บาท) ทุกกรณี',
      'รับประกันอายุรถยนต์ 2-15 ปี (ซ่อมอู่) และ 2-7 ปี (ซ่อมศูนย์)',
      'ฟรี! บริการช่วยเหลือฉุกเฉินบนท้องถนน 24 ชั่วโมง ผ่าน Call Center 1434',
    ],
    docType: 'brochure',
    docTypeLabel: 'โบรชัวร์ทางการ',
    updatedDate: 'อัปเดต 04/06/67',
    fileFormat: 'PNG',
    imagePath: '/assets/aistudio/___________________1_update_04_06_69_3471d9f5.png',
    sumInsuredText: 'ทุนประกัน 80% ของมูลค่ารถ (สูงสุด ฿800,000)',
    premiumStartingText: 'เริ่มต้น ฿1,088/เดือน (฿13,000/ปี)',
    targetQuotingAction: {
      category: 'motor',
      buttonLabel: 'เช็คราคา Smile Motor ชั้น 1',
    },
    underwriter: 'บมจ. ชับบ์สามัคคีประกันภัย / สยามสไมล์ โบรกเกอร์',
  },
  {
    id: 'doc-motor-class2plus',
    category: 'motor',
    categoryLabel: 'ประกันรถยนต์',
    title: 'โบรชัวร์ทางการ: Smile Motor 2+ ประกันภัยรถยนต์ภาคสมัครใจ',
    subtitle: 'คุ้มครองรถชนรถ รถหาย ไฟไหม้ ทุนประกันภัย ฿100,000 - ฿300,000',
    badge: 'สุดคุ้ม',
    description: 'เอกสารโบรชัวร์ทางการ Smile Motor 2+ ทางเลือกสุดคุ้มสำหรับรถยนต์อายุ 2-30 ปี เบี้ยประหยัด คุ้มครองครบทั้งตัวรถและบุคคลภายนอก',
    keyHighlights: [
      'เบี้ยเริ่มต้นเพียง ฿590/เดือน หรือ ฿6,900/ปี (ทุน ฿100,000)',
      'แผนทุน ฿200,000: เบี้ย ฿680/เดือน หรือ ฿7,900/ปี',
      'แผนทุน ฿300,000: เบี้ย ฿760/เดือน หรือ ฿8,900/ปี',
      'คุ้มครองชนกับยานพาหนะทางบก รถสูญหาย ไฟไหม้',
      'รับประกันรถยนต์อายุสูงสุดถึง 30 ปี รหัส 110 และ 320',
    ],
    docType: 'brochure',
    docTypeLabel: 'โบรชัวร์ทางการ',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'JPG',
    imagePath: '/assets/aistudio/_________________Smile_Motor_-____________2__0_e9491c8c.jpg',
    sumInsuredText: 'ทุนประกัน ฿100,000 - ฿300,000',
    premiumStartingText: 'เริ่มต้น ฿590/เดือน (฿6,900/ปี)',
    targetQuotingAction: {
      category: 'motor',
      buttonLabel: 'เช็คราคา Smile Motor 2+',
    },
    underwriter: 'บมจ. ชับบ์สามัคคีประกันภัย / สยามสไมล์ โบรกเกอร์',
  },
  {
    id: 'doc-motor-conditions',
    category: 'motor',
    categoryLabel: 'ประกันรถยนต์',
    title: 'เงื่อนไขและหลักเกณฑ์การรับประกันภัยรถยนต์ (ชั้น 1 และ ชั้น 2+)',
    subtitle: 'ตารางระเบียบการตรวจสภาพรถ รหัสรถยนต์ที่รับประกัน และข้อยกเว้นสำคัญ',
    badge: 'ระเบียบการ',
    description: 'เอกสารระเบียบปฏิบัติและเงื่อนไขการรับประกันภัยรถยนต์ภาคสมัครใจ สำหรับตัวแทนและผู้เอาประกันภัย เพื่อความเข้าใจที่ถูกต้อง',
    keyHighlights: [
      'เงื่อนไขรหัสรถ 110 (รถนั่งส่วนบุคคล) และ 320 (รถบรรทุกพาณิชย์ไม่เกิน 4 ตัน)',
      'ข้อกำหนดการถ่ายภาพรถยนต์และอุปกรณ์ตกแต่งมาตรฐานไม่เกิน 10,000 บาท',
      'ข้อยกเว้นรถดัดแปลงสภาพ ตู้ทึบ ดัมพ์ รถโหลดเตี้ย และรถฉุกเฉิน',
      'เงื่อนไขยี่ห้อรถกลุ่ม 3, 4, 5 (Toyota, Isuzu, Honda, Mazda, Ford ฯลฯ)',
    ],
    docType: 'condition',
    docTypeLabel: 'เงื่อนไขการรับประกัน',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'PNG',
    imagePath: '/assets/aistudio/image_98dd9ad4.png',
    sumInsuredText: 'ตามแผนประกันภัยที่เลือกซื้อ',
    premiumStartingText: 'อ้างอิงตามอัตราเบี้ย Smile Motor',
    targetQuotingAction: {
      category: 'motor',
      buttonLabel: 'เช็คราคาประกันรถยนต์',
    },
    underwriter: 'สยามสไมล์ โบรกเกอร์ (ประเทศไทย) จำกัด',
  },

  // 3. ประกันชีวิต (Life Insurance)
  {
    id: 'doc-life-protection',
    category: 'life',
    categoryLabel: 'ประกันชีวิต',
    title: 'เอกสารแผนประกันชีวิตคุ้มครองรายได้และครอบครัว (Life Protection Series)',
    subtitle: 'สร้างหลักประกันมั่นคง ทุนประกันคุ้มครองการเสียชีวิตทุกกรณี พร้อมเงินชดเชย',
    badge: 'หลักประกันครอบครัว',
    description: 'แผนประกันชีวิตเพื่อสร้างความมั่นคงแก่คนข้างหลัง รองรับการวางแผนภาษีบุคคลธรรมดาสูงสุด ฿100,000/ปี และส่งต่อมรดกอย่างปลอดภัย',
    keyHighlights: [
      'ทุนประกันเริ่มต้น ฿200,000 ถึง ฿2,000,000',
      'คุ้มครองการเสียชีวิตทั้งกรณีเจ็บป่วยและอุบัติเหตุ',
      'สามารถนำเบี้ยประกันไปลดหย่อนภาษีเงินได้บุคคลธรรมดาได้เต็มจำนวน',
      'เลือกระยะเวลาชำระเบี้ยแบบคงที่ 10 ปี หรือ 20 ปี คุ้มครองยาวนาน',
      'สมัครง่าย ตรวจสุขภาพตามเกณฑ์มาตรฐานทุนประกัน',
    ],
    docType: 'brochure',
    docTypeLabel: 'เอกสารโครงการ',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'PDF',
    sumInsuredText: 'ทุนประกัน ฿200,000 - ฿2,000,000',
    premiumStartingText: 'เริ่มต้น ฿350/เดือน (ตามช่วงอายุและเพศ)',
    targetQuotingAction: {
      category: 'premium-code',
      subType: 'life',
      buttonLabel: 'ค้นหาโค๊ดเบี้ยประกันชีวิต',
    },
    underwriter: 'บริษัทประกันชีวิตคู่สัญญาพันธมิตร สยามสไมล์',
  },
  {
    id: 'doc-life-saving',
    category: 'life',
    categoryLabel: 'ประกันชีวิต',
    title: 'เอกสารแผนประกันชีวิตสะสมทรัพย์และเงินออมเกษียณสุข (Endowment & Pension)',
    subtitle: 'ออมเงินอย่างมีวินัย รับเงินคืนประจำปี พร้อมความคุ้มครองชีวิตตลอดสัญญา',
    badge: 'ออมเงิน & ภาษี',
    description: 'แผนสะสมทรัพย์ผลตอบแทนแน่นอน การันตีเงินคืนระหว่างสัญญา เหมาะสำหรับผู้ที่ต้องการออมเงินระยะกลาง-ยาว และรับสิทธิประโยชน์ทางภาษี',
    keyHighlights: [
      'รับเงินคืนประจำปีตามสัดส่วนทุนประกันภัยตลอดอายุสัญญา',
      'ครบสัญญารับเงินก้อนโต 120% - 150% ของทุนประกัน',
      'คุ้มครองชีวิตควบคู่กับการออมเงิน อุ่นใจตลอดสัญญา',
      'สิทธิลดหย่อนภาษีเงินได้บุคคลธรรมดาสูงสุด ฿100,000/ปี',
    ],
    docType: 'coverage_summary',
    docTypeLabel: 'ตารางผลประโยชน์',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'PDF',
    sumInsuredText: 'เงินคืนรวมตลอดสัญญามากกว่า 140%',
    premiumStartingText: 'เริ่มต้น ฿1,000/เดือน (฿12,000/ปี)',
    targetQuotingAction: {
      category: 'premium-code',
      subType: 'life',
      buttonLabel: 'ดูโค๊ดเบี้ยสะสมทรัพย์',
    },
    underwriter: 'บริษัทประกันชีวิตคู่สัญญาพันธมิตร สยามสไมล์',
  },

  // 4. เบ็ดเตล็ด (Miscellaneous / General Insurance)
  {
    id: 'doc-misc-pa-series',
    category: 'miscellaneous',
    categoryLabel: 'เบ็ดเตล็ด',
    title: 'โบรชัวร์ประกันอุบัติเหตุส่วนบุคคล Smile PA (PA 60, PA 90, PA 120, PA 150)',
    subtitle: 'คุ้มครองอุบัติเหตุ 24 ชั่วโมง ทั่วโลก ค่ารักษาพยาบาลต่อครั้ง ไม่ต้องสำรองจ่าย',
    badge: 'สมัครง่าย',
    description: 'เอกสารแผนประกันอุบัติเหตุส่วนบุคคลยอดนิยม ชำระเบี้ยรายเดือนสบายกระเป๋า คุ้มครองการเสียชีวิต ทุพพลภาพ และค่ารักษาพยาบาลจากอุบัติเหตุ',
    keyHighlights: [
      'แผน PA 60: เบี้ย ฿60/เดือน (฿720/ปี) ทุน ฿100,000 ค่ารักษา ฿10,000/ครั้ง',
      'แผน PA 90: เบี้ย ฿90/เดือน (฿1,080/ปี) ทุน ฿150,000 ค่ารักษา ฿15,000/ครั้ง',
      'แผน PA 120: เบี้ย ฿120/เดือน (฿1,440/ปี) ทุน ฿200,000 ค่ารักษา ฿20,000/ครั้ง',
      'แผน PA 150: เบี้ย ฿150/เดือน (฿1,800/ปี) ทุน ฿300,000 ค่ารักษา ฿30,000/ครั้ง',
      'คุ้มครองกรณีขับขี่หรือโดยสารรถจักรยานยนต์ และอุบัติเหตุสาธารณะ',
    ],
    docType: 'brochure',
    docTypeLabel: 'โบรชัวร์ทางการ',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'PDF',
    sumInsuredText: 'ทุนอุบัติเหตุสูงสุด ฿300,000',
    premiumStartingText: 'เริ่มต้น ฿60/เดือน (฿720/ปี)',
    targetQuotingAction: {
      category: 'health',
      buttonLabel: 'เลือกแผน Smile PA',
    },
    underwriter: 'สยามสไมล์ โบรกเกอร์ / ทิพยประกันภัย',
  },
  {
    id: 'doc-misc-fire-home',
    category: 'miscellaneous',
    categoryLabel: 'เบ็ดเตล็ด',
    title: 'เอกสารประกันอัคคีภัยและทรัพย์สินที่อยู่อาศัย (Home & Fire Protection)',
    subtitle: 'คุ้มครองไฟไหม้ ฟ้าผ่า ระเบิด ภัยน้ำท่วม และภัยธรรมชาติสำหรับบ้านและคอนโด',
    badge: 'คุ้มครองบ้าน',
    description: 'เอกสารแสดงสิทธิประโยชน์ประกันอัคคีภัยที่อยู่อาศัย ครอบคลุมทั้งโครงสร้างอาคารและทรัพย์สินภายในบ้าน พร้อมเงินช่วยเหลือค่าเช่าที่พักชั่วคราว',
    keyHighlights: [
      'คุ้มครองความเสียหายจากไฟไหม้ ฟ้าผ่า และการระเบิดของก๊าซหุงต้ม',
      'ขยายความคุ้มครองภัยลมพายุ ภัยแผ่นดินไหว และภัยน้ำท่วม',
      'เงินชดเชยค่าที่พักอาศัยชั่วคราวกรณีบ้านได้รับความเสียหายจนอยู่อาศัยไม่ได้',
      'เบี้ยประกันภัยประหยัด เลือกทำระยะสั้น 1 ปี หรือระยะยาว 3 ปี',
    ],
    docType: 'coverage_summary',
    docTypeLabel: 'สรุปความคุ้มครอง',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'PDF',
    sumInsuredText: 'ทุนประกันตามมูลค่าสิ่งปลูกสร้าง (฿500,000 - ฿5,000,000)',
    premiumStartingText: 'เริ่มต้นประมาณ ฿645 - ฿1,200/ปี',
    targetQuotingAction: {
      category: 'premium-code',
      subType: 'home',
      buttonLabel: 'ค้นหาโค๊ดเบี้ยประกันบ้าน',
    },
    underwriter: 'บริษัทประกันวินาศภัยคู่สัญญาพันธมิตร สยามสไมล์',
  },
  {
    id: 'doc-misc-travel',
    category: 'miscellaneous',
    categoryLabel: 'เบ็ดเตล็ด',
    title: 'เอกสารแผนประกันการเดินทางในประเทศและต่างประเทศ (Smile Travel Insurance)',
    subtitle: 'เดินทางอุ่นใจ คุ้มครองค่ารักษาพยาบาลฉุกเฉิน กระเป๋าหาย เที่ยวบินล่าช้า',
    badge: 'เดินทางอุ่นใจ',
    description: 'เอกสารข้อมูลประกันภัยการเดินทาง ครอบคลุมทั้งการท่องเที่ยวและติดต่อธุรกิจในประเทศและต่างประเทศ ยื่นขอวีซ่าเชงเก้น (Schengen Visa) ได้',
    keyHighlights: [
      'คุ้มครองค่ารักษาพยาบาลอุบัติเหตุและเจ็บป่วยฉุกเฉินในต่างประเทศ',
      'ชดเชยกรณีเที่ยวบินล่าช้า ยกเลิกเที่ยวบิน หรือกระเป๋าเดินทางสูญหาย',
      'บริการเคลื่อนย้ายทางการแพทย์ฉุกเฉินระดับสากล (SOS Medical Assistance)',
      'เบี้ยเริ่มต้นหลักร้อย คุ้มครองตั้งแต่ออกจากบ้านจนกลับถึงที่พัก',
    ],
    docType: 'brochure',
    docTypeLabel: 'แผ่นพับความคุ้มครอง',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'PDF',
    sumInsuredText: 'วงเงินรักษาพยาบาลสูงสุด ฿2,000,000',
    premiumStartingText: 'เริ่มต้น ฿180/ทริป (ในประเทศ) / ฿350/ทริป (ต่างประเทศ)',
    targetQuotingAction: {
      category: 'premium-code',
      subType: 'travel',
      buttonLabel: 'ค้นหาโค๊ดเบี้ยประกันเดินทาง',
    },
    underwriter: 'บริษัทประกันวินาศภัยคู่สัญญาพันธมิตร สยามสไมล์',
  },

  // 5. ประกันโรคร้ายแรง (Critical Illness Insurance)
  {
    id: 'doc-ci-smile-cancer',
    category: 'critical_illness',
    categoryLabel: 'ประกันโรคร้ายแรง',
    title: 'โบรชัวร์แผนประกันภัยโรคมะเร็ง เจอ จ่าย จบ (Smile Cancer Care)',
    subtitle: 'ตรวจพบมะเร็งระยะใดก็ตาม รับเงินก้อนทันที สูงสุด ฿500,000',
    badge: 'คุ้มครองมะเร็ง',
    description: 'เอกสารแผนประกันภัยคุ้มครองโรคมะเร็งโดยเฉพาะ ไม่จำกัดระยะของโรค เมื่อตรวจพบครั้งแรกจ่ายเงินชดเชยก้อนโตทันทีเพื่อใช้เป็นค่ารักษาพยาบาลและค่าใช้จ่ายในชีวิตประจำวัน',
    keyHighlights: [
      'ตรวจพบมะเร็งครั้งแรก จ่ายเงินก้อนทันที 100% ของทุนประกันภัย',
      'คุ้มครองทั้งมะเร็งระยะไม่ลุกลามและระยะลุกลามทุกอวัยวะ (ยกเว้นมะเร็งผิวหนังบางชนิด)',
      'มีเงินชดเชยรายวันกรณีต้องนอนพักรักษาตัวในโรงพยาบาลจากโรคมะเร็ง',
      'เบี้ยประกันภัยคงที่ตามช่วงอายุ สมัครง่ายไม่ต้องตรวจสุขภาพเพียงตอบคำถาม',
      'เบี้ยรายเดือนสบายกระเป๋า ไม่เป็นภาระทางการเงิน',
    ],
    docType: 'brochure',
    docTypeLabel: 'โบรชัวร์ทางการ',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'PDF',
    sumInsuredText: 'เงินชดเชยก้อนโต ฿200,000 - ฿500,000',
    premiumStartingText: 'เริ่มต้น ฿190/เดือน (฿2,280/ปี)',
    targetQuotingAction: {
      category: 'health',
      buttonLabel: 'ดูแผนคุ้มครองสุขภาพและโรคร้าย',
    },
    underwriter: 'สยามสไมล์ โบรกเกอร์ / ชับบ์สามัคคีประกันภัย',
  },
  {
    id: 'doc-ci-multi-shield',
    category: 'critical_illness',
    categoryLabel: 'ประกันโรคร้ายแรง',
    title: 'เอกสารตารางผลประโยชน์ ประกันกลุ่มโรคร้ายแรง 50 โรค (Multi-CI Shield)',
    subtitle: 'คุ้มครองกลุ่มโรคร้ายแรงยอดฮิต มะเร็ง, หัวใจ, หลอดเลือดสมอง, ไตวาย และอื่นๆ',
    badge: 'ครอบคลุมสูงสุด',
    description: 'เอกสารรายละเอียดตารางความคุ้มครองกลุ่มโรคร้ายแรงสูงสุด 50 โรค ดูแลครอบคลุมทุกระยะ พร้อมเงินช่วยเหลือต่อเนื่องระหว่างพักฟื้น',
    keyHighlights: [
      'คุ้มครองกลุ่มโรคหลอดเลือดและหัวใจ (Heart Attack, Bypass)',
      'คุ้มครองกลุ่มโรคระบบประสาทและสมอง (Stroke, Paralysis)',
      'คุ้มครองกลุ่มโรคระบบอวัยวะสำคัญ (ไตวายเรื้อรัง, ตับวาย, ถุงลมโป่งพอง)',
      'จ่ายเงินก้อนเมื่อวินิจฉัยพบโรคร้ายแรงระยะวิกฤต',
      'สามารถนำเบี้ยไปลดหย่อนภาษีสุขภาพได้สูงสุด ฿25,000/ปี',
    ],
    docType: 'coverage_summary',
    docTypeLabel: 'ตารางผลประโยชน์ 50 โรค',
    updatedDate: 'อัปเดต 2567',
    fileFormat: 'PDF',
    sumInsuredText: 'วงเงินชดเชยสูงสุด ฿1,000,000',
    premiumStartingText: 'เริ่มต้น ฿380/เดือน (ตามช่วงอายุ)',
    targetQuotingAction: {
      category: 'health',
      buttonLabel: 'ปรึกษาและเช็คเบี้ยโรคร้ายแรง',
    },
    underwriter: 'บริษัทประกันคู่สัญญาพันธมิตร สยามสไมล์',
  },
];

export const DOCUMENT_CATEGORIES = [
  { id: 'health', label: 'ประกันสุขภาพ' },
  { id: 'motor', label: 'ประกันรถยนต์' },
  { id: 'life', label: 'ประกันชีวิต' },
  { id: 'miscellaneous', label: 'เบ็ดเตล็ด' },
  { id: 'critical_illness', label: 'ประกันโรคร้ายแรง' },
] as const;
