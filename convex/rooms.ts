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
      const roomsArray = Array.from(roomMap.values()).sort(
        (a, b) => b._creationTime - a._creationTime,
      )

      // Get active users count for each room
      const roomsWithActiveUsers = await Promise.all(
        roomsArray.map(async (room) => {
          const participants = await ctx.db
            .query('roomParticipants')
            .withIndex('roomId', (q) => q.eq('roomId', room._id))
            .collect()

          // Filter out participants who haven't been seen in 30 seconds (disconnected)
          const now = Date.now()
          const activeParticipants = participants.filter(
            (p) => now - p.lastSeen < 30000,
          )

          return {
            id: room._id,
            name: room.name,
            theme: room.theme,
            ownerId: room.ownerId,
            visibility: room.visibility,
            musicUrl: room.musicUrl,
            maxUsers: room.maxUsers,
            activeUsers: activeParticipants.length,
            createdAt: room._creationTime,
          }
        }),
      )

      return roomsWithActiveUsers
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

      // Check if room is full (only for new participants)
      if (room.maxUsers) {
        const participants = await ctx.db
          .query('roomParticipants')
          .withIndex('roomId', (q) => q.eq('roomId', args.roomId))
          .collect()

        // Filter out participants who haven't been seen in 30 seconds (disconnected)
        const now = Date.now()
        const activeParticipants = participants.filter(
          (p) => now - p.lastSeen < 30000,
        )

        if (activeParticipants.length >= room.maxUsers) {
          throw new Error('Room is full')
        }
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
        timerType: 'pomodoro',
        timeLeft: 25 * 60,
        task: '',
        pomodoroCount: 0,
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
        timerType: p.timerType ?? 'pomodoro', // Default for existing documents
        timeLeft: p.timeLeft,
        task: p.task,
        pomodoroCount: p.pomodoroCount ?? 0, // Default for existing documents
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
    timerType: v.optional(
      v.union(
        v.literal('pomodoro'),
        v.literal('shortBreak'),
        v.literal('longBreak'),
      ),
    ),
    timeLeft: v.number(),
    pomodoroCount: v.optional(v.number()),
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

      const updateData: any = {
        timerState: args.timerState,
        timeLeft: args.timeLeft,
        lastSeen: Date.now(),
      }

      // Always set timerType and pomodoroCount to ensure they exist
      updateData.timerType = args.timerType ?? participant.timerType ?? 'pomodoro'
      updateData.pomodoroCount = args.pomodoroCount ?? participant.pomodoroCount ?? 0

      await ctx.db.patch(participant._id, updateData)

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
 * Save a pomodoro session when timer is stopped
 */
export const savePomodoroSession = mutation({
  args: {
    roomId: v.id('rooms'),
    timerType: v.union(
      v.literal('pomodoro'),
      v.literal('shortBreak'),
      v.literal('longBreak'),
    ),
    duration: v.number(), // Duration in seconds that was completed
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

      // Save the session
      await ctx.db.insert('pomodoroSessions', {
        roomId: args.roomId,
        userId,
        userName: participant.userName,
        userInitial: participant.userInitial,
        userAvatarUrl: participant.userAvatarUrl,
        timerType: args.timerType,
        duration: args.duration,
        task: args.task,
        completedAt: Date.now(),
      })

      return { success: true }
    } catch (error) {
      console.error('Error saving pomodoro session:', error)
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

/**
 * Get leaderboard for a room
 * Returns users ordered by total time (descending)
 */
export const getLeaderboard = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    try {
      // Get all sessions for this room
      const sessions = await ctx.db
        .query('pomodoroSessions')
        .withIndex('roomId', (q) => q.eq('roomId', args.roomId))
        .collect()

      // Group by userId and aggregate
      const userStats = new Map<
        string,
        {
          userId: string
          userName: string
          userInitial?: string
          userAvatarUrl?: string
          totalSessions: number
          totalTime: number
        }
      >()

      for (const session of sessions) {
        const existing = userStats.get(session.userId)
        if (existing) {
          existing.totalSessions += 1
          existing.totalTime += session.duration
          // Update avatar/initial if available (use latest)
          if (session.userAvatarUrl) {
            existing.userAvatarUrl = session.userAvatarUrl
          }
          if (session.userInitial) {
            existing.userInitial = session.userInitial
          }
        } else {
          userStats.set(session.userId, {
            userId: session.userId,
            userName: session.userName,
            userInitial: session.userInitial,
            userAvatarUrl: session.userAvatarUrl,
            totalSessions: 1,
            totalTime: session.duration,
          })
        }
      }

      // Convert to array and sort by total time (descending)
      const leaderboard = Array.from(userStats.values()).sort(
        (a, b) => b.totalTime - a.totalTime,
      )

      return leaderboard
    } catch (error) {
      console.error('Error getting leaderboard:', error)
      throw error
    }
  },
})

/**
 * Get user's session history for a room
 * Returns sessions ordered by completion time (newest first)
 */
export const getUserSessions = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new Error('Not authenticated')
      }

      const userId = identity.subject

      // Get all sessions for this user in this room
      const sessions = await ctx.db
        .query('pomodoroSessions')
        .withIndex('roomId_userId', (q) =>
          q.eq('roomId', args.roomId).eq('userId', userId),
        )
        .collect()

      // Sort by completedAt descending (newest first)
      const sortedSessions = sessions.sort(
        (a, b) => b.completedAt - a.completedAt,
      )

      return sortedSessions.map((session) => ({
        id: session._id,
        timerType: session.timerType,
        duration: session.duration,
        task: session.task,
        completedAt: session.completedAt,
      }))
    } catch (error) {
      console.error('Error getting user sessions:', error)
      throw error
    }
  },
})

/**
 * Update cursor position
 * Called frequently to track user's cursor position
 */
export const updateCursorPosition = mutation({
  args: {
    roomId: v.id('rooms'),
    cursorX: v.number(),
    cursorY: v.number(),
    typingText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new Error('Not authenticated')
      }

      const userId = identity.subject

      // Get participant info for user details
      const participant = await ctx.db
        .query('roomParticipants')
        .withIndex('userId_roomId', (q) =>
          q.eq('userId', userId).eq('roomId', args.roomId),
        )
        .first()

      if (!participant) {
        throw new Error('Participant not found')
      }

      // Check if cursor position already exists
      const existing = await ctx.db
        .query('cursorPositions')
        .withIndex('userId_roomId', (q) =>
          q.eq('userId', userId).eq('roomId', args.roomId),
        )
        .first()

      const now = Date.now()
      const cursorData: any = {
        roomId: args.roomId,
        userId,
        userName: participant.userName,
        userInitial: participant.userInitial,
        userAvatarUrl: participant.userAvatarUrl,
        cursorX: args.cursorX,
        cursorY: args.cursorY,
        lastSeen: now,
      }

      // Include typingText if provided
      if (args.typingText !== undefined) {
        cursorData.typingText = args.typingText || undefined
      } else if (existing) {
        // Preserve existing typingText if not provided
        cursorData.typingText = existing.typingText
      }

      if (existing) {
        // Update existing cursor position
        await ctx.db.patch(existing._id, cursorData)
      } else {
        // Create new cursor position
        await ctx.db.insert('cursorPositions', cursorData)
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating cursor position:', error)
      throw error
    }
  },
})

/**
 * Get all cursor positions for a room
 * Returns active cursors (seen within last 5 seconds)
 */
export const getCursorPositions = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    try {
      const cursors = await ctx.db
        .query('cursorPositions')
        .withIndex('roomId', (q) => q.eq('roomId', args.roomId))
        .collect()

      // Filter out cursors that haven't been seen in 5 seconds
      const now = Date.now()
      const activeCursors = cursors.filter(
        (c) => now - c.lastSeen < 5000,
      )

      return activeCursors.map((c) => ({
        id: c._id,
        userId: c.userId,
        userName: c.userName,
        userInitial: c.userInitial,
        userAvatarUrl: c.userAvatarUrl,
        cursorX: c.cursorX,
        cursorY: c.cursorY,
        typingText: c.typingText,
      }))
    } catch (error) {
      console.error('Error getting cursor positions:', error)
      throw error
    }
  },
})

/**
 * Send a chat message
 */
export const sendChatMessage = mutation({
  args: {
    roomId: v.id('rooms'),
    message: v.string(),
    cursorX: v.number(),
    cursorY: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity()
      if (identity === null) {
        throw new Error('Not authenticated')
      }

      const userId = identity.subject

      // Get participant info for user details
      const participant = await ctx.db
        .query('roomParticipants')
        .withIndex('userId_roomId', (q) =>
          q.eq('userId', userId).eq('roomId', args.roomId),
        )
        .first()

      if (!participant) {
        throw new Error('Participant not found')
      }

      // Create chat message
      await ctx.db.insert('chatMessages', {
        roomId: args.roomId,
        userId,
        userName: participant.userName,
        userInitial: participant.userInitial,
        userAvatarUrl: participant.userAvatarUrl,
        message: args.message,
        cursorX: args.cursorX,
        cursorY: args.cursorY,
        createdAt: Date.now(),
      })

      return { success: true }
    } catch (error) {
      console.error('Error sending chat message:', error)
      throw error
    }
  },
})

/**
 * Get recent chat messages for a room
 * Returns last 100 messages sorted by creation time
 */
export const getChatMessages = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    try {
      const messages = await ctx.db
        .query('chatMessages')
        .withIndex('roomId_createdAt', (q) => q.eq('roomId', args.roomId))
        .order('desc')
        .take(100)

      // Sort by creation time (oldest first for display)
      const sortedMessages = messages.sort((a, b) => a.createdAt - b.createdAt)

      return sortedMessages.map((m) => ({
        id: m._id,
        userId: m.userId,
        userName: m.userName,
        userInitial: m.userInitial,
        userAvatarUrl: m.userAvatarUrl,
        message: m.message,
        cursorX: m.cursorX,
        cursorY: m.cursorY,
        createdAt: m.createdAt,
      }))
    } catch (error) {
      console.error('Error getting chat messages:', error)
      throw error
    }
  },
})

/**
 * Remove cursor position when user leaves or disconnects
 */
export const removeCursorPosition = mutation({
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

      const cursor = await ctx.db
        .query('cursorPositions')
        .withIndex('userId_roomId', (q) =>
          q.eq('userId', userId).eq('roomId', args.roomId),
        )
        .first()

      if (cursor) {
        await ctx.db.delete(cursor._id)
      }

      return { success: true }
    } catch (error) {
      console.error('Error removing cursor position:', error)
      throw error
    }
  },
})

/**
 * Get global leaderboard across all rooms
 * Returns users ordered by total time (descending)
 * Supports filtering by time period: 'today', 'thisMonth', 'lifetime'
 */
export const getGlobalLeaderboard = query({
  args: {
    period: v.union(
      v.literal('today'),
      v.literal('thisMonth'),
      v.literal('lifetime'),
    ),
  },
  handler: async (ctx, args) => {
    try {
      // Get all sessions
      const allSessions = await ctx.db.query('pomodoroSessions').collect()

      // Calculate time boundaries based on period
      const now = Date.now()
      let startTime: number

      switch (args.period) {
        case 'today': {
          const today = new Date(now)
          today.setHours(0, 0, 0, 0)
          startTime = today.getTime()
          break
        }
        case 'thisMonth': {
          const thisMonth = new Date(now)
          thisMonth.setDate(1)
          thisMonth.setHours(0, 0, 0, 0)
          startTime = thisMonth.getTime()
          break
        }
        case 'lifetime':
        default:
          startTime = 0
          break
      }

      // Filter sessions by time period
      const filteredSessions = allSessions.filter(
        (session) => session.completedAt >= startTime,
      )

      // Group by userId and aggregate
      const userStats = new Map<
        string,
        {
          userId: string
          userName: string
          userInitial?: string
          userAvatarUrl?: string
          totalSessions: number
          totalTime: number
        }
      >()

      for (const session of filteredSessions) {
        const existing = userStats.get(session.userId)
        if (existing) {
          existing.totalSessions += 1
          existing.totalTime += session.duration
          // Update avatar/initial if available (use latest)
          if (session.userAvatarUrl) {
            existing.userAvatarUrl = session.userAvatarUrl
          }
          if (session.userInitial) {
            existing.userInitial = session.userInitial
          }
        } else {
          userStats.set(session.userId, {
            userId: session.userId,
            userName: session.userName,
            userInitial: session.userInitial,
            userAvatarUrl: session.userAvatarUrl,
            totalSessions: 1,
            totalTime: session.duration,
          })
        }
      }

      // Convert to array and sort by total time (descending)
      const leaderboard = Array.from(userStats.values()).sort(
        (a, b) => b.totalTime - a.totalTime,
      )

      return leaderboard
    } catch (error) {
      console.error('Error getting global leaderboard:', error)
      throw error
    }
  },
})
