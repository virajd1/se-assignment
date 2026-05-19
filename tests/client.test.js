process.env.BASE_URL = "https://example.com";
process.env.API_KEY = "sa_testkey";

import assert from "node:assert";
import { buildUrl } from "../src/client.js";

test("buildUrl joins base URL and path", () => {
  assert.strictEqual(buildUrl("/api/v1/health"), "https://example.com/api/v1/health");
});
