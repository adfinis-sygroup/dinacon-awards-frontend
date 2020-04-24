from caluma.caluma_core.permissions import (
    BasePermission,
    permission_for,
    object_permission_for,
)
from caluma.caluma_form.schema import SaveDocumentAnswer
from caluma.caluma_workflow.schema import SaveCase, CompleteWorkItem
from caluma.caluma_form.models import Document
from caluma.caluma_workflow.models import WorkItem
from caluma.caluma_core.mutation import Mutation


class CustomPermission(BasePermission):
    def has_case_permission(self, case, info):
        return case.workflow.slug == "nomination" or case.meta.get(
            "accessKey"
        ) == info.context.META.get("HTTP_X_ACCESS_KEY")

    @permission_for(Mutation)
    @object_permission_for(Mutation)
    def has_mutation_permission(self, mutation, info, instance=None):
        return info.context.user.is_authenticated

    @permission_for(SaveCase)
    def has_save_case_permission(self, mutation, info):
        params = mutation.get_params(info)

        if params["input"]["workflow"] == "nomination":
            return True

        return info.context.user.is_authenticated

    @permission_for(SaveDocumentAnswer)
    @object_permission_for(SaveDocumentAnswer)
    def has_save_document_answer_permission(self, mutation, info, answer=None):
        if not answer:
            params = mutation.get_params(info)
            document = Document.objects.get(pk=params["input"]["document"])
        else:
            document = answer.document

        return self.has_case_permission(document.case, info)

    @permission_for(CompleteWorkItem)
    @object_permission_for(CompleteWorkItem)
    def has_complete_work_item_permission(self, mutation, info, work_item=None):
        if not work_item:
            params = mutation.get_params(info)
            work_item = WorkItem.objects.get(pk=params["input"]["id"])

        return self.has_case_permission(work_item.case, info)
