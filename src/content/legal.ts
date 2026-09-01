/**
 * The two legal documents - `/privacy-policy` and `/terms-of-use`.
 *
 * SOURCE. Operator-supplied Google Docs, 2026-09-01:
 *   Privacy Policy   docs.google.com/document/d/1Befhu_hPKjRasziDO28iQqL-IIbQs0-b
 *   Terms of Use     docs.google.com/document/d/1emh-y8SCX9ueKBBX3Dni9ySN4cH6jaNQ
 *
 * Both carry "Effective Date: 9th June 2026". The clause text below is
 * TRANSCRIBED VERBATIM - no clause is reworded, merged, split or renumbered.
 * The only transforms applied are presentational:
 *
 *   - headings are Title Case, not the source's ALL CAPS. Screen readers spell
 *     some all-caps strings letter by letter and the words are unchanged, so
 *     this is a rendering decision, not an edit.
 *   - the authored clause numbers are carried as data (`number`) so they render
 *     beside the heading instead of being baked into it.
 *
 * FIVE SOURCE DEFECTS ARE REPRODUCED AS AUTHORED rather than silently repaired.
 * Renumbering or rewriting a legal clause is the operator's call, never an
 * implementer's, so each is carried through and recorded here:
 *
 *   1. Privacy S4 skips 4.3 - it runs 4.1, 4.2, 4.4, 4.5 ...
 *   2. Privacy S12 runs 12.1, 12.2, then SIX unnumbered rights, then 12.8.
 *      The six are presumably 12.3-12.7 (which is only five slots) and are
 *      rendered unnumbered, exactly as supplied.
 *   3. Terms S7 skips 7.3 - it runs 7.1, 7.2, 7.4.
 *   4. Terms S17 is authored "DisCLAIMER". Title-cased to "Disclaimer" by the
 *      same rule as every other heading; no other heading needed a decision.
 *   5. Terms 20.5 and 20.12 carry a markdown link whose visible text is
 *      `DPO@blocverse.com` but whose href is `mailto:info@blocverse.com`. The
 *      visible address is used - it is the one every other clause names - and
 *      the mismatch is reported rather than guessed at.
 *
 * A sixth item is content, not markup: Privacy S6 has UseAzza using WhatsApp to
 * "coordinate transportation and logistics services" and "communicate with
 * drivers or service providers". That reads as boilerplate from a ride-hailing
 * policy. It is transcribed verbatim and raised for the operator.
 *
 * LINKS ARE NOT MARKED UP IN THE COPY. Email addresses and http(s) URLs are
 * detected at render time by `LegalText` - see its note for why.
 */

/** A paragraph, a bulleted list, or a numbered subsection wrapping either. */
export type LegalBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; items: readonly string[] }
  | {
      kind: "sub";
      /** The authored clause number, e.g. "4.1". Omitted where the source omits it. */
      number?: string;
      heading: string;
      blocks: readonly LegalBlock[];
    };

export interface LegalSection {
  /** Anchor slug. Stable - these are cited, so they must not drift. */
  id: string;
  /** The authored clause number, e.g. "1.0". */
  number: string;
  heading: string;
  blocks: readonly LegalBlock[];
}

export interface LegalDocument {
  /** Route slug, matching the href the footer has always pointed at. */
  slug: "privacy-policy" | "terms-of-use";
  title: string;
  /** Machine-readable, for <time dateTime>. */
  effectiveDate: string;
  /** As rendered. The source writes "9th June 2026". */
  effectiveDateLabel: string;
  /**
   * Not from the source documents - neither carries a standfirst. Written to
   * summarise the document for the page's <meta name="description"> and for the
   * reader arriving from the footer, and kept to the facts each document states
   * about itself in its own first clause.
   */
  standfirst: string;
  sections: readonly LegalSection[];
}

/** Both documents name the same contact. Declared once. */
export const LEGAL_CONTACT_EMAIL = "DPO@blocverse.com";

/* ------------------------------------------------------------------ *
 * Privacy Policy
 * ------------------------------------------------------------------ */

const PRIVACY_SECTIONS: readonly LegalSection[] = [
  {
    id: "general-information",
    number: "1.0",
    heading: "General Information",
    blocks: [
      {
        kind: "p",
        text: "This Privacy Policy outlines how UseAzza Ltd (“UseAzza” “we,” or “us”) collects, uses, discloses, and protects your information when you use our websites, mobile/web applications, and other online services (collectively, the “Services”) where this policy is posted. It applies to all consumer users (“you”) of our Services and forms part of our Terms of Use.",
      },
      {
        kind: "p",
        text: "By accessing or using our Services, you agree to this Privacy Policy and our Terms of Use. If you do not agree, please do not use our Services. If we make changes, we will notify you by revising the date at the top of this policy, and in some cases, we may provide you with additional notice (such as by adding a statement to the homepages of our website or mobile application or by sending you an email notification).",
      },
      {
        kind: "p",
        text: "UseAzza processes personal information in accordance with the Nigeria Data Protection Act, 2023 and complies with applicable consumer protection requirements under the Federal Competition and Consumer Protection Act, 2018",
      },
      {
        kind: "p",
        text: "We encourage you to review the privacy policy whenever you interact with us to stay informed about our information practices and how you can help protect your privacy.",
      },
      {
        kind: "p",
        text: "We are committed to protecting your privacy when you use our Services. You may browse certain parts of our digital platform without providing personal information or accepting cookies, in which case we are unlikely to collect or process any data about you.",
      },
    ],
  },
  {
    id: "application-of-this-privacy-policy",
    number: "2.0",
    heading: "Application of This Privacy Policy",
    blocks: [
      {
        kind: "p",
        text: 'This Privacy Policy applies to your use of (regardless of means of access) our Services. You may access or use our Services through a desktop, laptop, mobile phone, tablet, or other consumer electronic device (each, a "Device").',
      },
    ],
  },
  {
    id: "modifications-and-revisions",
    number: "3.0",
    heading: "Modifications and Revisions",
    blocks: [
      {
        kind: "p",
        text: "We may update this Privacy Policy at any time. If changes affect how your data is processed, we will notify you and obtain your consent where required. Unless otherwise stated, updates apply only to information collected after the effective date of the change. You are responsible for reviewing this policy periodically for any updates.",
      },
    ],
  },
  {
    id: "personal-data-we-receive-from-you",
    number: "4.0",
    heading: "Personal Data We Receive From You",
    blocks: [
      {
        kind: "p",
        text: "When you visit our Services, we may collect the following personal information from or about you:",
      },
      {
        kind: "sub",
        number: "4.1",
        heading: "Contact Information",
        blocks: [{ kind: "p", text: "Your name, phone number, and e-mail address." }],
      },
      {
        kind: "sub",
        number: "4.2",
        heading: "Account/Registration Information",
        blocks: [
          {
            kind: "p",
            text: "Your full name, address, email address, telephone number, occupation, means of identification, address, and registration number of your business/company (if you have one).",
          },
        ],
      },
      {
        kind: "sub",
        number: "4.4",
        heading: "Payment Information",
        blocks: [{ kind: "p", text: "Your bank and/or wallet account details." }],
      },
      {
        kind: "sub",
        number: "4.5",
        heading: "Online Identifiers",
        blocks: [
          {
            kind: "p",
            text: "IP address, advertising ID, unique device ID, other information about your device, and internal and third-party IDs that have been assigned to you.",
          },
        ],
      },
      {
        kind: "sub",
        number: "4.6",
        heading: "Location Information",
        blocks: [
          {
            kind: "p",
            text: "Information about your precise location that we collect from your device (collected in limited circumstances) or information about your general location derived from your IP address.",
          },
        ],
      },
      {
        kind: "sub",
        number: "4.7",
        heading: "Internet Activity Information",
        blocks: [
          {
            kind: "p",
            text: "Information about your use of our Services, your interactions with the e-mails we send to you, and your activities on other websites you visit, including the web pages, content, and advertisements you view and links you click on, and whether you open, forward, or click the links in e-mails we send to you; your browsing history; and social media you use, including the “shares” and “likes” you make on a social media platform that is connected to the Services.",
          },
        ],
      },
      {
        kind: "p",
        text: "Depending on how you use our website, services, and applications, you will be subject to different types of Personal Data collected and different mechanisms of collection:",
      },
      {
        kind: "sub",
        number: "4.8",
        heading: "Registered Users",
        blocks: [
          {
            kind: "p",
            text: "As a user of our website, services, and applications, you may be asked to register to use our applications in a legal manner. During the process of your registration, we will collect some of the following Personal Data from you through your voluntary disclosure. Personal Data may be asked for concerning:",
          },
          {
            kind: "list",
            items: [
              "Interaction with our representatives in any way",
              "Receiving notifications by text message or email about marketing",
              "Receiving general emails from us",
            ],
          },
          {
            kind: "p",
            text: "By undergoing the registration process, you consent to us collecting your Personal Data, including the Personal Data described in this clause, as well as storing, using, or disclosing (as required by law), your Personal Data under this Privacy Policy.",
          },
        ],
      },
      {
        kind: "sub",
        number: "4.9",
        heading: "Unregistered Users",
        blocks: [
          {
            kind: "p",
            text: 'If you are a passive user of our Services and do not register at all (“Unregistered User”), you may still be subject to certain passive data collection ("Passive Data Collection"). Such Passive Data Collection may include, through cookies, as described below, IP address information, location information, and certain browser data, such as history and/or session information.',
          },
        ],
      },
      {
        kind: "sub",
        number: "4.10",
        heading: "All Users",
        blocks: [
          {
            kind: "p",
            text: "The Passive Data Collection that applies to Unregistered Users shall also apply to all other users and/or visitors of our Services.",
          },
        ],
      },
      {
        kind: "sub",
        number: "4.11",
        heading: "Related Entities",
        blocks: [
          {
            kind: "p",
            text: "We may share your Personal Data, including Personal Data that identifies you personally, with any of our parent companies, subsidiary companies, affiliates, or other trusted related entities.",
          },
          {
            kind: "p",
            text: "However, we only share your Personal Data with a trusted related entity if that entity agrees to our privacy standards as set out in this Privacy Policy and to treat your Data in a similar manner we do.",
          },
        ],
      },
      {
        kind: "sub",
        number: "4.12",
        heading: "Email Marketing",
        blocks: [
          {
            kind: "p",
            text: "You may be asked to provide certain Personal Data, such as your name and email address, to receive email marketing communications. This information will only be obtained through your voluntary disclosure, and you will be asked to affirmatively opt in to email marketing communications.",
          },
        ],
      },
      {
        kind: "sub",
        number: "4.13",
        heading: "User Experience",
        blocks: [
          {
            kind: "p",
            text: "From time to time, we may request information from you to assist us in improving our Services, such as demographic information or your particular preferences.",
          },
        ],
      },
    ],
  },
  {
    id: "personal-data-we-receive-automatically",
    number: "5.0",
    heading: "Personal Data We Receive Automatically",
    blocks: [
      {
        kind: "sub",
        number: "5.1",
        heading: "Cookies",
        blocks: [
          {
            kind: "p",
            text: "We may collect information from you through automatic tracking systems (such as information about your browsing preferences) as well as through information that you volunteer to us (such as information that you provide during a registration process or at other times while using our website, services, and applications as described above).",
          },
          {
            kind: "p",
            text: "For example, we use cookies to make your browsing experience easier and more intuitive: cookies are small strings of text used to store some information that may concern the user, his or her preferences, or the device they are using to access the internet (such as a computer, tablet, or mobile phone). Cookies are mainly used to adapt the operation of the site to your expectations, offering a more personalized browsing experience and memorizing the choices you made previously.",
          },
          {
            kind: "p",
            text: "A cookie consists of a reduced set of data transferred to your browser from a web server, and it can only be read by the server that made the transfer. This is not executable code and does not transmit viruses.",
          },
          {
            kind: "p",
            text: "Cookies do not record or store any Personal Data. If you want, you can prevent the use of cookies, but then you may not be able to use our Services as we intend. To proceed without changing the options related to cookies, simply continue to use our Services without modification to your cookie preferences.",
          },
        ],
      },
      {
        kind: "sub",
        number: "5.2",
        heading: "Technical Cookies",
        blocks: [
          {
            kind: "p",
            text: "Technical cookies, which can also sometimes be called HTML cookies, are used for navigation and to facilitate your access to and use of the site. They are necessary for the transmission of communications on the network or to supply services requested by you. The use of technical cookies allows for the safe and efficient use of the site.",
          },
          {
            kind: "p",
            text: "You can manage or request the general deactivation or cancellation of cookies through your browser. If you do this, though, please be advised that this action might slow down or prevent access to some parts of the site.",
          },
          {
            kind: "p",
            text: "Cookies may also be retransmitted by an analytics or statistics provider to collect aggregated information on the number of users and how they visit our website, services, and applications. These are also considered technical cookies when they operate as described.",
          },
          {
            kind: "p",
            text: "Temporary session cookies are deleted automatically at the end of the browsing session - these are mostly used to identify you and ensure that you don't have to log in each time, whereas permanent cookies remain active longer than just one particular session.",
          },
        ],
      },
      {
        kind: "sub",
        number: "5.3",
        heading: "Third-Party Cookies",
        blocks: [
          {
            kind: "p",
            text: "We may also utilize third-party cookies, which are cookies sent by a third party to your computer. Permanent cookies are often third-party cookies. The majority of third-party cookies consist of tracking cookies used to identify online behavior, understand interests, and then customize advertising for users.",
          },
          {
            kind: "p",
            text: "Third-party analytical cookies may also be installed. They are sent from the domains of the aforementioned third parties, external to the site. Third-party analytical cookies are used to detect information on user behavior on our website, services, and applications. This takes place anonymously to monitor the performance and improve the usability of the site. Third-party profiling cookies are used to create profiles relating to users and to propose advertising in line with the choices expressed by the users themselves.",
          },
          {
            kind: "p",
            text: "UseAzza does not assume and shall not have any liability or responsibility to you or any other person for damages linked to the third party and its services. These cookies can be manually disabled in your browser.",
          },
        ],
      },
      {
        kind: "sub",
        number: "5.4",
        heading: "Profiling Cookies",
        blocks: [
          {
            kind: "p",
            text: "We may also use profiling cookies, which are those that create profiles related to the user and are used to send advertising to the user's browser.",
          },
          {
            kind: "p",
            text: "When these types of cookies are used, we will receive your explicit consent.",
          },
          {
            kind: "p",
            text: "To learn more about cookies, you may wish to visit: www.allaboutcookies.org or www.google.com/policies/technologies/cookies/.",
          },
        ],
      },
      {
        kind: "sub",
        number: "5.5",
        heading: "Support in Configuring Your Browser",
        blocks: [
          {
            kind: "p",
            text: "You can manage cookies through the settings of your browser on your device. However, deleting cookies from your browser may remove the preferences you have set for using our website, services, and applications.",
          },
        ],
      },
      {
        kind: "sub",
        number: "5.6",
        heading: "Log Data",
        blocks: [
          {
            kind: "p",
            text: "Like all websites and mobile applications, our website, services, and applications also make use of log files that store automatic information collected during user visits.",
          },
          {
            kind: "p",
            text: "The aforementioned information is processed in an automated form and collected in an exclusively aggregated manner to verify the correct functioning of the site and for security reasons. For security purposes (spam filters, firewalls, virus detection), the automatically recorded data may also possibly include Personal Data such as IP address, which could be used, under applicable laws, to block attempts at damage to our Services or damage to other users, or in the case of harmful activities or crime. Such data is never used for the identification or profiling of the user, but only for the protection of our website, services, and applications, and our users.",
          },
        ],
      },
    ],
  },
  {
    id: "third-parties",
    number: "6.0",
    heading: "Third Parties",
    blocks: [
      {
        kind: "p",
        text: "To facilitate the provision of our Services, UseAzza may utilize WhatsApp and other third-party communication platforms to receive customer requests, provide customer support, share service updates, facilitate bookings, coordinate transportation and logistics services, communicate with drivers or service providers, and otherwise deliver the Services requested by users.",
      },
      {
        kind: "p",
        text: "By communicating with UseAzza through WhatsApp or any other third-party communication platform, you acknowledge and understand that your communications may be processed through systems operated by the relevant platform provider. Such processing is subject to the provider's own privacy policies, terms of service, and security practices, over which UseAzza has no direct control.",
      },
      {
        kind: "p",
        text: "Where necessary to fulfil your requests and provide the Services, UseAzza may collect, access, store, and process information shared through WhatsApp communications, including your name, telephone number, location information, service requests, correspondence, transaction details, and other information voluntarily provided by you.",
      },
      {
        kind: "p",
        text: "UseAzza may also engage trusted third-party service providers to assist with cloud hosting, data storage, analytics, customer support, communications management, payment processing, security monitoring, and other operational functions. Such providers may have access to Personal Data only to the extent necessary to perform services on our behalf and are required to implement appropriate confidentiality and security safeguards.",
      },
      {
        kind: "p",
        text: "Some of these service providers, including WhatsApp and its affiliated entities, may process Personal Data outside Nigeria. Where international transfers occur, UseAzza will take reasonable steps to ensure that such transfers are carried out in accordance with the Nigeria Data Protection Act, 2023 and applicable data protection requirements.",
      },
      {
        kind: "p",
        text: "We do not sell or rent your Personal Data to third parties. However, we may disclose Personal Data where required by law, regulatory requirements, court order, lawful governmental request, or where necessary to protect the rights, property, safety, or legitimate interests of UseAzza, its users, or third parties.",
      },
      {
        kind: "p",
        text: "Please note that if you choose not to provide information through WhatsApp or other designated communication channels used by UseAzza, certain Services or features may not be available or may be limited.",
      },
      {
        kind: "p",
        text: "UseAzza primarily delivers certain customer-facing services through WhatsApp Business. Users who engage with UseAzza through WhatsApp acknowledge that their communications are also subject to WhatsApp's privacy practices and terms of service",
      },
    ],
  },
  {
    id: "communications",
    number: "7.0",
    heading: "Communications",
    blocks: [
      {
        kind: "p",
        text: "We will get your express opt-in consent before we share your personal data with any company outside UseAzza for marketing purposes. If you opt in to receive marketing from partners and affiliates, we recommend that you read their privacy policy to see how they will use your data and how to alter your marketing preferences with them should you wish to in the future.",
      },
    ],
  },
  {
    id: "transfers-and-disclosures",
    number: "8.0",
    heading: "Transfers and Disclosures",
    blocks: [
      {
        kind: "p",
        text: "In the event of a sale, merger, consolidation, change in control, transfer of substantial assets, reorganization, or liquidation, we may transfer, sell, or assign to third parties information concerning your relationship with us, including without limitation, Personal Information that you provide and other information concerning your relationship with us.",
      },
      {
        kind: "p",
        text: "We may transfer your Personal Data to third parties under confidentiality obligations when required to perform any service in relation to the Services we offer.",
      },
      {
        kind: "p",
        text: "In any event, we allow other parties to use Personal Data we hold about you, those parties are bound by strict contractual provisions with us and only have access to personal data needed to perform their functions and may not use it for other purposes. Further, they must process the personal data in accordance with this Privacy Policy.",
      },
    ],
  },
  {
    id: "storage-of-personal-data",
    number: "9.0",
    heading: "Storage of Personal Data",
    blocks: [
      {
        kind: "p",
        text: "We use secure physical and digital systems to store your Personal Data when appropriate. We ensure that your Personal Data is protected against unauthorized access, disclosure, or destruction.",
      },
      {
        kind: "p",
        text: "Please note, however, that no system involving the transmission of information via the Internet or the electronic storage of data is completely secure. However, we take the protection and storage of your Personal Data very seriously. We take all reasonable steps to protect your Personal Data.",
      },
      {
        kind: "p",
        text: "Personal Data is stored throughout your relationship with us. We delete your Personal Data upon request for the cancellation of your account or other general requests for the deletion of data.",
      },
      {
        kind: "p",
        text: "In the event of a breach of your Personal Data, you will be notified in a reasonable time frame, but in no event later than two weeks, and we will follow all applicable laws regarding such breach.",
      },
    ],
  },
  {
    id: "use-of-personal-data",
    number: "10.0",
    heading: "Use of Personal Data",
    blocks: [
      {
        kind: "p",
        text: "We primarily use your Personal Data to help us provide a better experience for you on our website, services, and applications, and to provide you with the services and/or information you may have requested, such as the use of our website, services, and applications.",
      },
      {
        kind: "p",
        text: "Information that does not identify you personally, but that may assist in providing us with broad overviews of our customer base, will be used for market research or marketing efforts. Such information may include, but is not limited to, interests based on your cookies.",
      },
      {
        kind: "p",
        text: "Personal Data that may be considered identifying may be used for the following:",
      },
      {
        kind: "list",
        items: [
          "Improving your personal user experience.",
          "Communicating with you about your user account with us.",
          "Marketing and advertising to you, including via email.",
          "Fulfill your requests for services and information (including sending you newsletters via e-mail or postal mail).",
          "Providing customer service to you.",
          "Verifying your identity for the purpose of applicable credit checks;",
          "Advising you about updates to our website, services, and applications, or related Items.",
        ],
      },
      {
        kind: "p",
        text: "We may monitor and record communications with you (including phone conversations and emails) for quality assurance and compliance. Before doing that, we will always tell you of our intentions and of the specific purpose of making the recording.",
      },
      {
        kind: "p",
        text: "Understand trends in how the visitors to our Services interact with the ads, content, and features on our Services (e.g., your behavior on our Services may be included in a general report about whether people prefer video content over written content on our Services).",
      },
    ],
  },
  {
    id: "disclosure-of-personal-data",
    number: "11.0",
    heading: "Disclosure of Personal Data",
    blocks: [
      {
        kind: "p",
        text: "Although our policy is to maintain the privacy of your Personal Data as described herein, we may disclose your Personal Data if we believe that it is reasonable to do so in certain cases, at our sole and exclusive discretion. Such cases may include, but are not limited to:",
      },
      {
        kind: "list",
        items: [
          "To satisfy any local, state, or Federal laws or regulations.",
          "To respond to requests, such as discovery, criminal, civil, or administrative processes, subpoenas, court orders, or writs from law enforcement or other governmental or legal bodies.",
          "To bring legal action against a user who has violated the law or violated the terms of use of our website, services, and applications.",
          "As may be necessary for the operation of our website, services, and applications",
          "To generally cooperate with any lawful investigation about our users.",
          "If we suspect any fraudulent activity on our website, services, and applications, or if we have noticed any activity that may violate our terms or other applicable rules.",
          "If we, or substantially all of our assets, are acquired or are in the process of being acquired by a third party, in which case, personal information held by us about our customers will be one of the transferred assets.",
        ],
      },
      {
        kind: "p",
        text: "We may employ companies and individuals to perform functions on our behalf and we may disclose your personal information to these parties for the purposes set out above, for example, for reviewing and accepting applications, processing payments, sending postal mail and email, analyzing data, providing marketing assistance, providing search results and links and providing customer service. Those parties will be bound by strict contractual provisions with us and will only have access to personal information needed to perform their functions, and they may not use it for any other purpose. Further, they must process the personal information in accordance with this Notice and as permitted by the Data Protection Regulation.",
      },
    ],
  },
  {
    id: "your-right-to-request",
    number: "12.0",
    heading: "Your Right to Request",
    blocks: [
      { kind: "p", text: "You have the right to:" },
      {
        kind: "sub",
        number: "12.1",
        heading: "Request Access",
        blocks: [
          {
            kind: "p",
            text: 'Request access to your personal data (commonly known as a "data subject access request"). This enables you to receive a copy of the personal data we hold about you and to check that we are lawfully processing it.',
          },
        ],
      },
      {
        kind: "sub",
        number: "12.2",
        heading: "Request Correction",
        blocks: [
          {
            kind: "p",
            text: "Request correction of the personal data that we hold about you. This enables you to have any incomplete or inaccurate data we hold about you corrected, though we may need to verify the accuracy of the new data you provide to us.",
          },
        ],
      },
      {
        kind: "sub",
        heading: "Request Erasure",
        blocks: [
          {
            kind: "p",
            text: "Request erasure of your personal data. This enables you to ask us to delete or remove personal data where there is no good reason for us to continue to process it. You also have the right to ask us to delete or remove your personal data where you have successfully exercised your right to object to processing, where we may have processed your information unlawfully, or where we are required to erase your personal data to comply with local law. Note, however, that we may not always be able to comply with your request of erasure for specific legal reasons, which you will be notified of, if applicable, at the time of your request. Please note that this may amount to a termination of your right to use the Site.",
          },
        ],
      },
      {
        kind: "sub",
        heading: "Object to Processing",
        blocks: [
          {
            kind: "p",
            text: "Object to the processing of your personal data where we are relying on a legitimate interest (or those of a third party) and there is something about your particular situation which makes you want to object to processing on this ground as you feel it impacts on your fundamental rights and freedoms. You also have the right to object to where we are processing your personal data for direct marketing purposes. In some cases, we may demonstrate that we have compelling legitimate grounds to process your information, which override your rights and freedoms.",
          },
        ],
      },
      {
        kind: "sub",
        heading: "Request Restriction of Processing",
        blocks: [
          {
            kind: "p",
            text: "Request the restriction of the processing of your personal data. This enables you to ask us to suspend the processing of your personal data in the following scenarios: (a) if you want us to establish the data's accuracy; (b) where our use of the data is unlawful but you do not want us to erase it; (c) where you need us to hold the data even if we no longer require it as you need it to establish, exercise or defend legal claims; or (d) you have objected to our use of your data but we need to verify whether we have to override legitimate grounds to use it.",
          },
        ],
      },
      {
        kind: "sub",
        heading: "Request Transfer",
        blocks: [
          {
            kind: "p",
            text: "Request the transfer of your personal data to you or to a third party. We will provide to you, or a third party you have chosen, your personal data in a structured, commonly used, machine-readable format. Note that this right only applies to automated information that you initially provided consent for us to use or where we used the information to perform a contract with you.",
          },
        ],
      },
      {
        kind: "sub",
        heading: "Withdraw Consent",
        blocks: [
          {
            kind: "p",
            text: "Withdraw consent at any time where we are relying on consent to process your personal data. However, this will not affect the lawfulness of any processing carried out before you withdraw your consent. If you withdraw your consent, we may not be able to provide certain services to you. We will advise you if this is the case at the time you withdraw your consent.",
          },
        ],
      },
      {
        kind: "sub",
        number: "12.8",
        heading: "No Fee Usually Required",
        blocks: [
          {
            kind: "p",
            text: "You will not have to pay a fee to access your personal data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive. Alternatively, we may refuse to comply with your request in these circumstances.",
          },
        ],
      },
      {
        kind: "sub",
        heading: "What We May Need From You",
        blocks: [
          {
            kind: "p",
            text: "We may need to request specific information from you to help us confirm your identity and ensure your right to access your personal data (or to exercise any of your other rights). This is a security measure to ensure that personal data is not disclosed to any person who has no right to receive it. We may also contact you to ask you for further information in relation to your request to speed up our response.",
          },
        ],
      },
      {
        kind: "sub",
        heading: "Time Limit to Respond",
        blocks: [
          {
            kind: "p",
            text: "We try to respond to all legitimate requests within one month. Occasionally, it may take us longer than a month if your request is particularly complex or you have made a number of requests. In this case, we will notify you and keep you updated.",
          },
        ],
      },
      {
        kind: "p",
        text: `These rights can all be exercised by contacting us at ${LEGAL_CONTACT_EMAIL}`,
      },
    ],
  },
  {
    id: "opting-out",
    number: "13.0",
    heading: "Opting Out",
    blocks: [
      {
        kind: "p",
        text: `From time to time, we may send you informational or marketing communications related to our website, services, and applications, such as announcements or other information. If you wish to opt out of such communications, you may contact the following email address: ${LEGAL_CONTACT_EMAIL} . You may also click the opt-out link, which will be provided at the bottom of all such communications.`,
      },
      {
        kind: "p",
        text: "Please be advised that even though you may opt out of such communications, you may still receive information from us that is specifically about your use of our website, services, and applications or your account with us.",
      },
      {
        kind: "p",
        text: "By providing any Personal Data to us, or by using our website, services, and applications in any manner, you have created a commercial relationship with us. As such, you agree that any email sent from us or third-party affiliates, even unsolicited email, shall specifically not be considered SPAM, as that term is legally defined.",
      },
    ],
  },
  {
    id: "acceptance-of-risk",
    number: "14.0",
    heading: "Acceptance of Risk",
    blocks: [
      {
        kind: "p",
        text: "By continuing to use our website, services, and applications in any manner, you manifest your continuing assent to this Privacy Policy. You further acknowledge, agree, and accept that no transmission of information or data via the Internet is always completely secure, no matter what steps are taken. Your communications may go through a number of countries before they are delivered – this is the nature of the Internet. You acknowledge, agree, and accept that we do not guarantee or warrant the security of any information that you provide to us and that you transmit such information at your own risk. We cannot accept responsibility for any unauthorized access or loss of personal information that is beyond our control.",
      },
    ],
  },
  {
    id: "contact-information",
    number: "15.0",
    heading: "Contact Information",
    blocks: [
      {
        kind: "p",
        text: `If you have any questions about this Privacy Policy or the way we collect information from you, or if you would like to launch a complaint about anything related to this Privacy Policy, you may contact us or our DPO at the following email address: ${LEGAL_CONTACT_EMAIL}`,
      },
    ],
  },
];

export const PRIVACY_POLICY: LegalDocument = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  effectiveDate: "2026-06-09",
  effectiveDateLabel: "9th June 2026",
  standfirst:
    "How UseAzza Ltd collects, uses, discloses, and protects your information when you use our websites, applications, and other online services.",
  sections: PRIVACY_SECTIONS,
};

/* ------------------------------------------------------------------ *
 * Terms of Use
 * ------------------------------------------------------------------ */

const TERMS_SECTIONS: readonly LegalSection[] = [
  {
    id: "definitions",
    number: "1.0",
    heading: "Definitions",
    blocks: [
      {
        kind: "p",
        text: 'These Terms of Use (these "Terms") represent an agreement between you and UseAzza Ltd (“we,” “us,” “our” or “UseAzza”), governing your use of and access to our website, affiliated websites, and all related services, products, and applications (collectively, the "Services"). "You" and "your" refer to the person who uses or accesses the Services.',
      },
    ],
  },
  {
    id: "the-agreement",
    number: "2.0",
    heading: "The Agreement",
    blocks: [
      {
        kind: "p",
        text: "Your use of the Services is subject to these Terms and our Privacy Policy. By accessing the Services, you acknowledge that you have read and understood these Terms and our Privacy Policy, and agree to be bound by them. If you do not agree with any part, do not use the Services. These Terms and the Privacy Policy also apply if you become a customer, with any additional terms that you agree to when you opt for any of our services.",
      },
      {
        kind: "p",
        text: "You acknowledge that transactions involving cryptocurrencies and digital assets involve substantial risks. The value of cryptocurrencies may fluctuate significantly and rapidly due to market conditions, regulatory developments, technological changes, liquidity constraints, and other factors beyond UseAzza's control.",
      },
      { kind: "p", text: "You understand and accept that:" },
      {
        kind: "list",
        items: [
          "crypto asset prices may rise or fall dramatically;",
          "past performance is not indicative of future performance;",
          "blockchain transactions may be irreversible;",
          "regulatory treatment of digital assets may change at any time;",
          "technical failures, cyberattacks, smart contract vulnerabilities, or blockchain disruptions may occur; and",
          "you may lose part or all of the value of your digital assets.",
        ],
      },
      {
        kind: "p",
        text: "You are solely responsible for evaluating the risks associated with any transaction undertaken through the Services.",
      },
    ],
  },
  {
    id: "obligations",
    number: "3.0",
    heading: "Obligations",
    blocks: [
      { kind: "p", text: "To use the Services, you must:" },
      {
        kind: "list",
        items: [
          "accept and agree to these Terms and our Privacy Policy;",
          "be at least 18 years of age;",
          'register to create a User Account and provide the required information, including your name, email, identification, and other necessary details ("User Information");',
          "keep your User Information accurate, current, and complete.",
        ],
      },
      {
        kind: "p",
        text: "You are responsible for safeguarding your User Account and promptly notifying us of any unauthorised use. Providing false information or using the Services unlawfully is grounds for termination.",
      },
    ],
  },
  {
    id: "license-to-use-services",
    number: "4.0",
    heading: "License to Use Services",
    blocks: [
      {
        kind: "p",
        text: "We grant you a non-exclusive, limited, and revocable license to use the Services solely for your personal or business use in connection with the Services. This license terminates when you cease using the Services or if this Agreement ends.",
      },
    ],
  },
  {
    id: "intellectual-property",
    number: "5.0",
    heading: "Intellectual Property",
    blocks: [
      {
        kind: "p",
        text: 'The Services, including all content and intellectual property (“Company IP”), belong to UseAzza. You agree not to reproduce, distribute, infringe upon, or use the Company\'s IP unlawfully. If you submit content ("User Content"), you grant us the right to use, modify, and distribute it in connection with the Services.',
      },
      {
        kind: "p",
        text: "You must ensure that User Content is legal and non-infringing. We reserve the right to remove any User Content that violates these Terms. To the extent permitted by law, we may, in our sole discretion and without liability to you, terminate (or suspend access to) your use of the Services, Content, or your UseAzza Account for any reason, including, but not limited to, your breach of these Terms.",
      },
    ],
  },
  {
    id: "acceptable-use",
    number: "6.0",
    heading: "Acceptable Use",
    blocks: [
      { kind: "p", text: "You agree not to use the Services for the following:" },
      {
        kind: "list",
        items: [
          "Illegal activities",
          "Violation of the intellectual property rights of the Company or any third party;",
          "Upload or otherwise disseminate harmful software;",
          "Engagement in fraud; or",
          "Publish or distribute any obscene or defamatory material.",
        ],
      },
      {
        kind: "p",
        text: "UseAzza reserves the right to refuse, suspend, restrict, or terminate access to the Services where:",
      },
      {
        kind: "list",
        items: [
          "identity verification cannot be completed;",
          "information provided is inaccurate, incomplete, misleading, or fraudulent;",
          "regulatory or compliance concerns arise; or",
          "additional verification is required but not provided within a reasonable timeframe.",
        ],
      },
      {
        kind: "p",
        text: "You authorise UseAzza to conduct verification checks directly or through authorised third-party service providers and governmental databases where permitted by law.",
      },
      {
        kind: "p",
        text: "Any violation may result in suspension or termination of your access to the Services.",
      },
    ],
  },
  {
    id: "fulfilment-policy",
    number: "7.0",
    heading: "Fulfilment Policy",
    blocks: [
      {
        kind: "sub",
        number: "7.1",
        heading: "Service Delivery",
        blocks: [
          {
            kind: "p",
            text: "UseAzza is a WhatsApp-based fintech/crypto platform that allows users to buy, sell, send, and cash out crypto through a conversational interface on WhatsApp. Upon approval of your request by our team, we will begin processing your request in accordance with the timeline specified for your chosen service:",
          },
          {
            kind: "list",
            items: [
              "Processing times vary depending on the service type, regulatory requirements, and responsiveness of the user.",
              "Users will receive updates on the status of their requests instantly on WhatsApp.",
              "Any delays caused by incomplete or inaccurate information provided by the user will not be the responsibility of UseAzza.",
            ],
          },
        ],
      },
      {
        kind: "sub",
        number: "7.2",
        heading: "Cancellations",
        blocks: [
          {
            kind: "p",
            text: "Users may request to cancel a service before approval of the service. Once approval for a service has been given, cancellations are no longer permitted. UseAzza reserves the right to modify its service offerings, pricing, and timelines at any time. Any changes will be communicated to users in advance, where applicable.",
          },
          {
            kind: "p",
            text: "Settlement timelines are estimates only and may be affected by banking systems, blockchain confirmations, third-party providers, network congestion, regulatory reviews, public holidays, or circumstances beyond UseAzza's control.",
          },
          {
            kind: "p",
            text: "UseAzza shall not be liable for delays arising from third-party systems, banking institutions, blockchain networks, telecommunications providers, or force majeure events.",
          },
        ],
      },
      {
        kind: "sub",
        number: "7.4",
        heading: "Contact Us",
        blocks: [
          {
            kind: "p",
            text: `For any inquiries regarding your order, please reach out to us at ${LEGAL_CONTACT_EMAIL} .`,
          },
        ],
      },
    ],
  },
  {
    id: "third-party-websites",
    number: "8.0",
    heading: "Third-Party Websites",
    blocks: [
      {
        kind: "p",
        text: "The Services may contain links to third-party websites or services. We provide such links and connections for your reference only. We do not control these sites, and your use of and access to them are at your own risk, subject to their terms and conditions and privacy policy.",
      },
    ],
  },
  {
    id: "privacy-information",
    number: "9.0",
    heading: "Privacy Information",
    blocks: [
      {
        kind: "p",
        text: "UseAzza is committed to upholding the highest standards of data protection and privacy. By using the Services, you consent to the collection, use, storage, and disclosure of your information as outlined in these Terms and our Privacy Policy. Our use of your personal information is governed by our Privacy Policy. You authorise us to verify your identity and collect necessary information for compliance purposes.",
      },
      {
        kind: "p",
        text: "To comply with applicable laws, regulations, internal policies, and risk management requirements, UseAzza may require you to complete identity verification procedures before accessing certain Services or conducting transactions.",
      },
    ],
  },
  {
    id: "reverse-engineering-and-security",
    number: "10.0",
    heading: "Reverse Engineering & Security",
    blocks: [
      {
        kind: "p",
        text: "You agree not to reverse engineer or otherwise compromise the security of the Services.",
      },
    ],
  },
  {
    id: "indemnification",
    number: "11.0",
    heading: "Indemnification",
    blocks: [
      {
        kind: "p",
        text: "You agree to defend, indemnify, and hold UseAzza harmless against claims arising from your use of the Services, violation of these Terms, violation of UseAzza’s Privacy Policy, or unlawful conduct.",
      },
    ],
  },
  {
    id: "modification-and-variation",
    number: "12.0",
    heading: "Modification & Variation",
    blocks: [
      {
        kind: "p",
        text: "UseAzza reserves the right to change these Terms at any time without notice. Any modifications to these terms are effective upon posting on the Website and will replace any prior version unless such versions are specifically referred to or incorporated into the latest modification or variation of these Terms. Continued use of the Services constitutes acceptance of any changes or modifications to these Terms.",
      },
    ],
  },
  {
    id: "entire-agreement",
    number: "13.0",
    heading: "Entire Agreement",
    blocks: [
      {
        kind: "p",
        text: "These Terms, along with the Privacy Policy, constitute the entire understanding between you and UseAzza regarding the use of the Services.",
      },
    ],
  },
  {
    id: "service-interruptions",
    number: "14.0",
    heading: "Service Interruptions",
    blocks: [
      {
        kind: "p",
        text: "We may temporarily suspend the Services for maintenance or other reasons on a scheduled or unscheduled basis without liability as a result of such downtime.",
      },
    ],
  },
  {
    id: "no-warranties",
    number: "15.0",
    heading: "No Warranties",
    blocks: [
      {
        kind: "p",
        text: 'To the fullest extent permitted by law, you understand and agree that your use of the Services, including all information, products, and content (including third-party content), is entirely at your own risk. The Services are provided "as is" and "as available" without any warranties. We and our third-party providers make no promises about the Services, including but not limited to guarantees of performance, accuracy, quality, or fitness for a particular purpose.',
      },
      {
        kind: "p",
        text: "We do not guarantee that: (a) The Services will meet your needs, (b) The Services will be available without interruption or errors, (c) Results obtained from the Services will be accurate or reliable, (d) The quality of any products, services, or information will meet your expectations, or (e) Any errors will be fixed.",
      },
    ],
  },
  {
    id: "wallet-address-responsibility-and-fees",
    number: "16.0",
    heading: "Wallet Address Responsibility and Fees",
    blocks: [
      {
        kind: "p",
        text: "You are solely responsible for ensuring the accuracy of all wallet addresses, account details, payment instructions, and transaction information submitted through the Services.",
      },
      {
        kind: "p",
        text: "Transactions executed using the information provided by you shall be deemed authorised. UseAzza shall not be responsible for losses arising from incorrect wallet addresses, incorrect account details, mistyped information, user error, or instructions submitted by unauthorised persons using your account or communication channels.",
      },
    ],
  },
  {
    id: "disclaimer",
    number: "17.0",
    heading: "Disclaimer",
    blocks: [
      {
        kind: "p",
        text: "UseAzza provides technology-enabled services relating to digital asset transactions.",
      },
      {
        kind: "p",
        text: "Nothing contained in the Services constitutes investment advice, financial advice, tax advice, legal advice, portfolio management services, brokerage services, or a recommendation to buy, sell, hold, or invest in any asset.",
      },
      {
        kind: "p",
        text: "Users are encouraged to obtain independent professional advice before making financial decisions.",
      },
      {
        kind: "p",
        text: "Unless expressly stated otherwise, digital assets are not deposits, are not insured by any government agency, and may not benefit from protections applicable to traditional banking products.",
      },
    ],
  },
  {
    id: "anti-money-laundering",
    number: "18.0",
    heading: "Anti-Money Laundering, Counter-Terrorism Financing and Sanctions Compliance",
    blocks: [
      {
        kind: "p",
        text: "UseAzza is committed to complying with all applicable anti-money laundering, counter-terrorism financing, sanctions, fraud prevention, and financial crime laws.",
      },
      {
        kind: "p",
        text: "You shall not use the Services in connection with money laundering, terrorist financing, proliferation financing, sanctions evasion, fraud, proceeds of crime, and/or any unlawful activity.",
      },
      {
        kind: "p",
        text: "UseAzza may monitor transactions, conduct compliance reviews, request additional information, delay processing, reject transactions, suspend accounts, report suspicious activities to relevant authorities, or take any other action required by law or reasonably necessary to protect the integrity of the Services.",
      },
      {
        kind: "p",
        text: "Where required by law, UseAzza may disclose information relating to your account or transactions to regulators, law enforcement agencies, financial institutions, or other competent authorities without prior notice to you.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    number: "19.0",
    heading: "Limitation of Liability",
    blocks: [
      {
        kind: "p",
        text: "To the fullest extent permitted by law, UseAzza, its affiliates, and their representatives will not be liable for any issues related to using or not being able to use the Services. We are not responsible for any indirect, special, or consequential damages, including loss of profits, data, or goodwill, even if such persons have been advised of the possibility of such damages. This limitation also covers events beyond our control.",
      },
    ],
  },
  {
    id: "general-provisions",
    number: "20.0",
    heading: "General Provisions",
    blocks: [
      {
        kind: "sub",
        number: "20.1",
        heading: "Language",
        blocks: [
          {
            kind: "p",
            text: "All communications made or notices given under this Agreement shall be in the English language.",
          },
        ],
      },
      {
        kind: "sub",
        number: "20.2",
        heading: "Jurisdiction & Choice of Law",
        blocks: [
          {
            kind: "p",
            text: "These terms shall be governed by the laws of the Federal Republic of Nigeria, the Nigeria Data Protection Act, 2023, and complies with applicable consumer protection requirements under the Federal Competition and Consumer Protection Act, 2018.",
          },
        ],
      },
      {
        kind: "sub",
        number: "20.3",
        heading: "Arbitration",
        blocks: [
          {
            kind: "p",
            text: "In case of a dispute between the Parties arising out of these Terms, disputes will be resolved through arbitration.",
          },
        ],
      },
      {
        kind: "sub",
        number: "20.4",
        heading: "Assignment",
        blocks: [{ kind: "p", text: "You may not transfer your rights under these Terms." }],
      },
      {
        kind: "sub",
        number: "20.5",
        heading: "Termination",
        blocks: [
          {
            kind: "p",
            text: `UseAzza reserves the right to terminate this Agreement if you violate its terms, such as violating intellectual property rights, ignoring laws, or sharing illegal content. You can also terminate your account by contacting us at ${LEGAL_CONTACT_EMAIL} . If there are any pending transactions when you request termination, we will close your account after such transactions are completed. Your termination of these Terms will not affect any existing obligations. Some provisions will remain effective even after termination.`,
          },
        ],
      },
      {
        kind: "sub",
        number: "20.6",
        heading: "Severability",
        blocks: [
          {
            kind: "p",
            text: "If any part of this Agreement is held invalid or unenforceable, the remaining parts will remain in effect to the fullest extent possible. The rest of the Agreement shall continue in full force.",
          },
        ],
      },
      {
        kind: "sub",
        number: "20.7",
        heading: "No Waiver",
        blocks: [
          {
            kind: "p",
            text: "If we fail to enforce any provision of this Agreement, this shall not constitute a waiver of any future enforcement of that provision or any other provision. Waiver of any part or sub-part of this Agreement will not constitute a waiver of any other part or sub-part.",
          },
        ],
      },
      {
        kind: "sub",
        number: "20.8",
        heading: "Headings for Convenience Only",
        blocks: [
          {
            kind: "p",
            text: "Headings of parts and sub-parts under this Agreement are for convenience and organisation only. Headings shall not affect the meaning of any provisions of this Agreement.",
          },
        ],
      },
      {
        kind: "sub",
        number: "20.9",
        heading: "No Agency, Partnership, or Joint Venture",
        blocks: [
          {
            kind: "p",
            text: "No agency, partnership, or joint venture has been created between the Parties as a result of this Agreement. However, you agree that our third-party service providers are third-party beneficiaries of the applicable provisions of these Terms, and have the right to enforce applicable terms as if such service providers were a party to these Terms.",
          },
        ],
      },
      {
        kind: "sub",
        number: "20.10",
        heading: "Force Majeure",
        blocks: [
          {
            kind: "p",
            text: "UseAzza is not liable for any failure to perform due to causes beyond its reasonable control, including, but not limited to, acts of God, acts of civil authorities, acts of military authorities, riots, embargoes, acts of nature and natural disasters, and other acts which may be due to unforeseen circumstances.",
          },
        ],
      },
      {
        kind: "sub",
        number: "20.11",
        heading: "Communications",
        blocks: [
          {
            kind: "p",
            text: `All communication under this Agreement will be conducted via email. For any questions or concerns, please email us at: ${LEGAL_CONTACT_EMAIL}`,
          },
        ],
      },
      {
        kind: "sub",
        number: "20.12",
        heading: "Unsubscribing from Our Services",
        blocks: [
          {
            kind: "p",
            text: `You may unsubscribe from our communications at any time by clicking the "Unsubscribe" link at the bottom of any email we send you or you can contact us at ${LEGAL_CONTACT_EMAIL} with the subject line "Unsubscribe," and we will process your request.`,
          },
        ],
      },
      {
        kind: "sub",
        number: "20.13",
        heading: "Miscellaneous",
        blocks: [
          {
            kind: "p",
            text: "These Terms and our Privacy Policy constitute the entire agreement regarding the Services and replace any previous agreements. You acknowledge that you are not an employee, agent, or partner of UseAzza and do not have the authority to bind UseAzza in any respect whatsoever.",
          },
        ],
      },
    ],
  },
];

export const TERMS_OF_USE: LegalDocument = {
  slug: "terms-of-use",
  title: "Terms of Use",
  effectiveDate: "2026-06-09",
  effectiveDateLabel: "9th June 2026",
  standfirst:
    "The agreement between you and UseAzza Ltd governing your use of and access to our website, affiliated websites, and all related services, products, and applications.",
  sections: TERMS_SECTIONS,
};

/** Cross-links between the two documents - each names the other in its copy. */
export const LEGAL_DOCUMENTS: readonly LegalDocument[] = [PRIVACY_POLICY, TERMS_OF_USE];
