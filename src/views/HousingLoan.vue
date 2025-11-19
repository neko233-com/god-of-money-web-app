<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="page-header">
        <h1>🏠 购房贷款计算器</h1>
        <p>公积金贷款 + 商业贷款组合计算</p>
      </div>

    <el-card class="calculator-card">
      <h2>购房贷款参数</h2>
      
      <el-form :model="form" label-width="140px" class="loan-form">
        <el-divider content-position="left">房屋信息</el-divider>
        
        <el-form-item label="房屋总价">
          <el-input-number
            v-model="form.housePrice"
            :min="100000"
            :max="100000000"
            :step="10000"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="首付比例">
          <el-slider
            v-model="form.downPaymentRatio"
            :min="20"
            :max="80"
            :step="5"
            show-input
          />
          <span class="unit">%</span>
        </el-form-item>

        <el-form-item label="首付金额">
          <el-input
            :value="downPayment.toLocaleString()"
            disabled
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="贷款总额">
          <el-input
            :value="totalLoan.toLocaleString()"
            disabled
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-divider content-position="left">公积金贷款</el-divider>

        <el-form-item label="公积金贷款额度">
          <el-input-number
            v-model="form.providentAmount"
            :min="0"
            :max="totalLoan"
            :step="10000"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="公积金贷款利率">
          <el-input-number
            v-model="form.providentRate"
            :min="0.1"
            :max="10"
            :step="0.1"
            :precision="2"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">%</span>
        </el-form-item>

        <el-divider content-position="left">商业贷款</el-divider>

        <el-form-item label="商业贷款额度">
          <el-input
            :value="commercialAmount.toLocaleString()"
            disabled
            style="width: 100%"
          />
          <span class="unit">元（自动计算）</span>
        </el-form-item>

        <el-form-item label="商业贷款利率">
          <el-input-number
            v-model="form.commercialRate"
            :min="0.1"
            :max="20"
            :step="0.1"
            :precision="2"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">%</span>
        </el-form-item>

        <el-divider content-position="left">还款设置</el-divider>

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

        <el-form-item label="还款方式">
          <el-radio-group v-model="form.paymentType">
            <el-radio value="equal-payment">等额本息</el-radio>
            <el-radio value="equal-principal">等额本金</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-divider content-position="left">财务状况</el-divider>

        <el-form-item label="家庭月收入">
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
            计算购房贷款
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div v-if="result" class="result-section">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="result-card highlight">
            <div class="result-item">
              <div class="label">每月总还款</div>
              <div class="value primary">¥{{ result.total.monthlyPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="result-card">
            <div class="result-item">
              <div class="label">还款总额</div>
              <div class="value">¥{{ result.total.totalPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="result-card">
            <div class="result-item">
              <div class="label">总利息</div>
              <div class="value warning">¥{{ result.total.totalInterest.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 详细分解 -->
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <el-card>
            <h3>🏦 公积金贷款明细</h3>
            <div class="detail-item">
              <span>贷款金额：</span>
              <span>¥{{ form.providentAmount.toLocaleString() }}</span>
            </div>
            <div class="detail-item">
              <span>月供：</span>
              <span class="highlight-text">¥{{ result.provident.monthlyPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="detail-item">
              <span>总还款：</span>
              <span>¥{{ result.provident.totalPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="detail-item">
              <span>利息：</span>
              <span>¥{{ result.provident.totalInterest.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <h3>🏢 商业贷款明细</h3>
            <div class="detail-item">
              <span>贷款金额：</span>
              <span>¥{{ commercialAmount.toLocaleString() }}</span>
            </div>
            <div class="detail-item">
              <span>月供：</span>
              <span class="highlight-text">¥{{ result.commercial.monthlyPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="detail-item">
              <span>总还款：</span>
              <span>¥{{ result.commercial.totalPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
            </div>
            <div class="detail-item">
              <span>利息：</span>
              <span>¥{{ result.commercial.totalInterest.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 风险评估 -->
      <el-card v-if="risk" class="risk-card" :class="`risk-${risk.riskLevel}`">
        <h2>📊 购房财务风险评估</h2>
        <div class="risk-content">
          <div class="risk-level">
            <span class="label">风险等级：</span>
            <el-tag :type="getRiskTagType(risk.riskLevel)" size="large">
              {{ getRiskLabel(risk.riskLevel) }}
            </el-tag>
          </div>
          <div class="risk-ratio">
            <span class="label">月供收入比：</span>
            <span class="value">{{ risk.debtRatio.toFixed(2) }}%</span>
            <el-progress
              :percentage="Math.min(risk.debtRatio, 100)"
              :color="getProgressColor(risk.debtRatio)"
              :stroke-width="20"
            />
          </div>
          <div class="recommended-income">
            <span class="label">建议家庭月收入：</span>
            <span class="value">¥{{ risk.recommendedIncome.toLocaleString() }}</span>
          </div>
          
          <div class="suggestions">
            <h3>💡 购房财务建议</h3>
            <ul>
              <li v-for="(suggestion, index) in risk.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </el-card>

      <!-- AI 建议 -->
      <el-card v-if="form.income > 0" class="ai-card">
        <h2>🤖 AI 购房财务规划</h2>
        <el-button
          v-if="!store.aiSuggestions.length"
          type="primary"
          @click="getAISuggestions"
          :loading="store.isLoadingAI"
        >
          获取 AI 购房建议
        </el-button>
        <div v-else class="ai-suggestions">
          <div v-for="(suggestion, index) in store.aiSuggestions" :key="index" class="ai-item">
            {{ suggestion }}
          </div>
        </div>
      </el-card>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useLoanStore } from '../stores/loan';
import {
  calculateCombinedLoan,
  assessRisk,
  type RiskAssessment,
} from '../utils/loanCalculator';

const store = useLoanStore();

const form = reactive({
  housePrice: 3000000,
  downPaymentRatio: 30,
  providentAmount: 800000,
  providentRate: 3.25,
  commercialRate: 4.9,
  years: 25,
  paymentType: 'equal-payment' as 'equal-payment' | 'equal-principal',
  income: 30000,
  otherDebts: 0,
});

const downPayment = computed(() => {
  return Math.floor(form.housePrice * (form.downPaymentRatio / 100));
});

const totalLoan = computed(() => {
  return form.housePrice - downPayment.value;
});

const commercialAmount = computed(() => {
  return Math.max(0, totalLoan.value - form.providentAmount);
});

const result = ref<any>(null);
const risk = ref<RiskAssessment | null>(null);

function calculate() {
  const months = form.years * 12;
  
  result.value = calculateCombinedLoan(
    commercialAmount.value,
    form.commercialRate,
    form.providentAmount,
    form.providentRate,
    months,
    form.paymentType
  );

  if (form.income > 0) {
    risk.value = assessRisk(
      result.value.total.monthlyPayment,
      form.income,
      form.otherDebts
    );
    store.setRiskAssessment(risk.value);
  }
}

async function getAISuggestions() {
  if (result.value && risk.value) {
    await store.generateAISuggestions({
      loanAmount: totalLoan.value,
      monthlyPayment: result.value.total.monthlyPayment,
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
  max-width: 100%;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow-y: auto;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
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

.result-card.highlight {
  border: 2px solid #409eff;
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

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-item:last-child {
  border-bottom: none;
}

.highlight-text {
  color: #409eff;
  font-weight: bold;
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

h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}
</style>
