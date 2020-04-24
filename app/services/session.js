import { inject as service } from "@ember/service";
import { handleUnauthorized } from "ember-simple-auth-oidc";
import oidcConfig from "ember-simple-auth-oidc/config";
import Session from "ember-simple-auth/services/session";

const { authHeaderName, authPrefix, tokenPropertyName } = oidcConfig;

export default class CustomSession extends Session {
  @service intl;
  @service router;

  get headers() {
    const token =
      this.isAuthenticated && this.data.authenticated[tokenPropertyName];
    const tokenKey = authHeaderName.toLowerCase();
    const key =
      this.router.currentRoute &&
      this.router.currentRoute.queryParams.accessKey;

    return {
      "accept-language": this.intl.primaryLocale,
      language: this.intl.primaryLocale,
      ...(token ? { [tokenKey]: `${authPrefix} ${token}` } : {}),
      ...(key ? { "x-access-key": key } : {}),
    };
  }

  handleUnauthorized() {
    if (this.isAuthenticated) handleUnauthorized(this);
  }
}
