import Controller from "@ember/controller";
import { queryManager } from "ember-apollo-client";
import { decodeId } from "ember-caluma/helpers/decode-id";
import { dropTask } from "ember-concurrency-decorators";
import gql from "graphql-tag";

export default class IndexController extends Controller {
  @queryManager apollo;

  @dropTask
  *nominate() {
    const documentId = yield this.apollo.mutate(
      {
        mutation: gql`
          mutation {
            saveCase(input: { workflow: "nomination", form: "nomination" }) {
              case {
                id
                document {
                  id
                }
              }
            }
          }
        `,
      },
      "saveCase.case.id"
    );

    this.transitionToRoute("nomination", decodeId(documentId));
  }
}
