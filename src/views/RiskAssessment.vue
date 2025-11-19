<template>
  <div class="page-container">
    <div class="page-header">
      <h1>📊 财务风险评估</h1>
      <p>全方位评估您的财务健康状况</p>
    </div>

    <el-card class="input-card">
      <h2>财务状况录入</h2>
      <el-form :model="form" label-width="140px" class="assessment-form">
        <el-divider content-position="left">收入情况</el-divider>
        
        <el-form-item label="家庭月收入">
          <el-input-number
            v-model="form.monthlyIncome"
            :min="0"
            :max="10000000"
            :step="1000"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="年终奖/分红">
          <el-input-number
            v-model="form.yearlyBonus"
            :min="0"
            :max="10000000"
            :step="10000"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元/年</span>
        </el-form-item>

        <el-divider content-position="left">支出与债务</el-divider>

        <el-form-item label="房贷月供">
          <el-input-number
            v-model="form.housingLoan"
            :min="0"
            :max="1000000"
            :step="100"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="车贷月供">
          <el-input-number
            v-model="form.carLoan"
            :min="0"
            :max="100000"
            :step="100"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="其他贷款月供">
          <el-input-number
            v-model="form.otherLoans"
            :min="0"
            :max="100000"
            :step="100"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="信用卡月均还款">
          <el-input-number
            v-model="form.creditCard"
            :min="0"
            :max="100000"
            :step="100"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="月生活支出">
          <el-input-number
            v-model="form.livingExpense"
            :min="0"
            :max="100000"
            :step="500"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-divider content-position="left">资产储备</el-divider>

        <el-form-item label="应急储备金">
          <el-input-number
            v-model="form.emergencyFund"
            :min="0"
            :max="10000000"
            :step="10000"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item label="投资理财资产">
          <el-input-number
            v-model="form.investments"
            :min="0"
            :max="100000000"
            :step="10000"
            controls-position="right"
            style="width: 100%"
          />
          <span class="unit">元</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="assess" size="large">
            开始评估
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div v-if="assessment" class="assessment-result">
      <!-- 综合评分 -->
      <el-card class="score-card" :class="`score-${assessment.level}`">
        <h2>🎯 财务健康综合评分</h2>
        <div class="score-display">
          <div class="score-number">{{ assessment.score }}</div>
          <div class="score-label">{{ assessment.label }}</div>
          <el-progress
            type="dashboard"
            :percentage="assessment.score"
            :color="getScoreColor(assessment.score)"
            :width="200"
            :stroke-width="15"
          />
        </div>
      </el-card>

      <!-- 详细分析 -->
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <el-card>
            <h3>💰 收支分析</h3>
            <div class="analysis-item">
              <div class="label">月总收入：</div>
              <div class="value">¥{{ form.monthlyIncome.toLocaleString() }}</div>
            </div>
            <div class="analysis-item">
              <div class="label">月总支出：</div>
              <div class="value danger">¥{{ totalExpense.toLocaleString() }}</div>
            </div>
            <div class="analysis-item">
              <div class="label">月结余：</div>
              <div class="value" :class="monthlySurplus >= 0 ? 'success' : 'danger'">
                ¥{{ monthlySurplus.toLocaleString() }}
              </div>
            </div>
            <div class="analysis-item">
              <div class="label">储蓄率：</div>
              <div class="value">{{ savingRate.toFixed(1) }}%</div>
            </div>
            <el-progress
              :percentage="Math.min(savingRate, 100)"
              :color="getSavingRateColor(savingRate)"
              :stroke-width="15"
            />
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <h3>⚠️ 债务分析</h3>
            <div class="analysis-item">
              <div class="label">月债务总额：</div>
              <div class="value danger">¥{{ totalDebt.toLocaleString() }}</div>
            </div>
            <div class="analysis-item">
              <div class="label">负债收入比：</div>
              <div class="value">{{ debtRatio.toFixed(1) }}%</div>
            </div>
            <div class="analysis-item">
              <div class="label">风险等级：</div>
              <el-tag :type="getRiskTagType(assessment.riskLevel)">
                {{ getRiskLabel(assessment.riskLevel) }}
              </el-tag>
            </div>
            <el-progress
              :percentage="Math.min(debtRatio, 100)"
              :color="getDebtRatioColor(debtRatio)"
              :stroke-width="15"
            />
          </el-card>
        </el-col>
      </el-row>

      <!-- 应急储备评估 -->
      <el-card style="margin-top: 20px">
        <h3>🛡️ 应急储备评估</h3>
        <div class="emergency-analysis">
          <div class="info-item">
            <span class="label">当前应急储备：</span>
            <span class="value">¥{{ form.emergencyFund.toLocaleString() }}</span>
          </div>
          <div class="info-item">
            <span class="label">月支出：</span>
            <span class="value">¥{{ totalExpense.toLocaleString() }}</span>
          </div>
          <div class="info-item">
            <span class="label">可支撑月数：</span>
            <span class="value" :class="emergencyMonths >= 6 ? 'success' : 'warning'">
              {{ emergencyMonths.toFixed(1) }} 个月
            </span>
          </div>
          <div class="info-item">
            <span class="label">建议储备：</span>
            <span class="value">¥{{ recommendedEmergency.toLocaleString() }}</span>
            <span class="tip">（6个月支出）</span>
          </div>
          <el-progress
            :percentage="Math.min((form.emergencyFund / recommendedEmergency) * 100, 100)"
            :color="getEmergencyColor((form.emergencyFund / recommendedEmergency) * 100)"
            :stroke-width="20"
          >
            <template #default="{ percentage }">
              <span>{{ percentage.toFixed(0) }}%</span>
            </template>
          </el-progress>
        </div>
      </el-card>

      <!-- 专业建议 -->
      <el-card class="suggestions-card">
        <h2>💡 专业财务建议</h2>
        <el-timeline>
          <el-timeline-item
            v-for="(suggestion, index) in assessment.suggestions"
            :key="index"
            :type="getSuggestionType(index)"
            :icon="getSuggestionIcon(index)"
          >
            {{ suggestion }}
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <!-- AI 深度分析 -->
      <el-card class="ai-card">
        <h2>🤖 AI 深度财务分析</h2>
        <el-button
          v-if="!aiAnalysis"
          type="primary"
          @click="getAIAnalysis"
          :loading="loadingAI"
          size="large"
        >
          获取 AI 个性化财务规划建议
        </el-button>
        <div v-else class="ai-content">
          <div v-for="(item, index) in aiAnalysis" :key="index" class="ai-section">
            {{ item }}
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { WarningFilled, InfoFilled } from '@element-plus/icons-vue';

const form = reactive({
  monthlyIncome: 25000,
  yearlyBonus: 50000,
  housingLoan: 8000,
  carLoan: 3000,
  otherLoans: 0,
  creditCard: 2000,
  livingExpense: 6000,
  emergencyFund: 100000,
  investments: 200000,
});

const assessment = ref<any>(null);
const aiAnalysis = ref<string[] | null>(null);
const loadingAI = ref(false);

const totalDebt = computed(() => {
  return form.housingLoan + form.carLoan + form.otherLoans + form.creditCard;
});

const totalExpense = computed(() => {
  return totalDebt.value + form.livingExpense;
});

const monthlySurplus = computed(() => {
  return form.monthlyIncome - totalExpense.value;
});

const savingRate = computed(() => {
  if (form.monthlyIncome === 0) return 0;
  return (monthlySurplus.value / form.monthlyIncome) * 100;
});

const debtRatio = computed(() => {
  if (form.monthlyIncome === 0) return 0;
  return (totalDebt.value / form.monthlyIncome) * 100;
});

const emergencyMonths = computed(() => {
  if (totalExpense.value === 0) return 0;
  return form.emergencyFund / totalExpense.value;
});

const recommendedEmergency = computed(() => {
  return totalExpense.value * 6;
});

function assess() {
  const score = calculateScore();
  const level = getLevel(score);
  const riskLevel = getRiskLevelByDebtRatio(debtRatio.value);
  const suggestions = generateSuggestions();

  assessment.value = {
    score,
    level,
    label: getScoreLabel(score),
    riskLevel,
    suggestions,
  };
}

function calculateScore(): number {
  let score = 100;

  // 负债率扣分（权重40%）
  if (debtRatio.value > 70) score -= 40;
  else if (debtRatio.value > 50) score -= 30;
  else if (debtRatio.value > 30) score -= 15;

  // 储蓄率扣分（权重30%）
  if (savingRate.value < 0) score -= 30;
  else if (savingRate.value < 10) score -= 20;
  else if (savingRate.value < 20) score -= 10;

  // 应急储备扣分（权重30%）
  if (emergencyMonths.value < 3) score -= 30;
  else if (emergencyMonths.value < 6) score -= 15;

  return Math.max(0, score);
}

function getLevel(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'poor';
  return 'critical';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return '优秀 🌟';
  if (score >= 75) return '良好 ✓';
  if (score >= 60) return '中等 ⚠️';
  if (score >= 40) return '较差 ⚠️';
  return '危险 🚨';
}

function getRiskLevelByDebtRatio(ratio: number): string {
  if (ratio <= 30) return 'low';
  if (ratio <= 50) return 'medium';
  if (ratio <= 70) return 'high';
  return 'critical';
}

function generateSuggestions(): string[] {
  const suggestions: string[] = [];

  // 负债建议
  if (debtRatio.value > 50) {
    suggestions.push('⚠️ 您的负债率偏高，建议优先偿还高利率债务，降低财务风险');
    suggestions.push('考虑增加收入来源或延长低利率贷款期限来降低月供压力');
  } else if (debtRatio.value > 30) {
    suggestions.push('负债率处于合理偏高水平，建议控制新增债务');
  } else {
    suggestions.push('✓ 负债率健康，请继续保持');
  }

  // 储蓄建议
  if (savingRate.value < 10) {
    suggestions.push('⚠️ 储蓄率过低，建议制定详细的月度预算，减少非必要开支');
    suggestions.push('尝试使用记账软件跟踪支出，找出可优化的支出项目');
  } else if (savingRate.value < 20) {
    suggestions.push('储蓄率偏低，建议提升至20%以上以应对未来不确定性');
  } else {
    suggestions.push('✓ 储蓄率良好，建议将结余进行合理配置');
  }

  // 应急储备建议
  if (emergencyMonths.value < 3) {
    suggestions.push('🚨 应急储备严重不足！建议立即开始积累应急基金');
    suggestions.push(`至少需要储备 ${recommendedEmergency.value.toLocaleString()} 元（6个月支出）`);
  } else if (emergencyMonths.value < 6) {
    suggestions.push('应急储备不足，建议继续积累至6个月支出水平');
  } else {
    suggestions.push('✓ 应急储备充足，可以考虑进行适度投资理财');
  }

  // 投资建议
  if (form.investments < form.emergencyFund) {
    suggestions.push('在保证应急储备的前提下，可以考虑配置一些稳健型投资产品');
  }

  // 保险建议
  suggestions.push('建议配置必要的保险：重疾险、意外险、寿险（尤其是家庭支柱）');

  // 财务规划
  suggestions.push('建议每季度进行一次财务健康检查，及时调整财务策略');

  return suggestions;
}

async function getAIAnalysis() {
  loadingAI.value = true;
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  aiAnalysis.value = [
    `📈 **收入优化建议：**`,
    `您当前的月收入为 ${form.monthlyIncome.toLocaleString()} 元，加上年终奖平摊后的月均收入约为 ${(form.monthlyIncome + form.yearlyBonus / 12).toLocaleString('zh-CN', { maximumFractionDigits: 0 })} 元。`,
    ``,
    `💼 **职业发展建议：**`,
    `- 持续提升专业技能，争取升职加薪机会`,
    `- 可以考虑发展副业，增加被动收入来源`,
    `- 投资自我教育，参加行业认证课程`,
    ``,
    `💰 **资产配置建议：**`,
    `基于您的财务状况，建议采用以下配置比例：`,
    `- 应急储备（流动性）：${Math.ceil(recommendedEmergency.value).toLocaleString()} 元`,
    `- 稳健型投资（债券、货币基金）：30%`,
    `- 成长型投资（股票、基金）：${assessment.value?.riskLevel === 'low' ? '40%' : '20%'}`,
    `- 保险保障：年收入的 10-15%`,
    ``,
    `🎯 **短期目标（1年内）：**`,
    emergencyMonths.value < 6 
      ? `- 优先目标：建立充足的应急储备金至 ${recommendedEmergency.value.toLocaleString()} 元`
      : `- 优先目标：优化投资组合，提高资产收益率`,
    debtRatio.value > 30 
      ? `- 降低负债率至 30% 以下`
      : `- 保持当前健康的负债水平`,
    `- 建立完整的家庭保险保障体系`,
    ``,
    `📊 **中长期规划（3-5年）：**`,
    `- 预留子女教育基金或购房首付`,
    `- 建立多元化投资组合，实现财富增值`,
    `- 考虑提前还款策略，减少利息支出`,
    `- 规划退休储备，越早开始越好`,
    ``,
    `⚠️ **风险提示：**`,
    `- 避免过度消费，警惕消费贷款陷阱`,
    `- 不要将所有资金投入高风险投资`,
    `- 定期review财务计划，灵活调整策略`,
  ];

  loadingAI.value = false;
}

function getScoreColor(score: number): string {
  if (score >= 90) return '#67c23a';
  if (score >= 75) return '#95de64';
  if (score >= 60) return '#e6a23c';
  if (score >= 40) return '#f56c6c';
  return '#dd0000';
}

function getSavingRateColor(rate: number): string {
  if (rate >= 30) return '#67c23a';
  if (rate >= 20) return '#95de64';
  if (rate >= 10) return '#e6a23c';
  return '#f56c6c';
}

function getDebtRatioColor(ratio: number): string {
  if (ratio <= 30) return '#67c23a';
  if (ratio <= 50) return '#e6a23c';
  if (ratio <= 70) return '#f56c6c';
  return '#dd0000';
}

function getEmergencyColor(percentage: number): string {
  if (percentage >= 100) return '#67c23a';
  if (percentage >= 50) return '#e6a23c';
  return '#f56c6c';
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

function getSuggestionType(index: number): string {
  if (index === 0) return 'primary';
  return 'default';
}

function getSuggestionIcon(index: number) {
  return index === 0 ? WarningFilled : InfoFilled;
}
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
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

.input-card {
  margin-bottom: 20px;
}

.input-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.assessment-form .unit {
  margin-left: 10px;
  color: #909399;
  font-size: 13px;
}

.score-card {
  text-align: center;
  padding: 30px;
}

.score-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.score-number {
  font-size: 72px;
  font-weight: bold;
  color: #409eff;
}

.score-label {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.score-excellent .score-number { color: #67c23a; }
.score-good .score-number { color: #95de64; }
.score-medium .score-number { color: #e6a23c; }
.score-poor .score-number { color: #f56c6c; }
.score-critical .score-number { color: #dd0000; }

.analysis-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.analysis-item:last-of-type {
  border-bottom: none;
  margin-bottom: 15px;
}

.analysis-item .label {
  font-weight: 500;
  color: #606266;
}

.analysis-item .value {
  font-weight: bold;
  color: #2c3e50;
}

.analysis-item .value.success {
  color: #67c23a;
}

.analysis-item .value.danger {
  color: #f56c6c;
}

.analysis-item .value.warning {
  color: #e6a23c;
}

h3 {
  margin-top: 0;
  color: #2c3e50;
}

.emergency-analysis {
  padding: 10px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-of-type {
  border-bottom: none;
  margin-bottom: 15px;
}

.info-item .label {
  font-weight: 500;
  color: #606266;
}

.info-item .value {
  font-weight: bold;
  color: #2c3e50;
}

.info-item .tip {
  color: #909399;
  font-size: 12px;
  margin-left: 5px;
}

.suggestions-card {
  margin-top: 20px;
}

.suggestions-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.ai-card {
  margin-top: 20px;
}

.ai-card h2 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 20px;
}

.ai-content {
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
  line-height: 1.8;
}

.ai-section {
  margin: 8px 0;
  white-space: pre-wrap;
}
</style>
