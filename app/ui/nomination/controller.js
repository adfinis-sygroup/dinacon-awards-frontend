import Controller from "@ember/controller";
import { queryManager } from "ember-apollo-client";
import { decodeId } from "ember-caluma/helpers/decode-id";
import { dropTask, lastValue } from "ember-concurrency-decorators";
import gql from "graphql-tag";

export default class NominationController extends Controller {
  @queryManager apollo;

  @lastValue("fetchCase") case;

  @dropTask
  *fetchCase() {
    return yield this.apollo.query(
      {
        query: gql`
          query($id: ID!) {
            node(id: $id) {
              ... on Case {
                id
                status
                document {
                  id
                }
                workItems {
                  edges {
                    node {
                      id
                      status
                      task {
                        slug
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { id: btoa(`Case:${this.model}`) },
      },
      "node"
    );
  }

  get documentId() {
    return this.case && decodeId(this.case.document.id);
  }

  get activeWorkItem() {
    return (
      this.case &&
      this.case.workItems.edges
        .map(({ node }) => node)
        .find((workItem) => workItem.status === "READY")
    );
  }

  get canFillForm() {
    return this.activeWorkItem && this.activeWorkItem.task.slug === "fill-form";
  }

  get context() {
    return {
      workItemId: this.activeWorkItem && decodeId(this.activeWorkItem.id),
    };
  }
}
