import { z } from "zod";
export const BotTaskHandler = z.function()
    .args(z.object({
    task: z.any(), // konkretny typ opisany w inputsRef
    idempotencyKey: z.string()
}))
    .returns(z.promise(z.object({
    status: z.enum(["success", "fail"]),
    artifacts: z.array(z.string()).default([]),
    errorMsg: z.string().optional()
})));
//# sourceMappingURL=bot.js.map