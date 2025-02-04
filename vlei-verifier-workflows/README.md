# vlei-verifier-workflows
Workflows for vLEI users and vLEI credentials for the vLEI-verifier service

Workflos step types with predefined step runners(no need to register new ones):
- issue_credential
- revoke_credential

For any other workflow step type you need to register a step runner(by calling `WorkflowRunner.registerRunner(name: string, runner: StepRunner)` where `StepRunner` is any subclass instance of `StepRunner` class.)


