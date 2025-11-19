import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { LoanResult, RiskAssessment } from '../utils/loanCalculator';

export const useLoanStore = defineStore('loan', () => {
  // 贷款计算结果
  const loanResult = ref<LoanResult | null>(null);
  
  // 风险评估结果
  const riskAssessment = ref<RiskAssessment | null>(null);
  
  // 用户月收入
  const monthlyIncome = ref<number>(0);
  
  // 其他月债务
  const otherDebts = ref<number>(0);

  // AI 建议内容
  const aiSuggestions = ref<string[]>([]);
  const isLoadingAI = ref(false);

  // 设置贷款计算结果
  function setLoanResult(result: LoanResult) {
    loanResult.value = result;
  }

  // 设置风险评估结果
  function setRiskAssessment(assessment: RiskAssessment) {
    riskAssessment.value = assessment;
  }

  // 设置月收入
  function setMonthlyIncome(income: number) {
    monthlyIncome.value = income;
  }

  // 设置其他债务
  function setOtherDebts(debts: number) {
    otherDebts.value = debts;
  }

  // 模拟 AI 建议（实际项目中应该调用 AI API）
  async function generateAISuggestions(context: {
    loanAmount: number;
    monthlyPayment: number;
    income: number;
    riskLevel: string;
  }) {
    isLoadingAI.value = true;
    
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    const suggestions = [
      `基于您 ${context.loanAmount.toLocaleString()} 元的贷款金额和 ${context.income.toLocaleString()} 元的月收入，建议您：`,
      '',
      '💰 **收入规划建议：**',
      `- 当前月供 ${context.monthlyPayment.toLocaleString()} 元，占收入的 ${((context.monthlyPayment / context.income) * 100).toFixed(1)}%`,
      '- 建议保持收入的稳定性，可考虑开展副业增加收入',
      '- 预留至少 3-6 个月的生活费作为应急基金',
      '',
      '📊 **支出优化建议：**',
      '- 制定详细的月度预算，控制非必要开支',
      '- 优先偿还高利率债务',
      '- 考虑使用记账软件跟踪日常开销',
      '',
      '🎯 **长期财务规划：**',
      '- 建议配置适当的商业保险（重疾、意外等）',
      '- 每年进行一次财务健康检查',
      '- 考虑投资理财，但要控制风险',
    ];

    if (context.riskLevel === 'high' || context.riskLevel === 'critical') {
      suggestions.push('');
      suggestions.push('⚠️ **紧急提醒：**');
      suggestions.push('- 您的负债率偏高，建议尽快咨询专业财务顾问');
      suggestions.push('- 避免使用信用卡透支和消费贷款');
      suggestions.push('- 必要时可考虑延长贷款期限以降低月供压力');
    }

    aiSuggestions.value = suggestions;
    isLoadingAI.value = false;
  }

  return {
    loanResult,
    riskAssessment,
    monthlyIncome,
    otherDebts,
    aiSuggestions,
    isLoadingAI,
    setLoanResult,
    setRiskAssessment,
    setMonthlyIncome,
    setOtherDebts,
    generateAISuggestions,
  };
});
