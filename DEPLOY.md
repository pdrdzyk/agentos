# Deploy & preview (one-time setup)

Goal: **you only look at a URL** — the agent commits and pushes; Vercel builds automatically.

## 1. Connect Vercel (once)

1. Open [vercel.com/new](https://vercel.com/new)
2. Import GitHub repo **`pdrdzyk/agentos`**
3. Framework: **Next.js** (defaults are fine)
4. Deploy

After this, every `git push` triggers a new deployment.

| Branch | What you open |
|--------|----------------|
| `main` | **Production** URL (Vercel → Project → Domains), e.g. `https://agentos-xxx.vercel.app` |
| `feature/*` | **Preview** URL per push (Vercel dashboard or GitHub commit status) |

Optional: Project Settings → Git → enable **Preview** for all branches.

## 2. Let Cursor agent push (once)

In **Terminal.app** (not only inside Cursor chat):

```bash
gh auth login -h github.com
gh auth setup-git
```

If push fails with “invalid token”:

```bash
gh auth refresh -h github.com -s repo
```

## 3. Your daily flow

1. Ask the agent to build a feature (or say **push**).
2. Agent runs build → commit → `git push`.
3. Open the Production or Preview link from the agent’s reply (wait ~1–3 min for Vercel).

Local instant preview (optional): `npm run dev` → http://localhost:3000

## 4. Environment variables (later)

When adding Supabase / Anthropic, set vars in **Vercel → Settings → Environment Variables** and in local `.env.local` (gitignored).
