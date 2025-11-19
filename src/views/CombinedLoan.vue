<template>
  <div class="page-container">
    <div class="page-header">
      <h1>🔗 组合贷款计算器</h1>
      <p>灵活组合商业贷款和公积金贷款</p>
    </div>

    <el-alert
      title="组合贷款说明"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    >
      组合贷款是指同时使用公积金贷款和商业贷款购房。公积金贷款利率较低，但额度有限；商业贷款额度较高，利率相对较高。合理组合可以降低还款压力。
    </el-alert>

    <el-card class="calculator-card">
      <h2>组合贷款设置</h2>
      
      <el-form :model="form" label-width="140px" class="loan-form">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="📋 快速计算" name="quick">
            <el-form-item label="贷款总额">
              <el-input-number
                v-model="form.totalAmount"
                :min="100000"
                :max="50000000"
                :step="10000"
                controls-position="right"
                style="width: 100%"
              />
              <span class="unit">元</span>
            </el-form-item>

            <el-form-item label="公积金贷款额度">
              <el-slider
                v-model="form.providentRatio"
                :min="0"
                :max="100"
                :step="5"
                show-input
              />
              <span class="unit">%（占总额比例）</span>
            </el-form-item>

            <el-form-item label="公积金金额">
              <el-input
                :value="providentAmount.toLocaleString()"
                disabled
                style="width: 100%"
              />
              <span class="unit">元</span>
            </el-form-item>

            <el-form-item label="商业贷款金额">
              <el-input
                :value="commercialAmount.toLocaleString()"
                disabled
                style="width: 100%"
              />
              <span class="unit">元</span>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="⚙️ 自定义配置" name="custom">
            <el-form-item label="公积金贷款额">
              <el-input-number
                v-model="form.customProvident"
                :min="0"
                :max="10000000"
                :step="10000"
                controls-position="right"
                style="width: 100%"
              />
              <span class="unit">元</span>
            </el-form-item>

            <el-form-item label="商业贷款额">
              <el-input-number
                v-model="form.customCommercial"
                :min="0"
                :max="50000000"
                :step="10000"
                controls-position="right"
                style="width: 100%"
              />
              <span class="unit">元</span>
            </el-form-item>

            <el-form-item label="总贷款额">
              <el-input
                :value="customTotal.toLocaleString()"
                disabled
                style="width: 100%"
              />
              <span class="unit">元</span>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

        <el-divider></el-divider>

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
          <span class="unit">%（当前基准：3.25%）</span>
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
          <span class="unit">%（当前LPR：3.95%）</span>
        </el-form-item>

        <el-form-item label="贷款年限">
          <el-radio-group v-model="form.years">
            <el-radio :value="10">10年</el-radio>
            <el-radio :value="15">15年</el-radio>
            <el-radio :value="20">20年</el-radio>
            <el-radio :value="25">25年</el-radio>
            <el-radio :value="30">30年</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="还款方式">
          <el-radio-group v-model="form.paymentType">
            <el-radio value="equal-payment">等额本息</el-radio>
            <el-radio value="equal-principal">等额本金</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-divider content-position="left">财务评估</el-divider>

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
            计算组合贷款
          </el-button>
          <el-button @click="comparePaymentTypes" size="large">
            对比还款方式
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 计算结果 -->
    <div v-if="result" class="result-section">
      <el-card class="summary-card">
        <h2>💰 组合贷款总览</h2>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="summary-item">
              <div class="label">每月总还款</div>
              <div class="value primary">¥{{ result.total.monthlyPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="label">还款总额</div>
              <div class="value">¥{{ result.total.totalPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="label">总利息</div>
              <div class="value warning">¥{{ result.total.totalInterest.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="label">节省利息</div>
              <div class="value success">¥{{ savedInterest.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</div>
              <div class="tip">相比纯商贷</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 贷款明细对比 -->
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <el-card class="detail-card provident-card">
            <h3>🏦 公积金贷款部分</h3>
            <div class="loan-detail">
              <div class="detail-row">
                <span>贷款金额：</span>
                <strong>¥{{ currentProvidentAmount.toLocaleString() }}</strong>
              </div>
              <div class="detail-row">
                <span>年利率：</span>
                <strong>{{ form.providentRate }}%</strong>
              </div>
              <div class="detail-row highlight">
                <span>月供：</span>
                <strong>¥{{ result.provident.monthlyPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</strong>
              </div>
              <div class="detail-row">
                <span>还款总额：</span>
                <span>¥{{ result.provident.totalPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="detail-row">
                <span>支付利息：</span>
                <span>¥{{ result.provident.totalInterest.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="detail-card commercial-card">
            <h3>🏢 商业贷款部分</h3>
            <div class="loan-detail">
              <div class="detail-row">
                <span>贷款金额：</span>
                <strong>¥{{ currentCommercialAmount.toLocaleString() }}</strong>
              </div>
              <div class="detail-row">
                <span>年利率：</span>
                <strong>{{ form.commercialRate }}%</strong>
              </div>
              <div class="detail-row highlight">
                <span>月供：</span>
                <strong>¥{{ result.commercial.monthlyPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</strong>
              </div>
              <div class="detail-row">
                <span>还款总额：</span>
                <span>¥{{ result.commercial.totalPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="detail-row">
                <span>支付利息：</span>
                <span>¥{{ result.commercial.totalInterest.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 风险评估 -->
      <el-card v-if="risk" class="risk-card" :class="`risk-${risk.riskLevel}`">
        <h2>📊 组合贷款风险评估</h2>
        <div class="risk-content">
          <div class="risk-level">
            <span class="label">风险等级：</span>
            <el-tag :type="getRiskTagType(risk.riskLevel)" size="large">
              {{ getRiskLabel(risk.riskLevel) }}
            </el-tag>
          </div>
          <div class="risk-ratio">
            <span class="label">负债收入比：</span>
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
            <h3>💡 组合贷款建议</h3>
            <ul>
              <li v-for="(suggestion, index) in risk.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 还款方式对比 -->
    <el-dialog v-model="compareDialog" title="还款方式对比" width="800px">
      <el-table v-if="comparison" :data="comparisonData" border>
        <el-table-column prop="type" label="还款方式" width="120" />
        <el-table-column prop="monthlyPayment" label="月供" width="150">
          <template #default="{ row }">
            ¥{{ row.monthlyPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalPayment" label="还款总额">
          <template #default="{ row }">
            ¥{{ row.totalPayment.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalInterest" label="总利息">
          <template #default="{ row }">
            ¥{{ row.totalInterest.toLocaleString('zh-CN', { minimumFractionDigits: 2 }) }}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px; color: #909399; font-size: 14px">
        <p>💡 <strong>等额本息：</strong>每月还款金额固定，前期利息多本金少，适合收入稳定的家庭。</p>
        <p>💡 <strong>等额本金：</strong>每月还款递减，前期压力大但总利息少，适合收入较高或有提前还款计划的家庭。</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useLoanStore } from '../stores/loan';
import {
  calculateCombinedLoan,
  calculateEqualPayment,
  assessRisk,
  type RiskAssessment,
} from '../utils/loanCalculator';

const store = useLoanStore();

const activeTab = ref('quick');

const form = reactive({
  totalAmount: 2000000,
  providentRatio: 40,
  customProvident: 800000,
  customCommercial: 1200000,
  providentRate: 3.25,
  commercialRate: 4.9,
  years: 20,
  paymentType: 'equal-payment' as 'equal-payment' | 'equal-principal',
  income: 25000,
  otherDebts: 0,
});

const providentAmount = computed(() => {
  return Math.floor(form.totalAmount * (form.providentRatio / 100));
});

const commercialAmount = computed(() => {
  return form.totalAmount - providentAmount.value;
});

const customTotal = computed(() => {
  return form.customProvident + form.customCommercial;
});

const currentProvidentAmount = computed(() => {
  return activeTab.value === 'quick' ? providentAmount.value : form.customProvident;
});

const currentCommercialAmount = computed(() => {
  return activeTab.value === 'quick' ? commercialAmount.value : form.customCommercial;
});

const result = ref<any>(null);
const risk = ref<RiskAssessment | null>(null);
const savedInterest = ref(0);

const compareDialog = ref(false);
const comparison = ref<any>(null);
const comparisonData = computed(() => {
  if (!comparison.value) return [];
  return [
    {
      type: '等额本息',
      monthlyPayment: comparison.value.equalPayment.total.monthlyPayment,
      totalPayment: comparison.value.equalPayment.total.totalPayment,
      totalInterest: comparison.value.equalPayment.total.totalInterest,
    },
    {
      type: '等额本金（首月）',
      monthlyPayment: comparison.value.equalPrincipal.total.monthlyPayment,
      totalPayment: comparison.value.equalPrincipal.total.totalPayment,
      totalInterest: comparison.value.equalPrincipal.total.totalInterest,
    },
  ];
});

function calculate() {
  const months = form.years * 12;
  const pAmount = currentProvidentAmount.value;
  const cAmount = currentCommercialAmount.value;
  
  result.value = calculateCombinedLoan(
    cAmount,
    form.commercialRate,
    pAmount,
    form.providentRate,
    months,
    form.paymentType
  );

  // 计算纯商贷利息（用于对比）
  const pureCommercial = calculateEqualPayment(
    pAmount + cAmount,
    form.commercialRate,
    months
  );
  savedInterest.value = pureCommercial.totalInterest - result.value.total.totalInterest;

  if (form.income > 0) {
    risk.value = assessRisk(
      result.value.total.monthlyPayment,
      form.income,
      form.otherDebts
    );
    store.setRiskAssessment(risk.value);
  }
}

function comparePaymentTypes() {
  const months = form.years * 12;
  const pAmount = currentProvidentAmount.value;
  const cAmount = currentCommercialAmount.value;
  
  comparison.value = {
    equalPayment: calculateCombinedLoan(
      cAmount,
      form.commercialRate,
      pAmount,
      form.providentRate,
      months,
      'equal-payment'
    ),
    equalPrincipal: calculateCombinedLoan(
      cAmount,
      form.commercialRate,
      pAmount,
      form.providentRate,
      months,
      'equal-principal'
    ),
  };
  
  compareDialog.value = true;
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
  font-size: 13px;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 20px;
}

.summary-card h2 {
  color: white;
  margin-top: 0;
}

.summary-item {
  text-align: center;
  padding: 10px;
}

.summary-item .label {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.summary-item .value {
  font-size: 24px;
  font-weight: bold;
}

.summary-item .value.primary {
  color: #ffd700;
}

.summary-item .value.success {
  color: #67c23a;
}

.summary-item .value.warning {
  color: #ffeb3b;
}

.summary-item .tip {
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.7;
}

.detail-card {
  height: 100%;
}

.detail-card h3 {
  margin-top: 0;
  color: #2c3e50;
}

.provident-card {
  border-left: 4px solid #67c23a;
}

.commercial-card {
  border-left: 4px solid #409eff;
}

.loan-detail {
  padding: 10px 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row.highlight {
  background: #f8f9fa;
  padding: 12px 10px;
  margin: 0 -10px;
  font-size: 16px;
}

.risk-card {
  margin-top: 20px;
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
