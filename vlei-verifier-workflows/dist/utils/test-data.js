"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrantedCredential = exports.getConfig = void 0;
const path = require("path");
const fs = require("fs");
async function getConfig(configFilePath) {
    let dirPath = "../../src/config/";
    const configJson = JSON.parse(fs.readFileSync(path.join(__dirname, dirPath) + configFilePath, "utf-8"));
    return configJson;
}
exports.getConfig = getConfig;
async function getGrantedCredential(client, credId) {
    const credentialList = await client.credentials().list({
        filter: { "-d": credId },
    });
    let credential;
    if (credentialList.length > 0) {
        credential = credentialList[0];
    }
    return credential;
}
exports.getGrantedCredential = getGrantedCredential;
