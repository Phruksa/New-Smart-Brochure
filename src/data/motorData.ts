export interface CarModelInfo {
  name: string;
  defaultVehicleType: string;
  defaultUsageType: string;
  defaultCarCode: string;
  subModels: string[];
  baseNewPrice: number;
  carSegment: 'city' | 'executive'; // 'city' (City Car) | 'executive' (Executive Car)
}

export interface CarBrandInfo {
  brand: string;
  models: Record<string, CarModelInfo>;
}

// Officially accepted models based on Siam Smile Brochure
export const CAR_BRANDS_DATA: Record<string, CarBrandInfo> = {
  TOYOTA: {
    brand: 'TOYOTA',
    models: {
      'Yaris Ativ': {
        name: 'Yaris Ativ',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.2 Sport', '1.2 Smart', '1.2 Premium', '1.2 Premium Luxury'],
        baseNewPrice: 620000,
        carSegment: 'city',
      },
      'Yaris Cross': {
        name: 'Yaris Cross',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (SUV/Crossover ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['HEV Smart', 'HEV Premium', 'HEV Premium Luxury', 'HEV GR Sport'],
        baseNewPrice: 850000,
        carSegment: 'city',
      },
      'Corolla Cross': {
        name: 'Corolla Cross',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (SUV ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.8 Sport Plus', 'HEV Premium', 'HEV Premium Luxury', 'HEV GR Sport'],
        baseNewPrice: 1150000,
        carSegment: 'city',
      },
      'Corolla Altis': {
        name: 'Corolla Altis',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.6 G', '1.8 GR Sport', 'HEV Premium', 'HEV GR Sport'],
        baseNewPrice: 980000,
        carSegment: 'city',
      },
      'Camry': {
        name: 'Camry',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['HEV Smart', 'HEV Premium', 'HEV Premium Luxury'],
        baseNewPrice: 1550000,
        carSegment: 'executive', // Executive Car ตามโบรชัวร์สยามสไมล์
      },
      'Sienta': {
        name: 'Sienta',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (Mini MPV 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.5 G', '1.5 V'],
        baseNewPrice: 825000,
        carSegment: 'executive', // Executive Car ตามโบรชัวร์สยามสไมล์
      },
      'Fortuner': {
        name: 'Fortuner',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (SUV/PPV 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['Leader G 2.4', 'Leader V 2.4', 'Legender 2.4', 'Legender 2.8 4WD', 'GR Sport 2.8 4WD'],
        baseNewPrice: 1650000,
        carSegment: 'city',
      },
      'Hilux Revo Double Cab (4 ประตู)': {
        name: 'Hilux Revo Double Cab (4 ประตู)',
        defaultVehicleType: 'รถกระบะ 4 ประตู (จดทะเบียน รย.1)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['Z-Edition 2.4 Entry', 'Prerunner 2.4 Entry', 'Prerunner 2.4 Mid', 'Rocco 2.8 4WD'],
        baseNewPrice: 890000,
        carSegment: 'city',
      },
      'Hilux Revo Smart Cab / Standard (2 ประตู)': {
        name: 'Hilux Revo Smart Cab / Standard (2 ประตู)',
        defaultVehicleType: 'รถกระบะบรรทุก / แค็บ (Pickup 2 ประตู)',
        defaultUsageType: 'ส่วนบุคคล (ไม่รับจ้างหรือบรรทุกเชิงพาณิชย์)',
        defaultCarCode: '320 (รถยนต์บรรทุกส่วนบุคคล)',
        subModels: ['Smart Cab 2.4 Entry', 'Smart Cab 2.4 Mid', 'Standard Cab 2.4 Entry'],
        baseNewPrice: 650000,
        carSegment: 'city',
      },
      'Veloz': {
        name: 'Veloz',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (MPV 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.5 Smart', '1.5 Premium'],
        baseNewPrice: 820000,
        carSegment: 'city',
      },
      'Vios': {
        name: 'Vios',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.5 Entry', '1.5 Mid', '1.5 High'],
        baseNewPrice: 680000,
        carSegment: 'city',
      },
      'C-HR': {
        name: 'C-HR',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (Crossover SUV)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.8 Entry', '1.8 Mid', 'HV Hi'],
        baseNewPrice: 1050000,
        carSegment: 'city',
      },
    },
  },
  HONDA: {
    brand: 'HONDA',
    models: {
      'City': {
        name: 'City',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.0 Turbo V', '1.0 Turbo SV', '1.0 Turbo RS', 'e:HEV SV', 'e:HEV RS'],
        baseNewPrice: 690000,
        carSegment: 'city',
      },
      'City Hatchback': {
        name: 'City Hatchback',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (Hatchback 5 ประตู)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.0 Turbo S+', '1.0 Turbo SV', '1.0 Turbo RS', 'e:HEV SV', 'e:HEV RS'],
        baseNewPrice: 710000,
        carSegment: 'city',
      },
      'Civic': {
        name: 'Civic',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.5 TURBO EL+', 'e:HEV EL+', 'e:HEV RS'],
        baseNewPrice: 1100000,
        carSegment: 'city',
      },
      'HR-V e:HEV': {
        name: 'HR-V e:HEV',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (SUV ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['e:HEV E', 'e:HEV EL', 'e:HEV RS'],
        baseNewPrice: 1080000,
        carSegment: 'city',
      },
      'CR-V': {
        name: 'CR-V',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (SUV ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.5 TURBO E', '1.5 TURBO ES 4WD', 'e:HEV ES', 'e:HEV RS 4WD'],
        baseNewPrice: 1650000,
        carSegment: 'city',
      },
      'Accord': {
        name: 'Accord',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานขนาดใหญ่)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['e:HEV E', 'e:HEV EL', 'e:HEV RS'],
        baseNewPrice: 1680000,
        carSegment: 'executive', // Executive Car ตามโบรชัวร์สยามสไมล์
      },
      'WR-V': {
        name: 'WR-V',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (SUV ขนาดเล็ก)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.5 SV', '1.5 RS'],
        baseNewPrice: 820000,
        carSegment: 'city',
      },
      'BR-V': {
        name: 'BR-V',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (MPV 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.5 E', '1.5 EL'],
        baseNewPrice: 930000,
        carSegment: 'city',
      },
      'Jazz': {
        name: 'Jazz',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (Hatchback 5 ประตู)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.5 S', '1.5 V+', '1.5 RS'],
        baseNewPrice: 650000,
        carSegment: 'city',
      },
    },
  },
  ISUZU: {
    brand: 'ISUZU',
    models: {
      'D-MAX': {
        name: 'D-MAX',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคลไม่เกิน 7 คน',
        defaultUsageType: 'รถยนต์นั่งส่วนบุคคล',
        defaultCarCode: '110',
        subModels: ['D-MAX 4DR. 1900CC', 'D-MAX 2DR. 1900CC', 'D-MAX V-Cross 4x4 3000CC', 'Cab4 1.9 Ddi S', 'Hi-Lander 1.9 Ddi L DA'],
        baseNewPrice: 682353,
        carSegment: 'city',
      },
      'D-Max 4-Door (Cab4 / Hi-Lander)': {
        name: 'D-Max 4-Door (Cab4 / Hi-Lander)',
        defaultVehicleType: 'รถกระบะ 4 ประตู (จดทะเบียน รย.1)',
        defaultUsageType: 'รถยนต์นั่งส่วนบุคคล',
        defaultCarCode: '110',
        subModels: ['Cab4 1.9 Ddi S', 'Hi-Lander 1.9 Ddi L DA', 'Hi-Lander 1.9 Ddi M', 'V-Cross 4x4 3.0 Ddi M'],
        baseNewPrice: 880000,
        carSegment: 'city',
      },
      'D-Max 2-Door (Spacecab / Spark)': {
        name: 'D-Max 2-Door (Spacecab / Spark)',
        defaultVehicleType: 'รถกระบะบรรทุก / แค็บ (Pickup 2 ประตู)',
        defaultUsageType: 'ส่วนบุคคล (ไม่รับจ้างหรือบรรทุกเชิงพาณิชย์)',
        defaultCarCode: '320',
        subModels: ['Spark 1.9 Ddi B', 'Spark 1.9 Ddi S', 'Spacecab 1.9 Ddi S', 'Spacecab 1.9 Ddi L DA'],
        baseNewPrice: 640000,
        carSegment: 'city',
      },
      'MU-X': {
        name: 'MU-X',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (SUV/PPV 7 ที่นั่ง)',
        defaultUsageType: 'รถยนต์นั่งส่วนบุคคล',
        defaultCarCode: '110',
        subModels: ['Active 1.9 Ddi', 'Elegant 1.9 Ddi', 'Ultimate 1.9 Ddi', 'Ultimate 3.0 Ddi 4WD'],
        baseNewPrice: 1550000,
        carSegment: 'city',
      },
    },
  },
  MAZDA: {
    brand: 'MAZDA',
    models: {
      'Mazda 2': {
        name: 'Mazda 2',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋ง/Hatchback ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.3 C', '1.3 S', '1.3 SP', 'XDL 1.5 ดีเซล'],
        baseNewPrice: 680000,
        carSegment: 'city',
      },
      'Mazda 3': {
        name: 'Mazda 3',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดาน/Fastback)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['2.0 C', '2.0 S', '2.0 SP'],
        baseNewPrice: 1050000,
        carSegment: 'city',
      },
      'CX-3': {
        name: 'CX-3',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (Crossover SUV)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['2.0 Base', '2.0 Base Plus', '2.0 Comfort'],
        baseNewPrice: 870000,
        carSegment: 'executive', // Executive Car ตามโบรชัวร์สยามสไมล์
      },
      'CX-30': {
        name: 'CX-30',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (Crossover SUV)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['2.0 C', '2.0 S', '2.0 SP', 'Carbon Edition'],
        baseNewPrice: 990000,
        carSegment: 'city',
      },
      'CX-5': {
        name: 'CX-5',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (SUV ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['2.0 S', '2.0 SP', '2.5 Turbo SP'],
        baseNewPrice: 1550000,
        carSegment: 'city',
      },
      'BT-50': {
        name: 'BT-50',
        defaultVehicleType: 'รถกระบะ 4 ประตู (จดทะเบียน รย.1)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['Double Cab 1.9 S', 'Double Cab 1.9 SP'],
        baseNewPrice: 890000,
        carSegment: 'city',
      },
    },
  },
  MITSUBISHI: {
    brand: 'MITSUBISHI',
    models: {
      'Xpander / Xpander Cross': {
        name: 'Xpander / Xpander Cross',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (MPV/Crossover 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['GLS-LTD', 'GT', 'HEV', 'Cross HEV'],
        baseNewPrice: 880000,
        carSegment: 'city',
      },
      'Pajero Sport': {
        name: 'Pajero Sport',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (SUV/PPV 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['Prime 2WD', 'Ultra 2WD', 'Elite Edition 4WD'],
        baseNewPrice: 1520000,
        carSegment: 'city',
      },
      'Triton Double Cab (4 ประตู)': {
        name: 'Triton Double Cab (4 ประตู)',
        defaultVehicleType: 'รถกระบะ 4 ประตู (จดทะเบียน รย.1)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['Plus Pro', 'Plus Prime', 'Plus Ultra', 'Athlete 4WD'],
        baseNewPrice: 920000,
        carSegment: 'city',
      },
      'Triton Mega Cab / Single (2 ประตู)': {
        name: 'Triton Mega Cab / Single (2 ประตู)',
        defaultVehicleType: 'รถกระบะบรรทุก / แค็บ (Pickup 2 ประตู)',
        defaultUsageType: 'ส่วนบุคคล (ไม่รับจ้างหรือบรรทุกเชิงพาณิชย์)',
        defaultCarCode: '320 (รถยนต์บรรทุกส่วนบุคคล)',
        subModels: ['Single Cab 2.4 Pro', 'Mega Cab 2.4 Pro', 'Mega Cab Plus Pro'],
        baseNewPrice: 630000,
        carSegment: 'city',
      },
      'Mirage / Attrage': {
        name: 'Mirage / Attrage',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (Eco Car ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['GLX MT', 'GLX CVT', 'SMART CVT'],
        baseNewPrice: 530000,
        carSegment: 'city',
      },
    },
  },
  FORD: {
    brand: 'FORD',
    models: {
      'Ranger Double Cab (4 ประตู)': {
        name: 'Ranger Double Cab (4 ประตู)',
        defaultVehicleType: 'รถกระบะ 4 ประตู (จดทะเบียน รย.1)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['XLT 2.0 Turbo 4x2', 'Sport 2.0 Turbo 4x2', 'Wildtrak 2.0 Bi-Turbo 4x4'],
        baseNewPrice: 1050000,
        carSegment: 'city',
      },
      'Ranger Open Cab (2 ประตู)': {
        name: 'Ranger Open Cab (2 ประตู)',
        defaultVehicleType: 'รถกระบะบรรทุก / แค็บ (Pickup 2 ประตู)',
        defaultUsageType: 'ส่วนบุคคล (ไม่รับจ้างหรือบรรทุกเชิงพาณิชย์)',
        defaultCarCode: '320 (รถยนต์บรรทุกส่วนบุคคล)',
        subModels: ['XL 2.0 Turbo MT', 'XL+ 2.0 Turbo MT', 'XLT 2.0 Turbo 4x2'],
        baseNewPrice: 690000,
        carSegment: 'city',
      },
      'Everest': {
        name: 'Everest',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (SUV/PPV 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['Trend 2.0 Turbo 4x2', 'Sport 2.0 Turbo 4x2', 'Titanium+ 2.0 Bi-Turbo 4x4'],
        baseNewPrice: 1750000,
        carSegment: 'city',
      },
    },
  },
  NISSAN: {
    brand: 'NISSAN',
    models: {
      'Almera': {
        name: 'Almera',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.0 Turbo E', '1.0 Turbo EL', '1.0 Turbo V', '1.0 Turbo VL'],
        baseNewPrice: 640000,
        carSegment: 'city',
      },
      'Kicks e-POWER': {
        name: 'Kicks e-POWER',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (B-SUV ไฟฟ้า e-POWER)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['e-POWER E', 'e-POWER V', 'e-POWER VL', 'AUTECH'],
        baseNewPrice: 890000,
        carSegment: 'city',
      },
      'Navara Double Cab (4 ประตู)': {
        name: 'Navara Double Cab (4 ประตู)',
        defaultVehicleType: 'รถกระบะ 4 ประตู (จดทะเบียน รย.1)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['Calibre E', 'Calibre V', 'PRO-2X', 'PRO-4X 4WD'],
        baseNewPrice: 890000,
        carSegment: 'city',
      },
      'Navara King Cab (2 ประตู)': {
        name: 'Navara King Cab (2 ประตู)',
        defaultVehicleType: 'รถกระบะบรรทุก / แค็บ (Pickup 2 ประตู)',
        defaultUsageType: 'ส่วนบุคคล (ไม่รับจ้างหรือบรรทุกเชิงพาณิชย์)',
        defaultCarCode: '320 (รถยนต์บรรทุกส่วนบุคคล)',
        subModels: ['SL 6MT', 'Calibre E 6MT', 'Calibre V 7AT'],
        baseNewPrice: 650000,
        carSegment: 'city',
      },
      'March / Note': {
        name: 'March / Note',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (Eco Car ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.2 E', '1.2 EL', '1.2 VL'],
        baseNewPrice: 520000,
        carSegment: 'city',
      },
    },
  },
  MG: {
    brand: 'MG',
    models: {
      'MG ZS': {
        name: 'MG ZS',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (B-SUV ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.5 C+', '1.5 D', '1.5 X+'],
        baseNewPrice: 730000,
        carSegment: 'city',
      },
      'MG 5': {
        name: 'MG 5',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.5 C', '1.5 D', '1.5 X'],
        baseNewPrice: 620000,
        carSegment: 'city',
      },
      'MG Extender (4 ประตู)': {
        name: 'MG Extender (4 ประตู)',
        defaultVehicleType: 'รถกระบะ 4 ประตู (จดทะเบียน รย.1)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['Grand 2.0 D', 'Grand 2.0 X'],
        baseNewPrice: 850000,
        carSegment: 'city',
      },
    },
  },
  SUZUKI: {
    brand: 'SUZUKI',
    models: {
      'Swift': {
        name: 'Swift',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (Eco Car ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.2 GL', '1.2 GLX', 'GL PLUS'],
        baseNewPrice: 580000,
        carSegment: 'city',
      },
      'Ciaz': {
        name: 'Ciaz',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.2 GL', '1.2 GLX', 'RS'],
        baseNewPrice: 620000,
        carSegment: 'city',
      },
      'Celerio': {
        name: 'Celerio',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (Eco Car ไม่เกิน 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['1.0 GA MT', '1.0 GL CVT', '1.0 GX CVT'],
        baseNewPrice: 420000,
        carSegment: 'city',
      },
      'Ertiga': {
        name: 'Ertiga',
        defaultVehicleType: 'รถยนต์นั่งส่วนบุคคล (MPV 7 ที่นั่ง)',
        defaultUsageType: 'ส่วนบุคคล (Personal Use)',
        defaultCarCode: '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
        subModels: ['GL Hybrid', 'GX Hybrid'],
        baseNewPrice: 780000,
        carSegment: 'city',
      },
    },
  },
};

export const POPULAR_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012];

export const VEHICLE_TYPE_OPTIONS = [
  'รถยนต์นั่งส่วนบุคคลไม่เกิน 7 คน',
  'รถยนต์นั่งส่วนบุคคล (เก๋งซีดานไม่เกิน 7 ที่นั่ง)',
  'รถยนต์นั่งส่วนบุคคล (Hatchback 5 ประตู)',
  'รถยนต์นั่งส่วนบุคคล (SUV/Crossover ไม่เกิน 7 ที่นั่ง)',
  'รถยนต์นั่งส่วนบุคคล (SUV/PPV 7 ที่นั่ง)',
  'รถกระบะ 4 ประตู (จดทะเบียน รย.1)',
  'รถกระบะบรรทุก / แค็บ (Pickup 2 ประตู)',
  'รถตู้โดยสารส่วนบุคคล (เกิน 7 ที่นั่ง)',
];

export const USAGE_TYPE_OPTIONS = [
  'รถยนต์นั่งส่วนบุคคล',
  'ส่วนบุคคล (Personal Use)',
  'ส่วนบุคคล (ไม่รับจ้างหรือบรรทุกเชิงพาณิชย์)',
];

export const CAR_CODE_OPTIONS = [
  '110',
  '320',
  '110 (รถยนต์นั่งส่วนบุคคลไม่เกิน 7 ที่นั่ง)',
  '320 (รถยนต์บรรทุกส่วนบุคคล)',
];

export function calculateEstimatedCarPrice(
  brand: string,
  modelName: string,
  year: number,
  _subModel?: string
): number {
  if (
    (modelName.includes('D-MAX') || modelName.includes('D-Max')) &&
    _subModel?.includes('D-MAX 4DR') &&
    year === 2024
  ) {
    return 580000;
  }
  const brandData = CAR_BRANDS_DATA[brand];
  if (!brandData) return 600000;
  const modelInfo = brandData.models[modelName];
  if (!modelInfo) return 600000;

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);

  let factor = 1.0;
  if (age === 0) factor = 0.95;
  else if (age === 1) factor = 0.85;
  else if (age === 2) factor = 0.74;
  else if (age === 3) factor = 0.65;
  else if (age === 4) factor = 0.58;
  else if (age === 5) factor = 0.50;
  else if (age === 6) factor = 0.44;
  else if (age === 7) factor = 0.38;
  else factor = Math.max(0.25, 0.38 - (age - 7) * 0.03);

  const price = Math.round((modelInfo.baseNewPrice * factor) / 10000) * 10000;
  return Math.max(150000, price);
}

// Check if model belongs to Executive Car segment according to Siam Smile Brochure
export function isExecutiveCarModel(brand: string, modelName: string): boolean {
  const info = CAR_BRANDS_DATA[brand]?.models[modelName];
  return info?.carSegment === 'executive';
}

// Official Tier Rate for SMILE MOTOR 2+ (from official Siam Smile brochure)
export const SMILE_MOTOR_2PLUS_TIERS = [
  { sumInsured: 50000, monthly: 568, annual: 6816 },
  { sumInsured: 100000, monthly: 588, annual: 7056 },
  { sumInsured: 150000, monthly: 618, annual: 7416 },
  { sumInsured: 200000, monthly: 648, annual: 7776, isPopular: true },
  { sumInsured: 250000, monthly: 688, annual: 8256 },
  { sumInsured: 300000, monthly: 718, annual: 8616 },
];

export interface SmileMotorPlan {
  id: string;
  code: string;
  name: string;
  subtitle?: string;
  insuranceClass: '1' | '2+' | '3+' | '3';
  badge: string;
  badgeColor: string;
  description: string;
  repairType: 'garage' | 'dealer';
  repairTypeText: string;
  carSegment: 'city' | 'executive';
  carSegmentText: string;
  monthlyPremium: number;
  annualPremium: number;
  sumInsured: number;
  sumInsuredText: string;
  deductible: number;
  deductibleText: string;
  
  // Third party
  thirdPartyBodilyInjuryPerPerson: number;
  thirdPartyBodilyInjuryPerAccident: number;
  thirdPartyPropertyDamage: number;
  
  // Own Damage
  ownDamageCovered: boolean;
  ownDamageScopeText: string;
  theftFireCovered: boolean;
  floodCovered: boolean;
  
  // In-car coverage
  personalAccidentPerPerson: number;
  medicalExpensePerPerson: number;
  passengerSeats: number;
  bailBond: number;
  
  // Special Features
  roadsideAssistance: boolean;
  roadsideAssistanceText: string;
  underwriterName: string; // e.g. บริษัท ชับบ์สามัคคีประกันภัย จำกัด (มหาชน)
  eligibleAgeText: string;
  specialFeatures: string[];
}

export function generateSmileMotorPlans(
  brand: string,
  modelName: string,
  year: number,
  carCode: string,
  marketPrice: number,
  _repairPreference: 'garage' | 'dealer' = 'garage',
  _hasDashcam: boolean = true
): SmileMotorPlan[] {
  const isExec = isExecutiveCarModel(brand, modelName);
  const isCar110 = carCode.startsWith('110');
  const seats = isCar110 ? 7 : 5;
  const segmentText = isExec ? 'Executive Car (Camry, Sienta, Accord, CX-3)' : 'City Car (รถเก๋ง / กระบะ / SUV ทั่วไป)';

  // ทุนประกันชั้น 1: 80% ของราคารถยนต์ ณ วันที่ทำประกัน
  const class1SumInsured = Math.round((marketPrice * 0.8) / 10000) * 10000;

  // เบี้ยชั้น 1 ตามโบรชัวร์ทางการของสยามสไมล์:
  // City Car: ซ่อมอู่ 1,088 บ./ด. (13,056 บ./ปี) | ซ่อมศูนย์ 1,488 บ./ด. (17,856 บ./ปี)
  // Executive Car: ซ่อมอู่ 2,088 บ./ด. (25,056 บ./ปี) | ซ่อมศูนย์ 2,488 บ./ด. (29,856 บ./ปี)
  const class1GarageMonthly = isExec ? 2088 : 1088;
  const class1GarageAnnual = class1GarageMonthly * 12;
  const class1DealerMonthly = isExec ? 2488 : 1488;
  const class1DealerAnnual = class1DealerMonthly * 12;

  // Plan 2+: แยกเบี้ยประกันชั้น 2+ แต่ละทุนประกันภัยเป็นแผนแยกแต่ละอันออกมาตามตารางโบรชัวร์
  const plans2Plus: SmileMotorPlan[] = SMILE_MOTOR_2PLUS_TIERS.map((tier) => {
    const isPop = !!tier.isPopular;
    return {
      id: `motor-smile-2plus-${tier.sumInsured}`,
      code: `M-2PLUS-${tier.monthly}`,
      name: `Smile Motor 2+ ${tier.monthly}`,
      subtitle: `ประกันภัยรถยนต์ภาคสมัครใจ รวมน้ำท่วม ทุนประกัน ${tier.sumInsured.toLocaleString()} บาท`,
      insuranceClass: '2+' as const,
      badge: isPop
        ? `Smile Motor 2+ ${tier.monthly} (ยอดนิยม)`
        : `Smile Motor 2+ ${tier.monthly}`,
      badgeColor: isPop ? 'bg-[#00509d] text-white' : 'bg-sky-700 text-white',
      description: `ประกันภัยรถยนต์ 2+ สยามสไมล์ แผน Smile Motor 2+ ${tier.monthly} ทุนประกัน ${tier.sumInsured.toLocaleString()} บาท ชำระรายเดือนเพียง ${tier.monthly} บาท/เดือน (รายปี ${tier.annual.toLocaleString()} บาท) คุ้มครองรถชนรถ สูญหาย ไฟไหม้ น้ำท่วมตามทุนประกัน ประกันตัวผู้ขับขี่สูงถึง 1,000,000 บาท`,
      repairType: 'garage' as const,
      repairTypeText: 'ซ่อมอู่ในเครือสยามสไมล์',
      carSegment: 'city' as const,
      carSegmentText: 'รถยนต์นั่ง รหัส 110 และ รถกระบะ รหัส 320',
      monthlyPremium: tier.monthly,
      annualPremium: tier.annual,
      sumInsured: tier.sumInsured,
      sumInsuredText: `ตามทุนประกันภัย (${tier.sumInsured.toLocaleString()} บาท)`,
      deductible: 0,
      deductibleText: 'ไม่มีค่าเสียหายส่วนแรกกรณีรถชนรถ',
      thirdPartyBodilyInjuryPerPerson: 1000000,
      thirdPartyBodilyInjuryPerAccident: 20000000,
      thirdPartyPropertyDamage: 1000000,
      ownDamageCovered: true,
      ownDamageScopeText: `ตามทุนประกันภัย (${tier.sumInsured.toLocaleString()} บาท - ชนกับยานพาหนะทางบก)`,
      theftFireCovered: true,
      floodCovered: true,
      personalAccidentPerPerson: 100000,
      medicalExpensePerPerson: 100000,
      passengerSeats: 5,
      bailBond: 1000000, // 1,000,000 บาท ตามโบรชัวร์
      roadsideAssistance: true,
      roadsideAssistanceText: 'ยิ้มแจ้ง ยามฉุกเฉิน 1434 ฟรี (พ่วงแบตฯ เปลี่ยนยาง เติมน้ำมัน รถลาก/รถสไลด์)',
      underwriterName: 'บริษัท ชับบ์สามัคคีประกันภัย จำกัด (มหาชน)',
      eligibleAgeText: 'รับรถอายุ 2 - 30* ปี',
      specialFeatures: [
        `เบี้ยชำระรายเดือนเพียง ${tier.monthly} บาท/เดือน (รายปี ${tier.annual.toLocaleString()} บาท)`,
        `คุ้มครองรถชนรถ สูญหาย ไฟไหม้ และน้ำท่วมตามทุนประกัน (${tier.sumInsured.toLocaleString()} บาท)`,
        'วงเงินประกันตัวผู้ขับขี่สูงสุดถึง 1,000,000 บาท/ครั้ง',
        'รับรถยนต์อายุสูงสุดถึง 30 ปี (รหัส 110 และ 320)',
        'บริการช่วยเหลือฉุกเฉินยิ้มแจ้ง 1434 ฟรีตลอด 24 ชม.',
      ],
    };
  });

  return [
    {
      id: 'motor-class1-garage',
      code: isExec ? 'M1-EXEC-GARAGE' : 'M1-1088-PRO',
      name: `Smile Motor ${class1GarageMonthly} (ซ่อมอู่)`,
      subtitle: 'ประกันภัยรถยนต์ชั้น 1 ซ่อมอู่ในเครือมาตรฐาน',
      insuranceClass: '1',
      badge: `Smile Motor ${class1GarageMonthly} (ซ่อมอู่)`,
      badgeColor: 'bg-[#b91c1c] text-white',
      description: 'ประกันภัยรถยนต์ชั้น 1 สยามสไมล์ ซ่อมอู่มาตรฐาน คุ้มครองครอบคลุมทุกกรณี ทั้งรถชน ชนเสา/สิ่งกีดขวาง พลิกคว่ำ สูญหาย ไฟไหม้ น้ำท่วม และกระจกแตก ไม่มีค่าเสียหายส่วนแรก',
      repairType: 'garage',
      repairTypeText: 'ซ่อมอู่ (เครือสยามสไมล์มาตรฐาน ISO)',
      carSegment: isExec ? 'executive' : 'city',
      carSegmentText: segmentText,
      monthlyPremium: class1GarageMonthly,
      annualPremium: class1GarageAnnual,
      sumInsured: class1SumInsured,
      sumInsuredText: `ตามทุนประกันภัย (${class1SumInsured.toLocaleString()} บาท)`,
      deductible: 0,
      deductibleText: 'ไม่มี (0 บาท) ทั้งกรณีเป็นฝ่ายผิดหรือแจ้งคู่กรณีไม่ได้',
      thirdPartyBodilyInjuryPerPerson: 1000000,
      thirdPartyBodilyInjuryPerAccident: 20000000,
      thirdPartyPropertyDamage: 2500000,
      ownDamageCovered: true,
      ownDamageScopeText: 'ตามทุนประกันภัย (ทุกกรณี รถชน, ชนเสา/สิ่งกีดขวาง, พลิกคว่ำ)',
      theftFireCovered: true,
      floodCovered: true,
      personalAccidentPerPerson: 100000,
      medicalExpensePerPerson: 100000,
      passengerSeats: seats,
      bailBond: 200000,
      roadsideAssistance: true,
      roadsideAssistanceText: 'ยิ้มแจ้ง ยามฉุกเฉิน 1434 ฟรี 24 ชม. (พ่วงแบตฯ, เปลี่ยนยาง, เติมน้ำมัน, รถลาก/สไลด์)',
      underwriterName: 'บริษัท ชับบ์สามัคคีประกันภัย จำกัด (มหาชน)',
      eligibleAgeText: 'รับรถอายุ 2 - 15* ปี',
      specialFeatures: [
        `เบี้ยชำระรายเดือนเริ่มต้น ${class1GarageMonthly.toLocaleString()} บาท/เดือน คุ้มครองเหมือนรายปี`,
        `คุ้มครองรถยนต์สูญหาย / ไฟไหม้ / น้ำท่วม เต็มทุนประกัน (${class1SumInsured.toLocaleString()} บาท)`,
        'ไม่มีค่าเสียหายส่วนแรก (Deductible 0 บาท)',
        `คุ้มครองคนในรถ อุบัติเหตุและค่ารักษา 100,000 x ${seats} ที่นั่ง`,
        'บริการช่วยเหลือฉุกเฉินบนท้องถนน ยิ้มแจ้ง 1434 ฟรี',
      ],
    },
    {
      id: 'motor-class1-dealer',
      code: isExec ? 'M1-EXEC-DEALER' : 'M1-1488-PRO',
      name: `Smile Motor ${class1DealerMonthly} (ซ่อมศูนย์)`,
      subtitle: 'ประกันภัยรถยนต์ชั้น 1 ซ่อมศูนย์บริการมาตรฐาน',
      insuranceClass: '1',
      badge: `Smile Motor ${class1DealerMonthly} (ซ่อมศูนย์)`,
      badgeColor: 'bg-[#d97706] text-white',
      description: 'ประกันภัยรถยนต์ชั้น 1 สยามสไมล์ ซ่อมศูนย์บริการมาตรฐาน อะไหล่แท้ คุ้มครองครบถ้วนทุกภัย ทั้งรถชน ชนเสา/สิ่งกีดขวาง ไฟไหม้ สูญหาย น้ำท่วม กระจกแตก ไม่มีค่าเสียหายส่วนแรก',
      repairType: 'dealer',
      repairTypeText: 'ซ่อมศูนย์ (ศูนย์บริการมาตรฐานแบรนด์รถยนต์)',
      carSegment: isExec ? 'executive' : 'city',
      carSegmentText: segmentText,
      monthlyPremium: class1DealerMonthly,
      annualPremium: class1DealerAnnual,
      sumInsured: class1SumInsured,
      sumInsuredText: `ตามทุนประกันภัย (${class1SumInsured.toLocaleString()} บาท)`,
      deductible: 0,
      deductibleText: 'ไม่มี (0 บาท) ทั้งกรณีเป็นฝ่ายผิดหรือแจ้งคู่กรณีไม่ได้',
      thirdPartyBodilyInjuryPerPerson: 1000000,
      thirdPartyBodilyInjuryPerAccident: 20000000,
      thirdPartyPropertyDamage: 2500000,
      ownDamageCovered: true,
      ownDamageScopeText: 'ตามทุนประกันภัย (ทุกกรณี ซ่อมศูนย์บริการมาตรฐาน อะไหล่แท้)',
      theftFireCovered: true,
      floodCovered: true,
      personalAccidentPerPerson: 100000,
      medicalExpensePerPerson: 100000,
      passengerSeats: seats,
      bailBond: 200000,
      roadsideAssistance: true,
      roadsideAssistanceText: 'ยิ้มแจ้ง ยามฉุกเฉิน 1434 ฟรี 24 ชม. (พ่วงแบตฯ, เปลี่ยนยาง, เติมน้ำมัน, รถลาก/สไลด์)',
      underwriterName: 'บริษัท ชับบ์สามัคคีประกันภัย จำกัด (มหาชน)',
      eligibleAgeText: 'รับรถอายุ 2 - 7* ปี',
      specialFeatures: [
        `เบี้ยชำระรายเดือน ${class1DealerMonthly.toLocaleString()} บาท/เดือน คุ้มครองเหมือนรายปี`,
        'จัดซ่อมศูนย์บริการมาตรฐาน (ห้าง) อะไหล่แท้',
        `คุ้มครองรถยนต์สูญหาย / ไฟไหม้ / น้ำท่วม เต็มทุนประกัน (${class1SumInsured.toLocaleString()} บาท)`,
        'ไม่มีค่าเสียหายส่วนแรก (Deductible 0 บาท)',
        'บริการช่วยเหลือฉุกเฉินบนท้องถนน ยิ้มแจ้ง 1434 ฟรี',
      ],
    },
    ...plans2Plus,
  ];
}
