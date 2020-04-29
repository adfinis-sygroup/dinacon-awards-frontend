import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | fill-form", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:fill-form");
    assert.ok(route);
  });
});
