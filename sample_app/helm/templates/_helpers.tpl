{{- define "simple-api.fullname" -}}
{{-   if .Values.fullnameOverride -}}
{{-     .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{-   else -}}
{{-     .Release.Name | trunc 63 | trimSuffix "-" -}}
{{-   end -}}
{{- end -}}

{{- define "simple-api.aggregator.fullname" -}}
{{-   printf "%s-aggregator" (include "simple-api.fullname" . ) | trunc -63 -}}
{{- end -}}

{{- define "simple-api.noun.fullname" -}}
{{-   printf "%s-noun" (include "simple-api.fullname" . ) | trunc -63 -}}
{{- end -}}

{{- define "simple-api.verb.fullname" -}}
{{-   printf "%s-verb" (include "simple-api.fullname" . ) | trunc -63 -}}
{{- end -}}