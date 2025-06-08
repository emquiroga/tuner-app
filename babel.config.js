module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Agregar plugins adicionales aquí si son necesarios
    ],
  };
};
