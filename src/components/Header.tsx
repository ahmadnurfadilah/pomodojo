import { Link, useNavigate } from '@tanstack/react-router'
import { LogIn, Plus } from 'lucide-react'
import { Authenticated, Unauthenticated, useMutation } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { useState } from 'react'
import { api } from '../../convex/_generated/api'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { CreateRoomForm } from './create-room-form'
import Logo from './logo'

export default function Header() {
  const navigate = useNavigate()
  const createRoom = useMutation(api.rooms.create)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    visibility: 'public' as 'public' | 'private',
    theme: '🪷',
    musicUrl: '',
    maxUsers: 10 as number | undefined,
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
        maxUsers: formData.maxUsers || 10,
      })

      // Reset form
      setFormData({
        name: '',
        visibility: 'public',
        theme: '🪷',
        musicUrl: '',
        maxUsers: 10,
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

  return (
    <header className="border-b backdrop-blur border-slate-200/70 bg-slate-50/80">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-slate-950 hover:text-emerald-700"
        >
          <Logo className="h-6" />
          <span className="text-base font-semibold tracking-tight">
            Pomodojo
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-xs font-medium text-slate-700">
          <Link
            to="/rooms"
            className="transition-colors hover:text-emerald-700"
          >
            Rooms
          </Link>
          <Link
            to="/leaderboard"
            className="transition-colors hover:text-emerald-700"
          >
            Leaderboard
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Unauthenticated>
            <SignInButton mode="modal">
              <Button size="sm">
                <LogIn />
                Sign In
              </Button>
            </SignInButton>
          </Unauthenticated>
          <Authenticated>
            <UserButton />
            <Button
              size="sm"
              type="button"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus />
              Create Room
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      maxUsers: 10,
                    })
                  }}
                />
              </DialogContent>
            </Dialog>
          </Authenticated>
        </div>
      </div>
    </header>
  )
}
