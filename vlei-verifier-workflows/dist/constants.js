"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownPrefix = exports.LE_INTERNAL_NAME = exports.QVI_INTERNAL_NAME = exports.RULES = exports.SCHEMAS = exports.CRED_RETRY_DEFAULTS = exports.OOR_AUTH_RULES = exports.OOR_RULES = exports.ECR_AUTH_RULES = exports.ECR_RULES = exports.LE_RULES = exports.OOR_SCHEMA_URL = exports.OOR_AUTH_SCHEMA_URL = exports.ECR_SCHEMA_URL = exports.ECR_AUTH_SCHEMA_URL = exports.LE_SCHEMA_URL = exports.QVI_SCHEMA_URL = exports.vLEIServerHostUrl = exports.OOR_SCHEMA_SAID = exports.OOR_AUTH_SCHEMA_SAID = exports.ECR_SCHEMA_SAID = exports.ECR_AUTH_SCHEMA_SAID = exports.LE_SCHEMA_SAID = exports.QVI_SCHEMA_SAID = exports.witnessIds = exports.vleiServerUrl = void 0;
const signify_ts_1 = require("signify-ts");
const resolve_env_1 = require("./utils/resolve-env");
_a = (0, resolve_env_1.resolveEnvironment)(), exports.vleiServerUrl = _a.vleiServerUrl, exports.witnessIds = _a.witnessIds;
exports.QVI_SCHEMA_SAID = "EBfdlu8R27Fbx-ehrqwImnK-8Cm79sqbAQ4MmvEAYqao";
exports.LE_SCHEMA_SAID = "ENPXp1vQzRF6JwIuS-mp2U8Uf1MoADoP_GqQ62VsDZWY";
exports.ECR_AUTH_SCHEMA_SAID = "EH6ekLjSr8V32WyFbGe1zXjTzFs9PkTYmupJ9H65O14g";
exports.ECR_SCHEMA_SAID = "EEy9PkikFcANV1l7EHukCeXqrzT1hNZjGlUk7wuMO5jw";
exports.OOR_AUTH_SCHEMA_SAID = "EKA57bKBKxr_kN7iN5i7lMUxpMG-s19dRcmov1iDxz-E";
exports.OOR_SCHEMA_SAID = "EBNaNu-M9P5cgrnfl2Fvymy4E_jvxxyjb70PRtiANlJy";
exports.vLEIServerHostUrl = `${exports.vleiServerUrl}/oobi`;
exports.QVI_SCHEMA_URL = `${exports.vLEIServerHostUrl}/${exports.QVI_SCHEMA_SAID}`;
exports.LE_SCHEMA_URL = `${exports.vLEIServerHostUrl}/${exports.LE_SCHEMA_SAID}`;
exports.ECR_AUTH_SCHEMA_URL = `${exports.vLEIServerHostUrl}/${exports.ECR_AUTH_SCHEMA_SAID}`;
exports.ECR_SCHEMA_URL = `${exports.vLEIServerHostUrl}/${exports.ECR_SCHEMA_SAID}`;
exports.OOR_AUTH_SCHEMA_URL = `${exports.vLEIServerHostUrl}/${exports.OOR_AUTH_SCHEMA_SAID}`;
exports.OOR_SCHEMA_URL = `${exports.vLEIServerHostUrl}/${exports.OOR_SCHEMA_SAID}`;
exports.LE_RULES = signify_ts_1.Saider.saidify({
    d: "",
    usageDisclaimer: {
        l: "Usage of a valid, unexpired, and non-revoked vLEI Credential, as defined in the associated Ecosystem Governance Framework, does not assert that the Legal Entity is trustworthy, honest, reputable in its business dealings, safe to do business with, or compliant with any laws or that an implied or expressly intended purpose will be fulfilled.",
    },
    issuanceDisclaimer: {
        l: "All information in a valid, unexpired, and non-revoked vLEI Credential, as defined in the associated Ecosystem Governance Framework, is accurate as of the date the validation process was complete. The vLEI Credential has been issued to the legal entity or person named in the vLEI Credential as the subject; and the qualified vLEI Issuer exercised reasonable care to perform the validation process set forth in the vLEI Ecosystem Governance Framework.",
    },
})[1];
exports.ECR_RULES = signify_ts_1.Saider.saidify({
    d: "",
    usageDisclaimer: {
        l: "Usage of a valid, unexpired, and non-revoked vLEI Credential, as defined in the associated Ecosystem Governance Framework, does not assert that the Legal Entity is trustworthy, honest, reputable in its business dealings, safe to do business with, or compliant with any laws or that an implied or expressly intended purpose will be fulfilled.",
    },
    issuanceDisclaimer: {
        l: "All information in a valid, unexpired, and non-revoked vLEI Credential, as defined in the associated Ecosystem Governance Framework, is accurate as of the date the validation process was complete. The vLEI Credential has been issued to the legal entity or person named in the vLEI Credential as the subject; and the qualified vLEI Issuer exercised reasonable care to perform the validation process set forth in the vLEI Ecosystem Governance Framework.",
    },
    privacyDisclaimer: {
        l: "It is the sole responsibility of Holders as Issuees of an ECR vLEI Credential to present that Credential in a privacy-preserving manner using the mechanisms provided in the Issuance and Presentation Exchange (IPEX) protocol specification and the Authentic Chained Data Container (ACDC) specification. https://github.com/WebOfTrust/IETF-IPEX and https://github.com/trustoverip/tswg-acdc-specification.",
    },
})[1];
exports.ECR_AUTH_RULES = signify_ts_1.Saider.saidify({
    d: "",
    usageDisclaimer: {
        l: "Usage of a valid, unexpired, and non-revoked vLEI Credential, as defined in the associated Ecosystem Governance Framework, does not assert that the Legal Entity is trustworthy, honest, reputable in its business dealings, safe to do business with, or compliant with any laws or that an implied or expressly intended purpose will be fulfilled.",
    },
    issuanceDisclaimer: {
        l: "All information in a valid, unexpired, and non-revoked vLEI Credential, as defined in the associated Ecosystem Governance Framework, is accurate as of the date the validation process was complete. The vLEI Credential has been issued to the legal entity or person named in the vLEI Credential as the subject; and the qualified vLEI Issuer exercised reasonable care to perform the validation process set forth in the vLEI Ecosystem Governance Framework.",
    },
    privacyDisclaimer: {
        l: "Privacy Considerations are applicable to QVI ECR AUTH vLEI Credentials.  It is the sole responsibility of QVIs as Issuees of QVI ECR AUTH vLEI Credentials to present these Credentials in a privacy-preserving manner using the mechanisms provided in the Issuance and Presentation Exchange (IPEX) protocol specification and the Authentic Chained Data Container (ACDC) specification.  https://github.com/WebOfTrust/IETF-IPEX and https://github.com/trustoverip/tswg-acdc-specification.",
    },
})[1];
exports.OOR_RULES = exports.LE_RULES;
exports.OOR_AUTH_RULES = exports.LE_RULES;
exports.CRED_RETRY_DEFAULTS = {
    maxSleep: 100000,
    minSleep: 2000,
    maxRetries: undefined,
    timeout: 500000,
};
exports.SCHEMAS = {
    QVI_SCHEMA_SAID: exports.QVI_SCHEMA_SAID,
    LE_SCHEMA_SAID: exports.LE_SCHEMA_SAID,
    ECR_AUTH_SCHEMA_SAID: exports.ECR_AUTH_SCHEMA_SAID,
    ECR_SCHEMA_SAID: exports.ECR_SCHEMA_SAID,
    OOR_AUTH_SCHEMA_SAID: exports.OOR_AUTH_SCHEMA_SAID,
    OOR_SCHEMA_SAID: exports.OOR_SCHEMA_SAID,
};
exports.RULES = {
    LE_RULES: exports.LE_RULES,
    ECR_RULES: exports.ECR_RULES,
    ECR_AUTH_RULES: exports.ECR_AUTH_RULES,
    OOR_RULES: exports.OOR_RULES,
    OOR_AUTH_RULES: exports.OOR_AUTH_RULES,
};
exports.QVI_INTERNAL_NAME = "QVI";
exports.LE_INTERNAL_NAME = "LE";
exports.unknownPrefix = "EBcIURLpxmVwahksgrsGW6_dUw0zBhyEHYFk17eWrZfk";
