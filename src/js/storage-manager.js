/**
 * StorageManager - 管理宝可梦配置集合的本地存储
 * 
 * 负责与浏览器LocalStorage交互，处理数据序列化和反序列化
 */
class StorageManager {
    constructor() {
        this.storageKey = 'pokemon_calc_config_sets';
        this.currentSetKey = 'pokemon_calc_current_set';
        this.version = '1.0';
    }

    /**
     * 保存配置集合到LocalStorage
     * @param {string} name - 配置集合名称
     * @param {Object} data - 配置集合数据
     * @returns {boolean} - 是否保存成功
     */
    saveConfigurationSet(name, data) {
        try {
            if (!name || typeof name !== 'string') {
                throw new Error('配置集合名称无效');
            }

            // 获取所有现有的配置集合
            const allSets = this._getAllSets();
            
            // 添加或更新配置集合
            allSets[name] = {
                ...data,
                name: name,
                version: this.version,
                updatedAt: new Date().toISOString()
            };

            // 如果是新创建的集合，添加创建时间
            if (!data.createdAt) {
                allSets[name].createdAt = new Date().toISOString();
            }

            // 保存到LocalStorage
            this._saveAllSets(allSets);
            
            return true;
        } catch (error) {
            console.error('保存配置集合失败:', error);
            this._handleStorageError(error);
            return false;
        }
    }

    /**
     * 从LocalStorage加载配置集合
     * @param {string} name - 配置集合名称
     * @returns {Object|null} - 配置集合数据，如果不存在则返回null
     */
    loadConfigurationSet(name) {
        try {
            if (!name || typeof name !== 'string') {
                throw new Error('配置集合名称无效');
            }

            const allSets = this._getAllSets();
            
            if (!allSets[name]) {
                console.warn(`配置集合 "${name}" 不存在`);
                return null;
            }

            return allSets[name];
        } catch (error) {
            console.error('加载配置集合失败:', error);
            this._handleStorageError(error);
            return null;
        }
    }

    /**
     * 删除配置集合
     * @param {string} name - 配置集合名称
     * @returns {boolean} - 是否删除成功
     */
    deleteConfigurationSet(name) {
        try {
            if (!name || typeof name !== 'string') {
                throw new Error('配置集合名称无效');
            }

            const allSets = this._getAllSets();
            
            if (!allSets[name]) {
                console.warn(`配置集合 "${name}" 不存在`);
                return false;
            }

            // 删除配置集合
            delete allSets[name];
            
            // 保存更新后的数据
            this._saveAllSets(allSets);

            // 如果删除的是当前集合，清除当前集合引用
            const currentSet = this.getCurrentSet();
            if (currentSet === name) {
                this.setCurrentSet(null);
            }

            return true;
        } catch (error) {
            console.error('删除配置集合失败:', error);
            this._handleStorageError(error);
            return false;
        }
    }

    /**
     * 列出所有配置集合
     * @returns {Array} - 配置集合名称和元数据的数组
     */
    listConfigurationSets() {
        try {
            const allSets = this._getAllSets();
            
            return Object.keys(allSets).map(name => ({
                name: name,
                createdAt: allSets[name].createdAt,
                updatedAt: allSets[name].updatedAt,
                generation: allSets[name].generation,
                configCount: allSets[name].configurations ? allSets[name].configurations.length : 0
            }));
        } catch (error) {
            console.error('列出配置集合失败:', error);
            this._handleStorageError(error);
            return [];
        }
    }

    /**
     * 设置当前使用的配置集合
     * @param {string|null} name - 配置集合名称，null表示清除当前集合
     * @returns {boolean} - 是否设置成功
     */
    setCurrentSet(name) {
        try {
            if (name === null) {
                localStorage.removeItem(this.currentSetKey);
                return true;
            }

            if (typeof name !== 'string') {
                throw new Error('配置集合名称无效');
            }

            // 验证配置集合是否存在
            const allSets = this._getAllSets();
            if (!allSets[name]) {
                throw new Error(`配置集合 "${name}" 不存在`);
            }

            const currentSetData = {
                currentSetName: name,
                lastAccessedAt: new Date().toISOString()
            };

            localStorage.setItem(this.currentSetKey, this.serialize(currentSetData));
            return true;
        } catch (error) {
            console.error('设置当前配置集合失败:', error);
            this._handleStorageError(error);
            return false;
        }
    }

    /**
     * 获取当前使用的配置集合名称
     * @returns {string|null} - 当前配置集合名称，如果没有则返回null
     */
    getCurrentSet() {
        try {
            const currentSetJson = localStorage.getItem(this.currentSetKey);
            
            if (!currentSetJson) {
                return null;
            }

            const currentSetData = this.deserialize(currentSetJson);
            return currentSetData.currentSetName || null;
        } catch (error) {
            console.error('获取当前配置集合失败:', error);
            return null;
        }
    }

    /**
     * 序列化数据为JSON字符串
     * @param {Object} data - 要序列化的数据
     * @returns {string} - JSON字符串
     */
    serialize(data) {
        try {
            return JSON.stringify(data);
        } catch (error) {
            console.error('数据序列化失败:', error);
            throw new Error('数据序列化失败: ' + error.message);
        }
    }

    /**
     * 反序列化JSON字符串为对象
     * @param {string} jsonString - JSON字符串
     * @returns {Object} - 反序列化后的对象
     */
    deserialize(jsonString) {
        try {
            if (!jsonString || typeof jsonString !== 'string') {
                throw new Error('无效的JSON字符串');
            }
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('数据反序列化失败:', error);
            throw new Error('数据反序列化失败: ' + error.message);
        }
    }

    /**
     * 获取LocalStorage使用情况
     * @returns {Object} - 包含已使用空间和总空间的对象
     */
    getStorageUsage() {
        try {
            let totalSize = 0;
            let configSetsSize = 0;

            // 计算所有LocalStorage项的大小
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    const itemSize = (localStorage[key].length + key.length) * 2; // UTF-16编码，每个字符2字节
                    totalSize += itemSize;

                    if (key === this.storageKey || key === this.currentSetKey) {
                        configSetsSize += itemSize;
                    }
                }
            }

            // LocalStorage通常限制为5-10MB，这里假设5MB
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes

            return {
                used: totalSize,
                configSetsUsed: configSetsSize,
                max: maxSize,
                usedPercentage: (totalSize / maxSize * 100).toFixed(2),
                configSetsPercentage: (configSetsSize / maxSize * 100).toFixed(2)
            };
        } catch (error) {
            console.error('获取存储使用情况失败:', error);
            return {
                used: 0,
                configSetsUsed: 0,
                max: 0,
                usedPercentage: 0,
                configSetsPercentage: 0
            };
        }
    }

    /**
     * 清除所有配置集合数据
     * @returns {boolean} - 是否清除成功
     */
    clearStorage() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.currentSetKey);
            return true;
        } catch (error) {
            console.error('清除存储失败:', error);
            this._handleStorageError(error);
            return false;
        }
    }

    /**
     * 检查LocalStorage是否可用
     * @returns {boolean} - LocalStorage是否可用
     */
    isStorageAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            console.warn('LocalStorage不可用:', error);
            return false;
        }
    }

    // ========== 私有方法 ==========

    /**
     * 获取所有配置集合
     * @private
     * @returns {Object} - 所有配置集合的对象
     */
    _getAllSets() {
        try {
            const setsJson = localStorage.getItem(this.storageKey);
            
            if (!setsJson) {
                return {};
            }

            const data = this.deserialize(setsJson);
            return data.sets || {};
        } catch (error) {
            console.error('获取所有配置集合失败:', error);
            return {};
        }
    }

    /**
     * 保存所有配置集合
     * @private
     * @param {Object} sets - 所有配置集合的对象
     */
    _saveAllSets(sets) {
        try {
            const data = {
                version: this.version,
                sets: sets
            };

            localStorage.setItem(this.storageKey, this.serialize(data));
        } catch (error) {
            console.error('保存所有配置集合失败:', error);
            throw error;
        }
    }

    /**
     * 处理存储错误
     * @private
     * @param {Error} error - 错误对象
     */
    _handleStorageError(error) {
        // 检查是否是存储空间不足错误
        if (error.name === 'QuotaExceededError' || 
            error.code === 22 || 
            error.code === 1014) {
            console.error('LocalStorage空间不足');
            
            // 可以在这里触发一个事件或显示用户提示
            if (typeof window !== 'undefined' && window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('storageQuotaExceeded', {
                    detail: { error: error }
                }));
            }
        }
    }
}

// 导出StorageManager类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}
