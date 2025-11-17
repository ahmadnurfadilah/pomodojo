import { Link } from '@tanstack/react-router'
import { LogIn, Plus } from 'lucide-react'
import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Button } from './ui/button'
import Logo from './logo'

export default function Header() {
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
            <Button size="sm">
              <Plus />
              Create Room
            </Button>
          </Authenticated>
        </div>
      </div>
    </header>
  )
}
