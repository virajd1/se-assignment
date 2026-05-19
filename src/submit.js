import { fetchJson, SUBMIT_PATH } from "./client.js";

async function submitAnswer(type, value, notes = "") {
  if (!type || !value) {
    throw new Error("Submission requires both type and value.");
  }

  const payload = {
    type,
    value,
    notes,
  };

  const response = await fetchJson(SUBMIT_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return response;
}

export { submitAnswer };
