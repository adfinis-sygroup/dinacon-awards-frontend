import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | nomination-complete", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:nomination-complete");
    assert.ok(route);
  });
});
