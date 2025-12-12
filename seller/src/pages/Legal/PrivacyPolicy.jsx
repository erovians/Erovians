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

/* Bullet + Paragraph block formatter (REVISED) */
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
          // Consistent spacing for lists
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


export default function PrivacyPolicy() {
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
      // fallback: update hash only
      history.replaceState(null, "", `#${id}`);
      return;
    }

    // scroll into view smoothly — align to top; the section has scroll-mt-24 to offset
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // update the URL hash without adding a new history entry
    // (use replaceState so back button behavior is not polluted)
    history.replaceState(null, "", `#${id}`);
  };

  const sections = [
    {
      id: "object-and-scope",
      title: "1. Object and Scope",
      content: `
  This Privacy Policy describes how Erovians (“we”, “our”, “the Platform”) collects, processes, and protects personal data of its users (“you”, “your”) incompliance with international data protection laws, including:
• European Union: ==General Data Protection Regulation (GDPR, 2016/679)==, ==ePrivacy Directive==, ==Digital Services Act==. 
• United States: ==CCPA/CPRA (California)==, and similar state privacy laws.
• India: ==Digital Personal Data Protection Act (DPDP, 2023)==.
• China: ==Personal Information Protection Law (PIPL, 2021)==.
• Australia: ==Privacy Act (1988, amended 2022)==.
`,
    },
    {
      id: "data-collected",
      title: "2. Data Collected",
      content: `
  We collect the following categories of data:
• ==Identity and contact information==: name, company, email, phone.
• ==Professional information==: job title, organization, materials and services offered.
• ==Content data==: datasheets, posts, comments, marketplace listings.
• ==Transaction data== (if using the marketplace): payment information (processed via third-party providers), order history.
• ==Technical data==: IP address, device type, browser, cookies, usage logs.
  Sensitive data is not required, except where voluntarily disclosed (e.g., compliance certificates).
`,
    },
    {
      id: "purposes-of-processing",
      title: "3. Purposes of Processing",
      content: `
• Directory publication and professional visibility.
• Enabling social interaction (networking, groups, messaging).
• Facilitating ==marketplace transactions== between buyers and sellers.
• Ensuring compliance with industry regulations (==construction standards, DoP, EPD, CE, BIS, GB, CCC==).
• Analytics and platform improvement.
• Legal obligations (tax, trade, safety, fraud prevention).
`,
    },
    {
      id: "legal-basis",
      title: "4. Legal Basis for Processing",
      content: `
  Depending on jurisdiction:
• ==Consent== (e.g., for marketing, cookies).
• **Contractual necessity**: to provide directory, social, and marketplace services.
• **Legitimate interest**: to improve services, prevent fraud. 
• **Legal obligations**: compliance with CPR, consumer protection, tax.
`,
    },
    {
      id: "user-rights",
      title: "5. User Rights",
      content: `
  You may exercise the following rights, subject to applicable law:
• **Access**: obtain confirmation of whether data is processed.
• **Rectification**: correct inaccurate or incomplete data.
• **Erasure (“Right to be Forgotten”)**: request deletion of data.
• **Restriction**: limit processing under certain conditions.
• **Portability**: receive your data in a structured format.
• **Objection**: object to processing, including marketing.
• **Withdrawal of consent**: at any time, without affecting past processing.
 To exercise these rights, contact: **[Data Protection Contact Email]**.
`,
    },
    {
      id: "data-transfers",
      title: "6. Data Transfers",
      content: `
• Data may be stored and processed in **[Primary Hosting Region]**.
• Transfers outside the EU/EEA are secured by:
    o ==Adequacy decisions (GDPR Art. 45)==,    
    o ==Standard Contractual Clauses (SCCs)==, or
    o Equivalent safeguards under **PIPL (China)** and **DPDP (India)**.
`,
    },
    {
      id: "data-retention",
      title: "7. Data Retention",
      content: `
• ==Account data==: kept as long as the account is active.
• ==Transaction data==: retained for statutory accounting and tax obligations (e.g., **7 years in the EU**).
• Logs and cookies: retained for a limited period (max **13 months** for analytics).
• Upon deletion request: data is **anonymized or securely destroyed**.
`,
    },
    {
      id: "security",
      title: "8. Security",
      content: `
• We implement **technical and organizational measures** (encryption, access control, backups).
• Payments are processed by ==PCI DSS-compliant providers==; Erovians does not store card data.
• Access is restricted to **authorized personnel only**.
`,
    },
    {
      id: "third-party-sharing",
      title: "9. Third-Party Sharing",
      content: `
  Data may be shared with:
• ==Payment providers== (for marketplace transactions).
• ==Hosting providers== (for infrastructure).
• ==Regulatory authorities== (if legally required).
• Other users (only data made public in the directory or marketplace).
  We ==never sell personal data== to third parties.
`,
    },
    {
      id: "cookies-and-tracking",
      title: "10. Cookies and Tracking",
      content: `
  Cookies are used for:
• Essential functions (authentication, navigation).
• Analytics (traffic and usage statistics).
• Marketing (only with ==consent==). 
  See our ==Cookie Policy== for details.
`,
    },
    {
      id: "childrens-privacy",
      title: "11. Children’s Privacy",
      content: `
• The Platform is not intended for minors under **18**. We do **not knowingly collect** their data.
`,
    },
    {
      id: "policy-updates",
      title: "12. Updates to this Policy",
      content: `
• We may update this Policy. Changes are effective upon publication, and users will be notified in case of significant updates.
`,
    },
    {
      id: "contact",
      title: "13. Contact",
      content: `
• For any question or to exercise rights:
  **[Legal Entity]**
  **[Data Protection Officer (if appointed)]**
  ==[Email contact]==
  [Postal address]
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
            Privacy Policy
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

          {/* Bottom Contact */}
          <div className="mt-16 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Need Help?
            </h3>
            <p className="text-gray-700">
              Reach us at{" "}
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