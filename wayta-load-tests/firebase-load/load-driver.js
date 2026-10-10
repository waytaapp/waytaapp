import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const {
  TARGET_WRITES_PER_SEC = "50",
  DURATION_SECONDS = "120",
  COLLECTION = "load_test",
  FIRESTORE_EMULATOR_HOST,
  GCLOUD_PROJECT = "demo-project",
} = process.env;
const rate = parseInt(TARGET_WRITES_PER_SEC, 10);
const duration = parseInt(DURATION_SECONDS, 10);
if (!FIRESTORE_EMULATOR_HOST) {
  console.warn(
    "⚠  FIRESTORE_EMULATOR_HOST is not set. Refusing to run against a real\n" +
    "   Firebase project by default. Set it to the emulator, or explicitly\n" +
    "   opt in by setting ALLOW_CLOUD=1 (only for a test/staging project you own)."
  );
  if (process.env.ALLOW_CLOUD !== "1") process.exit(1);
}
const appOptions = { projectId: GCLOUD_PROJECT };
if (FIRESTORE_EMULATOR_HOST) {
  // Emulator mode must never pick up real credentials via ADC.
  delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
} else {
  appOptions.credential = applicationDefault();
}
initializeApp(appOptions);
const db = getFirestore();
let sent = 0;
let ok = 0;
let failed = 0;
const start = Date.now();
async function writeOne(i) {
  try {
    await db.collection(COLLECTION).add({
      i,
      ts: Date.now(),
      payload: "load-test-" + Math.random().toString(36).slice(2),
    });
    ok++;
  } catch (e) {
    failed++;
    if (failed <= 5) console.error("write error:", e.message);
  }
}
console.log(
  `Starting Firestore load: ~${rate} writes/sec for ${duration}s ` +
  `against ${FIRESTORE_EMULATOR_HOST ? "EMULATOR " + FIRESTORE_EMULATOR_HOST : "CLOUD project " + GCLOUD_PROJECT}`
);
const tick = setInterval(() => {
  const elapsed = (Date.now() - start) / 1000;
  if (elapsed >= duration) {
    clearInterval(tick);
    setTimeout(() => {
      console.log(
        `\nDone. sent=${sent} ok=${ok} failed=${failed} ` +
        `in ${elapsed.toFixed(1)}s (~${(ok / elapsed).toFixed(1)} writes/sec)`
      );
      process.exit(0);
    }, 2000);
    return;
  }
  for (let n = 0; n < rate; n++) {
    sent++;
    writeOne(sent);
  }
}, 1000);
