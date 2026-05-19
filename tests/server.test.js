process.env.BASE_URL = "https://example.com";
process.env.API_KEY = "sa_testkey";

import assert from "node:assert";
import request from "supertest";
import app from "../src/server.js";

test("GET /discover returns configured API values", async () => {
  const res = await request(app).get("/discover");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.BASE_URL, "https://example.com");
  assert.strictEqual(res.body.DATASET_PATH, "/api/v1/dataset");
  assert.strictEqual(res.body.SUBMIT_PATH, "/api/v1/submit");
});

test("GET / returns HTML helper page", async () => {
  const res = await request(app).get("/");
  assert.strictEqual(res.status, 200);
  assert.ok(res.text.includes("SE Assessment Helper"));
});
