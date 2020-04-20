import Route from "@ember/routing/route";

export default class NominationRoute extends Route {
  model({ case_id }) {
    return case_id;
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.fetchCase.perform();
  }
}
