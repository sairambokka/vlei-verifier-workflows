export interface RetryOptions {
    maxSleep?: number;
    minSleep?: number;
    maxRetries?: number;
    timeout?: number;
    signal?: AbortSignal;
}
export declare function retry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
