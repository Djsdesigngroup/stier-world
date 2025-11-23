'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

function getTierFromScore(score) {
  if (score >= 9.5) return 'S+'
  if (score >= 9.0) return 'S'
  if (score >= 8.0) return 'A'
  if (score >= 7.0) return 'B'
  if (score >= 6.0) return 'C'
  return 'D'
}

function getTierColor(tier) {
  if (tier === 'S+' || tier === 'S') return '#ff7f7e'
  if (tier === 'A') return '#fbbf24'
  if (tier === 'B') return '#60a5fa'
  if (tier === 'C') return '#10b981'
  return '#a3a3a3'
}

// Mock user ratings data
const userRatings = [
  {
    id: 'jordan-midnight-navy',
    title: 'Jordan 1 Retro High OG Midnight Navy',
    slug: 'jordan-1-midnight-navy',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400&auto=format&fit=crop',
    userRating: 'S+',
    userScore: 9.8,
    price: '$220',
    dateRated: '2 days ago',
    userReview: 'Absolutely stunning. Perfect in every way.',
  },
  {
    id: 'travis-scott-low',
    title: 'Travis Scott x Jordan 1 Low',
    slug: 'travis-scott-jordan-1-low',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=400&auto=format&fit=crop',
    userRating: 'S',
    userScore: 9.4,
    price: '$1,200',
    dateRated: '1 week ago',
    userReview: 'Iconic collab. The reverse swoosh is amazing.',
  },
  {
    id: 'air-jordan-4',
    title: 'Air Jordan 4 Retro Military Black',
    slug: 'air-jordan-4-military-black',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop',
    userRating: 'S',
    userScore: 9.0,
    price: '$215',
    dateRated: '2 weeks ago',
    userReview: 'Classic Jordan silhouette done right.',
  },
  {
    id: 'yeezy-350',
    title: 'Yeezy Boost 350 V2',
    slug: 'yeezy-boost-350-v2',
    image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=400&auto=format&fit=crop',
    userRating: 'A',
    userScore: 8.5,
    price: '$220',
    dateRated: '3 weeks ago',
    userReview: 'Comfortable but not as hyped anymore.',
  },
]

export default function ProfilePage() {
  const [isLightMode, setIsLightMode] = useState(false)
  const [activeTab, setActiveTab] = useState('rated')

  const toggleTheme = () => {
    setIsLightMode(!isLightMode)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLightMode ? 'bg-neutral-100 text-neutral-900' : 'bg-black text-white'}`}>
      {/* HEADER */}
      <header className={`border-b sticky top-0 z-10 backdrop-blur transition-colors ${isLightMode ? 'bg-white/90 border-neutral-200' : 'bg-black/90 border-neutral-800'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link href="/" className={`inline-flex items-center gap-2 font-bold text-lg ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded ${isLightMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
              S
            </span>
            <span>Tier World</span>
          </Link>

          <nav className="flex items-center gap-5">
            <Link href="/" className={`text-sm transition-colors ${isLightMode ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}>
              Browse
            </Link>
            <Link href="/profile" className={`text-sm transition-colors ${isLightMode ? 'text-neutral-600 hover:text-neutral-900' : 'text-neutral-400 hover:text-white'}`}>
              Profile
            </Link>
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center px-2.5 py-1.5 rounded-lg border transition-all ${isLightMode ? 'border-neutral-300 hover:bg-neutral-100' : 'border-neutral-700 hover:bg-neutral-900'}`}
            >
              <span className="text-base">{isLightMode ? '🌙' : '☀️'}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* PROFILE HEADER */}
      <div className={`border-b transition-colors ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="relative w-24 h-24">
              <Image
                src="https://ui-avatars.com/api/?name=SneakerHead247&size=200&background=ff7f7e&color=fff&bold=true"
                alt="User Avatar"
                fill
                className="rounded-full border-4"
                style={{ borderColor: '#ff7f7e' }}
              />
            </div>

            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                SneakerHead247
              </h1>
              <div className={`flex flex-wrap gap-4 text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                <span>📍 Los Angeles, CA</span>
                <span>📅 Joined March 2024</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Products Rated', value: 4 },
              { label: 'Reviews', value: 4 },
              { label: 'Followers', value: 234 },
              { label: 'Following', value: 189 },
            ].map((stat, idx) => (
              <div key={idx} className={`text-center p-3 rounded-lg ${isLightMode ? 'bg-neutral-50' : 'bg-neutral-950'}`}>
                <div className={`text-2xl font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>{stat.value}</div>
                <div className={`text-xs mt-1 ${isLightMode ? 'text-neutral-600' : 'text-neutral-500'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-4">
          <h2 className={`text-2xl font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>Your Ratings</h2>

          {/* Rated Products Grid */}
          <div className="grid gap-4">
            {userRatings.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className={`rounded-xl border overflow-hidden transition-all hover:shadow-lg ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Product Image */}
                  <div className={`w-full md:w-48 h-48 relative ${isLightMode ? 'bg-neutral-50' : 'bg-neutral-800'}`}>
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-1 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                          {product.title}
                        </h3>
                        <div className={`flex items-center gap-3 text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          <span>{product.price}</span>
                          <span>•</span>
                          <span>{product.dateRated}</span>
                        </div>
                      </div>

                      {/* User Rating Badge */}
                      <div className="flex flex-col items-end gap-2">
                        <div
                          className="inline-flex items-center justify-center w-14 h-14 rounded font-bold text-xl bg-black"
                          style={{
                            color: getTierColor(product.userRating),
                            filter: `drop-shadow(0 0 4px ${getTierColor(product.userRating)}) drop-shadow(0 0 8px ${getTierColor(product.userRating)})`,
                          }}
                        >
                          {product.userRating}
                        </div>
                        <div className={`text-sm font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                          {product.userScore}/10
                        </div>
                      </div>
                    </div>

                    {/* Review */}
                    {product.userReview && (
                      <div className={`text-sm p-3 rounded-lg ${isLightMode ? 'bg-neutral-50' : 'bg-neutral-800'}`}>
                        <p className={`${isLightMode ? 'text-neutral-700' : 'text-neutral-300'}`}>
                          "{product.userReview}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
