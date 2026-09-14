# Nguyen Tan Huy Portfolio

Personal portfolio built with React, vinext, and Cloudflare Workers.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local URL printed in the terminal.

## Update the resume

Replace `public/huy-cv.pdf` with the latest CV and keep the same filename. The
Resume section reads this PDF directly, so no resume content needs to be changed
in the source code.

## Build and deploy

```bash
npm run build
npx wrangler deploy --config dist/server/wrangler.json --name huy-portfolio
```

For automatic Cloudflare deployment from GitHub, use:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy --config dist/server/wrangler.json --name huy-portfolio`
- Production branch: `main`

The main portfolio content is in `app/PortfolioClient.tsx`, resume rendering is
in `app/Resume.tsx`, and site styles are in `app/globals.css`.
