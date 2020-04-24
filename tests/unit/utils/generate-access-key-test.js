import { module, test } from "qunit";

import generateAccessKey from "dinacon-awards/utils/generate-access-key";

module("Unit | Utility | generate-access-key", function () {
  // Replace this with your real tests.
  test("it works", function (assert) {
    const result = generateAccessKey();
    assert.ok(result);
  });
});
