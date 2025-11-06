import { describe, it, expect } from 'vitest';
import { FallbackEngine } from '../src/index.js';

describe('FallbackEngine', () => {
  const engine = new FallbackEngine();

  it('should detect available rules', () => {
    expect(engine.hasRule('rule:generate-navbar')).toBe(true);
    expect(engine.hasRule('rule:nonexistent')).toBe(false);
  });

  it('should execute navbar rule', async () => {
    const task = {
      id: 'test-navbar',
      name: 'rule:generate-navbar',
      version: '1.0.0',
      priority: 'normal' as const,
      concurrencyClass: 'cpu' as const,
      idempotencyKey: 'test'
    };

    const result = await engine.executeRule('rule:generate-navbar', {});

    expect(result.status).toBe('success');
    expect(result.artifacts).toContain('components/Navbar.tsx');
    expect(result.metrics?.fallbackUsed).toBe(true);
    expect(result.metrics?.ruleApplied).toBe('rule:generate-navbar');
  });

  it('should execute hero rule', async () => {
    const result = await engine.executeRule('rule:generate-hero', {});

    expect(result.status).toBe('success');
    expect(result.artifacts).toContain('components/Hero.tsx');
    expect(result.metrics?.fallbackUsed).toBe(true);
  });

  it('should fail for unknown rule', async () => {
    await expect(engine.executeRule('rule:unknown', {})).rejects.toThrow('Rule not found');
  });
});
