import AsyncStorage from 'react-native-shared-group-preferences';

export const prefix = 'BABL_';
const appGroup = 'group.com.babl.ios';

const SharedStorage = {
  setItem: async (key, value) => {
    if (!value || value === 'null' || value === 'undefined') return SharedStorage.removeItem(key);

    try {
      const k = `${prefix}_${key}`;
      const v = { data: value };

      await AsyncStorage.setItem(k, JSON.stringify(v), appGroup);

      return true;
    } catch (e) {
      return false;
    }
  },
  getItem: async (key, defaultValue = false) => {
    try {
      const value = await AsyncStorage.getItem(`${prefix}_${key}`, appGroup);
      if (value === null) {
        return defaultValue;
      }

      return JSON.parse(value).data;
    } catch (error) {
      return defaultValue;
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.setItem(`${prefix}_${key}`, null, appGroup);
    } catch (error) {
      return error;
    }
  },
};

export default SharedStorage;
