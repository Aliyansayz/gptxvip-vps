# Web Bug Bounty Sandboxes Plan

## Overview
This plan outlines the architecture and implementation strategy for integrating interactive sandboxes into the "Web Bug Bounty" module. Each topic will have its own dedicated lab and a mini-dashboard styled interactive visual.

## Topics & Sandboxes

1. **Cross-Site Scripting (XSS)**
   - **Lab Focus:** Reflected, Stored, and DOM-based XSS.
   - **Interactive Visual (Mini-Dashboard):** A simulated vulnerable comment section or search bar. Displays script execution context and payload reflection points.

2. **Cross-Site Request Forgery (CSRF)**
   - **Lab Focus:** Forging state-changing requests, bypassing weak CSRF tokens.
   - **Interactive Visual (Mini-Dashboard):** A split-pane view showing the victim's session on a banking/settings page and the attacker's malicious webpage triggering the request.

3. **Authentication or Authorization Flaws**
   - **Lab Focus:** Broken access control, IDOR, session hijacking, JWT manipulation.
   - **Interactive Visual (Mini-Dashboard):** A user role matrix dashboard. Users manipulate tokens or parameters to escalate privileges and visually see restricted sections unlock.

4. **Server-Side Code Execution Bugs (RCE)**
   - **Lab Focus:** Command injection, unsafe deserialization, code evaluation.
   - **Interactive Visual (Mini-Dashboard):** A mock terminal interface showing the server's internal state. Users inject payloads through a web form and observe the resulting server-side execution logs.

5. **DNS Vulnerabilities**
   - **Lab Focus:** Zone transfers, DNS cache poisoning, subdomain takeover.
   - **Interactive Visual (Mini-Dashboard):** A DNS record visualizer and network topology map. Shows the propagation of malicious records or unlinked subdomains.

6. **WHOIS Vulnerabilities**
   - **Lab Focus:** Information disclosure, domain hijacking through exposed contact info.
   - **Interactive Visual (Mini-Dashboard):** A mock WHOIS lookup tool that highlights overly permissive data exposure and visually connects it to social engineering or domain takeover vectors.

7. **Local File Includes (LFI)**
   - **Lab Focus:** Directory traversal, reading sensitive files (e.g., `/etc/passwd`).
   - **Interactive Visual (Mini-Dashboard):** A file system tree viewer. As the user manipulates the `?page=` parameter, the visual highlights the directory traversal path reaching restricted files.

8. **XML External Entity Processing (XXE)**
   - **Lab Focus:** Exploiting poorly configured XML parsers to read local files or SSRF.
   - **Interactive Visual (Mini-Dashboard):** An XML payload editor side-by-side with a server memory/file system visualizer, demonstrating how the external entity resolves on the backend.

9. **Server-Side Request Forgery (SSRF)**
   - **Lab Focus:** Forcing the server to make HTTP requests to internal resources (e.g., cloud metadata APIs, internal admin panels).
   - **Interactive Visual (Mini-Dashboard):** A network diagram showing the external attacker, the vulnerable front-end server, and internal restricted endpoints (like `169.254.169.254` or internal databases). Lines animate to show the request flow.

## Implementation Strategy
1. **Directory Structure:** Create a dedicated `src/web_bug_bounty` directory with subfolders for each vulnerability type.
2. **Component Architecture:**
   - `WebBugBountyMainView`: The primary container and navigation for the topics.
   - `MiniDashboardVisualizer`: A reusable component for the interactive visuals, accepting props for nodes, flows, and states.
   - `SandboxEnvironment`: The mock vulnerable application area where payloads are inputted and tested.
3. **State Management:** Use a localized context or state hook to track the success/failure of exploits in the sandbox and update the mini-dashboard accordingly.
