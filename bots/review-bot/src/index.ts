import fs from "fs-extra";
import path from "path";
import execa from "execa";
import { TaskDefinition, TaskResult, ReviewDecision } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";

export class ReviewBot {
  private devProcess: any = null;

  async startLocalReview(sessionId: string): Promise<string> {
    console.log('🚀 Starting local development server for review...');

    // Start Next.js dev server
    const repoRoot = this.findRepoRoot();

    this.devProcess = execa("pnpm", ["-C", "apps/web", "dev"], {
      cwd: repoRoot,
      stdio: "inherit",
      detached: true
    });

    // Wait for server to be ready
    await this.waitForServer();

    const reviewUrl = 'http://localhost:3000';
    console.log(`✅ Development server ready at: ${reviewUrl}`);
    console.log(`📝 Review session: ${sessionId}`);
    console.log(`🔗 Please check the application and provide feedback`);

    // Create review decision file template
    const decisionFile = path.join('.ffdh', 'reviews', `${sessionId}.json`);
    await fs.ensureDir(path.dirname(decisionFile));

    const template: ReviewDecision = {
      decision: "changes",
      comments: "Please review the application and update this file",
      requestedChanges: []
    };

    await fs.writeJson(decisionFile, template, { spaces: 2 });

    return decisionFile;
  }

  async getReviewDecision(sessionId: string): Promise<ReviewDecision> {
    const decisionFile = path.join('.ffdh', 'reviews', `${sessionId}.json`);

    if (!await fs.pathExists(decisionFile)) {
      return {
        decision: "changes",
        comments: "Review file not found",
        requestedChanges: ["Create review file"]
      };
    }

    try {
      const decision = await fs.readJson(decisionFile);
      return decision;
    } catch (error) {
      return {
        decision: "changes",
        comments: "Invalid review file format",
        requestedChanges: ["Fix review file JSON format"]
      };
    }
  }

  async waitForReviewCompletion(sessionId: string, timeoutMs = 300000): Promise<ReviewDecision> {
    const startTime = Date.now();

    console.log(`⏳ Waiting for review completion (timeout: ${timeoutMs / 1000}s)...`);

    while (Date.now() - startTime < timeoutMs) {
      const decision = await this.getReviewDecision(sessionId);

      if (decision.decision === "accept") {
        console.log('✅ Review completed with ACCEPT');
        return decision;
      }

      // Check for changes requested
      if (decision.requestedChanges && decision.requestedChanges.length > 0) {
        console.log('📝 Review completed with CHANGES requested');
        console.log('Requested changes:', decision.requestedChanges);
        return decision;
      }

      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log('⏰ Review timeout reached');
    return {
      decision: "changes",
      comments: "Review timeout - no decision made",
      requestedChanges: ["Complete review within timeout period"]
    };
  }

  async stopLocalReview(): Promise<void> {
    if (this.devProcess) {
      console.log('🛑 Stopping development server...');
      try {
        this.devProcess.kill();
        this.devProcess = null;
      } catch (error) {
        console.warn('Warning: Could not stop dev server cleanly:', error);
      }
    }
  }

  private async waitForServer(timeoutMs = 30000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      try {
        const response = await fetch('http://localhost:3000/api/health');
        if (response.ok) {
          return;
        }
      } catch (error) {
        // Server not ready yet
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error('Development server failed to start within timeout');
  }

  private findRepoRoot(): string {
    let current = process.cwd();
    while (current && !fs.existsSync(path.join(current, 'pnpm-workspace.yaml'))) {
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
    return current;
  }
}

export const ReviewBotRegistration: BotRegistration = {
  name: "ReviewBot",
  accepts: ["review.start", "review.get-decision", "review.wait", "review.stop"],
  concurrency: 1,
  async handler(task: TaskDefinition) {
    const reviewBot = new ReviewBot();

    if (!task.inputsRef) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: "No session ID provided",
        artifacts: [],
        metrics: { humanReviewRequired: true }
      };
    }

    try {
      const sessionId = task.inputsRef as string;

      if (task.name === "review.start") {
        const reviewFile = await reviewBot.startLocalReview(sessionId);
        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [reviewFile],
          metrics: { humanReviewRequired: true }
        };
      }

      if (task.name === "review.get-decision") {
        const decision = await reviewBot.getReviewDecision(sessionId);
        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [JSON.stringify(decision)],
          metrics: { humanReviewRequired: true }
        };
      }

      if (task.name === "review.wait") {
        const decision = await reviewBot.waitForReviewCompletion(sessionId);
        return {
          id: task.id,
          status: decision.decision === "accept" ? "success" : "fail",
          attempts: 1,
          artifacts: [JSON.stringify(decision)],
          metrics: { humanReviewRequired: true }
        };
      }

      if (task.name === "review.stop") {
        await reviewBot.stopLocalReview();
        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [],
          metrics: { humanReviewRequired: true }
        };
      }

      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: "Unknown review task",
        artifacts: [],
        metrics: { humanReviewRequired: true }
      };

    } catch (error) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: error instanceof Error ? error.message : String(error),
        artifacts: [],
        metrics: { humanReviewRequired: true }
      };
    }
  }
};
