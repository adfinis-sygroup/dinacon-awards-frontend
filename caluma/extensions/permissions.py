from caluma.caluma_core.permissions import (
    BasePermission,
    permission_for,
    object_permission_for,
)
from caluma.caluma_form.schema import SaveDocumentAnswer
from caluma.caluma_workflow.schema import SaveCase, CompleteWorkItem
from caluma.caluma_core.mutation import Mutation


class CustomPermission(BasePermission):
    @permission_for(Mutation)
    @object_permission_for(Mutation)
    def has_permission_authenticated(self, mutation, info, instance=None):
        return info.context.user.is_authenticated

    @permission_for(SaveCase)
    @permission_for(SaveDocumentAnswer)
    @permission_for(CompleteWorkItem)
    @object_permission_for(SaveCase)
    @object_permission_for(SaveDocumentAnswer)
    @object_permission_for(CompleteWorkItem)
    def has_permission_public(self, mutation, info, instance=None):
        return True
