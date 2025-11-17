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

  roomParticipants: defineTable({
    roomId: v.id('rooms'),
    userId: v.string(),
    userName: v.string(),
    userInitial: v.string(),
    userAvatarUrl: v.optional(v.string()),
    positionX: v.number(),
    positionY: v.number(),
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
    task: v.string(),
    pomodoroCount: v.optional(v.number()), // Track completed pomodoros for auto long break
    lastSeen: v.number(),
  })
    .index('roomId', ['roomId'])
    .index('userId_roomId', ['userId', 'roomId']),

  pomodoroSessions: defineTable({
    roomId: v.id('rooms'),
    userId: v.string(),
    userName: v.string(),
    userInitial: v.optional(v.string()),
    userAvatarUrl: v.optional(v.string()),
    timerType: v.union(
      v.literal('pomodoro'),
      v.literal('shortBreak'),
      v.literal('longBreak'),
    ),
    duration: v.number(), // Duration in seconds
    task: v.string(),
    completedAt: v.number(), // Timestamp
  })
    .index('roomId', ['roomId'])
    .index('userId', ['userId'])
    .index('roomId_userId', ['roomId', 'userId']),

  cursorPositions: defineTable({
    roomId: v.id('rooms'),
    userId: v.string(),
    userName: v.string(),
    userInitial: v.string(),
    userAvatarUrl: v.optional(v.string()),
    cursorX: v.number(), // Cursor X position (0-100 percentage)
    cursorY: v.number(), // Cursor Y position (0-100 percentage)
    typingText: v.optional(v.string()), // Text being typed (shown in real-time)
    lastSeen: v.number(), // Timestamp for cleanup
  })
    .index('roomId', ['roomId'])
    .index('userId_roomId', ['userId', 'roomId']),

  chatMessages: defineTable({
    roomId: v.id('rooms'),
    userId: v.string(),
    userName: v.string(),
    userInitial: v.string(),
    userAvatarUrl: v.optional(v.string()),
    message: v.string(),
    cursorX: v.number(), // Cursor X position when message was sent
    cursorY: v.number(), // Cursor Y position when message was sent
    createdAt: v.number(), // Timestamp
  })
    .index('roomId', ['roomId'])
    .index('roomId_createdAt', ['roomId', 'createdAt']),
})
