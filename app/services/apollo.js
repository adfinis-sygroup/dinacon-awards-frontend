import { inject as service } from "@ember/service";
import { onError } from "apollo-link-error";
import ApolloService from "ember-apollo-client/services/apollo";
import CalumaApolloServiceMixin from "ember-caluma/mixins/caluma-apollo-service-mixin";
import { handleUnauthorized } from "ember-simple-auth-oidc";

export default class CustomApolloServices extends ApolloService.extend(
  CalumaApolloServiceMixin
) {
  @service session;

  link() {
    const httpLink = super.link();

    const afterware = onError((error) => {
      const { networkError } = error;

      if (networkError && networkError.statusCode === 401) {
        handleUnauthorized(this.session);
      }
    });

    return afterware.concat(httpLink);
  }
}
