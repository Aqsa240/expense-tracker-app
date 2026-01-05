const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase requires 'cjs' extension to be resolved correctly in some environments
config.resolver.sourceExts.push('cjs');

module.exports = config;
