// src/api/monthEndCalculation.ts
// API for processing month-end calculations (BV, pool, distributions)

export interface MonthEndCalculationResponse {
  success: boolean;
  calculation_month: string;
  pool_distributions: Record<string, any>;
  user_qualifications: Array<Record<string, any>>;
  total_pool_fund: string;
  details: Record<string, any>;
}

export interface MonthEndCalculationError {
  detail: string | Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
  }>;
}

/**
 * Calls the month-end calculation API.
 * @param calculationMonth - Month in 'YYYY-MM' format (e.g., '2025-09')
 * @param forceRecalculate - Whether to force recalculation (default: false)
 */
export async function processMonthEndCalculation(
  calculationMonth: string,
  forceRecalculate: boolean = false
): Promise<MonthEndCalculationResponse> {
  // API expects 'YYYY-MM-01' as calculation_month (first day of month)
  const calculation_month = calculationMonth.match(/^\d{4}-\d{2}$/)
    ? calculationMonth + '-01'
    : calculationMonth;

  const url = 'https://mentify.srv880406.hstgr.cloud/api/monthly-calculations';
  const payload = {
    calculation_month,
    force_recalculate: forceRecalculate,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const resData = await response.json();
  if (!response.ok) {
    throw resData;
  }
  return resData;
}
