import React, { useEffect } from "react";

/* Highlight + Bold formatter */
function formatInline(text) {
  if (!text) return text;

  const regex = /(==([^=]+)==)|\*\*([^*]+)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const index = match.index;

    if (index > lastIndex) parts.push(text.slice(lastIndex, index));

    if (match[2]) {
      parts.push(
        <mark key={index} className="bg-yellow-100 px-1 rounded">
          {match[2]}
        </mark>
      );
    } else if (match[3]) {
      parts.push(<strong key={index}>{match[3]}</strong>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length ? parts : text;
}

/* Bullet + Paragraph formatter (REVISED) */
function renderContentBlocks(content) {
  if (!content) return null;

  const lines = content
    .split("\n")
    .map((l) => l.replace(/\u2022/g, "•").trim())
    .filter((l) => l.length > 0);

  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length === 0) return;

    blocks.push(
      <ul
        key={`ul-${blocks.length}`}
        // Use margin-top to separate from previous block, space-y-2 for internal list item spacing
        className="list-disc list-inside space-y-2 text-sm text-gray-700 mt-3 mb-3"
      >
        {listItems.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {formatInline(item)}
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const bullet = line.match(/^(?:•|-)\s*(.*)$/);
    const boldBulletHeading = line.match(/^(?:•|-)\s*\*([^*]+)\*(.*)$/); // Matches • **Heading**...

    if (bullet && !boldBulletHeading) {
      // Standard bullet point
      listItems.push(bullet[1]);
    } else {
      flushList(); // Flush any pending standard list items

      if (boldBulletHeading) {
        // Special handling for • **Heading** + following text
        const boldText = boldBulletHeading[1].trim();
        let description = boldBulletHeading[2].trim();
        
        // If the description is empty on the same line, check the next line
        if (!description && i + 1 < lines.length && !lines[i + 1].match(/^(?:•|-)\s*(.*)$/)) {
            // Take the next line as the description
            description = lines[i + 1];
            i++; // Skip the next line
        }

        blocks.push(
          <p
            key={`p-heading-${blocks.length}`}
            className="text-sm text-gray-700 leading-relaxed mt-4 mb-2" // Add extra vertical space for distinct headings
          >
            <strong>{formatInline(boldText)}</strong>
            <br />
            {formatInline(description)}
          </p>
        );

      } else {
        // Standard paragraph
        blocks.push(
          <p
            key={`p-${blocks.length}`}
            className="text-sm text-gray-700 leading-relaxed mb-3 mt-3" // Consistent paragraph spacing
          >
            {formatInline(line)}
          </p>
        );
      }
    }
  }

  flushList();
  return blocks;
}

export default function CookiePolicy() {
  /* Enable smooth scrolling */
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => (document.documentElement.style.scrollBehavior = prev || "");
  }, []);

  const scrollToId = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  // REVISED SECTION CONTENT FOR BETTER PARSING
  const sections = [
    {
      id: "object",
      title: "1. Object",
      content: `
This Cookie Policy explains how **Erovians** (“we”, “our”, “the Platform”) uses cookies and similar technologies when you visit our website or use our services. It describes the types of ==cookies==, their purpose, and your rights to control them.
`,
    },
    {
      id: "what-are-cookies",
      title: "2. What Are Cookies?",
      content: `
Cookies are small text files stored on your device when you visit a website. They may be used to enable core functionality, analyze traffic, or provide personalized content.

Types of cookies used:
• ==Session Cookies==: deleted when you close your browser.
• ==Persistent Cookies==: remain on your device until deleted.
• ==First-Party Cookies==: placed by Erovians.
• ==Third-Party Cookies==: placed by external providers (analytics, payment partners, CDN services).
`,
    },
    {
      id: "types-we-use",
      title: "3. Types of Cookies We Use",
      content: `
We use the following categories of cookies:

• **Strictly Necessary Cookies**
Required for basic operation of the Platform (authentication, security, account management).
Cannot be disabled.

• **Analytics Cookies**
Collect aggregated, anonymous data about traffic and usage.
Examples: Google Analytics, Matomo.

• **Functional Cookies**
Remember user preferences (language, region, display options).

• **Marketing And Advertising Cookies**
Track browsing habits to display personalized ads or content.
Only used with prior consent.
`,
    },
    {
      id: "legal-basis",
      title: "4. Legal Basis",
      content: `
• **European Union (GDPR + ePrivacy Directive):**
Consent is required for non-essential cookies (analytics, marketing).
• **United States (CCPA/CPRA – California):**
Users have the right to opt-out of sale or sharing of data collected by cookies.
• **India (DPDP, 2023):**
Explicit consent required for data tracking.
• **China (PIPL, 2021):**
Consent and clear disclosure required.
• **Australia (Privacy Act, 1988):**
Transparency obligation for data collected via cookies.
`,
    },
    {
      id: "third-party",
      title: "5. Third-Party Cookies",
      content: `
Some cookies are set by third-party service providers that support the Platform:

• ==Analytics providers== (e.g., Google Analytics or similar)
• ==Payment processors==
• ==Advertising partners==
• ==CDN and hosting providers==

We require these third parties to comply with applicable laws, but we are not responsible for their practices.
`,
    },
    {
      id: "consent",
      title: "6. Consent",
      content: `
• When you first access the Platform, a cookie banner will appear allowing you to:
 ==Accept all cookies==,
 ==Reject non-essential cookies==,
 ==Configure preferences by category==.

• Your choice is recorded and can be changed at any time in the “Cookie Settings” section.
`,
    },
    {
      id: "duration",
      title: "7. Duration",
      content: `
• ==Session cookies==: expire when you close your browser.
• ==Persistent cookies==: remain on your device until deleted or expired (max 13 months for analytics, as per GDPR).
`,
    },
    {
      id: "how-to-manage",
      title: "8. How To Manage Cookies ",
      content: `
You may control cookies by:
• Using the cookie banner and settings on our Platform.
• Adjusting your browser settings (blocking, deleting cookies).
• Using industry tools (e.g., opt-out pages for Google or IAB).
Please note: blocking certain cookies may affect the functionality of the Platform.
`,
    },
    {
      id: "update-to-policy",
      title: "9. Update to this Policy",
      content: `
• We may update this Cookie Policy from time to time to reflect changes in technology, law, or our practices.
`,
    },
    {
      id: "contact",
      title: "10. Contact Us",
      content: `
If you have questions about this Cookie Policy or want to manage consent:

• Email: ==support@erovians.com==
• Address: [Insert Company Address]
`,
    },
  ];

  return (
    <div className="bg-white min-h-screen sm:py-16 sm:px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-12">
        {/* Sidebar */}
        <aside className="hidden md:block sticky top-24 h-fit bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            On This Page
          </h3>
          <ul className="space-y-3 text-sm">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  onClick={(e) => scrollToId(e, sec.id)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {sec.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <main className="bg-transparent p-8 rounded-xl shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-600 mb-10">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="mb-12 scroll-mt-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {sec.title}
              </h2>
              {renderContentBlocks(sec.content)}
            </section>
          ))}

          {/* Contact Box */}
          <div className="mt-16 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Need Help?
            </h3>
            <p className="text-gray-700">
              Email us at{" "}
              <a
                href="mailto:support@erovians.com"
                className="text-blue-600 font-medium"
              >
                support@erovians.com
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}