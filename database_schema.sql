-- Cài đặt Extension cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Bảng Users (Nhân sự)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'EMPLOYEE', -- ADMIN, STAFF, EMPLOYEE
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Bảng Commission Rules (Cấu hình hoa hồng)
CREATE TABLE IF NOT EXISTS public.commission_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_type TEXT NOT NULL, -- STAFF, EMPLOYEE, AFFILIATE
    percentage NUMERIC NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bảng Templates (Mẫu giao diện)
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    tagline TEXT,
    base_price NUMERIC NOT NULL DEFAULT 0,
    component_key TEXT NOT NULL,
    thumbnail_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Bảng Affiliates (Đối tác tiếp thị - Nếu có sử dụng)
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    ref_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Bảng Orders (Đơn hàng)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    public_id TEXT UNIQUE NOT NULL,
    buyer_name TEXT,
    buyer_contact TEXT,
    recipient_name TEXT,
    amount NUMERIC NOT NULL,
    custom_data JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT', -- PENDING_PAYMENT, ACTIVE, RESPONDED, COMPLETED
    template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
    created_by_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Bảng Payments (Thanh toán)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_code TEXT UNIQUE NOT NULL,
    qr_code_url TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, FAILED
    paid_at TIMESTAMP WITH TIME ZONE,
    raw_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Bảng Commissions (Chi tiết Hoa hồng)
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    percentage NUMERIC NOT NULL,
    recipient_type TEXT NOT NULL, -- STAFF, EMPLOYEE, AFFILIATE
    status TEXT NOT NULL DEFAULT 'EARNED', -- PENDING, EARNED, PAID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Bảng System Logs (Nhật ký hệ thống)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- Bật RLS (Row Level Security) cho các bảng
-- (Bỏ qua nếu bạn đang không muốn cấu hình RLS nghiêm ngặt)
-- ==========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Tạo Policy cơ bản: Cho phép Service Role toàn quyền
CREATE POLICY "Enable all for service role" ON public.users FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON public.commission_rules FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON public.templates FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON public.orders FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON public.payments FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON public.commissions FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON public.system_logs FOR ALL USING (true);
CREATE POLICY "Enable all for service role" ON public.affiliates FOR ALL USING (true);

-- Insert dữ liệu mặc định (Nếu bảng đang trống)
INSERT INTO public.users (email, name, role) 
VALUES ('admin@yeuweb.vn', 'Admin YeuWeb', 'ADMIN') 
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.commission_rules (recipient_type, percentage, is_active)
VALUES 
    ('EMPLOYEE', 30, true),
    ('STAFF', 10, true),
    ('AFFILIATE', 15, true)
ON CONFLICT DO NOTHING;
