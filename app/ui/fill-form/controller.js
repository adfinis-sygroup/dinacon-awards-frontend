import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { decodeId } from "ember-caluma/helpers/decode-id";
import { dropTask, lastValue } from "ember-concurrency-decorators";
import gql from "graphql-tag";

export default class FillFormController extends Controller {
  queryParams = ["accessKey", "displayedForm"];

  @service session;

  @queryManager apollo;

  @tracked accessKey = null;
  @tracked displayedForm = null;

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
                workflow {
                  slug
                }
                document {
                  id
                }
                meta
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

  get inviteLink() {
    if (
      !this.session.isAuthenticated ||
      !this.case ||
      !this.case.meta.accessKey
    ) {
      return null;
    }

    return `${location.origin}${location.pathname}?accessKey=${this.case.meta.accessKey}`;
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
    return (
      this.activeWorkItem &&
      this.activeWorkItem.task.slug === "fill-form" &&
      this.case &&
      (this.case.workflow.slug === "nomination" ||
        this.session.isAuthenticated ||
        this.accessKey)
    );
  }

  get context() {
    return {
      workItemId: this.activeWorkItem && decodeId(this.activeWorkItem.id),
    };
  }
}
