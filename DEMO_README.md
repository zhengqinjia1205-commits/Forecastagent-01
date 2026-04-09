# ForecastPro Agent 演示

修复了处理"具体到时间的CSV数据集"的问题后，现在提供以下本地展示渠道。

## 快速开始

### 1. 一键演示（推荐）
```bash
python3 demo_simple.py
```
这将运行一个完整的演示，展示所有修复的功能。

### 2. 交互式演示
```bash
python3 demo.py
```
提供一个交互式菜单，可以选择不同的演示选项。

### 3. 功能展示
```bash
python3 showcase.py
```
详细展示修复的功能和对比。

## 演示内容

### 修复的问题
1. **时间列识别失败** - 现在支持 `TxnDate`、`TxnTime`、`Date`、`TIME` 等列名
2. **日期时间分离** - 自动合并分离的日期和时间列（如 `TxnDate + TxnTime → datetime`）
3. **重复时间索引** - 检测并处理重复的时间点
4. **不规则时间序列** - 智能判断是否应用 `asfreq()`，避免创建大量 NaN
5. **需求列识别** - 支持 `consumption`、`cost`、`sales_revenue`、`revenue` 等列名
6. **数据清理** - 自动删除 `Unnamed: 0` 等索引列
7. **错误处理** - 安全处理除零错误等问题

### 测试文件
演示包含以下示例文件：

| 文件 | 描述 | 特点 |
|------|------|------|
| `example_data.csv` | 标准日期格式 | 规则时间序列 |
| `example_sales_data.csv` | 销售数据 | 多协变量 |
| `example_cost_data.csv` | 成本数据 | 成本预测 |
| `KwhConsumptionBlower78_2.csv` | **原始问题文件** | 分离的日期时间列，不规则时间序列 |

## 命令行选项

### demo.py（主演示脚本）
```bash
# 列出所有示例文件
python3 demo.py --list

# 测试所有文件（快速）
python3 demo.py --all --quick

# 测试所有文件（完整管道）
python3 demo.py --all

# 测试特定文件
python3 demo.py --file KwhConsumptionBlower78_2.csv

# 显示修复的问题
python3 demo.py --issues

# 运行示例演示
python3 demo.py --demo
```

### showcase.py（功能展示）
```bash
# 完整功能展示
python3 showcase.py
```

## 演示输出示例

运行 `python3 demo_simple.py` 将显示：

```
🎬 FORECASTPRO AGENT 功能演示
========================================================================

🔧 修复的关键问题:
--------------------------------------------------
  ✅ 时间列识别: 支持TxnDate/TxnTime等列名
  ✅ 日期时间合并: 自动合并分离的日期和时间列
  ✅ 不规则序列: 智能处理不规则时间间隔
  ✅ 需求列识别: 支持consumption/cost/revenue等
  ✅ 数据清理: 删除不必要的索引列
  ✅ 错误处理: 安全处理除零错误等

📁 原始问题文件处理演示:
--------------------------------------------------
文件: KwhConsumptionBlower78_2.csv
特点: 分离的TxnDate/TxnTime列，不规则时间序列
  原始形状: (630, 4)
  原始列: ['Unnamed: 0', 'TxnDate', 'TxnTime', 'Consumption']

  🤖 Agent处理:
    ✓ 时间列: datetime
    ✓ 需求列: Consumption
    ✓ 处理后形状: (629, 1)
    ✓ 已处理重复索引
    ✓ 成功合并TxnDate和TxnTime为datetime索引

📊 所有示例文件处理测试:
--------------------------------------------------
  ✅ example_data.csv                    -> ✅
  ✅ example_sales_data.csv              -> ✅
  ✅ example_cost_data.csv               -> ✅
  ✅ KwhConsumptionBlower78_2.csv        -> ✅

🔄 功能对比:
--------------------------------------------------
  功能             修复前            修复后
  时间列识别       有限支持          扩展支持
  日期时间处理     单列处理          自动合并
  不规则序列       会失败            智能处理
  数据清理         不清理            自动清理
  错误处理         会崩溃            安全处理

📈 演示总结:
- 测试了 4 个CSV文件
- 成功处理 4/4 个文件
- 修复了处理具体到时间的CSV数据集的问题

🚀 下一步操作:
1. 运行交互式演示: python3 demo.py
2. 测试完整管道: python3 demo.py --all
3. 查看修复详情: python3 demo.py --issues
```

## 代码修复详情

### 主要修复文件：`forecastpro.py`

1. **第155行**：扩展时间列识别
   ```python
   time_candidates = ['date', 'time', 'timestamp', 'datetime', 'Date', 'Time', 'TxnDate', 'TxnTime', ...]
   ```

2. **第174行**：扩展需求列识别
   ```python
   demand_candidates = ['demand', 'sales', 'quantity', 'volume', 'y', 'target', 'consumption', 'Consumption', ...]
   ```

3. **第185-205行**：日期时间合并逻辑
   ```python
   if self.time_col == 'TxnDate' and 'TxnTime' in df.columns:
       df['datetime'] = pd.to_datetime(df['TxnDate'] + ' ' + df['TxnTime'])
       df = df.set_index('datetime')
   ```

4. **第197-200行**：重复索引处理
   ```python
   if df.index.duplicated().any():
       print(f"警告: 时间索引中有 {df.index.duplicated().sum()} 个重复值")
       df = df[~df.index.duplicated(keep='first')]
   ```

5. **第202-220行**：智能频率调整
   ```python
   time_diffs = df.index.to_series().diff().dropna()
   if time_diffs.nunique() <= 3:  # 相对规则
       df = df.asfreq(self.freq)
   else:
       print("警告: 时间序列不规则，跳过asfreq()")
   ```

## 验证测试

已通过以下测试：
- ✅ 所有示例文件加载成功
- ✅ 自动识别各种列名格式
- ✅ 处理分离的日期时间列
- ✅ 处理不规则时间序列
- ✅ 生成完整的预测管道
- ✅ 生成管理报告

## 问题反馈

如果在演示过程中遇到问题，请检查：
1. 是否安装了必要的依赖：`pandas`, `numpy`, `scikit-learn`, `statsmodels`, `matplotlib`, `seaborn`
2. 示例文件是否在当前目录
3. Python版本是否为3.7+

## 许可证

此演示代码仅供展示修复功能使用。