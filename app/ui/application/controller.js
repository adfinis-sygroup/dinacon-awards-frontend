import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

import config from "dinacon-awards/config/environment";

export default class ApplicationController extends Controller {
  @service intl;
  @service moment;
  @service session;

  get languages() {
    return config.languages;
  }

  @action
  setLanguage(language, event) {
    event.preventDefault();

    if (config.languages.includes(language)) {
      this.session.set("data.language", language);

      this.intl.setLocale(language);
      this.moment.setLocale(language);

      location.reload();
    }
  }

  @action
  logout(event) {
    event.preventDefault();

    this.session.invalidate();
  }
}
