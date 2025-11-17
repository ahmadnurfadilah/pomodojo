import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  rooms: defineTable({
    name: v.string(),
    ownerId: v.string(),
    visibility: v.union(v.literal('public'), v.literal('private')),
    joinCode: v.optional(v.string()),
    theme: v.string(),
    musicUrl: v.optional(v.string()),
    maxUsers: v.optional(v.number()),
  })
    .index('visibility', ['visibility'])
    .index('ownerId', ['ownerId']),
})
