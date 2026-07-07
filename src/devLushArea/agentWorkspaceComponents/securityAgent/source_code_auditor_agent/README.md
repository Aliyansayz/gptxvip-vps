# Source Code Auditor (SAST) Agent

## Overview
The Source Code Auditor Agent acts as an automated security champion within the development team, ensuring that security is built-in from the start (Shifting Security Left).

## Role
Shifts security left by integrating directly into the CI/CD pipeline.

## Core Capabilities
- **Automated Code Review**: Reviews pull requests for logic flaws, injection vulnerabilities, and bad practices.
- **Secret Scanning**: Detects hardcoded secrets, API keys, and passwords before they are merged into the main branch.
- **Dependency Analysis**: Identifies vulnerable third-party dependencies and libraries.
- **Actionable Remediation**: Provides developers with in-line remediation code snippets and educational context within the PR comments.

## Example Workflow
1. **Trigger**: A developer opens a pull request containing a new feature.
2. **Analysis**: The agent scans the code and finds a SQL injection vulnerability due to improper input sanitization.
3. **Feedback**: The agent comments directly on the specific line of code in the PR, explaining the vulnerability and providing a code snippet showing how to use a parameterized query instead.
4. **Block**: (Optional) The agent blocks the merge until the security issue is resolved.
