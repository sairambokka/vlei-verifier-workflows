import signify, { CreateIdentiferArgs, HabState, Operation, SignifyClient } from "signify-ts";
import { RetryOptions } from "./retry";
export interface Aid {
    name: string;
    prefix: string;
    oobi: string;
}
export interface Notification {
    i: string;
    dt: string;
    r: boolean;
    a: {
        r: string;
        d?: string;
        m?: string;
    };
}
export declare function sleep(ms: number): Promise<void>;
export declare function admitSinglesig(client: SignifyClient, aidName: string, recipientAid: HabState): Promise<void>;
/**
 * Assert that all operations were waited for.
 * <p>This is a postcondition check to make sure all long-running operations have been waited for
 * @see waitOperation
 */
export declare function assertOperations(...clients: SignifyClient[]): Promise<void>;
/**
 * Assert that all notifications were handled.
 * <p>This is a postcondition check to make sure all notifications have been handled
 * @see markNotification
 * @see markAndRemoveNotification
 */
export declare function assertNotifications(...clients: SignifyClient[]): Promise<void>;
export declare function createAid(client: SignifyClient, name: string): Promise<Aid>;
export declare function createAID(client: signify.SignifyClient, name: string): Promise<signify.HabState>;
export declare function createTimestamp(): string;
/**
 * Get list of end role authorizations for a Keri idenfitier
 */
export declare function getEndRoles(client: SignifyClient, alias: string, role?: string): Promise<any>;
export declare function getGrantedCredential(client: SignifyClient, credId: string): Promise<any>;
export declare function getIssuedCredential(issuerClient: SignifyClient, issuerAID: HabState, recipientAID: HabState, schemaSAID: string): Promise<any>;
export declare function getOrCreateAID(client: SignifyClient, name: string, kargs: CreateIdentiferArgs): Promise<HabState>;
/**
 * Connect or boot a SignifyClient instance
 */
export declare function getOrCreateClient(bran?: string | undefined, getOnly?: boolean): Promise<SignifyClient>;
/**
 * Connect or boot a number of SignifyClient instances
 * @example
 * <caption>Create two clients with random secrets</caption>
 * let client1: SignifyClient, client2: SignifyClient;
 * beforeAll(async () => {
 *   [client1, client2] = await getOrCreateClients(2);
 * });
 * @example
 * <caption>Launch jest from shell with pre-defined secrets</caption>
 */
export declare function getOrCreateClients(count: number, brans?: string[] | undefined, getOnly?: boolean): Promise<SignifyClient[]>;
/**
 * Get or resolve a Keri contact
 * @example
 * <caption>Create a Keri contact before running tests</caption>
 * let contact1_id: string;
 * beforeAll(async () => {
 *   contact1_id = await getOrCreateContact(client2, "contact1", name1_oobi);
 * });
 */
export declare function getOrCreateContact(client: SignifyClient, name: string, oobi: string): Promise<string>;
/**
 * Get or create a Keri identifier. Uses default witness config from `resolveEnvironment`
 * @example
 * <caption>Create a Keri identifier before running tests</caption>
 * let name1_id: string, name1_oobi: string;
 * beforeAll(async () => {
 *   [name1_id, name1_oobi] = await getOrCreateIdentifier(client1, "name1");
 * });
 * @see resolveEnvironment
 */
export declare function getOrCreateIdentifier(client: SignifyClient, name: string, kargs?: CreateIdentiferArgs | undefined): Promise<[string, string]>;
export declare function getOrIssueCredential(issuerClient: SignifyClient, issuerAid: Aid, recipientAid: Aid, issuerRegistry: {
    regk: string;
}, credData: any, schema: string, rules?: any, source?: any, privacy?: boolean): Promise<any>;
export declare function revokeCredential(issuerClient: SignifyClient, issuerAid: Aid, credentialSaid: string): Promise<any>;
export declare function getStates(client: SignifyClient, prefixes: string[]): Promise<any[]>;
/**
 * Test if end role is authorized for a Keri identifier
 */
export declare function hasEndRole(client: SignifyClient, alias: string, role: string, eid: string): Promise<boolean>;
/**
 * Logs a warning for each un-handled notification.
 * <p>Replace warnNotifications with assertNotifications when test handles all notifications
 * @see assertNotifications
 */
export declare function warnNotifications(...clients: SignifyClient[]): Promise<void>;
export declare function deleteOperations<T = any>(client: SignifyClient, op: Operation<T>): Promise<void>;
export declare function getReceivedCredential(client: SignifyClient, credId: string): Promise<any>;
/**
 * Mark and remove notification.
 */
export declare function markAndRemoveNotification(client: SignifyClient, note: Notification): Promise<void>;
/**
 * Mark notification as read.
 */
export declare function markNotification(client: SignifyClient, note: Notification): Promise<void>;
export declare function resolveOobi(client: SignifyClient, oobi: string, alias?: string): Promise<void>;
export declare function waitForCredential(client: SignifyClient, credSAID: string, MAX_RETRIES?: number): Promise<any>;
export declare function waitAndMarkNotification(client: SignifyClient, route: string): Promise<string>;
export declare function waitForNotifications(client: SignifyClient, route: string, options?: RetryOptions): Promise<Notification[]>;
/**
 * Poll for operation to become completed.
 * Removes completed operation
 */
export declare function waitOperation<T = any>(client: SignifyClient, op: Operation<T> | string, signal?: AbortSignal): Promise<Operation<T>>;
export declare function getOrCreateRegistry(client: SignifyClient, aid: Aid, registryName: string): Promise<{
    name: string;
    regk: string;
}>;
export declare function sendGrantMessage(senderClient: SignifyClient, senderAid: Aid, recipientAid: Aid, credential: any): Promise<void>;
export declare function sendAdmitMessage(senderClient: SignifyClient, senderAid: Aid, recipientAid: Aid): Promise<void>;
