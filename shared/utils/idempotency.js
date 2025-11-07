import crypto from "crypto";
export function makeIdempotencyKey(name, version, inputs) {
    const norm = JSON.stringify(inputs ?? {});
    return crypto
        .createHash("sha256")
        .update(`${name}@${version}::${norm}`)
        .digest("hex");
}
//# sourceMappingURL=idempotency.js.map