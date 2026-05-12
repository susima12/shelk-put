
-- ============= BASE FESTIVAL SCHEMA =============
create type public.app_role as enum ('admin', 'user');
create type public.application_status as enum ('new','reviewing','approved','rejected');

create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_description text,
  description text,
  display_order int not null default 0,
  accepting_applications boolean not null default true,
  cover_url text,
  age_categories text[] not null default '{}',
  nominations text[] not null default '{}',
  created_at timestamptz not null default now()
);
alter table public.competitions enable row level security;
create policy "competitions readable by all" on public.competitions for select using (true);

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles readable by authenticated" on public.profiles for select to authenticated using (true);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = user_id);
create policy "own profile update" on public.profiles for update using (auth.uid() = user_id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  competition_id uuid references public.competitions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, role, competition_id)
);
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin_of(_user_id uuid, _competition uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = 'admin' and competition_id = _competition)
$$;

create or replace function public.admin_competition(_user_id uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select competition_id from public.user_roles where user_id = _user_id and role = 'admin' limit 1
$$;

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  leader_full_name text not null,
  email text not null,
  phone text not null,
  country text, city text, organization text,
  participant_name text not null,
  age_category text, nomination text, performance_title text,
  duration_minutes numeric, participants_count int,
  video_url text, notes text,
  attachment_path text, payment_receipt_path text,
  status application_status not null default 'new',
  admin_notes text, invite_link text,
  created_at timestamptz not null default now()
);
alter table public.applications enable row level security;
create policy "anyone can insert applications" on public.applications for insert with check (true);
create policy "owner reads own application" on public.applications for select using (auth.uid() is not null and user_id = auth.uid());
create policy "admin reads own competition applications" on public.applications for select using (public.is_admin_of(auth.uid(), competition_id));
create policy "admin updates own competition applications" on public.applications for update using (public.is_admin_of(auth.uid(), competition_id));

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null, excerpt text, body text,
  published_at timestamptz not null default now(), cover_url text
);
alter table public.news enable row level security;
create policy "news readable" on public.news for select using (true);

create table public.jury_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null, title text, bio text, photo_url text,
  display_order int not null default 0
);
alter table public.jury_members enable row level security;
create policy "jury readable" on public.jury_members for select using (true);

-- ============= LEGACY COMPETITION CHAT =============
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text, content text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.chat_messages enable row level security;

create table public.chat_members (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text, banned boolean not null default false,
  joined_at timestamptz not null default now(),
  unique (competition_id, user_id)
);
alter table public.chat_members enable row level security;

create or replace function public.is_chat_member(_user_id uuid, _competition uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.chat_members where user_id = _user_id and competition_id = _competition and banned = false)
$$;

create policy "members read messages of their competition" on public.chat_messages for select using (public.is_chat_member(auth.uid(), competition_id) or public.is_admin_of(auth.uid(), competition_id));
create policy "members post messages" on public.chat_messages for insert with check (auth.uid() = user_id and (public.is_chat_member(auth.uid(), competition_id) or public.is_admin_of(auth.uid(), competition_id)));
create policy "admin deletes messages" on public.chat_messages for delete using (public.is_admin_of(auth.uid(), competition_id));
create policy "user joins chat" on public.chat_members for insert with check (auth.uid() = user_id);
create policy "admin invites members" on public.chat_members for insert with check (public.is_admin_of(auth.uid(), competition_id));
create policy "members read members" on public.chat_members for select using (public.is_chat_member(auth.uid(), competition_id) or public.is_admin_of(auth.uid(), competition_id) or auth.uid() = user_id);
create policy "admin updates members" on public.chat_members for update using (public.is_admin_of(auth.uid(), competition_id));
create policy "admin deletes members" on public.chat_members for delete using (public.is_admin_of(auth.uid(), competition_id));

-- ============= DIRECT MESSENGER =============
create table public.dm_conversations (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references auth.users(id) on delete cascade,
  user_b uuid not null references auth.users(id) on delete cascade,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint dm_users_ordered check (user_a < user_b),
  unique (user_a, user_b)
);
alter table public.dm_conversations enable row level security;

-- Permissive: any authenticated user can DM any other authenticated user
create or replace function public.can_dm(_from uuid, _to uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select _from is not null and _to is not null and _from <> _to
$$;

create policy "dm participant reads conv" on public.dm_conversations for select using (auth.uid() = user_a or auth.uid() = user_b);
create policy "dm create if allowed" on public.dm_conversations for insert with check ((auth.uid() = user_a or auth.uid() = user_b) and public.can_dm(auth.uid(), case when auth.uid() = user_a then user_b else user_a end));
create policy "dm participant updates" on public.dm_conversations for update using (auth.uid() = user_a or auth.uid() = user_b);

create table public.dm_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.dm_conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  reply_to uuid references public.dm_messages(id) on delete set null,
  edited_at timestamptz, deleted_at timestamptz, pinned_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.dm_messages enable row level security;

create or replace function public.is_dm_participant(_user uuid, _conv uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.dm_conversations where id = _conv and (user_a = _user or user_b = _user))
$$;

create policy "dm read messages" on public.dm_messages for select using (public.is_dm_participant(auth.uid(), conversation_id));
create policy "dm send messages" on public.dm_messages for insert with check (auth.uid() = sender_id and public.is_dm_participant(auth.uid(), conversation_id));
create policy "dm sender edits" on public.dm_messages for update using (auth.uid() = sender_id);
create policy "dm sender deletes" on public.dm_messages for delete using (auth.uid() = sender_id);

create or replace function public.bump_conversation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.dm_conversations set last_message_at = now() where id = new.conversation_id;
  return new;
end; $$;
create trigger dm_messages_bump after insert on public.dm_messages for each row execute function public.bump_conversation();

alter publication supabase_realtime add table public.chat_messages;
alter publication supabase_realtime add table public.chat_members;
alter publication supabase_realtime add table public.applications;
alter publication supabase_realtime add table public.dm_messages;
alter publication supabase_realtime add table public.dm_conversations;

insert into storage.buckets (id, name, public) values ('applications', 'applications', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;

create policy "anyone uploads applications" on storage.objects for insert with check (bucket_id = 'applications');
create policy "auth read applications" on storage.objects for select using (bucket_id = 'applications' and auth.role() = 'authenticated');
create policy "avatars public read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars own upload" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars own update" on storage.objects for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "avatars own delete" on storage.objects for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare base_username text;
begin
  base_username := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)), '[^a-z0-9_]', '', 'g'));
  if base_username is null or length(base_username) < 3 then base_username := 'user_' || substr(new.id::text, 1, 8); end if;
  while exists (select 1 from public.profiles where username = base_username) loop
    base_username := base_username || substr(md5(random()::text), 1, 4);
  end loop;
  insert into public.profiles (user_id, email, display_name, username)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', new.email), base_username);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

insert into public.competitions (slug, name, short_description, display_order, age_categories, nominations) values
  ('vokal','Вокал','Сольное и ансамблевое вокальное исполнение',1, ARRAY['до 6 лет','7–9 лет','10–12 лет','13–15 лет','16–18 лет','19–25 лет','смешанная'], ARRAY['Эстрадный вокал','Народный вокал','Академический вокал','Джазовый вокал','Соло','Ансамбль','Хор']),
  ('horeograph','Хореография','Все направления танцевального искусства',2, ARRAY['до 6 лет','7–9 лет','10–12 лет','13–15 лет','16–18 лет','19–25 лет','смешанная'], ARRAY['Народный танец','Классический танец','Современный танец','Эстрадный танец','Бальный танец']),
  ('instrument','Инструментальное искусство','Сольное и ансамблевое исполнительство',3, ARRAY['до 9 лет','10–12 лет','13–15 лет','16–18 лет','19–25 лет','смешанная'], ARRAY['Фортепиано','Струнные','Духовые','Ударные','Народные инструменты','Ансамбль','Оркестр']),
  ('teatr','Театральное искусство','Театральные коллективы и моноспектакли',4, ARRAY['7–9 лет','10–12 лет','13–15 лет','16–18 лет','19–25 лет'], ARRAY['Драматический спектакль','Музыкальный театр','Кукольный театр']),
  ('izo','Изобразительное искусство','Живопись, графика, скульптура',5, ARRAY['до 6 лет','7–9 лет','10–12 лет','13–15 лет','16–18 лет','19–25 лет'], ARRAY['Живопись','Графика','Скульптура','ДПИ','Народные промыслы']),
  ('design','Дизайн и мода','Дизайн костюма, графический дизайн',6, ARRAY['10–12 лет','13–15 лет','16–18 лет','19–25 лет'], ARRAY['Авторская коллекция','Костюм','Аксессуары','Эскиз']),
  ('photo','Фото и видео','Фотография, видеоарт, короткометражки',7, ARRAY['10–12 лет','13–15 лет','16–18 лет','19–25 лет'], ARRAY['Художественная фотография','Репортаж','Портрет','Видеоролик']),
  ('zhanr','Оригинальный жанр','Цирковое искусство, иллюзион, эстрада',8, ARRAY['7–9 лет','10–12 лет','13–15 лет','16–18 лет','19–25 лет'], ARRAY['Цирк','Эквилибр','Пластика','Жонглирование','Иллюзия','Пантомима']),
  ('slovo','Художественное слово','Поэзия, проза, авторское чтение',9, ARRAY['7–9 лет','10–12 лет','13–15 лет','16–18 лет','19–25 лет'], ARRAY['Поэзия','Проза','Авторское произведение','Сказ']),
  ('pedagog','Конкурс педагогов и руководителей','Методические работы, мастер-классы',10, ARRAY['педагоги','руководители коллективов'], ARRAY['Методическая разработка','Открытый урок','Авторская программа'])
on conflict (slug) do nothing;
