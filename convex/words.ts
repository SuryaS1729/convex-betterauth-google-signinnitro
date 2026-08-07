import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";

// TEMPORARY PERFORMANCE INSTRUMENTATION
// Timestamps use the Convex server clock, so deltas between them are
// meaningful (same monotonic clock). Client-side instrumentation in
// src/app/protected.tsx measures the round trip.
const t0 = performance.now();
let logCount = 0;
function stage(label: string, ref?: string | number) {
  const rel = (performance.now() - t0).toFixed(1);
  console.log(
    `[perf:words] ${label} +${rel}ms${ref !== undefined ? ` (${ref})` : ""}`,
  );
  if (++logCount > 400) {
    // Safety valve: stop logging if left in accidentally.
    console.log("[perf:words] log cap reached");
  }
}

// Helper to get the authenticated user's stable id, or throw.
async function getUserId(ctx: QueryCtx) {
  const t = performance.now();
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  stage(`getUserIdentity took ${(performance.now() - t).toFixed(2)}ms`);
  return identity.tokenIdentifier;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const t = performance.now();
    const userId = await getUserId(ctx);
    const words = await ctx.db
      .query("words")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    stage(
      `list recomputed: ${words.length} rows in ${(performance.now() - t).toFixed(2)}ms`,
    );
    return words;
  },
});

export const add = mutation({
  args: {
    word: v.string(),
  },
  handler: async (ctx, args) => {
    const t = performance.now();
    const userId = await getUserId(ctx);
    const word = args.word.trim().toLowerCase();
    if (!word) {
      throw new Error("Word cannot be empty");
    }
    const id = await ctx.db.insert("words", {
      userId,
      word,
    });
    const { requestId } = await ctx.meta.getRequestMetadata();
    stage(
      `mutation handler: insert done in ${(performance.now() - t).toFixed(2)}ms`,
      requestId,
    );
    return id;
  },
});
