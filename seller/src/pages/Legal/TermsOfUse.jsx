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

export default function TermsOfUse() {
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
      id: "object-and-scope",
      title: "1. Object And Scope",
      content: `
These Terms of Use (“Terms”) govern the access and use of the Erovians Platform (“Erovians” or “the Platform”), which provides:

• a **Directory** of professional actors in the stone and related industries,
• a **Social Network** enabling professional interactions, and
• a **Marketplace** connecting buyers and sellers of stone, alternative materials, machinery, and tools.

By accessing or using the Platform, you agree to these Terms. If you do not agree, you must not use the Platform.
`,
    },
    {
      id: "role-of-erovians",
      title: "2. Role of Erovians",
      content: `
• Erovians is a ==neutral intermediary ==and ==hosting provider==.
• Erovians does not act as a seller, manufacturer, certifying authority, or agent.
• All sales contracts, professional engagements, or technical certifications are concluded directly between users.
• Liability is limited in accordance with applicable international laws (e.g., **EU Digital Services Act, US CDA Section 230, India IT Act, China E-Commerce Law**).
`,
    },
    {
      id: "user-accounts",
      title: "3. User Accounts",
      content: `
• Users must be over 18 and legally capable of contracting.
• Registration requires accurate and truthful information.
• Users are responsible for maintaining the confidentiality of their credentials.
• Erovians may suspend or terminate accounts in case of breach of these Terms.
`,
    },
    {
      id: "user-obligations",
      title: "4. User Obligations",
      content: `
Users shall:
• Provide accurate and lawful information (profiles, datasheets, marketplace listings).
• Respect intellectual property rights and confidentiality.
• Abstain from uploading illegal, defamatory, fraudulent, discriminatory, or misleading content.
• Comply with applicable construction, trade, safety, and data protection laws.
`,
    },
    {
      id: "content-and-datasheets",
      title: "5. Content and DataSheets",
      content: `
• Users publishing technical datasheets (==DoP, EPD, CE, BIS, GB/CCC==, etc.) remain fully responsible for their accuracy and compliance.
• Erovians does not verify or certify documents but may remove or suspend content upon notification of non-compliance.
`,
    },
    {
      id: "moderation-and-takedown",
      title: "6. Moderation And Takedown",
      content: `
• Users may report unlawful or non-compliant content.
• Erovians shall act diligently to remove or restrict access to such content, in line with:
 ** EU Digital Services Act** (==DSA, 2022/2065==),
 ** US CDA Section** ==230==,
 ** India IT Act **==(2000)==,
 ** China E-Commerce Law ** ==(2019)==,
 ** Australia Online Safety Act** ==(2021)==.
`,
    },
    {
      id: "marketplace-interaction",
      title: "7. Marketplace Interaction",
      content: `
• The Platform only facilitates contacts between buyers and sellers.

• Erovians is not liable for product conformity, delivery, warranties, or after sales.

• Payments may be processed via third-party providers or escrow solutions.
`,
    },
    {
      id: "disclaimer-warranty",
      title: "8. Disclaimer of Warranty",
      content: `
The Platform is provided on an **“AS IS”** and **“AS AVAILABLE”** basis.

Erovians makes no representations or warranties of any kind, express or implied, as to the operation of the Platform or the information, content, or materials included therein. To the full extent permissible by law, Erovians disclaims all warranties, express or implied, including, but not limited to, **implied warranties of merchantability and fitness for a particular purpose**.
`,
    },
    {
      id: "liability",
      title: "9. Liability",
      content: `
       Erovians shall not be liable for:
        • Content generated by users,
        • Transactions or contracts concluded between users, 
        • Compliance of datasheets or certifications.

       Erovians’ liability is limited to cases of gross negligence or intentional misconduct under applicable law.
`,
    },
    {
      id: "suspension-and-termination",
      title: "10. Suspension and Termination",
      content: `
      Erovians reserves the right to:
    • Suspend or delete accounts in case of violations, fraud, or legal obligations.
    • Retain necessary data for legal, compliance, or dispute purposes.
`,
    },
    {
      id: "governing-law",
      title: "11. Governing Law and Jurisdiction",
      content: `
• Primary law: the law of [Company HQ jurisdiction].
• International compliance ensured through local addenda:
  **EU**: ==GDPR + DSA + CPR==.
  **US**: ==CCPA + CDA 230 + FTC== rules.
  **India**: ==DPDP + IT Act + E-commerce Rules==.
  **China**: ==PIPL + E-commerce Law==.
  **Australia**: ==Privacy Act + ACL + Online Safety Act==.
`,
    },
    {
      id: "contact-information",
      title: "12. Contact Information",
      content: `
Questions about the Terms of Use should be sent to us at:
• Email: ==legal@erovians.com==
• Address: **[Insert Company Address]**
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
            Terms of Use
          </h1>
          <p className="text-gray-600 mb-10">
            Effective Date: {new Date().toLocaleDateString()}
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
              Contact Us Regarding These Terms
            </h3>
            <p className="text-gray-700">
              For questions or concerns, please email our legal team at{" "}
              <a
                href="mailto:legal@erovians.com"
                className="text-blue-600 font-medium"
              >
                legal@erovians.com
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}