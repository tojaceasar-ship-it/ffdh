import { describe, it, expect } from 'vitest';
import { ArchitectBot } from '../src/index.js';

describe('ArchitectBot', () => {
  const bot = new ArchitectBot();

  it('should design architecture for streetwear project', async () => {
    const project = {
      title: "FFDH Streetwear",
      description: "Chcę stronę z prezentacją kolekcji ubrań streetwear FFDH. Neonowe kolory, 3 sekcje: intro, galeria, kontakt.",
      requirements: ["contact-form", "image-gallery", "responsive-design"],
      style: "neon-cyberpunk",
      targetAudience: "urban-streetwear-enthusiasts"
    };

    const architecture = await bot.designArchitecture(project);

    expect(architecture.structure.pages).toContain('Home');
    expect(architecture.structure.pages).toContain('Contact');
    expect(architecture.structure.pages).toContain('Gallery');

    expect(architecture.structure.components).toContain('NeonButton');
    expect(architecture.structure.components).toContain('GlowCard');
    expect(architecture.structure.components).toContain('ContactForm');
    expect(architecture.structure.components).toContain('ImageGallery');

    expect(architecture.designTokens.colors.primary).toBe('#FFD700');
    expect(architecture.designTokens.colors.secondary).toBe('#00CED1');
  });

  it('should generate routing configuration', async () => {
    const project = {
      title: "Simple Site",
      description: "Basic website",
      requirements: ["contact-form"]
    };

    const architecture = await bot.designArchitecture(project);

    expect(architecture.routing.routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '/', component: 'Home' }),
        expect.objectContaining({ path: '/contact', component: 'Contact' })
      ])
    );
  });

  it('should include standard design tokens', async () => {
    const project = {
      title: "Test",
      description: "Test project"
    };

    const architecture = await bot.designArchitecture(project);

    expect(architecture.designTokens.colors).toHaveProperty('primary');
    expect(architecture.designTokens.colors).toHaveProperty('background');
    expect(architecture.designTokens.typography).toHaveProperty('fontFamily');
    expect(architecture.designTokens.spacing).toHaveProperty('4');
  });
});
