import { TaskDefinition, TaskResult, ProjectDescription } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";

export interface ArchitecturePlan {
  structure: {
    pages: string[];
    components: string[];
    layouts: string[];
    apis: string[];
  };
  designTokens: {
    colors: Record<string, string>;
    typography: any;
    spacing: Record<string, string>;
  };
  routing: {
    routes: Array<{ path: string; component: string; layout?: string }>;
  };
  dataFlow: {
    stateManagement: string;
    dataFetching: string[];
  };
}

export class ArchitectBot {
  async designArchitecture(project: ProjectDescription): Promise<ArchitecturePlan> {
    const plan: ArchitecturePlan = {
      structure: {
        pages: this.designPages(project),
        components: this.designComponents(project),
        layouts: this.designLayouts(project),
        apis: this.designAPIs(project)
      },
      designTokens: this.generateDesignTokens(project),
      routing: this.designRouting(project),
      dataFlow: this.designDataFlow(project)
    };

    return plan;
  }

  private designPages(project: ProjectDescription): string[] {
    const pages = ['Home'];

    if (project.requirements?.includes('contact-form')) {
      pages.push('Contact');
    }

    if (project.requirements?.includes('image-gallery')) {
      pages.push('Gallery');
    }

    if (project.description.toLowerCase().includes('blog') ||
        project.description.toLowerCase().includes('artykuły')) {
      pages.push('Blog');
    }

    return pages;
  }

  private designComponents(project: ProjectDescription): string[] {
    const components = ['Navbar', 'Footer'];

    if (project.style?.includes('neon') || project.style?.includes('cyberpunk')) {
      components.push('NeonButton', 'GlowCard', 'CyberpunkText');
    } else {
      components.push('Button', 'Card', 'Text');
    }

    if (project.requirements?.includes('contact-form')) {
      components.push('ContactForm');
    }

    if (project.requirements?.includes('image-gallery')) {
      components.push('ImageGallery', 'Lightbox');
    }

    return components;
  }

  private designLayouts(project: ProjectDescription): string[] {
    const layouts = ['DefaultLayout'];

    if (project.style?.includes('neon')) {
      layouts.push('NeonLayout');
    }

    return layouts;
  }

  private designAPIs(project: ProjectDescription): string[] {
    const apis = ['health'];

    if (project.requirements?.includes('contact-form')) {
      apis.push('contact');
    }

    return apis;
  }

  private generateDesignTokens(project: ProjectDescription): ArchitecturePlan['designTokens'] {
    let colors: Record<string, string> = {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      foreground: '#000000'
    };

    if (project.style?.includes('neon') || project.style?.includes('cyberpunk')) {
      colors = {
        primary: '#FFD700',
        secondary: '#00CED1',
        accent: '#FF4500',
        background: '#0a0a0a',
        foreground: '#ffffff'
      };
    } else if (project.style?.includes('dark')) {
      colors = {
        primary: '#FFD700',
        secondary: '#00CED1',
        accent: '#FF4500',
        background: '#000000',
        foreground: '#ffffff'
      };
    }

    const typography = {
      fontFamily: 'Inter, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem'
      }
    };

    const spacing = {
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      12: '3rem',
      16: '4rem'
    };

    return { colors, typography, spacing };
  }

  private designRouting(project: ProjectDescription): ArchitecturePlan['routing'] {
    const routes = [
      { path: '/', component: 'Home' },
      { path: '/contact', component: 'Contact' },
      { path: '/gallery', component: 'Gallery' }
    ];

    return { routes };
  }

  private designDataFlow(project: ProjectDescription): ArchitecturePlan['dataFlow'] {
    return {
      stateManagement: 'React.useState',
      dataFetching: ['fetch', 'swr']
    };
  }
}

export const ArchitectBotRegistration: BotRegistration = {
  name: "ArchitectBot",
  accepts: ["architect.design"],
  concurrency: 1,
  async handler(task: TaskDefinition) {
    const architectBot = new ArchitectBot();

    if (!task.inputsRef) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: "No project description provided",
        artifacts: [],
        metrics: {}
      };
    }

    try {
      console.log('ArchitectBot: Processing project:', task.inputsRef);
      const project = typeof task.inputsRef === 'string'
        ? JSON.parse(task.inputsRef)
        : task.inputsRef as ProjectDescription;
      console.log('ArchitectBot: Parsed project:', project);
      const architecture = await architectBot.designArchitecture(project);
      console.log('ArchitectBot: Generated architecture:', architecture);

      // Save architecture plan
      const path = await import('path');
      const fs = await import('fs-extra');
      const projectRoot = process.cwd().split('bots')[0];
      const sessionFile = path.default.join(projectRoot, '.ffdh', 'architectures', `${task.idempotencyKey}.json`);
      const architecturesDir = path.default.join(projectRoot, '.ffdh', 'architectures');
      console.log('ArchitectBot: Saving architecture to:', sessionFile);
      await fs.default.ensureDir(architecturesDir);
      await fs.default.writeJson(sessionFile, architecture);

      return {
        id: task.id,
        status: "success",
        attempts: 1,
        artifacts: [sessionFile],
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
