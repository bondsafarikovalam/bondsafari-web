// Content of the four legal pages: /privacy-policy, /terms-and-conditions, /cancellation-policy, /refund-policy.
// Source: "Bond Safari – Website Legal Pages Information & Policy Guidelines" (PDF supplied by Bond Water Sports Pvt. Ltd.).
// Nothing here goes beyond that document. Points the PDF left open are listed in LEGAL_MANAGEMENT_CHECKLIST.md.
//
// Confirmed as correct by Bond Safari on 14 November 2026, so LEGAL_APPROVED is true: no draft banner, indexable and
// in the sitemap. Setting it back to false restores the draft banner, noindex and sitemap exclusion. FLAG text in
// any block is still shown highlighted, for marking a point that needs confirmation.

export const LEGAL_APPROVED = true
// The date shown as "Last updated" on all four pages, e.g. '1 December 2026'
export const LAST_UPDATED: string | null = '14 November 2026'

// Shown highlighted on the page wherever the PDF leaves something to be confirmed
export const FLAG = '[MANAGEMENT CONFIRMATION REQUIRED]'

// Inline links in text: [[label|/path]]. A block is a paragraph, a sub-heading, a bullet list, a table or a note
export type LegalBlock = string | { sub: string } | { list: string[] } | { table: { head: string[]; rows: string[][] } } | { note: string }
export type LegalSection = { id: string; title: string; blocks: LegalBlock[] }
export type LegalDoc = { slug: string; title: string; eyebrow: string; description: string; intro: string; sections: LegalSection[] }

export const legalBusiness = {
  brand: 'Bond Safari Kovalam',
  // The PDF names two registered companies; which one operates the website and contracts with customers is unconfirmed
  entities: [
    { name: 'Bond Water Sports Pvt. Ltd.', gstin: '32AAICB4429P1ZE' },
    { name: 'Bond Adventures Pvt. Ltd.', gstin: '32AAHCB9453C1ZW' },
  ],
  type: 'Private Limited Company',
  address: 'Suseela Tower, VRP XIX/553-A, Beach Road, Kovalam, Kerala 695527',
  website: 'https://www.bondsafarikovalam.com',
  email: 'enquiry@bondsafarikovalam.com',
  privacyEmail: 'sales@bondsafarikovalam.com',
  phone: '+91 84484 48846',
}

const operator = `Bond Safari Kovalam ("Bond Safari", "we", "us" or "our") is a brand of Bond Water Sports Pvt. Ltd. / Bond Adventures Pvt. Ltd., private limited companies registered in Kerala, India.`

export const legalDocs: LegalDoc[] = [
  // ───────────────────────────────── Privacy Policy ─────────────────────────────────
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    eyebrow: 'Legal · Privacy',
    description: 'How Bond Safari Kovalam collects, uses, shares and protects personal information when you visit our website, book an activity or contact us.',
    intro: 'This Privacy Policy explains what personal information Bond Safari collects when you visit our website, make a booking or contact us, how we use it, who we share it with and how you can raise a privacy concern.',
    sections: [
      {
        id: 'who-we-are', title: 'Who we are', blocks: [
          operator,
          `Our registered address is ${legalBusiness.address}. You can find our full business and contact details at the end of this page.`,
          'This policy applies to information collected through www.bondsafarikovalam.com and through our booking channels.',
        ],
      },
      {
        id: 'information-we-collect', title: 'Information we collect', blocks: [
          'Bond Safari may collect the following information through its website and booking channels:',
          { list: [
            'Customer name',
            'Contact number',
            'Email address',
            'Number of participants',
            'Age and date of birth, wherever required',
            'Booking date and selected activity',
            'Payment and transaction details',
            'Medical and fitness information relevant to activity safety',
            'Customer feedback, reviews and communication records',
          ] },
          { sub: 'Booking and payment information' },
          'When you book, we collect the details needed to process your booking and payment: your contact details, the number of participants, the selected activity and date, and the related payment and transaction details. Online bookings and payments are handled through our online booking and reservation platform and our payment gateway and banking partners (see "Sharing your information" below).',
          { sub: 'Medical and fitness information' },
          'Some activities require information about your health and fitness so that we can confirm you can take part safely. For example, scuba diving participants must complete the required medical declaration, and all participants are asked to tell us about injuries, physical limitations, medications or other relevant medical concerns. We collect this information only where it is relevant to activity safety, and use it to assess participant eligibility and to keep you and others safe.',
        ],
      },
      {
        id: 'how-we-use-information', title: 'How we use your information', blocks: [
          'Customer information is collected and used for:',
          { list: [
            'Processing bookings and payments.',
            'Sending booking confirmations and activity schedules.',
            'Providing safety instructions and important activity information.',
            'Verifying participant eligibility.',
            'Providing customer support and handling enquiries.',
            'Maintaining booking and transaction records.',
            'Sending promotional updates, subject to applicable consent requirements.',
          ] },
        ],
      },
      {
        id: 'promotional-updates', title: 'Promotional updates', blocks: [
          'We send promotional updates only in accordance with applicable consent requirements.',
        ],
      },
      {
        id: 'sharing-your-information', title: 'Sharing your information', blocks: [
          'Your information may be shared with relevant third-party service providers, including:',
          { list: [
            'Online booking and reservation platforms.',
            'Payment gateways and banking partners.',
            'Website hosting and technical service providers.',
            'Communication and customer support platforms.',
            'Government authorities or regulatory bodies where legally required.',
          ] },
        ],
      },
      {
        id: 'storage-and-retention', title: 'Data storage and retention', blocks: [
          'Customer information is used for legitimate business, operational and legal purposes.',
          'We retain information according to applicable legal and business requirements.',
        ],
      },
      {
        id: 'protecting-your-information', title: 'Protecting your information', blocks: [
          'Access to customer information, including medical and fitness information, is restricted to authorised personnel.',
        ],
      },
      {
        id: 'children', title: 'Participants under 18', blocks: [
          'Participants below 18 years of age must obtain consent from a parent or legal guardian wherever required. Where a booking includes a minor, the parent or legal guardian provides the participant information, including any medical declarations required for the activity.',
        ],
      },
      {
        id: 'your-choices', title: 'Your choices', blocks: [
          'You may contact us to ask about the personal information we hold about you or to ask us to correct it.',
        ],
      },
      {
        id: 'privacy-complaints', title: 'Privacy complaints', blocks: [
          `If you have a concern or complaint about how we handle your personal information, please email ${legalBusiness.privacyEmail}.`,
        ],
      },
      {
        id: 'changes', title: 'Changes to this policy', blocks: [
          'We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page shows when it was last revised.',
        ],
      },
    ],
  },

  // ─────────────────────────────── Terms & Conditions ───────────────────────────────
  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    eyebrow: 'Legal · Terms',
    description: 'Booking, payment, age, medical and safety terms for scuba diving, snorkelling, kayaking, parasailing and other water sports with Bond Safari Kovalam.',
    intro: 'These Terms & Conditions apply to every booking with Bond Safari and to every participant in our activities and training programmes. Please read them, together with our [[Cancellation Policy|/cancellation-policy]] and [[Refund Policy|/refund-policy]], before you book.',
    sections: [
      {
        id: 'about-these-terms', title: 'About these terms', blocks: [
          operator,
          'Bond Safari offers water sports, adventure tourism, scuba diving, kayaking, parasailing, snorkelling, speed boating, surfing and adventure sports training in and around Kovalam, Kerala.',
          'By making a booking or taking part in an activity, you agree to these Terms & Conditions on behalf of yourself and every participant included in your booking.',
        ],
      },
      {
        id: 'booking-and-payment', title: 'Booking and payment', blocks: [
          { list: [
            'All bookings are subject to availability and confirmation by Bond Safari.',
            'Full payment or the applicable advance payment must be completed as communicated during booking.',
            'Customers must provide accurate booking and participant information.',
            'Participants must arrive at the designated activity location on time.',
            'Additional services and optional add-ons will be charged separately unless included in the package.',
            'All applicable taxes will be charged as per government regulations.',
          ] },
        ],
      },
      {
        id: 'age-and-activity-restrictions', title: 'Age and activity restrictions', blocks: [
          'Activity participation is subject to age requirements, physical suitability, equipment availability and operational safety conditions.',
          { table: { head: ['Activity', 'Age and participation requirement'], rows: [
            ['Scuba Diving', 'Minimum age for PADI Discover Scuba Diving is 10 years.'],
            ['Parasailing', 'Minimum age is 8 years, provided the participant fits the safety equipment and meets operational requirements.'],
            ['Kayaking', 'Children may participate depending on age, physical suitability and availability of appropriate equipment.'],
            ['Snorkelling, Surfing and Other Water Sports', 'Participation is subject to activity-specific age, physical and safety requirements.'],
          ] } },
        ],
      },
      {
        id: 'medical-restrictions', title: 'Medical restrictions', blocks: [
          { list: [
            'Participants must disclose any relevant medical conditions before participating.',
            'Customers must not participate if medically unfit or if their condition could compromise their safety or the safety of others.',
            'Participants must inform the team about injuries, physical limitations, medications or other relevant medical concerns.',
          ] },
          { sub: 'Scuba diving medical requirements' },
          { list: [
            'Scuba diving participants must comply with applicable diving medical requirements and complete the required medical declaration.',
            'A minimum 12-hour interval between scuba diving and flying must be observed, subject to applicable diving guidelines and dive profiles.',
          ] },
        ],
      },
      {
        id: 'safety-and-responsibilities', title: 'Safety requirements and customer responsibilities', blocks: [
          { list: [
            'Following the safety briefing and instructor instructions is mandatory.',
            'Wearing the required safety equipment, including life jackets wherever applicable, is compulsory.',
            'Participants must cooperate with instructors, boat crew and operational staff.',
            'Consumption of alcohol or intoxicating substances before or during activities is strictly prohibited.',
            'Participants must disclose relevant medical conditions and physical limitations.',
            'Participants must respect the marine environment and avoid littering or disturbing aquatic life.',
          ] },
        ],
      },
      {
        id: 'right-to-deny-participation', title: 'Right to deny participation', blocks: [
          'Bond Safari reserves the right to deny participation if a guest does not meet safety requirements or fails to follow instructions.',
        ],
      },
      {
        id: 'consent-and-declarations', title: 'Parental consent, medical declarations and liability acknowledgements', blocks: [
          { list: [
            'Participants below 18 years of age must obtain consent from a parent or legal guardian wherever required.',
            'Activity-specific medical declarations, liability acknowledgements and consent forms may be required before participation.',
            'Parents or legal guardians may be required to accompany minors depending on the activity and safety requirements.',
          ] },
        ],
      },
      {
        id: 'weather-and-emergency', title: 'Weather and emergency conditions', blocks: [
          'Bond Safari conducts water-based activities that depend on weather, wind speed, sea conditions, water levels and other environmental factors.',
          { sub: 'Weather-related cancellations' },
          { list: [
            'All activities are subject to suitable weather and operational conditions.',
            'The final decision to conduct, postpone or cancel an activity rests with Bond Safari\'s operations team, based on safety assessments.',
            'If sea conditions, wind speed or weather conditions are unsuitable, the activity may be postponed or cancelled.',
            'Customers will be informed about any cancellation or postponement.',
            'Depending on the circumstances, customers may be offered an alternative date or an applicable refund (see our [[Refund Policy|/refund-policy]]).',
            'No activity will be conducted if the operations team considers the conditions unsafe.',
          ] },
          { sub: 'Emergency procedures' },
          { list: [
            'Bond Safari\'s team will follow the relevant activity-specific emergency response procedures.',
            'Appropriate assistance will be arranged in case of an emergency.',
            'Participants must cooperate with the instructions provided by instructors, crew members and emergency response personnel.',
          ] },
        ],
      },
      {
        id: 'insurance', title: 'Insurance', blocks: [
          'Insurance coverage and its applicability to individual activities are subject to confirmation by Bond Safari. Please contact us before booking if you have any questions about insurance.',
        ],
      },
      {
        id: 'cancellations-and-refunds', title: 'Cancellations, rescheduling and refunds', blocks: [
          'Cancellations, no-shows, late arrivals and rescheduling are covered by our [[Cancellation Policy|/cancellation-policy]]. Refund eligibility and processing are covered by our [[Refund Policy|/refund-policy]]. Both form part of these Terms & Conditions.',
        ],
      },
    ],
  },

  // ─────────────────────────────── Cancellation Policy ───────────────────────────────
  {
    slug: 'cancellation-policy',
    title: 'Cancellation Policy',
    eyebrow: 'Legal · Cancellations',
    description: 'Cancellation charges, no-shows, late arrivals, rescheduling and weather cancellations for Bond Safari Kovalam activity bookings and training programmes.',
    intro: 'This policy explains the charges that apply when an activity booking is cancelled, and what happens with no-shows, late arrivals, rescheduling and cancellations made by Bond Safari. How the remaining balance is refunded is explained in our [[Refund Policy|/refund-policy]].',
    sections: [
      {
        id: 'cancellation-charges', title: 'Cancellation charges', blocks: [
          'Bond Safari follows the cancellation structure below for activity bookings. Cancellation charges are calculated based on the number of days remaining before the scheduled activity date.',
          { table: { head: ['Cancellation period', 'Cancellation charge'], rows: [
            ['More than 60 days before the activity', 'No cancellation fee (0%)'],
            ['30–60 days before the activity', '50% of the activity fee'],
            ['10–29 days before the activity', '75% of the activity fee'],
            ['1–9 days before the activity', '90% of the activity fee'],
            ['Same-day cancellation', '100% of the activity fee'],
          ] } },
          'Applicable cancellation charges will be deducted from the booking amount, and any eligible balance will be handled according to the [[Refund Policy|/refund-policy]].',
        ],
      },
      {
        id: 'how-to-cancel', title: 'How to cancel', blocks: [
          'All cancellation requests must be communicated through Bond Safari\'s official contact channels:',
          { list: [`Email: ${legalBusiness.email}`, `Phone: ${legalBusiness.phone}`] },
        ],
      },
      {
        id: 'same-day-and-no-shows', title: 'Same-day cancellations and no-shows', blocks: [
          'Same-day cancellations and no-shows will attract a 100% cancellation charge.',
        ],
      },
      {
        id: 'late-arrivals', title: 'Late arrivals', blocks: [
          'Late arrivals may result in reduced activity time or cancellation if the operational schedule cannot accommodate the delay.',
        ],
      },
      {
        id: 'rescheduling', title: 'Rescheduling', blocks: [
          'Rescheduling requests are subject to availability and management approval.',
          'Any applicable rescheduling charges will be communicated to the customer before confirmation.',
        ],
      },
      {
        id: 'cancellation-by-bond-safari', title: 'Cancellation or postponement by Bond Safari', blocks: [
          'Bond Safari reserves the right to cancel or postpone an activity due to unsafe weather, sea conditions, equipment issues, government restrictions or other operational and safety-related circumstances.',
          'The final decision to conduct, postpone or cancel an activity rests with Bond Safari\'s operations team, based on safety assessments, and no activity will be conducted if the team considers the conditions unsafe. Customers will be informed and may be offered an alternative date or an applicable refund, as set out in our [[Refund Policy|/refund-policy]]. Full weather and emergency conditions are in our [[Terms & Conditions|/terms-and-conditions]].',
        ],
      },
      {
        id: 'training-programmes', title: 'Special conditions for training programmes', blocks: [
          'For professional training programmes and courses, including diving and adventure sports training, once training has commenced, including the initial briefing and in-water training, the payment is non-refundable.',
        ],
      },
    ],
  },

  // ───────────────────────────────── Refund Policy ─────────────────────────────────
  {
    slug: 'refund-policy',
    title: 'Refund Policy',
    eyebrow: 'Legal · Refunds',
    description: 'Refund eligibility, non-refundable bookings, cancellations by Bond Safari and refund processing times for Bond Safari Kovalam bookings.',
    intro: 'Refund eligibility depends on the reason for cancellation and the applicable cancellation conditions. This policy should be read together with our [[Cancellation Policy|/cancellation-policy]], which sets out the cancellation charges.',
    sections: [
      {
        id: 'charges-and-balances', title: 'Cancellation charges and refundable balances', blocks: [
          'A cancellation charge is the part of the activity fee that Bond Safari keeps when a booking is cancelled. It depends on how many days before the activity you cancel (see the [[Cancellation Policy|/cancellation-policy]]).',
          'The refundable balance is what remains of the booking amount after the cancellation charge is deducted. Refunds are calculated after deducting the applicable cancellation charges.',
          { note: 'Illustration only, for a fully paid booking with an activity fee of ₹10,000. Actual amounts depend on your booking.' },
          { table: { head: ['When you cancel', 'Cancellation charge', 'Refundable balance'], rows: [
            ['More than 60 days before', '0% (₹0)', '₹10,000'],
            ['30–60 days before', '50% (₹5,000)', '₹5,000'],
            ['10–29 days before', '75% (₹7,500)', '₹2,500'],
            ['1–9 days before', '90% (₹9,000)', '₹1,000'],
            ['Same day, or no-show', '100% (₹10,000)', '₹0 (non-refundable)'],
          ] } },
          'Any applicable non-refundable payment gateway or third-party charges will be disclosed before booking, where relevant.',
        ],
      },
      {
        id: 'customer-cancellations', title: 'Customer-initiated cancellations', blocks: [
          { list: [
            'Refunds will be calculated after deducting the applicable cancellation charges.',
            'Cancellations made more than 60 days before the activity will not attract a cancellation fee.',
            'Cancellations within the specified periods will be subject to the corresponding deductions mentioned in the [[Cancellation Policy|/cancellation-policy]].',
            'Same-day cancellations and no-shows are non-refundable.',
            'Training programmes and courses become non-refundable once training has commenced, including the initial briefing and in-water training.',
          ] },
        ],
      },
      {
        id: 'non-refundable', title: 'Non-refundable bookings', blocks: [
          'The following are not eligible for a refund:',
          { list: [
            'Same-day cancellations.',
            'No-shows.',
            'Training programmes and courses once training has commenced, including the initial briefing and in-water training.',
          ] },
        ],
      },
      {
        id: 'cancellation-by-bond-safari', title: 'Cancellation by Bond Safari', blocks: [
          'If Bond Safari cancels an activity due to operational issues, equipment problems, unsafe conditions or other reasons within its control, customers will be informed and offered appropriate alternatives.',
          'Depending on the circumstances, customers may be offered:',
          { list: ['Rescheduling to an alternative available date; or', 'A refund of the applicable booking amount.'] },
          { sub: 'Weather-related cancellations' },
          'If an activity is postponed or cancelled because sea conditions, wind speed or weather conditions are unsuitable, customers will be informed and, depending on the circumstances, may be offered an alternative date or an applicable refund. The final decision rests with Bond Safari\'s operations team, based on safety assessments.',
        ],
      },
      {
        id: 'refund-processing', title: 'Refund processing', blocks: [
          { list: [
            'Refunds will be processed after the cancellation request has been reviewed and approved.',
            'Approved refunds will preferably be processed through the original payment method.',
            'Any applicable non-refundable payment gateway or third-party charges will be disclosed before booking, where relevant.',
            'The refund processing timeline is 5 to 7 business days.',
          ] },
        ],
      },
      {
        id: 'requesting-a-refund', title: 'Requesting a refund', blocks: [
          `To cancel a booking and request a refund, contact us through our official contact channels: email ${legalBusiness.email} or call ${legalBusiness.phone}. Please include your booking details.`,
        ],
      },
    ],
  },
]

export const legalDoc = (slug: string) => legalDocs.find(d => d.slug === slug)!
