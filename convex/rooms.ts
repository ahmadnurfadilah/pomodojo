import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

/**
 * List all public rooms and rooms owned by the authenticated user
 * Returns rooms sorted by creation time (newest first)
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      const userId = identity?.subject

      // Get all public rooms
      const publicRooms = await ctx.db
        .query('rooms')
        .withIndex('visibility', (q) => q.eq('visibility', 'public'))
        .order('desc')
        .collect()

      // Get user-owned rooms if authenticated
      let userRooms: typeof publicRooms = []
      if (userId) {
        userRooms = await ctx.db
          .query('rooms')
          .withIndex('ownerId', (q) => q.eq('ownerId', userId))
          .order('desc')
          .collect()
      }

      // Combine and deduplicate by room ID
      const roomMap = new Map()

      // Add public rooms
      publicRooms.forEach((room) => {
        roomMap.set(room._id.toString(), room)
      })

      // Add user rooms (will overwrite if already in map, but that's fine)
      userRooms.forEach((room) => {
        roomMap.set(room._id.toString(), room)
      })

      // Convert to array and map to return format
      return Array.from(roomMap.values())
        .sort((a, b) => b._creationTime - a._creationTime)
        .map((room) => ({
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
    userName: v.string(),
    userInitial: v.string(),
    userAvatarUrl: v.optional(v.string()),
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

      const userId = identity.subject

      // Check if user is already a participant
      const existing = await ctx.db
        .query('roomParticipants')
        .withIndex('userId_roomId', (q) =>
          q.eq('userId', userId).eq('roomId', args.roomId),
        )
        .first()

      if (existing) {
        // Update last seen and avatar URL (in case it changed)
        // Existing participants don't need to provide join code again
        await ctx.db.patch(existing._id, {
          lastSeen: Date.now(),
          ...(args.userAvatarUrl !== undefined && {
            userAvatarUrl: args.userAvatarUrl,
          }),
        })
        return { success: true, roomId: room._id }
      }

      // Only require join code for new participants joining private rooms
      if (room.visibility === 'private') {
        if (!args.joinCode || args.joinCode !== room.joinCode) {
          throw new Error('Invalid join code')
        }
      }

      // Create new participant entry
      await ctx.db.insert('roomParticipants', {
        roomId: args.roomId,
        userId,
        userName: args.userName,
        userInitial: args.userInitial,
        userAvatarUrl: args.userAvatarUrl,
        positionX: 50,
        positionY: 50,
        timerState: 'idle',
        timeLeft: 25 * 60,
        task: '',
        lastSeen: Date.now(),
      })

      return { success: true, roomId: room._id }
    } catch (error) {
      console.error('Error joining room:', error)
      throw error
    }
  },
})

/**
 * Get all participants in a room
 */
export const getParticipants = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    try {
      const participants = await ctx.db
        .query('roomParticipants')
        .withIndex('roomId', (q) => q.eq('roomId', args.roomId))
        .collect()

      // Filter out participants who haven't been seen in 30 seconds (disconnected)
      const now = Date.now()
      const activeParticipants = participants.filter(
        (p) => now - p.lastSeen < 30000,
      )

      return activeParticipants.map((p) => ({
        id: p._id,
        userId: p.userId,
        userName: p.userName,
        userInitial: p.userInitial,
        userAvatarUrl: p.userAvatarUrl,
        positionX: p.positionX,
        positionY: p.positionY,
        timerState: p.timerState,
        timeLeft: p.timeLeft,
        task: p.task,
      }))
    } catch (error) {
      console.error('Error getting participants:', error)
      throw error
    }
  },
})

/**
 * Update participant position
 */
export const updatePosition = mutation({
  args: {
    roomId: v.id('rooms'),
    positionX: v.number(),
    positionY: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new Error('Not authenticated')
      }

      const userId = identity.subject

      const participant = await ctx.db
        .query('roomParticipants')
        .withIndex('userId_roomId', (q) =>
          q.eq('userId', userId).eq('roomId', args.roomId),
        )
        .first()

      if (!participant) {
        throw new Error('Participant not found')
      }

      await ctx.db.patch(participant._id, {
        positionX: args.positionX,
        positionY: args.positionY,
        lastSeen: Date.now(),
      })

      return { success: true }
    } catch (error) {
      console.error('Error updating position:', error)
      throw error
    }
  },
})

/**
 * Update participant timer state
 */
export const updateTimer = mutation({
  args: {
    roomId: v.id('rooms'),
    timerState: v.union(
      v.literal('idle'),
      v.literal('running'),
      v.literal('paused'),
    ),
    timeLeft: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new Error('Not authenticated')
      }

      const userId = identity.subject

      const participant = await ctx.db
        .query('roomParticipants')
        .withIndex('userId_roomId', (q) =>
          q.eq('userId', userId).eq('roomId', args.roomId),
        )
        .first()

      if (!participant) {
        throw new Error('Participant not found')
      }

      await ctx.db.patch(participant._id, {
        timerState: args.timerState,
        timeLeft: args.timeLeft,
        lastSeen: Date.now(),
      })

      return { success: true }
    } catch (error) {
      console.error('Error updating timer:', error)
      throw error
    }
  },
})

/**
 * Update participant task
 */
export const updateTask = mutation({
  args: {
    roomId: v.id('rooms'),
    task: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new Error('Not authenticated')
      }

      const userId = identity.subject

      const participant = await ctx.db
        .query('roomParticipants')
        .withIndex('userId_roomId', (q) =>
          q.eq('userId', userId).eq('roomId', args.roomId),
        )
        .first()

      if (!participant) {
        throw new Error('Participant not found')
      }

      await ctx.db.patch(participant._id, {
        task: args.task,
        lastSeen: Date.now(),
      })

      return { success: true }
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },
})

/**
 * Leave a room (remove participant)
 */
export const leaveRoom = mutation({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new Error('Not authenticated')
      }

      const userId = identity.subject

      const participant = await ctx.db
        .query('roomParticipants')
        .withIndex('userId_roomId', (q) =>
          q.eq('userId', userId).eq('roomId', args.roomId),
        )
        .first()

      if (participant) {
        await ctx.db.delete(participant._id)
      }

      return { success: true }
    } catch (error) {
      console.error('Error leaving room:', error)
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

/**
 * Update a room
 * Requires authentication and ownership
 */
export const update = mutation({
  args: {
    roomId: v.id('rooms'),
    name: v.optional(v.string()),
    visibility: v.optional(v.union(v.literal('public'), v.literal('private'))),
    theme: v.optional(v.string()),
    musicUrl: v.optional(v.string()),
    maxUsers: v.optional(v.number()),
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

      if (room.ownerId !== identity.subject) {
        throw new Error('Not authorized to update this room')
      }

      // Generate new join code if visibility changed to private
      let joinCode = room.joinCode
      if (args.visibility === 'private' && room.visibility === 'public') {
        joinCode = generateJoinCode()
      } else if (args.visibility === 'public') {
        joinCode = undefined
      }

      await ctx.db.patch(args.roomId, {
        ...(args.name !== undefined && { name: args.name }),
        ...(args.visibility !== undefined && { visibility: args.visibility }),
        ...(args.theme !== undefined && { theme: args.theme }),
        ...(args.musicUrl !== undefined && { musicUrl: args.musicUrl }),
        ...(args.maxUsers !== undefined && { maxUsers: args.maxUsers }),
        ...(joinCode !== undefined && { joinCode }),
      })

      return { success: true }
    } catch (error) {
      console.error('Error updating room:', error)
      throw error
    }
  },
})

/**
 * Delete a room
 * Requires authentication and ownership
 */
export const remove = mutation({
  args: {
    roomId: v.id('rooms'),
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

      if (room.ownerId !== identity.subject) {
        throw new Error('Not authorized to delete this room')
      }

      await ctx.db.delete(args.roomId)
      return { success: true }
    } catch (error) {
      console.error('Error deleting room:', error)
      throw error
    }
  },
})
