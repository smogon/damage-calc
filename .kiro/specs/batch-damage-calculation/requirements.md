# 需求文档

## 简介

本功能旨在为宝可梦伤害计算器添加批量计算能力，允许用户一次性计算选中的宝可梦配置与44只宝可梦的所有配置之间的伤害数据。这将大大提高用户分析对战策略的效率。

## 术语表

- **System**: 宝可梦伤害计算器系统
- **User**: 使用计算器的用户
- **Pokemon_Configuration**: 宝可梦的完整配置，包括种族值、个体值、努力值、性格、特性、道具和招式
- **Damage_Result**: 伤害计算的结果，包括伤害范围、百分比和击杀概率
- **Batch_Calculation**: 批量计算，指一次性对多个宝可梦配置进行伤害计算
- **Result_Table**: 显示批量计算结果的数据表格
- **Configuration_Set**: 包含最多44个Pokemon_Configuration的集合
- **Configuration_Storage**: 用于持久化存储Configuration_Set的本地存储系统

## 需求

### 需求 1: 批量计算触发

**用户故事:** 作为用户，我希望能够触发批量计算功能，以便一次性获得多个宝可梦配置的伤害数据

#### 验收标准

1. WHEN User clicks the batch calculation button, THE System SHALL initiate damage calculations for the selected Pokemon_Configuration against all available opponent configurations
2. WHEN User has not selected any tier or format, THE System SHALL display an error message indicating that format selection is required
3. WHEN User has not configured the attacking Pokemon_Configuration completely, THE System SHALL use default values for missing attributes
4. THE System SHALL support calculation modes including "one-vs-all" and "all-vs-one"

### 需求 2: 配置集合管理

**用户故事:** 作为用户，我希望能够创建和管理包含44只宝可梦配置的集合，以便在不同的分析场景中使用

#### 验收标准

1. THE System SHALL allow User to create a new Configuration_Set with a unique name
2. THE System SHALL allow User to add Pokemon_Configuration to a Configuration_Set up to a maximum of 44 configurations
3. THE System SHALL allow User to remove Pokemon_Configuration from a Configuration_Set
4. THE System SHALL allow User to edit existing Pokemon_Configuration within a Configuration_Set
5. THE System SHALL display a list of all Pokemon_Configuration in the current Configuration_Set
6. WHEN User attempts to add more than 44 configurations, THE System SHALL display an error message and prevent the addition
7. WHEN User modifies a Pokemon_Configuration without clicking save, THE System SHALL use the modified data as temporary data in calculations
8. WHEN User performs a calculation with temporary modifications, THE System SHALL use the temporary data instead of the saved data
9. WHEN User clicks save after modifying a Pokemon_Configuration, THE System SHALL persist the changes to Configuration_Storage
10. WHEN User discards temporary modifications, THE System SHALL revert to the last saved Pokemon_Configuration data

### 需求 3: 配置持久化存储

**用户故事:** 作为用户，我希望我的配置集合能够被保存，以便下次使用时不需要重新配置

#### 验收标准

1. THE System SHALL store Configuration_Set data in Configuration_Storage using browser local storage
2. WHEN User creates or modifies a Configuration_Set, THE System SHALL automatically save changes to Configuration_Storage
3. WHEN User reopens the application, THE System SHALL load the most recently used Configuration_Set from Configuration_Storage
4. THE System SHALL allow User to save multiple Configuration_Set instances with different names
5. THE System SHALL allow User to switch between different saved Configuration_Set instances

### 需求 4: 配置导入导出

**用户故事:** 作为用户，我希望能够导入和导出配置集合，以便与他人分享或在不同设备间同步

#### 验收标准

1. THE System SHALL provide an export function that generates a JSON file containing the complete Configuration_Set
2. WHEN User clicks the export button, THE System SHALL download a file named with the Configuration_Set name and timestamp
3. THE System SHALL provide an import function that accepts JSON files in the Configuration_Set format
4. WHEN User imports a Configuration_Set file, THE System SHALL validate the file format and data integrity
5. WHEN imported file is invalid, THE System SHALL display an error message describing the validation failure
6. WHEN imported file is valid, THE System SHALL load the Configuration_Set and make it available for use

### 需求 5: 伤害计算执行

**用户故事:** 作为用户，我希望系统能够准确计算每个配置组合的伤害，以便我了解对战中的伤害情况

#### 验收标准

1. WHEN System performs Batch_Calculation, THE System SHALL calculate damage for all four moves of the attacking Pokemon_Configuration
2. WHEN calculating damage, THE System SHALL apply all relevant modifiers including abilities, items, field conditions, and type effectiveness
3. THE System SHALL determine the highest damage move for each Pokemon_Configuration matchup
4. THE System SHALL calculate minimum and maximum damage values for each move
5. THE System SHALL calculate damage as both percentage of total HP and pixel values (based on 48-pixel HP bar)
6. THE System SHALL calculate KO probability for the highest damage move

### 需求 6: 结果展示

**用户故事:** 作为用户，我希望能够清晰地查看批量计算的结果，以便分析和比较不同配置的效果

#### 验收标准

1. WHEN Batch_Calculation completes, THE System SHALL display results in a sortable Result_Table
2. THE Result_Table SHALL include columns for Pokemon name, configuration name, best move, damage percentage, damage pixels, KO chance, types, ability, and item
3. THE System SHALL allow User to sort results by any column
4. THE System SHALL allow User to filter results by Pokemon attributes
5. THE System SHALL display the attacking or defending Pokemon's speed stat after calculation
6. WHEN User hovers over a result row, THE System SHALL highlight the row for better readability

### 需求 7: 性能优化

**用户故事:** 作为用户，我希望批量计算能够快速完成，以便我不需要等待过长时间

#### 验收标准

1. WHEN System performs Batch_Calculation with 44 Pokemon configurations, THE System SHALL complete all calculations within 5 seconds on standard hardware
2. WHEN calculations are in progress, THE System SHALL display a loading indicator to inform User of progress
3. THE System SHALL process calculations efficiently without blocking the user interface
4. WHEN User initiates a new calculation while one is in progress, THE System SHALL cancel the previous calculation and start the new one

### 需求 8: 计算结果导出

**用户故事:** 作为用户，我希望能够导出批量计算的结果，以便在其他工具中进行进一步分析

#### 验收标准

1. THE System SHALL provide an export button in the Result_Table interface
2. WHEN User clicks the export button, THE System SHALL generate a downloadable file containing all calculation results
3. THE System SHALL support exporting results in CSV format
4. THE exported file SHALL include all columns visible in the Result_Table
5. THE exported file SHALL preserve the current sort order of the Result_Table
