import { helper } from "@ember/component/helper";
import truncate from "truncate";

export default helper(([str, len]) => truncate(str, len));
