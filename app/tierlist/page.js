'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

function getTierRange(tier) {
  if (tier === 'S+') return '9.5-10.0'
  if (tier === 'S') return '9.0-9.4'
  if (tier === 'A') return '8.0-8.9'
  if (tier === 'B') return '7.0-7.9'
  if (tier === 'C') return '6.0-6.9'
  if (tier === 'D') return '5.0-5.9'
  if (tier === 'E') return '3.0-4.9'
  return '0.0-2.9'
}

export default function TierListPage() {
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

        // Add mock reviews for demo (replace with real ratings later)
        const gamesWithScores = data.map(game => ({
          ...game,
          // Mock score - in real app, calculate from actual ratings
          score: 10.0 // For now, all games show as S+
        }))

        setGames(gamesWithScores)
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

  // Tier order
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
            <Link href="/tierlist" className={`text-sm font-medium transition-colors ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
              Tier List
            </Link>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Community Tier List</h1>
          <p className={`text-lg ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Games ranked by the community from S+ (legendary) to F (avoid)
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className={`${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Loading tier list...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tiers.map(tier => {
              const tieredGames = gamesByTier[tier] || []
              if (tieredGames.length === 0) return null

              const tierColor = getTierColor(tier)
              const tierRange = getTierRange(tier)

              return (
                <div key={tier} className={`rounded-xl overflow-hidden border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
                  {/* Tier Header */}
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
                        <h2 className={`text-xl font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                          {tier} Tier
                        </h2>
                        <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          {tieredGames.length} {tieredGames.length === 1 ? 'game' : 'games'} • {tierRange} rating
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Games Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {tieredGames.map(game => (
                        <Link
                          key={game.id}
                          href={`/products/${game.slug}`}
                          className={`group rounded-lg overflow-hidden border transition-all hover:scale-105 ${isLightMode ? 'border-neutral-200 hover:border-neutral-300 hover:shadow-lg' : 'border-neutral-800 hover:border-neutral-700'}`}
                        >
                          {/* Game Cover */}
                          <div className={`aspect-square relative ${isLightMode ? 'bg-neutral-100' : 'bg-neutral-800'}`}>
                            <Image
                              src={game.image_url}
                              alt={game.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Game Title */}
                          <div className={`p-2 ${isLightMode ? 'bg-white' : 'bg-neutral-900'}`}>
                            <h3 className={`text-xs font-medium line-clamp-2 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                              {game.title}
                            </h3>
                            <p className={`text-xs mt-1 ${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              {game.score.toFixed(1)}/10
                            </p>
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