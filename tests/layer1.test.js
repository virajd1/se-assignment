import assert from "node:assert";
import { sha256 } from "../src/client.js";

test("sha256 produces known digest", () => {
  const text = new TextEncoder().encode("hello world");
  const digest = sha256(text);
  assert.strictEqual(digest, "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
});
