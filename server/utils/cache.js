let mockCache = new Map();

export const getCache = async (key) => {
  const item = mockCache.get(key);
  if (!item) return null;
  
  if (item.expiry && item.expiry < Date.now()) {
    mockCache.delete(key);
    return null;
  }
  
  return JSON.parse(item.value);
};

export const setCache = async (key, value, expireIn = 3600) => {
  const item = {
    value: JSON.stringify(value),
    expiry: expireIn ? Date.now() + expireIn * 1000 : null
  };
  mockCache.set(key, item);
};

export const clearCache = async (key) => {
  mockCache.delete(key);
};

// פונקציה נוספת לניקוי כל המטמון (יכולה להיות שימושית לבדיקות)
export const clearAllCache = () => {
  mockCache.clear();
};

console.log('משתמש במימוש מדומה של מערכת מטמון');