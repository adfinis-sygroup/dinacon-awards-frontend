import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import OIDCApplicationRouteMixin from "ember-simple-auth-oidc/mixins/oidc-application-route-mixin";
import { getUserLocales } from "get-user-locale";

import config from "dinacon-awards/config/environment";

export default class ApplicationRoute extends Route.extend(
  OIDCApplicationRouteMixin
) {
  @service intl;
  @service moment;
  @service session;
  @service calumaOptions;

  determineLanguage() {
    const isValidLanguage = (language) => config.languages.includes(language);

    const defaultLanguage = config.languages[0];
    const sessionLanguage = this.session.data.language;
    const browserLanguage = getUserLocales()
      .map((locale) => locale.split("-")[0])
      .find(isValidLanguage);

    return [sessionLanguage, browserLanguage, defaultLanguage].filter(
      isValidLanguage
    )[0];
  }

  beforeModel() {
    const language = this.determineLanguage();

    this.intl.setLocale(language);
    this.moment.setLocale(language);

    this.calumaOptions.registerComponentOverride({
      label: "complete-workitem-button",
      component: "complete-workitem-button",
      types: ["StaticQuestion"],
    });
  }
}
