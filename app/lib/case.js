import { decodeId } from "ember-caluma/helpers/decode-id";

export function answer(slug, { label = true } = {}) {
  return function () {
    return {
      get() {
        const answer = this.answers.find(
          (answer) => answer.question.slug === slug
        );
        const key =
          answer && Object.keys(answer).find((key) => /value/i.test(key));

        if (!answer || !key) return;

        const value = answer[key];

        if (label && /Choice/.test(answer.question.__typename)) {
          const options = answer.question.options.edges.map(({ node }) => node);
          const option = options.find((option) => option.slug === value);

          return option && option.label;
        }

        return value;
      },
    };
  };
}

export default class Case {
  constructor(raw) {
    this.id = decodeId(raw.id);
    this.status = raw.status;
    this.answers = raw.document.answers.edges.map(({ node }) => node);
  }

  @answer("project-name") projectName;
  @answer("name") name;
  @answer("email") email;
  @answer("part-of-the-project", { label: false }) partOfProject;
  @answer("contact-name") contactName;
  @answer("contact-email") contactEmail;
  @answer("location") location;
  @answer("website") website;
  @answer("category") category;
  @answer("reason") reason;
  @answer("start-year") startYear;
}
