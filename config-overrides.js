const rewireAliases = require("react-app-rewire-aliases");
const { paths } = require("react-app-rewired");
const path = require("path");

/* config-overrides.js */
module.exports = function override(config, env) {
  config = rewireAliases.aliasesOptions({
    globalize$: path.resolve(__dirname, root.webroot + "js/globalize.js"),
    globalize: path.resolve(__dirname, root.webroot + "js/globalize"),
    cldr$: path.resolve(__dirname, root.webroot + "js/cldr.js"),
    cldr: path.resolve(__dirname, root.webroot + "js/cldr"),
  })(config, env);
  return config;
};
