from caluma.caluma_core.events import on
from caluma.caluma_workflow.events import created_case
from caluma.caluma_workflow.schema import SaveCase
from caluma.caluma_workflow.models import Case
from caluma.caluma_form.models import Answer, Form

QUESTIONS = [
    "project-name",
    "name",
    "email",
    "location",
    "website",
    "category",
    "reason",
    "start-year",
]

OVERRIDE_QUESTIONS = {
    "contact-name": "name",
    "contact-email": "email",
}


@on(created_case, sender=SaveCase)
def copy_answers_from_nomination(sender, case, **kwargs):
    if case.workflow.slug == "application" and case.meta.get("nominationId"):
        nomination = Case.objects.get(pk=case.meta.get("nominationId"))
        answers = nomination.document.answers
        override = answers.filter(value="part-of-the-project-no").exists()

        for answer in answers.filter(question_id__in=QUESTIONS):
            copy_answer(answer, case.document.pk)

        if override:
            for answer in answers.filter(
                question_id__in=list(OVERRIDE_QUESTIONS.keys())
            ):
                copy_answer(
                    answer,
                    case.document.pk,
                    OVERRIDE_QUESTIONS.get(answer.question_id),
                    True,
                )


def copy_answer(
    source_answer, target_document_id, target_question_id=None, override=False
):
    filters = {
        "document_id": target_document_id,
        "question_id": target_question_id or source_answer.question_id,
    }
    values = {
        "value": source_answer.value,
        "meta": source_answer.meta,
        "date": source_answer.date,
        "file": source_answer.file,
    }

    if override:
        Answer.objects.update_or_create(
            **filters, defaults=values,
        )
    elif not Answer.objects.filter(**filters).exists():
        Answer.objects.create(**filters, **values)
