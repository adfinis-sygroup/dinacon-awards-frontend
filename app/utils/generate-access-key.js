import { v4 } from "uuid";

export default function generateAccessKey() {
  return btoa(v4());
}
