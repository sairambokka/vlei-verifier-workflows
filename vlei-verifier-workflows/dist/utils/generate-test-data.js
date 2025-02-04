"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTestData = void 0;
const testDataDir = "test_data";
const fs = require("fs");
const path = require("path");
async function buildTestData(testData, testName, issueName, fileNamePrefix = "") {
    let testDataDirPrefixed = path.join(__dirname, "../../test", "data", testDataDir, testName);
    if (!fs.existsSync(testDataDirPrefixed)) {
        fs.mkdirSync(testDataDirPrefixed);
    }
    testData.credential["issueName"] = issueName;
    const testDataJson = JSON.stringify(testData);
    const fileName = `${fileNamePrefix}${testData.lei}_${testData.aid}_${testData.engagementContextRole}.json`;
    await fs.writeFile(`${testDataDirPrefixed}/${fileName}`, testDataJson, "utf8", (err) => {
        if (err)
            throw err;
    });
    return testDataDirPrefixed;
}
exports.buildTestData = buildTestData;
