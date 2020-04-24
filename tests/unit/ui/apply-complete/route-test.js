import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | apply-complete", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:apply-complete");
    assert.ok(route);
  });
});
