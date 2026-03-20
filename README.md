# WebsiteKita Clone - Link-in-Bio Marketplace

Platform link-in-bio seperti WebsiteKita untuk creator menjual produk digital dan berbagi link sosial media.

## 🚀 Tech Stack

- **Frontend**: Nuxt 3 (Vue 3 + Composition API)
- **Backend**: PocketBase
- **Styling**: TailwindCSS
- **State Management**: Pinia
- **API Base URL**: https://api.websitekita.biz.id/

## ✨ Features

### Untuk Creator
- ✅ **Link-in-Bio Page** - Satu halaman profil dengan semua produk & link
- ✅ **Produk Digital** - Jual ebook, course, preset, template, dll
- ✅ **Social Media Links** - Instagram, TikTok, Twitter, YouTube, Telegram
- ✅ **WhatsApp Checkout** - Pembeli order langsung via WhatsApp
- ✅ **Custom Username** - URL: `yoursite.com/@username`
- ✅ **Profile Customization** - Avatar, banner, bio

### Untuk Pembeli
- ✅ Browse produk dari berbagai creator
- ✅ Lihat detail produk
- ✅ Order langsung via WhatsApp
- ✅ Tidak perlu login untuk browsing

## 📋 Setup

### 1. Install Dependencies

```bash
cd marketplace-frontend
npm install
```

### 2. Setup PocketBase

```bash
# Download PocketBase
https://github.com/pocketbase/pocketbase/releases

# Extract dan jalankan
./pocketbase serve

# Atau gunakan API yang sudah ada
# https://api.websitekita.biz.id/
```

### 3. Buat Collections Manual

Buka PocketBase Admin: `http://127.0.0.1:8090/_/`

#### Collection 1: `users` (Auth)
Fields:
- `name` (Text, required)
- `username` (Text, required, unique, pattern: `^[a-zA-Z0-9._]+$`)
- `email` (Email, auto)
- `password` (Password, auto)
- `bio` (Text, optional)
- `avatar` (File, optional)
- `banner` (File, optional)
- `whatsapp` (Text, optional)
- `instagram` (URL, optional)
- `tiktok` (URL, optional)
- `twitter` (URL, optional)
- `youtube` (URL, optional)
- `telegram` (Text, optional)
- `role` (Select: admin, creator)

#### Collection 2: `products` (Base)
Fields:
- `creator_id` (Relation → users, required)
- `title` (Text, required)
- `slug` (Text, required)
- `description` (Text, optional)
- `price` (Number, required)
- `original_price` (Number, optional)
- `thumbnail` (File, optional)
- `images` (File multiple, optional)
- `file_url` (URL, optional)
- `product_type` (Select: digital, physical, service, course, ebook, preset, template)
- `stock` (Number, optional)
- `is_featured` (Bool, optional)
- `order_count` (Number, optional)

#### Collection 3: `links` (Base)
Fields:
- `creator_id` (Relation → users, required)
- `title` (Text, required)
- `url` (URL, required)
- `icon` (Text, optional)
- `order` (Number, optional)
- `is_active` (Bool, optional)

#### Collection 4: `orders` (Base)
Fields:
- `creator_id` (Relation → users, required)
- `product_id` (Relation → products, required)
- `buyer_name` (Text, required)
- `buyer_email` (Email, optional)
- `buyer_whatsapp` (Text, optional)
- `price` (Number, required)
- `note` (Text, optional)
- `status` (Select: pending, paid, delivered, completed, cancelled, refunded)
- `payment_proof` (File, optional)

### 4. Run Development Server

```bash
npm run dev
```

Aplikasi berjalan di: http://localhost:3000

## 📁 Project Structure

```
marketplace-frontend/
├── pages/
│   ├── index.vue              # Homepage (landing + featured creators)
│   ├── login.vue              # Login page
│   ├── register.vue           # Register & create page
│   ├── dashboard.vue          # Creator dashboard
│   ├── @username.vue          # Link-in-bio page (dynamic)
│   └── profile.vue            # Profile settings
├── components/
│   ├── ProductCard.vue        # Product card component
│   └── StoreCard.vue          # Creator card component
├── composables/
│   ├── useAuth.ts             # Auth composable
│   ├── useWhatsApp.ts         # WhatsApp checkout
│   └── useFormat.ts           # Format utilities
├── stores/
│   └── auth.ts                # Pinia auth store
├── plugins/
│   └── pocketbase.ts          # PocketBase client
└── types/
    └── index.ts               # TypeScript interfaces
```

## 🌐 Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage - landing page + featured creators |
| `/login` | Login page |
| `/register` | Register & create new page |
| `/dashboard` | Creator dashboard (manage products & links) |
| `/@username` | Link-in-bio page for creator |
| `/profile` | Profile settings |

## 🎨 URL Format

- Creator page: `yoursite.com/@username`
- Example: `yoursite.com/@jane`

## 💰 Product Types

- **digital** - Produk digital umum
- **ebook** - Buku digital (PDF, ePub)
- **course** - Online course
- **preset** - Lightroom presets, LUTs
- **template** - Notion, Canva, Figma templates
- **physical** - Produk fisik
- **service** - Jasa/layanan

## 🔐 User Roles

- **admin** - Full access
- **creator** - Can create products & links

## 📱 WhatsApp Checkout Format

Ketika pembeli klik "Buy Now", akan redirect ke WhatsApp dengan format:

```
Hi, I want to buy:

Product: [Product Title]
Price: Rp [Price]

Please process my order. Thank you!
```

## 🎯 Usage Flow

### Untuk Creator:
1. Register dengan username unik
2. Lengkapi profil (bio, avatar, banner, social links)
3. Tambah produk di Dashboard
4. Tambah link eksternal (opsional)
5. Share URL: `yoursite.com/@username`

### Untuk Pembeli:
1. Buka link creator: `yoursite.com/@username`
2. Browse produk
3. Klik produk untuk detail
4. Klik "Buy Now" → WhatsApp creator
5. Deal langsung via chat

## 🔧 Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 📊 Database Schema

```
users (auth)
├── name
├── username (unique)
├── email
├── password
├── bio
├── avatar (file)
├── banner (file)
├── whatsapp
├── instagram (url)
├── tiktok (url)
├── twitter (url)
├── youtube (url)
├── telegram
└── role (admin, creator)

products
├── creator_id → users
├── title
├── slug
├── description
├── price
├── original_price
├── thumbnail (file)
├── images (file[])
├── file_url
├── product_type
├── stock
├── is_featured
└── order_count

links
├── creator_id → users
├── title
├── url
├── icon
├── order
└── is_active

orders
├── creator_id → users
├── product_id → products
├── buyer_name
├── buyer_email
├── buyer_whatsapp
├── price
├── note
├── status
└── payment_proof (file)
```

## 🎨 UI Design

- Gradient colors: Purple → Pink → Orange
- Rounded corners (rounded-2xl)
- Shadow effects
- Clean, modern aesthetic
- Mobile-first responsive

## 📝 Demo Accounts

Create via register page:
- Username: unique username
- Role: creator (auto)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Upload .output directory
```

### Backend (VPS)
```bash
# Run PocketBase on VPS
./pocketbase serve --http=0.0.0.0:8090
```

## 📄 License

MIT License

## 🤝 Support

Untuk pertanyaan atau issue, silakan buat issue di repository.
