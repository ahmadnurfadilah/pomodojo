import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Music, Play, Sparkles, Timer, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({ component: LandingPage })

// Mock data for active rooms - will be replaced with Convex query later
const mockRooms = [
  {
    id: '1',
    name: 'Zen Garden',
    theme: '🪷',
    activeUsers: 12,
    owner: 'Alex',
  },
  {
    id: '2',
    name: 'Midnight Café',
    theme: '☕️',
    activeUsers: 8,
    owner: 'Sam',
  },
  {
    id: '3',
    name: 'Cyber Loft',
    theme: '💻',
    activeUsers: 15,
    owner: 'Jordan',
  },
  {
    id: '4',
    name: 'Outer Space',
    theme: '🚀',
    activeUsers: 5,
    owner: 'Casey',
  },
]

const features = [
  {
    icon: <Users className="w-8 h-8 text-orange-500" />,
    title: 'Live Presence',
    description:
      'See who else is focusing with you in real-time. Move your avatar around the room and feel the connection.',
  },
  {
    icon: <Timer className="w-8 h-8 text-orange-500" />,
    title: 'Personal Pomodoro',
    description:
      'Set your own focus timer. Work in sync or at your own pace—everyone sees your progress.',
  },
  {
    icon: <Music className="w-8 h-8 text-orange-500" />,
    title: 'Shared Ambiance',
    description:
      'Room owners control the music. Everyone vibes together with curated lo-fi beats and ambient sounds.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-orange-500" />,
    title: 'Beautiful Themes',
    description:
      'Choose from Zen Garden, Midnight Café, Cyber Loft, and more. Each theme creates a unique atmosphere.',
  },
]

function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-orange-300/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
              <span className="block text-gray-900">Train your focus.</span>
              <span className="block bg-linear-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent animate-gradient">
                Together.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 max-w-3xl mx-auto mb-4 font-light leading-relaxed">
              Focus together in a virtual dojo — set your timer, move freely,
              and vibe with others as you get things done.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/rooms">
              <Button
                size="lg"
                className="group bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Enter the Dojo
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg font-semibold border-2 border-orange-300 text-gray-700 hover:bg-orange-50 hover:border-orange-400 transition-all"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm">
              <div className="text-3xl font-bold text-orange-600">1,234</div>
              <div className="text-sm text-gray-600 mt-1">Active Focusers</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm">
              <div className="text-3xl font-bold text-orange-600">456</div>
              <div className="text-sm text-gray-600 mt-1">Rooms Created</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm">
              <div className="text-3xl font-bold text-orange-600">12.5k</div>
              <div className="text-sm text-gray-600 mt-1">Focus Hours</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-orange-100 shadow-sm">
              <div className="text-3xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Pomodojo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Turn solo focus into a shared ritual. Train your concentration
              like martial artists train discipline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 group"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Rooms Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Active Dojos
              </h2>
              <p className="text-xl text-gray-600">
                Join a room and start focusing together
              </p>
            </div>
            <Link to="/rooms">
              <Button
                variant="outline"
                className="hidden sm:flex border-2 border-orange-300 text-gray-700 hover:bg-orange-50"
              >
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockRooms.map((room) => (
              <Link key={room.id} to="/rooms" className="group">
                <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{room.theme}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{room.activeUsers}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Hosted by {room.owner}
                  </p>
                  <div className="flex items-center text-orange-600 font-medium text-sm group-hover:gap-2 transition-all">
                    Join Room
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-orange-300 text-gray-700 hover:bg-orange-50 px-8"
              >
                Create Your Own Dojo
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to train your focus?
          </h2>
          <p className="text-xl text-amber-50 mb-8 max-w-2xl mx-auto">
            Join thousands of remote workers and indie hackers who are already
            leveling up their concentration.
          </p>
          <Link to="/rooms">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-amber-50 px-8 py-6 text-lg font-semibold shadow-xl"
            >
              Enter the Dojo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
