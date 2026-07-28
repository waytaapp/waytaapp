# Wayta Load Tests
Two independent, first-party-only load tests:
1. **Artillery** — HTTP load against our own origin server.
2. **Firebase** — Firestore write load against the LOCAL emulator (default),
   or a test/staging Firebase project we own (explicit opt-in).
## Safety / scope
- Targets ONLY infrastructure we own: our origin + our own Firebase project/emulator.
- Does NOT drive load at third-party services (production Firebase Auth/Firestore
  belonging to others, Google Fonts, Unsplash, etc.).
- The Artillery Cloud API key is NOT stored in this repo. Paste it at run time.
## 1. Artillery
    npm install -g artillery
    cd artillery
    # Optional dry run (no cloud recording):
    artillery run test.yml
    # Full run with live dashboard streaming (paste YOUR key):
    artillery run test.yml --record --key <YOUR_ARTILLERY_CLOUD_KEY>
Ramps 0→50 req/sec over 120s against https://wayta-throughput-engine-rbac-v3.ai.studio.
## 2. Firebase (emulator — safe default)
    # Install Firebase CLI once: npm install -g firebase-tools
    firebase emulators:start --only firestore,auth   # in a separate terminal
    cd firebase-load
    cp .env.example .env        # keep emulator hosts set
    npm install
    set -a && source .env && set +a
    npm run load
Drives ~50 Firestore writes/sec for 120s at the local emulator (no cloud traffic, no quota cost).
### Concurrent Auth sign-ins (emulator only)
    # With the auth emulator running (see above):
    cd firebase-load
    FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
      AUTH_SIGNINS_TARGET=50 AUTH_DURATION_SECONDS=20 npm run load:auth
Pre-creates N emulator users, then signs them in (password sign-in via the
emulator's Identity Toolkit REST endpoint) spread across the duration.
Emulator-only by design — it refuses to run without `FIREBASE_AUTH_EMULATOR_HOST`.
## 3. Firebase (real test/staging project we own — optional)
Only against a project WE control. Firestore has per-second limits and a documented
ramp-up rule (increase ~50% every 5 min; avoid jumping straight to peak).
    # Authenticate with OUR own credentials first (done by you, not automated):
    #   gcloud auth application-default login
    unset FIRESTORE_EMULATOR_HOST FIREBASE_AUTH_EMULATOR_HOST
    export GCLOUD_PROJECT=<our-test-project-id>
    export ALLOW_CLOUD=1
    npm run load
Watch usage in the Google Cloud Console (Firestore + quotas) while it runs.
