import { Link, createFileRoute } from '@tanstack/react-router'
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from 'convex/react'
import {
  Hourglass,
  LogIn,
  Medal,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Square,
} from 'lucide-react'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { motion } from 'motion/react'
import { api } from '../../convex/_generated/api'
import Header from '../components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CreateRoomForm } from '@/components/create-room-form'
import Logo from '@/components/logo'

export const Route = createFileRoute('/rooms/$id')({
  component: RoomPage,
})

type TimerState = 'idle' | 'running' | 'paused'
type TimerType = 'pomodoro' | 'shortBreak' | 'longBreak'

// Timer durations in seconds
const TIMER_DURATIONS: Record<TimerType, number> = {
  pomodoro: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
}

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
      timerType: TimerType
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
        animate={{
          left: `${displayPosition.x}%`,
          top: `${displayPosition.y}%`,
          x: '-50%',
          y: '-50%',
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          left: shouldTransition
            ? { duration: 0.3, ease: 'easeOut' }
            : { duration: 0 },
          top: shouldTransition
            ? { duration: 0.3, ease: 'easeOut' }
            : { duration: 0 },
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
                <Badge
                  variant="secondary"
                  className="bg-emerald-500 text-white"
                >
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
  const leaderboard = useQuery(api.rooms.getLeaderboard, {
    roomId: id as any,
  })
  const joinRoom = useMutation(api.rooms.join)
  const updatePosition = useMutation(api.rooms.updatePosition)
  const updateTimer = useMutation(api.rooms.updateTimer)
  const updateTask = useMutation(api.rooms.updateTask)
  const savePomodoroSession = useMutation(api.rooms.savePomodoroSession)
  const leaveRoom = useMutation(api.rooms.leaveRoom)
  const updateRoom = useMutation(api.rooms.update)
  const [joinCode, setJoinCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isLeaderboardDialogOpen, setIsLeaderboardDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    visibility: 'public' as 'public' | 'private',
    theme: '🪷',
    musicUrl: '',
    maxUsers: undefined as number | undefined,
  })

  // Avatar position state - use local state for smooth dragging
  const [isDragging, setIsDragging] = useState(false)
  const [localPosition, setLocalPosition] = useState<{
    x: number
    y: number
  } | null>(null)

  // Pomodoro timer state
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [timerType, setTimerType] = useState<TimerType>('pomodoro')
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.pomodoro)
  const [task, setTask] = useState('')
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [initialTime, setInitialTime] = useState(TIMER_DURATIONS.pomodoro) // Track initial time for session duration
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const taskDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingTaskRef = useRef(false)
  const timerStateRef = useRef<TimerState>(timerState) // Track timer state in ref to avoid stale closures
  const isUserControllingTimerRef = useRef(false) // Track if user is actively controlling the timer

  // Get current user's participant data
  const currentUserId = user?.id
  const currentParticipant = participants?.find(
    (p) => p.userId === currentUserId,
  )

  // Automatically set hasJoined to true if user is already a participant (e.g., after page refresh)
  // Also refresh their presence by calling joinRoom to update lastSeen
  useEffect(() => {
    // Only run when participants query has loaded (not undefined) and user is already a participant
    if (
      participants !== undefined &&
      currentParticipant &&
      !hasJoined &&
      user &&
      room
    ) {
      // Set hasJoined immediately since user is already a participant
      setHasJoined(true)

      // Refresh their presence by calling joinRoom to update lastSeen
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
      }).catch((error) => {
        console.error('Failed to refresh presence:', error)
        // hasJoined is already set, so user can still use the room
      })
    }
  }, [participants, currentParticipant, hasJoined, user, room, id, joinRoom])

  // Sync local state with participant data when it changes (only on initial join or state changes, not during countdown)
  const hasInitializedRef = useRef(false)
  useEffect(() => {
    if (currentParticipant && hasJoined) {
      // On initial join, sync everything
      if (!hasInitializedRef.current) {
        // Query provides defaults, so timerType and pomodoroCount are always defined
        setTimeLeft(currentParticipant.timeLeft)
        setTimerState(currentParticipant.timerState)
        setTimerType(currentParticipant.timerType)
        setTask(currentParticipant.task)
        setPomodoroCount(currentParticipant.pomodoroCount)
        setInitialTime(TIMER_DURATIONS[currentParticipant.timerType])
        hasInitializedRef.current = true
      } else {
        // After initialization, only sync state changes when:
        // 1. Timer is idle (not user-controlled)
        // 2. User is not actively controlling the timer
        // 3. The state change came from the database (not from user action)
        if (
          currentParticipant.timerState !== timerState &&
          timerState !== 'running' &&
          !isUserControllingTimerRef.current
        ) {
          setTimerState(currentParticipant.timerState)
          setTimeLeft(currentParticipant.timeLeft)
          timerStateRef.current = currentParticipant.timerState
        }
        // Sync timer type changes (query provides defaults)
        if (currentParticipant.timerType !== timerType) {
          setTimerType(currentParticipant.timerType)
          setInitialTime(TIMER_DURATIONS[currentParticipant.timerType])
        }
        // Sync pomodoro count (query provides defaults)
        if (currentParticipant.pomodoroCount !== pomodoroCount) {
          setPomodoroCount(currentParticipant.pomodoroCount)
        }
        // Only sync task changes if user is not actively typing
        if (!isTypingTaskRef.current && currentParticipant.task !== task) {
          setTask(currentParticipant.task)
        }
      }
    }
  }, [
    currentParticipant,
    hasJoined,
    timerState,
    timerType,
    pomodoroCount,
    task,
  ])

  // Update ref whenever timerState changes
  useEffect(() => {
    timerStateRef.current = timerState
  }, [timerState])

  // Handle timer countdown and sync to database, with auto-break logic
  useEffect(() => {
    // Clear any existing interval first
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    if (
      timerState === 'running' &&
      timeLeft > 0 &&
      hasJoined &&
      currentUserId
    ) {
      timerIntervalRef.current = setInterval(() => {
        // Check if timer is still running (using ref to avoid stale closure)
        if (timerStateRef.current !== 'running') {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
            timerIntervalRef.current = null
          }
          return
        }

        setTimeLeft((prev) => {
          // Double-check state before proceeding
          if (timerStateRef.current !== 'running') {
            return prev
          }

          const newTime = prev <= 1 ? 0 : prev - 1
          // Sync to database every second
          updateTimer({
            roomId: id as any,
            timerState: newTime === 0 ? 'idle' : 'running',
            timeLeft: newTime,
          }).catch(console.error)

          if (newTime === 0) {
            // Timer completed - handle auto-break logic
            const completedDuration = initialTime // Full duration was completed

            // Save session (hasJoined is already checked in outer condition)
            savePomodoroSession({
              roomId: id as any,
              timerType,
              duration: completedDuration,
              task,
            }).catch(console.error)

            // Auto-break logic
            if (timerType === 'pomodoro') {
              // Increment pomodoro count
              const newPomodoroCount = pomodoroCount + 1
              setPomodoroCount(newPomodoroCount)

              // After 4 pomodoros, take long break, otherwise short break
              const nextTimerType: TimerType =
                newPomodoroCount % 4 === 0 ? 'longBreak' : 'shortBreak'
              const nextDuration = TIMER_DURATIONS[nextTimerType]

              setTimerType(nextTimerType)
              setTimeLeft(nextDuration)
              setInitialTime(nextDuration)
              setTimerState('running')
              timerStateRef.current = 'running'

              // Update database
              updateTimer({
                roomId: id as any,
                timerState: 'running',
                timerType: nextTimerType,
                timeLeft: nextDuration,
                pomodoroCount: newPomodoroCount,
              }).catch(console.error)

              toast.success(
                newPomodoroCount % 4 === 0
                  ? 'Pomodoro completed! Time for a long break 🎉'
                  : 'Pomodoro completed! Time for a short break ☕',
              )
            } else {
              // Break completed - return to pomodoro
              setTimerType('pomodoro')
              setTimeLeft(TIMER_DURATIONS.pomodoro)
              setInitialTime(TIMER_DURATIONS.pomodoro)
              setTimerState('idle')
              timerStateRef.current = 'idle'

              // Update database
              updateTimer({
                roomId: id as any,
                timerState: 'idle',
                timerType: 'pomodoro',
                timeLeft: TIMER_DURATIONS.pomodoro,
              }).catch(console.error)

              toast.success('Break completed! Ready for next pomodoro 🍅')
            }
          }
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [
    timerState,
    hasJoined,
    currentUserId,
    id,
    updateTimer,
    timerType,
    pomodoroCount,
    initialTime,
    task,
    savePomodoroSession,
  ])

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

      // Constrain to containerr bounds
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
    // Clear any existing interval first
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    isUserControllingTimerRef.current = true
    const newTime = timeLeft === 0 ? TIMER_DURATIONS[timerType] : timeLeft
    setTimeLeft(newTime)
    setInitialTime(newTime)
    setTimerState('running')
    timerStateRef.current = 'running'
    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'running',
        timerType,
        timeLeft: newTime,
      }).catch(console.error)
    }
    // Reset flag after a short delay to allow database sync
    setTimeout(() => {
      isUserControllingTimerRef.current = false
    }, 1000)
  }

  const handlePause = async () => {
    if (timerState !== 'running') return // Only pause if running

    isUserControllingTimerRef.current = true
    // Clear interval immediately
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    setTimerState('paused')
    timerStateRef.current = 'paused'
    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'paused',
        timerType,
        timeLeft,
      }).catch(console.error)
    }
    // Reset flag after a short delay to allow database sync
    setTimeout(() => {
      isUserControllingTimerRef.current = false
    }, 1000)
  }

  const handleResume = async () => {
    if (timerState !== 'paused') return // Only resume if paused

    isUserControllingTimerRef.current = true
    setTimerState('running')
    timerStateRef.current = 'running'
    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'running',
        timerType,
        timeLeft,
      }).catch(console.error)
    }
    // Reset flag after a short delay to allow database sync
    setTimeout(() => {
      isUserControllingTimerRef.current = false
    }, 1000)
  }

  const handleStop = async () => {
    isUserControllingTimerRef.current = true
    // Clear interval immediately
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    // Calculate completed duration (initial time - current time left)
    const completedDuration = initialTime - timeLeft

    // Save session if timer was running and has meaningful duration
    if (hasJoined && timerState === 'running' && completedDuration > 0) {
      try {
        await savePomodoroSession({
          roomId: id as any,
          timerType,
          duration: completedDuration,
          task,
        })
      } catch (error) {
        console.error('Failed to save session:', error)
      }
    }

    // Reset timer to current timer type's default duration
    const resetTime = TIMER_DURATIONS[timerType]
    setTimeLeft(resetTime)
    setInitialTime(resetTime)
    setTimerState('idle')
    timerStateRef.current = 'idle'

    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'idle',
        timerType,
        timeLeft: resetTime,
      }).catch(console.error)
    }
    // Reset flag after a short delay to allow database sync
    setTimeout(() => {
      isUserControllingTimerRef.current = false
    }, 1000)
  }

  const handleReset = async () => {
    isUserControllingTimerRef.current = true
    // Clear interval immediately
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    // Reset timer to current timer type's default duration
    const resetTime = TIMER_DURATIONS[timerType]
    setTimeLeft(resetTime)
    setInitialTime(resetTime)
    setTimerState('idle')
    timerStateRef.current = 'idle'
    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'idle',
        timerType,
        timeLeft: resetTime,
      }).catch(console.error)
    }
    // Reset flag after a short delay to allow database sync
    setTimeout(() => {
      isUserControllingTimerRef.current = false
    }, 1000)
  }

  const handleTimerTypeChange = async (newType: TimerType) => {
    // Only allow change if timer is idle
    if (timerState !== 'idle') {
      toast.error('Please stop the timer before changing type')
      return
    }

    const newDuration = TIMER_DURATIONS[newType]
    setTimerType(newType)
    setTimeLeft(newDuration)
    setInitialTime(newDuration)

    if (hasJoined) {
      await updateTimer({
        roomId: id as any,
        timerState: 'idle',
        timerType: newType,
        timeLeft: newDuration,
      }).catch(console.error)
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

  // Initialize form data when room loads or dialog opens
  useEffect(() => {
    if (room && isSettingsDialogOpen) {
      setFormData({
        name: room.name,
        visibility: room.visibility,
        theme: room.theme,
        musicUrl: room.musicUrl || '',
        maxUsers: room.maxUsers,
      })
    }
  }, [room, isSettingsDialogOpen])

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!room) return

    setIsUpdating(true)
    try {
      await updateRoom({
        roomId: room.id,
        name: formData.name,
        visibility: formData.visibility,
        theme: formData.theme,
        musicUrl: formData.musicUrl || undefined,
        maxUsers: formData.maxUsers || undefined,
      })

      setIsSettingsDialogOpen(false)
      toast.success('Room updated successfully')
    } catch (error) {
      console.error('Failed to update room:', error)
      toast.error('Failed to update room. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  // Check if current user is the room owner
  const isRoomOwner = room && user && room.ownerId === user.id

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
        <div className="fixed z-10 inset-x-0 top-4">
          <div className="container mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-full border border-slate-950 h-14 flex items-center justify-between px-4 shadow-lg">
              <div>
                <Link to="/" className="flex items-center gap-1">
                  <Logo className="h-6" />
                  <span className="text-sm font-semibold tracking-tight">
                    Pomodojo
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLeaderboardDialogOpen(true)}
                    className="p-2 rounded-lg hover:bg-white/60 transition-colors"
                    aria-label="Leaderboard"
                  >
                    <Medal className="size-5" />
                  </button>
                  {isRoomOwner && (
                    <button
                      onClick={() => setIsSettingsDialogOpen(true)}
                      className="p-2 rounded-lg hover:bg-white/60 transition-colors"
                      aria-label="Room settings"
                    >
                      <Settings className="size-5" />
                    </button>
                  )}
                </div>
                <UserButton />
              </div>
            </div>
          </div>
        </div>

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

                {/* Timer type selector */}
                <div className="flex items-center justify-center">
                  <Select
                    value={timerType}
                    onValueChange={(value) =>
                      handleTimerTypeChange(value as TimerType)
                    }
                    disabled={timerState !== 'idle'}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pomodoro">
                        🍅 Pomodoro (25 min)
                      </SelectItem>
                      <SelectItem value="shortBreak">
                        ☕ Short Break (5 min)
                      </SelectItem>
                      <SelectItem value="longBreak">
                        🌴 Long Break (15 min)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Pomodoro count badge */}
                {timerType === 'pomodoro' && pomodoroCount > 0 && (
                  <div className="flex items-center justify-center">
                    <Badge variant="outline" className="text-xs">
                      Completed: {pomodoroCount} pomodoro
                      {pomodoroCount !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                )}

                {/* Timer display */}
                <div className="flex items-center justify-center gap-3">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
                      timerType === 'pomodoro'
                        ? 'bg-emerald-50 border-emerald-100'
                        : timerType === 'shortBreak'
                          ? 'bg-blue-50 border-blue-100'
                          : 'bg-purple-50 border-purple-100'
                    }`}
                  >
                    <Hourglass
                      className={`h-4 w-4 ${
                        timerType === 'pomodoro'
                          ? 'text-emerald-600'
                          : timerType === 'shortBreak'
                            ? 'text-blue-600'
                            : 'text-purple-600'
                      }`}
                    />
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
                      className={
                        timerType === 'pomodoro'
                          ? 'bg-emerald-500 hover:bg-emerald-600'
                          : timerType === 'shortBreak'
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-purple-500 hover:bg-purple-600'
                      }
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
                        className={
                          timerType === 'pomodoro'
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : timerType === 'shortBreak'
                              ? 'bg-blue-500 hover:bg-blue-600'
                              : 'bg-purple-500 hover:bg-purple-600'
                        }
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

        {/* Settings Dialog */}
        {isRoomOwner && (
          <Dialog
            open={isSettingsDialogOpen}
            onOpenChange={setIsSettingsDialogOpen}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-[22px] font-semibold tracking-tight text-slate-900">
                  Edit Your Dojo
                </DialogTitle>
                <DialogDescription className="text-[13px] text-slate-700">
                  Update your focus space settings and preferences.
                </DialogDescription>
              </DialogHeader>
              <CreateRoomForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleUpdateRoom}
                isCreating={isUpdating}
                isEditing={true}
                onCancel={() => {
                  setIsSettingsDialogOpen(false)
                  // Reset form data to current room values
                  setFormData({
                    name: room.name,
                    visibility: room.visibility,
                    theme: room.theme,
                    musicUrl: room.musicUrl || '',
                    maxUsers: room.maxUsers,
                  })
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Leaderboard Dialog */}
        <Dialog
          open={isLeaderboardDialogOpen}
          onOpenChange={setIsLeaderboardDialogOpen}
        >
          <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle className="text-[20px] font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                <Medal className="size-4 text-yellow-500" />
                Leaderboard
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-700">
                Top performers ranked by total focus time
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 flex-1 overflow-y-auto min-h-0">
              {leaderboard === undefined ? (
                <div className="flex items-center justify-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  <p>No sessions yet. Start focusing to appear on the leaderboard!</p>
                </div>
              ) : (
                <div className="space-y-1.5 pr-1">
                  {leaderboard.map((entry, index) => {
                    // Format total time: convert seconds to hours and minutes
                    const totalHours = Math.floor(entry.totalTime / 3600)
                    const totalMinutes = Math.floor((entry.totalTime % 3600) / 60)
                    const timeDisplay =
                      totalHours > 0
                        ? `${totalHours}h ${totalMinutes}m`
                        : `${totalMinutes}m`

                    return (
                      <div
                        key={entry.userId}
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          index === 0
                            ? 'bg-yellow-50 border-yellow-200'
                            : index === 1
                              ? 'bg-slate-50 border-slate-200'
                              : index === 2
                                ? 'bg-orange-50 border-orange-200'
                                : 'bg-white border-slate-200'
                        }`}
                      >
                        {/* Rank */}
                        <div
                          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs ${
                            index === 0
                              ? 'bg-yellow-500 text-white'
                              : index === 1
                                ? 'bg-slate-400 text-white'
                                : index === 2
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Avatar */}
                        <div className="shrink-0">
                          <div className="relative w-8 h-8 mask mask-squircle bg-slate-200">
                            {entry.userAvatarUrl ? (
                              <img
                                src={entry.userAvatarUrl}
                                alt={entry.userName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-emerald-500/90">
                                <span className="text-xs font-semibold tracking-tight text-white">
                                  {entry.userInitial ||
                                    (entry.userName[0]
                                      ? entry.userName[0].toUpperCase()
                                      : 'U')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">
                            {entry.userName}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {entry.totalSessions} session{entry.totalSessions !== 1 ? 's' : ''}
                          </div>
                        </div>

                        {/* Total Time */}
                        <div className="shrink-0 text-right">
                          <div className="text-sm font-semibold text-slate-900">
                            {timeDisplay}
                          </div>
                          <div className="text-[10px] text-slate-500">total</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
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
