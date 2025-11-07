#!/usr/bin/env node
import { Orchestrator, SmartOrchestrator } from "./orchestrator.js";

const cmd = process.argv[2] ?? "help";
const description = process.argv.slice(3).join(' ');

async function main() {
  // Legacy mode
  if (cmd === "start" && !description) {
    const o = new Orchestrator();
    await o.start();
    return;
  }

  if (cmd === "plan") {
    const o = new Orchestrator();
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

  // Smart Build Mode
  if (cmd === "smart-build") {
    if (!description) {
      console.error("❌ Error: Please provide project description");
      console.log("Usage: pnpm smart-build \"Chcę stronę z prezentacją kolekcji ubrań streetwear FFDH...\"");
      process.exit(1);
    }

    const smartOrchestrator = new SmartOrchestrator();
    try {
      const result = await smartOrchestrator.processSmartBuild(description);

      if (result.status === 'needs_clarification') {
        console.log('❓ Clarification needed for project:', (result as any).project?.title || 'Unknown');
        console.log('Please provide additional details and run again.');
        process.exit(1);
      }

      if (result.status === 'completed') {
        const completedResult = result as any;
        console.log('✅ Smart Build completed successfully!');
        console.log(`📊 Session: ${completedResult.sessionId}`);
        console.log(`💰 Budget used: ${completedResult.budgetUsed} tokens`);
        console.log(`📋 Tasks completed: ${completedResult.results?.length || 0}`);
      }

    } catch (error) {
      console.error('❌ Smart Build failed:', error);
      process.exit(1);
    }
    return;
  }

  if (cmd === "smart-review") {
    console.log("🚧 Smart Review Mode - Not implemented yet");
    console.log("This would start local dev server and wait for user feedback");
    return;
  }

  if (cmd === "smart-deploy") {
    console.log("🚀 Smart Deploy Mode - Not implemented yet");
    console.log("This would deploy to Vercel after successful review");
    return;
  }

  // Help
  console.log("FFDH Bot Army - Orchestrator CLI");
  console.log("");
  console.log("Legacy Mode:");
  console.log("  pnpm plan               Show current plan");
  console.log("  pnpm start              Execute legacy plan");
  console.log("");
  console.log("Smart Build Mode:");
  console.log("  pnpm smart-build \"description\"    Full smart build pipeline");
  console.log("  pnpm smart-review                Start local review");
  console.log("  pnpm smart-deploy               Deploy after approval");
  console.log("");
  console.log("Examples:");
  console.log("  pnpm smart-build \"Chcę stronę z prezentacją kolekcji ubrań streetwear FFDH. Neonowe kolory.\"");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

