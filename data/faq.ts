// The /faq page's questions and answers, exactly as supplied by Bond Safari. Edit the wording here; the page,
// its search and its structured data all read from this file.

// An answer is a list of blocks: a paragraph, a bold sub-heading, a bullet list or a table
export type FaqBlock = string | { sub: string } | { list: string[] } | { table: { head: string[]; rows: string[][] } }
export type FaqItem = { q: string; a: FaqBlock[] }
// `image` is the FAQ page's hero photo while this category is selected
export type FaqGroup = { id: string; title: string; subtitle?: string; image: string; imagePosition?: string; faqs: FaqItem[]; notes: { title: string; items: string[] } }

export const faqGroups: FaqGroup[] = [
  {
    id: 'parasailing', title: 'Parasailing', image: '/images/parasailing.webp',
    faqs: [
      {
        q: 'What is parasailing, and how does the experience work?', a: [
          'Parasailing is an exciting adventure activity where you are securely attached to a specially designed parachute and lifted into the air by a motorboat.',
          'Your experience begins with a safety briefing, followed by speedboat transportation to the designated parasailing boat. You will then be transferred to the parasailing boat, where our team will assist you with the harness and safety equipment before your flight.',
          'Enjoy breathtaking aerial views of the Arabian Sea and Kovalam coastline as you fly above the water!',
          { list: ['Overall experience duration: Approximately 30 minutes.', 'Actual flying time: Approximately 3–5 minutes.'] },
        ],
      },
      {
        q: 'Do I need any prior experience or swimming skills to try parasailing?', a: [
          'No prior experience or swimming skills are required. Parasailing is a guided adventure activity. Our trained team will explain the safety procedures and assist you throughout the experience.',
        ],
      },
      {
        q: 'Is parasailing safe?', a: [
          'Parasailing can be a safe and enjoyable adventure when conducted with proper equipment, trained professionals and suitable weather conditions.',
          'At Bond Safari, our team provides a safety briefing and checks the harness and equipment before every flight. All activities are conducted subject to operational safety procedures and weather conditions.',
        ],
      },
      {
        q: 'What is the minimum age requirement for parasailing?', a: [
          'The minimum age requirement for parasailing at Bond Safari is 8 years.',
          'However, the child must fit properly into the available safety harness and equipment. Final participation is subject to equipment suitability and approval by our operations team.',
        ],
      },
      {
        q: 'How high will I fly during parasailing?', a: [
          'The flight height depends on weather, wind conditions, sea conditions and operational assessment.',
          'You will be lifted above the sea, offering beautiful panoramic views of the Kovalam coastline and surrounding Arabian Sea.',
        ],
      },
      {
        q: 'How long does the parasailing experience last?', a: [
          'The overall parasailing experience takes approximately 30 minutes, including the safety briefing, speedboat transportation, transfer to the parasailing boat, equipment preparation and flight.',
          'The actual flying time is approximately 3–5 minutes, depending on operational and weather conditions.',
        ],
      },
      {
        q: 'Can two people enjoy parasailing together?', a: [
          'Yes! Two people can enjoy parasailing together, provided their combined weight is within the permitted limits of the equipment and wind conditions are suitable.',
          'Tandem flights are subject to the instructor\'s safety assessment.',
          'Please note that charges apply per person, even when two participants fly together.',
        ],
      },
      {
        q: 'What should I wear for parasailing?', a: [
          'We recommend wearing comfortable clothing or swimwear suitable for water activities.',
          'Please avoid loose accessories, jewellery and footwear that may come off during the activity.',
          'Secure your personal belongings before boarding the boat.',
        ],
      },
      {
        q: 'What happens if the weather or wind conditions are unsuitable for parasailing?', a: [
          'Parasailing is highly dependent on weather, wind speed, sea conditions and visibility.',
          'If conditions are unsuitable, Bond Safari may postpone or reschedule the activity to ensure guest safety.',
          'Our operations team will communicate the available options.',
        ],
      },
      {
        q: 'Can I go parasailing if I have a medical condition?', a: [
          'Certain medical conditions, injuries or physical limitations may make parasailing unsuitable.',
          'Participants should inform our team about relevant medical concerns before booking.',
          'Our operations team may advise against participation where safety could be affected.',
        ],
      },
    ],
    notes: {
      title: 'Important Notes for Guests – Parasailing', items: [
        'Please arrive at the activity location at least 15 minutes before your scheduled time.',
        'Follow all instructions provided by the boat crew and activity team.',
        'Wear the provided safety harness and equipment correctly.',
        'Secure your mobile phones, cameras and personal belongings before the activity.',
        'Avoid consuming alcohol before participating.',
        'Inform our team about any relevant medical conditions.',
        'Tandem flights are subject to combined weight limits and wind conditions.',
        'All parasailing activities are subject to suitable weather, wind and sea conditions.',
      ],
    },
  },
  {
    id: 'snorkelling', title: 'Snorkelling', subtitle: 'Shore & Boat Snorkelling', image: '/images/snorkeling-beach.webp',
    faqs: [
      {
        q: 'What is snorkelling, and do I need prior experience?', a: [
          'Snorkelling is an exciting water activity that allows you to explore the underwater world while floating on the water\'s surface and observing marine life through a mask and snorkel.',
          'No prior experience is required. Our professional team will provide basic instructions and guide you throughout the experience.',
        ],
      },
      {
        q: 'Do I need to know swimming to participate in snorkelling?', a: [
          'No, swimming is not mandatory to experience snorkelling with Bond Safari Kovalam.',
          'Our snorkelling activity is a guided experience, and our team will assist you throughout the tour.',
          'Appropriate safety equipment, including life jackets, will be provided.',
          'You can relax, float on the surface and enjoy observing the underwater world under the guidance of our team.',
        ],
      },
      {
        q: 'What is the difference between shore snorkelling and boat snorkelling?', a: [
          'Bond Safari offers two ways to experience snorkelling:',
          { sub: 'Shore Snorkelling:' },
          'The regular snorkelling experience, where participants access the sea from the shore and explore the underwater surroundings with guidance from our team.',
          { sub: 'Boat Snorkelling:' },
          'A boat-based snorkelling experience available exclusively for groups of 6 or more participants.',
          'The boat takes the group to a designated snorkelling location for an exciting ocean exploration experience.',
          'Both experiences are guided and subject to suitable sea conditions.',
        ],
      },
      {
        q: 'Can I book boat snorkelling individually?', a: [
          'Boat snorkelling is available for groups of 6 or more participants.',
          'If you are an individual traveller or a smaller group, you can book our regular shore snorkelling experience.',
        ],
      },
      {
        q: 'What marine life can I expect to see while snorkelling in Kovalam?', a: [
          'Kovalam\'s coastal waters offer opportunities to observe colourful tropical fish, schools of fish and other fascinating marine creatures.',
          'Marine life sightings depend on the season, sea conditions and underwater visibility.',
          'Every snorkelling experience is unique!',
        ],
      },
      {
        q: 'What equipment will be provided for snorkelling?', a: [
          'Bond Safari provides the essential snorkelling equipment, including:',
          { list: ['Snorkelling mask', 'Snorkel tube', 'Fins, where required', 'Life jacket'] },
          'Our team will help you understand how to use the equipment before entering the water.',
        ],
      },
      {
        q: 'How long does the snorkelling experience last?', a: [
          'The total duration depends on the selected experience, sea conditions and underwater visibility.',
          'Our team will brief you about the expected duration and activity schedule before the experience begins.',
        ],
      },
      {
        q: 'Is snorkelling safe for beginners and non-swimmers?', a: [
          'Yes! Snorkelling is a beginner-friendly activity when conducted under proper supervision and suitable sea conditions.',
          'You will receive a safety briefing and guidance from our team.',
          'Life jackets and other necessary safety equipment will be provided.',
          'Participants must follow all safety instructions throughout the experience.',
        ],
      },
      {
        q: 'What should I carry for my snorkelling experience?', a: [
          'We recommend bringing:',
          { list: ['Comfortable swimwear', 'A towel', 'An extra set of clothes', 'Sunscreen (Eco friendly)', 'Personal toiletries'] },
          'Please arrive at the activity location at least 15 minutes before your scheduled time.',
        ],
      },
      {
        q: 'What happens if the sea conditions are not suitable for snorkelling?', a: [
          'Snorkelling depends on weather, waves, currents and underwater visibility.',
          'If sea conditions are unsuitable, Bond Safari may postpone or reschedule the activity to ensure guest safety.',
          'Our operations team will communicate the available options.',
        ],
      },
    ],
    notes: {
      title: 'Important Notes for Guests – Snorkelling', items: [
        'Please follow all safety instructions provided by the activity instructors.',
        'Wear the provided safety equipment throughout the activity as instructed.',
        'Avoid touching or disturbing marine life.',
        'Do not litter in the ocean.',
        'Inform our team about any relevant medical conditions before participating.',
        'All activities are subject to suitable weather and sea conditions.',
        'Boat snorkelling is available exclusively for groups of 6 or more participants.',
      ],
    },
  },
  {
    id: 'scuba-diving', title: 'Scuba Diving', image: '/images/scuba.webp',
    faqs: [
      {
        q: 'Do I need prior scuba diving experience to go scuba diving?', a: [
          'No! You don\'t need any previous scuba diving experience.',
          'Our sea scuba diving experiences are designed for beginners and first-time divers.',
          'Our professional instructors will provide a safety briefing and basic training before taking you underwater.',
        ],
      },
      {
        q: 'What is the difference between Introduction to Scuba Diving and PADI Discover Scuba Diving (DSD)?', a: [
          'Both experiences are designed for beginners, but they differ in duration, training structure and depth.',
          { sub: 'Comparison Table:' },
          {
            table: {
              head: ['Feature', 'Introduction to Scuba Diving', 'PADI Discover Scuba Diving'],
              rows: [
                ['Duration', '2.5 hours', '4 hours'],
                ['Underwater time', '20–30 minutes', '30–40 minutes'],
                ['Maximum depth', '6–7 metres', 'Up to 12 metres'],
                ['Training', 'Basic introduction', 'Structured PADI programme'],
                ['Experience', 'Beginner-friendly', 'PADI-guided introductory experience'],
              ],
            },
          },
          'Introduction to Scuba Diving is ideal for those who want a quick introduction to the underwater world, while PADI DSD offers a more structured experience following PADI standards and the participants get a PADI online registration.',
        ],
      },
      {
        q: 'Do I need to know swimming to experience scuba diving?', a: [
          'No, swimming is not mandatory to experience scuba diving with Bond Safari Kovalam.',
          'Our introductory scuba diving experiences are guided by professional instructors who accompany you throughout your underwater journey.',
          'You will experience the unique feeling of weightlessness, almost like floating in zero gravity, as you explore the underwater world.',
          'Our instructors will guide you through every step to help you feel comfortable and confident underwater.',
        ],
      },
      {
        q: 'Is sea scuba diving safe for beginners?', a: [
          'Yes! Scuba diving can be a safe and enjoyable experience when conducted under professional supervision and established safety procedures.',
          'At Bond Safari, you will receive a safety briefing, equipment familiarisation and basic training before entering the sea.',
          'Our instructors supervise you throughout the dive.',
        ],
      },
      {
        q: 'What is the minimum age requirement for scuba diving?', a: [
          'The minimum age for PADI Discover Scuba Diving is 10 years.',
          'Participants below 18 years require parental or guardian consent.',
        ],
      },
      {
        q: 'How does the sea scuba diving experience take place?', a: [
          'Your adventure begins at Bond Safari\'s dive centre with registration, a safety briefing and equipment preparation.',
          'You will then head to the designated diving location.',
          'Once you reach the dive site, your instructor will guide you through the underwater experience, allowing you to explore the marine world.',
        ],
      },
      {
        q: 'What marine life can I expect to see while scuba diving in Kovalam?', a: [
          'Kovalam offers opportunities to explore fascinating underwater marine life, including colourful reef fish, schools of fish and other marine creatures.',
          'Every dive is unique, and sightings depend on the season, sea conditions and underwater visibility.',
        ],
      },
      {
        q: 'What scuba diving equipment will be provided?', a: [
          'All essential scuba diving equipment will be provided by Bond Safari, including:',
          { list: ['Diving mask', 'Fins', 'Air cylinder and regulator', 'Buoyancy Control Device (BCD)', 'Wetsuit, where required'] },
          'You only need to bring your swimwear, towel and an extra set of clothes.',
        ],
      },
      {
        q: 'What happens if the sea conditions are not suitable for diving?', a: [
          'Sea scuba diving depends on weather, waves, currents and underwater visibility.',
          'If the conditions are unsuitable, our team may postpone or reschedule the activity to ensure everyone\'s safety.',
          'Our operations team will communicate the available options.',
        ],
      },
      {
        q: 'Can I go scuba diving if I have a medical condition?', a: [
          'Certain medical conditions may affect your ability to scuba dive safely.',
          'All participants must complete the required medical questionnaire before diving.',
          'If any medical concerns are identified, medical clearance from a qualified physician may be required before participation.',
        ],
      },
    ],
    notes: {
      title: 'Important Notes for Guests – Scuba Diving', items: [
        'Please arrive at the dive centre at least 10 minutes before your scheduled activity.',
        'Avoid consuming alcohol before diving.',
        'Inform the instructor about any medical conditions before the activity.',
        'Allow at least 12 hours after a single no-decompression dive before flying; longer intervals may be necessary after multiple dives.',
        'All dives are subject to suitable sea and weather conditions.',
      ],
    },
  },
  {
    id: 'kayaking', title: 'Kayaking', subtitle: 'Backwater & Freshwater Kayaking', image: '/images/kayaking-quarry.webp',
    faqs: [
      {
        q: 'What is kayaking, and do I need prior experience?', a: [
          'Kayaking is an exciting water adventure where you paddle through the water using a double-bladed paddle while seated in a kayak. It is a wonderful way to explore scenic waterways, enjoy nature and experience the beauty of Kerala\'s water landscapes.',
          'No prior kayaking experience is required. Our team will provide a basic safety briefing and instructions on paddling before the activity begins.',
        ],
      },
      {
        q: 'Where will the backwater and freshwater kayaking experiences take place?', a: [
          { sub: 'Bond Safari offers two different kayaking experiences based on the guest\'s preference and location availability:' },
          { list: ['Backwater Kayaking: Conducted in the beautiful Kovalam backwaters, offering a scenic experience through peaceful waterways surrounded by natural landscapes.', 'Freshwater Kayaking: Conducted in a freshwater quarry, providing a calm and unique kayaking experience away from the sea.'] },
          'The location will be finalised based on availability and the guest\'s choice at the time of booking.',
        ],
      },
      {
        q: 'What is the difference between backwater kayaking and freshwater kayaking?', a: [
          'Both experiences offer a unique opportunity to explore nature from the water.',
          { list: ['Backwater Kayaking: Enjoy paddling through the scenic Kovalam backwaters, surrounded by beautiful landscapes and peaceful waterways.', 'Freshwater Kayaking: Experience kayaking in a freshwater quarry, enjoying a different natural setting with calm freshwater surroundings.'] },
          'Guests can choose their preferred experience depending on location availability.',
        ],
      },
      {
        q: 'Is kayaking suitable for beginners?', a: [
          'Absolutely! Our kayaking experiences are suitable for beginners as well as experienced paddlers. Before starting, our team will explain the basic paddling techniques, kayak handling and safety instructions. Our instructors will guide you throughout the activity to help you enjoy a comfortable experience.',
        ],
      },
      {
        q: 'What types of kayaks are available?', a: [
          { sub: 'Bond Safari offers single and double kayaks, subject to availability at the selected location.' },
          { list: ['Single Kayak: Suitable for one participant.', 'Double Kayak: Suitable for two participants who wish to enjoy the experience together.'] },
          'Our team will help you select the appropriate kayak based on availability and your preference.',
        ],
      },
      {
        q: 'How long does the kayaking experience last?', a: [
          'The overall kayaking experience lasts approximately 1 to 1.5 hours, depending on the selected location, route and water conditions. This includes the necessary instructions and time to enjoy the kayaking experience.',
        ],
      },
      {
        q: 'What safety equipment will be provided?', a: [
          { sub: 'Bond Safari provides the necessary kayaking equipment and safety gear to ensure a safe experience, including:' },
          { list: ['Kayak (single or double, depending on availability)', 'Double-bladed paddle', 'Life jacket', 'Basic safety instructions and guidance from our team'] },
          'Wearing a life jacket throughout the activity is mandatory.',
        ],
      },
      {
        q: 'What should I wear or carry for kayaking?', a: [
          'We recommend wearing comfortable clothing suitable for water activities, as you may get wet during the experience.',
          'Please consider bringing:',
          { list: ['Comfortable swimwear or quick-dry clothing', 'A towel', 'An extra set of clothes', 'Water-resistant footwear, if available', 'Eco-friendly sunscreen to protect your skin while minimising environmental impact', 'A water bottle'] },
          'Avoid carrying valuables, jewellery or electronic devices unless they are properly protected against water.',
        ],
      },
      {
        q: 'Can children participate in kayaking?', a: [
          'Yes, children can participate depending on their age, physical suitability and the availability of appropriate kayaks. All children must wear life jackets and follow the safety instructions provided by our team.',
          'Double kayaking with an accompanying adult may be recommended where suitable. Please contact our team in advance to confirm suitability.',
        ],
      },
      {
        q: 'Do I need to know swimming to participate in kayaking?', a: [
          'Swimming is not mandatory to participate in kayaking with Bond Safari. However, all participants must wear life jackets throughout the activity and follow the safety instructions provided by our team.',
        ],
      },
      {
        q: 'What happens if the weather conditions are unsuitable for kayaking?', a: [
          'Kayaking activities depend on weather, wind, water levels and other environmental conditions. If conditions are unsuitable for the activity, Bond Safari may postpone or reschedule the experience to ensure guest safety. Our operations team will inform guests about the available alternatives.',
        ],
      },
    ],
    notes: {
      title: 'Important Notes for Guests – Kayaking', items: [
        'Please arrive at the activity location at least 15 minutes before your scheduled time.',
        'The kayaking experience lasts approximately 1 to 1.5 hours.',
        'Backwater kayaking takes place in Kovalam backwaters.',
        'Freshwater kayaking takes place in a quarry, subject to availability.',
        'The location is finalised based on availability and guest preference.',
        'Wearing a life jacket is mandatory throughout the activity.',
        'Follow all safety instructions provided by the kayaking team.',
        'Avoid standing up or making sudden movements inside the kayak.',
        'Please use eco-friendly sunscreen to minimise environmental impact.',
        'Do not litter or disturb the natural surroundings.',
        'Inform our team about any relevant medical conditions before participating.',
        'All activities are subject to suitable weather and water conditions.',
      ],
    },
  },
]

// An answer as plain text, for search and for the FAQPage structured data
export const answerText = (a: FaqBlock[]) => a.map(b =>
  typeof b === 'string' ? b
    : 'sub' in b ? b.sub
    : 'list' in b ? b.list.map(i => `• ${i}`).join('\n')
    : b.table.rows.map(r => `${r[0]}: ${b.table.head.slice(1).map((h, i) => `${h} ${r[i + 1]}`).join('; ')}`).join('\n'),
).join('\n')

export const allFaqs = faqGroups.flatMap(g => g.faqs.map(f => ({ q: f.q, a: answerText(f.a) })))
