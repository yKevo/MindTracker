# MindTracker

This is a small React app for tracking mood and journaling.

Setup

1. Copy `.env` or set environment variables. By default development uses Firebase because `.env` contains `REACT_APP_USE_FIREBASE=true`.
2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm start
```

GitHub

This repository is intended to be pushed to https://github.com/yKevo/MindTracker.git

Notes

- Ensure `src/firebase.js` has your Firebase config and Email/Password sign-in is enabled in the Firebase console.
- `.env` is intentionally ignored; do not commit secrets.

Security

- Local environment files (`.env`, `.env.local`, etc.) are ignored via `.gitignore` (`.env*`). Do not commit secrets.
- If you accidentally committed secrets, purge them from history and rotate any credentials.
