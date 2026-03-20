# 🚀 Fix untuk Error Vercel: "Cannot read properties of undefined (reading 'addEventListener')"

## Masalah
Error terjadi karena kode mencoba mengakses `window` atau `document` saat server-side rendering (SSR) di Vercel.

## Perbaikan yang Dilakukan

### 1. **plugins/error-handler.ts**
✅ Menambahkan pengecekan `process.client` sebelum mengakses `window`

### 2. **plugins/security.ts**
✅ Menambahkan pengecekan `process.client` sebelum mengakses `window`
✅ Menghapus nested `if (process.env.NODE_ENV === 'production')` di dalam `process.client`

### 3. **composables/useSecurity.ts**
✅ Fungsi `sanitizeHTML` sekarang aman untuk SSR
✅ Server-side: menggunakan regex untuk sanitization
✅ Client-side: menggunakan DOM untuk sanitization

### 4. **app.vue**
✅ Menambahkan pengecekan `process.client` di `onMounted`
✅ Menggunakan `await` untuk `initAuth()` dan `loadCart()`

### 5. **nuxt.config.ts**
✅ Menambahkan `ssr: true` untuk memastikan SSR aktif

## Cara Redeploy di Vercel

### Opsi 1: Automatic Deployment (Recommended)
```bash
git add .
git commit -m "fix: SSR compatibility for Vercel"
git push origin main
```
Vercel akan otomatis deploy.

### Opsi 2: Manual Redeploy dari Vercel Dashboard
1. Buka [vercel.com/dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Klik "Deploy" di deployment terbaru
4. Pilih "Redeploy"

### Opsi 3: Via Vercel CLI
```bash
vercel --prod
```

## Testing Locally

### Build untuk Production
```bash
npm run build
npm run preview
```

### Check untuk SSR Issues
```bash
# Generate static files
npm run generate

# Atau build untuk Node.js server
npm run build
```

## Checklist Setelah Deploy

- [ ] Homepage bisa diakses tanpa error
- [ ] Login berfungsi
- [ ] Dashboard bisa diakses
- [ ] Upload produk berfungsi
- [ ] Checkout berfungsi
- [ ] WhatsApp redirect berfungsi

## Monitoring

### Check Logs di Vercel
1. Vercel Dashboard > Project > Deployments
2. Klik deployment terbaru
3. Lihat "Function Logs" untuk error

### Check Browser Console
1. Buka website di browser
2. Buka DevTools (F12)
3. Lihat Console untuk error

## Troubleshooting

### Error Masih Muncul
1. Clear build cache di Vercel:
   - Settings > Build & Development Settings > Build Cache > Delete
   
2. Force rebuild:
   ```bash
   git commit --allow-empty -m "force rebuild"
   git push
   ```

### 500 Error di Halaman Tertentu
- Check Function Logs di Vercel
- Pastikan tidak ada akses `window`/`document` tanpa `process.client`

## Files yang Diubah

1. `plugins/error-handler.ts` - SSR-safe error handling
2. `plugins/security.ts` - SSR-safe security monitoring
3. `composables/useSecurity.ts` - SSR-safe HTML sanitization
4. `app.vue` - SSR-safe initialization
5. `nuxt.config.ts` - Explicit SSR configuration

---

**Status:** ✅ Fixed
**Last Updated:** 2024
