import React, { useEffect } from "react";

/* Highlight + Bold inline formatter */
function formatInline(text) {
  if (!text) return text;

  const regex = /(==([^=]+)==)|\*\*([^*]+)\*\*/g;
  const parts = [];
  let lastIndex = 0;

  let match;
  while ((match = regex.exec(text)) !== null) {
    const index = match.index;

    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }

    if (match[2]) {
      parts.push(
        <mark key={index} className="bg-yellow-100 px-1 rounded">
          {match[2]}
        </mark>
      );
    } else if (match[3]) {
      parts.push(
        <strong key={index} className="font-semibold">
          {match[3]}
        </strong>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}

/* Bullet + Paragraph block formatter (REVISED for sub-headings) */
function renderContentBlocks(content) {
  if (!content) return null;

  const lines = content
    .split("\n")
    .map((l) => l.replace(/\u2022/g, "•").trim())
    .filter((l) => l.length > 0);

  const blocks = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(
        <ul
          key={`ul-${blocks.length}`}
          className="list-disc list-inside space-y-2 text-sm text-gray-700 mt-2 mb-3"
        >
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {formatInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const bullet = line.match(/^(?:•|-)\s*(.*)$/);
    // Specifically check for bullet followed immediately by bold text (e.g., • **Heading**...)
    const boldBulletHeading = line.match(/^(?:•|-)\s*\*([^*]+)\*(.*)$/);

    if (bullet && !boldBulletHeading) {
      // Standard bullet point: collect into listItems
      listItems.push(bullet[1]);
    } else {
      flushList(); // Render any pending standard list items

      if (boldBulletHeading) {
        // Special handling for • **Heading** + following text.
        // We render this as a distinct paragraph block for spacing.
        const contentAfterBold = boldBulletHeading[2].trim();

        blocks.push(
          <p
            key={`p-heading-${blocks.length}`}
            className="text-sm text-gray-700 leading-relaxed mt-4 mb-2" // Added vertical space
          >
            <strong>{formatInline(boldBulletHeading[1].trim())}</strong>
            {/* Include the rest of the line's content if it exists */}
            {contentAfterBold ? ` ${formatInline(contentAfterBold)}` : ''}
          </p>
        );

      } else {
        // Standard paragraph: render as a new paragraph block
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

  flushList(); // Render any remaining list items
  return blocks;
}

export default function CommunityGuidelines() {
  // set smooth scroll behavior on mount (and restore previous value on unmount)
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev || "";
    };
  }, []);

  // smooth scroll helper — prevents default jump, scrolls smoothly, updates hash
  const scrollToId = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) {
      history.replaceState(null, "", `#${id}`);
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  const sections = [
    {
      id: "purpose",
      title: "1. Purpose",
      content: `
The Erovians Community Guidelines (“Guidelines”) set out the standards of behavior expected from all users of the Platform. They are designed to ensure a respectful, professional, safe, and legally compliant environment for the stone, alternative materials, and cultural heritage community.

By using the Platform, you agree to comply with these Guidelines in addition to the **Terms of Use** and **Marketplace Terms**.
`,
    },
    {
      id: "core-principle",
      title: "2. Core Principles",
      content: `
  Erovians is built upon the following values:

**• Respect:** Treat all members with courtesy and professionalism.
**• Integrity:** Share truthful, accurate, and verifiable information.
**• Legality:** Abide by applicable laws and industry standards.
**• Sustainability:** Promote responsible use of materials and resources.
**• Heritage:** Support preservation of cultural knowledge and practices.
`,
    },
    {
      id: "acceptable-behaviour",
      title: "3. Acceptable Behavior",
      content: `
**Users may:**

Publish professional content relevant to stone culture, machinery, tools, and materials.
Exchange knowledge, experiences, and technical best practices.
Post datasheets and compliance documents (==CE, DoP, EPD, BIS, GB/CCC==) truthfully and transparently.
Participate in groups and discussions in a constructive manner.
`,
    },
    {
    id: "prohabited-behavior",
    title: "4. Prohabited Behavior",
    content: `
The following conduct is strictly prohibited:

• **Illegal Content**: 
 Uploading forged datasheets, counterfeit certifications, or fraudulent documents.
 Sharing content that infringes intellectual property rights.
• **Harmful or Abusive Conduct**:  
  Hate speech, discrimination, harassment, or personal attacks.
  Defamation or false accusations against individuals or organizations.
• **Misuse of the Marketplace**:  
  Posting misleading product information.
  Fraudulent transactions or scams.
  Circumventing platform fees or escrow mechanisms.
• **Security Violations**:  
  Attempting to hack, disrupt, or misuse the Platform.
  Sharing malware, phishing links, or unauthorized advertising.
• **Privacy Violations**: 
  Publishing private data of others without consent.
  Unauthorized use of personal information.
`,
    },
    {
      id: "enforcement",
      title: "5. Enforcement",
      content: `
Erovians applies a **progressive enforcement policy:**

• ==Warning → == Notification of violation.
• ==Content Removal → == Deletion of infringing or harmful material.
• ==Suspension → == Temporary account suspension.
• ==Termination → == Permanent account deletion.
• ==Reporting → == If required, violations may be reported to competent authorities.
`,
    },
    {
      id: "legal-compliance",
      title: "6. Legal Compliance",
      content: `
These Guidelines are enforced under the legal frameworks of:
• **EU:** ==Digital Services Act (2022/2065), GDPR==.
• **US:** ==CDA Section 230, FTC Act==.
• **India:** ==IT Act (2000)==.
• **China:** ==E-Commerce Law (2019), PIPL==.
• **Australia:** ==Online Safety Act (2021)==.
`,
    },
    {
      id: "appeals",
      title: "7. Enforcement and Consequences",
      content: `
Users may appeal moderation decisions by contacting ==support@erovians.com==.Appeals will be reviewed within a reasonable timeframe.
`,
    },
    {
      id: "updates",
      title: "8. Updates",
      content: `
These Guidelines may be updated to reflect **legal, cultural**, or **technological** changes. Updates are effective upon publication.
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

        {/* Main Content */}
        <main className="bg-transparent p-8 rounded-xl shadow-sm border">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Community Guidelines
          </h1>
          <p className="text-gray-600 mb-10">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="mb-12 scroll-mt-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {sec.title}
              </h2>
              {renderContentBlocks(sec.content)}
            </section>
          ))}

          {/* Bottom Contact */}
          <div className="mt-16 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Need to Report a Violation?
            </h3>
            <p className="text-gray-700">
              Please use the in-app reporting tools or contact support at{" "}
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