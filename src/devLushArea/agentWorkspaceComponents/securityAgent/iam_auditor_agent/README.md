# Identity & Access Management (IAM) Auditor Agent

## Overview
The IAM Auditor Agent acts as the guardian of access, ensuring that the principle of least privilege is strictly enforced across all systems and applications.

## Role
Enforces the Principle of Least Privilege.

## Core Capabilities
- **Permission Analysis**: Analyzes user permissions across active directories, cloud providers, and SaaS applications to identify over-privileged accounts.
- **Account Monitoring**: Detects dormant accounts, orphan accounts, and offboarded employees who still have access.
- **Anomaly Detection**: Flags abnormal access patterns, such as impossible travel (logging in from two distant locations in a short time) or unusual access times.
- **Automated Remediation**: Recommends (or automatically executes) the revoking of permissions that haven't been used recently (JIT/Zero Trust enforcement).

## Example Workflow
1. **Analysis**: Reviews AWS IAM roles and notices that a developer has full administrative access but hasn't used any admin actions in over 90 days.
2. **Recommendation**: Generates a recommendation to downscope the developer's role to read-only.
3. **Anomaly Detection**: Detects a login to the VPN from a new IP address in a foreign country at 3 AM.
4. **Response**: Automatically forces a multi-factor authentication (MFA) challenge or temporarily suspends the account pending review.
