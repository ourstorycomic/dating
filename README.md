# Yeuweb - Thay loi muon noi

SaaS tao web qua tang tinh cam theo template. Khach xem mau tren landing page, nhan TikTok voi shop, nhan vien tao don trong dashboard, he thong sinh QR thanh toan, mo khoa chinh mau sau khi thanh toan va tao 2 link:

- Gift link: gui cho nguoi nhan.
- Track link: nguoi mua xem trang thai mo link, cau tra loi va ghi am phan hoi.

## Tech stack

- Next.js App Router
- Tailwind CSS
- Supabase/PostgreSQL
- NextAuth-style credential session
- Framer Motion

## Setup

1. Cai dependencies:

```bash
npm install
```

2. Tao file `.env` tu `.env.example` va dien Supabase keys, banking config.

3. Chay database SQL trong Supabase SQL Editor:

```text
supabase/FULL_DATABASE_SETUP.sql
```

4. Chay local:

```bash
npm run dev
```

Mo `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## GitHub note

Khong commit `.env`, `.next`, `node_modules` hay file build. Repo da co `.gitignore` va `.env.example` de deploy an toan.
