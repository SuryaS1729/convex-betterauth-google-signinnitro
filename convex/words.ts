import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";

// Helper to get the authenticated user's stable id, or throw.
async function getUserId(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.tokenIdentifier;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return await ctx.db
      .query("words")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    word: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const word = args.word.trim().toLowerCase();
    if (!word) {
      throw new Error("Word cannot be empty");
    }
    return await ctx.db.insert("words", {
      userId,
      word,
    });
  },
});
