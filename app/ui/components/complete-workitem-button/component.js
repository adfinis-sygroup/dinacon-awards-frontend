import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency-decorators";
import gql from "graphql-tag";

export default class CompleteWorkitemButtonComponent extends Component {
  @service notification;
  @service router;
  @service intl;

  @queryManager apollo;

  get fields() {
    return this.args.field.document.fields;
  }

  get documentIsValid() {
    return this.fields.every((field) => field.isValid);
  }

  get disabled() {
    return this.args.disabled || !this.documentIsValid;
  }

  @dropTask
  *validate() {
    yield Promise.all(this.fields.map((field) => field.validate.perform()));
  }

  @dropTask
  *submit() {
    try {
      yield this.validate.perform();

      if (this.disabled) return;

      yield this.apollo.mutate({
        mutation: gql`
          mutation($id: ID!) {
            completeWorkItem(input: { id: $id }) {
              clientMutationId
            }
          }
        `,
        variables: { id: this.args.context.workItemId },
      });

      const routeAfterSuccess =
        this.args.field.question.meta.routeAfterSuccess || "index";

      yield this.router.transitionTo(routeAfterSuccess);
    } catch (error) {
      this.notification.danger("danger danger");
    }
  }
}
