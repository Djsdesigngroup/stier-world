# S Tier World - Complete Migration & Launch Checklist

## ✅ Phase 1: Local Setup (Today - 15 minutes)

### Step 1: Get the Code Running

```bash
# Navigate to the nextjs folder
cd nextjs/

# Run the setup script
chmod +x setup.sh
./setup.sh

# Start development server
npm run dev
```

Visit `http://localhost:3000` - You should see your app! 🎉

**What to check:**
- [ ] Homepage loads with product grid
- [ ] Click a product → product page loads
- [ ] Click profile → profile page loads
- [ ] Theme toggle works
- [ ] Search filters products
- [ ] All tier badges show with glow effect

---

## ✅ Phase 2: Deploy to Production (Today - 10 minutes)

### Option A: Deploy via Vercel (Easiest)

1. **Create GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial S Tier World deployment"
   git branch -M main
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/stier-world.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com/signup
   - Sign up with GitHub
   - Click "Add New..." → "Project"
   - Import your `stier-world` repository
   - Click "Deploy"
   - Wait 2 minutes... Done! ✅

**Your live URL:** `https://stier-world.vercel.app`

### What You Have Now:
✅ Professional, production-ready site
✅ Automatic SSL (HTTPS)
✅ Global CDN (fast everywhere)
✅ Automatic deployments on git push
✅ Free hosting forever (hobby plan)

---

## ✅ Phase 3: Add Authentication (This Week - 1 hour)

### Setup Clerk

1. **Sign up for Clerk**
   - Go to https://clerk.com
   - Create account → Create application
   - Copy your API keys

2. **Install Clerk**
   ```bash
   npm install @clerk/nextjs
   ```

3. **Add to .env.local**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   ```

4. **Update app/layout.js**
   ```javascript
   import { ClerkProvider } from '@clerk/nextjs'
   
   export default function RootLayout({ children }) {
     return (
       <ClerkProvider>
         <html lang="en">
           <body>{children}</body>
         </html>
       </ClerkProvider>
     )
   }
   ```

5. **Add login to header** (in your page components)
   ```javascript
   import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
   
   // Replace "Profile" link with:
   <SignedOut>
     <SignInButton mode="modal">
       <button>Sign In</button>
     </SignInButton>
   </SignedOut>
   <SignedIn>
     <UserButton afterSignOutUrl="/" />
   </SignedIn>
   ```

6. **Add environment variables to Vercel**
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add both Clerk keys
   - Click "Deploy" to rebuild

**Test:** Click sign in → Should see Clerk login modal → Sign up → See user profile button

---

## ✅ Phase 4: Add Database (This Week - 1 hour)

### Setup Supabase

1. **Create Supabase project**
   - Go to https://supabase.com
   - Create account → New project
   - Wait for database to provision (2-3 min)

2. **Create tables**
   - Click "SQL Editor" → New query
   - Copy/paste this SQL:

```sql
-- Products table
create table products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  sku text unique,
  image_url text,
  price text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Ratings table
create table ratings (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade,
  user_id text not null,
  score numeric check (score >= 0 and score <= 10),
  tier text check (tier in ('S+', 'S', 'A', 'B', 'C', 'D')),
  review text,
  helpful_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, product_id)
);

-- User profiles
create table profiles (
  id text primary key,
  username text unique,
  avatar_url text,
  bio text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table products enable row level security;
alter table ratings enable row level security;
alter table profiles enable row level security;

-- Public read policies
create policy "Products are viewable by everyone"
  on products for select using (true);

create policy "Ratings are viewable by everyone"
  on ratings for select using (true);

create policy "Profiles are viewable by everyone"
  on profiles for select using (true);

-- Authenticated write policies
create policy "Users can insert their own ratings"
  on ratings for insert with check (auth.uid()::text = user_id);

create policy "Users can update their own ratings"
  on ratings for update using (auth.uid()::text = user_id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid()::text = id);
```

3. **Install Supabase client**
   ```bash
   npm install @supabase/supabase-js
   ```

4. **Create lib/supabase.js**
   ```javascript
   import { createClient } from '@supabase/supabase-js'
   
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
   
   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

5. **Add environment variables**
   - Get from Supabase: Settings → API
   - Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
   ```
   - Add to Vercel environment variables too

6. **Seed initial products**
   - Go to Supabase Table Editor
   - Click "products" table → Insert row
   - Add your Jordan 1, Yeezys, etc.

---

## ✅ Phase 5: Add Real Features (Next Week)

### Feature 1: Fetch Products from Database

Update `app/page.js`:

```javascript
import { supabase } from '@/lib/supabase'

// Server component - no 'use client' needed!
export default async function HomePage() {
  // Fetch products from Supabase
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  // Rest of your component stays the same
  // Just use `products` instead of `seedProducts`
}
```

### Feature 2: User Rating Submission

Create `components/RatingForm.js`:

```javascript
'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

function getTierFromScore(score) {
  if (score >= 9.5) return 'S+'
  if (score >= 9.0) return 'S'
  if (score >= 8.0) return 'A'
  if (score >= 7.0) return 'B'
  if (score >= 6.0) return 'C'
  return 'D'
}

export function RatingForm({ productId, onSuccess }) {
  const { user } = useUser()
  const [score, setScore] = useState(5)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    
    const { error } = await supabase
      .from('ratings')
      .upsert({
        product_id: productId,
        user_id: user.id,
        score,
        tier: getTierFromScore(score),
        review
      })
    
    if (!error) {
      onSuccess?.()
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Your Rating: {score.toFixed(1)}/10 ({getTierFromScore(score)} Tier)
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={score}
          onChange={(e) => setScore(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Your Review
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Share your thoughts..."
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg font-bold text-white"
        style={{backgroundColor: '#ff7f7e'}}
      >
        {loading ? 'Submitting...' : 'Submit Rating'}
      </button>
    </form>
  )
}
```

Add to product page:

```javascript
import { RatingForm } from '@/components/RatingForm'

// In your product page
<RatingForm 
  productId={product.id}
  onSuccess={() => router.refresh()}
/>
```

---

## ✅ Phase 6: Add Product Search (Next Week)

### Setup SerpAPI

1. **Get API key**
   - Sign up at https://serpapi.com
   - Copy your API key
   - Add to `.env.local`:
   ```env
   SERPAPI_KEY=xxxxx
   ```

2. **Create API route**: `app/api/search/route.js`

```javascript
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  
  const response = await fetch(
    `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(query + ' sneakers')}&api_key=${process.env.SERPAPI_KEY}`
  )
  
  const data = await response.json()
  
  const results = (data.shopping_results || []).map(item => ({
    title: item.title,
    image: item.thumbnail,
    price: item.price,
    source: item.source,
    link: item.link
  }))
  
  return NextResponse.json(results)
}
```

3. **Use in homepage**

```javascript
// In your search handler
const searchProducts = async (query) => {
  const response = await fetch(`/api/search?q=${query}`)
  const results = await response.json()
  setProducts(results)
}
```

---

## 📊 Launch Checklist

Before going live:

### Technical
- [ ] All environment variables in Vercel
- [ ] Database tables created in Supabase
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Custom domain connected (optional)
- [ ] Favicon added to `app/favicon.ico`
- [ ] 404 page created (`app/not-found.js`)
- [ ] Loading states for all async operations
- [ ] Error boundaries added

### Content
- [ ] At least 10 products in database
- [ ] Product images optimized
- [ ] SEO metadata on all pages
- [ ] Social media preview images
- [ ] Terms of Service page
- [ ] Privacy Policy page

### Testing
- [ ] Test on mobile (Chrome DevTools)
- [ ] Test authentication flow
- [ ] Test rating submission
- [ ] Test search functionality
- [ ] Test all links
- [ ] Check Lighthouse score (aim for 90+)

---

## 🎯 Success Metrics

Track these after launch:

**Week 1:**
- [ ] 100 visitors
- [ ] 10 sign-ups
- [ ] 5 product ratings

**Month 1:**
- [ ] 1,000 visitors
- [ ] 100 sign-ups
- [ ] 50 product ratings

**Month 3:**
- [ ] 10,000 visitors
- [ ] 500 sign-ups
- [ ] 500 product ratings

---

## 🚀 Marketing Plan

**Launch Day:**
1. Post on Reddit (r/Sneakers, r/SideProject)
2. Tweet about launch
3. Post on ProductHunt
4. Share in Discord communities

**Week 1:**
1. Email 10 sneaker influencers
2. Create TikTok showing the tier system
3. Post in Facebook sneaker groups

**Ongoing:**
1. SEO optimization (blog posts about sneakers)
2. Social media presence
3. Community engagement
4. Partnerships with sneaker stores

---

## 💰 Monetization (Later)

**Phase 1 (Free):**
- Build user base
- Collect data
- Prove concept

**Phase 2 (Revenue):**
- Affiliate links to buy products (10-15% commission)
- Premium features ($5/month)
- Sponsored listings
- API access for businesses

---

## 🎓 Learning Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Clerk Docs**: https://clerk.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

## 🎉 You're Ready!

You now have:
✅ Production-ready Next.js app
✅ Complete deployment guide
✅ Authentication system planned
✅ Database architecture
✅ Feature roadmap
✅ Launch checklist
✅ Marketing plan

**Start with Phase 1 & 2 today.** Get your site live, then add features one by one.

You got this! 🚀
