import { describe, it, expect } from 'vitest';
import { PlannerBot } from '../src/index.js';

describe('PlannerBot', () => {
  const bot = new PlannerBot();

  it('should create DAG plan for streetwear project', async () => {
    const project = {
      title: "FFDH Streetwear",
      description: "Chcę stronę z prezentacją kolekcji ubrań streetwear FFDH. Neonowe kolory, 3 sekcje: intro, galeria, kontakt.",
      requirements: ["contact-form", "image-gallery", "responsive-design"],
      style: "neon-cyberpunk",
      targetAudience: "urban-streetwear-enthusiasts"
    };

    const plan = await bot.createDAGPlan(project);

    expect(plan.tasks.length).toBeGreaterThan(5);
    expect(plan.estimatedTokens).toBeGreaterThan(1000);

    // Check for key tasks
    const taskNames = plan.tasks.map(t => t.name);
    expect(taskNames).toContain('plan.generate-navbar');
    expect(taskNames).toContain('plan.generate-hero');
    expect(taskNames).toContain('plan.generate-gallery-page');
    expect(taskNames).toContain('plan.generate-contact-page');
    expect(taskNames).toContain('plan.run-smoke-tests');
  });

  it('should create tasks with proper dependencies', async () => {
    const project = {
      title: "Simple Site",
      description: "Basic website",
      requirements: ["responsive-design"]
    };

    const plan = await bot.createDAGPlan(project);

    // Find navbar generation task
    const navbarTask = plan.tasks.find(t => t.name === 'plan.generate-navbar');
    expect(navbarTask).toBeDefined();
    expect(navbarTask?.dependsOn).toContain('create-design-system-neon');

    // Find smoke tests
    const smokeTask = plan.tasks.find(t => t.name === 'plan.run-smoke-tests');
    expect(smokeTask?.dependsOn?.length).toBeGreaterThan(0);
  });

  it('should include fallback rules for UI components', async () => {
    const project = {
      title: "Simple Site",
      description: "Basic website",
      requirements: ["responsive-design"]
    };

    const plan = await bot.createDAGPlan(project);

    const navbarTask = plan.tasks.find(t => t.name === 'plan.generate-navbar');
    expect(navbarTask?.fallbackRules).toContain('rule:generate-navbar');

    const heroTask = plan.tasks.find(t => t.name === 'plan.generate-hero');
    expect(heroTask?.fallbackRules).toContain('rule:generate-hero');
  });

  it('should validate DAG without cycles', async () => {
    const project = {
      title: "Test",
      description: "Test project"
    };

    const plan = await bot.createDAGPlan(project);
    const isValid = await bot.validateDAG(plan);

    expect(isValid).toBe(true);
  });

  it('should detect cycles in invalid DAG', async () => {
    const invalidPlan = {
      tasks: [
        {
          id: 'task1',
          name: 'task1',
          version: '1.0.0',
          priority: 'normal' as const,
          concurrencyClass: 'cpu' as const,
          idempotencyKey: 'task1',
          dependsOn: ['task2']
        },
        {
          id: 'task2',
          name: 'task2',
          version: '1.0.0',
          priority: 'normal' as const,
          concurrencyClass: 'cpu' as const,
          idempotencyKey: 'task2',
          dependsOn: ['task1'] // Creates cycle
        }
      ],
      estimatedTokens: 1000,
      humanIterations: 0
    };

    const isValid = await bot.validateDAG(invalidPlan);
    expect(isValid).toBe(false);
  });
});
