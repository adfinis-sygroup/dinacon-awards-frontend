"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "dinacon-awards",
    environment,
    rootURL: "/",
    locationType: "auto",
    podModulePrefix: "dinacon-awards/ui",
    historySupportMiddleware: true,
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    apollo: {
      apiURL: "/graphql",
    },

    "ember-simple-auth-oidc": {
      host:
        process.env.OIDC_HOST ||
        "/auth/realms/dinacon-awards/protocol/openid-connect",
      clientId: process.env.OIDC_CLIENT_ID || "dinacon-awards",
      authEndpoint: process.env.OIDC_AUTH_ENDPOINT || "/auth",
      tokenEndpoint: process.env.OIDC_TOKEN_ENDPOINT || "/token",
      endSessionEndpoint: process.env.OIDC_END_SESSION_ENDPOINT || "/logout",
      userinfoEndpoint: process.env.OIDC_USERINFO_ENDPOINT || "/userinfo",
      afterLogoutUri: process.env.OIDC_LOGOUT_URI || "/",
      forwardParams: (process.env.OIDC_FORWARD_PARAMS &&
        process.env.OIDC_FORWARD_PARAMS.split(",")) || ["kc_idp_hint"],
    },

    "ember-uikit": {
      notification: {
        pos: "bottom-right",
      },
    },

    moment: {
      includeLocales: ["de", "en"],
    },

    languages: ["de", "en"],
  };

  if (environment === "development") {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    const { host } = ENV["ember-simple-auth-oidc"];

    ENV["ember-simple-auth-oidc"].host = `http://dinacon-awards.local${host}`;
  }

  if (environment === "test") {
    // Testem prefers this...
    ENV.locationType = "none";

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = "#ember-testing";
    ENV.APP.autoboot = false;
  }

  if (environment === "production") {
    // here you can enable a production-specific feature
  }

  return ENV;
};
