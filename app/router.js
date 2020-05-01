import EmberRouterScroll from "ember-router-scroll";

import config from "./config/environment";

export default class Router extends EmberRouterScroll {
  location = config.locationType;
  rootURL = config.rootURL;
}

/* eslint-disable-next-line array-callback-return */
Router.map(function () {
  this.route("login");

  this.route("fill-form", { path: "/fill-form/:case_id" });
  this.route("complete", { path: "/fill-form/complete" });

  this.route("admin", function () {
    this.mount("ember-caluma", {
      as: "form-builder",
      path: "/form-builder",
    });
  });

  this.route("notfound", { path: "/*path" });
});
