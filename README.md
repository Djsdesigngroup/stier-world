# S Tier World - Premium Sneaker Ratings & Marketplace

A community-driven platform for rating and discovering the best sneakers. Built with Next.js 14, Tailwind CSS, and designed for scale.

![S Tier World](https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3)

## ✨ Features

- 🔥 **Tier Rating System** - S+, S, A, B, C, D tiers with glowing badges
- 🎨 **Dark/Light Mode** - Beautiful UI in both themes
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- ⚡ **Lightning Fast** - Server-side rendering with Next.js
- 🔍 **SEO Optimized** - Product pages rank on Google
- 💎 **Premium Design** - Clean, modern interface

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
├── app/
│   ├── layout.js              # Root layout
│   ├── page.js                # Homepage
│   ├── products/[slug]/       # Product pages
│   └── profile/               # User profile
├── public/                    # Static files
└── lib/                       # Utilities & helpers
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Images**: Next.js Image Optimization

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
SERPAPI_KEY=your_serpapi_key
```

### Tailwind Configuration

Brand colors are defined in `tailwind.config.js`:

```javascript
colors: {
  brand: '#ff7f7e',
}
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push code to GitHub
2. Import repository on Vercel
3. Add environment variables
4. Deploy!

Your site will be live at `https://your-app.vercel.app`

## 🎯 Roadmap

- [x] Core product pages
- [x] User profiles
- [x] Tier rating system
- [ ] User authentication (Clerk)
- [ ] Database integration (Supabase)
- [ ] Product search (SerpAPI)
- [ ] User rating submissions
- [ ] Wishlist & Collections
- [ ] Social features
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning or building your own marketplace!

## 💬 Support

Questions? Reach out:
- GitHub Issues
- Twitter: [@stierworldapp](https://twitter.com/stierworldapp)
- Email: hello@stierworld.com

---

Built with ❤️ by the S Tier World team
