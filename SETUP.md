# S Tier World - Next.js Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Set Up Your Project

```bash
# Create a new directory
mkdir stier-world
cd stier-world

# Copy all files from the nextjs/ folder to this directory
# Your structure should look like:
# stier-world/
#   ├── app/
#   ├── package.json
#   ├── next.config.js
#   ├── tailwind.config.js
#   └── ...

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` - Your app is live locally! 🎉

---

## 📁 Project Structure

```
stier-world/
├── app/
│   ├── layout.js          # Root layout with metadata
│   ├── page.js            # Homepage with product grid
│   ├── globals.css        # Global styles + Tailwind
│   ├── products/
│   │   └── [slug]/
│   │       └── page.js    # Dynamic product pages
│   └── profile/
│       └── page.js        # User profile page
├── public/                # Static assets (add images here)
├── package.json
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
└── .env.local            # Environment variables (create this!)
```

---

## 🌐 Deploy to Vercel (3 minutes)

### Option 1: Deploy via GitHub (Recommended)

1. **Create GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - S Tier World Next.js"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/stier-world.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Done! ✅

Your site will be live at: `https://stier-world.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

---

## 🔑 Environment Variables

Create `.env.local` in your root directory:

```env
# Clerk Authentication (add later)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Supabase Database (add later)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

# SerpAPI (add later)
SERPAPI_KEY=xxxxx
```

**Important:** Add these to Vercel after deployment:
- Go to Project Settings → Environment Variables
- Add each variable
- Redeploy

---

## ✨ What's Different from Vite?

### Advantages You Now Have:

1. **SEO-Friendly** 
   - Product pages are server-rendered
   - Google can index your products
   - Better social media previews

2. **Better Performance**
   - Automatic code splitting
   - Image optimization (Next.js Image component)
   - Faster page loads

3. **API Routes** (coming next)
   - No separate backend needed
   - Create API endpoints in `app/api/`
   - Perfect for product search, ratings, etc.

4. **File-Based Routing**
   - No React Router needed
   - `app/products/[slug]/page.js` = `/products/:slug`
   - Simpler and cleaner

---

## 🎯 Next Steps

### Phase 1: Add Real Data (This Week)

#### 1. Set Up Supabase Database

Create these tables in Supabase SQL Editor:

```sql
-- Products table
create table products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  sku text unique,
  image_url text,
  price numeric,
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
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, product_id)
);

-- Enable Row Level Security
alter table products enable row level security;
alter table ratings enable row level security;

-- Allow public reads
create policy "Products are viewable by everyone"
  on products for select using (true);

create policy "Ratings are viewable by everyone"
  on ratings for select using (true);
```

#### 2. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

Create `lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 3. Fetch Real Products

Update `app/page.js`:

```javascript
import { supabase } from '@/lib/supabase'

// Add this function to fetch products
async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  return data || []
}

// Use in your component
export default async function HomePage() {
  const products = await getProducts()
  // ... rest of your code
}
```

---

### Phase 2: Add Authentication (Next Week)

#### Install Clerk

```bash
npm install @clerk/nextjs
```

Update `app/layout.js`:

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

Add sign-in to your header:

```javascript
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

// In your header
<SignedOut>
  <SignInButton />
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

---

### Phase 3: Add API Routes

Create `app/api/products/search/route.js`:

```javascript
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  
  // Call SerpAPI
  const response = await fetch(
    `https://serpapi.com/search.json?engine=google_shopping&q=${query}&api_key=${process.env.SERPAPI_KEY}`
  )
  
  const data = await response.json()
  return NextResponse.json(data.shopping_results)
}
```

Use it in your frontend:

```javascript
const searchProducts = async (query) => {
  const response = await fetch(`/api/products/search?q=${query}`)
  const results = await response.json()
  return results
}
```

---

### Phase 4: Add Rating Submission

Create `app/api/ratings/route.js`:

```javascript
import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs'

export async function POST(request) {
  const { userId } = auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const { productId, score, tier, review } = await request.json()
  
  const { data, error } = await supabase
    .from('ratings')
    .insert({
      product_id: productId,
      user_id: userId,
      score,
      tier,
      review
    })
  
  if (error) {
    return new Response(error.message, { status: 500 })
  }
  
  return Response.json(data)
}
```

---

## 🎨 Customization Tips

### 1. Update Brand Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      brand: '#ff7f7e',
      'brand-dark': '#ff5f5e',
    },
  },
}
```

### 2. Add More Products

Your mock data is in each page file. To use real data:
- Add products to Supabase
- Update pages to fetch from database
- Done!

### 3. Optimize Images

Next.js automatically optimizes images. Just use:

```javascript
<Image 
  src="/your-image.jpg"
  alt="Description"
  width={500}
  height={500}
  priority // for above-the-fold images
/>
```

---

## 🐛 Common Issues

### Issue 1: "Module not found" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Images not loading

- Make sure domain is in `next.config.js` under `images.domains`
- Use Next.js `<Image>` component, not `<img>`

### Issue 3: Build fails on Vercel

- Check environment variables are set
- Make sure `.env.local` is in `.gitignore`
- Check build logs for specific errors

---

## 📱 Mobile App (Later)

When you're ready, create mobile app:

```bash
npx create-expo-app stier-world-mobile --template blank
cd stier-world-mobile

# Install shared dependencies
npm install @supabase/supabase-js
```

Share your utility functions, Supabase client, and tier logic between web and mobile!

---

## 📊 Analytics

Add Google Analytics:

```bash
npm install @next/third-parties
```

Update `app/layout.js`:

```javascript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

---

## 🎯 Performance Checklist

Before launch:

- [ ] All images using Next.js Image component
- [ ] Metadata added to all pages (SEO)
- [ ] Environment variables set on Vercel
- [ ] Database indexes created for frequent queries
- [ ] Error boundaries added
- [ ] Loading states added
- [ ] 404 page created
- [ ] Favicon added to public/

---

## 💡 Pro Tips

1. **Use Server Components by default** - They're faster and better for SEO
2. **Only use 'use client' when you need** - Interactivity, hooks, browser APIs
3. **Leverage caching** - Next.js caches by default, use `revalidate` for fresh data
4. **Optimize for Core Web Vitals** - Vercel shows these in your dashboard

---

## 🆘 Getting Help

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: support@vercel.com
- **Stack Overflow**: Tag questions with `next.js`
- **GitHub Issues**: Check Next.js GitHub for known issues

---

## 🎉 You're All Set!

Your S Tier World app is now on Next.js - the industry-standard framework for production React apps. You have:

✅ SEO-friendly product pages
✅ Fast, optimized performance  
✅ Easy deployment to Vercel
✅ Foundation for mobile app
✅ Scalable architecture

**Next:** Deploy to Vercel, add your API keys, and start adding real products!

Good luck! 🚀
