import http from "http";
import { execa } from "execa";
import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";

function check(path: string): Promise<number> {
  return new Promise((res) => {
    const r = http.get(`http://localhost:3000${path}`, (x) => res(x.statusCode ?? 0));
    r.on('error', () => res(0));
  });
}

async function ensureServer(): Promise<boolean> {
  console.log('TestBot: Checking if server is already running...');

  // Szybki health-check
  const alreadyRunning = await check('/api/health') === 200;
  if (alreadyRunning) {
    console.log('TestBot: Server is already running');
    return false; // Nie spawnowaliśmy nowego
  }

  console.log('TestBot: Starting Next.js server...');

  // Znajdź root repo
  let repoRoot = process.cwd();
  while (repoRoot && !require('fs').existsSync(require('path').join(repoRoot, 'pnpm-workspace.yaml'))) {
    const parent = require('path').dirname(repoRoot);
    if (parent === repoRoot) break;
    repoRoot = parent;
  }

  // Start prod serwera Next.js
  const childProcess = execa("pnpm", ["-C", "apps/web", "start"], {
    cwd: repoRoot,
    stdio: "inherit"
  });

  // Poczekaj na gotowość (max 20 sekund)
  for (let i = 0; i < 20; i++) {
    console.log(`TestBot: Waiting for server (${i + 1}/20)...`);
    if (await check('/api/health') === 200) {
      console.log('TestBot: Server is ready!');
      // Store child process globally for cleanup
      (global as any).testBotChild = childProcess;
      return true; // Spawnowaliśmy nowy serwer
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error("Server did not start in time");
}

export const TestBot: BotRegistration = {
  name: "TestBot",
  accepts: ["test.smoke"],
  concurrency: 1,
  async handler(task: TaskDefinition): Promise<TaskResult> {
    let spawned = false;

    try {
      console.log('TestBot: Starting smoke tests...');

      // Auto-start serwera jeśli nie działa
      spawned = await ensureServer();

      console.log('TestBot: Checking endpoints...');
      const home = await check('/');
      const health = await check('/api/health');
      console.log(`TestBot: Home status: ${home}, Health status: ${health}`);

      const ok = (home === 200 || home === 301 || home === 302) && health === 200;
      console.log(`TestBot: Smoke test result: ${ok ? 'PASS' : 'FAIL'}`);

      return {
        id: task.id,
        status: ok ? "success" : "fail",
        attempts: 1,
        artifacts: [],
        metrics: {},
        errorMsg: ok ? undefined : `SMOKE_FAIL: home=${home}, health=${health}`
      };
    } finally {
      // Wyczyść serwer jeśli go spawnowaliśmy
      if (spawned && (global as any).testBotChild) {
        console.log('TestBot: Stopping spawned server...');
        try {
          (global as any).testBotChild.kill();
        } catch (e) {
          console.log('TestBot: Could not kill server process:', e);
        }
      }
    }
  }
};
