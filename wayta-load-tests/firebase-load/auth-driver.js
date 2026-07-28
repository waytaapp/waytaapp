// Concurrent Auth sign-in load against the LOCAL Firebase Auth emulator ONLY.
// Uses the emulator's Identity Toolkit REST endpoints directly (the Admin SDK
// mints tokens but does not perform password sign-in, which is what we want to
// measure). No real Firebase Auth project is ever contacted.
const {
  AUTH_SIGNINS_TARGET = "50",
  AUTH_DURATION_SECONDS = "20",
  FIREBASE_AUTH_EMULATOR_HOST,
} = process.env;

if (!FIREBASE_AUTH_EMULATOR_HOST) {
  console.error(
    "Refusing to run: FIREBASE_AUTH_EMULATOR_HOST is not set. This driver is\n" +
    "emulator-only by design and will not sign in against a real Auth backend."
  );
  process.exit(1);
}

const target = parseInt(AUTH_SIGNINS_TARGET, 10);
const duration = parseInt(AUTH_DURATION_SECONDS, 10);
// Any string works as an API key against the emulator.
const base = `http://${FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1`;
const key = "fake-emulator-key";
const password = "Passw0rd!load";

async function signUp(email) {
  const res = await fetch(`${base}/accounts:signUp?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (!res.ok) throw new Error(`signUp ${res.status}: ${await res.text()}`);
}

async function signIn(email) {
  const res = await fetch(`${base}/accounts:signInWithPassword?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (!res.ok) throw new Error(`signIn ${res.status}: ${await res.text()}`);
  const body = await res.json();
  if (!body.idToken) throw new Error("signIn returned no idToken");
}

async function main() {
  console.log(
    `Auth sign-in load: ${target} sign-ins over ${duration}s ` +
    `(~${(target / duration).toFixed(2)}/sec) against EMULATOR ${FIREBASE_AUTH_EMULATOR_HOST}`
  );

  // Pre-create the accounts so we measure sign-in, not account creation.
  const emails = Array.from(
    { length: target },
    (_, i) => `load-${Date.now()}-${i}@example.com`
  );
  await Promise.all(emails.map(signUp));
  console.log(`Provisioned ${emails.length} emulator users.`);

  let ok = 0;
  let failed = 0;
  const start = Date.now();
  const intervalMs = (duration * 1000) / target;

  const inflight = emails.map(
    (email, i) =>
      new Promise((resolve) => {
        setTimeout(async () => {
          try {
            await signIn(email);
            ok++;
          } catch (e) {
            failed++;
            if (failed <= 5) console.error("sign-in error:", e.message);
          }
          resolve();
        }, Math.round(i * intervalMs));
      })
  );

  await Promise.all(inflight);
  const elapsed = (Date.now() - start) / 1000;
  console.log(
    `\nDone. sign-ins ok=${ok} failed=${failed} in ${elapsed.toFixed(1)}s ` +
    `(~${(ok / elapsed).toFixed(2)} sign-ins/sec)`
  );
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("fatal:", e.message);
  process.exit(1);
});
