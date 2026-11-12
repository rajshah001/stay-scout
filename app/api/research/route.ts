import { runResearch } from "@/lib/agents";
import { glmConfigStatus } from "@/lib/glm";
import type { StreamEvent, TripConfig } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const status = glmConfigStatus();
  if (!status.ok) {
    return Response.json({ error: status.message }, { status: 500 });
  }

  let config: TripConfig;
  try {
    config = (await req.json()) as TripConfig;
    if (!Array.isArray(config.destinations) || config.destinations.length === 0) {
      throw new Error("At least one destination is required");
    }
    if (config.destinations.length > 8) {
      throw new Error("Up to 8 destinations per run");
    }
  } catch (err) {
    return Response.json(
      { error: `Invalid config: ${err instanceof Error ? err.message : String(err)}` },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: StreamEvent) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          /* client disconnected */
        }
      };
      try {
        await runResearch(config, emit);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
