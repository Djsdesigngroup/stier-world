'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { supabase } from './lib/supabase'

// Utility functions
function calcConsensus(reviews) {
  if (!reviews || !reviews.length) return { avg: 0, recommendPct: 0, n: 0 }
  let sum = 0
  let rec = 0
  reviews.forEach((r) => {
    sum += r.rating
    if (r.rating >= 4) rec += 1
  })
  return {
    avg: (sum / reviews.length) * 2,
    recommendPct: Math.round((rec / reviews.length) * 100),
    n: reviews.length,
  }
}

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

export default function HomePage() {
  const [isLightMode, setIsLightMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Fix hydration issue
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', 'Video Games')
          .order('created_at', { ascending: false })

        if (error) throw error

        // For now, add mock reviews to each product
        // We'll replace this with real ratings later
        const productsWithMockReviews = data.map(product => ({
          ...product,
          reviews: [
            { author: '@Reviewer', rating: 5, verified: true, text: 'Great game!', helpful: 10 }
          ]
        }))

        setProducts(productsWithMockReviews)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const toggleTheme = () => {
    setIsLightMode(!isLightMode)
  }

  const filteredProducts = searchQuery.trim()
    ? products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : products

  if (!mounted) {
    return null
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLightMode ? 'bg-neutral-100 text-neutral-900' : 'bg-black text-white'}`}>
      {/* HEADER */}
      <header className={`border-b sticky top-0 z-10 backdrop-blur transition-colors ${isLightMode ? 'bg-white/90 border-neutral-200' : 'bg-black/90 border-neutral-800'}`}>
        <div className="max-w-7xl mx-auto flex items-center gap-6 px-6 py-3">
          {/* Logo */}
          <Link href="/" className={`inline-flex items-center gap-2 font-bold text-lg ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded ${isLightMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
              S
            </span>
            <span>Tier World</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search games, genres, platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-lg px-4 py-2 text-sm transition-colors ${isLightMode ? 'bg-neutral-100 border-neutral-300 text-neutral-900 placeholder:text-neutral-500' : 'bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500'}`}
            />
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-5">
            <Link href="/" className={`text-sm transition-colors ${isLightMode ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}>
              Home
            </Link>
            
            {/* Clerk Authentication */}
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
              onClick={toggleTheme}
              className={`flex items-center justify-center px-2.5 py-1.5 rounded-lg border transition-all ${isLightMode ? 'border-neutral-300 hover:bg-neutral-100' : 'border-neutral-700 hover:bg-neutral-900'}`}
            >
              <span className="text-base">{isLightMode ? '🌙' : '☀️'}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {searchQuery ? `Results for "${searchQuery}"` : 'Top Rated Games'}
            </h1>
            <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Discover the highest-rated games ranked by the community
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className={`${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Loading games...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className={`${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {searchQuery ? `No games found matching "${searchQuery}"` : 'No games available'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => {
                const c = calcConsensus(p.reviews)
                const tier = getTierFromScore(c.avg)
                const tierColor = getTierColor(tier)
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className={`rounded-xl overflow-hidden border transition-all cursor-pointer block ${
                      isLightMode
                        ? 'bg-white border-neutral-200 hover:shadow-lg hover:border-neutral-300'
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {/* Image */}
                    <div className={`aspect-square relative ${isLightMode ? 'bg-neutral-50' : 'bg-neutral-800'}`}>
                      <Image
                        src={p.image_url}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className={`font-semibold text-base leading-tight ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                          {p.title}
                        </h3>
                      </div>

                      {p.reviews && p.reviews.length > 0 && (
                        <div className="mb-3">
                          <div className="inline-flex items-center gap-2">
                            <span
                              className="inline-flex items-center justify-center w-7 h-7 rounded font-bold text-sm bg-black"
                              style={{
                                color: tierColor,
                                filter: `drop-shadow(0 0 4px ${tierColor}) drop-shadow(0 0 8px ${tierColor})`,
                              }}
                            >
                              {tier}
                            </span>
                            <span className={`text-base font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                              {c.avg.toFixed(1)}/10 Tier
                            </span>
                          </div>
                        </div>
                      )}

                      <div>
                        <span className={`text-lg font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                          {p.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
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