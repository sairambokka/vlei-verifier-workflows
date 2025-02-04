"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitAndMarkNotification = exports.startMultisigIncept = exports.multisigRevoke = exports.issueCredentialMultisig = exports.grantMultisig = exports.delegateMultisig = exports.createRegistryMultisig = exports.createAIDMultisig = exports.admitMultisig = exports.addEndRoleMultisig = exports.acceptMultisigIncept = void 0;
const signify_ts_1 = require("signify-ts");
const test_util_1 = require("./test-util");
const assert = require("assert");
async function acceptMultisigIncept(client2, { groupName, localMemberName, msgSaid }) {
    const memberHab = await client2.identifiers().get(localMemberName);
    const res = await client2.groups().getRequest(msgSaid);
    const exn = res[0].exn;
    const icp = exn.e.icp;
    const smids = exn.a.smids;
    const rmids = exn.a.rmids;
    const states = await (0, test_util_1.getStates)(client2, smids);
    const rstates = await (0, test_util_1.getStates)(client2, rmids);
    const icpResult2 = await client2.identifiers().create(groupName, {
        algo: signify_ts_1.Algos.group,
        mhab: memberHab,
        isith: icp.kt,
        nsith: icp.nt,
        toad: parseInt(icp.bt),
        wits: icp.b,
        states: states,
        rstates: rstates,
        delpre: icp.di,
    });
    const op2 = await icpResult2.op();
    const serder = icpResult2.serder;
    const sigs = icpResult2.sigs;
    const sigers = sigs.map((sig) => new signify_ts_1.Siger({ qb64: sig }));
    const ims = (0, signify_ts_1.d)((0, signify_ts_1.messagize)(serder, sigers));
    const atc = ims.substring(serder.size);
    const embeds = {
        icp: [serder, atc],
    };
    const recipients = smids.filter((id) => memberHab.prefix !== id);
    client2
        .exchanges()
        .send(localMemberName, groupName, memberHab, "/multisig/icp", { gid: serder.pre, smids: smids, rmids: smids }, embeds, recipients);
    return op2;
}
exports.acceptMultisigIncept = acceptMultisigIncept;
async function addEndRoleMultisig(client, groupName, aid, otherMembersAIDs, multisigAID, timestamp, isInitiator = false) {
    if (!isInitiator)
        await waitAndMarkNotification(client, "/multisig/rpy");
    const opList = [];
    const members = await client.identifiers().members(multisigAID.name);
    const signings = members["signing"];
    for (const signing of signings) {
        const eid = Object.keys(signing.ends.agent)[0];
        const endRoleResult = await client
            .identifiers()
            .addEndRole(multisigAID.name, "agent", eid, timestamp);
        const op = await endRoleResult.op();
        opList.push(op);
        const rpy = endRoleResult.serder;
        const sigs = endRoleResult.sigs;
        const ghabState1 = multisigAID.state;
        const seal = [
            "SealEvent",
            {
                i: multisigAID.prefix,
                s: ghabState1["ee"]["s"],
                d: ghabState1["ee"]["d"],
            },
        ];
        const sigers = sigs.map((sig) => new signify_ts_1.default.Siger({ qb64: sig }));
        const roleims = signify_ts_1.default.d(signify_ts_1.default.messagize(rpy, sigers, seal, undefined, undefined, false));
        const atc = roleims.substring(rpy.size);
        const roleembeds = {
            rpy: [rpy, atc],
        };
        const recp = otherMembersAIDs.map((aid) => aid.prefix);
        await client
            .exchanges()
            .send(aid.name, groupName, aid, "/multisig/rpy", { gid: multisigAID.prefix }, roleembeds, recp);
    }
    return opList;
}
exports.addEndRoleMultisig = addEndRoleMultisig;
async function admitMultisig(client, aid, otherMembersAIDs, multisigAID, recipientAID, timestamp) {
    const grantMsgSaid = await waitAndMarkNotification(client, "/exn/ipex/grant");
    const [admit, sigs, end] = await client.ipex().admit({
        senderName: multisigAID.name,
        message: "",
        grantSaid: grantMsgSaid,
        recipient: recipientAID.prefix,
        datetime: timestamp,
    });
    await client
        .ipex()
        .submitAdmit(multisigAID.name, admit, sigs, end, [recipientAID.prefix]);
    const mstate = multisigAID.state;
    const seal = [
        "SealEvent",
        { i: multisigAID.prefix, s: mstate["ee"]["s"], d: mstate["ee"]["d"] },
    ];
    const sigers = sigs.map((sig) => new signify_ts_1.default.Siger({ qb64: sig }));
    const ims = signify_ts_1.default.d(signify_ts_1.default.messagize(admit, sigers, seal));
    let atc = ims.substring(admit.size);
    atc += end;
    const gembeds = {
        exn: [admit, atc],
    };
    const recp = otherMembersAIDs.map((aid) => aid.prefix);
    await client
        .exchanges()
        .send(aid.name, "multisig", aid, "/multisig/exn", { gid: multisigAID.prefix }, gembeds, recp);
}
exports.admitMultisig = admitMultisig;
async function createAIDMultisig(client, aid, otherMembersAIDs, groupName, kargs, isInitiator = false) {
    var _a;
    if (!isInitiator)
        await waitAndMarkNotification(client, "/multisig/icp");
    const icpResult = await client.identifiers().create(groupName, kargs);
    const op = await icpResult.op();
    const serder = icpResult.serder;
    const sigs = icpResult.sigs;
    const sigers = sigs.map((sig) => new signify_ts_1.default.Siger({ qb64: sig }));
    const ims = signify_ts_1.default.d(signify_ts_1.default.messagize(serder, sigers));
    const atc = ims.substring(serder.size);
    const embeds = {
        icp: [serder, atc],
    };
    const smids = (_a = kargs.states) === null || _a === void 0 ? void 0 : _a.map((state) => state["i"]);
    const recp = otherMembersAIDs.map((aid) => aid.prefix);
    await client
        .exchanges()
        .send(aid.name, "multisig", aid, "/multisig/icp", { gid: serder.pre, smids: smids, rmids: smids }, embeds, recp);
    return op;
}
exports.createAIDMultisig = createAIDMultisig;
async function createRegistryMultisig(client, aid, otherMembersAIDs, multisigAID, registryName, nonce, isInitiator = false) {
    if (!isInitiator)
        await waitAndMarkNotification(client, "/multisig/vcp");
    const vcpResult = await client.registries().create({
        name: multisigAID.name,
        registryName: registryName,
        nonce: nonce,
    });
    const op = await vcpResult.op();
    const serder = vcpResult.regser;
    const anc = vcpResult.serder;
    const sigs = vcpResult.sigs;
    const sigers = sigs.map((sig) => new signify_ts_1.default.Siger({ qb64: sig }));
    const ims = signify_ts_1.default.d(signify_ts_1.default.messagize(anc, sigers));
    const atc = ims.substring(anc.size);
    const regbeds = {
        vcp: [serder, ""],
        anc: [anc, atc],
    };
    const recp = otherMembersAIDs.map((aid) => aid.prefix);
    await client
        .exchanges()
        .send(aid.name, "registry", aid, "/multisig/vcp", { gid: multisigAID.prefix }, regbeds, recp);
    return op;
}
exports.createRegistryMultisig = createRegistryMultisig;
async function delegateMultisig(client, aid, otherMembersAIDs, multisigAID, anchor, isInitiator = false) {
    if (!isInitiator) {
        const msgSaid = await waitAndMarkNotification(client, "/multisig/ixn");
        console.log(`${aid.name}(${aid.prefix}) received exchange message to join the interaction event`);
        const res = await client.groups().getRequest(msgSaid);
        const exn = res[0].exn;
        const ixn = exn.e.ixn;
        anchor = ixn.a[0];
    }
    // const {delResult, delOp} = await retry(async () => {
    const delResult = await client
        .delegations()
        .approve(multisigAID.name, anchor);
    const appOp = await delResult.op();
    console.log(`Delegator ${aid.name}(${aid.prefix}) approved delegation for ${multisigAID.name} with anchor ${JSON.stringify(anchor)}`);
    assert.equal(JSON.stringify(delResult.serder.ked.a[0]), JSON.stringify(anchor));
    const serder = delResult.serder;
    const sigs = delResult.sigs;
    const sigers = sigs.map((sig) => new signify_ts_1.default.Siger({ qb64: sig }));
    const ims = signify_ts_1.default.d(signify_ts_1.default.messagize(serder, sigers));
    const atc = ims.substring(serder.size);
    const xembeds = {
        ixn: [serder, atc],
    };
    const smids = [aid.prefix, ...otherMembersAIDs.map((aid) => aid.prefix)];
    const recp = otherMembersAIDs.map((aid) => aid.prefix);
    await client
        .exchanges()
        .send(aid.name, multisigAID.name, aid, "/multisig/ixn", { gid: serder.pre, smids: smids, rmids: smids }, xembeds, recp);
    if (isInitiator) {
        console.log(`${aid.name}(${aid.prefix}) initiates delegation interaction event, waiting for others to join...`);
    }
    else {
        console.log(`${aid.name}(${aid.prefix}) joins interaction event`);
    }
    return appOp;
}
exports.delegateMultisig = delegateMultisig;
async function grantMultisig(client, aid, otherMembersAIDs, multisigAID, recipientAID, credential, timestamp, isInitiator = false) {
    if (!isInitiator)
        await waitAndMarkNotification(client, "/multisig/exn");
    const [grant, sigs, end] = await client.ipex().grant({
        senderName: multisigAID.name,
        acdc: new signify_ts_1.Serder(credential.sad),
        anc: new signify_ts_1.Serder(credential.anc),
        iss: new signify_ts_1.Serder(credential.iss),
        recipient: recipientAID.prefix,
        datetime: timestamp,
    });
    await client
        .ipex()
        .submitGrant(multisigAID.name, grant, sigs, end, [recipientAID.prefix]);
    const mstate = multisigAID.state;
    const seal = [
        "SealEvent",
        { i: multisigAID.prefix, s: mstate["ee"]["s"], d: mstate["ee"]["d"] },
    ];
    const sigers = sigs.map((sig) => new signify_ts_1.default.Siger({ qb64: sig }));
    const gims = signify_ts_1.default.d(signify_ts_1.default.messagize(grant, sigers, seal));
    let atc = gims.substring(grant.size);
    atc += end;
    const gembeds = {
        exn: [grant, atc],
    };
    const recp = otherMembersAIDs.map((aid) => aid.prefix);
    await client
        .exchanges()
        .send(aid.name, "multisig", aid, "/multisig/exn", { gid: multisigAID.prefix }, gembeds, recp);
}
exports.grantMultisig = grantMultisig;
async function issueCredentialMultisig(client, aid, otherMembersAIDs, multisigAIDName, kargsIss, isInitiator = false) {
    if (!isInitiator)
        await waitAndMarkNotification(client, "/multisig/iss");
    const credResult = await client
        .credentials()
        .issue(multisigAIDName, kargsIss);
    const op = credResult.op;
    const multisigAID = await client.identifiers().get(multisigAIDName);
    const keeper = client.manager.get(multisigAID);
    const sigs = await keeper.sign(signify_ts_1.default.b(credResult.anc.raw));
    const sigers = sigs.map((sig) => new signify_ts_1.default.Siger({ qb64: sig }));
    const ims = signify_ts_1.default.d(signify_ts_1.default.messagize(credResult.anc, sigers));
    const atc = ims.substring(credResult.anc.size);
    const embeds = {
        acdc: [credResult.acdc, ""],
        iss: [credResult.iss, ""],
        anc: [credResult.anc, atc],
    };
    const recp = otherMembersAIDs.map((aid) => aid.prefix);
    await client
        .exchanges()
        .send(aid.name, "multisig", aid, "/multisig/iss", { gid: multisigAID.prefix }, embeds, recp);
    return op;
}
exports.issueCredentialMultisig = issueCredentialMultisig;
async function multisigRevoke(client, memberName, groupName, rev, anc) {
    const leaderHab = await client.identifiers().get(memberName);
    const groupHab = await client.identifiers().get(groupName);
    const members = await client.identifiers().members(groupName);
    const keeper = client.manager.get(groupHab);
    const sigs = await keeper.sign(signify_ts_1.default.b(anc.raw));
    const sigers = sigs.map((sig) => new signify_ts_1.default.Siger({ qb64: sig }));
    const ims = signify_ts_1.default.d(signify_ts_1.default.messagize(anc, sigers));
    const atc = ims.substring(anc.size);
    const embeds = {
        iss: [rev, ""],
        anc: [anc, atc],
    };
    const recipients = members.signing
        .map((m) => m.aid)
        .filter((aid) => aid !== leaderHab.prefix);
    await client
        .exchanges()
        .send(memberName, "multisig", leaderHab, "/multisig/rev", { gid: groupHab.prefix }, embeds, recipients);
}
exports.multisigRevoke = multisigRevoke;
async function startMultisigIncept(client, { groupName, localMemberName, participants, ...args }) {
    const aid1 = await client.identifiers().get(localMemberName);
    const participantStates = await (0, test_util_1.getStates)(client, participants);
    const icpResult1 = await client.identifiers().create(groupName, {
        algo: signify_ts_1.Algos.group,
        mhab: aid1,
        isith: args.isith,
        nsith: args.nsith,
        toad: args.toad,
        wits: args.wits,
        delpre: args.delpre,
        states: participantStates,
        rstates: participantStates,
    });
    const op1 = await icpResult1.op();
    const serder = icpResult1.serder;
    const sigs = icpResult1.sigs;
    const sigers = sigs.map((sig) => new signify_ts_1.Siger({ qb64: sig }));
    const ims = (0, signify_ts_1.d)((0, signify_ts_1.messagize)(serder, sigers));
    const atc = ims.substring(serder.size);
    const embeds = {
        icp: [serder, atc],
    };
    const smids = participantStates.map((state) => state["i"]);
    await client
        .exchanges()
        .send(localMemberName, groupName, aid1, "/multisig/icp", { gid: serder.pre, smids: smids, rmids: smids }, embeds, participants);
    return op1;
}
exports.startMultisigIncept = startMultisigIncept;
async function waitAndMarkNotification(client, route) {
    var _a, _b;
    const notes = await (0, test_util_1.waitForNotifications)(client, route);
    await Promise.all(notes.map((note) => {
        client.notifications().mark(note.i);
    }));
    return (_b = (_a = notes[notes.length - 1]) === null || _a === void 0 ? void 0 : _a.a.d) !== null && _b !== void 0 ? _b : "";
}
exports.waitAndMarkNotification = waitAndMarkNotification;
