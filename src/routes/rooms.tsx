import { Outlet, createFileRoute, useMatchRoute, useNavigate } from '@tanstack/react-router'
import { SignInButton, useUser } from '@clerk/clerk-react'
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from 'convex/react'
import {
  ArrowRight,
  Edit,
  Globe,
  Lock,
  LogIn,
  Plus,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { api } from '../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Header from '@/components/header'
import { CreateRoomForm } from '@/components/create-room-form'

export const Route = createFileRoute('/rooms')({
  component: RoomsPage,
})

function RoomsPage() {
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()
  const { user } = useUser()
  const rooms = useQuery(api.rooms.list)
  const createRoom = useMutation(api.rooms.create)
  const updateRoom = useMutation(api.rooms.update)
  const deleteRoom = useMutation(api.rooms.remove)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    visibility: 'public' as 'public' | 'private',
    theme: '🪷',
    musicUrl: '',
    maxUsers: undefined as number | undefined,
  })

  // Check if we're on a detail route
  const isDetailRoute = matchRoute({ to: '/rooms/$id' })

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
      setIsDialogOpen(false)

      // Navigate to the new room
      navigate({ to: '/rooms/$id', params: { id: roomId } })
    } catch (error) {
      console.error('Failed to create room:', error)
      alert('Failed to create room. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditRoom = (room: any) => {
    setEditingRoom(room)
    setFormData({
      name: room.name,
      visibility: room.visibility,
      theme: room.theme,
      musicUrl: room.musicUrl || '',
      maxUsers: room.maxUsers || undefined,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      visibility: 'public',
      theme: '🪷',
      musicUrl: '',
      maxUsers: undefined,
    })
    setEditingRoom(null)
  }

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRoom) return

    setIsUpdating(true)
    try {
      await updateRoom({
        roomId: editingRoom.id,
        name: formData.name,
        visibility: formData.visibility,
        theme: formData.theme,
        musicUrl: formData.musicUrl || undefined,
        maxUsers: formData.maxUsers || undefined,
      })

      resetForm()
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Failed to update room:', error)
      alert('Failed to update room. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteRoom = async (roomId: any) => {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return
    }

    try {
      await deleteRoom({ roomId })
    } catch (error) {
      console.error('Failed to delete room:', error)
      alert('Failed to delete room. Please try again.')
    }
  }

  // If we're on a detail route, render the child route
  if (isDetailRoute) {
    return <Outlet />
  }

  // Otherwise, render the rooms list
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-linear-to-b border-slate-100/70 from-slate-50 via-slate-50 to-slate-50">
          <div className="container mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-14 lg:pb-24">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-950">
                  Active Dojos
                </h1>
                <p className="text-sm sm:text-[15px] text-slate-700">
                  Join a room or create your own focus space
                </p>
              </div>
              <Authenticated>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-500 text-[13px] font-semibold tracking-tight shadow-sm shadow-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 transition-all text-slate-50 hover:bg-emerald-600 hover:shadow-emerald-600/50">
                      <Plus className="size-4" />
                      <span>Create Room</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="text-[22px] font-semibold tracking-tight text-slate-900">
                        Create Your Dojo
                      </DialogTitle>
                      <DialogDescription className="text-[13px] text-slate-700">
                        Set up a new focus space with your preferred theme and
                        settings.
                      </DialogDescription>
                    </DialogHeader>
                    <CreateRoomForm
                      formData={formData}
                      setFormData={setFormData}
                      onSubmit={handleCreateRoom}
                      isCreating={isCreating}
                      onCancel={() => {
                        setIsDialogOpen(false)
                        setFormData({
                          name: '',
                          visibility: 'public',
                          theme: '🪷',
                          musicUrl: '',
                          maxUsers: undefined,
                        })
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </Authenticated>
            </div>

            {/* Rooms List */}
            {rooms === undefined ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="mt-4 text-[14px] text-slate-600">
                  Loading rooms...
                </p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-emerald-100">
                <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-[22px] font-semibold tracking-tight text-slate-900 mb-2">
                  No rooms yet
                </h3>
                <p className="text-[14px] text-slate-700 mb-6">
                  Be the first to create a focus dojo!
                </p>
                <Unauthenticated>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-[13px] font-medium hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/80 transition-all border-slate-300 text-slate-800 hover:text-slate-950"
                    >
                      <LogIn className="size-4" />
                      <span>Sign In to Create</span>
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                <Authenticated>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-500 text-[13px] font-semibold tracking-tight shadow-sm shadow-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 transition-all text-slate-50 hover:bg-emerald-600 hover:shadow-emerald-600/50">
                        <Plus className="size-4" />
                        <span>Create First Room</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-[22px] font-semibold tracking-tight text-slate-900">
                          Create Your Dojo
                        </DialogTitle>
                        <DialogDescription className="text-[13px] text-slate-700">
                          Set up a new focus space with your preferred theme and
                          settings.
                        </DialogDescription>
                      </DialogHeader>
                      <CreateRoomForm
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleCreateRoom}
                        isCreating={isCreating}
                        onCancel={() => {
                          setIsDialogOpen(false)
                          setFormData({
                            name: '',
                            visibility: 'public',
                            theme: '🪷',
                            musicUrl: '',
                            maxUsers: undefined,
                          })
                        }}
                        inputIdPrefix="-empty"
                      />
                    </DialogContent>
                  </Dialog>
                </Authenticated>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    currentUserId={user?.id}
                    onEdit={handleEditRoom}
                    onDelete={handleDeleteRoom}
                  />
                ))}
              </div>
            )}

            {/* Edit Room Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-[22px] font-semibold tracking-tight text-slate-900">
                    Edit Your Dojo
                  </DialogTitle>
                  <DialogDescription className="text-[13px] text-slate-700">
                    Update your focus space settings.
                  </DialogDescription>
                </DialogHeader>
                <CreateRoomForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleUpdateRoom}
                  isCreating={isUpdating}
                  onCancel={() => {
                    setIsEditDialogOpen(false)
                    resetForm()
                  }}
                  inputIdPrefix="-edit"
                  isEditing={true}
                />
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </main>
    </div>
  )
}

function RoomCard({
  room,
  currentUserId,
  onEdit,
  onDelete,
}: {
  room: any
  currentUserId?: string
  onEdit: (room: any) => void
  onDelete: (roomId: any) => void
}) {
  const navigate = useNavigate()
  const isOwner = currentUserId && room.ownerId === currentUserId

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('[role="button"]')
    ) {
      return
    }
    navigate({ to: '/rooms/$id', params: { id: room.id } })
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(room)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(room.id)
  }

  return (
    <div
      onClick={handleCardClick}
      className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer group h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-4xl">{room.theme}</div>
        <div className="flex items-center gap-2">
          {room.visibility === 'private' ? (
            <Lock className="w-4 h-4 text-slate-400" />
          ) : (
            <Globe className="w-4 h-4 text-slate-400" />
          )}
          {isOwner && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleEditClick}
                className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-emerald-600 transition-colors"
                aria-label="Edit room"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 rounded-md hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                aria-label="Delete room"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
      <h3 className="text-[16px] font-semibold tracking-tight text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
        {room.name}
      </h3>
      <div className="mt-auto pt-4 border-t border-emerald-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-600">
            <Users className="w-4 h-4" />
            <span className="font-medium">
              {room.maxUsers ? `Max ${room.maxUsers}` : 'Unlimited'}
            </span>
          </div>
          <div className="flex items-center text-emerald-600 font-medium text-[11px] group-hover:gap-2 transition-all">
            Join Room
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  )
}
