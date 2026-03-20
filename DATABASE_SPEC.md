# 📋 WebsiteKita Clone - Database Specifications

## 🗄️ Database Overview

Platform link-in-bio marketplace untuk creator menjual produk digital via WhatsApp.

---

## 📊 Collections Required (4 Collections)

### 1. **users** (Auth Collection)

| # | Field Name | Type | Required | Description |
|---|------------|------|----------|-------------|
| 1 | name | Text | ✅ | Nama lengkap creator |
| 2 | username | Text | ✅ | Username unik (@username) |
| 3 | email | Email | ✅ | Email login (PocketBase auth) |
| 4 | password | Password | ✅ | Password (PocketBase auth) |
| 5 | bio | Text | - | Bio singkat (max 500) |
| 6 | avatar | File | - | Foto profile |
| 7 | banner | File | - | Banner profile |
| 8 | whatsapp | Text | - | WhatsApp untuk checkout |
| 9 | instagram | URL | - | Link Instagram |
| 10 | tiktok | URL | - | Link TikTok |
| 11 | twitter | URL | - | Link Twitter |
| 12 | youtube | URL | - | Link YouTube |
| 13 | telegram | Text | - | Username Telegram |
| 14 | role | Select | ✅ | admin / creator |
| 15 | **checkout_fields** | **JSON** | - | **Custom fields config** |

---

### 2. **products** (Base Collection)

| # | Field Name | Type | Required | Description |
|---|------------|------|----------|-------------|
| 1 | creator_id | Relation | ✅ | ID creator |
| 2 | title | Text | ✅ | Judul produk |
| 3 | slug | Text | ✅ | URL slug |
| 4 | description | Text | - | Deskripsi |
| 5 | price | Number | ✅ | Harga |
| 6 | original_price | Number | - | Harga coret |
| 7 | thumbnail | File | - | Thumbnail |
| 8 | images | File | - | Gallery (max 10) |
| 9 | file_url | URL | - | Download link |
| 10 | product_type | Select | ✅ | digital/physical/service/course/ebook/preset/template |
| 11 | stock | Number | - | Stock |
| 12 | is_featured | Bool | - | Featured flag |
| 13 | order_count | Number | - | Total orders |

---

### 3. **links** (Base Collection)

| # | Field Name | Type | Required | Description |
|---|------------|------|----------|-------------|
| 1 | creator_id | Relation | ✅ | ID creator |
| 2 | title | Text | ✅ | Judul link |
| 3 | url | URL | ✅ | URL tujuan |
| 4 | icon | Text | - | Icon name |
| 5 | order | Number | - | Urutan |
| 6 | is_active | Bool | - | Status aktif |

---

### 4. **orders** (Base Collection) ⭐

| # | Field Name | Type | Required | Description |
|---|------------|------|----------|-------------|
| 1 | creator_id | Relation | ✅ | ID creator seller |
| 2 | product_id | Relation | ✅ | ID produk |
| 3 | **buyer_name** | **Text** | **✅** | **Nama pembeli (WAJIB)** |
| 4 | **custom_fields** | **JSON** | **-** | **SEMUA data buyer (email, wa, address, dll)** |
| 5 | price | Number | ✅ | Harga transaksi |
| 6 | note | Text | - | Catatan pembeli |
| 7 | status | Select | ✅ | pending/paid/delivered/completed/cancelled/refunded |

**REMOVED:**
- ❌ buyer_email (masuk ke custom_fields)
- ❌ buyer_whatsapp (masuk ke custom_fields)
- ❌ buyer_address (masuk ke custom_fields)

---

## 🎯 Custom Fields System

### users.checkout_fields (JSON)

Creator konfigurasi field yang mau diminta:

```json
{
  "fields": [
    {
      "name": "email",
      "label": "Email Address",
      "type": "email",
      "required": true,
      "placeholder": "your@email.com"
    },
    {
      "name": "whatsapp",
      "label": "WhatsApp Number",
      "type": "tel",
      "required": false,
      "placeholder": "081234567890"
    },
    {
      "name": "address",
      "label": "Shipping Address",
      "type": "textarea",
      "required": true,
      "placeholder": "Full address..."
    }
  ]
}
```

### orders.custom_fields

Data yang diisi buyer:

```json
{
  "email": "buyer@example.com",
  "whatsapp": "081234567890",
  "address": "Jl. Sudirman No. 123, Jakarta"
}
```

---

## 🔄 Order Status Flow

```
┌─────────┐     ┌─────────┐     ┌─────────────┐     ┌────────────┐
│ pending │────▶│  paid   │────▶│  delivered  │────▶│ completed  │
└─────────┘     └─────────┘     └─────────────┘     └────────────┘
     │                │
     ▼                ▼
┌─────────────┐  ┌────────────┐
│ cancelled   │  │  refunded  │
└─────────────┘  └────────────┘
```

| Status | Description |
|--------|-------------|
| `pending` | Order created |
| `paid` | Seller confirm payment received |
| `delivered` | Product delivered |
| `completed` | Transaction complete |
| `cancelled` | Order cancelled |
| `refunded` | Refund processed |

---

## 📱 WhatsApp Flow

### Generate Message

```javascript
function generateWhatsAppMessage(product, order, checkoutFields) {
  let message = `🛒 *ORDER BARU*\n\n`;
  message += `📦 *Product:* ${product.title}\n`;
  message += `💰 *Price:* Rp ${product.price}\n`;
  message += `👤 *Buyer:* ${order.buyer_name}\n`;
  
  // Add custom fields
  if (checkoutFields?.fields) {
    message += `\n📋 *Details:*\n`;
    checkoutFields.fields.forEach(field => {
      if (order.custom_fields[field.name]) {
        message += `• ${field.label}: ${order.custom_fields[field.name]}\n`;
      }
    });
  }
  
  if (order.note) {
    message += `\n📝 *Note:* ${order.note}`;
  }
  
  return message;
}
```

### Example Output

```
🛒 *ORDER BARU*

📦 *Product:* Lightroom Presets Bundle
💰 *Price:* Rp 149.000
👤 *Buyer:* John Doe

📋 *Details:*
• Email: john@example.com
• WhatsApp: 081234567890
• Address: Jl. Sudirman No. 123, Jakarta

📝 *Note:* Thanks!
```

---

## 📊 Summary

| Collection | Fields | Key Features |
|------------|--------|--------------|
| users | 15 | checkout_fields (JSON) |
| products | 13 | 7 product types |
| links | 6 | External links |
| orders | 7 | custom_fields only (no separate buyer fields) |

**Total:** 41 fields across 4 collections

---

## 🔐 API Rules

| Collection | Create | Update | Delete |
|------------|--------|--------|--------|
| users | Open | Owner | Owner (not admin) |
| products | Creator only | Creator only | Creator only |
| links | Creator only | Creator only | Creator only |
| orders | Open | Creator only | Creator only |

---

## 🚀 Setup Steps

1. **Import schema** ke PocketBase atau buat manual
2. **Creator register** → setup checkout_fields
3. **Add products** → ready to sell
4. **Buyer checkout** → WhatsApp message generated
5. **Seller update status** manually via dashboard
