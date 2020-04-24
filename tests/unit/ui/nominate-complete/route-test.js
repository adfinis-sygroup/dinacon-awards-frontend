import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | nominate-complete", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:nominate-complete");
    assert.ok(route);
  });
});
