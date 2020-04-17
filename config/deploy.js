/* eslint-env node */
"use strict";

module.exports = function (/* deployTarget */) {
  return {
    build: {
      outputPath: "build",
    },
    compress: {
      keep: true,
      compression: ["gzip", "brotli"],
    },
  };
};
