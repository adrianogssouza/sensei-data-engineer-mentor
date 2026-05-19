-- Enable RLS for the private single-user app tables.
--
-- Application data is accessed through protected Next.js API routes using the
-- Supabase service-role key on the server. No public anon/authenticated table
-- policies are created here.

alter table public.app_settings enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.usage_events enable row level security;
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;

alter function public.set_updated_at()
set search_path = public;

alter function public.match_document_chunks(extensions.vector, integer)
set search_path = public, extensions;
