import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  words: defineTable({
    userId: v.string(),
    word: v.string(),
  }).index("by_userId", ["userId"]),
});
