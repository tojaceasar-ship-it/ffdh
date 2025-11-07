import fs from "fs-extra";
import path from "path";
import { TaskDefinition, TaskResult } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";
import { generateHeroSection } from "../templates/hero-section.js";
import { generateContactForm } from "../templates/contact-form.js";
import { generateGalleryGrid } from "../templates/gallery-grid.js";

export class UIBot {
  async generateFromArchitecture(sessionId: string): Promise<string[]> {
    console.log('UIBot: Loading architecture for session:', sessionId);

    // Load architecture
    const projectRoot = this.findRepoRoot();
    const architectureFile = path.join(projectRoot, '.ffdh', 'architectures', `architect-${sessionId}.json`);
    
    if (!await fs.pathExists(architectureFile)) {
      throw new Error(`Architecture file not found: ${architectureFile}`);
    }

    const architecture = await fs.readJson(architectureFile);
    console.log('UIBot: Loaded architecture:', architecture.structure);

    const generatedFiles: string[] = [];
    const componentsDir = path.join(projectRoot, 'apps', 'web', 'components');
    const pagesDir = path.join(projectRoot, 'apps', 'web', 'app');

    await fs.ensureDir(componentsDir);

    // Generate components based on architecture
    const { components, pages } = architecture.structure;
    const { colors } = architecture.designTokens;

    // Generate HeroSection if needed
    if (components.includes('NeonButton') || components.includes('CyberpunkText')) {
      const heroCode = generateHeroSection(colors, {
        title: 'FFDH STREETWEAR',
        tagline: 'Neon dreams, urban style, limitless expression',
        cta: 'Explore Collection'
      });
      const heroFile = path.join(componentsDir, 'HeroSection.tsx');
      await fs.writeFile(heroFile, heroCode, 'utf8');
      generatedFiles.push(heroFile);
      console.log('UIBot: Generated HeroSection.tsx');
    }

    // Generate ContactForm if needed
    if (components.includes('ContactForm')) {
      const contactCode = generateContactForm(colors);
      const contactFile = path.join(componentsDir, 'ContactForm.tsx');
      await fs.writeFile(contactFile, contactCode, 'utf8');
      generatedFiles.push(contactFile);
      console.log('UIBot: Generated ContactForm.tsx');
    }

    // Generate GalleryGrid if needed
    if (components.includes('ImageGallery')) {
      const galleryCode = generateGalleryGrid(colors, []);
      const galleryFile = path.join(componentsDir, 'GalleryGrid.tsx');
      await fs.writeFile(galleryFile, galleryCode, 'utf8');
      generatedFiles.push(galleryFile);
      console.log('UIBot: Generated GalleryGrid.tsx');
    }

    // Generate main page integrating all components
    const mainPageCode = this.generateMainPage(architecture, components);
    const mainPageFile = path.join(pagesDir, 'page.tsx');
    await fs.writeFile(mainPageFile, mainPageCode, 'utf8');
    generatedFiles.push(mainPageFile);
    console.log('UIBot: Generated page.tsx');

    // Generate contact page if needed
    if (pages.includes('Contact') && components.includes('ContactForm')) {
      const contactPageCode = this.generateContactPage(colors);
      const contactPageDir = path.join(pagesDir, 'contact');
      await fs.ensureDir(contactPageDir);
      const contactPageFile = path.join(contactPageDir, 'page.tsx');
      await fs.writeFile(contactPageFile, contactPageCode, 'utf8');
      generatedFiles.push(contactPageFile);
      console.log('UIBot: Generated contact/page.tsx');
    }

    return generatedFiles;
  }

  private generateMainPage(architecture: any, components: string[]): string {
    const { colors } = architecture.designTokens;
    const hasHero = components.includes('NeonButton') || components.includes('CyberpunkText');
    const hasGallery = components.includes('ImageGallery');
    const hasContact = components.includes('ContactForm');

    let imports = `import Link from 'next/link';\n`;
    if (hasHero) imports += `import HeroSection from '@/components/HeroSection';\n`;
    if (hasGallery) imports += `import GalleryGrid from '@/components/GalleryGrid';\n`;
    if (hasContact) imports += `import ContactForm from '@/components/ContactForm';\n`;

    return `${imports}
export default function HomePage() {
  return (
    <main style={{ backgroundColor: '${colors.background || '#0a0a0a'}' }}>
      ${hasHero ? '<HeroSection />' : ''}
      ${hasGallery ? '<GalleryGrid />' : ''}
      ${hasContact ? '<ContactForm />' : ''}
    </main>
  );
}`;
  }

  private generateContactPage(colors: any): string {
    return `import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <main 
      className="min-h-screen"
      style={{ backgroundColor: '${colors.background || '#0a0a0a'}' }}
    >
      <ContactForm />
    </main>
  );
}`;
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

export const UIBotRegistration: BotRegistration = {
  name: "UIBot",
  accepts: ["ui.generate-from-architecture"],
  concurrency: 1,
  async handler(task: TaskDefinition) {
    const uiBot = new UIBot();

    if (!task.inputsRef) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: "No session ID provided",
        artifacts: [],
        metrics: {}
      };
    }

    try {
      const sessionId = task.inputsRef as string;
      const files = await uiBot.generateFromArchitecture(sessionId);

      return {
        id: task.id,
        status: "success",
        attempts: 1,
        artifacts: files,
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
