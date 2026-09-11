import { Product, ProductVariant } from '../types';

export interface SizeCalculationRow {
  variantId: string;
  name: string;
  diameterOrSize: string;
  grade?: string;
  unitWeightKg: number; // weight in KG per piece / unit
  lengthMeters: number;
  pieces: number;
  tonnes: number;
}

export interface CalculationSummary {
  totalPieces: number;
  totalTonnes: number;
  totalKg: number;
  baseRatePerMt: number;
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  grandTotal: number;
  itemizedSummary: { name: string; pieces: number; tonnes: number }[];
}

/**
 * Parses numeric value from strings like "12m", "12.0 Meters", "4.74 kg", "15.0 kg/m"
 */
export function extractNumeric(str?: string | null): number | null {
  if (!str) return null;
  const match = str.match(/([0-9]+(?:\.[0-9]+)?)/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Calculates theoretical weight in KG for a single 12m TMT piece given its diameter (mm).
 * Formula: (d^2 / 162) * length
 */
export function getStandardTmtPieceWeight(diameterMm: number, lengthMeters = 12): number {
  const weightPerMeter = (diameterMm * diameterMm) / 162;
  return parseFloat((weightPerMeter * lengthMeters).toFixed(3));
}

/**
 * Derives the unit weight (KG per piece) for a variant according to details added in the admin dashboard.
 */
export function deriveUnitWeight(variant: ProductVariant, product?: Product | null): number {
  // 1. Check if variant has weight explicitly set in admin dashboard
  if (variant.weight) {
    const rawVal = extractNumeric(variant.weight);
    if (rawVal && rawVal > 0) {
      // If specified as kg/m, multiply by length
      if (variant.weight.toLowerCase().includes('/m') || variant.weight.toLowerCase().includes('kg/m')) {
        const len = extractNumeric(variant.length) || extractProductLength(product) || 12;
        return parseFloat((rawVal * len).toFixed(3));
      }
      return rawVal;
    }
  }

  // 2. Check product specifications for length
  const standardLength = extractProductLength(product) || 12;

  // 3. If diameter is available (TMT or Round bars)
  const diameterNum = extractNumeric(variant.diameter);
  if (diameterNum && diameterNum > 0) {
    return getStandardTmtPieceWeight(diameterNum, standardLength);
  }

  // 4. If size is available (e.g., ISMB Beams, SHS/RHS)
  if (variant.size) {
    const sizeStr = variant.size.toLowerCase();
    if (sizeStr.includes('150')) return parseFloat((15.0 * standardLength).toFixed(2));
    if (sizeStr.includes('200')) return parseFloat((25.4 * standardLength).toFixed(2));
    if (sizeStr.includes('250')) return parseFloat((37.3 * standardLength).toFixed(2));
    if (sizeStr.includes('300')) return parseFloat((44.2 * standardLength).toFixed(2));
    if (sizeStr.includes('400')) return parseFloat((61.6 * standardLength).toFixed(2));
    if (sizeStr.includes('50x50')) return 27.18;
    if (sizeStr.includes('80x80')) return 55.32;
    if (sizeStr.includes('100x50')) return 57.54;
    if (sizeStr.includes('150x100')) return 112.2;
  }

  // 5. If thickness is available (Plates - assuming 1m x 2m standard sheet = 2 sq.m)
  const thicknessNum = extractNumeric(variant.thickness);
  if (thicknessNum && thicknessNum > 0) {
    // 7850 kg/m3 * (thickness/1000) * 2 m2 standard size
    return parseFloat((7.85 * thicknessNum * 2).toFixed(2));
  }

  // Default fallback weight: 10 kg
  return 10.0;
}

/**
 * Extracts standard length from product specifications (set in admin dashboard).
 */
export function extractProductLength(product?: Product | null): number | null {
  if (!product?.specifications) return null;
  const lengthSpec = product.specifications.find(
    (s) => s.specKey.toLowerCase().includes('length') || s.specKey.toLowerCase().includes('meter')
  );
  if (lengthSpec) {
    return extractNumeric(lengthSpec.specValue);
  }
  return null;
}

/**
 * Get applicable base rate per MT according to category or global settings from admin dashboard.
 */
export function getBaseRateForProduct(
  product: Product | null,
  settings: Record<string, string> = {}
): number {
  const categorySlug = product?.category?.slug?.toLowerCase() || '';

  if (categorySlug.includes('tmt')) {
    return parseFloat(settings.tmt_base_rate_per_mt || '52000');
  }
  if (categorySlug.includes('structural')) {
    return parseFloat(settings.structural_base_rate_per_mt || '54000');
  }
  if (categorySlug.includes('plate') || categorySlug.includes('coil')) {
    return parseFloat(settings.plates_base_rate_per_mt || '56000');
  }
  if (categorySlug.includes('pipe') || categorySlug.includes('hollow')) {
    return parseFloat(settings.pipes_base_rate_per_mt || '55000');
  }

  return parseFloat(settings.default_steel_rate_per_mt || '52500');
}

/**
 * Calculates Grand Total, GST and weight metrics from size calculation rows.
 */
export function calculateTotals(
  rows: SizeCalculationRow[],
  baseRatePerMt: number,
  gstPercent = 18
): CalculationSummary {
  let totalPieces = 0;
  let totalKg = 0;
  const itemizedSummary: { name: string; pieces: number; tonnes: number }[] = [];

  for (const r of rows) {
    if (r.pieces > 0 || r.tonnes > 0) {
      totalPieces += r.pieces;
      totalKg += r.tonnes * 1000;
      itemizedSummary.push({
        name: r.name,
        pieces: r.pieces,
        tonnes: parseFloat(r.tonnes.toFixed(3)),
      });
    }
  }

  const totalTonnes = parseFloat((totalKg / 1000).toFixed(3));
  const subtotal = Math.round(totalTonnes * baseRatePerMt);
  const gstAmount = Math.round(subtotal * (gstPercent / 100));
  const grandTotal = subtotal + gstAmount;

  return {
    totalPieces,
    totalTonnes,
    totalKg: Math.round(totalKg),
    baseRatePerMt,
    subtotal,
    gstPercent,
    gstAmount,
    grandTotal,
    itemizedSummary,
  };
}
