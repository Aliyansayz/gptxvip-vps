# Plan for Integrating Topic Theory in Scanner Agent

## Objective
Enhance the educational value of the Scanner Agent by providing contextual "Topic Theory" related to vulnerabilities and remediation strategies at relevant touchpoints.

## Areas for Integration

1. **Web Exploitation Dashboard (Results View)**
   - **Location**: Right Detail Panel.
   - **Integration**: Add a "Read Theory on [VulnClass]" button under the "Finding Details" section. This allows users to quickly jump into learning materials (Topic Theory) specific to the vulnerability they are currently analyzing (e.g., XSS, SQLi, SSRF).

2. **Remediation Plan View**
   - **Location**: In the header or as a supplementary card in the side panel.
   - **Integration**: While applying step-by-step remediation, provide a "Theory: Defense Mechanisms" button to explain *why* the remediation works theoretically.

3. **Scanner Agent Main View (Config/Home View)**
   - **Location**: Below the "Existing Vulnerabilities" section.
   - **Integration**: Add a "Topic Theory Library" quick link so users can read up on web security concepts before launching a scan.

## Execution Steps
1. Add `onViewTheory` callbacks to the respective views to handle navigating or opening Topic Theory modals.
2. Update `WebExploitationDashboard.tsx` to include the Theory button in the detail panel.
3. Update `RemediationPlanView.tsx` to include a Theory link for the specific vulnerability class.
4. Update `ScannerAgentMainView.tsx` to pass down the handlers and render the educational entry points.
