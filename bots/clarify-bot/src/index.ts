import { TaskDefinition, TaskResult, ProjectDescription, ClarificationQuestion } from "../../../shared/types/task.js";
import { BotRegistration } from "../../../shared/types/bot.js";

export class ClarifyBot {
  async analyzeRequirements(project: ProjectDescription): Promise<ClarificationQuestion[]> {
    const questions: ClarificationQuestion[] = [];

    // Check if style is clearly defined
    if (!project.style || project.style === 'modern-streetwear') {
      questions.push({
        question: "Jakiego stylu kolorystycznego oczekujesz? (neon/cyberpunk, minimalistyczny, dark theme, itp.)",
        field: "style",
        required: false
      });
    }

    // Check if target audience is specified
    if (!project.targetAudience || project.targetAudience === 'urban-streetwear-enthusiasts') {
      questions.push({
        question: "Kto będzie główną grupą odbiorców strony? (młodzież, profesjonaliści, dzieci, itp.)",
        field: "targetAudience",
        required: false
      });
    }

    // Check for specific functionality requirements
    if (!project.requirements?.includes('contact-form')) {
      questions.push({
        question: "Czy potrzebujesz formularza kontaktowego?",
        field: "contactForm",
        required: false
      });
    }

    if (!project.requirements?.includes('image-gallery')) {
      questions.push({
        question: "Czy potrzebujesz galerii zdjęć/produktów?",
        field: "gallery",
        required: false
      });
    }

    // Check for e-commerce requirements
    if (project.description.toLowerCase().includes('sklep') ||
        project.description.toLowerCase().includes('kupić') ||
        project.description.toLowerCase().includes('ceny')) {
      questions.push({
        question: "Czy strona ma zawierać funkcjonalności e-commerce (koszyk, płatności)?",
        field: "ecommerce",
        required: true
      });
    }

    // Check for content management
    if (project.description.toLowerCase().includes('treści') ||
        project.description.toLowerCase().includes('artykuły') ||
        project.description.toLowerCase().includes('blog')) {
      questions.push({
        question: "Czy potrzebujesz systemu zarządzania treścią (CMS)?",
        field: "cms",
        required: false
      });
    }

    return questions;
  }

  async needsClarification(project: ProjectDescription): Promise<boolean> {
    const questions = await this.analyzeRequirements(project);
    return questions.some(q => q.required);
  }

  async generateClarificationPrompt(project: ProjectDescription): Promise<string> {
    const questions = await this.analyzeRequirements(project);

    if (questions.length === 0) {
      return "Wszystkie wymagania wydają się kompletne. Możemy przystąpić do planowania.";
    }

    let prompt = "Aby lepiej zrozumieć Twoje wymagania, potrzebuję dodatkowych informacji:\n\n";

    questions.forEach((q, index) => {
      prompt += `${index + 1}. ${q.question}${q.required ? ' (wymagane)' : ' (opcjonalne)'}\n`;
    });

    prompt += "\nMożesz odpowiedzieć na wszystkie pytania lub tylko te oznaczone jako wymagane.";

    return prompt;
  }
}

export const ClarifyBotRegistration: BotRegistration = {
  name: "ClarifyBot",
  accepts: ["clarify.analyze", "clarify.needs", "clarify.prompt"],
  concurrency: 1,
  async handler(task: TaskDefinition) {
    const clarifyBot = new ClarifyBot();

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
      const project = typeof task.inputsRef === 'string'
        ? JSON.parse(task.inputsRef)
        : task.inputsRef as ProjectDescription;

      if (task.name === "clarify.analyze") {
        const questions = await clarifyBot.analyzeRequirements(project);
    return {
      id: task.id,
      status: "success",
      attempts: 1,
      artifacts: [JSON.stringify(questions)],
      metrics: {}
    };
      }

      if (task.name === "clarify.needs") {
        const needsClarification = await clarifyBot.needsClarification(project);
        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [needsClarification.toString()],
          metrics: {}
        };
      }

      if (task.name === "clarify.prompt") {
        const prompt = await clarifyBot.generateClarificationPrompt(project);
        return {
          id: task.id,
          status: "success",
          attempts: 1,
          artifacts: [prompt],
          metrics: {}
        };
      }

      return {
        id: task.id,
        status: "fail",
        attempts: 1,
        errorMsg: "Unknown clarification task",
        artifacts: [],
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
