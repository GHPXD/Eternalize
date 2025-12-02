# Firebase → Supabase Migration Complete ✅

## Migration Summary

A migração completa do Firebase para Supabase foi concluída com sucesso. O projeto agora usa Supabase Auth + PostgreSQL ao invés de Firebase Auth + Firestore.

## Changes Made

### 1. **Packages**
```bash
# Removed
firebase

# Added
@supabase/supabase-js
@supabase/ssr
```

### 2. **Directory Structure Changes**

**Deleted:**
- `lib/firebase/` (entire directory)
  - `config.ts` - Firebase initialization
  - `firestore.ts` - Firestore operations
  - `auth-context.tsx` - Firebase Auth provider

**Added:**
- `lib/supabase/`
  - `client.ts` - Browser client (singleton)
  - `server.ts` - Server client with cookie handling
  - `middleware.ts` - Session refresh logic
  - `database.ts` - PostgreSQL operations
  - `auth-context.tsx` - Supabase Auth provider
- `middleware.ts` (root) - **CRITICAL** for session management
- `types/supabase.ts` - Database type definitions
- `app/actions/memories.ts` - Server Actions wrapper
- `app/auth/callback/route.ts` - OAuth redirect handler

### 3. **Environment Variables**

**Before (.env.local):**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

**After (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. **Database Schema**

**Firestore (Before):**
```
Collection: memories
- Document fields: id, ownerId, slug, status, createdAt, content
```

**PostgreSQL (After):**
```sql
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL, -- DRAFT | PAID | ARCHIVED
  content JSONB NOT NULL, -- Flexible Memory content
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_memories_owner ON memories(owner_id);
CREATE INDEX idx_memories_slug ON memories(slug);
CREATE INDEX idx_memories_status ON memories(status);

-- RLS Policies
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memories"
  ON memories FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own memories"
  ON memories FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own memories"
  ON memories FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own memories"
  ON memories FOR DELETE
  USING (auth.uid() = owner_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_memories_updated_at
BEFORE UPDATE ON memories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 5. **Code Changes**

**Authentication:**
```typescript
// Before (Firebase)
import { useAuth } from '@/lib/firebase/auth-context';
const { user } = useAuth(); // user.uid

// After (Supabase)
import { useAuth } from '@/lib/supabase/auth-context';
const { user } = useAuth(); // user.uid
```

**Database Operations:**
```typescript
// Before (Firebase - Direct import in Client Components)
import { createMemory } from '@/lib/firebase/firestore';
await createMemory(data);

// After (Supabase - Server Actions)
import { createMemoryAction } from '@/app/actions/memories';
const { id, error } = await createMemoryAction(data);
```

**Server Components:**
```typescript
// NEW: Direct database access in Server Components
import { getMemoryById } from '@/lib/supabase/database';
const memory = await getMemoryById(id);
```

### 6. **Architecture Patterns**

**Client Components:**
- Use `@/lib/supabase/client` (browser client)
- Call Server Actions from `@/app/actions/memories`
- Use `useAuth()` hook for authentication state

**Server Components:**
- Use `@/lib/supabase/server` (server client with cookies)
- Direct database calls via `@/lib/supabase/database`
- No need for Server Actions

**Middleware:**
- `middleware.ts` at root is **CRITICAL**
- Refreshes session on every request
- Required for Server Components to access auth state

### 7. **OAuth Configuration**

**Google Sign-In:**
1. Supabase Dashboard → Authentication → Providers → Google
2. Add authorized redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
3. Configure OAuth consent screen in Google Cloud Console
4. Add callback route handler (already created):
   - `app/auth/callback/route.ts`

### 8. **Unchanged Components**

These components were **not affected** by the migration:
- ✅ Cloudflare R2 storage (`lib/r2/`)
- ✅ Media compression (`lib/media/`)
- ✅ Zustand store (`store/`)
- ✅ Hooks (`hooks/`)
- ✅ UI components (`components/ui/`)
- ✅ Constants & types (`lib/constants.ts`, `types/index.ts`)
- ✅ Error handling (`lib/errors.ts`)

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy URL and anon key from Settings → API

### 2. Run Database Schema
Execute the SQL schema above in Supabase SQL Editor

### 3. Configure Environment Variables
```bash
# Edit .env.local with your Supabase credentials
# O arquivo já existe no projeto
```

### 4. Configure Google OAuth (Optional)
1. Supabase Dashboard → Authentication → Providers → Google
2. Enable Google provider
3. Add OAuth credentials from Google Cloud Console
4. Add authorized redirect URI

### 5. Build & Run
```bash
npm install
npm run dev
```

## Migration Benefits

✅ **Better Type Safety:** PostgreSQL with strong schema
✅ **Performance:** Direct SQL queries vs NoSQL
✅ **RLS Security:** Row-level security built-in
✅ **Simpler Auth:** Unified auth with database
✅ **SSR-Ready:** Built for Next.js 14+ App Router
✅ **Cost-Effective:** Generous free tier
✅ **Realtime:** Built-in realtime subscriptions (optional)
✅ **Edge Functions:** Serverless functions included

## Breaking Changes

⚠️ **Data Migration Required:**
- Export Firebase Firestore data
- Transform to PostgreSQL schema
- Import via Supabase SQL or API

⚠️ **Auth Migration:**
- Users need to re-authenticate
- OR migrate auth users via Supabase CLI

⚠️ **API Changes:**
- All `createMemory` calls now async Server Actions
- Error handling changed (returns `{ error }` instead of throwing)

## Next Steps

1. **Deploy to Vercel/Netlify:**
   - Add Supabase env vars to hosting platform
   - Ensure middleware is deployed

2. **Data Migration:**
   - Export existing Firebase data
   - Transform and import to Supabase

3. **Auth Migration:**
   - Migrate existing users OR
   - Users re-authenticate with Google OAuth

4. **Testing:**
   - Test all CRUD operations
   - Test authentication flows
   - Test RLS policies

## Rollback Plan

If rollback is needed:
```bash
git revert <migration-commit>
npm install
# Restore .env.local with Firebase credentials
npm run dev
```

Note: Firebase directory was deleted. Restore from git history.

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Next.js + Supabase: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

---

**Migration completed on:** $(Get-Date -Format "yyyy-MM-dd")
**Build status:** ✅ TypeScript compilation successful
**Runtime status:** ⏳ Requires environment variables
