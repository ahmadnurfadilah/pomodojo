import { createFileRoute } from '@tanstack/react-router'
import { SignInButton, useUser } from '@clerk/clerk-react'
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from 'convex/react'
import { Hourglass, LogIn, Pause, Play, RotateCcw, Square } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { api } from '../../convex/_generated/api'
import Header from '../components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/rooms/$id')({
  component: RoomPage,
})

type TimerState = 'idle' | 'running' | 'paused'

function RoomPage() {
  const { id } = Route.useParams()
  const { user } = useUser()
  const room = useQuery(api.rooms.get, { id: id as any })
  const joinRoom = useMutation(api.rooms.join)
  const [joinCode, setJoinCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  // Avatar position state
  const [avatarPosition, setAvatarPosition] = useState({ x: 50, y: 50 }) // percentage
  const [isDragging, setIsDragging] = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  // Pomodoro timer state
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [task, setTask] = useState('')
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle timer countdown
  useEffect(() => {
    if (timerState === 'running' && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerState('idle')
            return 0
          }
          return prev - 1
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
  }, [timerState, timeLeft])

  const handleJoinRoom = async () => {
    setIsJoining(true)
    try {
      await joinRoom({
        roomId: id as any,
        joinCode: room?.visibility === 'private' ? joinCode : undefined,
      })
      setHasJoined(true)
    } catch (error: any) {
      console.error('Failed to join room:', error)
      alert(
        error?.message || 'Failed to join room. Please check the join code.',
      )
    } finally {
      setIsJoining(false)
    }
  }

  // Avatar drag handlers
  const handleMouseDown = () => {
    if (!hasJoined) return
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !hasJoined) return
    const container = e.currentTarget as HTMLElement
    const rect = container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Constrain to container bounds
    const constrainedX = Math.max(5, Math.min(95, x))
    const constrainedY = Math.max(5, Math.min(95, y))

    setAvatarPosition({ x: constrainedX, y: constrainedY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Timer handlers
  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(25 * 60) // Reset to 25 minutes
    }
    setTimerState('running')
  }

  const handlePause = () => {
    setTimerState('paused')
  }

  const handleResume = () => {
    setTimerState('running')
  }

  const handleStop = () => {
    setTimerState('idle')
    setTimeLeft(25 * 60)
  }

  const handleReset = () => {
    setTimerState('idle')
    setTimeLeft(25 * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
  if (hasJoined) {
    const userInitial =
      user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0] || 'U'
    const userName =
      user?.firstName ||
      user?.emailAddresses[0]?.emailAddress.split('@')[0] ||
      'User'

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

          {/* Draggable avatar */}
          <div
            ref={avatarRef}
            className="absolute cursor-move select-none transition-transform hover:scale-105"
            style={{
              left: `${avatarPosition.x}%`,
              top: `${avatarPosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/90 border-2 border-white shadow-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-lg font-semibold tracking-tight text-white">
                    {userInitial.toUpperCase()}
                  </span>
                </div>
                {timerState === 'running' && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse"></div>
                )}
              </div>
              <div className="px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm border border-white/50 shadow-sm">
                <span className="text-[10px] font-medium text-slate-800">
                  {userName}
                </span>
              </div>
            </div>
          </div>

          {/* Pomodoro timer - floating at bottom center */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl p-4 min-w-[320px] max-w-md">
              <div className="flex flex-col gap-3">
                {/* Task input */}
                <Input
                  type="text"
                  placeholder="What are you working on?"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
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
                      <p className="text-xs text-slate-500 mb-1">Max Users</p>
                      <p className="text-sm text-slate-900">{room.maxUsers}</p>
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
                    <Button
                      onClick={handleJoinRoom}
                      disabled={
                        isJoining ||
                        (room.visibility === 'private' && !joinCode)
                      }
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      {isJoining ? 'Joining...' : 'Join Room'}
                    </Button>
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
