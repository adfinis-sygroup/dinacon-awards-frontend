import Route from "@ember/routing/route";

export default class FillFormRoute extends Route {
  model({ case_id }) {
    return case_id;
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.fetchCase.perform();
  }

  resetController(controller, isExiting, transition) {
    super.resetController(controller, isExiting, transition);

    if (isExiting) {
      controller.fetchCase.cancelAll({ resetState: true });
    }
  }
}
