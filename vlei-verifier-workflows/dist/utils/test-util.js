"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAdmitMessage = exports.sendGrantMessage = exports.getOrCreateRegistry = exports.waitOperation = exports.waitForNotifications = exports.waitAndMarkNotification = exports.waitForCredential = exports.resolveOobi = exports.markNotification = exports.markAndRemoveNotification = exports.getReceivedCredential = exports.deleteOperations = exports.warnNotifications = exports.hasEndRole = exports.getStates = exports.revokeCredential = exports.getOrIssueCredential = exports.getOrCreateIdentifier = exports.getOrCreateContact = exports.getOrCreateClients = exports.getOrCreateClient = exports.getOrCreateAID = exports.getIssuedCredential = exports.getGrantedCredential = exports.getEndRoles = exports.createTimestamp = exports.createAID = exports.createAid = exports.assertNotifications = exports.assertOperations = exports.admitSinglesig = exports.sleep = void 0;
const signify_ts_1 = require("signify-ts");
const retry_1 = require("./retry");
const assert = require("assert");
const resolve_env_1 = require("./resolve-env");
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
async function admitSinglesig(client, aidName, recipientAid) {
    const grantMsgSaid = await waitAndMarkNotification(client, "/exn/ipex/grant");
    const [admit, sigs, aend] = await client.ipex().admit({
        senderName: aidName,
        message: "",
        grantSaid: grantMsgSaid,
        recipient: recipientAid.prefix,
    });
    await client
        .ipex()
        .submitAdmit(aidName, admit, sigs, aend, [recipientAid.prefix]);
}
exports.admitSinglesig = admitSinglesig;
/**
 * Assert that all operations were waited for.
 * <p>This is a postcondition check to make sure all long-running operations have been waited for
 * @see waitOperation
 */
async function assertOperations(...clients) {
    for (const client of clients) {
        const operations = await client.operations().list();
        expect(operations).toHaveLength(0);
    }
}
exports.assertOperations = assertOperations;
/**
 * Assert that all notifications were handled.
 * <p>This is a postcondition check to make sure all notifications have been handled
 * @see markNotification
 * @see markAndRemoveNotification
 */
async function assertNotifications(...clients) {
    for (const client of clients) {
        const res = await client.notifications().list();
        const notes = res.notes.filter((i) => i.r === false);
        expect(notes).toHaveLength(0);
    }
}
exports.assertNotifications = assertNotifications;
async function createAid(client, name) {
    const [prefix, oobi] = await getOrCreateIdentifier(client, name);
    return { prefix, oobi, name };
}
exports.createAid = createAid;
async function createAID(client, name) {
    await getOrCreateIdentifier(client, name);
    const aid = await client.identifiers().get(name);
    console.log(name, "AID:", aid.prefix);
    return aid;
}
exports.createAID = createAID;
function createTimestamp() {
    return new Date().toISOString().replace("Z", "000+00:00");
}
exports.createTimestamp = createTimestamp;
/**
 * Get list of end role authorizations for a Keri idenfitier
 */
async function getEndRoles(client, alias, role) {
    const path = role !== undefined
        ? `/identifiers/${alias}/endroles/${role}`
        : `/identifiers/${alias}/endroles`;
    const response = await client.fetch(path, "GET", null);
    if (!response.ok)
        throw new Error(await response.text());
    const result = await response.json();
    // console.log("getEndRoles", result);
    return result;
}
exports.getEndRoles = getEndRoles;
async function getGrantedCredential(client, credId) {
    const credentialList = await client.credentials().list({
        filter: { "-d": credId },
    });
    let credential;
    if (credentialList.length > 0) {
        assert.equal(credentialList.length, 1);
        credential = credentialList[0];
    }
    return credential;
}
exports.getGrantedCredential = getGrantedCredential;
async function getIssuedCredential(issuerClient, issuerAID, recipientAID, schemaSAID) {
    const credentialList = await issuerClient.credentials().list({
        filter: {
            "-i": issuerAID.prefix,
            "-s": schemaSAID,
            "-a-i": recipientAID.prefix,
        },
    });
    assert(credentialList.length <= 1);
    return credentialList[0];
}
exports.getIssuedCredential = getIssuedCredential;
async function getOrCreateAID(client, name, kargs) {
    try {
        return await client.identifiers().get(name);
    }
    catch {
        console.log("Creating AID", name, ": ", kargs);
        const result = await client.identifiers().create(name, kargs);
        await waitOperation(client, await result.op());
        const aid = await client.identifiers().get(name);
        const op = await client
            .identifiers()
            .addEndRole(name, "agent", client.agent.pre);
        await waitOperation(client, await op.op());
        console.log(name, "AID:", aid.prefix);
        return aid;
    }
}
exports.getOrCreateAID = getOrCreateAID;
/**
 * Connect or boot a SignifyClient instance
 */
async function getOrCreateClient(bran = undefined, getOnly = false) {
    var _a;
    const env = (0, resolve_env_1.resolveEnvironment)();
    await (0, signify_ts_1.ready)();
    bran !== null && bran !== void 0 ? bran : (bran = (0, signify_ts_1.randomPasscode)());
    bran = bran.padEnd(21, "_");
    const client = new signify_ts_1.SignifyClient(env.url, bran, signify_ts_1.Tier.low, env.bootUrl);
    try {
        await client.connect();
    }
    catch (e) {
        if (!getOnly) {
            const res = await client.boot();
            if (!res.ok)
                throw new Error();
            await client.connect();
        }
        else {
            throw new Error("Could not connect to client w/ bran " + bran + e.message);
        }
    }
    console.log("client", {
        agent: (_a = client.agent) === null || _a === void 0 ? void 0 : _a.pre,
        controller: client.controller.pre,
    });
    return client;
}
exports.getOrCreateClient = getOrCreateClient;
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
async function getOrCreateClients(count, brans = undefined, getOnly = false) {
    var _a;
    const tasks = [];
    for (let i = 0; i < count; i++) {
        tasks.push(getOrCreateClient((_a = brans === null || brans === void 0 ? void 0 : brans.at(i)) !== null && _a !== void 0 ? _a : undefined, getOnly));
    }
    const clients = await Promise.all(tasks);
    console.log(`secrets="${clients.map((i) => i.bran).join(",")}"`);
    return clients;
}
exports.getOrCreateClients = getOrCreateClients;
/**
 * Get or resolve a Keri contact
 * @example
 * <caption>Create a Keri contact before running tests</caption>
 * let contact1_id: string;
 * beforeAll(async () => {
 *   contact1_id = await getOrCreateContact(client2, "contact1", name1_oobi);
 * });
 */
async function getOrCreateContact(client, name, oobi) {
    const list = await client.contacts().list(undefined, "alias", `^${name}$`);
    // console.log("contacts.list", list);
    if (list.length > 0) {
        const contact = list[0];
        if (contact.oobi === oobi) {
            // console.log("contacts.id", contact.id);
            return contact.id;
        }
    }
    let op = await client.oobis().resolve(oobi, name);
    op = await waitOperation(client, op);
    return op.response.i;
}
exports.getOrCreateContact = getOrCreateContact;
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
async function getOrCreateIdentifier(client, name, kargs = undefined) {
    var _a;
    let id = undefined;
    try {
        const identfier = await client.identifiers().get(name);
        // console.log("identifiers.get", identfier);
        id = identfier.prefix;
    }
    catch {
        const env = (0, resolve_env_1.resolveEnvironment)();
        kargs !== null && kargs !== void 0 ? kargs : (kargs = env.witnessIds.length > 0
            ? { toad: env.witnessIds.length, wits: env.witnessIds }
            : {});
        const result = await client.identifiers().create(name, kargs);
        let op = await result.op();
        op = await waitOperation(client, op);
        // console.log("identifiers.create", op);
        id = op.response.i;
    }
    const eid = (_a = client.agent) === null || _a === void 0 ? void 0 : _a.pre;
    if (!(await hasEndRole(client, name, "agent", eid))) {
        const result = await client
            .identifiers()
            .addEndRole(name, "agent", eid);
        let op = await result.op();
        op = await waitOperation(client, op);
        console.log("identifiers.addEndRole", op);
    }
    const oobi = await client.oobis().get(name, "agent");
    const result = [id, oobi.oobis[0]];
    console.log(name, result);
    return result;
}
exports.getOrCreateIdentifier = getOrCreateIdentifier;
async function getOrIssueCredential(issuerClient, issuerAid, recipientAid, issuerRegistry, credData, schema, rules, source, privacy = false) {
    const credentialList = await issuerClient.credentials().list();
    if (credentialList.length > 0) {
        const credential = credentialList.find((cred) => cred.sad.s === schema &&
            cred.sad.i === issuerAid.prefix &&
            cred.sad.a.i === recipientAid.prefix &&
            cred.sad.a.AID === credData.AID &&
            cred.status.et != "rev");
        if (credential)
            return credential;
    }
    const issResult = await issuerClient.credentials().issue(issuerAid.name, {
        ri: issuerRegistry.regk,
        s: schema,
        u: privacy ? new signify_ts_1.Salter({}).qb64 : undefined,
        a: {
            i: recipientAid.prefix,
            u: privacy ? new signify_ts_1.Salter({}).qb64 : undefined,
            ...credData,
        },
        r: rules,
        e: source,
    });
    await waitOperation(issuerClient, issResult.op);
    const credential = await issuerClient.credentials().get(issResult.acdc.ked.d);
    return credential;
}
exports.getOrIssueCredential = getOrIssueCredential;
async function revokeCredential(issuerClient, issuerAid, credentialSaid) {
    const credentialList = await issuerClient.credentials().list();
    const revResult = await issuerClient
        .credentials()
        .revoke(issuerAid.name, credentialSaid);
    await waitOperation(issuerClient, revResult.op);
    const credential = await issuerClient.credentials().get(credentialSaid);
    return credential;
}
exports.revokeCredential = revokeCredential;
async function getStates(client, prefixes) {
    const participantStates = await Promise.all(prefixes.map((p) => client.keyStates().get(p)));
    return participantStates.map((s) => s[0]);
}
exports.getStates = getStates;
/**
 * Test if end role is authorized for a Keri identifier
 */
async function hasEndRole(client, alias, role, eid) {
    const list = await getEndRoles(client, alias, role);
    for (const i of list) {
        if (i.role === role && i.eid === eid) {
            return true;
        }
    }
    return false;
}
exports.hasEndRole = hasEndRole;
/**
 * Logs a warning for each un-handled notification.
 * <p>Replace warnNotifications with assertNotifications when test handles all notifications
 * @see assertNotifications
 */
async function warnNotifications(...clients) {
    let count = 0;
    for (const client of clients) {
        const res = await client.notifications().list();
        const notes = res.notes.filter((i) => i.r === false);
        if (notes.length > 0) {
            count += notes.length;
            console.warn("notifications", notes);
        }
    }
    expect(count).toBeGreaterThan(0); // replace warnNotifications with assertNotifications
}
exports.warnNotifications = warnNotifications;
async function deleteOperations(client, op) {
    var _a;
    if ((_a = op.metadata) === null || _a === void 0 ? void 0 : _a.depends) {
        await deleteOperations(client, op.metadata.depends);
    }
    await client.operations().delete(op.name);
}
exports.deleteOperations = deleteOperations;
async function getReceivedCredential(client, credId) {
    const credentialList = await client.credentials().list({
        filter: {
            "-d": credId,
        },
    });
    let credential;
    if (credentialList.length > 0) {
        assert.equal(credentialList.length, 1);
        credential = credentialList[0];
    }
    return credential;
}
exports.getReceivedCredential = getReceivedCredential;
/**
 * Mark and remove notification.
 */
async function markAndRemoveNotification(client, note) {
    try {
        await client.notifications().mark(note.i);
    }
    finally {
        await client.notifications().delete(note.i);
    }
}
exports.markAndRemoveNotification = markAndRemoveNotification;
/**
 * Mark notification as read.
 */
async function markNotification(client, note) {
    await client.notifications().mark(note.i);
}
exports.markNotification = markNotification;
async function resolveOobi(client, oobi, alias) {
    const op = await client.oobis().resolve(oobi, alias);
    await waitOperation(client, op);
}
exports.resolveOobi = resolveOobi;
async function waitForCredential(client, credSAID, MAX_RETRIES = 10) {
    let retryCount = 0;
    while (retryCount < MAX_RETRIES) {
        const cred = await getReceivedCredential(client, credSAID);
        if (cred)
            return cred;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(` retry-${retryCount}: No credentials yet...`);
        retryCount = retryCount + 1;
    }
    throw Error("Credential SAID: " + credSAID + " has not been received");
}
exports.waitForCredential = waitForCredential;
async function waitAndMarkNotification(client, route) {
    var _a, _b;
    const notes = await waitForNotifications(client, route);
    await Promise.all(notes.map((note) => {
        client.notifications().mark(note.i);
    }));
    return (_b = (_a = notes[notes.length - 1]) === null || _a === void 0 ? void 0 : _a.a.d) !== null && _b !== void 0 ? _b : "";
}
exports.waitAndMarkNotification = waitAndMarkNotification;
async function waitForNotifications(client, route, options = {}) {
    return (0, retry_1.retry)(async () => {
        const response = await client
            .notifications()
            .list();
        const notes = response.notes.filter((note) => note.a.r === route && note.r === false);
        if (!notes.length) {
            throw new Error(`No notifications with route ${route}`);
        }
        return notes;
    }, options);
}
exports.waitForNotifications = waitForNotifications;
/**
 * Poll for operation to become completed.
 * Removes completed operation
 */
async function waitOperation(client, op, signal) {
    if (typeof op === "string") {
        op = await client.operations().get(op);
    }
    const oplist = await client.operations().list();
    op = await client
        .operations()
        .wait(op, { signal: signal !== null && signal !== void 0 ? signal : AbortSignal.timeout(60000) });
    await deleteOperations(client, op);
    return op;
}
exports.waitOperation = waitOperation;
async function getOrCreateRegistry(client, aid, registryName) {
    let registries = await client.registries().list(aid.name);
    registries = registries.filter((reg) => reg.name == registryName);
    if (registries.length > 0) {
        assert.equal(registries.length, 1);
    }
    else {
        const regResult = await client
            .registries()
            .create({ name: aid.name, registryName: registryName });
        await waitOperation(client, await regResult.op());
        registries = await client.registries().list(aid.name);
        registries = registries.filter((reg) => reg.name == registryName);
    }
    console.log(registries);
    return registries[0];
}
exports.getOrCreateRegistry = getOrCreateRegistry;
async function sendGrantMessage(senderClient, senderAid, recipientAid, credential) {
    const [grant, gsigs, gend] = await senderClient.ipex().grant({
        senderName: senderAid.name,
        acdc: new signify_ts_1.Serder(credential.sad),
        anc: new signify_ts_1.Serder(credential.anc),
        iss: new signify_ts_1.Serder(credential.iss),
        ancAttachment: credential.ancAttachment,
        recipient: recipientAid.prefix,
        datetime: createTimestamp(),
    });
    let op = await senderClient
        .ipex()
        .submitGrant(senderAid.name, grant, gsigs, gend, [recipientAid.prefix]);
    op = await waitOperation(senderClient, op);
}
exports.sendGrantMessage = sendGrantMessage;
async function sendAdmitMessage(senderClient, senderAid, recipientAid) {
    const notifications = await waitForNotifications(senderClient, "/exn/ipex/grant");
    assert.equal(notifications.length, 1);
    const grantNotification = notifications[0];
    const [admit, sigs, aend] = await senderClient.ipex().admit({
        senderName: senderAid.name,
        message: "",
        grantSaid: grantNotification.a.d,
        recipient: recipientAid.prefix,
        datetime: createTimestamp(),
    });
    let op = await senderClient
        .ipex()
        .submitAdmit(senderAid.name, admit, sigs, aend, [recipientAid.prefix]);
    op = await waitOperation(senderClient, op);
    await markAndRemoveNotification(senderClient, grantNotification);
}
exports.sendAdmitMessage = sendAdmitMessage;
