Here is a breakdown of PortSwigger's learning and testing methods, using the
same "Brilliant-style" categories to highlight their innovative approach to
cybersecurity education.

Excellent analysis. You've correctly identified that the true innovation of
PortSwigger's Web Security Academy lies not just in its comprehensive content,
but in how it forces you to engage with that content. Their interactive labs are
designed to build practical skills, prevent passive learning, and make abstract
vulnerabilities tangible.

Here is a list of the different types of interactive labs and prompts used by
PortSwigger, categorized by their function.

Category 1: Direct Input & Manipulation

These are the most common lab types, where the goal is to find a vulnerability
and provide a specific input to prove you've exploited it.

  - Payload Input: The most common type. You are given a vulnerable web
    application and must craft a specific string or payload to trigger a
    vulnerability.

      - Purpose: Tests direct understanding of vulnerability syntax and how to
        craft exploit strings.
      - Example (XSS): "This lab contains a stored XSS vulnerability in the
        comment functionality. To solve this lab, submit a comment that calls
        the alert() function." You inject <script>alert(1)</script>.
      - Example (SQLi): "This lab contains a SQL injection vulnerability in the
        product category filter. To solve the lab, perform a SQL injection
        attack that causes the application to display one or more unreleased
        products." You inject ' OR 1=1--.

  - File Upload: You are required to craft or modify a file and upload it to the
    server to achieve a goal.

      - Purpose: Tests understanding of file type restrictions, server-side
        processing, and shell uploads.
      - Example (XXE): "This lab has a "Check stock" feature that parses XML
        input. To solve the lab, upload an XML file that exploits an XXE
        vulnerability to retrieve the contents of /etc/passwd."

  - Parameter Tampering: The core of the lab involves intercepting an HTTP
    request (usually with Burp Suite) and modifying a parameter's value before
    forwarding it to the server.

      - Purpose: Tests understanding of access control flaws, business logic
        errors, and insecure direct object references (IDOR).
      - Example (IDOR): "This lab's "My Account" page is vulnerable to IDOR. To
        solve the lab, find the password for the user carlos and log in to their
        account." You change the id=123 parameter in a request to id=carlos.

Category 2: Interactive & Environmental

This is the core of PortSwigger’s "learn by doing" philosophy. The lab is not
just a form to fill out; it's a simulated environment where your actions have
direct, observable consequences.

  - Live Attack Simulation: You are given a target and must perform an action
    that affects another user or the system state, which you can then observe.

      - Purpose: To make the real-world impact of an attack concrete. You aren't
        just finding a flaw; you're seeing what it can do.
      - Example (CSRF): "This lab's "Change email" function is vulnerable to
        CSRF. To solve the lab, create a malicious HTML page that, when viewed
        by a victim, changes their email address to pwned@evil-user.net." You
        host the exploit on your exploit server and then use the "Deliver to
        victim" button to simulate the attack.

  - Chained Vulnerability Exploitation: Solving the lab requires finding and
    exploiting two or more different vulnerabilities in sequence.

      - Purpose: To model realistic penetration testing, where one flaw often
        provides the foothold needed to discover and exploit another, more
        critical one.
      - Example (Chained Exploit): "To solve this lab, first find and exploit a
        file path traversal vulnerability to leak the source code of a class.
        Then, analyze the source code to find a serialization vulnerability and
        use it to delete the morale.txt file from the administrator's home
        directory."

  - Blind Vulnerability Discovery & Exfiltration: You are attacking a
    vulnerability where you cannot directly see the output of your exploit. You
    must use out-of-band techniques or infer the result from the application's
    behavior.

      - Purpose: Teaches advanced, real-world hacking techniques for when
        applications are configured to hide error messages and direct output.
      - Example (Blind SQLi): "This lab is vulnerable to Blind SQL Injection.
        You cannot retrieve data directly, but you can trigger conditional time
        delays. To solve the lab, exfiltrate the administrator's password one
        character at a time by asking a series of true/false questions that
        result in a time delay."

Category 3: Conceptual & Tool-Based

These labs test not just your knowledge of a vulnerability, but your mastery of
the penetration tester's primary tool: Burp Suite.

  - "Which of these is the vulnerable request?": The lab presents a scenario,
    and you must use Burp's history to identify which specific HTTP request
    contains the exploitable parameter.

      - Purpose: To test your ability to analyze traffic and identify attack
        surfaces.
      - Example (Request Smuggling): "This lab is vulnerable to HTTP Request
        Smuggling. Analyze the traffic and identify which request can be used to
        smuggle a second request to the back-end server. Send this request to
        Repeater to craft your exploit."

  - "Build the Attack with Intruder/Repeater": Solving the lab is impractical by
    hand and requires the automation or semi-automation capabilities of Burp
    Suite.

      - Purpose: Reinforces the efficient use of professional security tooling.
      - Example (Brute-forcing): "This lab's login function is vulnerable to
        username enumeration and password brute-forcing. Use Burp Intruder with
        a list of candidate usernames and passwords to find the credentials for
        the administrator user."

Category 4: Structural & Sequential

These labs are about understanding a multi-step process or protocol.

  - Protocol-Level Manipulation (e.g., OAuth): You must interact with a
    multi-step authentication flow (like OAuth), intercepting and modifying
    requests at specific points in the sequence to compromise the process.

      - Purpose: Teaches how flaws can exist not in a single endpoint, but in
        the logical flow of a complex protocol.
      - Example (OAuth): "This lab's OAuth authentication is flawed. Intercept
        the flow and steal an authorization code intended for the legitimate
        client application. Then, use that code to gain access to the victim's
        account."

  - Drag-and-Drop Ordering (Conceptual): While less common in labs, this is used
    in their documentation and knowledge checks.

      - Purpose: To test understanding of the logical sequence of an attack or a
        protocol.
      - Example (Conceptual): "Arrange the following steps in the correct order
        for a typical Cross-Site Request Forgery (CSRF) attack." (Steps: Victim
        logs in, Attacker crafts malicious link, Victim clicks link, Malicious
        request is sent with victim's cookies).

In summary, PortSwigger's teaching method is a deliberate pedagogical choice to
move beyond theoretical knowledge. The goal of the interactivity is to ensure
you:

1.  Build Muscle Memory: By "playing" with a real, live (but safe) vulnerability
    and actively using tools like Burp Suite.
2.  Learn Actively: By forcing you to become the attacker, experimenting with
    payloads, and analyzing responses rather than just reading about exploits.
3.  Think Creatively: It's much harder to solve a blind or chained vulnerability
    lab than to follow a simple tutorial; it requires genuine problem-solving.
4.  Understand Impact: By seeing the actual result of an exploit (e.g., an
    "account deleted" message), you make a direct connection between the
    technical flaw and its real-world consequence.
