"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAidData = exports.buildCredentials = exports.buildUserData = void 0;
async function buildUserData(jsonConfig) {
    let users = new Array();
    const identifiers = structuredClone(jsonConfig.identifiers);
    for (const key of Object.keys(identifiers)) {
        if (identifiers[key]["agent"]) {
            identifiers[key].agent = {
                name: identifiers[key]["agent"],
                secret: jsonConfig.secrets[jsonConfig.agents[identifiers[key]["agent"]]["secret"]],
            };
        }
    }
    for (const user of jsonConfig.users) {
        let curUser = {
            LE: user.LE,
            identifiers: user.identifiers.map((key) => ({
                ...identifiers[key],
            })),
            alias: user.alias,
            type: user.type,
        };
        users.push(curUser);
    }
    return users;
}
exports.buildUserData = buildUserData;
async function buildCredentials(jsonConfig) {
    let credentials = new Map();
    for (const key in jsonConfig.credentials) {
        const cred = jsonConfig.credentials[key];
        let curCred = {
            type: cred.type,
            schema: cred.schema,
            rules: cred.rules,
            privacy: cred.privacy,
            attributes: cred.attributes,
            credSource: cred.credSource,
        };
        credentials.set(key, curCred);
    }
    return credentials;
}
exports.buildCredentials = buildCredentials;
async function buildAidData(jsonConfig) {
    let users = new Array();
    const identifiers = structuredClone(jsonConfig.identifiers);
    for (const key of Object.keys(identifiers)) {
        if (identifiers[key]["agent"]) {
            identifiers[key].agent = {
                name: identifiers[key]["agent"],
                secret: jsonConfig.secrets[jsonConfig.agents[identifiers[key]["agent"]]["secret"]],
            };
        }
    }
    return identifiers;
}
exports.buildAidData = buildAidData;
