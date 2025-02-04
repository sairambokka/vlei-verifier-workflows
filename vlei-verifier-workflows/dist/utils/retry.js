"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
const promises_1 = require("timers/promises");
async function retry(fn, options = {}) {
    const { maxSleep = 1000, minSleep = 10, maxRetries, timeout = 10000, } = options;
    const increaseFactor = 50;
    let retries = 0;
    let cause = null;
    const start = Date.now();
    while ((options.signal === undefined || options.signal.aborted === false) &&
        Date.now() - start < timeout &&
        (maxRetries === undefined || retries < maxRetries)) {
        try {
            const result = await fn();
            return result;
        }
        catch (err) {
            cause = err;
            const delay = Math.max(minSleep, Math.min(maxSleep, 2 ** retries * increaseFactor));
            console.log(`Retrying in ${delay}ms`);
            retries++;
            await (0, promises_1.setTimeout)(delay, undefined, { signal: options.signal });
        }
    }
    if (!cause) {
        cause = new Error(`Failed after ${retries} attempts`);
    }
    Object.assign(cause, { retries, maxAttempts: maxRetries });
    throw cause;
}
exports.retry = retry;
