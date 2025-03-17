module.exports = {
  project: {
    android: {
      unstable_reactLegacyComponentNames: ['Video'],
    },
    ios: {
      unstable_reactLegacyComponentNames: ['Video'],
    },
  },

  dependencies: {
    ...(process.env.NO_FLIPPER ? { 'react-native-flipper': { platforms: { ios: null } } } : {}),
  },
  assets: ['./src/assets/fonts/'],
};
