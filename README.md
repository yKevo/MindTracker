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
 - Ensure `src/firebase.js` has your Firebase config and Email/Password sign-in is enabled in the Firebase console.
 - `.env` is intentionally ignored; do not commit secrets.

Environment

Create a local `.env` file (not checked into git) with your Firebase config. Example:

```
REACT_APP_USE_FIREBASE=true
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXX
```

The app will fallback to the embedded config if env vars are not set, but for security and production use you should set real project values in environment variables.
Security

- Local environment files (`.env`, `.env.local`, etc.) are ignored via `.gitignore` (`.env*`). Do not commit secrets.
- If you accidentally committed secrets, purge them from history and rotate any credentials.
