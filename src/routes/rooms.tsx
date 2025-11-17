import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated, useMutation, useQuery } from 'convex/react'
import { ArrowRight, Globe, Lock, LogIn, Plus, Sparkles, Users } from 'lucide-react'
import { useState } from 'react'
import { api } from '../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const Route = createFileRoute('/rooms')({
  component: RoomsPage,
})

const THEMES = [
  { value: '🪷', label: 'Zen Garden', emoji: '🪷' },
  { value: '☕️', label: 'Midnight Café', emoji: '☕️' },
  { value: '💻', label: 'Cyber Loft', emoji: '💻' },
  { value: '🚀', label: 'Outer Space', emoji: '🚀' },
  { value: '☁️', label: 'Cloud Room', emoji: '☁️' },
]

function RoomsPage() {
  const navigate = useNavigate()
  const rooms = useQuery(api.rooms.list)
  const createRoom = useMutation(api.rooms.create)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    visibility: 'public' as 'public' | 'private',
    theme: '🪷',
    musicUrl: '',
    maxUsers: undefined as number | undefined,
  })

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      const roomId = await createRoom({
        name: formData.name,
        visibility: formData.visibility,
        theme: formData.theme,
        musicUrl: formData.musicUrl || undefined,
        maxUsers: formData.maxUsers || undefined,
      })

      // Reset form
      setFormData({
        name: '',
        visibility: 'public',
        theme: '🪷',
        musicUrl: '',
        maxUsers: undefined,
      })
      setShowCreateForm(false)

      // Navigate to the new room
      navigate({ to: '/rooms/$id', params: { id: roomId } })
    } catch (error) {
      console.error('Failed to create room:', error)
      alert('Failed to create room. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Active Dojos
            </h1>
            <p className="text-xl text-gray-600">
              Join a room or create your own focus space
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-orange-300"
                >
                  <LogIn className="mr-2 w-5 h-5" />
                  Sign In
                </Button>
              </SignInButton>
            </Unauthenticated>
            <Authenticated>
              <UserButton />
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                size="lg"
                className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Plus className="mr-2 w-5 h-5" />
                Create Room
              </Button>
            </Authenticated>
          </div>
        </div>

        {/* Create Room Form */}
        <Authenticated>
          {showCreateForm && (
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-orange-100 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create Your Dojo
            </h2>
            <form onSubmit={handleCreateRoom} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-base font-semibold">
                  Room Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., My Focus Space"
                  required
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="visibility" className="text-base font-semibold">
                    Visibility
                  </Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value: 'public' | 'private') =>
                      setFormData({ ...formData, visibility: value })
                    }
                  >
                    <SelectTrigger id="visibility" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Public
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Private
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theme" className="text-base font-semibold">
                    Theme
                  </Label>
                  <Select
                    value={formData.theme}
                    onValueChange={(value) =>
                      setFormData({ ...formData, theme: value })
                    }
                  >
                    <SelectTrigger id="theme" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THEMES.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          <div className="flex items-center gap-2">
                            <span>{theme.emoji}</span>
                            <span>{theme.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="musicUrl" className="text-base font-semibold">
                    Music URL (Optional)
                  </Label>
                  <Input
                    id="musicUrl"
                    type="url"
                    value={formData.musicUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, musicUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="maxUsers" className="text-base font-semibold">
                    Max Users (Optional)
                  </Label>
                  <Input
                    id="maxUsers"
                    type="number"
                    value={formData.maxUsers || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxUsers: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="No limit"
                    min="1"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  {isCreating ? 'Creating...' : 'Create Room'}
                  <Sparkles className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    setFormData({
                      name: '',
                      visibility: 'public',
                      theme: '🪷',
                      musicUrl: '',
                      maxUsers: undefined,
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
          )}
        </Authenticated>

        {/* Rooms List */}
        {rooms === undefined ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-orange-100">
            <Sparkles className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No rooms yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to create a focus dojo!
            </p>
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="border-2 border-orange-300"
                >
                  <LogIn className="mr-2 w-4 h-4" />
                  Sign In to Create
                </Button>
              </SignInButton>
            </Unauthenticated>
            <Authenticated>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              >
                <Plus className="mr-2 w-4 h-4" />
                Create First Room
              </Button>
            </Authenticated>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RoomCard({ room }: { room: any }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate({ to: '/rooms/$id', params: { id: room.id } })}
      className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 cursor-pointer group h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{room.theme}</div>
        <div className="flex items-center gap-2">
          {room.visibility === 'private' ? (
            <Lock className="w-4 h-4 text-gray-400" />
          ) : (
            <Globe className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
        {room.name}
      </h3>
      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span className="font-medium">
              {room.maxUsers ? `Max ${room.maxUsers}` : 'Unlimited'}
            </span>
          </div>
          <div className="flex items-center text-orange-600 font-medium text-sm group-hover:gap-2 transition-all">
            Join Room
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  )
}
