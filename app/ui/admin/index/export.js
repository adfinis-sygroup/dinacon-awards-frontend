import { unparse } from "papaparse";

import { answer as answerMacro } from "dinacon-awards/lib/case";

const getAllQuestions = (cases) => {
  const allQuestions = cases
    .map((node) =>
      node.document.answers.edges.map(({ node: answerNode }) => ({
        slug: answerNode.question.slug,
        label: answerNode.question.label,
      }))
    )
    .flat();

  return [...new Set(allQuestions.map(({ slug }) => slug))]
    .sort()
    .map((slug) => allQuestions.find((q) => q.slug === slug));
};

const getHeaderRow = (questions) => {
  return questions.map(({ label }) => label);
};

const parseRow = (row, questions) => {
  const obj = {
    answers: row.document.answers.edges.map(({ node }) => node),
  };

  Object.defineProperties(
    obj,
    questions.reduce(
      (descs, { slug }) => ({ ...descs, [slug]: answerMacro(slug)() }),
      {}
    )
  );

  return questions.map(({ slug }) => obj[slug]);
};

export default function exportCSV(cases) {
  const questions = getAllQuestions(cases);

  return unparse([
    getHeaderRow(questions),
    ...cases.map((row) => parseRow(row, questions)),
  ]);
}
