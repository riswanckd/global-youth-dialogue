export interface TopicBankItem {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryNameAr?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  subtopics: string[];
  subtopicsAr?: string[];
  recommendedFormats?: string[];
  isCustom?: boolean;
  addedBy?: string;
  dateAdded?: string;
}

export const TOPIC_BANK: TopicBankItem[] = [
  // Education & Future of Learning
  {
    id: 'tb_edu_01',
    categoryId: 'education',
    categoryName: 'Education & Future of Learning',
    categoryNameAr: 'التعليم ومستقبل التعلم',
    title: 'Higher Education Access and the Global Student Debt Crisis',
    titleAr: 'فرص التعليم العالي وأزمة ديون الطلاب العالمية',
    description: 'Evaluating sovereign public funding models, tuition-free university experiments, and student debt forgiveness across OECD and developing nations.',
    descriptionAr: 'تقييم نماذج التمويل الحكومي، وتجارب مجانية التعليم الجامعي، وإسقاط ديون الطلاب بين دول التعاون الاقتصادي والدول النامية.',
    subtopics: [
      'Tuition-Free Public Higher Education vs Targeted Need-Based Subsidies',
      'Graduate Brain Drain from Developing to High-Income Economies',
      'Alternative Micro-Credentials & Digital Academies vs Traditional Degrees',
      'Securitization of Student Loans and Long-Term Socioeconomic Mobility'
    ],
    recommendedFormats: ['Roundtable Discussion', 'Structured Dialogue', 'Policy Presentation'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-05-15'
  },
  {
    id: 'tb_edu_02',
    categoryId: 'education',
    categoryName: 'Education & Future of Learning',
    categoryNameAr: 'التعليم ومستقبل التعلم',
    title: 'Standardized Testing vs Competency-Based Assessment in Secondary Schools',
    titleAr: 'الاختبارات المعيارية مقابل التقييم القائم على الكفاءات في المدارس',
    description: 'Investigating whether standardized examinations reinforce socioeconomic stratification or provide objective meritocratic measurement across diverse schooling districts.',
    descriptionAr: 'بحث ما إذا كانت الاختبارات الموحدة تكرس التفاوت الطبقي أم أنها توفر مقياساً موضوعياً للجدارة عبر مختلف البيئات التعليمية.',
    subtopics: [
      'Predictive Validity of Standardized Exams for University Success',
      'Portfolio & Project-Based Portfolios as Scalable Evaluation Alternatives',
      'Commercial Test-Prep Industries and Educational Inequity',
      'Neurodiversity and Fair Cognitive Assessment Frameworks'
    ],
    recommendedFormats: ['Structured Dialogue', 'Academic Workshop', 'Topic Presentation'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-05-20'
  },
  {
    id: 'tb_edu_03',
    categoryId: 'education',
    categoryName: 'Education & Future of Learning',
    categoryNameAr: 'التعليم ومستقبل التعلم',
    title: 'The Digital Divide: Bandwidth, Hardware & Educational Sovereignty',
    titleAr: 'الفجوة الرقمية: شبكات الإنترنت والأجهزة والسيادة التعليمية',
    description: 'Assessing structural disparities in digital learning infrastructure across the Global South and the risk of automated pedagogical lock-in.',
    descriptionAr: 'دراسة الفوارق الهيكلية في البنية التحتية للتعلم الرقمي في دول الجنوب العالمي ومخاطر التبعية التقنية.',
    subtopics: [
      'Universal Internet Access as an Inviolable Human Right to Education',
      'Open-Source Educational Resources (OER) vs Proprietary EdTech Platforms',
      'Rural and Indigenous Community Offline Digital Learning Toolkits',
      'National Cloud Infrastructures for Curriculum Data Sovereignty'
    ],
    recommendedFormats: ['Policy Discussion', 'Topic Presentation', 'Academic Activity'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-06-01'
  },

  // Economy, Labor & Future of Work
  {
    id: 'tb_econ_01',
    categoryId: 'economy',
    categoryName: 'Economy, Trade & Labor',
    categoryNameAr: 'الاقتصاد ومستقبل الوظائف',
    title: 'Universal Basic Income vs Guaranteed State Employment in Automated Economies',
    titleAr: 'الدخل الأساسي الشامل مقابل التوظيف الحكومي المضمون في ظل الأتمتة',
    description: 'Examining macroeconomic safety nets as robotics, generative agents, and algorithmic automation transform white-collar and industrial labor forces.',
    descriptionAr: 'دراسة شبكات الأمان الاقتصادي الكلي مع تحول الروبوتات والوكلاء الأذكياء إلى مجالات العمل المكتبي والصناعي.',
    subtopics: [
      'Financing Mechanisms: Robot Windfall Taxes vs Wealth Redistribution',
      'Inflationary Risks and Labor Market Participation Incentives',
      'Psychological Meaning of Work vs Guaranteed Economic Subsistence',
      'Pilot UBI Empirical Evidence from Kenya, Finland, and Alaska'
    ],
    recommendedFormats: ['Structured Dialogue', 'Panel Discussion', 'Roundtable'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-06-10'
  },
  {
    id: 'tb_econ_02',
    categoryId: 'economy',
    categoryName: 'Economy, Trade & Labor',
    categoryNameAr: 'بنية الديون السيادية في الجنوب العالمي وإصلاح المؤسسات المالية الدولية',
    title: 'Global South Sovereign Debt Architecture and Multilateral Financial Reform',
    titleAr: 'بنية الديون السيادية في الجنوب العالمي وإصلاح المؤسسات المالية الدولية',
    description: 'Interrogating the legitimacy of external debt burdens, IMF conditionalities, and debt-for-climate swap instruments in developing economies.',
    descriptionAr: 'مساءلة أعباء الديون الخارجية وشروط صندوق النقد الدولي وآليات مبادلة الديون بالاستثمار المناخي في الدول النامية.',
    subtopics: [
      'Debt-for-Climate and Debt-for-Nature Swaps: Genuine Relief or Greenwashing?',
      'Reforming Voting Power and Governance at the IMF & World Bank',
      'The Threat of Vulture Funds and Transnational Sovereign Insolvency Frameworks',
      'South-South Bilateral Currency Settlements and De-Dollarization Dynamics'
    ],
    recommendedFormats: ['Topic Presentation', 'Policy Roundtable', 'Academic Workshop'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-06-15'
  },
  {
    id: 'tb_econ_03',
    categoryId: 'economy',
    categoryName: 'Economy, Trade & Labor',
    categoryNameAr: 'الاقتصاد ومستقبل الوظائف',
    title: 'Platform Capitalism and Gig Worker Rights: Redefining Global Labor Treaties',
    titleAr: 'رأسمالية المنصات وحقوق عمال التطبيقات: إعادة صياغة معاهدات العمل الدولية',
    description: 'Analyzing the legal misclassification of platform gig workers as independent contractors and the need for enforceable transnational labor protections.',
    descriptionAr: 'تحليل التصنيف القانوني لعمال المنصات كمتعاقدين مستقلين وضرورة إرساء حماية عمالية دولية ملزمة.',
    subtopics: [
      'Algorithmic Management and the Right to Transparent Performance Metrics',
      'Cross-Border Digital Freelancing and Social Security Portability',
      'Decentralized Gig Worker Unions and Collective Bargaining Precedents',
      'Corporate Antitrust vs Labor Exemption Doctrines in Platform Markets'
    ],
    recommendedFormats: ['Panel Discussion', 'Structured Dialogue', 'Policy Workshop'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-06-25'
  },

  // Geopolitics & International Relations
  {
    id: 'tb_geo_01',
    categoryId: 'global-affairs',
    categoryName: 'Geopolitics & International Relations',
    categoryNameAr: 'الجيوسياسية والعلاقات الدولية',
    title: 'Reforming the United Nations Security Council Veto Power',
    titleAr: 'إصلاح حق النقض (الفيتو) في مجلس الأمن التابع للأمم المتحدة',
    description: 'Assessing institutional reform models, African Union Ezulwini Consensus, and the procedural abolition or restriction of the permanent five (P5) veto power.',
    descriptionAr: 'تقييم نماذج الإصلاح المؤسسي، وتوافق إيزولويني للاتحاد الأفريقي، وخيارات تقييد أو إلغاء حق الفيتو للدول الخمس الدائمة.',
    subtopics: [
      'Procedural Veto Overrides by the UN General Assembly (Uniting for Peace)',
      'Permanent African, Latin American & Asian Security Council Seats',
      'Restricting Veto Usage in Situations of Mass Atrocity Crimes',
      'Regional Multilateral Alternatives (BRICS+, GCC, ASEAN Security Dialogue)'
    ],
    recommendedFormats: ['Structured Dialogue', 'Diplomatic Roundtable', 'Topic Presentation'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-07-01'
  },
  {
    id: 'tb_geo_02',
    categoryId: 'global-affairs',
    categoryName: 'Geopolitics & International Relations',
    categoryNameAr: 'الجيوسياسية والعلاقات الدولية',
    title: 'Small State Mediation Diplomacy in Intractable International Conflicts',
    titleAr: 'دبلوماسية الوساطة للدول الصغيرة في النزاعات الدولية المعقدة',
    description: 'Examining how neutral small states (such as Qatar, Switzerland, Oman, and Singapore) leverage soft power, diplomatic neutrality, and mediation to de-escalate crises.',
    descriptionAr: 'دراسة كيفية توظيف الدول الصغيرة المحايدة (مثل قطر وسويسرا وعُمان وسنغافورة) للقوة الناعمة والحياد النشط لفض النزاعات.',
    subtopics: [
      'Institutional Backchannels vs High-Profile Bilateral Negotiations',
      'Maintaining Impartiality Amid External Coalition Pressures',
      'Humanitarian Hostage and Prisoner Swap Mediation Frameworks',
      'Economic and Reputational Safeguards for Non-Aligned Mediators'
    ],
    recommendedFormats: ['Topic Presentation', 'Diplomatic Seminar', 'Academic Workshop'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-07-05'
  },
  {
    id: 'tb_geo_03',
    categoryId: 'global-affairs',
    categoryName: 'Geopolitics & International Relations',
    categoryNameAr: 'الجيوسياسية والعلاقات الدولية',
    title: 'Unilateral Economic Sanctions and International Humanitarian Law',
    titleAr: 'العقوبات الاقتصادية أحادية الجانب والقانون الدولي الإنساني',
    description: 'Debating whether broad extraterritorial sanctions constitute collective punishment and assessing targeted asset freezes as legal alternatives.',
    descriptionAr: 'مناقشة ما إذا كانت العقوبات الشاملة تمثل عقاباً جماعياً للشعوب، وتقييم العقوبات الذكية الموجهة كبديل قانوني.',
    subtopics: [
      'Civilian Humanitarian Toll vs Intended Political Coercion',
      'Extraterritorial Jurisdiction and Secondary Sanctions Overreach',
      'De-Risking by Transnational Banks and Ineffective Medicine Waivers',
      'Alternative Sanction-Proof Bilateral Trade Infrastructure'
    ],
    recommendedFormats: ['Structured Dialogue', 'Policy Discussion', 'Academic Paper Colloquium'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-07-15'
  },

  // Technology & AI Ethics
  {
    id: 'tb_tech_01',
    categoryId: 'tech-ai',
    categoryName: 'Technology & AI Ethics',
    categoryNameAr: 'التكنولوجيا والذكاء الاصطناعي',
    title: 'Generative AI in Academic Research: Authorship, Integrity and Peer Review',
    titleAr: 'الذكاء الاصطناعي التوليدي في البحث الأكاديمي: النزاهة والتأليف والتحكيم',
    description: 'Interrogating the epistemological foundations of scholarly research when LLMs generate hypotheses, syntheses, and peer-review critiques.',
    descriptionAr: 'مساءلة الأسس المعرفية للبحث العلمي عند استخدام النماذج اللغوية في صياغة الفرضيات وتلخيص الأوراق والتحكيم العلمي.',
    subtopics: [
      'Mandatory Algorithmic Disclosure Standards in Academic Publishing',
      'Epistemic Stagnation and Synthetic Hallucinations in Scholarly Citation',
      'AI Peer Reviewers: Efficiency vs Human Discretion and Nuance',
      'Open-Weight Global Research Models vs Corporate Proprietary Labs'
    ],
    recommendedFormats: ['Academic Workshop', 'Presentation & Q&A', 'Structured Dialogue'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-07-20'
  },
  {
    id: 'tb_tech_02',
    categoryId: 'tech-ai',
    categoryName: 'Technology & AI Ethics',
    categoryNameAr: 'التكنولوجيا والذكاء الاصطناعي',
    title: 'Autonomous Lethal Weapons Systems (LAWS) and the Ethics of Remote Warfare',
    titleAr: 'أنظمة الأسلحة الفتاكة الذاتية وأخلاقيات خوض الحروب عن بُعد',
    description: 'Analyzing international treaty negotiations to establish legally binding bans on algorithmic decision-making over life and death in combat zones.',
    descriptionAr: 'تحليل مفاوضات المعاهدات الدولية لفرض حظر ملزم على اتخاذ القرارات القتالية القاتلة ذاتياً دون تدخل بشري.',
    subtopics: [
      'Meaningful Human Control (MHC) Doctrine under Geneva Conventions',
      'Algorithmic Target Identification Errors and Command Responsibility',
      'Proliferation Hazards of Asymmetric Commercial Drone Swarms',
      'Geopolitical Stalemates in UN CCW Geneva Negotiations'
    ],
    recommendedFormats: ['Structured Dialogue', 'Policy Roundtable', 'Topic Presentation'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-07-28'
  },

  // Climate, Environment & Energy
  {
    id: 'tb_env_01',
    categoryId: 'environment',
    categoryName: 'Climate, Environment & Energy',
    categoryNameAr: 'المناخ والبيئة والاستدامة',
    title: 'Loss and Damage Reparations: Legal Mechanisms and Global North Accountability',
    titleAr: 'تعويضات الخسائر والأضرار: الآليات القانونية ومساءلة دول الشمال الصناعي',
    description: 'Examining the operationalization of the COP28 Loss and Damage Fund, historical cumulative emissions liability, and non-debt climate grant frameworks.',
    descriptionAr: 'دراسة تفعيل صندوق الخسائر والأضرار لمؤتمر COP28، والمسؤولية التاريخية عن الانبعاثات، وتوفير المنح غير المثقلة بالديون.',
    subtopics: [
      'Differentiating Multilateral Grant Funding from Commercial Climate Loans',
      'Quantifying Non-Economic Losses: Heritage, Land Submersion, and Culture',
      'Litigation at the International Court of Justice (ICJ Advisory Opinions)',
      'Direct Access Windows for Indigenous and Island Communities'
    ],
    recommendedFormats: ['Policy Roundtable', 'Structured Dialogue', 'Academic Presentation'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-08-05'
  },
  {
    id: 'tb_env_02',
    categoryId: 'environment',
    categoryName: 'Climate, Environment & Energy',
    categoryNameAr: 'المناخ والبيئة والاستدامة',
    title: 'Transboundary Rivers, Dam Construction and International Water Justice',
    titleAr: 'الأنهار العابرة للحدود وبناء السدود الكبرى والعدالة المائية الدولية',
    description: 'Addressing downstream riparian sovereignty, ecological flows, and joint basin management treaties in major river basins (Nile, Tigris-Euphrates, Indus, Mekong).',
    descriptionAr: 'معالجة سيادة دول المصب، والتدفقات البيئية الآمنة، ومعاهدات إدارة الأحواض المشتركة (النيل، دجلة والفرات، السند، ميكونغ).',
    subtopics: [
      'The 1997 UN Watercourses Convention and Equitable Utilization Principles',
      'Hydro-Hegemony vs Collaborative Basin River Commissions',
      'Drought Contingency Protocols During Dam Reservoir Filling Phases',
      'Water as a Target or Weapon of Warfare in Contemporary Clashes'
    ],
    recommendedFormats: ['Topic Presentation', 'Diplomatic Roundtable', 'Policy Workshop'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-08-12'
  },

  // Governance, Law & Human Rights
  {
    id: 'tb_gov_01',
    categoryId: 'governance',
    categoryName: 'Governance, Law & Human Rights',
    categoryNameAr: 'الحوكمة والديمقراطية والثقة المجتمعية',
    title: 'Lowering the Voting Age to 16: Democratic Enfranchisement and Civic Readiness',
    titleAr: 'خفض سن الاقتراع إلى 16 عاماً: التمكين الديمقراطي والجاهزية المدنية',
    description: 'Evaluating democratic legitimacy when youth disproportionately bear the long-term consequences of climate, fiscal debt, and war policies.',
    descriptionAr: 'تقييم شرعية القرارات الديمقراطية في حين يتحمل الشباب العواقب المستقبلية لأزمات المناخ والديون والحروب.',
    subtopics: [
      'Empirical Lessons from Austria, Scotland, and Malta Voting at 16',
      'Civic Education Quality and Countering Disinformation Vulnerability',
      'Constitutional Consistency: Age of Military Service, Tax, and Franchise',
      'Youth Representation Quotas in Local and National Parliaments'
    ],
    recommendedFormats: ['Structured Dialogue', 'Panel Discussion', 'Youth Assembly'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-08-20'
  },
  {
    id: 'tb_hr_01',
    categoryId: 'governance',
    categoryName: 'Governance, Law & Human Rights',
    categoryNameAr: 'حقوق الإنسان والعدالة الاجتماعية',
    title: 'Universal Refugee Protections and the Principle of Non-Refoulement in Global Crises',
    titleAr: 'حماية اللاجئين ومبدأ حظر الإعادة القسرية في الأزمات العالمية',
    description: 'Scrutinizing offshore externalized border processing agreements, pushbacks at sea, and the duty of sovereign states under the 1951 Geneva Refugee Convention.',
    descriptionAr: 'فحص اتفاقيات ترحيل طالبي اللجوء إلى دول ثالثة، والإرجاع القسري في البحار، والتزامات الدول بموجب اتفاقية 1951.',
    subtopics: [
      'Extraterritorial Outsourcing of Asylum: Human Rights Violations vs State Prerogative',
      'Climate-Induced Displacement and the Definition of Sovereign Persecution',
      'Safe Humanitarian Corridors and Equitable Responsibility Sharing',
      'Dignity, Work Authorization, and Long-Term Social Integration of Refugees'
    ],
    recommendedFormats: ['Roundtable Discussion', 'Structured Dialogue', 'Academic Paper Session'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-08-28'
  },

  // Public Health, Bioethics & Science
  {
    id: 'tb_hlth_01',
    categoryId: 'health',
    categoryName: 'Public Health, Bioethics & Science',
    categoryNameAr: 'الصحة العالمية والأخلاقيات الحيوية',
    title: 'CRISPR Gene-Editing and Human Germline Modification: Bioethical Red Lines',
    titleAr: 'تعديل الجينات بتقنية كريسبر والخطوط الأخلاقية الحيوية للتحسين البشري',
    description: 'Deliberating the frontier between therapeutic gene correction for hereditary diseases and irreversible cosmetic/cognitive germline enhancement.',
    descriptionAr: 'بحث الحدود الفاصلة بين العلاج الجيني للأمراض الوراثية المستعصية والتحسين الجيني الموروث لتعزيز القدرات.',
    subtopics: [
      'Therapeutic Eradication of Monogenic Disorders vs Transhumanist Enhancement',
      'Socioeconomic Inequality and the Emergence of Genetic Stratification',
      'Global Moratorium Treaties and Enforcing International Bioethical Protocols',
      'Indigenous and Intercultural Perspectives on Sacred Human Essence'
    ],
    recommendedFormats: ['Structured Dialogue', 'Topic Presentation', 'Bioethics Seminar'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-09-05'
  },

  // Culture, Identity & Global Media
  {
    id: 'tb_cult_01',
    categoryId: 'culture',
    categoryName: 'Culture, Identity & Global Media',
    categoryNameAr: 'الثقافة والإعلام والهوية',
    title: 'Repatriation of Colonial-Era Artifacts from Western Institutions',
    titleAr: 'استعادة الآثار المنهوبة في الحقبة الاستعمارية من المتاحف الغربية',
    description: 'Examining the moral, legal, and educational arguments regarding the return of cultural treasures to their sovereign indigenous and national homelands.',
    descriptionAr: 'دراسة الحجج الأخلاقية والقانونية والتعليمية المتعلقة بإعادة الكنوز الأثرية إلى مواطنها الأصلية.',
    subtopics: [
      'Universal Museum Concept vs Restorative Justice for Plundered Nations',
      'Preservation and Curatorial Readiness Standards in the Global South',
      'Bilateral Treaties, UNESCO 1970 Convention and Unenforceable Soft Law',
      'Digital Twins and High-Resolution 3D Scanning as Restitution Substitutes'
    ],
    recommendedFormats: ['Structured Dialogue', 'Topic Presentation', 'Policy Roundtable'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-09-20'
  },

  // Space Governance & Astro-Politics
  {
    id: 'tb_space_01',
    categoryId: 'space',
    categoryName: 'Space Governance & Astro-Politics',
    categoryNameAr: 'حوكمة الفضاء والسياسة الفلكية',
    title: 'The Outer Space Treaty and Sovereign Lunar Mining Claims',
    titleAr: 'معاهدة الفضاء الخارجي والمطالبات السيادية بالتعدين القمري',
    description: 'Assessing legal property rights on celestial bodies, the Artemis Accords vs Moon Agreement, and space debris mitigation treaties.',
    descriptionAr: 'تقييم حقوق الملكية على الأجرام السماوية، واتفاقيات أرتميس مقابل معاهدة القمر، وتنظيم مدارات الحطام الفضائي.',
    subtopics: [
      'Commercial Resource Extraction Rights on Asteroids & the Moon',
      'Kessler Syndrome and Orbital Debris Removal Liabilities',
      'Militarization of Low Earth Orbit and Anti-Satellite Testing Bans',
      'Equitable Access to Orbit for Non-Spacefaring Global South Nations'
    ],
    recommendedFormats: ['Policy Roundtable', 'Structured Dialogue', 'Scientific Seminar'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-09-25'
  },

  // Cybersecurity & Digital Sovereignty
  {
    id: 'tb_cyber_01',
    categoryId: 'cybersecurity',
    categoryName: 'Cybersecurity & Digital Sovereignty',
    categoryNameAr: 'الأمن السيبراني والسيادة الرقمية',
    title: 'Critical Infrastructure Cyberattacks: Establishing International Rules of Engagement',
    titleAr: 'الهجمات السيبرانية على البنية التحتية الحيوية: وضع قواعد اشتباك دولية',
    description: 'Defining thresholds for acts of war in cyberspace, protecting civilian hospitals and electrical grids, and establishing an International Cyber Court.',
    descriptionAr: 'تحديد عتبات العمل الحربي في الفضاء السيبراني، وحماية المستشفيات وشبكات الطاقة، ومقترح محكمة سيبرانية دولية.',
    subtopics: [
      'Application of Tallinn Manual 2.0 to State-Sponsored Ransomware',
      'Attribution Challenges and False-Flag Operations in Cyberspace',
      'Banning Cyber Strikes on Civilian Hospitals & Water Purification Systems',
      'Digital Sovereignty vs Open Interoperable Global Internet Routing'
    ],
    recommendedFormats: ['Topic Presentation', 'Structured Dialogue', 'Strategic Briefing'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-10-01'
  },

  // Youth Leadership & Future Generations
  {
    id: 'tb_youth_01',
    categoryId: 'youth',
    categoryName: 'Youth Leadership & Future Generations',
    categoryNameAr: 'القيادات الشبابية وأجيال المستقبل',
    title: 'Intergenerational Justice and Constitutional Rights of Future Generations',
    titleAr: 'العدالة بين الأجيال والحقوق الدستورية للأجيال القادمة',
    description: 'Examining landmark constitutional court decisions safeguarding future generations from ecological collapse, catastrophic national debt, and systemic neglect.',
    descriptionAr: 'بحث الأحكام الدستورية التاريخية التي تحمي الأجيال القادمة من التدهور البيئي وتراكم الديون السيادية الكارثية.',
    subtopics: [
      'Institutionalizing Guardians / Ombudspersons for Future Generations',
      'Legal Standing of Minors in Climate Constitutional Litigation',
      'Long-Term Public Policy Foresight vs Short-Term Election Cycles',
      'Intergenerational Asset Allocation and Sustainable Endowment Models'
    ],
    recommendedFormats: ['Youth Assembly', 'Structured Dialogue', 'Policy Roundtable'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-10-05'
  },

  // Peacebuilding, Disarmament & Humanitarian Law
  {
    id: 'tb_peace_02',
    categoryId: 'peace-security',
    categoryName: 'Peacebuilding, Disarmament & Humanitarian Law',
    categoryNameAr: 'بناء السلام ونزع السلاح والقانون الدولي الإنساني',
    title: 'The Nuclear Non-Proliferation Treaty (NPT) and the Treaty on the Prohibition of Nuclear Weapons (TPNW)',
    titleAr: 'معاهدة عدم انتشار الأسلحة النووية ومعاهدة حظر الأسلحة النووية',
    description: 'Evaluating nuclear modernization programs, deterrence doctrines, and the humanitarian pledge for irreversible verifiable nuclear disarmament.',
    descriptionAr: 'تقييم برامج التحديث النووي، وعقائد الردع، والمساعي الدولية لنزع السلاح النووي بصورة لا رجعة فيها.',
    subtopics: [
      'Reconciling NPT Article VI Disarmament Pledges with Modernization Budgets',
      'The Legal and Normative Impact of the TPNW (Ban Treaty) on P5 States',
      'Nuclear Risk Reduction in Multi-Front Asymmetric Conflict Theatres',
      'Denuclearization Zones in the Middle East and Central Asia'
    ],
    recommendedFormats: ['Diplomatic Seminar', 'Structured Dialogue', 'Policy Roundtable'],
    isCustom: false,
    addedBy: 'Academic Advisory Board',
    dateAdded: '2024-10-10'
  }
];
