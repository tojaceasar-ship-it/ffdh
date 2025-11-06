#!/usr/bin/env node
import { Orchestrator } from "./orchestrator.js";

const cmd = process.argv[2] ?? "help";

async function main() {
  const o = new Orchestrator();

  if (cmd === "plan") {
    const tasks = await o.plan();
    console.log("Planned tasks:");
    console.table(tasks.map(t => ({
      id: t.id,
      name: t.name,
      priority: t.priority,
      cc: t.concurrencyClass
    })));
    return;
  }

  if (cmd === "start") {
    await o.start();
    return;
  }

  console.log("Usage: pnpm start | pnpm plan");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

