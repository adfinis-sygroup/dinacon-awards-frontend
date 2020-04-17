FROM projectcaluma/caluma:version-5.2.0

ENV OIDC_BEARER_TOKEN_REVALIDATION_TIME 300

ENV PERMISSION_CLASSES caluma.extensions.permissions.CustomPermission
ENV VALIDATION_CLASSES caluma.extensions.validations.CustomValidation
ENV VISIBILITY_CLASSES caluma.extensions.visibilities.CustomVisibility

COPY extensions /app/caluma/extensions
COPY fixtures /app/caluma/fixtures
