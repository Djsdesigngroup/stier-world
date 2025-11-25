import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'S Tier World - Premium Sneaker Ratings',
  description: 'Discover the highest-rated sneakers verified by our community. Rate, review, and find your next grail.',
  keywords: 'sneakers, ratings, reviews, jordan, nike, yeezy, community',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider dynamic>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}