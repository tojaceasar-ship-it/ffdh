import crypto from "crypto";

export function makeIdempotencyKey(
  name: string,
  version: string,
  inputs: unknown
): string {
  const norm = JSON.stringify(inputs ?? {});
  return crypto
    .createHash("sha256")
    .update(`${name}@${version}::${norm}`)
    .digest("hex");
}

