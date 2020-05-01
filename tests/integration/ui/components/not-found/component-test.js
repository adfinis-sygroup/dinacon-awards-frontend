import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | not-found", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<NotFound />`);

    assert.equal(this.element.textContent.trim(), "");

    // Template block usage:
    await render(hbs`
      <NotFound>
        template block text
      </NotFound>
    `);

    assert.equal(this.element.textContent.trim(), "template block text");
  });
});
