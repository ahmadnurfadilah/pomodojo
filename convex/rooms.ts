import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

/**
 * List all public rooms
 * Returns rooms sorted by creation time (newest first)
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    try {
      const rooms = await ctx.db
        .query('rooms')
        .withIndex('visibility', (q) => q.eq('visibility', 'public'))
        .order('desc')
        .collect()

      return rooms.map((room) => ({
        id: room._id,
        name: room.name,
        theme: room.theme,
        ownerId: room.ownerId,
        visibility: room.visibility,
        musicUrl: room.musicUrl,
        maxUsers: room.maxUsers,
        createdAt: room._creationTime,
      }))
    } catch (error) {
      console.error('Error listing rooms:', error)
      throw error
    }
  },
})

/**
 * Get a single room by ID
 */
export const get = query({
  args: { id: v.id('rooms') },
  handler: async (ctx, args) => {
    try {
      const room = await ctx.db.get(args.id)
      if (!room) {
        return null
      }

      return {
        id: room._id,
        name: room.name,
        theme: room.theme,
        ownerId: room.ownerId,
        visibility: room.visibility,
        joinCode: room.joinCode,
        musicUrl: room.musicUrl,
        maxUsers: room.maxUsers,
        createdAt: room._creationTime,
      }
    } catch (error) {
      console.error('Error getting room:', error)
      throw error
    }
  },
})

/**
 * Generate a random join code for private rooms
 */
function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluding confusing chars
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Join a room
 * Requires authentication
 */
export const join = mutation({
  args: {
    roomId: v.id('rooms'),
    joinCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new Error('Not authenticated')
      }

      const room = await ctx.db.get(args.roomId)
      if (!room) {
        throw new Error('Room not found')
      }

      if (room.visibility === 'private') {
        if (!args.joinCode || args.joinCode !== room.joinCode) {
          throw new Error('Invalid join code')
        }
      }

      // In the future, this would add the user to a presence/participants table
      // For now, we just validate they can join
      return { success: true, roomId: room._id }
    } catch (error) {
      console.error('Error joining room:', error)
      throw error
    }
  },
})

/**
 * Create a new room
 * Requires authentication
 */
export const create = mutation({
  args: {
    name: v.string(),
    visibility: v.union(v.literal('public'), v.literal('private')),
    theme: v.string(),
    musicUrl: v.optional(v.string()),
    maxUsers: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new Error('Not authenticated')
      }

      const joinCode =
        args.visibility === 'private' ? generateJoinCode() : undefined

      const roomId = await ctx.db.insert('rooms', {
        name: args.name,
        ownerId: identity.subject, // Use Clerk user ID
        visibility: args.visibility,
        joinCode,
        theme: args.theme,
        musicUrl: args.musicUrl,
        maxUsers: args.maxUsers,
      })

      return roomId
    } catch (error) {
      console.error('Error creating room:', error)
      throw error
    }
  },
})
