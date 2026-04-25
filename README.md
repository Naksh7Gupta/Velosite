# Velosite

Velosite is an AI-assisted website builder that generates webpage code from prompts and now supports GitHub integration from the UI.

## Features

- Prompt-based website generation.
- Live preview and raw code view.
- Project history in sidebar.
- **GitHub OAuth connect flow**.
- **Create repository** from the app.
- **Push generated `index.html` and a `README.md`** to your GitHub repository.

## Requirements

- Node.js 20.9+ (recommended for Next.js 16)
- npm

## Environment Variables

Create a `.env.local` file:

```bash
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
```

> In your GitHub OAuth App settings, set the callback URL to:
>
> `http://localhost:3000/api/github/callback`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## GitHub flow in the app

1. Click **Connect with GitHub**.
2. Authorize repository access.
3. Enter a repository name.
4. Click **Create Repo**.
5. Generate website code, then click **Push to GitHub**.

The app commits:

- `README.md`
- `index.html`

## Notes

- GitHub access token is stored in an HTTP-only cookie.
- If token expires or is revoked, reconnect via the same button.
