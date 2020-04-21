import Route from "@ember/routing/route";

export default class AdminIndexRoute extends Route {
  queryParams = {
    type: { refreshModel: true, replace: true },
    category: { refreshModel: true, replace: true },
    search: { refreshModel: true, replace: true },
  };

  model() {
    if (this.controller) this.controller.fetchCases.perform();
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.fetchCategories.perform();
    controller.fetchCases.perform();
  }
}
