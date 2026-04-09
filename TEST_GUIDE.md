# ForecastPro 多数据集测试指南

## 📊 新增示例数据集

项目现在包含3个示例数据集：

### 1. 原始需求数据 (`example_data.csv`)
```
date,demand,promotion,price,holiday
2023-01-01,100,0,10.0,1
...
```

### 2. 成本数据 (`example_cost_data.csv`)
```
date,cost,raw_material_price,labor_cost,energy_cost,production_volume,quality_issue
2023-01-01,15000,8000,4000,1000,1000,0
...
```
- **预测目标**: `cost` (总成本)
- **协变量**: 原材料成本、人工成本、能源成本、生产量、质量问题标记

### 3. 销售数据 (`example_sales_data.csv`)
```
date,sales_revenue,units_sold,avg_price,marketing_spend,customer_count,competitor_price,seasonality_index,new_product_launch
2023-01-01,50000,1000,50.0,5000,800,48.0,1.2,0
...
```
- **预测目标**: `sales_revenue` (销售收入)
- **协变量**: 销售数量、平均价格、营销支出、客户数、竞争对手价格、季节性指数、新产品上市标记

## 🚀 测试方法

### 方法一：通过仪表板上传（推荐）

1. **打开仪表板**: [http://localhost:8501](http://localhost:8501)
2. **导航到"数据管理"页面**
3. **上传数据文件**:
   - 点击"选择数据文件"按钮
   - 选择 `example_cost_data.csv` 或 `example_sales_data.csv`
4. **配置列设置**:
   - **时间列**: `date` (会自动识别)
   - **需求列**: 选择预测目标列
     - 成本数据: `cost`
     - 销售数据: `sales_revenue`
5. **初始化Agent**:
   - 点击"初始化ForecastPro Agent"按钮
6. **运行预测管道**:
   - 导航到"预测结果"页面
   - 点击"运行完整预测管道"按钮

### 方法二：通过Python脚本测试

运行提供的测试脚本：

```bash
# 测试成本数据
python3 test_cost_data.py

# 或分别测试
python3 -c "
from forecastpro import ForecastProAgent

# 测试成本预测
agent = ForecastProAgent(time_col='date', demand_col='cost', freq='D')
agent.load_data('example_cost_data.csv')
agent.prepare_data()
agent.run_baseline_models()
agent.run_advanced_models()
agent.evaluate_models()
agent.generate_forecast()
report = agent.generate_report()
print(f'最佳模型: {report[\"best_model\"][\"name\"]}')
print(f'MAPE: {report[\"best_model\"][\"metrics\"][\"MAPE\"]:.2f}%')
"
```

## 🔧 自定义数据格式要求

### 基本格式
```csv
date,target_variable,covariate1,covariate2,...
YYYY-MM-DD,数值,数值,数值,...
```

### 必填列
1. **时间列**: 标准日期格式 (YYYY-MM-DD)
2. **目标列**: 要预测的数值变量 (如成本、销售收入、需求等)

### 可选列
- 数值型协变量: 其他影响目标的数值变量
- 分类/标记变量: 0/1 或分类编码

## 📈 预期结果

### 成本数据预测
- **最佳模型**: 可能是线性回归（测试中表现最佳，MAPE≈0.00%）
- **业务洞察**: 成本增长趋势、波动性分析
- **行动建议**: 成本控制、采购策略建议

### 销售数据预测  
- **最佳模型**: 根据数据特征自动选择
- **业务洞察**: 销售趋势、季节性、竞争影响
- **行动建议**: 库存管理、营销策略调整

## ⚠️ 注意事项

1. **数据量要求**: 建议至少30个观测值
2. **数据质量**: 检查缺失值和异常值
3. **频率设置**: 根据数据选择正确频率（D=日，W=周，M=月）
4. **协变量处理**: Agent会自动识别数值型协变量

## 🔍 故障排除

### 常见问题
1. **上传失败**: 检查文件格式（支持CSV、Excel）
2. **列识别错误**: 手动指定时间列和需求列
3. **预测错误**: 检查数据是否有缺失值

### 日志查看
```bash
# 查看仪表板日志
tail -f dashboard.log

# 查看Agent输出
python3 test_cost_data.py 2>&1 | grep -A5 -B5 "Error\|Exception"
```

## 📁 文件清单

- `example_data.csv` - 原始需求数据
- `example_cost_data.csv` - 成本数据（新增）
- `example_sales_data.csv` - 销售数据（新增）
- `test_cost_data.py` - 成本数据测试脚本
- `forecastpro.py` - ForecastPro Agent核心
- `dashboard.py` - Streamlit仪表板

## 💡 业务应用场景

### 成本预测
- 预算编制
- 成本控制
- 采购计划优化

### 销售预测  
- 库存管理
- 营销策略制定
- 生产计划安排

### 需求预测
- 供应链优化
- 产能规划
- 人力资源调配