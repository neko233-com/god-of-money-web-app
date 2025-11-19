<template>
  <div class="page-container">
    <div class="page-header">
      <h1>🏢 商业贷款计算器</h1>
      <p>专业的商业贷款计算与风险评估工具</p>
    </div>

    <el-card class="calculator-card">
      <h2>贷款参数设置</h2>
      
      <el-form :model="form" label-width="120px" class="loan-form">
        <el-form-item label="贷款金额">
          <el-input-number
            v-model="form.principal"
            :min="10000"
            :max="100000000"
            :step="10000"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="贷款年限">
          <el-input-number
            v-model="form.years"
            :min="1"
            :max="30"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">年</span>
        </el-form-item>

        <el-form-item label="年利率">
          <el-input-number
            v-model="form.rate"
            :min="0.1"
            :max="20"
            :step="0.1"
            :precision="2"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">%</span>
        </el-form-item>

        <el-form-item label="还款方式">
          <el-radio-group v-model="form.paymentType">
            <el-radio value="equal-payment">等额本息</el-radio>
            <el-radio value="equal-principal">等额本金</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="月收入">
          <el-input-number
            v-model="form.income"
            :min="0"
            :max="10000000"
            :step="1000"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="其他月债务">
          <el-input-number
            v-model="form.otherDebts"
            :min="0"
            :max="1000000"
            :step="100"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="calculate" size="large">
            计算贷款
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div v-if="result" class="result-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="result-card">
            <div class="result-item">
              <div class="label">月供金额</div>
              <div class="value primary">¥{{ result.monthlyPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="result-card">
            <div class="result-item">
              <div class="label">总还款额</div>
              <div class="value">¥{{ result.totalPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="result-card">
            <div class="result-item">
              <div class="label">总利息</div>
              <div class="value warning">¥{{ result.totalInterest.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 风险评估 -->
      <el-card v-if="risk" class="risk-card" :class="`risk-${risk.riskLevel}`">
        <h2>📊 财务风险评估</h2>
        <div class="risk-content">
          <div class="risk-level">
            <span class="label">风险等级：</span>
            <el-tag :type="getRiskTagType(risk.riskLevel)" size="large">
              {{ getRiskLabel(risk.riskLevel) }}
            </el-tag>
          </div>
          <div class="risk-ratio">
            <span class="label">负债率：</span>
            <span class="value">{{ risk.debtRatio.toFixed(2) }}%</span>
            <el-progress
              :percentage="Math.min(risk.debtRatio, 100)"
              :color="getProgressColor(risk.debtRatio)"
              :stroke-width="20"
            />
          </div>
          <div class="recommended-income">
            <span class="label">建议月收入：</span>
            <span class="value">¥{{ risk.recommendedIncome.toLocaleString() }}</span>
          </div>
          
          <div class="suggestions">
            <h3>💡 专业建议</h3>
            <ul>
              <li v-for="(suggestion, index) in risk.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </el-card>

      <!-- AI 智能建议 -->
      <el-card v-if="form.income > 0" class="ai-card">
        <h2>🤖 AI 智能财务建议</h2>
        <el-button
          v-if="!store.aiSuggestions.length"
          type="primary"
          @click="getAISuggestions"
          :loading="store.isLoadingAI"
        >
          获取 AI 个性化建议
        </el-button>
        <div v-else class="ai-suggestions">
          <div v-for="(suggestion, index) in store.aiSuggestions" :key="index" class="ai-item">
            {{ suggestion }}
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useLoanStore } from '../stores/loan';
import {
  calculateEqualPayment,
  calculateEqualPrincipal,
  assessRisk,
  type LoanResult,
  type RiskAssessment,
} from '../utils/loanCalculator';

const store = useLoanStore();

const form = reactive({
  principal: 1000000,
  years: 20,
  rate: 4.9,
  paymentType: 'equal-payment' as 'equal-payment' | 'equal-principal',
  income: 20000,
  otherDebts: 0,
});

const result = ref<LoanResult | null>(null);
const risk = ref<RiskAssessment | null>(null);

function calculate() {
  const months = form.years * 12;
  
  if (form.paymentType === 'equal-payment') {
    result.value = calculateEqualPayment(form.principal, form.rate, months);
  } else {
    result.value = calculateEqualPrincipal(form.principal, form.rate, months);
  }

  if (form.income > 0) {
    risk.value = assessRisk(result.value.monthlyPayment, form.income, form.otherDebts);
    store.setRiskAssessment(risk.value);
  }

  store.setLoanResult(result.value);
}

async function getAISuggestions() {
  if (result.value && risk.value) {
    await store.generateAISuggestions({
      loanAmount: form.principal,
      monthlyPayment: result.value.monthlyPayment,
      income: form.income,
      riskLevel: risk.value.riskLevel,
    });
  }
}

function getRiskLabel(level: string): string {
  const labels: Record<string, string> = {
    low: '低风险 ✓',
    medium: '中等风险',
    high: '高风险 ⚠️',
    critical: '严重风险 🚨',
  };
  return labels[level] || level;
}

function getRiskTagType(level: string): any {
  const types: Record<string, any> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    critical: 'danger',
  };
  return types[level] || 'info';
}

function getProgressColor(ratio: number): string {
  if (ratio <= 30) return '#67c23a';
  if (ratio <= 50) return '#e6a23c';
  if (ratio <= 70) return '#f56c6c';
  return '#dd0000';
}
</script>

<style scoped>
.page-container {
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  color: #2c3e50;
  margin: 0 0 10px;
}

.page-header p {
  color: #7f8c8d;
  margin: 0;
}

.calculator-card {
  margin-bottom: 20px;
}

.calculator-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.loan-form .unit {
  margin-left: 10px;
  color: #909399;
}

.result-section {
  margin-top: 30px;
}

.result-card {
  text-align: center;
  margin-bottom: 20px;
}

.result-item .label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.result-item .value {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.result-item .value.primary {
  color: #409eff;
}

.result-item .value.warning {
  color: #e6a23c;
}

.risk-card {
  margin-top: 20px;
  margin-bottom: 20px;
}

.risk-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.risk-content > div {
  margin-bottom: 20px;
}

.risk-content .label {
  font-weight: bold;
  margin-right: 10px;
}

.risk-content .value {
  font-size: 18px;
  color: #409eff;
  font-weight: bold;
}

.suggestions {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.suggestions h3 {
  margin-top: 0;
}

.suggestions ul {
  margin: 10px 0;
  padding-left: 20px;
}

.suggestions li {
  margin: 8px 0;
  line-height: 1.6;
}

.ai-card {
  margin-top: 20px;
}

.ai-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.ai-suggestions {
  margin-top: 15px;
  padding: 15px;
  background: #f0f9ff;
  border-radius: 4px;
  line-height: 1.8;
}

.ai-item {
  margin: 5px 0;
  white-space: pre-wrap;
}

.risk-low {
  border-left: 4px solid #67c23a;
}

.risk-medium {
  border-left: 4px solid #e6a23c;
}

.risk-high {
  border-left: 4px solid #f56c6c;
}

.risk-critical {
  border-left: 4px solid #dd0000;
}
</style>
