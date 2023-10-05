const { getDefaultConfig } = require('@expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push("cjs");
defaultConfig.resolver.assetExts.push("svg");
module.exports = {
    resolver: {
      assetExts: [...defaultConfig.resolver.assetExts, 'ttf', 'otf', 'png', 'jpg'],
    },
  };