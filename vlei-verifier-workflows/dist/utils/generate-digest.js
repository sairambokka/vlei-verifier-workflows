"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFileDigest = void 0;
const crypto_1 = require("crypto");
function generateFileDigest(buffer) {
    const algo = "sha256";
    const digest = Buffer.from(hash(buffer, algo));
    const prefixeDigest = `${algo}-${digest}`;
    return prefixeDigest;
}
exports.generateFileDigest = generateFileDigest;
function hash(data, algo) {
    return (0, crypto_1.createHash)(algo).update(data).digest("hex");
}
