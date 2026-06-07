# Supabase setup

Run only this file in Supabase SQL Editor:

```sql
supabase/000_full_setup.sql
```

This file creates the full schema, financial tables, RBAC profile table, logs, payment tables, commission rules, RLS read policies, and the current production template:

- `Valentine #1`

It also unpublishes old seed templates so the catalog stays clean.

Auth users are not created by SQL. Create users in Supabase Dashboard -> Authentication, then use the commented profile attach example at the bottom of `000_full_setup.sql`.

## Banking / VietQR env

Add these variables to `.env`:

```env
BANK_CODE="VCB"
BANK_ACCOUNT_NO="YOUR_VCB_ACCOUNT_NUMBER"
BANK_ACCOUNT_NAME="TEN CHU TAI KHOAN"
BANK_WEBHOOK_SECRET="choose-a-long-random-secret"
```

Webhook endpoint for SePay/Casso/Banking provider:

```text
POST https://your-domain.com/api/webhooks/banking
Header: x-webhook-secret: BANK_WEBHOOK_SECRET
```

The transfer content must include the generated `payment_code`, for example `PAYABC123`. The webhook matches this code and exact amount before unlocking the gift link.
