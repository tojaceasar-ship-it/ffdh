# Rewir 2.0 · AI Scene System

This document describes how the Rewir 2.0 emotional storytelling system works after the final build cycle.

---

## 1. Data Sources

| Source | Purpose |
|--------|---------|
| **Supabase** (`scenes`, `scene_reactions`, `feedback_logs`) | Primary storage for curated scenes, reaction counts, and feedback transcripts. |
| **Sanity CMS** (`scene` schema) | Editorial content that can be synchronised into Supabase via `/api/scenes/index`. |
| **`content/auto_scenes.json`** | Offline/autonomous scene seed data. Loaded when Supabase is unavailable. |
| **Local emotion map** (`config/emotionMap.json`) | Stores colour palettes, emoji bursts, and fallback AI responses for each mood. |

Scenes returned to the client are the union of Supabase records and the auto scene seed file (deduplicated by slug).

---

## 2. API Surface

| Endpoint | Description |
|----------|-------------|
| `GET /api/scenes/index` | Lists scenes from Supabase. Accepts `limit`, `offset`, `emotionTags`, and `slug`. |
| `POST /api/scenes/index` | Sync trigger used by tooling to push Sanity scenes into Supabase. |
| `POST /api/rewir/generate` | Generates a new scene on demand. Uses OpenAI when `OPENAI_API_KEY` is set, otherwise crafts copy using the emotion map. Returns narrative, dominant emotion, and default reaction summary. |
| `POST /api/comments` | Stores user comments. Moderates via OpenAI if available, otherwise defaults to safe approvals. Updates `scene.comment_count` via Supabase RPC. |
| `POST /api/ai-reply` | Generates a short poetic response for the AI feedback box. Falls back to emotion-map phrases when OpenAI is unavailable. |

All endpoints return structured JSON, are typed with Zod, and gracefully degrade when third-party APIs are missing.

---

## 3. Client Experience

- **`app/rewir/page.tsx`**
  - Fetches scenes via `fetchEmotionScenes()` (`src/services/rewirService.ts`).
  - Applies filters and map view toggles with Framer Motion transitions.
  - Uses `useEmotionProfile()` to personalise colour gradients, emoji bursts, and nickname displays. Profile is persisted in `localStorage`.
  - Reaction buttons call `submitReaction()`, updating Supabase when configured or local storage otherwise.

- **`app/rewir/[slug]/page.tsx`**
  - Fetches a single scene with `fetchSceneBySlug()`.
  - Subscribes to reaction updates (`onReactionUpdate`) and local comment bus (`emitLocalComment` / `onSceneComment`).
  - Renders `AIReplyBox` which posts comments, requests AI replies, logs to Supabase, and emits local comment events for immediate UI feedback.

- **Personalisation** (`src/hooks/useEmotionProfile.ts`)
  - Stores `{ mood, nickname, lastSceneSlug, emotionHistory }`.
  - Exposes theme data derived from `config/emotions.ts` (colour gradients, accent hex, emoji burst, fallback responses).

---

## 4. Storage & Realtime

Supabase migrations in `supabase/migrations/004_scene_reactions_feedback.sql` create:

- `scene_reactions` table + `scene_reaction_summary` view for fast aggregation.
- `feedback_logs` table for AI feedback transcripts.
- RLS policies allow anonymous inserts while protecting reads (feedback logs readable by authenticated users only).

When Supabase credentials are absent, reactions and feedback logs are stored in `localStorage` and replayed via `CustomEvent` so the UI continues to update.

---

## 5. Fallback Strategy

| Dependency Missing | Fallback |
|--------------------|----------|
| OpenAI | Pre-authored responses from `emotionMap.json`. |
| Supabase | Data sourced from `content/auto_scenes.json`; reactions and feedback stored locally. |
| Stripe | `/api/checkout` returns a mock session with `mock: true`, allowing the flow to proceed. |

All fallbacks surface console warnings so operators can spot degraded environments quickly.

---

## 6. Extending the System

1. Add new emotions by updating `config/emotionMap.json` and re-exporting themes in `src/config/emotions.ts`.
2. To ingest additional CMS content, extend `sanity/schemaTypes` and the sync logic in `src/services/sceneIndexer.ts`.
3. Real-time Supabase channels can be enabled for comments by adding a dedicated table column (`scene_slug`) and adjusting `onSceneComment` in `rewirService`.

---

Questions? Ping the FFDH engineering crew.🍉

