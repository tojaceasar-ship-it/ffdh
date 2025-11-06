import { describe, it, expect } from 'vitest';
import { IntakeBot } from '../src/index.js';

describe('IntakeBot', () => {
  const bot = new IntakeBot();

  it('should process streetwear description', async () => {
    const description = "Chcę stronę z prezentacją kolekcji ubrań streetwear FFDH. Neonowe kolory, 3 sekcje: intro, galeria, kontakt.";

    const result = await bot.processDescription(description);

    expect(result.title).toContain('kolekcji');
    expect(result.description).toBe(description);
    expect(result.requirements).toContain('contact-form');
    expect(result.requirements).toContain('image-gallery');
    expect(result.requirements).toContain('navigation');
    expect(result.style).toBe('neon-cyberpunk');
    expect(result.targetAudience).toBe('urban-streetwear-enthusiasts');
  });

  it('should extract title from various patterns', async () => {
    const patterns = [
      { input: "Stwórz stronę o kotach", expected: "o kotach" },
      { input: "Chcę projekt domu", expected: "domu" },
      { input: "Strona z portfolio", expected: "portfolio" }
    ];

    for (const { input, expected } of patterns) {
      const result = await bot.processDescription(input);
      expect(result.title).toContain(expected);
    }
  });

  it('should detect style preferences', async () => {
    const tests = [
      { input: "Minimalistyczna strona", expected: "minimalist" },
      { input: "Dark theme website", expected: "dark-theme" },
      { input: "Bright modern design", expected: "bright-modern" }
    ];

    for (const { input, expected } of tests) {
      const result = await bot.processDescription(input);
      expect(result.style).toBe(expected);
    }
  });

  it('should include default requirements', async () => {
    const result = await bot.processDescription("Simple website");

    expect(result.requirements).toContain('responsive-design');
    expect(result.requirements).toContain('seo-optimization');
  });
});
