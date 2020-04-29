from caluma.caluma_core.events import on
from caluma.caluma_workflow.events import created_case
from caluma.caluma_workflow.schema import SaveCase
from caluma.caluma_workflow.models import Case
from caluma.caluma_form.models import Answer


QUESTION_MAP = {
    "contact-name": "name",
    "contact-email": "email",
}

SKIP_SLUGS = list(QUESTION_MAP.values())
MAP_SLUGS = list(QUESTION_MAP.keys())


@on(created_case, sender=SaveCase)
def copy_answers_from_nomination(sender, case, **kwargs):
    if case.workflow.slug == "application" and case.meta.get("nominationId"):
        nomination = Case.objects.get(pk=case.meta.get("nominationId"))
        questions = list(case.document.form.questions.values_list("pk", flat=True))
        part_of_project = nomination.document.answers.filter(
            value="part-of-project-yes"
        ).exists()

        if not part_of_project:
            questions += MAP_SLUGS

        for answer in nomination.document.answers.filter(question_id__in=questions):
            question = answer.question_id

            if not part_of_project and question in SKIP_SLUGS:
                continue

            if not part_of_project and question in MAP_SLUGS:
                answer.question_id = QUESTION_MAP.get(question)

            answer.pk = None
            answer.document = case.document
            answer.save()
