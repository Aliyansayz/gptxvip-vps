# Scanner Agent Upgrade Plan

## Objective
Transform the static Scanner Agent into a step-by-step, solution-driven workflow.

## Phases
1. **Configuration Phase (`CONFIG`)**: User inputs the target environment or URL.
2. **Execution Phase (`SCANNING`)**: A simulated terminal provides real-time feedback of the agent crawling, fuzzing, and analyzing endpoints.
3. **Analysis Phase (`RESULTS`)**: The agent presents findings via the `WebExploitationDashboard`.
4. **Remediation Phase (`REMEDIATION`)**: When a user selects to fix a vulnerability, the agent switches to a step-by-step solution view (`RemediationPlanView`) providing concrete fixes (e.g., code snippets, configuration changes).

## Implementation Steps
1. Create `RemediationPlanView.tsx` to handle the step-by-step solution generation.
2. Update `WebExploitationDashboard.tsx` to trigger a remediation callback.
3. Overhaul `ScannerAgentMainView.tsx` to manage the state machine (`CONFIG` -> `SCANNING` -> `RESULTS` -> `REMEDIATION`).
4. Add simulated terminal output for the scanning phase.
