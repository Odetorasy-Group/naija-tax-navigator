export interface TaxInputs {
  grossSalary: number;
  isAnnual: boolean;
  annualRent: number;
  pensionEnabled: boolean;
  nhfEnabled: boolean;
  lifeAssuranceEnabled: boolean;
}

export interface TaxBand {
  threshold: number;
  rate: number;
  label: string;
  taxableAmount: number;
  taxAmount: number;
}

export interface TaxResult {
  annualGross: number;
  monthlyGross: number;
  
  // Deductions
  pensionDeduction: number;
  nhfDeduction: number;
  rentRelief: number;
  totalDeductions: number;
  
  // Tax calculations
  chargeableIncome: number;
  annualTax: number;
  monthlyTax: number;
  
  // Take home
  annualTakeHome: number;
  monthlyTakeHome: number;
  
  // Tax bands breakdown
  taxBands: TaxBand[];
  
  // Comparison with old law
  oldLawAnnualTax: number;
  taxSavings: number;
  
  // Effective rate
  effectiveRate: number;
  
  // Tax-free threshold applied
  isTaxFree: boolean;
}

const TAX_BANDS_2026 = [
  { threshold: 800000, rate: 0, label: "First ₦800k" },
  { threshold: 2200000, rate: 0.15, label: "Next ₦2.2m" },
  { threshold: 9000000, rate: 0.18, label: "Next ₦9m" },
  { threshold: 13000000, rate: 0.21, label: "Next ₦13m" },
  { threshold: 25000000, rate: 0.23, label: "Next ₦25m" },
  { threshold: Infinity, rate: 0.25, label: "Above ₦50m" },
];

const TAX_BANDS_2021 = [
  { threshold: 300000, rate: 0.07 },
  { threshold: 300000, rate: 0.11 },
  { threshold: 500000, rate: 0.15 },
  { threshold: 500000, rate: 0.19 },
  { threshold: 1600000, rate: 0.21 },
  { threshold: Infinity, rate: 0.24 },
];

const RENT_RELIEF_CAP = 500000;
const RENT_RELIEF_RATE = 0.20;
const PENSION_RATE = 0.08;
const NHF_RATE = 0.025;
const LIFE_ASSURANCE_RATE = 0.02; // Assumed 2% of gross
const TAX_FREE_THRESHOLD = 800000;

function calculateOldLawTax(chargeableIncome: number): number {
  // Old 2021 law calculations (simplified - CRA method)
  // CRA = Higher of ₦200k or 1% of gross + 20% of gross
  // For simplicity, using the old progressive bands without CRA
  
  let remainingIncome = chargeableIncome;
  let totalTax = 0;
  
  for (const band of TAX_BANDS_2021) {
    if (remainingIncome <= 0) break;
    
    const taxableInBand = Math.min(remainingIncome, band.threshold);
    totalTax += taxableInBand * band.rate;
    remainingIncome -= taxableInBand;
  }
  
  return totalTax;
}

function calculate2026Tax(chargeableIncome: number): { totalTax: number; bands: TaxBand[] } {
  const bands: TaxBand[] = [];
  let remainingIncome = chargeableIncome;
  let totalTax = 0;
  let cumulativeThreshold = 0;
  
  for (const band of TAX_BANDS_2026) {
    const bandSize = band.threshold === Infinity ? remainingIncome : band.threshold;
    const taxableInBand = Math.max(0, Math.min(remainingIncome, bandSize));
    const taxInBand = taxableInBand * band.rate;
    
    bands.push({
      threshold: band.threshold,
      rate: band.rate,
      label: band.label,
      taxableAmount: taxableInBand,
      taxAmount: taxInBand,
    });
    
    totalTax += taxInBand;
    remainingIncome -= taxableInBand;
    cumulativeThreshold += bandSize;
    
    if (remainingIncome <= 0) break;
  }
  
  return { totalTax, bands };
}

export function calculateTax(inputs: TaxInputs): TaxResult {
  // Convert to annual if monthly
  const annualGross = inputs.isAnnual ? inputs.grossSalary : inputs.grossSalary * 12;
  const monthlyGross = annualGross / 12;
  
  // Check tax-free threshold
  if (annualGross <= TAX_FREE_THRESHOLD) {
    return {
      annualGross,
      monthlyGross,
      pensionDeduction: 0,
      nhfDeduction: 0,
      rentRelief: 0,
      totalDeductions: 0,
      chargeableIncome: annualGross,
      annualTax: 0,
      monthlyTax: 0,
      annualTakeHome: annualGross,
      monthlyTakeHome: monthlyGross,
      taxBands: [],
      oldLawAnnualTax: calculateOldLawTax(annualGross),
      taxSavings: calculateOldLawTax(annualGross),
      effectiveRate: 0,
      isTaxFree: true,
    };
  }
  
  // Calculate deductions
  const pensionDeduction = inputs.pensionEnabled ? annualGross * PENSION_RATE : 0;
  const nhfDeduction = inputs.nhfEnabled ? annualGross * NHF_RATE : 0;
  const lifeAssuranceDeduction = inputs.lifeAssuranceEnabled ? annualGross * LIFE_ASSURANCE_RATE : 0;
  
  // Rent relief: 20% of rent paid, capped at ₦500,000
  const rentRelief = Math.min(inputs.annualRent * RENT_RELIEF_RATE, RENT_RELIEF_CAP);
  
  // Total statutory deductions (excluding rent relief for now, as it's applied differently)
  const totalDeductions = pensionDeduction + nhfDeduction + lifeAssuranceDeduction + rentRelief;
  
  // Chargeable income
  const chargeableIncome = Math.max(0, annualGross - totalDeductions);
  
  // Calculate 2026 tax
  const { totalTax: annualTax, bands: taxBands } = calculate2026Tax(chargeableIncome);
  const monthlyTax = annualTax / 12;
  
  // Calculate old law tax for comparison
  const oldLawAnnualTax = calculateOldLawTax(chargeableIncome);
  const taxSavings = Math.max(0, oldLawAnnualTax - annualTax);
  
  // Take home calculations
  const annualTakeHome = annualGross - annualTax - pensionDeduction - nhfDeduction - lifeAssuranceDeduction;
  const monthlyTakeHome = annualTakeHome / 12;
  
  // Effective tax rate
  const effectiveRate = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;
  
  return {
    annualGross,
    monthlyGross,
    pensionDeduction,
    nhfDeduction,
    rentRelief,
    totalDeductions,
    chargeableIncome,
    annualTax,
    monthlyTax,
    annualTakeHome,
    monthlyTakeHome,
    taxBands,
    oldLawAnnualTax,
    taxSavings,
    effectiveRate,
    isTaxFree: false,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
