import { describe, it, expect } from 'vitest';
import { ReportBot } from '../src/index.js';

describe('ReportBot', () => {
  const bot = new ReportBot();

  it('should generate session summary', async () => {
    const results = [
      {
        id: 'task1',
        status: 'success' as const,
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        attempts: 1,
        artifacts: [],
        metrics: { tokensOut: 500, fallbackUsed: false }
      },
      {
        id: 'task2',
        status: 'success' as const,
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        attempts: 1,
        artifacts: [],
        metrics: { tokensOut: 300, fallbackUsed: true }
      }
    ];

    const summary = await bot.generateSessionSummary('test-session', results);

    expect(summary.sessionId).toBe('test-session');
    expect(summary.totalTokens).toBe(800);
    expect(summary.tasksCompleted).toBe(2);
    expect(summary.tasksFailed).toBe(0);
    expect(summary.fallbackUsage).toBe(0.5);
  });

  it('should generate efficiency report', async () => {
    const report = await bot.generateEfficiencyReport();

    expect(typeof report).toBe('string');
    expect(report).toContain('FFDH Bot Army');
    expect(report).toContain('Efficiency Summary');
  });
});
