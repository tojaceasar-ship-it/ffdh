import { z } from "zod";

/**
 * JSON-RPC 2.0 Request Schema
 */
export const JsonRpcRequestSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.string(), z.number()]),
  method: z.string(),
  params: z.any().optional(),
});

export type JsonRpcRequest = z.infer<typeof JsonRpcRequestSchema>;

/**
 * JSON-RPC 2.0 Response Schema
 */
export const JsonRpcResponseSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.string(), z.number()]),
  result: z.any().optional(),
  error: z.object({
    code: z.number(),
    message: z.string(),
    data: z.any().optional(),
  }).optional(),
});

export type JsonRpcResponse = z.infer<typeof JsonRpcResponseSchema>;

/**
 * Agent Bridge Message Types
 */
export const AgentMessageSchema = z.object({
  from: z.string(), // Bot name
  to: z.string().optional(), // Target bot name (optional for broadcast)
  type: z.enum(["request", "response", "event", "broadcast"]),
  payload: z.any(),
  timestamp: z.string().datetime(),
  sessionId: z.string().optional(),
});

export type AgentMessage = z.infer<typeof AgentMessageSchema>;

/**
 * Agent Bridge Method Registry
 */
export type BridgeMethod = (params: any) => Promise<any>;

export interface BridgeMethodRegistry {
  [method: string]: BridgeMethod;
}

/**
 * Agent Bridge Server - JSON-RPC 2.0 implementation
 */
export class AgentBridge {
  private methods: BridgeMethodRegistry = {};
  private messageHandlers: Map<string, (message: AgentMessage) => Promise<void>> = new Map();
  private messageQueue: AgentMessage[] = [];

  /**
   * Register a method handler
   */
  registerMethod(name: string, handler: BridgeMethod): void {
    this.methods[name] = handler;
  }

  /**
   * Register a message handler
   */
  registerMessageHandler(botName: string, handler: (message: AgentMessage) => Promise<void>): void {
    this.messageHandlers.set(botName, handler);
  }

  /**
   * Handle JSON-RPC request
   */
  async handleRequest(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    const { id, method, params } = request;

    // Check if method exists
    if (!this.methods[method]) {
      return {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      };
    }

    try {
      const result = await this.methods[method](params);
      return {
        jsonrpc: "2.0",
        id,
        result,
      };
    } catch (error) {
      return {
        jsonrpc: "2.0",
        id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : "Internal error",
          data: error,
        },
      };
    }
  }

  /**
   * Send message to another agent
   */
  async sendMessage(message: AgentMessage): Promise<void> {
    const { to, type } = message;

    if (type === "broadcast" || !to) {
      // Broadcast to all handlers
      for (const handler of this.messageHandlers.values()) {
        await handler(message);
      }
    } else {
      // Send to specific handler
      const handler = this.messageHandlers.get(to);
      if (handler) {
        await handler(message);
      } else {
        // Queue message if handler not available
        this.messageQueue.push(message);
      }
    }
  }

  /**
   * Process queued messages
   */
  async processQueue(): Promise<void> {
    const processed: AgentMessage[] = [];

    for (const message of this.messageQueue) {
      const handler = this.messageHandlers.get(message.to || "");
      if (handler) {
        await handler(message);
        processed.push(message);
      }
    }

    // Remove processed messages
    this.messageQueue = this.messageQueue.filter(m => !processed.includes(m));
  }

  /**
   * Call method on another agent (via JSON-RPC)
   */
  async callMethod(method: string, params?: any): Promise<any> {
    const handler = this.methods[method];
    if (!handler) {
      throw new Error(`Method not found: ${method}`);
    }
    return handler(params);
  }

  /**
   * Get registered methods
   */
  getRegisteredMethods(): string[] {
    return Object.keys(this.methods);
  }
}

/**
 * Singleton instance
 */
let bridgeInstance: AgentBridge | null = null;

export function getAgentBridge(): AgentBridge {
  if (!bridgeInstance) {
    bridgeInstance = new AgentBridge();
    
    // Register default methods
    bridgeInstance.registerMethod("ping", async () => ({ pong: true, timestamp: new Date().toISOString() }));
    bridgeInstance.registerMethod("listMethods", async () => bridgeInstance!.getRegisteredMethods());
    bridgeInstance.registerMethod("getStatus", async () => {
      const handlers = Array.from((bridgeInstance as any).messageHandlers.keys());
      const queuedMessages = (bridgeInstance as any).messageQueue.length;
      return { handlers, queuedMessages };
    });
  }
  return bridgeInstance;
}

