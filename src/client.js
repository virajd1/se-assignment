import { createHash } from "node:crypto";
import { BASE_URL, API_KEY, DATASET_PATH, SUBMIT_PATH } from "./config.js";

const defaultHeaders = {
  Authorization: `Bearer ${API_KEY}`,
  Accept: "application/json",
};

function buildUrl(path) {
  return new URL(path, BASE_URL).toString();
}

async function request(path, options = {}) {
  const url = buildUrl(path);
  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (!response.ok) {
    let body = text;
    try {
      body = JSON.parse(text);
    } catch {
      // keep as text
    }
    const error = typeof body === "object" && body.error ? body.error : response.statusText;
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(text);
  }

  return text;
}

async function fetchJson(path) {
  return request(path, { method: "GET" });
}

async function fetchBlob(path) {
  const url = buildUrl(path);
  const response = await fetch(url, {
    method: "GET",
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return response.arrayBuffer();
}

function sha256(data) {
  const hash = createHash("sha256");
  hash.update(Buffer.from(data));
  return hash.digest("hex");
}

export { buildUrl, fetchJson, fetchBlob, sha256, DATASET_PATH, SUBMIT_PATH };
