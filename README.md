# Velosite

Velosite is an AI-assisted website builder that generates webpage code from prompts and can push the result to GitHub.

## Features

- Prompt-based website generation
- Live preview and raw code view
- Project history in the sidebar
- GitHub OAuth connect flow
- Create a repository from the app
- Push generated `index.html` and `README.md` to GitHub

## Requirements

- Node.js 20.9+
- npm
- A GitHub OAuth App for the publish flow
- A Hugging Face token for generation (`ai.py`)

## Environment variables

Copy `.env.example` to `.env.local`:

```bash
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
HUGGINGFACE_API_KEY=your_huggingface_token_here
```

GitHub OAuth callback:

`http://localhost:3000/api/github/callback`

## Run locally

```bash
git clone https://github.com/Naksh7Gupta/Velosite.git
cd Velosite
npm install
npm run dev
```

Open `http://localhost:3000`.

## GitHub flow

1. Click **Connect with GitHub**.
2. Authorize repository access.
3. Enter a repository name.
4. Click **Create Repo**.
5. Generate a site, then click **Push to GitHub**.

The app commits `README.md` and `index.html`.

The GitHub access token is stored in an HTTP-only cookie.

## License

MIT. See [LICENSE](LICENSE).
