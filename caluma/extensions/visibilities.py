from caluma.caluma_core.visibilities import BaseVisibility, filter_queryset_for
from caluma.caluma_form.schema import Form, Question, Option, Document, Answer
from caluma.caluma_workflow.schema import Task, Workflow, WorkItem, Case


PUBLIC_WORKFLOWS = ["nomination"]
ACCESS_KEY_WORKFLOWS = ["application"]

WORKFLOW_FILTER = {
    "Document": "case__workflow_id__in",
    "Answer": "document__case__workflow_id__in",
    "Case": "workflow_id__in",
    "WorkItem": "case__workflow_id__in",
}

ACCESS_KEY_FILTER = {
    "Document": "case__meta__accessKey",
    "Answer": "document__case__meta__accessKey",
    "Case": "meta__accessKey",
    "WorkItem": "case__meta__accessKey",
}


class CustomVisibility(BaseVisibility):
    @filter_queryset_for(Form)
    def filter_queryset_for_form(self, node, queryset, info):
        return queryset

    @filter_queryset_for(Question)
    def filter_queryset_for_question(self, node, queryset, info):
        return queryset

    @filter_queryset_for(Option)
    def filter_queryset_for_option(self, node, queryset, info):
        return queryset

    @filter_queryset_for(Task)
    def filter_queryset_for_task(self, node, queryset, info):
        return queryset

    @filter_queryset_for(Workflow)
    def filter_queryset_for_workflow(self, node, queryset, info):
        return queryset

    @filter_queryset_for(Answer)
    def filter_queryset_for_answer(self, node, queryset, info):
        return self._filter_queryset_for_mixed(node, queryset, info)

    @filter_queryset_for(Document)
    def filter_queryset_for_document(self, node, queryset, info):
        return self._filter_queryset_for_mixed(node, queryset, info)

    @filter_queryset_for(WorkItem)
    def filter_queryset_for_work_item(self, node, queryset, info):
        return self._filter_queryset_for_mixed(node, queryset, info)

    @filter_queryset_for(Case)
    def filter_queryset_for_case(self, node, queryset, info):
        return self._filter_queryset_for_mixed(node, queryset, info)

    def _filter_queryset_for_mixed(self, node, queryset, info):
        model = node.__name__
        access_key = info.context.META.get("HTTP_X_ACCESS_KEY", None)

        if info.context.user.is_authenticated:
            return queryset

        if access_key:
            return queryset.filter(
                **{WORKFLOW_FILTER.get(model): ACCESS_KEY_WORKFLOWS},
                **{ACCESS_KEY_FILTER.get(model): access_key}
            )

        return queryset.filter(**{WORKFLOW_FILTER.get(model): PUBLIC_WORKFLOWS})

    def _filter_queryset_for_authenticated(self, node, queryset, info):
        if info.context.user.is_authenticated:
            return queryset

        return queryset.none()
