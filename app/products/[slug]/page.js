'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

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

// Mock data
const seedProducts = [
  {
    id: 'jordan-midnight-navy',
    title: 'Jordan 1 Retro High OG Midnight Navy',
    slug: 'jordan-1-midnight-navy',
    category: 'Sneakers',
    sku: 'DZ5485-401',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200&auto=format&fit=crop',
    price: '$220',
    reviews: [
      { author: '@SneakerHead', rating: 5, verified: true, text: 'Premium leather, classic colorway.', helpful: 45 },
      { author: '@JordanCollector', rating: 5, verified: true, text: 'Quality is top-notch.', helpful: 32 },
    ],
  },
  {
    id: 'yeezy-350',
    title: 'Yeezy Boost 350 V2',
    slug: 'yeezy-boost-350-v2',
    category: 'Sneakers',
    sku: 'YEEZY-350',
    image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=1200&auto=format&fit=crop',
    price: '$220',
    reviews: [
      { author: '@YeezyFan', rating: 4, verified: true, text: 'Super comfortable.', helpful: 28 },
    ],
  },
  {
    id: 'dunk-low-panda',
    title: 'Nike Dunk Low Panda',
    slug: 'nike-dunk-low-panda',
    category: 'Sneakers',
    sku: 'DUNK-PANDA',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    price: '$110',
    reviews: [
      { author: '@DunkCollector', rating: 5, verified: true, text: 'Classic black and white.', helpful: 52 },
    ],
  },
  {
    id: 'air-jordan-4',
    title: 'Air Jordan 4 Retro Military Black',
    slug: 'air-jordan-4-military-black',
    category: 'Sneakers',
    sku: 'AJ4-MB',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1200&auto=format&fit=crop',
    price: '$215',
    reviews: [
      { author: '@Collector', rating: 5, verified: true, text: 'Peak Jordan design.', helpful: 67 },
      { author: '@Sneakerhead', rating: 5, verified: true, text: 'Perfection.', helpful: 43 },
    ],
  },
  {
    id: 'new-balance-550',
    title: 'New Balance 550 White Green',
    slug: 'new-balance-550-white-green',
    category: 'Sneakers',
    sku: 'NB-550',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop',
    price: '$120',
    reviews: [
      { author: '@Vintage', rating: 4, verified: true, text: 'Retro vibes.', helpful: 31 },
    ],
  },
  {
    id: 'travis-scott-low',
    title: 'Travis Scott x Jordan 1 Low',
    slug: 'travis-scott-jordan-1-low',
    category: 'Sneakers',
    sku: 'TS-J1',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop',
    price: '$1,200',
    reviews: [
      { author: '@Hype', rating: 5, verified: true, text: 'Iconic collab.', helpful: 89 },
      { author: '@Travis', rating: 5, verified: true, text: 'Best Jordan collab ever.', helpful: 76 },
    ],
  },
]

export default function HomePage() {
  const [isLightMode, setIsLightMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleTheme = () => {
    setIsLightMode(!isLightMode)
  }

  const filteredProducts = searchQuery.trim()
    ? seedProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : seedProducts

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
              placeholder="Search sneakers, brands, colorways..."
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
              {searchQuery ? `Results for "${searchQuery}"` : 'Top Rated Sneakers'}
            </h1>
            <p className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
              Discover the highest-rated sneakers verified by our community
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className={`${isLightMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
                No sneakers found matching "{searchQuery}"
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
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-contain"
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
            <p>© 2025 S Tier World — Premium sneaker ratings and marketplace</p>
          </div>
        </div>
      </footer>
    </div>
  )
}