import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";

export default class CompleteController extends Controller {
  queryParams = ["type"];

  @tracked type = "";
}
