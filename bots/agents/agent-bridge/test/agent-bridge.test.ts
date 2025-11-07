import { AgentBridge, getAgentBridge } from "../src/index.js";
import { AgentMessage } from "../src/index.js";

describe("AgentBridge", () => {
  let bridge: AgentBridge;

  beforeEach(() => {
    bridge = getAgentBridge();
  });

  test("should register and call methods", async () => {
    bridge.registerMethod("test.add", async (params: { a: number; b: number }) => {
      return params.a + params.b;
    });

    const result = await bridge.callMethod("test.add", { a: 2, b: 3 });
    expect(result).toBe(5);
  });

  test("should handle JSON-RPC requests", async () => {
    bridge.registerMethod("test.echo", async (params: any) => params);

    const response = await bridge.handleRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "test.echo",
      params: { message: "hello" },
    });

    expect(response.jsonrpc).toBe("2.0");
    expect(response.id).toBe(1);
    expect(response.result).toEqual({ message: "hello" });
  });

  test("should handle message sending", async () => {
    let receivedMessage: AgentMessage | null = null;

    bridge.registerMessageHandler("test-bot", async (message) => {
      receivedMessage = message;
    });

    const message: AgentMessage = {
      from: "sender",
      to: "test-bot",
      type: "request",
      payload: { data: "test" },
      timestamp: new Date().toISOString(),
    };

    await bridge.sendMessage(message);
    expect(receivedMessage).toEqual(message);
  });
});

