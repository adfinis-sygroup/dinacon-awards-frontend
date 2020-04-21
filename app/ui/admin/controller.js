import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import Nomination from "dinacon-awards/lib/nomination";
import { queryManager } from "ember-apollo-client";
import { timeout } from "ember-concurrency";
import {
  dropTask,
  restartableTask,
  lastValue,
} from "ember-concurrency-decorators";
import gql from "graphql-tag";

export default class AdminController extends Controller {
  @queryManager apollo;

  queryParams = ["type", "category", "search"];

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
            { status: "COMPLETED" },
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

    return edges.map(({ node }) => new Nomination(node));
  }

  @restartableTask
  *applyFilter(key, value) {
    yield timeout(500);

    this[key] = value;
  }
}
