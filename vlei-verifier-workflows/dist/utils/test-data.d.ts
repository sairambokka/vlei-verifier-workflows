import { SignifyClient } from "signify-ts";
export declare function getConfig(configFilePath: string): Promise<any>;
export declare function getGrantedCredential(client: SignifyClient, credId: string): Promise<any>;
export interface ApiUser {
    roleClient: any;
    ecrAid: any;
    creds: Array<any>;
    lei: string;
    uploadDig: string;
    idAlias: string;
}
