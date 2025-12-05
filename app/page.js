'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { supabase } from './lib/supabase'

// Tier badge component
function TierBadge({ tier }) {
  const colors = {
    'S+': '#ff7f7e',
    'S': '#ff7f7e',
    'A': '#fbbf24',
    'B': '#feff7f',
    'C': '#10b981',
    'D': '#60a5fa',
    'E': '#a3a3a3',
    'F': '#ef4444',
  }

  const color = colors[tier] || '#666'

  return (
    <span
      className="inline-flex items-center justify-center px-2 py-1 rounded font-bold text-sm bg-black"
      style={{
        color,
        filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color})`,
      }}
    >
      {tier}
    </span>
  )
}

export default function Home() {
  const [isLightMode, setIsLightMode] = useState(false)
  const [sneakers, setSneakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchSneakers() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'Video Games')
          .order('created_at', { ascending: false })

        if (error) throw error

        // Add mock reviews for demo
        const sneakersWithReviews = data.map(sneaker => ({
          ...sneaker,
          reviews: [
            {
              rating: 10,
              tier: 'S+',
            },
          ],
        }))

        setSneakers(sneakersWithReviews)
      } catch (error) {
        console.error('Error fetching games:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSneakers()
  }, [])

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
            <Link href="/" className={`text-sm font-medium transition-colors ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
              Home
            </Link>
            <Link href="/tierlist" className={`text-sm transition-colors ${isLightMode ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}>
              Tier List
            </Link>
            <a 
              href="https://discord.gg/BTvuKkub" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-sm transition-colors flex items-center gap-1 ${isLightMode ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}
            >
              💬 Discord
            </a>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${isLightMode ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'}`}>
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <Link href="/profile" className={`text-sm transition-colors ${isLightMode ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}>
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

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h1 className={`text-5xl font-bold mb-4 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
          Top Rated Games
        </h1>
        <p className={`text-xl mb-8 ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
          Discover the highest-rated games ranked by the community
        </p>
        
        {/* Discord CTA Banner */}
        <div className={`max-w-2xl mx-auto mb-8 p-6 rounded-xl border-2 ${isLightMode ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300' : 'bg-gradient-to-br from-neutral-900 to-neutral-950 border-orange-500'}`}>
          <h3 className="text-xl font-bold mb-2">Join the Discussion! 💬</h3>
          <p className={`mb-4 ${isLightMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
            Debate tier rankings, discover hidden gems, and find gamers with your taste
          </p>
          <a 
            href="https://discord.gg/BTvuKkub" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${isLightMode ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
          >
            Join Discord Community →
          </a>
        </div>

        <div className="flex items-center justify-center gap-4">
          <input
            type="search"
            placeholder="Search games, genres, platforms..."
            className={`px-4 py-2 rounded-lg border w-full max-w-md transition-colors ${isLightMode ? 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-500' : 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500'}`}
          />
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <main className="max-w-7xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <p className={`${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
              Loading games...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sneakers.map((sneaker) => {
              const avgRating = sneaker.reviews.reduce((sum, r) => sum + r.rating, 0) / sneaker.reviews.length
              const tier = sneaker.reviews[0]?.tier || 'A'

              return (
                <Link
                  key={sneaker.id}
                  href={`/products/${sneaker.slug}`}
                  className={`group rounded-lg overflow-hidden border transition-all hover:scale-105 ${isLightMode ? 'bg-white border-neutral-200 hover:shadow-xl' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}
                >
                  <div className={`aspect-square relative ${isLightMode ? 'bg-neutral-100' : 'bg-neutral-800'}`}>
                    <Image
                      src={sneaker.image_url}
                      alt={sneaker.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className={`font-bold mb-1 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                      {sneaker.title}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <TierBadge tier={tier} />
                      <span className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        {avgRating.toFixed(1)}/10 Tier
                      </span>
                    </div>
                    <p className={`text-lg font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                      ${sneaker.price}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className={`mt-16 border-t transition-colors ${isLightMode ? 'border-neutral-200' : 'border-neutral-800'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className={`text-sm flex items-center justify-between ${isLightMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
            <p>© 2025 S Tier World — Community game ratings and tier lists</p>
            <a 
              href="https://discord.gg/BTvuKkub" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`transition-colors hover:text-orange-500`}
            >
              💬 Join our Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}