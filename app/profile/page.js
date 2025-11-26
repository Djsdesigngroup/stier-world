'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { supabase } from '../lib/supabase'

// Utility functions
function getTierFromScore(score) {
  if (score >= 9.5) return 'S+'
  if (score >= 9.0) return 'S'
  if (score >= 8.0) return 'A'
  if (score >= 7.0) return 'B'
  if (score >= 6.0) return 'C'
  if (score >= 5.0) return 'D'
  if (score >= 3.0) return 'E'
  return 'F'
}

function getTierColor(tier) {
  if (tier === 'S+' || tier === 'S') return '#ff7f7e'
  if (tier === 'A') return '#fbbf24'
  if (tier === 'B') return '#feff7f'
  if (tier === 'C') return '#10b981'
  if (tier === 'D') return '#60a5fa'
  if (tier === 'E') return '#a3a3a3'
  return '#ef4444'
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()
  const [isLightMode, setIsLightMode] = useState(false)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchGames() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'Video Games')
          .order('created_at', { ascending: false })

        if (error) throw error

        // For demo: show first 12 games
        const userGames = data.slice(0, 12).map(game => ({
          ...game,
          score: 10.0,
          userRating: 5,
        }))

        setGames(userGames)
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  // Group games by tier
  const gamesByTier = games.reduce((acc, game) => {
    const tier = getTierFromScore(game.score)
    if (!acc[tier]) acc[tier] = []
    acc[tier].push(game)
    return acc
  }, {})

  const tiers = ['S+', 'S', 'A', 'B', 'C', 'D', 'E', 'F']

  if (!mounted) return null

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLightMode ? 'bg-neutral-100 text-neutral-900' : 'bg-black text-white'}`}>
      {/* HEADER */}
      <header className={`border-b sticky top-0 z-10 backdrop-blur transition-colors ${isLightMode ? 'bg-white/90 border-neutral-200' : 'bg-black/90 border-neutral-800'}`}>
        <div className="max-w-7xl mx-auto flex items-center gap-6 px-6 py-3">
          <Link href="/" className={`inline-flex items-center gap-2 font-bold text-lg ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded ${isLightMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
              S
            </span>
            <span>Tier World</span>
          </Link>

          <nav className="flex items-center gap-5 ml-auto">
            <Link href="/" className={`text-sm transition-colors ${isLightMode ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}>
              Home
            </Link>
            <Link href="/tierlist" className={`text-sm transition-colors ${isLightMode ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}>
              Tier List
            </Link>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${isLightMode ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'}`}>
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <Link href="/profile" className={`text-sm font-medium transition-colors ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                Profile
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <button
              onClick={() => setIsLightMode(!isLightMode)}
              className={`flex items-center justify-center px-2.5 py-1.5 rounded-lg border transition-all ${isLightMode ? 'border-neutral-300 hover:bg-neutral-100' : 'border-neutral-700 hover:bg-neutral-900'}`}
            >
              <span className="text-base">{isLightMode ? '🌙' : '☀️'}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <SignedOut>
          {/* Preview Banner */}
          <div className={`mb-8 p-6 rounded-xl border-2 text-center ${isLightMode ? 'bg-gradient-to-br from-neutral-50 to-white border-neutral-300' : 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-neutral-700'}`}>
            <h2 className="text-2xl font-bold mb-2">Preview: What Your Profile Could Look Like</h2>
            <p className={`mb-4 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Sign in to create your personal tier list and track your ratings
            </p>
            <SignInButton mode="modal">
              <button className={`px-6 py-3 rounded-lg font-medium transition-colors ${isLightMode ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'}`}>
                Sign In to Get Started
              </button>
            </SignInButton>
          </div>

          {/* Preview Profile */}
          <div className="mb-8 opacity-75">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isLightMode ? 'bg-neutral-200' : 'bg-neutral-800'}`}>
                <span className="text-3xl">👤</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Your Profile</h1>
                <p className={`text-lg mt-1 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  12 games rated
                </p>
              </div>
            </div>

            {/* Preview Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <div className={`p-4 rounded-lg border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Total Ratings</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className={`p-4 rounded-lg border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Average Rating</p>
                <p className="text-2xl font-bold">9.2/10</p>
              </div>
              <div className={`p-4 rounded-lg border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>S+ Tier Games</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </div>

          {/* Preview Tier List */}
          <div className="mb-8 opacity-75">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">My Tier List</h2>
              <button disabled className={`px-4 py-2 rounded-lg border opacity-50 cursor-not-allowed ${isLightMode ? 'border-neutral-300 bg-neutral-100' : 'border-neutral-700 bg-neutral-800'}`}>
                Share My List
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className={`${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Loading preview...
                </p>
              </div>
            ) : (
              <div className="space-y-6 relative">
                {/* Overlay to prevent interaction */}
                <div className="absolute inset-0 bg-transparent z-10" />
                
                {tiers.slice(0, 2).map(tier => {
                  const tieredGames = gamesByTier[tier] || []
                  if (tieredGames.length === 0) return null

                  const tierColor = getTierColor(tier)

                  return (
                    <div key={tier} className={`rounded-xl overflow-hidden border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                      <div className={`px-6 py-4 border-b flex items-center justify-between ${isLightMode ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-800/50 border-neutral-700'}`}>
                        <div className="flex items-center gap-3">
                          <span
                            className="inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-xl bg-black"
                            style={{
                              color: tierColor,
                              filter: `drop-shadow(0 0 6px ${tierColor}) drop-shadow(0 0 12px ${tierColor})`,
                            }}
                          >
                            {tier}
                          </span>
                          <div>
                            <h3 className={`text-xl font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                              {tier} Tier
                            </h3>
                            <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                              {tieredGames.length} {tieredGames.length === 1 ? 'game' : 'games'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                          {tieredGames.map(game => (
                            <div
                              key={game.id}
                              className={`group rounded-lg overflow-hidden border ${isLightMode ? 'border-neutral-200' : 'border-neutral-800'}`}
                            >
                              <div className={`aspect-square relative ${isLightMode ? 'bg-neutral-100' : 'bg-neutral-800'}`}>
                                <Image
                                  src={game.image_url}
                                  alt={game.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className={`p-2 ${isLightMode ? 'bg-white' : 'bg-neutral-900'}`}>
                                <h4 className={`text-xs font-medium line-clamp-2 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                                  {game.title}
                                </h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className={`text-xs ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                    ⭐ 5/5
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {/* CTA at bottom */}
                <div className={`text-center py-12 rounded-xl border-2 ${isLightMode ? 'bg-neutral-50 border-neutral-300' : 'bg-neutral-900 border-neutral-700'}`}>
                  <h3 className="text-2xl font-bold mb-3">Want to create your own tier list?</h3>
                  <SignInButton mode="modal">
                    <button className={`px-8 py-4 rounded-lg font-medium text-lg transition-colors ${isLightMode ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'}`}>
                      Sign In Now
                    </button>
                  </SignInButton>
                </div>
              </div>
            )}
          </div>
        </SignedOut>

        <SignedIn>
          {/* User Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {user?.imageUrl && (
                <Image
                  src={user.imageUrl}
                  alt={user.firstName || 'User'}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold">
                  {user?.firstName || user?.username || 'User'}'s Profile
                </h1>
                <p className={`text-lg mt-1 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  {games.length} games rated
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <div className={`p-4 rounded-lg border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Total Ratings</p>
                <p className="text-2xl font-bold">{games.length}</p>
              </div>
              <div className={`p-4 rounded-lg border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Average Rating</p>
                <p className="text-2xl font-bold">9.8/10</p>
              </div>
              <div className={`p-4 rounded-lg border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>S+ Tier Games</p>
                <p className="text-2xl font-bold">{gamesByTier['S+']?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* My Tier List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">My Tier List</h2>
              <button className={`px-4 py-2 rounded-lg border transition-colors ${isLightMode ? 'border-neutral-300 hover:bg-neutral-100' : 'border-neutral-700 hover:bg-neutral-800'}`}>
                Share My List
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className={`${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Loading your ratings...
                </p>
              </div>
            ) : games.length === 0 ? (
              <div className={`text-center py-20 border-2 border-dashed rounded-xl ${isLightMode ? 'border-neutral-300' : 'border-neutral-700'}`}>
                <h3 className="text-2xl font-bold mb-2">No games rated yet</h3>
                <p className={`mb-6 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Start rating games to build your personal tier list
                </p>
                <Link
                  href="/"
                  className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${isLightMode ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'}`}
                >
                  Browse Games
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {tiers.map(tier => {
                  const tieredGames = gamesByTier[tier] || []
                  if (tieredGames.length === 0) return null

                  const tierColor = getTierColor(tier)

                  return (
                    <div key={tier} className={`rounded-xl overflow-hidden border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                      <div className={`px-6 py-4 border-b flex items-center justify-between ${isLightMode ? 'bg-neutral-50 border-neutral-200' : 'bg-neutral-800/50 border-neutral-700'}`}>
                        <div className="flex items-center gap-3">
                          <span
                            className="inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-xl bg-black"
                            style={{
                              color: tierColor,
                              filter: `drop-shadow(0 0 6px ${tierColor}) drop-shadow(0 0 12px ${tierColor})`,
                            }}
                          >
                            {tier}
                          </span>
                          <div>
                            <h3 className={`text-xl font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                              {tier} Tier
                            </h3>
                            <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                              {tieredGames.length} {tieredGames.length === 1 ? 'game' : 'games'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                          {tieredGames.map(game => (
                            <Link
                              key={game.id}
                              href={`/products/${game.slug}`}
                              className={`group rounded-lg overflow-hidden border transition-all hover:scale-105 ${isLightMode ? 'border-neutral-200 hover:border-neutral-300 hover:shadow-lg' : 'border-neutral-800 hover:border-neutral-700'}`}
                            >
                              <div className={`aspect-square relative ${isLightMode ? 'bg-neutral-100' : 'bg-neutral-800'}`}>
                                <Image
                                  src={game.image_url}
                                  alt={game.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className={`p-2 ${isLightMode ? 'bg-white' : 'bg-neutral-900'}`}>
                                <h4 className={`text-xs font-medium line-clamp-2 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                                  {game.title}
                                </h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className={`text-xs ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                    ⭐ {game.userRating}/5
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </SignedIn>
      </main>

      {/* FOOTER */}
      <footer className={`mt-16 border-t transition-colors ${isLightMode ? 'border-neutral-200' : 'border-neutral-800'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className={`text-sm ${isLightMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
            <p>© 2025 S Tier World — Community game ratings and tier lists</p>
          </div>
        </div>
      </footer>
    </div>
  )
}