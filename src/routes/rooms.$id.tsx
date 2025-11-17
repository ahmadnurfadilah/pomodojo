import { createFileRoute } from '@tanstack/react-router'
import { SignInButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated, useMutation, useQuery } from 'convex/react'
import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { api } from '../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/rooms/$id')({
  component: RoomPage,
})

function RoomPage() {
  const { id } = Route.useParams()
  const room = useQuery(api.rooms.get, { id: id as any })
  const joinRoom = useMutation(api.rooms.join)
  const [joinCode, setJoinCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinRoom = async () => {
    setIsJoining(true)
    try {
      await joinRoom({
        roomId: id as any,
        joinCode: room?.visibility === 'private' ? joinCode : undefined,
      })
      alert('Successfully joined room! Room features coming soon.')
    } catch (error: any) {
      console.error('Failed to join room:', error)
      alert(error?.message || 'Failed to join room. Please check the join code.')
    } finally {
      setIsJoining(false)
    }
  }

  if (room === undefined) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading room...</p>
        </div>
      </div>
    )
  }

  if (room === null) {
    return (
      <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Room not found</h1>
          <p className="text-gray-600">This room doesn't exist or has been deleted.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{room.theme}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
              <p className="text-gray-600 mt-1">
                {room.visibility === 'public' ? 'Public Room' : 'Private Room'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {room.musicUrl && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Music URL</p>
                <p className="text-gray-900">{room.musicUrl}</p>
              </div>
            )}
            {room.maxUsers && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Max Users</p>
                <p className="text-gray-900">{room.maxUsers}</p>
              </div>
            )}
            {room.visibility === 'private' && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Join Code Required</p>
                <Unauthenticated>
                  <p className="text-sm text-gray-400 mb-2">
                    Sign in to enter the join code
                  </p>
                </Unauthenticated>
                <Authenticated>
                  <Input
                    type="text"
                    placeholder="Enter join code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="font-mono max-w-xs"
                    maxLength={6}
                  />
                </Authenticated>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Unauthenticated>
              <div className="space-y-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-700 mb-3">
                    Sign in to join this room
                  </p>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="border-2 border-orange-300"
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
                disabled={isJoining || (room.visibility === 'private' && !joinCode)}
                className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                {isJoining ? 'Joining...' : 'Join Room'}
              </Button>
            </Authenticated>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            Room features coming soon: Live avatars, Pomodoro timers, and shared music!
          </p>
        </div>
      </div>
    </div>
  )
}
