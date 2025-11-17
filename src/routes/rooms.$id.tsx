import { createFileRoute } from '@tanstack/react-router'
import { SignInButton, useUser } from '@clerk/clerk-react'
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from 'convex/react'
import { Hourglass, LogIn, Pause, Play, RotateCcw, Square } from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'motion/react'
import { api } from '../../convex/_generated/api'
import Header from '../components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/rooms/$id')({
  component: RoomPage,
})

type TimerState = 'idle' | 'running' | 'paused'

// Memoized participant avatar component to prevent unnecessary re-renders
const ParticipantAvatar = memo(
  ({
    participant,
    isCurrentUser,
    displayPosition,
    onMouseDown,
    formatTime,
    isDragging,
  }: {
    participant: {
      id: string
      userId: string
      userName: string
      userInitial: string
      userAvatarUrl?: string
      timerState: TimerState
      timeLeft: number
      task: string
    }
    isCurrentUser: boolean
    displayPosition: { x: number; y: number }
    onMouseDown: () => void
    formatTime: (seconds: number) => string
    isDragging: boolean
  }) => {
    const [isHovered, setIsHovered] = useState(false)
    // Only show timer & task when timer is running
    const showTimerInfo = participant.timerState === 'running'
    // Add smooth transition for other users, but not for current user while dragging
    const shouldTransition = !isCurrentUser || !isDragging

    return (
      <motion.div
        className={`absolute select-none origin-center ${
          isCurrentUser ? 'cursor-move' : ''
        }`}
        style={{
          left: `${displayPosition.x}%`,
          top: `${displayPosition.y}%`,
        }}
        animate={{
          x: '-50%',
          y: '-50%',
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          left: shouldTransition ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 },
          top: shouldTransition ? { duration: 0.3, ease: 'easeOut' } : { duration: 0 },
          x: { duration: 0 },
          y: { duration: 0 },
          scale: { duration: 0.2, ease: 'easeOut' },
        }}
        onMouseDown={onMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col items-center gap-1">
          {/* Timer and task display above avatar - only when timer is running */}
          {showTimerInfo && (
            <div className="relative h-6 perspective-1000">
              {/* Front side - Time Left (default) */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center gap-1"
                animate={{
                  rotateY: isHovered && participant.task ? 180 : 0,
                  opacity: isHovered && participant.task ? 0 : 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut',
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                <Badge variant="secondary" className="bg-emerald-500 text-white">
                  <Hourglass />
                  {formatTime(participant.timeLeft)}
                </Badge>
              </motion.div>

              {/* Back side - Task Info (on hover) */}
              {participant.task && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center gap-1"
                  animate={{
                    rotateY: isHovered ? 0 : -180,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: 'easeInOut',
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="border border-slate-950 bg-white px-1 py-0.5 rounded-lg text-[10px] text-slate-950 whitespace-nowrap">
                    {participant.task}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Avatar */}
          <motion.div
            className="relative"
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
          >
            {participant.timerState === 'running' && (
              <div className="absolute z-10 top-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></div>
            )}

            <div
              className={`relative w-20 aspect-5/6 mask mask-squircle-long p-0.5 bg-slate-950`}
            >
              <div className="relative w-full mask mask-squircle">
                {participant.userAvatarUrl ? (
                  <img
                    src={participant.userAvatarUrl}
                    alt={participant.userName}
                    className="w-full h-full object-cover backdrop-blur-sm pointer-events-none"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center backdrop-blur-sm ${
                      isCurrentUser ? 'bg-emerald-500/90' : 'bg-blue-500/90'
                    }`}
                  >
                    <span className="text-lg font-semibold tracking-tight text-white">
                      {participant.userInitial}
                    </span>
                  </div>
                )}
              </div>

              {/* User name */}
              <div className="absolute bottom-1.5 inset-x-0 text-center text-[10px] text-white font-semibold line-clamp-1">
                {participant.userName}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  },
)

ParticipantAvatar.displayName = 'ParticipantAvatar'

function RoomPage() {
  const { id } = Route.useParams()
  const { user } = useUser()
  const room = useQuery(api.rooms.get, { id: id as any })
  const participants = useQuery(api.rooms.getParticipants, {
    roomId: id as any,
  })
  const joinRoom = useMutation(api.rooms.join)
  const updatePosition = useMutation(api.rooms.updatePosition)
  const updateTimer = useMutation(api.rooms.updateTimer)
  const updateTask = useMutation(api.rooms.updateTask)
  const leaveRoom = useMutation(api.rooms.leaveRoom)
  const [joinCode, setJoinCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  // Avatar position state - use local state for smooth dragging
  const [isDragging, setIsDragging] = useState(false)
  const [localPosition, setLocalPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  // Pomodoro timer state
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [task, setTask] = useState('')
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const taskDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingTaskRef = useRef(false)

  // Get current user's participant data
  const currentUserId = user?.id
  const currentParticipant = participants?.find(
    (p) => p.userId === currentUserId,
  )

  // Automatically set hasJoined to true if user is already a participant (e.g., after page refresh)
  // Also refresh their presence by calling joinRoom to update lastSeen
  useEffect(() => {
    if (currentParticipant && !hasJoined && user && room) {
      // User is already a participant, just refresh their presence
      const userInitial =
        user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0] || 'U'
      const userName =
        user.firstName ||
        user.emailAddresses[0]?.emailAddress.split('@')[0] ||
        'User'

      joinRoom({
        roomId: id as any,
        // joinCode not needed if user is already a participant - mutation handles this
        userName,
        userInitial: userInitial.toUpperCase(),
        userAvatarUrl: user.imageUrl,
      })
        .then(() => {
          setHasJoined(true)
        })
        .catch((error) => {
          console.error('Failed to refresh presence:', error)
          // Still set hasJoined to true even if refresh fails
          setHasJoined(true)
        })
    }
  }, [currentParticipant, hasJoined, user, room, id, joinRoom])

  // Sync local state with participant data when it changes (only on initial join or state changes, not during countdown)
  const hasInitializedRef = useRef(false)
  useEffect(() => {
    if (currentParticipant && hasJoined) {
      // On initial join, sync everything
      if (!hasInitializedRef.current) {
        setTimeLeft(currentParticipant.timeLeft)
        setTimerState(currentParticipant.timerState)
        setTask(currentParticipant.task)
        hasInitializedRef.current = true
      } else {
        // After initialization, only sync state changes (not timeLeft during countdown)
        if (
          currentParticipant.timerState !== timerState &&
          timerState !== 'running'
        ) {
          setTimerState(currentParticipant.timerState)
          setTimeLeft(currentParticipant.timeLeft)
        }
        // Only sync task changes if user is not actively typing
        if (!isTypingTaskRef.current && currentParticipant.task !== task) {
          setTask(currentParticipant.task)
        }
      }
    }
  }, [currentParticipant, hasJoined, timerState])

  // Handle timer countdown and sync to database
  useEffect(() => {
    if (
      timerState === 'running' &&
      timeLeft > 0 &&
      hasJoined &&
      currentUserId
    ) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev <= 1 ? 0 : prev - 1
          // Sync to database every second
          updateTimer({
            roomId: id as any,
            timerState: newTime === 0 ? 'idle' : 'running',
            timeLeft: newTime,
          }).catch(console.error)
          if (newTime === 0) {
            setTimerState('idle')
          }
          return newTime
        })
      }, 1000)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [timerState, timeLeft, hasJoined, currentUserId, id, updateTimer])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hasJoined && currentUserId) {
        leaveRoom({ roomId: id as any }).catch(console.error)
      }
      // Clear task debounce timeout
      if (taskDebounceRef.current) {
        clearTimeout(taskDebounceRef.current)
      }
    }
  }, [hasJoined, currentUserId, id, leaveRoom])

  const handleJoinRoom = async () => {
    if (!user) return

    // Check if room is full before attempting to join
    if (room?.maxUsers && participants) {
      const activeCount = participants.length
      if (activeCount >= room.maxUsers) {
        toast.error('Room is full', {
          description: `This room has reached its maximum capacity of ${room.maxUsers} users.`,
        })
        return
      }
    }

    setIsJoining(true)
    try {
      const userInitial =
        user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0] || 'U'
      const userName =
        user.firstName ||
        user.emailAddresses[0]?.emailAddress.split('@')[0] ||
        'User'

      await joinRoom({
        roomId: id as any,
        joinCode: room?.visibility === 'private' ? joinCode : undefined,
        userName,
        userInitial: userInitial.toUpperCase(),
        userAvatarUrl: user.imageUrl,
      })
      setHasJoined(true)
    } catch (error: any) {
      console.error('Failed to join room:', error)
      const errorMessage =
        error?.message || 'Failed to join room. Please check the join code.'

      if (errorMessage === 'Room is full') {
        toast.error('Room is full', {
          description: `This room has reached its maximum capacity of ${room?.maxUsers || 0} users.`,
        })
      } else {
        toast.error('Failed to join room', {
          description: errorMessage,
        })
      }
    } finally {
      setIsJoining(false)
    }
  }

  // Avatar drag handlers - use local state for smooth dragging
  const handleMouseDown = useCallback(
    (userId: string) => {
      if (!hasJoined || userId !== currentUserId) return
      setIsDragging(true)
      // Initialize local position with current position
      if (currentParticipant) {
        setLocalPosition({
          x: currentParticipant.positionX,
          y: currentParticipant.positionY,
        })
      }
    },
    [hasJoined, currentUserId, currentParticipant],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !hasJoined || !currentUserId) return
      const container = e.currentTarget as HTMLElement
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      // Constrain to container bounds
      const constrainedX = Math.max(5, Math.min(95, x))
      const constrainedY = Math.max(5, Math.min(95, y))

      // Update local state immediately for smooth dragging
      setLocalPosition({ x: constrainedX, y: constrainedY })
    },
    [isDragging, hasJoined, currentUserId],
  )

  const handleMouseUp = async () => {
    if (isDragging && localPosition && hasJoined) {
      // Sync to database only when dragging stops
      await updatePosition({
        roomId: id as any,
        positionX: localPosition.x,
        positionY: localPosition.y,
      }).catch(console.error)
    }
    setIsDragging(false)
    setLocalPosition(null)
  }

  // Timer handlers
  const handleStart = async () => {
    const newTime = timeLeft === 0 ? 25 * 60 : timeLeft
    setTimeLeft(newTime)
    setTimerState('running')
    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'running',
        timeLeft: newTime,
      })
    }
  }

  const handlePause = async () => {
    setTimerState('paused')
    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'paused',
        timeLeft,
      })
    }
  }

  const handleResume = async () => {
    setTimerState('running')
    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'running',
        timeLeft,
      })
    }
  }

  const handleStop = async () => {
    setTimerState('idle')
    const resetTime = 25 * 60
    setTimeLeft(resetTime)
    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'idle',
        timeLeft: resetTime,
      })
    }
  }

  const handleReset = async () => {
    setTimerState('idle')
    const resetTime = 25 * 60
    setTimeLeft(resetTime)
    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'idle',
        timeLeft: resetTime,
      })
    }
  }

  const handleTaskChange = useCallback(
    (newTask: string) => {
      setTask(newTask)
      isTypingTaskRef.current = true

      // Clear previous debounce timeout
      if (taskDebounceRef.current) {
        clearTimeout(taskDebounceRef.current)
      }

      if (hasJoined) {
        // Debounce task updates
        taskDebounceRef.current = setTimeout(() => {
          updateTask({
            roomId: id as any,
            task: newTask,
          }).catch(console.error)
          // Mark typing as complete after debounce
          isTypingTaskRef.current = false
        }, 500)
      } else {
        // If not joined, mark typing as complete immediately
        isTypingTaskRef.current = false
      }
    },
    [hasJoined, id, updateTask],
  )

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  if (room === undefined) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-slate-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-slate-600">Loading room...</p>
        </div>
      </div>
    )
  }

  if (room === null) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 via-slate-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Room not found
          </h1>
          <p className="text-slate-600">
            This room doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    )
  }

  // If user has joined, show full-screen room view
  if (hasJoined && participants !== undefined) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/assets/images/bg/meeting-room.webp)',
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Overlay for better visibility */}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* All participants' avatars */}
          {participants.map((participant) => {
            const isCurrentUser = participant.userId === currentUserId
            // Use local position if dragging, otherwise use database position
            const displayPosition =
              isCurrentUser && isDragging && localPosition
                ? localPosition
                : { x: participant.positionX, y: participant.positionY }

            return (
              <ParticipantAvatar
                key={participant.id}
                participant={participant}
                isCurrentUser={isCurrentUser}
                displayPosition={displayPosition}
                onMouseDown={() => handleMouseDown(participant.userId)}
                formatTime={formatTime}
                isDragging={isDragging && isCurrentUser}
              />
            )
          })}

          {/* Pomodoro timer - floating at bottom center */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl p-4 min-w-[320px] max-w-md">
              <div className="flex flex-col gap-3">
                {/* Task input */}
                <Input
                  type="text"
                  placeholder="What are you working on?"
                  value={task}
                  onChange={(e) => handleTaskChange(e.target.value)}
                  className="text-sm"
                />

                {/* Timer display */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
                    <Hourglass className="h-4 w-4 text-emerald-600" />
                    <span className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>

                {/* Timer controls */}
                <div className="flex items-center justify-center gap-2">
                  {timerState === 'idle' && (
                    <Button
                      onClick={handleStart}
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      <Play className="h-4 w-4" />
                      Start
                    </Button>
                  )}
                  {timerState === 'running' && (
                    <>
                      <Button onClick={handlePause} size="sm" variant="outline">
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                      <Button onClick={handleStop} size="sm" variant="outline">
                        <Square className="h-4 w-4" />
                        Stop
                      </Button>
                    </>
                  )}
                  {timerState === 'paused' && (
                    <>
                      <Button
                        onClick={handleResume}
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600"
                      >
                        <Play className="h-4 w-4" />
                        Resume
                      </Button>
                      <Button onClick={handleReset} size="sm" variant="outline">
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Not joined state - styled similar to index.tsx
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-slate-50 via-slate-50 to-slate-50">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-linear-to-b border-slate-100/70 from-slate-50 via-slate-50 to-slate-50">
          <div className="container mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-14 lg:pb-24">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-6xl">{room.theme}</div>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                      {room.name}
                    </h1>
                    <p className="text-slate-600 mt-1 text-sm">
                      {room.visibility === 'public'
                        ? 'Public Room'
                        : 'Private Room'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {room.musicUrl && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Music URL</p>
                      <p className="text-sm text-slate-900">{room.musicUrl}</p>
                    </div>
                  )}
                  {room.maxUsers && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Users</p>
                      <p className="text-sm text-slate-900">
                        {participants ? participants.length : 0} /{' '}
                        {room.maxUsers}
                      </p>
                    </div>
                  )}
                  {!room.maxUsers &&
                    participants &&
                    participants.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Active Users
                        </p>
                        <p className="text-sm text-slate-900">
                          {participants.length}
                        </p>
                      </div>
                    )}
                  {room.visibility === 'private' && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">
                        Join Code Required
                      </p>
                      <Unauthenticated>
                        <p className="text-xs text-slate-400 mb-2">
                          Sign in to enter the join code
                        </p>
                      </Unauthenticated>
                      <Authenticated>
                        <Input
                          type="text"
                          placeholder="Enter join code"
                          value={joinCode}
                          onChange={(e) =>
                            setJoinCode(e.target.value.toUpperCase())
                          }
                          className="font-mono max-w-xs text-sm"
                          maxLength={6}
                        />
                      </Authenticated>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Unauthenticated>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <p className="text-sm text-slate-700 mb-3">
                          Sign in to join this room
                        </p>
                        <SignInButton mode="modal">
                          <Button
                            variant="outline"
                            className="border-2 border-emerald-300"
                          >
                            <LogIn className="mr-2 w-4 h-4" />
                            Sign In to Join
                          </Button>
                        </SignInButton>
                      </div>
                    </div>
                  </Unauthenticated>
                  <Authenticated>
                    {(() => {
                      const isFull = Boolean(
                        room.maxUsers &&
                          participants &&
                          participants.length >= room.maxUsers,
                      )
                      return (
                        <Button
                          onClick={handleJoinRoom}
                          disabled={
                            isJoining ||
                            (room.visibility === 'private' && !joinCode) ||
                            isFull
                          }
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isFull
                            ? 'Room Full'
                            : isJoining
                              ? 'Joining...'
                              : 'Join Room'}
                        </Button>
                      )
                    })()}
                  </Authenticated>
                </div>

                <p className="text-xs text-slate-400 mt-6">
                  Room features: Live avatars, Pomodoro timers, and shared
                  music!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
