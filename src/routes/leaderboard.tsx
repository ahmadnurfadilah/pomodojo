import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { Medal } from 'lucide-react'
import { useState } from 'react'
import { api } from '../../convex/_generated/api'
import Header from '../components/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/leaderboard')({
  component: LeaderboardPage,
})

type Period = 'today' | 'thisMonth' | 'lifetime'

function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('lifetime')
  const leaderboard = useQuery(api.rooms.getGlobalLeaderboard, { period })

  const getPeriodLabel = (p: Period) => {
    switch (p) {
      case 'today':
        return 'Today'
      case 'thisMonth':
        return 'This Month'
      case 'lifetime':
        return 'Lifetime'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-slate-50 via-slate-50 to-slate-50">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-linear-to-b border-slate-100/70 from-slate-50 via-slate-50 to-slate-50">
          <div className="container mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-14 lg:pb-24">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Medal className="size-8 text-yellow-500" />
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950">
                    Global Leaderboard
                  </h1>
                </div>
                <p className="text-sm sm:text-[15px] text-slate-700">
                  Top performers ranked by total focus time
                </p>
              </div>

              {/* Period Filter */}
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {(['today', 'thisMonth', 'lifetime'] as Period[]).map((p) => (
                  <Button
                    key={p}
                    variant={period === p ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPeriod(p)}
                    className={
                      period === p
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : ''
                    }
                  >
                    {getPeriodLabel(p)}
                  </Button>
                ))}
              </div>

              {/* Leaderboard Content */}
              {leaderboard === undefined ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                  <p className="mt-4 text-[14px] text-slate-600">
                    Loading leaderboard...
                  </p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                  <Medal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-[22px] font-semibold tracking-tight text-slate-900 mb-2">
                    No sessions yet
                  </h3>
                  <p className="text-[14px] text-slate-700">
                    Start focusing to appear on the leaderboard!
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {leaderboard.map((entry, index) => {
                      // Format total time: convert seconds to hours and minutes
                      const totalHours = Math.floor(entry.totalTime / 3600)
                      const totalMinutes = Math.floor(
                        (entry.totalTime % 3600) / 60,
                      )
                      const timeDisplay =
                        totalHours > 0
                          ? `${totalHours}h ${totalMinutes}m`
                          : `${totalMinutes}m`

                      return (
                        <div
                          key={entry.userId}
                          className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${
                            index === 0
                              ? 'bg-yellow-50/50'
                              : index === 1
                                ? 'bg-slate-50/50'
                                : index === 2
                                  ? 'bg-orange-50/50'
                                  : ''
                          }`}
                        >
                          {/* Rank */}
                          <div
                            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                              index === 0
                                ? 'bg-yellow-500 text-white'
                                : index === 1
                                  ? 'bg-slate-400 text-white'
                                  : index === 2
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {index === 0 ? (
                              <Medal className="size-5" />
                            ) : (
                              index + 1
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="shrink-0">
                            <div className="relative w-12 h-12 mask mask-squircle bg-slate-200">
                              {entry.userAvatarUrl ? (
                                <img
                                  src={entry.userAvatarUrl}
                                  alt={entry.userName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-emerald-500/90">
                                  <span className="text-sm font-semibold tracking-tight text-white">
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
                            <div className="text-base font-semibold text-slate-900 truncate">
                              {entry.userName}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {entry.totalSessions} session
                                {entry.totalSessions !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                          </div>

                          {/* Total Time */}
                          <div className="shrink-0 text-right">
                            <div className="text-lg font-semibold text-slate-900">
                              {timeDisplay}
                            </div>
                            <div className="text-xs text-slate-500">total</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
