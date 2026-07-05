module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@hooks": "./src/hooks",
            "@utils": "./src/utils",
            "@store": "./src/store",
            "@screens": "./src/screens",
            "@navigation": "./src/navigation",
            "@config": "./src/config",
            "@app-types": "./src/types",
            "@services": "./src/services",
            "@theme": "./src/theme",
            "@data": "./src/data",
          },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
    ],
  };
};
