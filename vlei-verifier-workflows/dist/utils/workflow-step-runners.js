"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokeCredentialStepRunner = exports.IssueCredentialStepRunner = exports.StepRunner = void 0;
class StepRunner {
    constructor() {
        this.type = "";
    }
}
exports.StepRunner = StepRunner;
class IssueCredentialStepRunner extends StepRunner {
    constructor() {
        super(...arguments);
        this.type = "issue_credential";
    }
    async run(vi, stepName, step, configJson = null) {
        const result = await vi.getOrIssueCredential(stepName, step.credential, step.attributes, step.issuer_aid, step.issuee_aid, step.credential_source, Boolean(step.generate_test_data), step.test_name);
        return result;
    }
}
exports.IssueCredentialStepRunner = IssueCredentialStepRunner;
class RevokeCredentialStepRunner extends StepRunner {
    constructor() {
        super(...arguments);
        this.type = "revoke_credential";
    }
    async run(vi, stepName, step, configJson = null) {
        const result = await vi.revokeCredential(step.credential, step.issuer_aid, step.issuee_aid, Boolean(step.generate_test_data), step.test_name);
        return result;
    }
}
exports.RevokeCredentialStepRunner = RevokeCredentialStepRunner;
