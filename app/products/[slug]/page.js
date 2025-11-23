'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// Same utility functions
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
  return 'D'
}

function getTierColor(tier) {
  if (tier === 'S+' || tier === 'S') return '#ff7f7e'
  if (tier === 'A') return '#fbbf24'
  if (tier === 'B') return '#60a5fa'
  if (tier === 'C') return '#10b981'
  return '#a3a3a3'
}

// Mock products (In production, this would be from database)
const products = {
  'jordan-1-midnight-navy': {
    id: 'jordan-midnight-navy',
    title: 'Jordan 1 Retro High OG Midnight Navy',
    sku: 'DZ5485-401',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200&auto=format&fit=crop',
    price: '$220',
    reviews: [
      { author: '@SneakerHead', rating: 5, verified: true, text: 'Premium leather, classic colorway.', helpful: 45 },
      { author: '@JordanCollector', rating: 5, verified: true, text: 'Quality is top-notch.', helpful: 32 },
    ],
  },
  'yeezy-boost-350-v2': {
    id: 'yeezy-350',
    title: 'Yeezy Boost 350 V2',
    sku: 'YEEZY-350',
    image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=1200&auto=format&fit=crop',
    price: '$220',
    reviews: [
      { author: '@YeezyFan', rating: 4, verified: true, text: 'Super comfortable.', helpful: 28 },
    ],
  },
  'nike-dunk-low-panda': {
    id: 'dunk-low-panda',
    title: 'Nike Dunk Low Panda',
    sku: 'DUNK-PANDA',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
    price: '$110',
    reviews: [
      { author: '@DunkCollector', rating: 5, verified: true, text: 'Classic black and white.', helpful: 52 },
    ],
  },
  'air-jordan-4-military-black': {
    id: 'air-jordan-4',
    title: 'Air Jordan 4 Retro Military Black',
    sku: 'AJ4-MB',
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1200&auto=format&fit=crop',
    price: '$215',
    reviews: [
      { author: '@Collector', rating: 5, verified: true, text: 'Peak Jordan design.', helpful: 67 },
      { author: '@Sneakerhead', rating: 5, verified: true, text: 'Perfection.', helpful: 43 },
    ],
  },
  'new-balance-550-white-green': {
    id: 'new-balance-550',
    title: 'New Balance 550 White Green',
    sku: 'NB-550',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop',
    price: '$120',
    reviews: [
      { author: '@Vintage', rating: 4, verified: true, text: 'Retro vibes.', helpful: 31 },
    ],
  },
  'travis-scott-jordan-1-low': {
    id: 'travis-scott-low',
    title: 'Travis Scott x Jordan 1 Low',
    sku: 'TS-J1',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop',
    price: '$1,200',
    reviews: [
      { author: '@Hype', rating: 5, verified: true, text: 'Iconic collab.', helpful: 89 },
      { author: '@Travis', rating: 5, verified: true, text: 'Best Jordan collab ever.', helpful: 76 },
    ],
  },
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [isLightMode, setIsLightMode] = useState(false)

  const product = products[params.slug]

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const consensus = calcConsensus(product.reviews)
  const tier = getTierFromScore(consensus.avg)

  const toggleTheme = () => {
    setIsLightMode(!isLightMode)
  }

  return (
    <div className={`min-h-screen transition-colors ${isLightMode ? 'bg-neutral-100' : 'bg-black'}`}>
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
              ← Back
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

      {/* PRODUCT CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className={`rounded-2xl overflow-hidden ${isLightMode ? 'bg-white' : 'bg-neutral-900'}`}>
            <div className="aspect-square relative w-full">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <h1 className={`text-3xl font-bold mb-4 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                {product.title}
              </h1>
            </div>

            {/* Tier Badge */}
            <div className="flex items-center gap-3">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded font-bold text-2xl bg-black"
                style={{
                  color: getTierColor(tier),
                  filter: `drop-shadow(0 0 4px ${getTierColor(tier)}) drop-shadow(0 0 8px ${getTierColor(tier)})`,
                }}
              >
                {tier}
              </div>
              <div>
                <div className={`text-2xl font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                  {consensus.avg.toFixed(1)}/10
                </div>
                <div className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  {tier} Tier Rating
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className={`text-4xl font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                {product.price}
              </span>
            </div>

            {/* Buy Button */}
            <button
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#ff7f7e' }}
            >
              Buy Now
            </button>

            {/* Community Rating */}
            <div className={`p-6 rounded-xl border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                Community Consensus
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Average Rating</span>
                  <span className={`text-2xl font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                    {consensus.avg.toFixed(1)}/10
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Would Recommend</span>
                  <span className={`text-xl font-bold ${isLightMode ? 'text-green-600' : 'text-green-400'}`}>
                    {consensus.recommendPct}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>Total Reviews</span>
                  <span className={`text-lg font-bold ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>{consensus.n}</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className={`p-6 rounded-xl border ${isLightMode ? 'bg-white border-neutral-200' : 'bg-neutral-900 border-neutral-800'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>Recent Reviews</h3>
              <div className="space-y-4">
                {product.reviews &&
                  product.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className={`pb-4 ${idx < product.reviews.length - 1 ? 'border-b' : ''} ${
                        isLightMode ? 'border-neutral-200' : 'border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${isLightMode ? 'text-neutral-900' : 'text-white'}`}>
                          {review.author}
                        </span>
                        <span className={`text-sm ${isLightMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          {'⭐'.repeat(review.rating)}
                        </span>
                      </div>
                      <p className={`text-sm ${isLightMode ? 'text-neutral-700' : 'text-neutral-300'}`}>{review.text}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
