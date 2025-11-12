import { Link } from '@tanstack/react-router'

import { useState } from 'react'
import { Menu, Users, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-amber-400 to-orange-500 text-white font-bold text-lg shadow-lg">
                  🥋
                </div>
                <span className="text-xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Pomodojo
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                activeProps={{
                  className: 'text-sm font-medium text-orange-600',
                }}
              >
                Home
              </Link>
              <Link
                to="/rooms"
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
                activeProps={{
                  className: 'text-sm font-medium text-orange-600',
                }}
              >
                Rooms
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                to="/rooms"
                className="hidden sm:inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all hover:shadow-xl"
              >
                Enter the Dojo
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                aria-label="Open menu"
              >
                <Menu size={24} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-amber-400 to-orange-500 text-white font-bold text-lg">
              🥋
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Pomodojo
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors mb-2 text-gray-700"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-orange-100 text-orange-600 transition-colors mb-2',
            }}
          >
            <span className="font-medium">Home</span>
          </Link>
          <Link
            to="/rooms"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors mb-2 text-gray-700"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-orange-100 text-orange-600 transition-colors mb-2',
            }}
          >
            <Users size={20} />
            <span className="font-medium">Rooms</span>
          </Link>
        </nav>
      </aside>
    </>
  )
}
