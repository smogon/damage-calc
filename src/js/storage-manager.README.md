# StorageManager 使用文档

## 概述

StorageManager 是一个用于管理宝可梦配置集合本地存储的类。它提供了完整的 CRUD 操作，支持多个配置集合的管理，并能记住用户最后使用的配置集合。

## 功能特性

- ✅ 配置集合的创建、读取、更新、删除（CRUD）
- ✅ 数据序列化和反序列化
- ✅ 当前配置集合的管理（记住用户最后使用的集合）
- ✅ 存储空间使用情况监控
- ✅ 错误处理和存储空间不足检测
- ✅ LocalStorage 可用性检查

## 使用方法

### 初始化

```javascript
const storageManager = new StorageManager();
```

### 检查 LocalStorage 是否可用

```javascript
if (storageManager.isStorageAvailable()) {
    console.log('LocalStorage 可用');
} else {
    console.log('LocalStorage 不可用，请检查浏览器设置');
}
```

### 保存配置集合

```javascript
const configSet = {
    generation: 9,
    configurations: [
        {
            id: 'config-1',
            name: 'Pikachu',
            species: 'Pikachu',
            level: 100,
            nature: 'Jolly',
            ability: 'Static',
            item: 'Light Ball',
            evs: { hp: 0, atk: 252, def: 0, spa: 0, spd: 4, spe: 252 },
            moves: [
                { name: 'Volt Tackle', type: 'Electric', category: 'Physical', basePower: 120 },
                { name: 'Iron Tail', type: 'Steel', category: 'Physical', basePower: 100 },
                { name: 'Quick Attack', type: 'Normal', category: 'Physical', basePower: 40 },
                { name: 'Thunder Wave', type: 'Electric', category: 'Status', basePower: 0 }
            ]
        }
    ]
};

const success = storageManager.saveConfigurationSet('我的队伍', configSet);
if (success) {
    console.log('配置集合保存成功');
}
```

### 加载配置集合

```javascript
const loadedSet = storageManager.loadConfigurationSet('我的队伍');
if (loadedSet) {
    console.log('加载的配置集合:', loadedSet);
    console.log('配置数量:', loadedSet.configurations.length);
} else {
    console.log('配置集合不存在');
}
```

### 列出所有配置集合

```javascript
const allSets = storageManager.listConfigurationSets();
console.log('所有配置集合:', allSets);

// 输出示例:
// [
//     {
//         name: '我的队伍',
//         createdAt: '2025-10-25T10:00:00Z',
//         updatedAt: '2025-10-25T12:00:00Z',
//         generation: 9,
//         configCount: 6
//     },
//     {
//         name: 'VGC 2024',
//         createdAt: '2025-10-24T15:30:00Z',
//         updatedAt: '2025-10-25T09:00:00Z',
//         generation: 9,
//         configCount: 12
//     }
// ]
```

### 设置和获取当前配置集合

```javascript
// 设置当前配置集合
storageManager.setCurrentSet('我的队伍');

// 获取当前配置集合
const currentSet = storageManager.getCurrentSet();
console.log('当前配置集合:', currentSet); // 输出: '我的队伍'

// 清除当前配置集合
storageManager.setCurrentSet(null);
```

### 删除配置集合

```javascript
const deleted = storageManager.deleteConfigurationSet('旧队伍');
if (deleted) {
    console.log('配置集合已删除');
} else {
    console.log('删除失败或配置集合不存在');
}
```

### 序列化和反序列化

```javascript
// 序列化
const data = { name: 'test', value: 123 };
const jsonString = storageManager.serialize(data);
console.log('序列化结果:', jsonString);

// 反序列化
const parsedData = storageManager.deserialize(jsonString);
console.log('反序列化结果:', parsedData);
```

### 获取存储使用情况

```javascript
const usage = storageManager.getStorageUsage();
console.log('存储使用情况:', usage);

// 输出示例:
// {
//     used: 102400,              // 已使用字节数
//     configSetsUsed: 51200,     // 配置集合使用的字节数
//     max: 5242880,              // 最大容量（5MB）
//     usedPercentage: '1.95',    // 总使用百分比
//     configSetsPercentage: '0.98' // 配置集合使用百分比
// }
```

### 清除所有存储数据

```javascript
const cleared = storageManager.clearStorage();
if (cleared) {
    console.log('所有配置集合数据已清除');
}
```

## 错误处理

StorageManager 会自动处理各种错误情况：

### 存储空间不足

当 LocalStorage 空间不足时，会触发 `storageQuotaExceeded` 事件：

```javascript
window.addEventListener('storageQuotaExceeded', function(event) {
    console.error('存储空间不足:', event.detail.error);
    alert('存储空间不足，请删除一些旧的配置集合');
});
```

### 无效的输入

```javascript
// 尝试保存无效的配置集合名称
const result = storageManager.saveConfigurationSet(null, data);
// result 将为 false，并在控制台输出错误信息
```

### 数据损坏

如果 LocalStorage 中的数据损坏，相关方法会返回 null 或空数组，并在控制台输出错误信息。

## 数据结构

### 配置集合结构

```javascript
{
    name: String,           // 集合名称
    version: String,        // 数据格式版本（自动添加）
    generation: Number,     // 世代
    createdAt: String,      // 创建时间（ISO 8601格式，自动添加）
    updatedAt: String,      // 更新时间（ISO 8601格式，自动添加）
    configurations: Array   // 配置数组（最多44个）
}
```

### LocalStorage 存储键

- `pokemon_calc_config_sets`: 存储所有配置集合
- `pokemon_calc_current_set`: 存储当前使用的配置集合名称

## 测试

打开 `storage-manager.test.html` 文件在浏览器中运行测试套件，验证所有功能是否正常工作。

## 浏览器兼容性

- Chrome 4+
- Firefox 3.5+
- Safari 4+
- IE 8+
- Edge (所有版本)

## 注意事项

1. **存储限制**: LocalStorage 通常限制为 5-10MB，请注意监控存储使用情况
2. **同步操作**: 所有 LocalStorage 操作都是同步的，可能会阻塞 UI
3. **隐私模式**: 在浏览器的隐私/无痕模式下，LocalStorage 可能不可用或在会话结束后被清除
4. **跨域限制**: LocalStorage 数据仅在同一域名下可访问

## 未来改进

- 添加数据压缩以节省存储空间
- 实现延迟保存（debounce）以提高性能
- 添加数据迁移功能以支持版本升级
- 实现备份和恢复功能
