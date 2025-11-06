import fs from "fs-extra";
import path from "path";
import { TaskDefinition } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";
import { writeMetric, readMetrics } from "../../../shared/utils/metrics.js";

export class BudgetManager {
  private dailyLimit = 6000;
  private sessionUsage = 0;
  private sessionId: string;

  constructor(sessionId?: string) {
    this.sessionId = sessionId || `session-${Date.now()}`;
  }

  async checkTokens(task: TaskDefinition): Promise<boolean> {
    const todayUsage = await this.getTodayUsage();
    const estimated = task.estimatedTokens || 512;

    if (todayUsage + this.sessionUsage + estimated > this.dailyLimit) {
      console.warn(`⚠️  Token budget exceeded: ${todayUsage + this.sessionUsage + estimated}/${this.dailyLimit}`);
      return false;
    }

    return true;
  }

  async shouldUseFallback(task: TaskDefinition): Promise<boolean> {
    // Prefer fallback rules if available and not using too many tokens
    if (task.fallbackRules && task.fallbackRules.length > 0) {
      const todayUsage = await this.getTodayUsage();
      if (todayUsage + this.sessionUsage < this.dailyLimit * 0.7) { // Use fallback if under 70% of budget
        return true;
      }
    }
    return false;
  }

  async recordUsage(task: TaskDefinition, tokensUsed: number, cacheHit = false) {
    this.sessionUsage += tokensUsed;

    writeMetric({
      ts: new Date().toISOString(),
      task: task.name,
      status: "success",
      durMs: 0, // Will be updated by task execution
      tokensIn: tokensUsed,
      tokensOut: tokensUsed,
      cacheHit
    });

    // Check if approaching limit
    const todayUsage = await this.getTodayUsage();
    if (todayUsage + this.sessionUsage > this.dailyLimit * 0.9) {
      console.warn(`⚠️  Approaching token limit: ${todayUsage + this.sessionUsage}/${this.dailyLimit}`);
    }
  }

  private async getTodayUsage(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const records = readMetrics();

    return records
      .filter(r => r.ts.startsWith(today))
      .reduce((sum, r) => sum + (r.tokensIn || 0), 0);
  }

  getSessionUsage(): number {
    return this.sessionUsage;
  }

  getRemainingBudget(): Promise<number> {
    return this.getTodayUsage().then(today => Math.max(0, this.dailyLimit - today - this.sessionUsage));
  }
}

export const BudgetManagerBot: BotRegistration = {
  name: "BudgetManager",
  accepts: ["budget.check", "budget.record"],
  concurrency: 1,
  async handler(task: TaskDefinition) {
    const manager = new BudgetManager();

    if (task.name === "budget.check") {
      const hasBudget = await manager.checkTokens(task);
      return {
        id: task.id,
        status: hasBudget ? "success" : "fail",
        attempts: 1,
        artifacts: [],
        metrics: { fallbackUsed: false }
      };
    }

    if (task.name === "budget.record") {
      await manager.recordUsage(task, task.estimatedTokens || 0);
      return {
        id: task.id,
        status: "success",
        attempts: 1,
        artifacts: [],
        metrics: {}
      };
    }

    return {
      id: task.id,
      status: "fail",
      attempts: 1,
      errorMsg: "Unknown budget task",
      artifacts: [],
      metrics: {}
    };
  }
};
