module.exports = function (api) {
  api.cache(true);
  // babel-preset-expo already includes the Reanimated / Worklets plugin.
  return { presets: ["babel-preset-expo"] };
};
