import { describe, it, expect, vi } from 'vitest';
import { BudgetManager } from '../src/index.js';

describe('BudgetManager', () => {
  it('should allow task execution within budget', async () => {
    const manager = new BudgetManager('test-session');

    const task = {
      id: 'test-task',
      name: 'test.task',
      version: '1.0.0',
      priority: 'normal' as const,
      concurrencyClass: 'llm' as const,
      idempotencyKey: 'test',
      estimatedTokens: 500
    };

    const allowed = await manager.checkTokens(task);
    expect(allowed).toBe(true);
  });

  it('should reject task when exceeding budget', async () => {
    const manager = new BudgetManager('test-session');
    manager['sessionUsage'] = 5500; // Set high usage

    const task = {
      id: 'test-task',
      name: 'test.task',
      version: '1.0.0',
      priority: 'normal' as const,
      concurrencyClass: 'llm' as const,
      idempotencyKey: 'test',
      estimatedTokens: 600
    };

    const allowed = await manager.checkTokens(task);
    expect(allowed).toBe(false);
  });

  it('should prefer fallback rules when available and under budget', async () => {
    const manager = new BudgetManager('test-session');

    const task = {
      id: 'test-task',
      name: 'test.task',
      version: '1.0.0',
      priority: 'normal' as const,
      concurrencyClass: 'llm' as const,
      idempotencyKey: 'test',
      estimatedTokens: 500,
      fallbackRules: ['rule:generate-navbar']
    };

    const shouldUseFallback = await manager.shouldUseFallback(task);
    expect(shouldUseFallback).toBe(true);
  });

  it('should track session usage', async () => {
    const manager = new BudgetManager('test-session');

    const task = {
      id: 'test-task',
      name: 'test.task',
      version: '1.0.0',
      priority: 'normal' as const,
      concurrencyClass: 'llm' as const,
      idempotencyKey: 'test',
      estimatedTokens: 500
    };

    await manager.recordUsage(task, 450, false);
    expect(manager.getSessionUsage()).toBe(450);
  });
});
