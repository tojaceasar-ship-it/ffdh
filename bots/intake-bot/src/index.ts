import { TaskDefinition, TaskResult, ProjectDescription } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";

export class IntakeBot {
  async processDescription(rawDescription: string): Promise<ProjectDescription> {
    // Parse natural language description into structured format
    const description = rawDescription.toLowerCase();

    const projectDesc: ProjectDescription = {
      title: this.extractTitle(description),
      description: rawDescription,
      requirements: this.extractRequirements(description),
      style: this.extractStyle(description),
      targetAudience: this.extractAudience(description)
    };

    return projectDesc;
  }

  private extractTitle(description: string): string {
    // Extract potential title from description
    const titlePatterns = [
      /strona (?:o|z) ([^,.\n]+)/i,
      /stworz ([^,.\n]+)/i,
      /chcę ([^,.\n]+)/i,
      /projekt ([^,.\n]+)/i
    ];

    for (const pattern of titlePatterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return "FFDH Project";
  }

  private extractRequirements(description: string): string[] {
    const requirements: string[] = [];

    // Look for specific features mentioned
    if (description.includes('kontakt') || description.includes('contact')) {
      requirements.push('contact-form');
    }

    if (description.includes('galeria') || description.includes('zdjęcia') || description.includes('gallery')) {
      requirements.push('image-gallery');
    }

    if (description.includes('menu') || description.includes('nawigacja') || description.includes('navbar')) {
      requirements.push('navigation');
    }

    if (description.includes('hero') || description.includes('baner') || description.includes('nagłówek')) {
      requirements.push('hero-section');
    }

    // Always include basic requirements
    requirements.push('responsive-design', 'seo-optimization');

    return [...new Set(requirements)]; // Remove duplicates
  }

  private extractStyle(description: string): string {
    if (description.includes('neon') || description.includes('fluorescent')) {
      return 'neon-cyberpunk';
    }
    if (description.includes('minimal') || description.includes('clean')) {
      return 'minimalist';
    }
    if (description.includes('dark') || description.includes('czarny')) {
      return 'dark-theme';
    }
    if (description.includes('bright') || description.includes('jasny')) {
      return 'bright-modern';
    }
    return 'modern-streetwear';
  }

  private extractAudience(description: string): string {
    if (description.includes('dzieci') || description.includes('kids')) {
      return 'children';
    }
    if (description.includes('młodzież') || description.includes('youth') || description.includes('young')) {
      return 'young-adults';
    }
    if (description.includes('biznes') || description.includes('business')) {
      return 'business-professional';
    }
    return 'urban-streetwear-enthusiasts';
  }
}

export const IntakeBotRegistration: BotRegistration = {
  name: "IntakeBot",
  accepts: ["intake.process"],
  concurrency: 1,
  async handler(task: TaskDefinition) {
    const intakeBot = new IntakeBot();

    if (!task.inputsRef) {
      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: "No description provided",
        artifacts: [],
        metrics: {}
      };
    }

    try {
      console.log('IntakeBot: Processing description:', task.inputsRef);
      const description = await intakeBot.processDescription(task.inputsRef as string);
      console.log('IntakeBot: Processed description:', description);

      // Save to session file
      const path = await import('path');
      const projectRoot = process.cwd().split('bots')[0];
      const sessionFile = path.default.join(projectRoot, '.ffdh', 'sessions', `${task.idempotencyKey}.json`);
      console.log('IntakeBot: Saving to:', sessionFile);
      try {
        const fs = await import('fs-extra');
        const sessionDir = path.default.join(projectRoot, '.ffdh', 'sessions');
        console.log('IntakeBot: Creating directory:', sessionDir);
        await fs.default.ensureDir(sessionDir);
        await fs.default.writeJson(sessionFile, description);
        console.log('IntakeBot: File saved successfully');
      } catch (error) {
        console.error('IntakeBot: Failed to save file:', error);
        throw error;
      }

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
