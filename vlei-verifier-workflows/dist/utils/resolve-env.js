"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEnvironment = void 0;
const WAN = "BBilc4-L3tFUnfM_wJr4S4OJanAv_VmF_dJNN6vkf2Ha";
const WIL = "BLskRTInXnMxWaGqcpSyMgo0nYbalW99cGZESrz3zapM";
const WES = "BIKKuvBwpmDVA4Ds-EpL5bt9OqPzWPja2LigFYZN2YfX";
function resolveEnvironment(input) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const preset = (_a = input !== null && input !== void 0 ? input : process.env.TEST_ENVIRONMENT) !== null && _a !== void 0 ? _a : "docker";
    let env;
    switch (preset) {
        case "docker":
            env = {
                preset: preset,
                url: process.env.KERIA || "http://127.0.0.1:3901",
                bootUrl: process.env.KERIA_BOOT || "http://127.0.0.1:3903",
                witnessUrls: process.env.WITNESS_URLS === ""
                    ? []
                    : ((_b = process.env.WITNESS_URLS) === null || _b === void 0 ? void 0 : _b.split(",")) || [
                        "http://witness-demo:5642",
                        "http://witness-demo:5643",
                        "http://witness-demo:5644",
                    ],
                witnessIds: process.env.WITNESS_IDS === ""
                    ? []
                    : ((_c = process.env.WITNESS_IDS) === null || _c === void 0 ? void 0 : _c.split(",")) || [WAN, WIL, WES],
                vleiServerUrl: process.env.VLEI_SERVER || "http://vlei-server:7723",
                apiBaseUrl: process.env.REG_PILOT_API || "http://127.0.0.1:8000",
                proxyBaseUrl: process.env.REG_PILOT_PROXY || "http://127.0.0.1:3434",
                verifierBaseUrl: process.env.VLEI_VERIFIER || "http://127.0.0.1:7676",
                workflow: process.env.WORKFLOW || "singlesig-single-user-light.yaml",
                configuration: process.env.CONFIGURATION ||
                    "configuration-singlesig-single-user-light.json",
            };
            break;
        case "local":
            env = {
                preset: preset,
                url: process.env.KERIA || "http://127.0.0.1:3901",
                bootUrl: process.env.KERIA_BOOT || "http://127.0.0.1:3903",
                vleiServerUrl: process.env.VLEI_SERVER || "http://localhost:7723",
                witnessUrls: process.env.WITNESS_URLS === ""
                    ? []
                    : ((_d = process.env.WITNESS_URLS) === null || _d === void 0 ? void 0 : _d.split(",")) || [
                        "http://localhost:5642",
                        "http://localhost:5643",
                        "http://localhost:5644",
                    ],
                witnessIds: process.env.WITNESS_IDS === ""
                    ? []
                    : ((_e = process.env.WITNESS_IDS) === null || _e === void 0 ? void 0 : _e.split(",")) || [WAN, WIL, WES],
                apiBaseUrl: process.env.REG_PILOT_API || "http://localhost:8000",
                proxyBaseUrl: process.env.REG_PILOT_PROXY || "http://localhost:3434",
                verifierBaseUrl: process.env.VLEI_VERIFIER || "http://localhost:7676",
                workflow: process.env.WORKFLOW || "singlesig-single-user.yaml",
                configuration: process.env.CONFIGURATION ||
                    "configuration-singlesig-single-user.json",
            };
            break;
        case "rootsid_dev":
            env = {
                preset: preset,
                url: process.env.KERIA || "https://keria-dev.rootsid.cloud/admin",
                bootUrl: process.env.KERIA_BOOT || "https://keria-dev.rootsid.cloud",
                witnessUrls: process.env.WITNESS_URLS === ""
                    ? []
                    : ((_f = process.env.WITNESS_URLS) === null || _f === void 0 ? void 0 : _f.split(",")) || [
                        "https://witness-dev01.rootsid.cloud",
                        "https://witness-dev02.rootsid.cloud",
                        "https://witness-dev03.rootsid.cloud",
                    ],
                witnessIds: process.env.WITNESS_IDS === ""
                    ? []
                    : ((_g = process.env.WITNESS_IDS) === null || _g === void 0 ? void 0 : _g.split(",")) || [WAN, WIL, WES],
                vleiServerUrl: process.env.VLEI_SERVER || "http://schemas.rootsid.cloud",
                apiBaseUrl: process.env.REG_PILOT_API || "https://reg-api-dev.rootsid.cloud",
                proxyBaseUrl: process.env.REG_PILOT_PROXY || "No RootsID dev proxy set",
                verifierBaseUrl: process.env.VLEI_VERIFIER || "RootsID dev verifier not set",
                workflow: process.env.WORKFLOW || "singlesig-single-user-light.yaml",
                configuration: process.env.CONFIGURATION ||
                    "configuration-singlesig-single-user-light.json",
            };
            break;
        case "rootsid_test":
            env = {
                preset: preset,
                url: process.env.KERIA || "https://keria-test.rootsid.cloud/admin",
                bootUrl: process.env.KERIA_BOOT || "https://keria-test.rootsid.cloud",
                witnessUrls: process.env.WITNESS_URLS === ""
                    ? []
                    : ((_h = process.env.WITNESS_URLS) === null || _h === void 0 ? void 0 : _h.split(",")) || [
                        "http://wit1.rootsid.cloud:5501",
                        "http://wit2.rootsid.cloud:5503",
                        "http://wit3.rootsid.cloud:5505",
                    ],
                witnessIds: process.env.WITNESS_IDS === ""
                    ? []
                    : ((_j = process.env.WITNESS_IDS) === null || _j === void 0 ? void 0 : _j.split(",")) || [
                        "BNZBr3xjR0Vtat_HxFJnfBwQcpDj3LGl4h_MCQdmyN-r",
                        "BH_XYb3mBmRB1nBVl8XrKjtuQkcIWYKALY4ZWLVOZjKg",
                        "BAPWdGXGfiFsi3sMvSCPDnoPnEhPp-ZWxK9RYrqCQTa_",
                    ],
                vleiServerUrl: process.env.VLEI_SERVER || "http://schemas.rootsid.cloud",
                apiBaseUrl: process.env.REG_PILOT_API || "https://reg-api-test.rootsid.cloud",
                proxyBaseUrl: process.env.REG_PILOT_PROXY || "No RootsID test proxy set",
                verifierBaseUrl: process.env.VLEI_VERIFIER || "RootsID demo verifier not set",
                workflow: process.env.WORKFLOW || "singlesig-single-user.yaml",
                configuration: process.env.CONFIGURATION ||
                    "configuration-singlesig-single-user.json",
            };
            break;
        default:
            throw new Error(`Unknown test environment preset '${preset}'`);
    }
    console.log("Test environment preset: ", JSON.stringify(env));
    return env;
}
exports.resolveEnvironment = resolveEnvironment;
