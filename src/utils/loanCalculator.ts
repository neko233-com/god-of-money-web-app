/**
 * 贷款计算工具类
 */

export interface LoanResult {
  monthlyPayment: number; // 月供
  totalPayment: number; // 总还款额
  totalInterest: number; // 总利息
  schedule: PaymentSchedule[]; // 还款计划
}

export interface PaymentSchedule {
  period: number; // 期数
  monthlyPayment: number; // 月供
  principal: number; // 本金
  interest: number; // 利息
  remainingPrincipal: number; // 剩余本金
}

export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high' | 'critical'; // 风险等级
  debtRatio: number; // 负债率
  recommendedIncome: number; // 建议月收入
  suggestions: string[]; // 建议列表
}

/**
 * 计算等额本息月供
 * @param principal 贷款本金
 * @param annualRate 年利率（如 4.9 表示 4.9%）
 * @param months 贷款期数（月）
 */
export function calculateEqualPayment(
  principal: number,
  annualRate: number,
  months: number
): LoanResult {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const schedule: PaymentSchedule[] = [];
  let remainingPrincipal = principal;

  for (let period = 1; period <= months; period++) {
    const interest = remainingPrincipal * monthlyRate;
    const principalPayment = monthlyPayment - interest;
    remainingPrincipal -= principalPayment;

    schedule.push({
      period,
      monthlyPayment,
      principal: principalPayment,
      interest,
      remainingPrincipal: Math.max(0, remainingPrincipal),
    });
  }

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}

/**
 * 计算等额本金月供
 * @param principal 贷款本金
 * @param annualRate 年利率（如 4.9 表示 4.9%）
 * @param months 贷款期数（月）
 */
export function calculateEqualPrincipal(
  principal: number,
  annualRate: number,
  months: number
): LoanResult {
  const monthlyRate = annualRate / 100 / 12;
  const principalPayment = principal / months;

  const schedule: PaymentSchedule[] = [];
  let remainingPrincipal = principal;
  let totalPayment = 0;

  for (let period = 1; period <= months; period++) {
    const interest = remainingPrincipal * monthlyRate;
    const monthlyPayment = principalPayment + interest;
    remainingPrincipal -= principalPayment;
    totalPayment += monthlyPayment;

    schedule.push({
      period,
      monthlyPayment,
      principal: principalPayment,
      interest,
      remainingPrincipal: Math.max(0, remainingPrincipal),
    });
  }

  const totalInterest = totalPayment - principal;
  const firstMonthPayment = schedule[0]?.monthlyPayment ?? 0;

  return {
    monthlyPayment: firstMonthPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}

/**
 * 财务风险评估
 * @param monthlyPayment 月供金额
 * @param monthlyIncome 月收入
 * @param otherDebts 其他月债务
 */
export function assessRisk(
  monthlyPayment: number,
  monthlyIncome: number,
  otherDebts: number = 0
): RiskAssessment {
  const totalDebt = monthlyPayment + otherDebts;
  const debtRatio = (totalDebt / monthlyIncome) * 100;

  let riskLevel: RiskAssessment['riskLevel'];
  const suggestions: string[] = [];

  // 根据负债率判断风险等级
  if (debtRatio <= 30) {
    riskLevel = 'low';
    suggestions.push('您的负债率健康，财务状况良好');
    suggestions.push('建议保持 3-6 个月的应急储备金');
  } else if (debtRatio <= 50) {
    riskLevel = 'medium';
    suggestions.push('负债率偏高，建议控制消费支出');
    suggestions.push('尽量增加收入来源，降低负债比例');
    suggestions.push('建议月收入至少达到：' + Math.ceil(totalDebt / 0.3) + ' 元');
  } else if (debtRatio <= 70) {
    riskLevel = 'high';
    suggestions.push('⚠️ 负债率过高，存在较大财务风险');
    suggestions.push('强烈建议增加收入或延长贷款期限');
    suggestions.push('避免新增债务，优先偿还高利率贷款');
    suggestions.push('建议月收入至少达到：' + Math.ceil(totalDebt / 0.3) + ' 元');
  } else {
    riskLevel = 'critical';
    suggestions.push('🚨 负债率严重超标，财务风险极高');
    suggestions.push('必须立即调整财务计划');
    suggestions.push('考虑延长贷款期限或寻求债务重组');
    suggestions.push('建议咨询专业财务顾问');
    suggestions.push('安全月收入应达到：' + Math.ceil(totalDebt / 0.3) + ' 元');
  }

  // 计算建议收入（负债率不超过30%为安全线）
  const recommendedIncome = Math.ceil(totalDebt / 0.3);

  return {
    riskLevel,
    debtRatio,
    recommendedIncome,
    suggestions,
  };
}

/**
 * 计算组合贷款（商业贷款 + 公积金贷款）
 */
export function calculateCombinedLoan(
  commercialAmount: number,
  commercialRate: number,
  providentAmount: number,
  providentRate: number,
  months: number,
  paymentType: 'equal-payment' | 'equal-principal' = 'equal-payment'
): {
  commercial: LoanResult;
  provident: LoanResult;
  total: {
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  };
} {
  const calculateFn =
    paymentType === 'equal-payment'
      ? calculateEqualPayment
      : calculateEqualPrincipal;

  const commercial = calculateFn(commercialAmount, commercialRate, months);
  const provident = calculateFn(providentAmount, providentRate, months);

  return {
    commercial,
    provident,
    total: {
      monthlyPayment: commercial.monthlyPayment + provident.monthlyPayment,
      totalPayment: commercial.totalPayment + provident.totalPayment,
      totalInterest: commercial.totalInterest + provident.totalInterest,
    },
  };
}
