.PHONY: help dumpconfig loadconfig flush dbshell
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort -k 1,1 | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dumpconfig: Dump the caluma config into fixtures
	@docker-compose exec caluma python manage.py dumpdata \
		caluma_form.Form \
		caluma_form.Question \
		caluma_form.Option \
		caluma_form.QuestionOption \
		caluma_form.FormQuestion \
		| prettier --parser=json > caluma/fixtures/form.json
	@docker-compose exec caluma python manage.py dumpdata \
		caluma_workflow.Workflow \
		caluma_workflow.Task \
		caluma_workflow.Flow \
		caluma_workflow.TaskFlow \
		| prettier --parser=json > caluma/fixtures/workflow.json

loadconfig: ## Load the caluma config into the DB
	@docker-compose exec caluma python manage.py loaddata caluma/fixtures/form.json
	@docker-compose exec caluma python manage.py loaddata caluma/fixtures/workflow.json

flush: ## Flush the caluma DB
	@docker-compose exec caluma python manage.py flush --noinput

dbshell: ## Open a psql shell
	@docker-compose exec db psql -U dinacon_awards
