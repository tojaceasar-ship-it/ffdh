// @ts-ignore - redis is optional
let createClient;
try {
    createClient = require("redis").createClient;
}
catch {
    // Redis not installed, use file locks only
}
import fs from "fs";
import path from "path";
export async function acquireLock(key, ttlSec = 60) {
    const url = process.env.REDIS_URL;
    if (url && createClient) {
        const c = createClient({ url });
        await c.connect();
        const ok = await c.set(`lock:${key}`, "1", { NX: true, EX: ttlSec });
        if (!ok)
            throw new Error("LOCKED");
        const release = async () => {
            try {
                await c.del(`lock:${key}`);
                await c.quit();
            }
            catch { }
        };
        return { key, release };
    }
    // fallback file-lock
    const dir = path.join(".ffdh", ".locks");
    fs.mkdirSync(dir, { recursive: true });
    const f = path.join(dir, key.replace(/[^a-zA-Z0-9:_-]/g, "_"));
    if (fs.existsSync(f))
        throw new Error("LOCKED");
    fs.writeFileSync(f, "1");
    return {
        key,
        release: async () => {
            try {
                fs.unlinkSync(f);
            }
            catch { }
        },
    };
}
//# sourceMappingURL=locks.js.map