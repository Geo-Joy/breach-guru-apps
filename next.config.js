const path = require("path");

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@/apps"] = path.join(__dirname, "apps");
    return config;
  },
};
