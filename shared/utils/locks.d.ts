export interface Lock {
    key: string;
    release: () => Promise<void>;
}
export declare function acquireLock(key: string, ttlSec?: number): Promise<Lock>;
//# sourceMappingURL=locks.d.ts.map