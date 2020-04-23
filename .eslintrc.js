"use strict";

module.exports = {
  extends: "@adfinis-sygroup/eslint-config/ember-app",
  rules: { "ember/no-mixins": "off" },
  settings: {
    "import/internal-regex": "^dinacon-awards/",
  },
};
