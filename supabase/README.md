# Supabase Phase 1 and Phase 3 operations

## Migration

`migrations/20260803000100_create_profiles.sql` creates the private profile model, timestamps, auth-user trigger, grants, and Row Level Security policies.

`migrations/20260805000100_create_wardrobe_items.sql` creates authenticated wardrobe persistence,
website-import provenance, deterministic per-user duplicate enforcement, timestamps, grants, and
own-row `SELECT`, `INSERT`, `UPDATE`, and `DELETE` RLS policies.

Review the target project before applying migrations:

```powershell
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db diff --linked
npx supabase db push
```

The auth-user trigger is `security definer` with an empty `search_path`, uses only schema-qualified objects, accepts no profile metadata, and has direct execution revoked from public client roles. Test signup after applying it: a trigger error can block new auth users.

## Policy inspection

This query confirms RLS and lists the installed policies without exposing user data:

```sql
select
  c.relrowsecurity as rls_enabled,
  p.policyname,
  p.roles,
  p.cmd,
  p.qual,
  p.with_check
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policies p
  on p.schemaname = n.nspname
  and p.tablename = c.relname
where n.nspname = 'public'
and c.relname in ('profiles', 'wardrobe_items')
order by p.cmd;
```

Expected policies:

- authenticated `SELECT` with `(select auth.uid()) = id`;
- authenticated `INSERT` with the same ownership check;
- authenticated `UPDATE` with both `USING` and `WITH CHECK` ownership checks;
- no anonymous or unrestricted policy.

For `wardrobe_items`, expect authenticated own-row `SELECT`, `INSERT`, `UPDATE`, and `DELETE`
policies comparing `(select auth.uid())` with `user_id`, and no anonymous or unrestricted policy.

## Phase 3 Edge Function

Deploy the authenticated URL importer after reviewing its outbound-network controls:

```powershell
npx supabase functions deploy import-wardrobe-url
```

Keep JWT verification enabled. Hosted Supabase provides `SUPABASE_URL` and `SUPABASE_ANON_KEY` to
the function runtime; `SB_PUBLISHABLE_KEY` is also accepted. No service-role key is required. The
function validates the authenticated user, resolves public DNS, rejects local/private destinations
and unsafe redirects, bounds time/redirects/body size, accepts HTML only, and returns safe errors.

## Two-user RLS verification

Create two disposable Auth users through the application, complete both profiles, and record their UUIDs as `USER_A_UUID` and `USER_B_UUID`. Never use real customer accounts.

The Supabase SQL Editor normally runs with elevated privileges and can bypass RLS. To verify behavior there, explicitly switch the transaction to the authenticated role and simulate only the disposable User A JWT claims:

```sql
begin;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"USER_A_UUID","role":"authenticated"}',
  true
);

-- Sanity check: must return USER_A_UUID.
select auth.uid();

-- Own read: must return exactly User A's row.
select id, display_name, onboarding_completed
from public.profiles
where id = 'USER_A_UUID';

-- Cross-user read: must return zero rows.
select id, display_name, onboarding_completed
from public.profiles
where id = 'USER_B_UUID';

-- Cross-user update: must affect zero rows.
update public.profiles
set display_name = 'Blocked update'
where id = 'USER_B_UUID';

-- Cross-user insert: must fail the RLS WITH CHECK policy.
insert into public.profiles (id, display_name, onboarding_completed)
values ('USER_B_UUID', 'Blocked insert', true);

rollback;
```

Because the failing insert aborts the transaction, run it separately if you need to inspect earlier statements interactively. Repeat with User B claims and reversed IDs. Also verify from two real client sessions using only the publishable key; never use a service-role client for an RLS test.

## Dashboard configuration

- Authentication provider: Email enabled; social, phone, and anonymous providers remain out of scope.
- Redirect allow list: `mixandmatch://**`.
- Application callbacks: `mixandmatch://auth/verify-email` and `mixandmatch://auth/reset-password`.
- Email confirmation: enabled or disabled intentionally, then tested in both registration and sign-in behavior.
- SMTP/templates: configured for the target environment before delivery testing.

Do not place the service-role key in the Expo environment or application bundle.
