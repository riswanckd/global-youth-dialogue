export interface TopicCategory {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
  subTopics: string[];
  subTopicsAr: string[];
}

export const CATEGORIES: TopicCategory[] = [
  {
    id: 'global-affairs',
    name: 'Geopolitics & International Relations',
    nameAr: 'الجيوسياسية والعلاقات الدولية',
    icon: 'globe',
    description: 'International diplomacy, multilateral treaties, territorial sovereignty, global governance, and regional security architectures.',
    descriptionAr: 'الدبلوماسية الدولية، المعاهدات المتعددة، السيادة الإقليمية، الحوكمة العالمية، وبنى الأمن الإقليمي والدولي.',
    subTopics: [
      'Multilateral Diplomacy & UN Reform',
      'Territorial Sovereignty & Statehood',
      'Economic Sanctions & Financial Sovereignty',
      'Climate Migration & International Border Law',
      'Rise of Multipolar Global Orders'
    ],
    subTopicsAr: [
      'الدبلوماسية المتعددة وإصلاح الأمم المتحدة',
      'السيادة الإقليمية ومسائل الاعتراف بالدول',
      'العقوبات الاقتصادية والسيادة المالية',
      'الهجرة المناخية وقوانين الحدود الدولية',
      'صعود النظام الدولي متعدد الأقطاب'
    ]
  },
  {
    id: 'tech-ai',
    name: 'Technology & AI Ethics',
    nameAr: 'التكنولوجيا والذكاء الاصطناعي',
    icon: 'cpu',
    description: 'Generative algorithms, autonomous systems, digital privacy, algorithmic bias, surveillance capitalism, and tech governance.',
    descriptionAr: 'النماذج التوليدية، النظم الذاتية، الخصوصية الرقمية، انحياز الخوارزميات، رأسمالية المراقبة، وحوكمة التكنولوجيا.',
    subTopics: [
      'Generative AI in Classrooms & Academia',
      'Autonomous Weapons & Warfare Ethics',
      'Algorithmic Bias & Platform Regulation',
      'Surveillance Capitalism & Personal Privacy',
      'Deepfakes & Disinformation Countermeasures'
    ],
    subTopicsAr: [
      'الذكاء الاصطناعي في الفصول المدرسية والجامعات',
      'الأسلحة الذاتية وأخلاقيات خوض الحروب',
      'الانحياز الخوارزمي وتنظيم المنصات الكبرى',
      'رأسمالية المراقبة وحماية البيانات الشخصية',
      'التزييف العميق وحلول مكافحة التضليل'
    ]
  },
  {
    id: 'education',
    name: 'Education & Future of Learning',
    nameAr: 'التعليم ومستقبل التعلم',
    icon: 'book-open',
    description: 'Pedagogical reform, competency-based curricula, higher education access, the digital learning divide, and future workforce skills.',
    descriptionAr: 'تطوير المناهج، النظم القائمة على الكفاءة، فرص التعليم العالي، معالجة الفجوة الرقمية، وبناء مهارات سوق العمل.',
    subTopics: [
      'Competency-Based vs Standardized Testing',
      'The Digital Learning Divide in the Global South',
      'Tuition-Free Public Higher Education',
      'Critical Inquiry & Media Literacy in Schools',
      'Vocational Excellence vs Academic Pathways'
    ],
    subTopicsAr: [
      'التقييم القائم على المهارات مقابل الاختبارات الموحدة',
      'الفجوة الرقمية في التعليم بالدول النامية',
      'مجانية التعليم العالي والجامعي',
      'التفكير النقدي والتربية الإعلامية في المدارس',
      'التعليم المهني التخصصي مقابل المسارات الأكاديمية'
    ]
  },
  {
    id: 'environment',
    name: 'Climate, Environment & Energy',
    nameAr: 'المناخ والبيئة والاستدامة',
    icon: 'leaf',
    description: 'Loss and damage climate finance, energy transitions, global water security, biodiversity loss, and ecological accountability.',
    descriptionAr: 'تمويل الخسائر والأضرار المناخية، التحول الطاقي، الأمن المائي العالمي، صون التنوع الحيوي، والمسؤولية البيئية.',
    subTopics: [
      'Loss and Damage Climate Financing (COP Protocols)',
      'Nuclear Energy vs Renewable Integration',
      'Transboundary Water Rights & Dam Politics',
      'Carbon Offsets vs Absolute Emission Caps',
      'Indigenous Land Stewardship & Conservation'
    ],
    subTopicsAr: [
      'تمويل الخسائر والأضرار المناخية (بروتوكولات كوب)',
      'الطاقة النووية مقابل إدماج الطاقات المتجددة',
      'حقوق المياه العابرة للحدود وسياسات السدود',
      'أرصدة الكربون مقابل السقوف المطلقة للانبعاثات',
      'الإشراف البيئي للشعوب الأصلية وحماية الطبيعة'
    ]
  },
  {
    id: 'economy',
    name: 'Economy, Trade & Labor',
    nameAr: 'الاقتصاد والتجارة والعمل',
    icon: 'trending-up',
    description: 'De-dollarization, wealth inequality, universal basic income, supply chain resilience, central bank digital currencies, and labor automation.',
    descriptionAr: 'التجارة العالمية، التفاوت في الثروات، الدخل الأساسي الشامل، مرونة سلاسل الإمداد، والعملات الرقمية للبنوك المركزية.',
    subTopics: [
      'Universal Basic Income in the Age of Automation',
      'De-Dollarization & Bilateral Trade Agreements',
      'Global Minimum Corporate Tax Enforcement',
      'Gig Economy Worker Rights & Classification',
      'Supply Chain Nationalism vs Free Trade'
    ],
    subTopicsAr: [
      'الدخل الأساسي الشامل في عصر الأتمتة',
      'إنهاء الهيمنة الدولارية والاتفاقات الثنائية',
      'تطبيق الضريبة العالمية الدنيا على الشركات',
      'حقوق عمال الاقتصاد التشاركي وتصنيفهم القانوني',
      'قومية سلاسل الإمداد مقابل التجارة الحرة'
    ]
  },
  {
    id: 'governance',
    name: 'Governance, Law & Human Rights',
    nameAr: 'الحوكمة والقانون وحقوق الإنسان',
    icon: 'shield',
    description: 'Democratic resilience, digital civil liberties, judicial independence, freedom of speech, youth political franchise, and anti-corruption.',
    descriptionAr: 'الصمود الديمقراطي، الحريات الرقمية، استقلالية القضاء، حرية التعبير، المشاركة السياسية للشباب، ومكافحة الفساد.',
    subTopics: [
      'Lowering the Voting Age to 16 Globally',
      'Judicial Independence in Polarized Democracies',
      'Digital Civil Liberties vs Counter-Terrorism Laws',
      'Prison Reform vs Retributive Justice',
      'Whistleblower Protections in National Security'
    ],
    subTopicsAr: [
      'خفض سن الاقتراع إلى 16 عاماً دولياً',
      'استقلالية القضاء في الديمقراطيات المستقطبة',
      'الحريات المدنية الرقمية وقوانين مكافحة الإرهاب',
      'إصلاح السجون مقابل العدالة العقابية',
      'حماية كاشفي الفساد في قضايا الأمن القومي'
    ]
  },
  {
    id: 'culture',
    name: 'Culture, Identity & Global Media',
    nameAr: 'الثقافة والهوية والإعلام العالمي',
    icon: 'smile',
    description: 'Cultural repatriation, linguistic preservation, media consolidation, post-colonial literature, and cosmopolitan youth identities.',
    descriptionAr: 'استرداد الآثار الثقافية، صون اللغات المهددة، الاحتكار الإعلامي، أدب ما بعد الاستعمار، والهوية الشبابية العالمية.',
    subTopics: [
      'Repatriation of Colonial Museum Artifacts',
      'Preserving Indigenous & Endangered Languages',
      'Monopolization of Global Entertainment Platforms',
      'Cultural Appropriation vs Hybrid Globalization',
      'Diaspora Identity & Transnational Belonging'
    ],
    subTopicsAr: [
      'استرداد الآثار والمقتنيات الاستعمارية من المتاحف',
      'حماية اللغات الأصلية المهددة بالاندثار',
      'احتكار منصات الترفيه والبث العالمية',
      'الاستحواذ الثقافي مقابل العولمة التفاعلية',
      'هوية الشتات والانتماء العابر للأوطان'
    ]
  },
  {
    id: 'health',
    name: 'Public Health, Bioethics & Science',
    nameAr: 'الصحة العامة والأخلاقيات الحيوية والعلوم',
    icon: 'heart-pulse',
    description: 'Pandemic preparedness, universal healthcare access, human genetic editing, mental health infrastructure, and pharmaceutical patent monopolies.',
    descriptionAr: 'الجاهزية للأوبئة، الرعاية الصحية الشاملة، التعديل الجيني البشري، بنية الصحة النفسية، واحتكارات براءات الاختراع الدوائية.',
    subTopics: [
      'TRIPS Waiver & Global Vaccine Equity',
      'CRISPR Gene Editing in Human Embryos',
      'Universal Mental Healthcare for Adolescents',
      'Private Health Insurance vs Single-Payer Models',
      'Antibiotic Resistance & Global Biosecurity'
    ],
    subTopicsAr: [
      'التنازل عن حقوق الملكية الفكرية وعدالة توزيع اللقاحات',
      'تقنيات التعديل الجيني كريسبر على الأجنة البشرية',
      'الرعاية النفسية الشاملة للشباب والمراهقين',
      'التأمين الصحي الخاص مقابل نظم التغطية الشاملة',
      'مقاومة المضادات الحيوية والأمن الحيوي العالمي'
    ]
  },
  {
    id: 'space',
    name: 'Space Governance & Astro-Politics',
    nameAr: 'حوكمة الفضاء الخارجي والسياسات الفضائية',
    icon: 'rocket',
    description: 'Orbital debris accountability, lunar territory extraction treaties, commercial satellite constellations, and the demilitarization of outer space.',
    descriptionAr: 'تنظيم الحطام الفضائي، معاهدات استغلال الموارد القمرية، شبكات الأقمار التجارية، ومنع عسكرة الفضاء الخارجي.',
    subTopics: [
      'Militarization of Earth Orbit & Anti-Satellite Weapons',
      'Private Mega-Constellations vs Global Astronomy',
      'Lunar Resource Extraction & The Artemis Accords',
      'Asteroid Mining Property Rights under International Law',
      'Orbital Space Debris Liability & Active Removal Treaties'
    ],
    subTopicsAr: [
      'عسكرة المدار الأرضي وأسلحة استهداف الأقمار الصناعية',
      'شبكات الأقمار التجارية العملاقة وأثرها على الرصد الفلكي',
      'استغلال موارد القمر واتفاقات أرتميس الدولية',
      'حقوق ملكية تعدين الكويكبات في القانون الدولي',
      'المسؤولية القانونية عن الحطام الفضائي ومعاهدات إزالته'
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Digital Sovereignty',
    nameAr: 'الأمن السيبراني والسيادة الرقمية',
    icon: 'lock',
    description: 'Critical infrastructure defense, state-sponsored cyber offensives, quantum encryption shifts, submarine data cables, and cyber treaty norms.',
    descriptionAr: 'حماية البنى التحتية الحيوية، الهجمات السيبرانية الحكومية، التشفير الكمي، كابلات البيانات البحرية، ومعايير القانون السيبراني الدولي.',
    subTopics: [
      'State-Sponsored Cyber Warfare & Digital Geneva Conventions',
      'Protection of Submarine Internet Cables & Data Highways',
      'Quantum Decryption & Post-Quantum Cryptographic Standards',
      'Cross-Border Ransomware & Multilateral Police Jurisdiction',
      'Sovereign Cloud Architectures vs Global Tech Monopolies'
    ],
    subTopicsAr: [
      'الحروب السيبرانية برعاية الدول واتفاقيات جنيف الرقمية',
      'حماية كابلات الإنترنت البحرية وطرق نقل البيانات العالمية',
      'فك التشفير الكمي ومعايير الأمان ما بعد الحوسبة الكمومية',
      'برمجيات الفدية العابرة للحدود والتعاون الشرطي الدولي',
      'بنى السحابة الرقمية السيادية مقابل احتكار الشركات الكبرى'
    ]
  },
  {
    id: 'youth',
    name: 'Youth Leadership & Future Generations',
    nameAr: 'القيادة الشبابية والمشاركة المدنية',
    icon: 'users',
    description: 'Intergenerational justice, institutional representation for unborn generations, youth parliamentary quotas, and student civil activism.',
    descriptionAr: 'العدالة بين الأجيال، التمثيل المؤسسي للأجيال القادمة، كوتة المقاعد البرلمانية للشباب، ونشاط المجتمع المدني الطلابي.',
    subTopics: [
      'Constitutional Rights & Guardianship for Future Generations',
      'Youth Parliamentary Quotas & Age-Neutral Candidacy Laws',
      'Student Union Protections in Transitional Democracies',
      'Participatory Budgeting & Citizen Assemblies for Youth',
      'Digital Civic Mobilization vs Traditional Political Partisanship'
    ],
    subTopicsAr: [
      'الحقوق الدستورية والوصاية القانونية على حقوق الأجيال القادمة',
      'كوتة المقاعد البرلمانية للشباب وتخفيض سن الترشح السياسي',
      'حماية الاتحادات الطلابية في الديمقراطيات الناشئة',
      'الموازنات التشاركية والجمعيات المدنية الشبابية',
      'التعبئة المدنية الرقمية مقابل التحزب السياسي التقليدي'
    ]
  },
  {
    id: 'peace-security',
    name: 'Peacebuilding, Disarmament & Humanitarian Law',
    nameAr: 'بناء السلام ونزع السلاح والقانون الإنساني',
    icon: 'scale',
    description: 'Mediation in asymmetric wars, civilian protection in urban conflicts, small arms non-proliferation, truth commissions, and refugee reintegration.',
    descriptionAr: 'الوساطة في النزاعات غير المتكافئة، حماية المدنيين في الحروب، نزع السلاح، لجان الحقيقة والعدالة الانتقالية، وإعادة إدماج اللاجئين.',
    subTopics: [
      'International Criminal Court (ICC) Enforcement & Universal Jurisdiction',
      'Civilian Protection Protocols in Dense Urban Warfare',
      'Truth, Reconciliation & Restorative Justice Frameworks Post-Conflict',
      'Small Arms Proliferation & Illicit Border Arms Trade',
      'Youth, Peace and Security (UNSCR 2250) in Peace Treaties'
    ],
    subTopicsAr: [
      'صلاحيات المحكمة الجنائية الدولية وإنفاذ الولاية القضائية العالمية',
      'بروتوكولات حماية المدنيين في مناطق القتال الحضري المكتظة',
      'لجان الحقيقة والمصالحة وأطر العدالة الانتقالية بعد الحروب',
      'انتشار الأسلحة الخفيفة ومكافحة التجارة غير المشروعة عبر الحدود',
      'تطبيق قرار مجلس الأمن 2250 حول الشباب والسلام في معاهدات الهدنة'
    ]
  },
  {
    id: 'biotech',
    name: 'Synthetic Biology & Genetic Horizons',
    nameAr: 'البيولوجيا التركيبية والآفاق الجينية',
    icon: 'dna',
    description: 'De-extinction technologies, gene drive ecosystems, synthetic pathogens biosecurity, human enhancement boundaries, and bio-foundry equity.',
    descriptionAr: 'تقنيات استعادة الكائنات المنقرضة، المحركات الجينية البيئية، أمن العوامل الممرضة التركيبية، حدود التعزيز البشري، وعدالة التكنولوجيا الحيوية.',
    subTopics: [
      'Gene Drive Deployment for Wild Vector Pest Eradication',
      'De-Extinction of Keystone Species: Ecological Restoration or Hazard',
      'Direct-to-Consumer Genetic Profiling & Insurance Discrimination',
      'Open-Source Genomic Research & Decentralized Medicine Synthesis',
      'Laboratory Biosafety Standards & Dual-Use Pathogen Research'
    ],
    subTopicsAr: [
      'إطلاق تقنيات المحركات الجينية للقضاء على الآقلات الحيوية في البرية',
      'إعادة إحياء الكائنات المنقرضة: استعادة بيئية أم مخاطرة غير محسوبة',
      'التحليل الجيني المباشر للمستهلك والتمييز في عقود التأمين',
      'أبحاث الجينوم مفتوحة المصدر وتصنيع الأدوية اللامركزي',
      'معايير السلامة البيولوجية وأبحاث العوامل الممرضة مزدوجة الاستخدام'
    ]
  },
  {
    id: 'food-oceans',
    name: 'Food Sovereignty & Ocean Ecosystems',
    nameAr: 'السيادة الغذائية ونظم المحيطات',
    icon: 'anchor',
    description: 'High seas marine treaty compliance, deep sea seabed mining moratoriums, cellular agriculture, smallholder farmer subsidies, and global grain supply shocks.',
    descriptionAr: 'معاهدات أعالي البحار، تجميد تعدين قاع المحيطات، الزراعة الخلوية، دعم صغار المزارعين، وصدمات سلاسل الحبوب العالمية.',
    subTopics: [
      'Deep-Sea Bed Mining Moratorium in International Waters',
      'Cellular Agriculture & Lab-Grown Protein Regulatory Standards',
      'Water-Intensive Export Crops vs Domestic Food Security in Arid Lands',
      'High Seas Biodiversity Treaty Enforcement & Marine Protected Areas',
      'Regenerative Farming Subsidies vs Monoculture Industrial Agriculture'
    ],
    subTopicsAr: [
      'المطالبة بتجميد تعدين قاع المحيطات في المياه الدولية',
      'معايير تنظيم اللحوم المزروعة مخبرياً والبروتينات الخلوية',
      'محاصيل التصدير المستهلكة للمياه مقابل الاكتفاء الذاتي في المناطق الجافة',
      'إنفاذ معاهدة التنوع البيولوجي في أعالي البحار والمحميات البحرية',
      'دعم الزراعة التجديدية مقابل الزراعات الصناعية أحادية المحصول'
    ]
  },
  {
    id: 'philosophy',
    name: 'Philosophy, Epistemology & Applied Ethics',
    nameAr: 'الفلسفة ونظرية المعرفة والأخلاقيات التطبيقية',
    icon: 'compass',
    description: 'Epistemic injustice, moral realism vs relativism, the ethics of post-humanism, animal consciousness rights, and the role of doubt in democratic discourse.',
    descriptionAr: 'العدالة المعرفية، الواقعية الأخلاقية مقابل النسبية، أخلاقيات ما بعد الإنسانية، حقوق ووعي الحيوان، وأهمية الشك في الحوار الديمقراطي.',
    subTopics: [
      'Sentience & Legal Personhood Criteria for Non-Human Species',
      'Epistemic Injustice & The Validation of Non-Western Epistemologies',
      'Solar Radiation Management & The Ethics of Global Climate Geoengineering',
      'Moral Boundaries of Transhumanism & Cognitive Neuro-Enhancements',
      'The Value of Intellectual Humility and Philosophical Scepticism in Public Discourse'
    ],
    subTopicsAr: [
      'معايير الوعي والشخصية القانونية للأنواع الحية غير البشرية',
      'العدالة المعرفية والاعتراف بالنظريات الفكرية غير الغربية',
      'أخلاقيات الهندسة الجيولوجية وحجب أشعة الشمس لمكافحة الاحترار',
      'الحدود الأخلاقية لحركة ما بعد الإنسانية والتعزيزات العصبية الإدراكية',
      'أهمية التواضع الفكري والشك الفلسفي البناء في النقاش العام'
    ]
  },
  {
    id: 'urban-futures',
    name: 'Urban Futures & Smart Habitats',
    nameAr: 'مستقبل المدن الذكية والعمران والإسكان',
    icon: 'building-2',
    description: '15-minute cities, public housing decommodification, algorithmic traffic surveillance, climate-resilient architecture, and rural-urban migration.',
    descriptionAr: 'مدن الـ 15 دقيقة، إلغاء تسليع الإسكان العام، المراقبة الخوارزمية الحضرية، العمارة المقاومة للمناخ، وحركة النزوح الريفي الحضري.',
    subTopics: [
      'Social Housing Decommodification vs Real Estate Speculation',
      'The 15-Minute City Model: Neighborhood Equity vs Spatial Segregation',
      'Algorithmic Surveillance, Facial Recognition & Civil Space in Smart Cities',
      'Sponge Cities & Extreme Rainfall Urban Drainage Engineering',
      'Polycentric Urban Development to Mitigate Megacity Strain'
    ],
    subTopicsAr: [
      'إلغاء تسليع الإسكان الاجتماعي والحد من المضاربات العقارية',
      'نموذج "مدينة الـ 15 دقيقة": عدالة الوصول للخدمات مقابل العزل المكاني',
      'المراقبة الخوارزمية وتقنيات التعرف على الوجوه في الفضاءات العامة',
      'المدن الإسفنجية وهندسة امتصاص السيول الحضرية في المناخات المتطرفة',
      'التطوير الحضري متعدد المراكز لتخفيف الضغط عن المدن العملاقة'
    ]
  }
];

export const DIALOGUE_STAGES = [
  {
    number: '01',
    title: 'Select',
    titleAr: 'الاختيار',
    desc: 'Topics are nominated by member debaters and selected through academic consensus on contemporary relevance.',
    descAr: 'ترشيح القضايا من قبل الأعضاء واختيارها بالتوافق الأكاديمي بناءً على راهنيتها وأهميتها الدولية.'
  },
  {
    number: '02',
    title: 'Prepare',
    titleAr: 'التحضير',
    desc: 'Speakers receive verified briefing dossiers, scholarly readings, and case study frameworks prior to the debate.',
    descAr: 'تزويد المتحدثين بملفات إحاطة موثقة وقراءات أكاديمية وأطر لدراسة الحالة قبل موعد المناظرة.'
  },
  {
    number: '03',
    title: 'Discuss',
    titleAr: 'الحوار والمناظرة',
    desc: 'Structured Oxford-style parliamentary debates and multilateral roundtables held live every two weeks.',
    descAr: 'مناظرات برلمانية منظمة وحلقات نقاشية متعددة الأطراف تعقد مباشرة عبر الإنترنت كل أسبوعين.'
  },
  {
    number: '04',
    title: 'Reflect',
    titleAr: 'التقييم والملاحظات',
    desc: 'Audience delegates and peers submit qualitative feedback on argument strength, evidence quality, and counter-framing.',
    descAr: 'تقديم تقييمات نوعية وملاحظات بناءة حول متانة الحجج وكفاءة الأدلة وأسلوب التفنيد.'
  },
  {
    number: '05',
    title: 'Document',
    titleAr: 'التوثيق والنشر',
    desc: 'Debate insights are synthesized into 8-part peer-reviewed academic papers published in our permanent research repository.',
    descAr: 'صياغة مخرجات الحوار في أوراق بحثية أكاديمية محكمة من 8 أقسام ونشرها في المكتبة الدائمة.'
  }
];
