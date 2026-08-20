#!/usr/bin/env node

const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const rate = Number(process.env.RATE || 10);
const duration = Number(process.env.DURATION || 10);
const endpoint = process.env.ENDPOINT || "/api/health";

if (!Number.isFinite(rate) || rate < 1 || rate > 1000 || !Number.isFinite(duration) || duration < 1 || duration > 300) {
  console.error("Use RATE=1..1000 and DURATION=1..300.");
  process.exit(1);
}

const total = rate * duration;
let completed = 0;
let failed = 0;
const started = Date.now();

async function hit() {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, { headers: { accept: "application/json" } });
    if (!response.ok) failed += 1;
  } catch {
    failed += 1;
  } finally {
    completed += 1;
  }
}

for (let second = 0; second < duration; second += 1) {
  await Promise.all(Array.from({ length: rate }, hit));
  console.log(`second ${second + 1}/${duration}: ${completed}/${total} complete`);
}

const elapsed = (Date.now() - started) / 1000;
console.log(JSON.stringify({ baseUrl, endpoint, requested: total, completed, failed, elapsedSeconds: elapsed, requestsPerSecond: completed / elapsed }, null, 2));
