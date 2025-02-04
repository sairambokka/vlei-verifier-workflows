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
export declare function step<T>(description: string, fn: () => Promise<T>): Promise<T>;
