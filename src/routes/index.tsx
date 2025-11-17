import { createFileRoute } from '@tanstack/react-router'
import {
  Check,
  Hourglass,
  MessageSquare,
  Pause,
  Shield,
  Sparkle,
  Sparkles,
  Users,
} from 'lucide-react'
import Header from '../components/header'

export const Route = createFileRoute('/')({ component: LandingPage })

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section
          id="product"
          className="border-b bg-linear-to-b border-slate-100/70 from-slate-50 via-slate-50 to-slate-50"
        >
          <div className="container mx-auto px-4 sm:px-6 pt-10 pb-16 lg:pt-14 lg:pb-24 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Live co-working dojo for deep work
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-slate-950">
                  Turn solo work into a<br className="hidden sm:block" />
                  <span className="text-emerald-700">shared focus ritual</span>.
                </h1>
                <p className="text-sm sm:text-[15px] max-w-xl text-slate-700">
                  Pomodojo is a virtual co-working dojo where your avatar,
                  timer, and chat keep you accountable. Move around the room,
                  set your rhythm, and train your focus together.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex gap-3">
                  <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-500 text-[13px] font-semibold tracking-tight shadow-sm shadow-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 transition-all text-slate-50 hover:bg-emerald-600 hover:shadow-emerald-600/50">
                    <Sparkles className="size-4" />
                    <span>Try a focus session</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-[13px] font-medium hover:border-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/80 transition-all border-slate-300 text-slate-800 hover:text-slate-950">
                    <Users className="size-4" />
                    <span>Host a dojo room</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&amp;fit=crop&amp;w=80&amp;q=80"
                    alt="User avatar"
                    className="h-7 w-7 rounded-full border object-cover border-slate-100 shrink-0"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&amp;fit=crop&amp;w=80&amp;q=80"
                    alt="User avatar"
                    className="h-7 w-7 rounded-full border object-cover border-slate-100 shrink-0"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1457449940276-e8deed18bfff?auto=format&amp;fit=crop&amp;w=80&amp;q=80"
                    alt="User avatar"
                    className="h-7 w-7 rounded-full border object-cover border-slate-100 shrink-0"
                  />
                </div>
                <div className="space-y-0">
                  <p className="text-[11px] text-slate-700">
                    Teams, indie hackers &amp; remote makers
                  </p>
                  <p className="text-[11px] text-emerald-700/90">
                    “Feels like a calm, cozy dojo in my browser.”
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -translate-x-8 -translate-y-6 blur-3xl opacity-60 pointer-events-none">
                <div className="w-56 h-56 bg-emerald-500/10 rounded-full"></div>
              </div>

              <div className="relative rounded-2xl border bg-linear-to-b shadow-[0_0_0_1px_rgba(15,23,42,1),0_30px_80px_rgba(15,23,42,0.24)] p-4 sm:p-5 border-slate-200 from-slate-100/90 via-slate-50 to-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-600/80"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600/80"></div>
                    </div>
                    <span className="text-[11px] text-slate-600">
                      {typeof window !== 'undefined'
                        ? window.location.hostname
                        : 'pomodojo.app'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <Users className="size-4" />
                    <span>12 in dojo</span>
                  </div>
                </div>

                <div className="rounded-xl border overflow-hidden border-slate-200 bg-slate-100/70">
                  <div className="grid grid-rows-[1fr,auto]">
                    <div className="relative h-40 sm:h-52 bg-linear-to-tr overflow-hidden from-slate-50 via-slate-100 to-slate-50">
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t to-transparent from-slate-100 via-slate-100/90"></div>

                      <div className="absolute inset-0 opacity-[0.07]">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,#0f172a_1px,transparent_0)] bg-size-[16px_16px]"></div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-wrap justify-center gap-3 px-4">
                          <div className="flex flex-col items-center gap-1">
                            <div className="relative">
                              <div className="h-9 w-9 rounded-2xl bg-emerald-500/10 border flex items-center justify-center border-emerald-600/60">
                                <span className="text-[15px] font-semibold tracking-tight text-emerald-800">
                                  Y
                                </span>
                              </div>
                              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border border-slate-100"></div>
                            </div>
                            <span className="text-[10px] text-slate-800">
                              You
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="h-9 w-9 rounded-2xl bg-fuchsia-500/10 border flex items-center justify-center border-fuchsia-600/60">
                              <span className="text-[15px] font-semibold tracking-tight text-fuchsia-800">
                                A
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-700">
                              Alex
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="h-9 w-9 rounded-2xl bg-sky-500/10 border flex items-center justify-center border-sky-600/60">
                              <span className="text-[15px] font-semibold tracking-tight text-sky-800">
                                M
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-700">
                              Mei
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="h-9 w-9 rounded-2xl bg-amber-500/10 border flex items-center justify-center border-amber-600/60">
                              <span className="text-[15px] font-semibold tracking-tight text-amber-800">
                                R
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-700">
                              Ravi
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute left-4 right-4 bottom-3 flex justify-between gap-2">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl border backdrop-blur bg-slate-50/80 border-slate-200/90">
                          <div className="h-8 w-8 rounded-full bg-emerald-500/15 border flex items-center justify-center border-emerald-600/40">
                            <Hourglass className="size-4 text-emerald-700" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                              Focus round
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-[18px] font-semibold tracking-tight text-slate-950">
                                17:42
                              </span>
                              <span className="text-[11px] text-slate-600">
                                of 25:00
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur bg-slate-50/80 border-slate-200/90">
                          <MessageSquare className="size-4 text-emerald-700" />
                          <div className="flex flex-col">
                            <span className="text-[11px] text-slate-800">
                              Chat active
                            </span>
                            <span className="text-[10px] text-slate-500">
                              Press / to chat
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t px-3 py-2.5 flex items-center justify-between border-slate-200 bg-slate-50/90">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 rounded-full border px-2 py-1 bg-slate-100/80 border-slate-300/80">
                          <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-emerald-600"></span>
                          <span className="text-[10px] text-slate-700">
                            Timer running
                          </span>
                        </div>
                        <span className="hidden sm:inline text-[11px] text-slate-500">
                          Next: 5 min break
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-full border hover:border-slate-500 transition-colors bg-slate-100/80 border-slate-300/80 text-slate-700 hover:text-slate-950">
                          <MessageSquare className="size-4" />
                        </button>
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-full border hover:border-slate-500 transition-colors bg-slate-100/80 border-slate-300/80 text-slate-700 hover:text-slate-950">
                          <Hourglass className="size-4" />
                        </button>
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 transition-colors text-slate-50 hover:bg-emerald-600">
                          <Pause className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full border-b border-slate-100/80 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
              <div className="space-y-2">
                <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-slate-900">
                  Built for indie hackers, remote teams, and deep work fans
                </h2>
                <p className="text-[14px] text-slate-700 max-w-xl">
                  Pomodojo turns the lonely Pomodoro into a shared ritual. Stay
                  accountable, feel present, and make focus sessions something
                  you actually look forward to.
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex flex-col text-right">
                  <span className="text-[22px] font-semibold tracking-tight text-slate-900">
                    +37%
                  </span>
                  <span className="text-[11px] text-slate-500">
                    average increase in focused minutes
                  </span>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="flex flex-col text-right">
                  <span className="text-[22px] font-semibold tracking-tight text-slate-900">
                    4.8
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                    <span className="inline-flex -space-x-0.5">
                      <span className="h-3 w-3 rounded-full bg-amber-300"></span>
                      <span className="h-3 w-3 rounded-full bg-amber-300"></span>
                      <span className="h-3 w-3 rounded-full bg-amber-300"></span>
                      <span className="h-3 w-3 rounded-full bg-amber-300"></span>
                      <span className="h-3 w-3 rounded-full bg-amber-200"></span>
                    </span>
                    session rating
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 sm:p-5 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-100 mb-3">
                  <svg
                    id="presence-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M5.5 21a6.5 6.5 0 0 1 13 0"></path>
                  </svg>
                </div>
                <h3 className="text-[16px] font-semibold tracking-tight text-slate-900 mb-1">
                  Feel together, even on mute
                </h3>
                <p className="text-[13px] text-slate-700">
                  See everyone’s avatar, timers, and tasks in real time. The
                  room feels alive without needing to talk or turn on your
                  camera.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white/80 p-4 sm:p-5 hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-sky-50 border border-sky-100 mb-3">
                  <svg
                    id="timer-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-sky-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <circle cx="12" cy="13" r="8"></circle>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="15" y1="13" x2="12" y2="13"></line>
                    <polyline points="9 3 12 3 15 3"></polyline>
                  </svg>
                </div>
                <h3 className="text-[16px] font-semibold tracking-tight text-slate-900 mb-1">
                  Your Pomodoro, their presence
                </h3>
                <p className="text-[13px] text-slate-700">
                  Everyone runs their own timer with Pomodoro, short break, and
                  long break cycles. After 4 pomodoros, take a long break
                  automatically — but you all move through the session together.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-100 bg-white/80 p-4 sm:p-5 hover:border-rose-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-rose-50 border border-rose-100 mb-3">
                  <svg
                    id="streak-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-rose-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <polyline points="3 17 9 11 13 15 21 7"></polyline>
                    <polyline points="14 7 21 7 21 14"></polyline>
                  </svg>
                </div>
                <h3 className="text-[16px] font-semibold tracking-tight text-slate-900 mb-1">
                  Turn focus into a streak
                </h3>
                <p className="text-[13px] text-slate-700">
                  Track your minutes, streaks, and rooms. Climb the dojo
                  leaderboard and celebrate consistent deep work.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full border-b border-emerald-100/80 bg-emerald-50/50"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col items-start sm:items-center sm:text-center gap-4 mb-8">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-600 uppercase tracking-[0.18em]">
                Workflow
              </span>
              <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-slate-900">
                From solo tab chaos to a shared focus ritual
              </h2>
              <p className="text-[14px] text-slate-700 max-w-2xl">
                Pomodojo keeps the simplicity of a Pomodoro timer, then layers
                on real-time presence, ambient music, and playful rooms so your
                focus routine actually sticks.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-emerald-100 bg-white p-5 flex flex-col gap-3 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] text-emerald-700 font-medium">
                    1
                  </div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-[0.18em]">
                    Room
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold tracking-tight text-slate-900">
                  Pick a dojo or create your own
                </h3>
                <p className="text-[13px] text-slate-700">
                  Join a public room in seconds or spin up a private dojo with
                  its own vibe, rules, and invite link.
                </p>
                <div className="mt-2 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-800 font-medium">
                      Create a room
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ≈ 10 seconds
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">Visibility</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Public
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">Max users</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
                        8 people
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white p-5 flex flex-col gap-3 hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-[11px] text-sky-700 font-medium">
                    2
                  </div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-[0.18em]">
                    Timers
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold tracking-tight text-slate-900">
                  Set your Pomodoro and drop in
                </h3>
                <p className="text-[13px] text-slate-700">
                  Choose Pomodoro (25 min), short break (5 min), or long break
                  (15 min). Write what you're working on, and hit start. After 4
                  pomodoros, automatically take a long break. Your avatar
                  broadcasts your status to the room.
                </p>
                <div className="mt-2 rounded-xl border border-sky-100 bg-sky-50/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-800 font-medium">
                      Your session
                    </span>
                    <span className="text-[11px] text-sky-600">
                      Pomodoro · 23:41
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1 rounded-full bg-sky-100 overflow-hidden">
                      <div className="h-full w-2/3 bg-sky-400 rounded-full"></div>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      3 of 4 pomodoros
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>"Refactor onboarding flow"</span>
                    <span className="inline-flex items-center gap-1 text-sky-500">
                      <Hourglass className="h-3.5 w-3.5" />
                      visible to room
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-5 flex flex-col gap-3 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] text-emerald-700 font-medium">
                    3
                  </div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-[0.18em]">
                    Momentum
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold tracking-tight text-slate-900">
                  Track sessions &amp; celebrate wins
                </h3>
                <p className="text-[13px] text-slate-700">
                  As you focus, Pomodojo tracks your sessions, total focus time,
                  and room leaderboard rankings so the habit becomes its own
                  game.
                </p>
                <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-800 font-medium">
                      Your stats
                    </span>
                    <span className="text-[11px] text-emerald-600">
                      View details
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1 text-[11px] text-slate-600">
                    <span>Total sessions</span>
                    <span className="font-semibold text-slate-900">127</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Total focus time</span>
                    <span className="font-semibold text-slate-900">486m</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1">
                    <span>Room leaderboard</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                      #3
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full border-b border-emerald-100/80 bg-slate-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col items-start sm:items-center sm:text-center gap-4 mb-10">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[11px] text-sky-600 uppercase tracking-[0.18em]">
                Features
              </span>
              <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-slate-900">
                A focus dojo that actually feels alive
              </h2>
              <p className="text-[14px] text-slate-700 max-w-2xl">
                Pomodojo combines rooms, avatars, timers, and music into one
                playful interface so you can keep your focus muscle strong
                without burning out.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="rounded-2xl border border-emerald-100 bg-white p-5 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-100 shrink-0">
                    <svg
                      id="room-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-emerald-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <rect x="3" y="6" width="7" height="12" rx="2"></rect>
                      <rect x="14" y="6" width="7" height="8" rx="2"></rect>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold tracking-tight text-slate-900">
                      Flexible rooms with just the right boundaries
                    </h3>
                    <p className="text-[13px] text-slate-700 mt-1.5">
                      Create public dojos to co-work with the world, or private
                      ones with access codes for your team, your study group, or
                      your indie hacker friends.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white p-5 hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-sky-50 border border-sky-100 shrink-0">
                    <svg
                      id="avatar-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-sky-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <circle cx="12" cy="8" r="4"></circle>
                      <path d="M5 20a7 7 0 0 1 14 0"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold tracking-tight text-slate-900">
                      Avatars that move with you
                    </h3>
                    <p className="text-[13px] text-slate-700 mt-1.5">
                      Drag your avatar around the room as you settle in,
                      stretch, or move into deep focus. Your avatar shows your
                      timer state, task, and time left. Everyone sees changes
                      instantly, like a subtle, playful body language.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white p-5 hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-sky-50 border border-sky-100 shrink-0">
                    <MessageSquare className="h-4 w-4 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold tracking-tight text-slate-900">
                      Chat with live cursor tracking
                    </h3>
                    <p className="text-[13px] text-slate-700 mt-1.5">
                      Press "/" to activate chat mode. Your cursor moves across
                      the room as you type, showing others what you're working
                      on. Messages appear at your cursor position for a natural,
                      spatial conversation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-5 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-100 shrink-0">
                    <svg
                      id="stats-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-emerald-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <line x1="9" y1="19" x2="9" y2="5"></line>
                      <line x1="15" y1="19" x2="15" y2="10"></line>
                      <line x1="3" y1="19" x2="21" y2="19"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold tracking-tight text-slate-900">
                      Statistics that reward consistency, not hustle
                    </h3>
                    <p className="text-[13px] text-slate-700 mt-1.5">
                      View your personal statistics with session history, total
                      focus time, and room leaderboard rankings. A soft
                      leaderboard gives you a nudge without turning focus into
                      pressure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="themes"
          className="w-full border-b border-emerald-100/80 bg-slate-50"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col items-start sm:items-center sm:text-center gap-4 mb-8">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-lime-50 border border-lime-100 text-[11px] text-lime-600 uppercase tracking-[0.18em]">
                Dojo themes
              </span>
              <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-tight text-slate-900">
                Pick the focus vibe that matches your day
              </h2>
              <p className="text-[14px] text-slate-700 max-w-2xl">
                Every dojo theme comes with its own ambiance — from gentle
                garden sounds to spacey synths — so that routine Pomodoros feel
                fresh, not mechanical.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="group rounded-2xl border border-emerald-100 bg-white overflow-hidden hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src="/assets/images/bg/zen-garden.webp"
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    alt="Zen Garden"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-emerald-700/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-emerald-900/70 text-[11px] text-emerald-50 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
                    Zen Garden
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <p className="text-[13px] text-slate-700">
                    Gentle wind, soft bells, and a calm green palette for deep
                    writing and long-form thinking.
                  </p>
                  <div className="mt-auto flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-emerald-50">
                    <span>Great for:</span>
                    <span className="inline-flex gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                        Writing
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                        Study
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="group rounded-2xl border border-amber-100 bg-white overflow-hidden hover:border-amber-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src="/assets/images/bg/midnight-cafe.webp"
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    alt="Midnight Café"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-amber-900/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-amber-900/70 text-[11px] text-amber-50 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300"></span>
                    Midnight Café
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <p className="text-[13px] text-slate-700">
                    Coffee shop hum, clinking cups, and warm lights — perfect
                    for late-night shipping or pairing.
                  </p>
                  <div className="mt-auto flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-amber-50">
                    <span>Great for:</span>
                    <span className="inline-flex gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700">
                        Design
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700">
                        Coding
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="group rounded-2xl border border-sky-100 bg-white overflow-hidden hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col">
                <div className="relative h-32 overflow-hidden">
                  <img
                    src="/assets/images/bg/cyber-loft.webp"
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                    alt="Cyber Loft"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-sky-900/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-sky-900/70 text-[11px] text-sky-50 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-300"></span>
                    Cyber Loft
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <p className="text-[13px] text-slate-700">
                    Neon accents, future city views, and energetic beats when
                    you need to power through build mode.
                  </p>
                  <div className="mt-auto flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-sky-50">
                    <span>Great for:</span>
                    <span className="inline-flex gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700">
                        Shipping
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700">
                        Sprints
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="community"
          className="w-full border-b border-emerald-100/80 bg-slate-50"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-[11px] text-rose-600 uppercase tracking-[0.18em]">
                  Community
                </span>
                <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-tight text-slate-900">
                  A quiet, kind place for serious focus
                </h2>
                <p className="text-[14px] text-slate-700 max-w-xl">
                  Pomodojo is built for people who care about deep work and
                  gentle accountability. No feeds, no likes — just focused
                  minutes spent together.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 flex flex-col gap-3 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&amp;fit=crop&amp;w=200&amp;q=80"
                    className="h-9 w-9 rounded-full object-cover border border-white shadow-sm"
                    alt="Avatar"
                  />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-900">
                      Alex · indie hacker
                    </span>
                    <span className="text-[11px] text-slate-500">
                      @shipdaily
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-slate-700">
                  “I used to bounce between timers and playlists. Now I just hop
                  into the same dojo every morning and my brain knows it’s focus
                  time.”
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4 flex flex-col gap-3 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&amp;fit=crop&amp;w=200&amp;q=80"
                    className="h-9 w-9 rounded-full object-cover border border-white shadow-sm"
                    alt="Avatar"
                  />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-900">
                      Sara · product designer
                    </span>
                    <span className="text-[11px] text-slate-500">
                      @shapeandshade
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-slate-700">
                  “It’s like a friendly library mixed with a co-working space. I
                  get the social energy without the social anxiety.”
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white p-4 flex flex-col gap-3 hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&amp;fit=crop&amp;w=200&amp;q=80"
                    className="h-9 w-9 rounded-full object-cover border border-white shadow-sm"
                    alt="Avatar"
                  />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-slate-900">
                      Jin · CS student
                    </span>
                    <span className="text-[11px] text-slate-500">
                      @algosandtea
                    </span>
                  </div>
                </div>
                <p className="text-[13px] text-slate-700">
                  “The streaks and leaderboard are just enough to keep me coming
                  back, but they don’t stress me out if I miss a day.”
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 group">
          <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
            <div className="rounded-3xl border bg-linear-to-br overflow-hidden relative border-slate-200 from-slate-50 via-slate-50 to-slate-100/90">
              <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.2),transparent_55%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.15),transparent_55%)]"></div>
              </div>
              <div className="relative px-5 sm:px-8 py-8 sm:py-10 lg:px-10 lg:py-12 flex flex-col lg:flex-row gap-8 lg:gap-10 items-center">
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border px-2 py-1 border-slate-300/80 bg-slate-50/70">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600"></div>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-slate-800">
                      Ready to train?
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-950">
                    Make focus sessions feel like stepping onto the mat.
                  </h2>
                  <p className="text-sm sm:text-[15px] max-w-xl text-slate-800">
                    Create a recurring dojo for your team, or drop into a public
                    room when you need a nudge. Your avatar is waiting.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-emerald-500 text-[13px] font-semibold tracking-tight shadow-sm shadow-emerald-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 transition-all text-slate-50 hover:bg-emerald-600 hover:shadow-emerald-600/50">
                      <Sparkles className="size-4" />
                      <span>Start a session now</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Check className="size-4 text-emerald-700" />
                      <span>No installs or credit card to try</span>
                    </div>
                    <span className="hidden sm:block h-1 w-1 rounded-full bg-slate-400"></span>
                    <div className="flex items-center gap-1.5">
                      <Shield className="size-4 text-slate-600" />
                      <span>Privacy-first: avatars over webcams</span>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-xs sm:max-w-sm lg:max-w-xs relative aspect-video">
                  <img
                    src="/assets/images/ninja/3.webp"
                    alt="Ninja"
                    className="absolute -bottom-40 right-0 w-full group-hover:-bottom-24 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="font-medium text-slate-700">Pomodojo</span>
            <span className="h-1 w-1 rounded-full bg-slate-400"></span>
            <span>Train your focus. Together.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <button className="inline-flex items-center gap-1 transition-colors hover:text-slate-800">
              <span>Changelog</span>
            </button>
            <button className="inline-flex items-center gap-1 transition-colors hover:text-slate-800">
              <span>Privacy</span>
            </button>
            <button className="inline-flex items-center gap-1 transition-colors hover:text-slate-800">
              <span>Contact</span>
            </button>
            <span className="hidden sm:inline h-1 w-1 rounded-full bg-slate-300"></span>
            <span className="text-slate-500">© 2025 Pomodojo</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
