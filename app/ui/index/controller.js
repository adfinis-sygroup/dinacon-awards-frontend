import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { decodeId } from "ember-caluma/helpers/decode-id";
import { dropTask } from "ember-concurrency-decorators";
import gql from "graphql-tag";

export default class IndexController extends Controller {
  @service notification;
  @service intl;

  @queryManager apollo;

  @dropTask
  *nominate() {
    try {
      const caseId = yield this.apollo.mutate(
        {
          mutation: gql`
            mutation($input: SaveCaseInput!) {
              saveCase(input: $input) {
                case {
                  id
                }
              }
            }
          `,
          variables: {
            input: {
              workflow: "nomination",
              form: "nomination",
            },
          },
        },
        "saveCase.case.id"
      );

      this.transitionToRoute("fill-form", decodeId(caseId));
    } catch (error) {
      this.notification.danger(this.intl.t("index.nominate-error"));
    }
  }
}
