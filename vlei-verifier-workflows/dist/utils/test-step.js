"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.step = void 0;
/**
 * Provides a way to group logically related test steps in an integration test
 *
 * Can be useful to provide logging when a step succeeds, or to be able to use
 * locally scoped variables.
 *
 * In long tests it can also be useful to create visual groups.
 * @param description
 * @param fn
 * @returns
 */
async function step(description, fn) {
    try {
        const start = Date.now();
        const response = await fn();
        // Bypassing console.log to avoid the verbose log output from jest
        process.stdout.write(`Step - ${description} - finished (${Date.now() - start}ms)\n`);
        return response;
    }
    catch (error) {
        throw new Error(`Step - ${description} - failed`);
    }
}
exports.step = step;
