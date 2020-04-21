import EmberRouter from "@ember/routing/router";

import config from "./config/environment";

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

/* eslint-disable-next-line array-callback-return */
Router.map(function () {
  this.mount("ember-caluma", {
    as: "form-builder",
    path: "/form-builder",
  });
  this.route("login");
  this.route("nomination", { path: "/nomination/:case_id" }, function () {});
  this.route("nomination-complete");
  this.route("admin");
});
