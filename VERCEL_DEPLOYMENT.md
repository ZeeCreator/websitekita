# 🚀 Vercel Deployment Guide - WebsiteKita

## Prerequisites
- GitHub account
- Vercel account (free tier cukup)
- Node.js 18+ installed

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Pastikan semua perubahan ter-commit
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. **Login ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub account

2. **Add New Project**
   - Klik tombol "Add New Project"
   - Pilih "Import Git Repository"

3. **Import Repository**
   - Pilih repository GitHub Anda
   - Vercel akan auto-detect Nuxt 3

4. **Configure Project**
   - **Framework Preset:** Nuxt 3
   - **Build Command:** `npm run build`
   - **Output Directory:** `.output`
   - **Install Command:** `npm install`

5. **Add Environment Variables**
   
   Klik "Environment Variables" dan tambahkan:
   
   | Name | Value |
   |------|-------|
   | `NUXT_PUBLIC_POCKETBASE_URL` | `https://api.websitekita.biz.id/` |
   | `NODE_ENV` | `production` |

6. **Deploy**
   - Klik "Deploy"
   - Tunggu build selesai (~2-3 menit)

### 3. Post-Deployment

#### Check Deployment Logs
- Go to Vercel Dashboard > Project > Deployments
- Click pada deployment terbaru
- Lihat logs untuk memastikan tidak ada error

#### Test Your App
- Buka URL yang diberikan Vercel (e.g., `https://your-project.vercel.app`)
- Test semua fitur: login, upload produk, checkout, dll

### 4. Custom Domain (Optional)

1. **Add Domain di Vercel**
   - Go to Project Settings > Domains
   - Add your domain: `yourdomain.com`

2. **Update DNS Records**
   
   Tambahkan DNS records di domain provider Anda:
   
   | Type | Name | Value |
   |------|------|-------|
   | A | @ | `76.76.21.21` |
   | CNAME | www | `cname.vercel-dns.com` |

3. **Wait for DNS Propagation**
   - Bisa memakan waktu 5 menit - 48 jam
   - Check status di Vercel Domains page

## Automatic Deployments

✅ **Push to main branch** = Auto deploy to production
✅ **Pull requests** = Auto deploy to preview URL
✅ **Rollback** = One-click rollback ke deployment sebelumnya

## Environment Variables Management

### Development
```bash
# .env.local
NUXT_PUBLIC_POCKETBASE_URL=https://api.websitekita.biz.id/
```

### Production (Vercel)
Set via Vercel Dashboard:
- Settings > Environment Variables
- Atau via CLI: `vercel env add`

## Vercel CLI (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Troubleshooting

### Build Failed
1. Check build logs di Vercel Dashboard
2. Pastikan semua dependencies ada di `package.json`
3. Test build locally: `npm run build`

### Runtime Errors
1. Check Function logs di Vercel
2. Pastikan environment variables sudah set
3. Check PocketBase connection

### 404 Errors
1. Pastikan `vercel.json` ada di root
2. Check `.output` directory ada di `.gitignore`
3. Redeploy project

## Performance Tips

### 1. Enable Edge Caching
Vercel otomatis cache static assets di Edge Network

### 2. Optimize Images
```vue
<NuxtImg src="/image.jpg" format="webp" quality="80" />
```

### 3. Use Static Generation (Optional)
Untuk halaman yang tidak berubah sering:
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/']
    }
  }
})
```

## Monitoring

### Vercel Analytics
Enable di Project Settings > Analytics

### Vercel Speed Insights
Enable di Project Settings > Speed Insights

### Error Monitoring
Integrate dengan Sentry atau layanan monitoring lainnya

## Cost Estimation

**Free Tier (Hobby):**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ 100GB storage
- ✅ 1000 serverless function executions/day

**Pro Tier ($20/month):**
- ✅ Unlimited everything
- ✅ Priority support
- ✅ Custom domains unlimited

## Security Checklist

- [ ] Environment variables set correctly
- [ ] PocketBase URL is HTTPS
- [ ] No sensitive data in code
- [ ] CORS configured correctly
- [ ] Rate limiting enabled

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Nuxt 3 Deployment Guide](https://nuxt.com/docs/getting-started/deployment)
- [Vercel Discord](https://vercel.community/)

---

**Last Updated:** 2024
**Status:** ✅ Production Ready
