import { describe, it, expect } from 'vitest';
import { ClarifyBot } from '../src/index.js';

describe('ClarifyBot', () => {
  const bot = new ClarifyBot();

  it('should detect missing style information', async () => {
    const project = {
      title: "Test Project",
      description: "Simple website",
      requirements: ["responsive-design"]
    };

    const questions = await bot.analyzeRequirements(project);
    const styleQuestion = questions.find(q => q.field === 'style');

    expect(styleQuestion).toBeDefined();
    expect(styleQuestion?.required).toBe(false);
  });

  it('should detect e-commerce requirements', async () => {
    const project = {
      title: "Shop",
      description: "Chcę sklep z ubraniami gdzie można kupić produkty",
      requirements: ["responsive-design"]
    };

    const questions = await bot.analyzeRequirements(project);
    const ecommerceQuestion = questions.find(q => q.field === 'ecommerce');

    expect(ecommerceQuestion).toBeDefined();
    expect(ecommerceQuestion?.required).toBe(true);
  });

  it('should detect CMS requirements', async () => {
    const project = {
      title: "Blog",
      description: "Strona z artykułami i treściami",
      requirements: ["responsive-design"]
    };

    const questions = await bot.analyzeRequirements(project);
    const cmsQuestion = questions.find(q => q.field === 'cms');

    expect(cmsQuestion).toBeDefined();
    expect(cmsQuestion?.required).toBe(false);
  });

  it('should generate clarification prompt', async () => {
    const project = {
      title: "Test Project",
      description: "Simple website",
      requirements: ["responsive-design"]
    };

    const prompt = await bot.generateClarificationPrompt(project);

    expect(prompt).toContain('wymagania');
    expect(prompt).toContain('informacje');
    expect(prompt).toContain('stylu');
  });

  it('should detect when clarification is needed', async () => {
    const projectWithEcommerce = {
      title: "Shop",
      description: "Chcę sklep z produktami do kupienia",
      requirements: ["responsive-design"]
    };

    const needsClarification = await bot.needsClarification(projectWithEcommerce);
    expect(needsClarification).toBe(true);

    const simpleProject = {
      title: "Simple",
      description: "Basic website",
      requirements: ["responsive-design"],
      style: "minimalist"
    };

    const needsClarification2 = await bot.needsClarification(simpleProject);
    expect(needsClarification2).toBe(false);
  });
});
