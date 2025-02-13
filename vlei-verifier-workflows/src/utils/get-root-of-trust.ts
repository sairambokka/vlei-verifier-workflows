import { getOrCreateClients } from "./test-util";

export async function getRootOfTrust(configJson: any): Promise<any> {
    if (hasGLEIFWithMultisig(configJson)) {
        return await getRootOfTrustMultisig(configJson);
    } else {
        return await getRootOfTrustSinglesig(configJson);
    }
}

function hasGLEIFWithMultisig(data: any): boolean {
    return data.users.some(
        (user: any) =>
            (user.type === "GLEIF" || user.type === "GLEIF_EXTERNAL") &&
            user.identifiers.some((id: any) => data.identifiers[id]?.identifiers),
    );
}

async function getRootOfTrustMultisig(configJson: any): Promise<any> {
    const rootOfTrustMultisigIdentifierName = configJson.users
        .filter(
            (usr: any) => usr.type == "GLEIF" || usr.type == "GLEIF_EXTERNAL",
        )[0]
        .identifiers.filter((identifier: string) =>
            identifier.includes("multisig"),
        )![0];

    const rootOfTrustIdentifierName = configJson.users
        .filter(
            (usr: any) => usr.type == "GLEIF" || usr.type == "GLEIF_EXTERNAL",
        )[0]
        .identifiers.filter(
            (identifier: string) => !identifier.includes("multisig"),
        )![0];

    const rootOfTrustIdentifierAgent =
        configJson.agents[
        configJson.identifiers[rootOfTrustIdentifierName].agent
        ];
    const rootOfTrustIdentifierSecret =
        configJson.secrets[rootOfTrustIdentifierAgent.secret];
    const clients = await getOrCreateClients(
        1,
        [rootOfTrustIdentifierSecret],
        true,
    );
    const client = clients[clients.length - 1];
    const rootOfTrustAid = await client
        .identifiers()
        .get(rootOfTrustMultisigIdentifierName);

    const oobi = await client
        .oobis()
        .get(rootOfTrustMultisigIdentifierName, "agent");
    let oobiUrl = oobi.oobis[0];
    const url = new URL(oobiUrl);
    if (url.hostname === "keria")
        oobiUrl = oobiUrl.replace("keria", "localhost");
    console.log(`Root of trust OOBI: ${oobiUrl}`);
    const oobiResp = await fetch(oobiUrl);
    const oobiRespBody = await oobiResp.text();    
    return {
        vlei: oobiRespBody,
        aid: rootOfTrustAid.prefix,
        oobi: oobiUrl,
    }
}

async function getRootOfTrustSinglesig(configJson: any): Promise<any> {
    const rootOfTrustIdentifierName = configJson.users.filter(
        (usr: any) => usr.type == "GLEIF",
    )[0].identifiers[0];
    const rootOfTrustIdentifierAgent =
        configJson.agents[
        configJson.identifiers[rootOfTrustIdentifierName].agent
        ];
    const rootOfTrustIdentifierSecret =
        configJson.secrets[rootOfTrustIdentifierAgent.secret];
    const clients = await getOrCreateClients(
        1,
        [rootOfTrustIdentifierSecret],
        true,
    );
    const client = clients[clients.length - 1];
    const rootOfTrustAid = await client
        .identifiers()
        .get(rootOfTrustIdentifierName);

    const oobi = await client.oobis().get(rootOfTrustIdentifierName);
    let oobiUrl = oobi.oobis[0];
    console.log(`Root of trust OOBI: ${oobiUrl}`);
    const url = new URL(oobiUrl);
    if (url.hostname === "keria")
        oobiUrl = oobiUrl.replace("keria", "localhost");
    const oobiResp = await fetch(oobiUrl);
    const oobiRespBody = await oobiResp.text();
    return {
        vlei: oobiRespBody,
        aid: rootOfTrustAid.prefix,
        oobi: oobiUrl,
    }
}