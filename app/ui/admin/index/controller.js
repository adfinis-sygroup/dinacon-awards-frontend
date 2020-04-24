import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { decodeId } from "ember-caluma/helpers/decode-id";
import { timeout } from "ember-concurrency";
import {
  dropTask,
  restartableTask,
  lastValue,
} from "ember-concurrency-decorators";
import gql from "graphql-tag";
import UIkit from "uikit";

import Case from "dinacon-awards/lib/case";
import generateAccessKey from "dinacon-awards/utils/generate-access-key";

export default class AdminIndexController extends Controller {
  queryParams = ["type", "category", "search"];

  @service intl;
  @service notification;

  @queryManager apollo;

  @tracked type = "nomination";
  @tracked search = "";
  @tracked category = "";

  get types() {
    return ["nomination", "application"];
  }

  @lastValue("fetchCategories") categories;
  @dropTask
  *fetchCategories() {
    const edges = yield this.apollo.query(
      {
        query: gql`
          query {
            allQuestions(slug: "category") {
              edges {
                node {
                  slug
                  ... on ChoiceQuestion {
                    options {
                      edges {
                        node {
                          slug
                          label
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      },
      "allQuestions.edges.firstObject.node.options.edges"
    );

    return edges.map(({ node }) => node);
  }

  @lastValue("fetchCases") cases;
  @restartableTask
  *fetchCases() {
    const edges = yield this.apollo.query(
      {
        query: gql`
          query($questions: [ID]!, $filter: [CaseFilterSetType]!) {
            allCases(filter: $filter) {
              edges {
                node {
                  id
                  document {
                    id
                    answers(questions: $questions) {
                      edges {
                        node {
                          id
                          question {
                            slug
                            ... on ChoiceQuestion {
                              options {
                                edges {
                                  node {
                                    slug
                                    label
                                  }
                                }
                              }
                            }
                          }
                          ... on StringAnswer {
                            stringValue: value
                          }
                          ... on IntegerAnswer {
                            integerValue: value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          filter: [
            { workflow: this.type },
            {
              status: [
                "COMPLETED",
                ...(this.type === "application" ? ["RUNNING"] : []),
              ],
            },
            ...(this.search
              ? [
                  {
                    searchAnswers: [
                      {
                        questions: ["project-name", "name", "contact-name"],
                        value: this.search,
                      },
                    ],
                  },
                ]
              : []),
            ...(this.category
              ? [
                  {
                    hasAnswer: [{ question: "category", value: this.category }],
                  },
                ]
              : []),
          ],
          questions: [
            "project-name",
            "name",
            "email",
            "part-of-the-project",
            "contact-name",
            "contact-email",
            "location",
            "website",
            "category",
            "reason",
            "start-year",
          ],
        },
      },
      "allCases.edges"
    );

    return edges.map(({ node }) => new Case(node));
  }

  @dropTask
  *createApplication(nominationId, event) {
    event.preventDefault();

    try {
      yield UIkit.modal.confirm(this.intl.t("admin.application-confirm"), {
        labels: {
          ok: this.intl.t("global.yes"),
          cancel: this.intl.t("global.no"),
        },
      });
    } catch (error) {
      return; // confirmation denied
    }

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
              workflow: "application",
              form: "application",
              meta: JSON.stringify({
                nominationId,
                accessKey: generateAccessKey(),
              }),
            },
          },
        },
        "saveCase.case.id"
      );

      yield this.transitionToRoute("fill-form", decodeId(caseId));
    } catch (error) {
      this.notification.danger(this.intl.t("admin.application-error"));
    }
  }

  @restartableTask
  *applyFilter(key, value) {
    yield timeout(500);

    this[key] = value;
  }
}
