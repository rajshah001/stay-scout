/**
 * Minimal OpenAI-compatible client for the GLM API (Z.ai / Zhipu).
 * Model + key + base URL come from env; glm-5.3-flash everywhere.
 */

export interface GlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const BASE_URL = process.env.GLM_BASE_URL ?? "https://api.z.ai/api/paas/v4";
const MODEL = process.env.GLM_MODEL ?? "glm-5.3-flash";

export function glmConfigStatus(): { ok: boolean; message: string } {
  if (!process.env.GLM_API_KEY) {
    return { ok: false, message: "GLM_API_KEY missing — set it in .env.local" };
  }
  return { ok: true, message: `GLM ready · ${MODEL}` };
}

interface ChatOpts {
  temperature?: number;
  maxTokens?: number;
  /** ask the model to emit strict JSON (best effort; parsing stays defensive) */
  json?: boolean;
}

export async function glmChat(
  messages: GlmMessage[],
  opts: ChatOpts = {},
): Promise<string> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: opts.temperature ?? 0.4,
      max_tokens: opts.maxTokens ?? 4000,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GLM API ${res.status}: ${text.slice(0, 400)}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("GLM returned an empty completion");
  return content;
}

/** Extract the first JSON object/array embedded in a model response. */
export function parseJsonLoose<T>(raw: string): T {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : raw;
  const start = body.search(/[[{]/);
  if (start === -1) throw new Error("No JSON found in model response");
  const opener = body[start];
  const closer = opener === "[" ? "]" : "}";
  let depth = 0;
  let end = -1;
  let inStr = false;
  let esc = false;
  for (let i = start; i < body.length; i++) {
    const ch = body[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === opener) depth++;
    else if (ch === closer) {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) throw new Error("Unbalanced JSON in model response");
  return JSON.parse(body.slice(start, end)) as T;
}

/** Fire N GLM calls concurrently; failures reject individually. */
export async function glmChatAll<T>(
  tasks: { key: string; messages: GlmMessage[]; opts?: ChatOpts }[],
  maxConcurrency = 4,
): Promise<{ key: string; value?: T; error?: string }[]> {
  const out: { key: string; value?: T; error?: string }[] = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(maxConcurrency, tasks.length) }, async () => {
    while (cursor < tasks.length) {
      const task = tasks[cursor++];
      try {
        const raw = await glmChat(task.messages, task.opts);
        out.push({ key: task.key, value: parseJsonLoose<T>(raw) });
      } catch (err) {
        out.push({ key: task.key, error: err instanceof Error ? err.message : String(err) });
      }
    }
  });
  await Promise.all(workers);
  return out;
}
