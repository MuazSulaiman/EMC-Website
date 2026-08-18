import { defineConfig, devices } from "@playwright/test";

/**
 * Section 4: Playwright for critical flows (nav, language switch, demo form
 * submit), axe-core for accessibility checks.
 *
 * Runs against a production build (`next build && next start`), not `next
 * dev` — this repo has a known `next dev` instability (see PROGRESS.md /
 * DECISIONS.md Phase 4): its Fast Refresh watcher fires unprompted rebuilds
 * that can swap out React component instances mid-interaction, which
 * intermittently swallowed nav-link clicks entirely during test runs.
 * `reuseExistingServer` still lets a manually-started `next start` be reused
 * so repeat local runs don't eat a ~20-30s rebuild each time.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // Kept low deliberately — this has run on a memory-constrained machine
  // where too many concurrent Chromium/Next.js processes caused flaky
  // navigation timing, not real bugs. Raise if CI has more headroom.
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    // Reveal/RevealGroup skip their fade/slide-up transition entirely under
    // reduced motion (see src/components/motion/reveal.tsx), so content is
    // in its final, settled state immediately — avoids axe or a click
    // catching an element mid-opacity-transition and misreading it.
    contextOptions: { reducedMotion: "reduce" },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000/en",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
