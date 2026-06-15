# Pixoft Website

Source code platform for the Pixoft SwiftUI tutorial channel. Built with Next.js, TypeScript and Tailwind CSS.

## Pages

- `/` — Home, hero + featured tutorials
- `/tutorials` — All tutorials with search and filters
- `/tutorials/[slug]` — Tutorial detail (video embed, description, what you'll learn, requirements, download, file structure)
- `/about` — About the channel

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a new tutorial

Edit [`data/tutorials.ts`](data/tutorials.ts) and add a new entry to the `tutorials` array following the `Tutorial` type. Add a thumbnail image to `public/thumbnails/`.

## Deploying

### 1. Push to GitHub

```bash
gh auth login            # if not already logged in
gh repo create pixoft-web --source=. --public --push
```

Or manually:

```bash
git remote add origin https://github.com/<your-username>/pixoft-web.git
git push -u origin main
```

### 2. Deploy to Vercel

- Go to [vercel.com/new](https://vercel.com/new), import the GitHub repo, and deploy.
- Or via CLI:

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. Custom domain

In the Vercel project settings, add `pixoft.dev` as a domain and follow the DNS instructions.

### 4. Source code ZIPs

Upload tutorial source code ZIPs to GitHub Releases (e.g. a `pixoft/releases` repo) and reference the download URLs in `downloadUrl` fields in `data/tutorials.ts`.

### 5. YouTube description

For each new video, add:

```
📦 Source Code → https://pixoft.dev/tutorials/<slug>

🔗 Links
Website: https://pixoft.dev
GitHub: https://github.com/pixoft
```
