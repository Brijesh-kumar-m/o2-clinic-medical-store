
-- Create a table for global application settings
create table if not exists public.app_settings (
  id int primary key default 1 check (id = 1), -- Ensure only one row exists
  gst_rate numeric not null default 12.0,
  shipping_charge numeric not null default 150.0,
  free_shipping_threshold numeric not null default 5000.0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references auth.users(id)
);

-- Enable RLS
alter table public.app_settings enable row level security;

-- Create policies
-- Everyone can read settings
create policy "Allow public read access"
  on public.app_settings for select
  using (true);

-- Only admins can update settings
create policy "Allow admin update access"
  on public.app_settings for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Insert default settings if not exists
insert into public.app_settings (id, gst_rate, shipping_charge, free_shipping_threshold)
values (1, 12.0, 150.0, 5000.0)
on conflict (id) do nothing;
