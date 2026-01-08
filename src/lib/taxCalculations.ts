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

export interface OldTaxBreakdown {
  adjustedGross: number;
  cra: number;
  chargeableIncome: number;
  calculatedTax: number;
  minimumTax: number;
  finalTax: number;
  usedMinimumTax: boolean;
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
  oldLawMonthlyTax: number;
  oldTaxBreakdown: OldTaxBreakdown;
  taxSavings: number;
  monthlySavings: number;
  savingsPercentage: number;
  isNewLawBetter: boolean;
  
  // Effective rate
  effectiveRate: number;
  oldEffectiveRate: number;
  
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
  { threshold: 300000, rate: 0.07, label: "First ₦300k" },
  { threshold: 300000, rate: 0.11, label: "Next ₦300k" },
  { threshold: 500000, rate: 0.15, label: "Next ₦500k" },
  { threshold: 500000, rate: 0.19, label: "Next ₦500k" },
  { threshold: 1600000, rate: 0.21, label: "Next ₦1.6m" },
  { threshold: Infinity, rate: 0.24, label: "Above ₦3.2m" },
];

const RENT_RELIEF_CAP = 500000;
const RENT_RELIEF_RATE = 0.20;
export const PENSION_RATE = 0.08;
export const NHF_RATE = 0.025;
const LIFE_ASSURANCE_RATE = 0.02;
const TAX_FREE_THRESHOLD = 800000;
const CRA_FIXED = 200000; // ₦200,000 fixed component
const CRA_GROSS_RATE = 0.01; // 1% of gross
const CRA_ADDITIONAL_RATE = 0.20; // 20% of gross

function calculateCRA(annualGross: number): number {
  // CRA = Higher of (₦200,000 OR 1% of Gross) + 20% of Gross
  const fixedOrPercent = Math.max(CRA_FIXED, annualGross * CRA_GROSS_RATE);
  const additional = annualGross * CRA_ADDITIONAL_RATE;
  return fixedOrPercent + additional;
}

function calculateOldLawTax(
  annualGross: number,
  pensionDeduction: number,
  nhfDeduction: number
): OldTaxBreakdown {
  // Step 1: Calculate Adjusted Gross (Gross - Pension - NHF)
  const adjustedGross = annualGross - pensionDeduction - nhfDeduction;
  
  // Step 2: Calculate CRA
  const cra = calculateCRA(annualGross);
  
  // Step 3: Calculate Chargeable Income
  const chargeableIncome = Math.max(0, adjustedGross - cra);
  
  // Step 4: Calculate tax using old bands
  let remainingIncome = chargeableIncome;
  let calculatedTax = 0;
  
  for (const band of TAX_BANDS_2021) {
    if (remainingIncome <= 0) break;
    
    const taxableInBand = Math.min(remainingIncome, band.threshold);
    calculatedTax += taxableInBand * band.rate;
    remainingIncome -= taxableInBand;
  }
  
  // Step 5: Apply Minimum Tax Rule (1% of Gross if calculated tax is less)
  const minimumTax = annualGross * 0.01;
  const usedMinimumTax = calculatedTax < minimumTax && chargeableIncome > 0;
  const finalTax = usedMinimumTax ? minimumTax : calculatedTax;
  
  return {
    adjustedGross,
    cra,
    chargeableIncome,
    calculatedTax,
    minimumTax,
    finalTax,
    usedMinimumTax,
  };
}

function calculate2026Tax(chargeableIncome: number): { totalTax: number; bands: TaxBand[] } {
  const bands: TaxBand[] = [];
  let remainingIncome = chargeableIncome;
  let totalTax = 0;
  
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
    
    if (remainingIncome <= 0) break;
  }
  
  return { totalTax, bands };
}

export function calculateTax(inputs: TaxInputs): TaxResult {
  // Convert to annual if monthly
  const annualGross = inputs.isAnnual ? inputs.grossSalary : inputs.grossSalary * 12;
  const monthlyGross = annualGross / 12;
  
  // Calculate deductions (same for both systems)
  const pensionDeduction = inputs.pensionEnabled ? annualGross * PENSION_RATE : 0;
  const nhfDeduction = inputs.nhfEnabled ? annualGross * NHF_RATE : 0;
  const lifeAssuranceDeduction = inputs.lifeAssuranceEnabled ? annualGross * LIFE_ASSURANCE_RATE : 0;
  
  // Rent relief (2026 law only): 20% of rent paid, capped at ₦500,000
  const rentRelief = Math.min(inputs.annualRent * RENT_RELIEF_RATE, RENT_RELIEF_CAP);
  
  // Total deductions for 2026 law
  const totalDeductions = pensionDeduction + nhfDeduction + lifeAssuranceDeduction + rentRelief;
  
  // Check tax-free threshold for 2026 law
  if (annualGross <= TAX_FREE_THRESHOLD) {
    // Calculate old law tax even for tax-free threshold comparison
    const oldTaxBreakdown = calculateOldLawTax(annualGross, pensionDeduction, nhfDeduction);
    
    return {
      annualGross,
      monthlyGross,
      pensionDeduction,
      nhfDeduction,
      rentRelief,
      totalDeductions,
      chargeableIncome: annualGross,
      annualTax: 0,
      monthlyTax: 0,
      annualTakeHome: annualGross - pensionDeduction - nhfDeduction,
      monthlyTakeHome: (annualGross - pensionDeduction - nhfDeduction) / 12,
      taxBands: [],
      oldLawAnnualTax: oldTaxBreakdown.finalTax,
      oldLawMonthlyTax: oldTaxBreakdown.finalTax / 12,
      oldTaxBreakdown,
      taxSavings: oldTaxBreakdown.finalTax,
      monthlySavings: oldTaxBreakdown.finalTax / 12,
      savingsPercentage: oldTaxBreakdown.finalTax > 0 ? 100 : 0,
      isNewLawBetter: true,
      effectiveRate: 0,
      oldEffectiveRate: annualGross > 0 ? (oldTaxBreakdown.finalTax / annualGross) * 100 : 0,
      isTaxFree: true,
    };
  }
  
  // Chargeable income for 2026 law
  const chargeableIncome = Math.max(0, annualGross - totalDeductions);
  
  // Calculate 2026 tax
  const { totalTax: annualTax, bands: taxBands } = calculate2026Tax(chargeableIncome);
  const monthlyTax = annualTax / 12;
  
  // Calculate old law tax for comparison
  const oldTaxBreakdown = calculateOldLawTax(annualGross, pensionDeduction, nhfDeduction);
  const oldLawAnnualTax = oldTaxBreakdown.finalTax;
  const oldLawMonthlyTax = oldLawAnnualTax / 12;
  
  // Calculate savings
  const taxSavings = oldLawAnnualTax - annualTax;
  const monthlySavings = taxSavings / 12;
  const savingsPercentage = oldLawAnnualTax > 0 ? (taxSavings / oldLawAnnualTax) * 100 : 0;
  const isNewLawBetter = taxSavings >= 0;
  
  // Take home calculations
  const annualTakeHome = annualGross - annualTax - pensionDeduction - nhfDeduction - lifeAssuranceDeduction;
  const monthlyTakeHome = annualTakeHome / 12;
  
  // Effective tax rates
  const effectiveRate = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;
  const oldEffectiveRate = annualGross > 0 ? (oldLawAnnualTax / annualGross) * 100 : 0;
  
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
    oldLawMonthlyTax,
    oldTaxBreakdown,
    taxSavings,
    monthlySavings,
    savingsPercentage,
    isNewLawBetter,
    effectiveRate,
    oldEffectiveRate,
    isTaxFree: false,
  };
}

// Reverse calculator: Find Gross from Target Net
export function findGrossFromNet(
  targetMonthlyNet: number,
  pensionEnabled: boolean = true,
  nhfEnabled: boolean = true
): { requiredGross: number; result: TaxResult } {
  const targetAnnualNet = targetMonthlyNet * 12;
  
  // Binary search for the gross salary
  let low = targetAnnualNet;
  let high = targetAnnualNet * 3; // Start with a reasonable upper bound
  let bestGross = targetAnnualNet;
  let bestResult: TaxResult | null = null;
  
  const tolerance = 10; // Within ₦10 margin
  
  for (let i = 0; i < 100; i++) {
    const mid = Math.floor((low + high) / 2);
    
    const result = calculateTax({
      grossSalary: mid,
      isAnnual: true,
      annualRent: 0,
      pensionEnabled,
      nhfEnabled,
      lifeAssuranceEnabled: false,
    });
    
    const netDiff = result.annualTakeHome - targetAnnualNet;
    
    if (Math.abs(netDiff) <= tolerance) {
      bestGross = mid;
      bestResult = result;
      break;
    }
    
    if (netDiff > 0) {
      high = mid;
      bestGross = mid;
      bestResult = result;
    } else {
      low = mid;
    }
  }
  
  if (!bestResult) {
    bestResult = calculateTax({
      grossSalary: bestGross,
      isAnnual: true,
      annualRent: 0,
      pensionEnabled,
      nhfEnabled,
      lifeAssuranceEnabled: false,
    });
  }
  
  return { requiredGross: bestGross, result: bestResult };
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

// Currency conversion rates (approximate)
export const CURRENCY_RATES = {
  USD: 1550, // 1 USD = ₦1550
  GBP: 1950, // 1 GBP = ₦1950
  EUR: 1680, // 1 EUR = ₦1680
};

export function convertToNGN(amount: number, currency: keyof typeof CURRENCY_RATES): number {
  return amount * CURRENCY_RATES[currency];
}

export function convertFromNGN(amount: number, currency: keyof typeof CURRENCY_RATES): number {
  return amount / CURRENCY_RATES[currency];
}
