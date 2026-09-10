-- =========================================================
-- 雅思背单词工作台 · 用户进度表
-- 在 Supabase 的 SQL Editor 里整段运行一次即可
-- （gen_random_uuid() 无需额外扩展；表不存在时自动创建）
-- =========================================================

create table if not exists public.user_state (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users(id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

-- 行级安全：每个账号只能读写自己那一行（互相看不到对方进度）
drop policy if exists "user_state_select_own" on public.user_state;
create policy "user_state_select_own" on public.user_state
  for select using (auth.uid() = user_id);

drop policy if exists "user_state_insert_own" on public.user_state;
create policy "user_state_insert_own" on public.user_state
  for insert with check (auth.uid() = user_id);

drop policy if exists "user_state_update_own" on public.user_state;
create policy "user_state_update_own" on public.user_state
  for update using (auth.uid() = user_id);

-- 保险：确保 authenticated 角色可用（Supabase 新建表一般已默认授权）
grant select, insert, update on public.user_state to authenticated;

-- =========================================================
-- 每个账号自己的「计划」文档（英语专线 / 每日执行 / 日记）
-- 一行一篇文档；doc_id 用文档中文名（与 index.html 的 PLAN_DOCS 对应）
-- =========================================================

create table if not exists public.user_plan (
  user_id    uuid not null references auth.users(id) on delete cascade,
  doc_id     text not null,
  content    text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, doc_id)
);

alter table public.user_plan enable row level security;

-- 行级安全：每个账号只能读写自己的计划
drop policy if exists "user_plan_select_own" on public.user_plan;
create policy "user_plan_select_own" on public.user_plan
  for select using (auth.uid() = user_id);

drop policy if exists "user_plan_insert_own" on public.user_plan;
create policy "user_plan_insert_own" on public.user_plan
  for insert with check (auth.uid() = user_id);

drop policy if exists "user_plan_update_own" on public.user_plan;
create policy "user_plan_update_own" on public.user_plan
  for update using (auth.uid() = user_id);

grant select, insert, update on public.user_plan to authenticated;
