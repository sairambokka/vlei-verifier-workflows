import path = require("path");
import fs = require("fs");
import { SignifyClient } from "signify-ts";

export async function getConfig(configFilePath: string) {
  let dirPath = "../../src/config/";
  const configJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, dirPath) + configFilePath, "utf-8"),
  );
  return configJson;
}

export async function getGrantedCredential(
  client: SignifyClient,
  credId: string,
): Promise<any> {
  const credentialList = await client.credentials().list({
    filter: { "-d": credId },
  });
  let credential: any;
  if (credentialList.length > 0) {
    credential = credentialList[0];
  }
  return credential;
}

export interface ApiUser {
  roleClient: any;
  ecrAid: any;
  creds: Array<any>;
  lei: string;
  uploadDig: string;
  idAlias: string;
}


