FROM projectcaluma/caluma:version-5.6.0

ENV LANGUAGE=en
ENV LANGUAGES=en

ENV OIDC_BEARER_TOKEN_REVALIDATION_TIME=300

ENV PERMISSION_CLASSES=caluma.extensions.permissions.CustomPermission
ENV VALIDATION_CLASSES=caluma.extensions.validations.CustomValidation
ENV VISIBILITY_CLASSES=caluma.extensions.visibilities.CustomVisibility
ENV EVENT_RECEIVER_MODULES=caluma.extensions.events

COPY extensions /app/caluma/extensions
COPY fixtures /app/caluma/fixtures
