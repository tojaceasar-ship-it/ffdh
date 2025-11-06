import fs from "fs-extra";
import path from "path";
import { TaskDefinition, TaskResult, SessionSummary } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";
import { readMetrics } from "../../../shared/utils/metrics.js";

export class ReportBot {
  async generateSessionSummary(sessionId: string, results: TaskResult[]): Promise<SessionSummary> {
    const metrics = readMetrics(10000);
    const sessionMetrics = metrics.filter(m => m.task.includes(sessionId));

    const totalTokens = sessionMetrics.reduce((sum, m) => sum + (m.tokensIn || 0), 0);
    const cacheHits = sessionMetrics.filter(m => m.cacheHit).length;
    const cacheHitRate = sessionMetrics.length > 0 ? cacheHits / sessionMetrics.length : 0;
    const fallbackUsage = results.filter(r => r.metrics?.fallbackUsed).length / results.length;
    const humanIterations = 0; // Would be tracked in future iterations
    const finalDecision = 'accept'; // Would be determined by review process
    const tasksCompleted = results.filter(r => r.status === 'success').length;
    const tasksFailed = results.filter(r => r.status === 'fail').length;
    const startTime = Math.min(...results.map(r => new Date(r.startedAt || Date.now()).getTime()));
    const endTime = Math.max(...results.map(r => new Date(r.endedAt || Date.now()).getTime()));
    const durationMs = endTime - startTime;

    return {
      sessionId,
      timestamp: new Date().toISOString(),
      totalTokens,
      cacheHitRate,
      fallbackUsage,
      humanIterations,
      finalDecision,
      tasksCompleted,
      tasksFailed,
      durationMs
    };
  }

  async saveSessionSummary(summary: SessionSummary): Promise<string> {
    const dir = path.join('.ffdh', 'metrics');
    await fs.ensureDir(dir);

    const filePath = path.join(dir, `session-summary-${summary.sessionId}.json`);
    await fs.writeJson(filePath, summary, { spaces: 2 });

    return filePath;
  }

  async generateEfficiencyReport(): Promise<string> {
    const metrics = readMetrics(10000);
    const sessions = await this.getAllSessionSummaries();

    if (sessions.length === 0) {
      return "No sessions found for efficiency analysis.";
    }

    const totalSessions = sessions.length;
    const avgTokensPerSession = sessions.reduce((sum, s) => sum + s.totalTokens, 0) / totalSessions;
    const avgCacheHitRate = sessions.reduce((sum, s) => sum + s.cacheHitRate, 0) / totalSessions;
    const avgFallbackUsage = sessions.reduce((sum, s) => sum + s.fallbackUsage, 0) / totalSessions;
    const totalTasksCompleted = sessions.reduce((sum, s) => sum + s.tasksCompleted, 0);
    const totalTasksFailed = sessions.reduce((sum, s) => sum + s.tasksFailed, 0);
    const avgDurationMs = sessions.reduce((sum, s) => sum + s.durationMs, 0) / totalSessions;

    let report = "# FFDH Bot Army - LLM Efficiency Summary\n\n";
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += "## Session Overview\n\n";
    report += `- Total Sessions: ${totalSessions}\n`;
    report += `- Total Tasks Completed: ${totalTasksCompleted}\n`;
    report += `- Total Tasks Failed: ${totalTasksFailed}\n`;
    report += `- Task Success Rate: ${((totalTasksCompleted / (totalTasksCompleted + totalTasksFailed)) * 100).toFixed(1)}%\n\n`;

    report += "## Token Efficiency\n\n";
    report += `- Average Tokens/Session: ${avgTokensPerSession.toFixed(0)}\n`;
    report += `- Total Tokens Used: ${sessions.reduce((sum, s) => sum + s.totalTokens, 0)}\n`;
    report += `- Average Cache Hit Rate: ${(avgCacheHitRate * 100).toFixed(1)}%\n`;
    report += `- Average Fallback Usage: ${(avgFallbackUsage * 100).toFixed(1)}%\n\n`;

    report += "## Performance\n\n";
    report += `- Average Session Duration: ${(avgDurationMs / 1000).toFixed(1)}s\n`;
    report += `- Tokens Saved by Cache: ${Math.round(sessions.reduce((sum, s) => sum + (s.totalTokens * s.cacheHitRate), 0))}\n\n`;

    report += "## Recommendations\n\n";

    if (avgCacheHitRate < 0.5) {
      report += "- Consider expanding LLM cache for better efficiency\n";
    }

    if (avgFallbackUsage > 0.3) {
      report += "- High fallback usage - consider adding more rules\n";
    }

    if (avgTokensPerSession > 4000) {
      report += "- High token consumption - review task granularity\n";
    }

    return report;
  }

  private async getAllSessionSummaries(): Promise<SessionSummary[]> {
    const dir = path.join('.ffdh', 'metrics');

    if (!await fs.pathExists(dir)) {
      return [];
    }

    const files = await fs.readdir(dir);
    const summaries: SessionSummary[] = [];

    for (const file of files) {
      if (file.startsWith('session-summary-') && file.endsWith('.json')) {
        try {
          const summary = await fs.readJson(path.join(dir, file));
          summaries.push(summary);
        } catch (error) {
          // Skip invalid files
        }
      }
    }

    return summaries;
  }
}

export const ReportBotRegistration: BotRegistration = {
  name: "ReportBot",
  accepts: ["report.generate-session", "report.generate-efficiency"],
  concurrency: 1,
  async handler(task: TaskDefinition) {
    const reportBot = new ReportBot();

    if (!task.inputsRef) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: "No input data provided",
        artifacts: [],
        metrics: {}
      };
    }

    try {
      if (task.name === "report.generate-session") {
        const input = typeof task.inputsRef === 'string'
          ? JSON.parse(task.inputsRef)
          : task.inputsRef as { sessionId: string; results: TaskResult[] };
        const { sessionId, results } = input;
        const summary = await reportBot.generateSessionSummary(sessionId, results);
        const filePath = await reportBot.saveSessionSummary(summary);

        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [filePath],
          metrics: {}
        };
      }

      if (task.name === "report.generate-efficiency") {
        const report = await reportBot.generateEfficiencyReport();

        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [report],
          metrics: {}
        };
      }

      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: "Unknown report task",
        artifacts: [],
        metrics: {}
      };

    } catch (error) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: error instanceof Error ? error.message : String(error),
        artifacts: [],
        metrics: {}
      };
    }
  }
};
