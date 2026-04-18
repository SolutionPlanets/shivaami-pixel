-- Shivaami Pixel B2B — Supabase Schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query → Paste → Run

-- ─────────────────────────────────────────
-- 1. Profiles (extends Supabase auth.users)
-- ─────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company_name text,
  phone text,
  gst_number text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, company_name, phone)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────
-- 2. Products (reference / seed data)
-- ─────────────────────────────────────────
create table if not exists public.products (
  id serial primary key,
  slug text unique not null,
  name text not null,
  price_inr integer  -- null = contact for pricing
);

alter table public.products enable row level security;

create policy "Public read products"
  on public.products for select
  using (true);

-- Seed with the 4 Pixel models
insert into public.products (slug, name, price_inr) values
  ('pixel-10a',       'Google Pixel 10a',       null),
  ('pixel-10',        'Google Pixel 10',         null),
  ('pixel-10-pro',    'Google Pixel 10 Pro',     null),
  ('pixel-10-pro-max','Google Pixel 10 Pro Max', null)
on conflict (slug) do nothing;


-- ─────────────────────────────────────────
-- 3. Orders
-- ─────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  status text not null default 'pending',
    -- pending | confirmed | shipped | delivered | cancelled
  total_amount integer not null,  -- in paise (₹ × 100)
  razorpay_order_id text,
  razorpay_payment_id text,
  shipping_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);


-- ─────────────────────────────────────────
-- 4. Order Items
-- ─────────────────────────────────────────
create table if not exists public.order_items (
  id serial primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  color_name text,
  quantity integer not null default 1,
  unit_price integer not null  -- in paise
);

alter table public.order_items enable row level security;

create policy "Users view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where id = order_id and user_id = auth.uid()
    )
  );
