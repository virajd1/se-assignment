# SE Assessment Node.js Workspace

This repository is a starter workspace for the engineering assessment puzzle using Node.js.

## What it contains

- `src/config.js` — loads environment values safely.
- `src/client.js` — authenticated API client helper.
- `src/layer1.js` — dataset download and integrity helpers.
- `src/submit.js` — submission helper for assessment answers.
- `src/index.js` — runnable CLI for the main assessment flow.
- `tests/` — simple unit tests for local helpers.

## Setup

1. Install dependencies:

```bash
cd se-assessment
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your `BASE_URL` and `API_KEY`.

## Usage

### Check health

```bash
npm run health
```

### Discover endpoints

```bash
npm run discover
```

### Download dataset

```bash
npm run fetch
```

### Submit an answer

```bash
npm run submit -- --type layer1 --value "your-answer"
```

### Run the local Express server

```bash
npm run serve
```

Then open `http://localhost:3000` to view the local assessment helper page.

The server exposes local helper routes:
- `GET /` — local instructions page
- `GET /health` — forwards the assessment health probe
- `GET /discover` — shows configured API endpoints
- `GET /dataset` — downloads the dataset and returns a digest header
- `POST /submit` — forwards a submission payload to the assessment service

## Testing

Run unit tests with:

```bash
npm test
```

## Git repository guidance

1. Initialize git:

```bash
git init
git add .
git commit -m "Initialize SE assessment Node.js workspace"
```

2. Push to your repository:

```bash
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

> Do not commit your real `.env` file or your API key.
