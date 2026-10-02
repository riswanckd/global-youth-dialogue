/**
 * GLOBAL YOUTH DIALOGUE - Data Layer & Persistence
 * Manages local database with pre-seeded demo content based on the project brief.
 */

const STORAGE_KEY = 'gyd_platform_db_v2';

// Initial pre-seeded database
const INITIAL_DATABASE = {
  users: [
    {
      id: 'usr_coord_1',
      name: 'Tariq Al-Mansoor',
      email: 'coordinator@gyd.org',
      password: 'password123',
      role: 'Coordinator',
      department: 'Programme & Strategy',
      country: 'Qatar',
      flag: '🇶🇦',
      bio: 'ISDC7 Qatar Debater, Passionate about Middle Eastern diplomacy and youth debate training.',
      interests: ['Global Affairs', 'Governance & Society', 'Education'],
      status: 'active',
      joinedDate: '2024-05-10'
    },
    {
      id: 'usr_coord_2',
      name: 'Amara Chen',
      email: 'amara.chen@gyd.org',
      password: 'password123',
      role: 'Coordinator',
      department: 'Research & Writings',
      country: 'Singapore',
      flag: '🇸🇬',
      bio: 'ISDC7 Finalist, studying Public Policy & AI ethics. Leads academic summaries and research.',
      interests: ['Technology & AI', 'Economy', 'Global Affairs'],
      status: 'active',
      joinedDate: '2024-05-12'
    },
    {
      id: 'usr_mem_1',
      name: 'Kofi Mensah',
      email: 'member@gyd.org',
      password: 'password123',
      role: 'Speaker',
      country: 'Ghana',
      flag: '🇬🇭',
      bio: 'National schools debate captain, climate policy advocate and student researcher.',
      interests: ['Environment', 'Economy', 'Governance & Society'],
      status: 'active',
      joinedDate: '2024-06-01'
    },
    {
      id: 'usr_mem_2',
      name: 'Elena Rostova',
      email: 'elena.rostova@gyd.org',
      password: 'password123',
      role: 'Moderator',
      country: 'United Kingdom',
      flag: '🇬🇧',
      bio: 'Competitive debater and youth parliament member with a focus on human rights law.',
      interests: ['Culture & Identity', 'Global Affairs', 'Governance & Society'],
      status: 'active',
      joinedDate: '2024-06-15'
    },
    {
      id: 'usr_mem_3',
      name: 'Zaid Al-Harbi',
      email: 'zaid.harbi@gyd.org',
      password: 'password123',
      role: 'Research Contributor',
      country: 'Jordan',
      flag: '🇯🇴',
      bio: 'Youth researcher interested in educational reform and sustainable development in the Arab world.',
      interests: ['Education', 'Environment', 'Culture & Identity'],
      status: 'active',
      joinedDate: '2024-07-02'
    },
    {
      id: 'usr_mem_4',
      name: 'Sofia Morales',
      email: 'sofia.morales@gyd.org',
      password: 'password123',
      role: 'Member',
      country: 'Mexico',
      flag: '🇲🇽',
      bio: 'Student diplomat and debater specializing in Latin American trade and migration dynamics.',
      interests: ['Economy', 'Global Affairs', 'Emerging Issues'],
      status: 'active',
      joinedDate: '2024-07-20'
    }
  ],

  categories: [
    {
      id: 'global-affairs',
      name: 'Global Affairs',
      nameAr: 'الشؤون الدولية',
      icon: 'globe',
      description: 'International relations, diplomacy, conflicts, migration, international organisations, global governance.',
      descriptionAr: 'العلاقات الدولية، العمل الدبلوماسي، فض النزاعات، الهجرة، المنظمات الدولية، والحوكمة العالمية.'
    },
    {
      id: 'tech-ai',
      name: 'Technology & AI',
      nameAr: 'التكنولوجيا والذكاء الاصطناعي',
      icon: 'cpu',
      description: 'Artificial intelligence, automation, digital privacy, social media, misinformation, technology in education.',
      descriptionAr: 'الذكاء الاصطناعي، الأتمتة، الخصوصية الرقمية، شبكات التواصل، مكافحة التضليل، والتقنية في التعليم.'
    },
    {
      id: 'education',
      name: 'Education',
      nameAr: 'التعليم',
      icon: 'book-open',
      description: 'Education systems, higher education, vocational education, educational inequality, future skills.',
      descriptionAr: 'النظم التعليمية، التعليم العالي والمهني، معالجة التفاوت التعليمي، وبناء مهارات المستقبل.'
    },
    {
      id: 'environment',
      name: 'Environment',
      nameAr: 'البيئة والاستدامة',
      icon: 'leaf',
      description: 'Climate change, sustainability, renewable energy, water security, climate migration.',
      descriptionAr: 'التغير المناخي، الاستدامة، الطاقة المتجددة، الأمن المائي، وقضايا الهجرة البيئية.'
    },
    {
      id: 'economy',
      name: 'Economy',
      nameAr: 'الاقتصاد والتنمية',
      icon: 'trending-up',
      description: 'Youth unemployment, entrepreneurship, future of work, poverty, inequality, global trade.',
      descriptionAr: 'بطالة الشباب، ريادة الأعمال، مستقبل الوظائف، مكافحة الفقر واللامساواة، والتجارة الدولية.'
    },
    {
      id: 'governance',
      name: 'Governance & Society',
      nameAr: 'الحوكمة والمجتمع',
      icon: 'shield',
      description: 'Democracy, public participation, governance, political institutions, social policy.',
      descriptionAr: 'الديمقراطية، المشاركة المجتمعية، الحوكمة الرشيدة، المؤسسات السياسية، والسياسات الاجتماعية.'
    },
    {
      id: 'culture',
      name: 'Culture & Identity',
      nameAr: 'الثقافة والهوية',
      icon: 'users',
      description: 'Globalisation, cultural preservation, language, identity, cultural exchange.',
      descriptionAr: 'العولمة، صون التراث والهوية، حماية التعدد اللغوي، والتبادل الثقافي بين الشعوب.'
    },
    {
      id: 'emerging',
      name: 'Emerging Issues',
      nameAr: 'قضايا ناشئة',
      icon: 'zap',
      description: 'New and rapidly developing global issues and future horizons.',
      descriptionAr: 'القضايا العالمية المستجدة، التحولات الجيوسياسية المتسارعة، واستشراف الآفاق المستقبلية.'
    }
  ],

  topics: [
    {
      id: 'top_01',
      title: 'Should AI become a core part of education curricula worldwide?',
      category: 'tech-ai',
      categoryName: 'Technology & AI',
      description: 'Examining the integration of generative AI in secondary and tertiary curricula, balancing pedagogical gains against cognitive dependence and digital inequality.',
      motion: 'This House would mandate AI literacy and ethical AI utilization as a compulsory core subject in secondary schools.',
      status: 'Completed', // Proposed, Under Review, Approved, Scheduled, Completed, Archived
      proposedBy: 'Amara Chen',
      proposedById: 'usr_coord_2',
      countryPerspective: 'Contrasting high-tech Asian education systems with developing digital ecosystems.',
      sources: 'UNESCO Guidance on AI in Education (2023), OECD Future of Education 2030.',
      researchNotes: 'Focus on equity: schools without reliable broadband face compounded learning divides.',
      assignedSpeaker: 'Amara Chen & Kofi Mensah',
      assignedModerator: 'Elena Rostova',
      createdAt: '2024-06-05'
    },
    {
      id: 'top_02',
      title: 'Climate Reparations: Should developed nations finance Global South adaptation?',
      category: 'environment',
      categoryName: 'Environment',
      description: 'A structural debate on historical carbon emissions, loss-and-damage mechanisms established at COP27/28, and ethical liability.',
      motion: 'This House believes historic carbon emitters have an unconditional moral and legal duty to fund climate infrastructure in vulnerable nations.',
      status: 'Completed',
      proposedBy: 'Kofi Mensah',
      proposedById: 'usr_mem_1',
      countryPerspective: 'West African coastlines experiencing accelerated tidal displacement vs. energy transition constraints in Europe.',
      sources: 'IPCC Sixth Assessment Report, Loss and Damage Fund Framework COP28.',
      researchNotes: 'Differentiate between multilateral grants and debt-creating climate loans.',
      assignedSpeaker: 'Kofi Mensah',
      assignedModerator: 'Tariq Al-Mansoor',
      createdAt: '2024-06-20'
    },
    {
      id: 'top_03',
      title: 'The Future of Multilateral Diplomacy in an Increasingly Fractured Multipolar Order',
      category: 'global-affairs',
      categoryName: 'Global Affairs',
      description: 'Assessing whether the United Nations Security Council and traditional diplomatic treaties remain capable of mitigating transnational conflicts.',
      motion: 'This House would reform the UN Security Council veto power to preserve the legitimacy of international law.',
      status: 'Scheduled',
      proposedBy: 'Tariq Al-Mansoor',
      proposedById: 'usr_coord_1',
      countryPerspective: 'Middle Eastern diplomatic mediation (e.g. Qatar multilateral channels) vs Western institutional stalemates.',
      sources: 'Chatham House Multipolarity Analysis, UN Charter Article 27.',
      researchNotes: 'Examine rise of regional groupings like BRICS+ and GCC mediation pacts.',
      assignedSpeaker: 'Tariq Al-Mansoor & Elena Rostova',
      assignedModerator: 'Sofia Morales',
      createdAt: '2024-07-10'
    },
    {
      id: 'top_04',
      title: 'Universal Basic Income vs. Guaranteed Public Employment in the Automation Era',
      category: 'economy',
      categoryName: 'Economy',
      description: 'Analyzing economic safety nets as algorithmic displacement and robotics enter white-collar and logistics sectors.',
      motion: 'This House would implement a Universal Basic Income funded through sovereign technological windfall taxation.',
      status: 'Approved',
      proposedBy: 'Sofia Morales',
      proposedById: 'usr_mem_4',
      countryPerspective: 'Informal labor markets in Latin America vs welfare states in Scandinavia.',
      sources: 'ILO World Employment and Social Outlook, Stanford Basic Income Lab.',
      researchNotes: 'Evaluate inflation hazards vs consumer demand preservation.',
      assignedSpeaker: 'Unassigned',
      assignedModerator: 'Unassigned',
      createdAt: '2024-08-01'
    },
    {
      id: 'top_05',
      title: 'Linguistic Hegemony and the Preservation of Indigenous and Regional Dialects',
      category: 'culture',
      categoryName: 'Culture & Identity',
      description: 'How internet English and algorithmic translation models affect cultural nuance, mother tongues, and national literature.',
      motion: 'This House would subsidize national linguistic content quotas on international streaming and AI knowledge bases.',
      status: 'Under Review',
      proposedBy: 'Zaid Al-Harbi',
      proposedById: 'usr_mem_3',
      countryPerspective: 'Modern Standard Arabic vs colloquial dialects across Levant and Gulf.',
      sources: 'UNESCO World Atlas of Languages, Arab Thought Foundation Reports.',
      researchNotes: 'Explore whether AI models can actively resurrect endangered dialects.',
      assignedSpeaker: 'Unassigned',
      assignedModerator: 'Unassigned',
      createdAt: '2024-08-15'
    },
    {
      id: 'top_06',
      title: 'Regulating Deepfakes and Synthetic Media in National Electoral Cycles',
      category: 'governance',
      categoryName: 'Governance & Society',
      description: 'The tension between preventing synthetic political manipulation and safeguarding political speech and digital satire.',
      motion: 'This House would criminalize the publication of unverified synthetic media during official election campaign periods.',
      status: 'Proposed',
      proposedBy: 'Elena Rostova',
      proposedById: 'usr_mem_2',
      countryPerspective: 'EU Digital Services Act precedents vs Commonwealth free expression case law.',
      sources: 'EU AI Act Governance Framework, Brookings TechTank 2024.',
      researchNotes: 'Focus on attribution watermarking versus rapid debunking protocols.',
      assignedSpeaker: 'Unassigned',
      assignedModerator: 'Unassigned',
      createdAt: '2024-09-02'
    }
  ],

  sessions: [
    {
      id: 'ses_01',
      sessionNumber: 1,
      title: 'Should AI Become a Core Part of Education Curricula?',
      titleAr: 'هل يجب إدراج الذكاء الاصطناعي كجزء أساسي في المناهج التعليمية؟',
      topicId: 'top_01',
      category: 'tech-ai',
      categoryName: 'Technology & AI',
      categoryNameAr: 'التكنولوجيا والذكاء الاصطناعي',
      formatAr: 'مناظرة برلمانية رسمية + جلسة مستديرة',
      durationAr: '٩٠ دقيقة',
      descriptionAr: 'جمعت جلستنا الافتتاحية نخبة من المناظرين عقب بطولة قطر الدولية (ISDC7) في الدوحة لبحث مدى جدوى دمج نماذج الذكاء الاصطناعي التوليدي في فصول المدارس الثانوية.',
      date: '2024-07-06',
      time: '17:00',
      timezone: 'GMT+3 (Qatar Standard Time)',
      format: 'Formal Debate + Roundtable',
      duration: '90 mins',
      status: 'Completed', // Upcoming, Completed
      moderator: {
        name: 'Elena Rostova',
        country: 'United Kingdom',
        flag: '🇬🇧'
      },
      speakers: [
        {
          name: 'Amara Chen',
          country: 'Singapore',
          flag: '🇸🇬',
          stance: 'Affirmative: AI literacy is foundational cognitive literacy.'
        },
        {
          name: 'Kofi Mensah',
          country: 'Ghana',
          flag: '🇬🇭',
          stance: 'Negative: Infrastructure divides will deepen educational inequality.'
        }
      ],
      countriesRepresented: ['Qatar', 'Singapore', 'Ghana', 'United Kingdom', 'Jordan', 'Mexico'],
      description: 'Our inaugural session brought debaters together following the ISDC7 tournament in Doha to interrogate whether generative models should be formally integrated into secondary classrooms.',
      structure: [
        { phase: '01', title: 'Context & Ground Rules', duration: '10 min', lead: 'Moderator' },
        { phase: '02', title: 'Opening Presentations (Affirmative & Negative)', duration: '20 min', lead: 'Speakers' },
        { phase: '03', title: 'Cross-Examination & Rebuttals', duration: '20 min', lead: 'Both Speakers' },
        { phase: '04', title: 'Open Floor Dialogue & Questions', duration: '25 min', lead: 'All Members' },
        { phase: '05', title: 'Synthesis & Closing Reflections', duration: '15 min', lead: 'Panel' }
      ],
      prepMaterials: [
        { title: 'Session Briefing Dossier (PDF)', url: '#' },
        { title: 'UNESCO Policy Framework on AI Competencies', url: 'https://unesco.org' }
      ],
      meetingLink: 'https://meet.google.com/private-gyd-dialogue-01',
      poster: 'ai_education_poster',
      recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0', // Unlisted demo embed
      isRecordingPrivate: true,
      hasSummary: true,
      summaryId: 'wri_01'
    },
    {
      id: 'ses_02',
      sessionNumber: 2,
      title: 'Climate Reparations & Sovereign Adaptation Financing',
      titleAr: 'التعويضات المناخية وتمويل التكيف السيادي: معضلة الجنوب العالمي',
      topicId: 'top_02',
      category: 'environment',
      categoryName: 'Environment',
      categoryNameAr: 'البيئة والاستدامة',
      formatAr: 'حوار سياساتي ونقاش تشاركي',
      durationAr: '٩٠ دقيقة',
      descriptionAr: 'حوار سياساتي معمق يناقش المسؤولية التاريخية عن انبعاثات الغازات الدفيئة ويبحث آليات ملموسة لنقل تمويل الخسائر والأضرار دون إثقال كاهل الدول النامية بالديون.',
      date: '2024-07-27',
      time: '18:00',
      timezone: 'GMT+3 (Qatar Standard Time)',
      format: 'Policy Discussion & Dialogue',
      duration: '90 mins',
      status: 'Completed',
      moderator: {
        name: 'Tariq Al-Mansoor',
        country: 'Qatar',
        flag: '🇶🇦'
      },
      speakers: [
        {
          name: 'Kofi Mensah',
          country: 'Ghana',
          flag: '🇬🇭',
          stance: 'Lead Presenter: Historical liability and loss-and-damage restitution.'
        },
        {
          name: 'Sofia Morales',
          country: 'Mexico',
          flag: '🇲🇽',
          stance: 'Discussant: Fiscal capacity of transition states and sovereign debt traps.'
        }
      ],
      countriesRepresented: ['Qatar', 'Ghana', 'Mexico', 'United Kingdom', 'Singapore', 'Canada', 'Nigeria'],
      description: 'A deep-dive policy dialogue confronting the moral culpability of historical greenhouse gas emissions and evaluating concrete mechanisms for non-debt loss-and-damage transfers.',
      structure: [
        { phase: '01', title: 'Moderator Framing & Scientific Baseline', duration: '10 min', lead: 'Moderator' },
        { phase: '02', title: 'Lead Presentation: The Case for Direct Reparations', duration: '20 min', lead: 'Kofi Mensah' },
        { phase: '03', title: 'Critique: Fiscal Feasibility & Debt Realities', duration: '15 min', lead: 'Sofia Morales' },
        { phase: '04', title: 'Moderated Delegate Interventions', duration: '30 min', lead: 'Floor' },
        { phase: '05', title: 'Actionable Research Roadmap', duration: '15 min', lead: 'Lead Presenter' }
      ],
      prepMaterials: [
        { title: 'COP28 Loss and Damage Charter Summary', url: '#' },
        { title: 'Global South Climate Vulnerability Index', url: '#' }
      ],
      meetingLink: 'https://meet.google.com/private-gyd-dialogue-02',
      poster: 'climate_reparations_poster',
      recordingUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0',
      isRecordingPrivate: true,
      hasSummary: true,
      summaryId: 'wri_02'
    },
    {
      id: 'ses_03',
      sessionNumber: 3,
      title: 'Multilateral Diplomacy in an Era of Multipolarity: Reforming the UNSC',
      titleAr: 'الدبلوماسية متعددة الأطراف في عصر التعددية القطبية: إصلاح مجلس الأمن الدولي',
      topicId: 'top_03',
      category: 'global-affairs',
      categoryName: 'Global Affairs',
      categoryNameAr: 'الشؤون الدولية',
      formatAr: 'مناظرة برلمانية رسمية',
      durationAr: '٩٠ دقيقة',
      descriptionAr: 'مناظرة دولية تقيّم مدى قدرة الهيكل المؤسسي الحالي لمجلس الأمن على الاستمرار دون إصلاح إجرائي شامل، مع بحث نماذج وساطة بديلة رائدة من منطقة الخليج العربي.',
      date: '2024-10-18',
      time: '17:30',
      timezone: 'GMT+3 (Qatar Standard Time)',
      format: 'Formal Debate',
      duration: '90 mins',
      status: 'Upcoming',
      moderator: {
        name: 'Sofia Morales',
        country: 'Mexico',
        flag: '🇲🇽'
      },
      speakers: [
        {
          name: 'Tariq Al-Mansoor',
          country: 'Qatar',
          flag: '🇶🇦',
          stance: 'Affirmative: Abolishing or circumscribing the permanent veto is mandatory.'
        },
        {
          name: 'Elena Rostova',
          country: 'United Kingdom',
          flag: '🇬🇧',
          stance: 'Negative: Realpolitik dictates great-power veto keeps major powers at the table.'
        }
      ],
      countriesRepresented: ['Qatar', 'United Kingdom', 'Mexico', 'Singapore', 'Jordan', 'Ghana'],
      description: 'An international debate evaluating whether the current institutional architecture of the United Nations Security Council can survive without sweeping procedural reform, exploring alternate mediation models pioneered in the Gulf region.',
      structure: [
        { phase: '01', title: 'Introductory Motion Briefing', duration: '10 min', lead: 'Moderator' },
        { phase: '02', title: 'First Proposition Speech', duration: '15 min', lead: 'Tariq Al-Mansoor' },
        { phase: '03', title: 'First Opposition Speech', duration: '15 min', lead: 'Elena Rostova' },
        { phase: '04', title: 'Floor Debater Interventions (3 min each)', duration: '35 min', lead: 'Floor' },
        { phase: '05', title: 'Summary Speeches & Adjournment', duration: '15 min', lead: 'Speakers' }
      ],
      prepMaterials: [
        { title: 'UN General Assembly Resolution 76/262 (Veto Initiative)', url: '#' },
        { title: 'ISDC7 Diplomatic Debate Motions Reference Guide', url: '#' }
      ],
      meetingLink: 'https://meet.google.com/gyd-oct-unsc-live',
      poster: 'diplomacy_unsc_poster',
      recordingUrl: '',
      isRecordingPrivate: true,
      hasSummary: false,
      summaryId: null
    }
  ],

  writings: [
    {
      id: 'wri_01',
      sessionId: 'ses_01',
      sessionNumber: 1,
      title: 'Pedagogical Enabler or Cognitive Crutch? A Youth Analysis on Mandating Artificial Intelligence in Secondary Curricula',
      category: 'tech-ai',
      categoryName: 'Technology & AI',
      author: 'Amara Chen & GYD Research Working Group',
      authorRole: 'Research Lead (Singapore)',
      publicationDate: '2024-07-14',
      status: 'Published',
      intro: 'The swift proliferation of large language models into student study environments has prompted educational ministries globally to scramble between punitive prohibitions and celebratory embrace. During GYD Session 01, delegates from six countries analyzed whether generative AI should be mandated as a foundational curriculum component.',
      background: 'Historically, educational systems resisted revolutionary tools from electronic calculators to Wikipedia before eventually accommodating them. Unlike static calculation utilities, however, generative AI mimics higher-order cognitive outputs—synthesis, drafting, and problem formulation—raising fundamental questions regarding intellectual dependency.',
      keyArguments: [
        'Cognitive Amplification: Mandated curriculum instruction transforms students from passive AI consumers into critical prompters who understand neural hallucination and architectural limits.',
        'Democratization of Tutoring: In resource-constrained classrooms, bespoke LLM mentors provide scalable personalized instruction previously restricted to elite private tutoring.',
        'Workforce Preparedness: Post-industrial economies increasingly penalize workers unable to leverage human-in-the-loop algorithmic collaboration.'
      ],
      counterarguments: [
        'Atrophy of Fundamental Writing & Logic: Premature reliance on predictive text truncates the struggle with syntax, rhetorical structure, and preliminary drafting.',
        'Infrastructure Asymmetry: Mandating software dependencies severely punishes schools without steady electrical grids and high-bandwidth connectivity.',
        'Algorithmic Bias Ingestion: Commercial LLMs trained on dominant Western corpora perpetuate implicit cultural homogenizations.'
      ],
      evidence: 'Delegates cited empirical pilots from Singapore’s National AI Strategy 2.0 alongside UNESCO field data documenting that over 65% of secondary educators receive zero formal guidance on prompt verification or algorithmic bias.',
      insights: 'The dialogue established that the debate is fundamentally misframed when treated as a binary choice between adoption and prohibition. The consensus recommendation favored "Pedagogical Scaffolding": requiring students to master unassisted deductive writing in primary stages before introducing evaluated prompt-engineering modules in upper secondary levels.',
      conclusion: 'Artificial intelligence cannot be safely excluded from modern schooling; neither can it be uncritically sanctified. Curricular mandates must prioritize epistemological understanding—interrogating how the machine synthesizes truth—over mere operational speed.',
      furtherQuestions: [
        'How can standardized examination boards verify authentic student voice in asynchronous coursework?',
        'What governance frameworks prevent commercial ed-tech corporations from monetizing sovereign pupil behavioral data?'
      ],
      sources: 'UNESCO (2023). Guidance for Generative AI in Education and Research. Paris: UNESCO. OECD (2023). Digital Education Outlook: Anticipating Technological Disruption.'
    },
    {
      id: 'wri_02',
      sessionId: 'ses_02',
      sessionNumber: 2,
      title: 'Climate Restitution & Sovereign Equity: Decoupling Loss-and-Damage Transfers from Sovereign Debt Traps',
      category: 'environment',
      categoryName: 'Environment',
      author: 'Kofi Mensah & Tariq Al-Mansoor',
      authorRole: 'Programme Rapporteurs',
      publicationDate: '2024-08-04',
      status: 'Published',
      intro: 'While the establishment of the Loss and Damage Fund at recent UN Climate Conferences was heralded as a diplomatic breakthrough, vulnerable nations remain constrained by financing instruments that aggravate fiscal distress. Session 02 explored the legal and ethical prerequisites for non-debt climate transfers.',
      background: 'Developing nations contribute less than 10% of historic cumulative carbon emissions yet bear over 75% of climate-induced infrastructural reconstruction costs. Currently, over 60% of international climate finance is disbursed as concessionary loans rather than non-repayable grants, forcing island and coastal economies into cyclical borrowing.',
      keyArguments: [
        'Historical Restitution: Carbon emissions represent an atmospheric commons overdraft; capital transfers constitute legal compensation rather than voluntary philanthropy.',
        'Systemic Resilience: Investing in early adaptation infrastructure saves up to seven times the capital required for post-disaster humanitarian aid.',
        'Ecological Debt Recognition: Acknowledging historical pollution establishes parity in bilateral multilateral negotiations.'
      ],
      counterarguments: [
        'Political Feasibility: Domestic constituencies in developed economies facing cost-of-living crises resist large unconditioned overseas cash allocations.',
        'Fiduciary Governance: Concerns over fund misappropriation and institutional absorptive capacity within recipient ministries.',
        'Alternative Private Capital Mechanisms: Arguments asserting that sovereign risk-guarantee facilities and carbon offsets provide superior market scalability.'
      ],
      evidence: 'Participants examined the Bridgetown Initiative spearheaded by Barbados, contrasting multilateral debt moratoriums with traditional IMF restructuring clauses.',
      insights: 'The participants unanimously concurred that climate finance delivered via debt instruments is inherently predatory. The dialogue concluded that automatic debt-pause clauses triggered by verified natural disasters represent the most immediate, politically viable compromise.',
      conclusion: 'True climate justice requires transitioning from discretion-based aid rhetoric to treaty-bound loss-and-damage capitalization. Without programmatic non-debt transfers, sovereign vulnerability will permanently undermine global geopolitical stability.',
      furtherQuestions: [
        'Can international courts enforce binding emissions damages under maritime and customary international law?',
        'What institutional oversight mechanism ensures local community stewardship over multilateral climate capital?'
      ],
      sources: 'IPCC Working Group II (2022). Climate Change: Impacts, Adaptation and Vulnerability. UNEP (2023). Adaptation Gap Report.'
    }
  ],

  feedback: [
    {
      id: 'fdb_01',
      sessionId: 'ses_01',
      sessionTitle: 'Should AI Become a Core Part of Education Curricula?',
      memberId: 'usr_mem_3',
      memberName: 'Zaid Al-Harbi',
      memberCountry: 'Jordan',
      rating: 'Excellent',
      strengths: 'The contrast between Singapore’s institutional AI roadmap and West African infrastructure constraints was brilliant and grounded.',
      missingPoints: 'We needed a deeper look into intellectual property rights regarding student essay training data.',
      evidenceFeedback: 'More quantitative data on teacher training hours would have strengthened the negative bench.',
      overlookedPerspectives: 'Vocational and trade school curricula were left out; the focus remained heavily academic.',
      futureIdeas: 'A session dedicated to digital sovereignty and sovereign AI models in the Global South.',
      comments: 'Extraordinary moderation by Elena—kept both speakers tightly to parliamentary timing.'
    },
    {
      id: 'fdb_02',
      sessionId: 'ses_01',
      sessionTitle: 'Should AI Become a Core Part of Education Curricula?',
      memberId: 'usr_mem_4',
      memberName: 'Sofia Morales',
      memberCountry: 'Mexico',
      rating: 'Good',
      strengths: 'Clear speaker articulation and very thoughtful member Q&A interventions.',
      missingPoints: 'Language barriers in AI interfaces—most models favor English, which limits pedagogical uptake in non-Anglophone settings.',
      evidenceFeedback: 'Affirmative speaker could have cited cognitive science studies on memory retention with AI tools.',
      overlookedPerspectives: 'Primary school vs secondary school distinctions.',
      futureIdeas: 'Linguistic diversity and the future of regional dialects.',
      comments: 'Inspiring to see the ISDC7 debate spirit live on in this academic platform!'
    }
  ],

  applications: [
    {
      id: 'app_01',
      name: 'Farhan Nadeem',
      email: 'farhan.n@outlook.com',
      country: 'Pakistan',
      flag: '🇵🇰',
      interests: ['Global Affairs', 'Governance & Society'],
      debateExperience: 'Debater at National Schools Championship Pakistan, 3 years parliamentary format.',
      motivation: 'I want to build cross-border intellectual ties with fellow youth who care about sustainable governance and international diplomacy.',
      status: 'Pending',
      date: '2024-09-28'
    },
    {
      id: 'app_02',
      name: 'Sarah Van Dijk',
      email: 'sarah.vandijk@edu.nl',
      country: 'Netherlands',
      flag: '🇳🇱',
      interests: ['Environment', 'Economy'],
      debateExperience: 'European Youth Parliament delegate, university debate society treasurer.',
      motivation: 'passionate about ecological economics and learning how Global South debaters view loss-and-damage policy.',
      status: 'Pending',
      date: '2024-09-30'
    }
  ],

  announcements: [
    {
      id: 'ann_01',
      title: 'Upcoming Session 03 Briefing Pack & Registration Open',
      content: 'The official briefing dossier for Session 03 (Multilateral Diplomacy & UNSC Reform) is now available in the Member Portal. Registered speakers please review speech timings.',
      category: 'Session Alert',
      priority: 'High',
      author: 'Tariq Al-Mansoor (Programme Coordinator)',
      date: '2024-10-01'
    },
    {
      id: 'ann_02',
      title: 'Academic Writing 02 Published: Climate Restitution',
      content: 'The research synthesis for Session 02 has been peer-reviewed and published in our academic youth library. Open for delegate citations.',
      category: 'Research Publication',
      priority: 'Normal',
      author: 'Amara Chen (Research Coordinator)',
      date: '2024-08-05'
    }
  ],

  notifications: [
    {
      id: 'notif_01',
      title: 'Session 03 Briefing Dossier Published',
      message: 'The motion analysis dossier for "Veto Power & UNSC Structural Reform" is now available for download.',
      type: 'session',
      time: '2 hours ago',
      read: false,
      targetView: 'sessions',
      targetId: 'ses_03'
    },
    {
      id: 'notif_02',
      title: 'Topic Proposal Approved',
      message: 'Your suggested topic "Central Bank Digital Currencies (CBDCs) and Developing Nations" was approved by Coordinators.',
      type: 'topic',
      time: '1 day ago',
      read: false,
      targetView: 'topics',
      targetId: 'top_03'
    },
    {
      id: 'notif_03',
      title: 'Academic Writing 02 Peer-Reviewed & Live',
      message: 'Research synthesis on "Climate Loss-and-Damage Restitution" has been published in the academic archive.',
      type: 'writing',
      time: '2 days ago',
      read: false,
      targetView: 'writings',
      targetId: 'wrt_02'
    },
    {
      id: 'notif_04',
      title: 'Qualitative Feedback Window Open',
      message: 'Session 02 feedback is still open. Please contribute peer analysis to help the academic research team.',
      type: 'feedback',
      time: '4 days ago',
      read: true,
      targetView: 'feedback',
      targetId: 'ses_02'
    },
    {
      id: 'notif_05',
      title: 'Welcome to Global Youth Dialogue',
      message: 'You are now an active delegate within the Qatar ISDC7 alumni dialogue network.',
      type: 'system',
      time: '1 week ago',
      read: true,
      targetView: 'community',
      targetId: null
    }
  ],

  countryReps: [
    {
      id: 'rep_qa',
      country: 'Qatar',
      countryAr: 'قطر',
      flag: '🇶🇦',
      chapterName: 'Doha Youth Chapter',
      chapterNameAr: 'فرع الدوحة الشبابي',
      repName: 'Tariq Al-Mansoor',
      repNameAr: 'طارق المنصور',
      email: 'tariq.mansoor@gyd.org',
      isdcTeam: 'Qatar National Debate Team (ISDC7 Host)',
      isdcTeamAr: 'فريق قطر الوطني للمناظرات (الدولة المستضيفة لـ ISDC7)',
      activeDebaters: 14,
      status: 'Active Chapter',
      statusAr: 'فرع معتمد ونشط',
      bio: 'ISDC7 Qatar Debater, Programme Lead. Coordinates Middle Eastern university partnerships.',
      bioAr: 'مناظر سابق في بطولة قطر ISDC7، مسؤول البرامج، ينسق الشراكات والفعاليات الجامعية في الشرق الأوسط.'
    },
    {
      id: 'rep_sg',
      country: 'Singapore',
      countryAr: 'سنغافورة',
      flag: '🇸🇬',
      chapterName: 'Singapore & ASEAN Chapter',
      chapterNameAr: 'فرع سنغافورة ورابطة آسيان',
      repName: 'Amara Chen',
      repNameAr: 'أمارا تشين',
      email: 'amara.chen@gyd.org',
      isdcTeam: 'Team Singapore (ISDC7 Grand Finalist)',
      isdcTeamAr: 'فريق سنغافورة (المتأهل للنهائي الكبير ISDC7)',
      activeDebaters: 11,
      status: 'Active Chapter',
      statusAr: 'فرع معتمد ونشط',
      bio: 'ISDC7 Finalist, Public Policy researcher. Organizes Asian regional research syndicates.',
      bioAr: 'متأهلة لنهائي ISDC7، باحثة في السياسات العامة وأخلاقيات الذكاء الاصطناعي، تنسق المجموعات البحثية في آسيا.'
    },
    {
      id: 'rep_gh',
      country: 'Ghana',
      countryAr: 'غانا',
      flag: '🇬🇭',
      chapterName: 'West Africa Youth Chapter',
      chapterNameAr: 'فرع غرب أفريقيا الشبابي',
      repName: 'Kofi Mensah',
      repNameAr: 'كوفي مينساه',
      email: 'kofi.mensah@gyd.org',
      isdcTeam: 'Team Ghana (ISDC7 Top 8)',
      isdcTeamAr: 'فريق غانا (ضمن أفضل 8 فرق في ISDC7)',
      activeDebaters: 9,
      status: 'Active Chapter',
      statusAr: 'فرع معتمد ونشط',
      bio: 'National schools debate captain. Advocates for Global South perspectives in climate dialogues.',
      bioAr: 'قائد فريق المناظرات الوطني للمدارس، ناشط ومدافع عن قضايا المناخ وحقوق دول الجنوب العالمي.'
    },
    {
      id: 'rep_gb',
      country: 'United Kingdom',
      countryAr: 'المملكة المتحدة',
      flag: '🇬🇧',
      chapterName: 'UK & European Chapter',
      chapterNameAr: 'فرع المملكة المتحدة وأوروبا',
      repName: 'Elena Rostova',
      repNameAr: 'إلينا روستوفا',
      email: 'elena.rostova@gyd.org',
      isdcTeam: 'Team England / UK Schools (ISDC7)',
      isdcTeamAr: 'فريق إنجلترا / مدارس بريطانيا (ISDC7)',
      activeDebaters: 12,
      status: 'Active Chapter',
      statusAr: 'فرع معتمد ونشط',
      bio: 'Competitive debater and youth parliament member focusing on international jurisprudence.',
      bioAr: 'مناظرة متميزة وعضوة في برلمان الشباب، متخصصة في القانون الدولي وحقوق الإنسان والتحكيم.'
    },
    {
      id: 'rep_jo',
      country: 'Jordan',
      countryAr: 'الأردن',
      flag: '🇯🇴',
      chapterName: 'Levant Youth Chapter',
      chapterNameAr: 'فرع بلاد الشام الشبابي',
      repName: 'Zaid Al-Harbi',
      repNameAr: 'زيد الحربي',
      email: 'zaid.harbi@gyd.org',
      isdcTeam: 'Team Jordan (ISDC7 Semifinalist)',
      isdcTeamAr: 'فريق الأردن (المتأهل لنصف نهائي ISDC7)',
      activeDebaters: 8,
      status: 'Active Chapter',
      statusAr: 'فرع معتمد ونشط',
      bio: 'Debater and educational reform researcher across Amman and regional academic hubs.',
      bioAr: 'مناظر وباحث مهتم بتطوير المناهج التعليمية والتنمية المستدامة في عمان والمراكز البحثية.'
    },
    {
      id: 'rep_mx',
      country: 'Mexico',
      countryAr: 'المكسيك',
      flag: '🇲🇽',
      chapterName: 'Latin America Chapter',
      chapterNameAr: 'فرع أمريكا اللاتينية الشبابي',
      repName: 'Sofia Morales',
      repNameAr: 'صوفيا موراليس',
      email: 'sofia.morales@gyd.org',
      isdcTeam: 'Team Mexico (ISDC7 Delegation)',
      isdcTeamAr: 'فريق المكسيك (وفد بطولة ISDC7)',
      activeDebaters: 7,
      status: 'Active Chapter',
      statusAr: 'فرع معتمد ونشط',
      bio: 'Student diplomat and speaker on Latin American trade and youth democratic participation.',
      bioAr: 'دبلوماسية شابة ومناظرة متخصصة في السياسات التجارية بأمريكا اللاتينية والمشاركة الشبابية.'
    },
    {
      id: 'rep_pk',
      country: 'Pakistan',
      countryAr: 'باكستان',
      flag: '🇵🇰',
      chapterName: 'South Asia Chapter',
      chapterNameAr: 'فرع جنوب آسيا الشبابي',
      repName: 'Farhan Nadeem',
      repNameAr: 'فرحان نديم',
      email: 'farhan.n@outlook.com',
      isdcTeam: 'Team Pakistan (ISDC7)',
      isdcTeamAr: 'فريق باكستان (بطولة ISDC7)',
      activeDebaters: 10,
      status: 'Prospective Chapter',
      statusAr: 'فرع قيد الاعتماد',
      bio: 'National schools championship parliamentary debater building cross-border intellectual ties.',
      bioAr: 'مناظر برلماني من البطولة الوطنية للمدارس، يعمل على تعزيز الروابط الفكرية الشبابية عبر الحدود.'
    },
    {
      id: 'rep_za',
      country: 'South Africa',
      countryAr: 'جنوب أفريقيا',
      flag: '🇿🇦',
      chapterName: 'Southern Africa Chapter',
      chapterNameAr: 'فرع جنوب القارة الأفريقية',
      repName: 'Thabo Ndlovu',
      repNameAr: 'ثابو ندلوفو',
      email: 'thabo.n@gyd.org',
      isdcTeam: 'Team South Africa (ISDC7)',
      isdcTeamAr: 'فريق جنوب أفريقيا (بطولة ISDC7)',
      activeDebaters: 6,
      status: 'Active Chapter',
      statusAr: 'فرع معتمد ونشط',
      bio: 'Debater in Johannesburg passionate about youth economic rights and post-colonial law.',
      bioAr: 'مناظر من جوهانسبرغ مهتم بالحقوق الاقتصادية للشباب والقانون الدولي ودراسات ما بعد الاستعمار.'
    }
  ],

  mediaKits: [
    {
      id: 'mk_01',
      title: 'Instagram Carousel — Motion Breakdown #03',
      type: 'instagram_caption',
      category: 'Session Promo',
      headline: 'Should the UN Security Council Abolish the Permanent Member Veto?',
      copyText: `🌍 Can a 1945 multilateral architecture solve 2026 global security crises?

In Session #03 of Global Youth Dialogue, debaters from 14+ countries go head-to-head on the future of the UN Security Council.

🏛️ MOTION:
"This House Would Abolish the Permanent Member Veto in the United Nations Security Council."

Key Debater Clash Points:
1️⃣ Sovereignty vs. Realpolitik: Does the veto prevent World War III or guarantee paralysis?
2️⃣ Global South Representation: Why does Africa have 0 permanent veto seats?
3️⃣ Regional Coalitions: The G4 and Uniting for Consensus models.

📅 Date: Saturday, 18 October 2024
📍 Live on Google Meet | Members Portal Open
🔗 Register & read the briefing pack at: globalyouthdialogue.org

#GlobalYouthDialogue #ISDC7 #YouthDebate #UNSC #QatarDebate #InternationalAffairs #DebateSociety`,
      tags: ['Instagram', 'Debate Promotion', 'UNSC']
    },
    {
      id: 'mk_02',
      title: 'Debater Quote Highlight Card — Kofi Mensah (Ghana)',
      type: 'quote_card',
      category: 'Speaker Highlight',
      headline: 'Quote on Climate Justice and Historical Responsibility',
      authorName: 'Kofi Mensah',
      authorRole: 'Affirmative Speaker (Ghana)',
      authorCountry: 'Ghana',
      authorFlag: '🇬🇭',
      quoteText: '"International climate governance cannot demand equal mitigation pledges from unequal historical polluters without structural restitution."',
      copyText: `"International climate governance cannot demand equal mitigation pledges from unequal historical polluters without structural restitution."
— Kofi Mensah (Ghana) in GYD Session #02 on Climate Restitution

Read the full peer-reviewed academic summary paper in the Global Youth Dialogue library:
https://global-youth-dialogue.vercel.app

#ClimateJustice #GlobalYouthDialogue #DebateQuotes #ISDC7 #YouthInAction`,
      tags: ['Quote Card', 'Social Sharing', 'Session 02']
    },
    {
      id: 'mk_03',
      title: 'Official Press Release — Launch of Global Youth Dialogue',
      type: 'press_release',
      category: 'Media Announcement',
      headline: 'ISDC7 Qatar Debaters Launch Independent International Youth Platform',
      copyText: `FOR IMMEDIATE RELEASE

ISDC7 ALUMNI DEBATERS LAUNCH 'GLOBAL YOUTH DIALOGUE' TO TACKLE URGENT INTERNATIONAL ISSUES

DOHA, QATAR — Debaters who met through the 7th Qatar International Schools Debate Championship (ISDC7) have announced the founding of the Global Youth Dialogue (GYD), an independent youth-led international debate and academic research platform.

Recognizing that regional tournaments often conclude before participants can deeply analyze systemic global crises, founding debaters from Qatar, Singapore, Ghana, Jordan, Mexico, and the United Kingdom created GYD to facilitate regular bi-weekly structured deliberations.

Every debate is documented, peer-reviewed, and synthesized into open-access academic publications authored entirely by secondary and collegiate debaters.

"Our goal is not just trophies; it is turning competitive forensics into rigorous policy solutions and building cross-cultural bridges," said Tariq Al-Mansoor, founding coordinator from Qatar.

Delegates and school debate societies are invited to join at https://global-youth-dialogue.vercel.app

Media Contact: secretariat@gyd.org`,
      tags: ['Press Release', 'Institutional', 'ISDC7']
    },
    {
      id: 'mk_04',
      title: 'WhatsApp & Telegram Community Broadcast',
      type: 'chat_broadcast',
      category: 'Community Broadcast',
      headline: 'Weekly Debate Reminder for National WhatsApp Groups',
      copyText: `👋 Salam & Hello Debaters!

Reminder for our next Global Youth Dialogue session:

📌 Topic: Multilateral Diplomacy & UNSC Reform
🗓️ Date: Saturday, 18 Oct 2024
⏰ Time: 16:00 Doha AST | 13:00 London UTC | 21:00 Singapore SGT
💻 Google Meet: Link active 15 mins before start in portal

📄 Briefing dossier has been uploaded. If you wish to join the floor debate or submit qualitative feedback, please log in to your Member Portal:
https://global-youth-dialogue.vercel.app

Connect. Challenge. Create. 🌐✨`,
      tags: ['WhatsApp', 'Broadcast', 'Internal Network']
    }
  ]
};

// Data Management Service
class DataService {
  constructor() {
    this.db = this.loadDatabase();
  }

  loadDatabase() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Phase 2 backward compatibility - ensure new collections exist
        if (!parsed.notifications || parsed.notifications.length === 0) {
          parsed.notifications = INITIAL_DATABASE.notifications;
        }
        if (!parsed.countryReps || parsed.countryReps.length === 0) {
          parsed.countryReps = INITIAL_DATABASE.countryReps;
        }
        if (!parsed.mediaKits || parsed.mediaKits.length === 0) {
          parsed.mediaKits = INITIAL_DATABASE.mediaKits;
        }
        // Auto-merge latest Arabic translations into existing cached databases
        if (parsed.categories) {
          parsed.categories.forEach(c => {
            const initC = INITIAL_DATABASE.categories.find(ic => ic.id === c.id);
            if (initC && initC.descriptionAr && !c.descriptionAr) c.descriptionAr = initC.descriptionAr;
            if (initC && initC.nameAr && !c.nameAr) c.nameAr = initC.nameAr;
          });
        }
        if (parsed.sessions) {
          parsed.sessions.forEach(s => {
            const initS = INITIAL_DATABASE.sessions.find(is => is.id === s.id);
            if (initS && initS.titleAr && !s.titleAr) s.titleAr = initS.titleAr;
            if (initS && initS.formatAr && !s.formatAr) s.formatAr = initS.formatAr;
            if (initS && initS.durationAr && !s.durationAr) s.durationAr = initS.durationAr;
            if (initS && initS.categoryNameAr && !s.categoryNameAr) s.categoryNameAr = initS.categoryNameAr;
            if (initS && initS.descriptionAr && !s.descriptionAr) s.descriptionAr = initS.descriptionAr;
          });
        }
        if (parsed.countryReps) {
          parsed.countryReps.forEach(r => {
            const initR = INITIAL_DATABASE.countryReps.find(ir => ir.id === r.id);
            if (initR && initR.chapterNameAr && !r.chapterNameAr) r.chapterNameAr = initR.chapterNameAr;
            if (initR && initR.repNameAr && !r.repNameAr) r.repNameAr = initR.repNameAr;
            if (initR && initR.isdcTeamAr && !r.isdcTeamAr) r.isdcTeamAr = initR.isdcTeamAr;
            if (initR && initR.bioAr && !r.bioAr) r.bioAr = initR.bioAr;
          });
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial seed data.', e);
    }
    this.saveDatabase(INITIAL_DATABASE);
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }

  saveDatabase(data = this.db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.db = data;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.db = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    this.saveDatabase();
    return this.db;
  }

  // Getters
  getUsers() { return this.db.users; }
  getCategories() { return this.db.categories; }
  getTopics() { return this.db.topics; }
  getSessions() { return this.db.sessions; }
  getWritings() { return this.db.writings; }
  getFeedback() { return this.db.feedback; }
  getApplications() { return this.db.applications; }
  getAnnouncements() { return this.db.announcements; }

  // Topic Operations
  addTopic(topicData) {
    const newTopic = {
      id: 'top_' + Date.now().toString(36),
      title: topicData.title,
      category: topicData.category,
      categoryName: topicData.categoryName || this.getCategoryName(topicData.category),
      description: topicData.description || '',
      motion: topicData.motion || '',
      status: topicData.status || 'Proposed',
      proposedBy: topicData.proposedBy || 'Community Member',
      proposedById: topicData.proposedById || null,
      countryPerspective: topicData.countryPerspective || '',
      sources: topicData.sources || '',
      researchNotes: topicData.researchNotes || '',
      assignedSpeaker: topicData.assignedSpeaker || 'Unassigned',
      assignedModerator: topicData.assignedModerator || 'Unassigned',
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.db.topics.unshift(newTopic);
    this.saveDatabase();
    return newTopic;
  }

  updateTopicStatus(topicId, newStatus, extra = {}) {
    const topic = this.db.topics.find(t => t.id === topicId);
    if (topic) {
      topic.status = newStatus;
      if (extra.assignedSpeaker) topic.assignedSpeaker = extra.assignedSpeaker;
      if (extra.assignedModerator) topic.assignedModerator = extra.assignedModerator;
      if (extra.researchNotes) topic.researchNotes = extra.researchNotes;
      this.saveDatabase();
      return topic;
    }
    return null;
  }

  // Session Operations
  createSession(sessionData) {
    const sessionNum = this.db.sessions.length + 1;
    const newSession = {
      id: 'ses_' + Date.now().toString(36),
      sessionNumber: sessionNum,
      title: sessionData.title,
      topicId: sessionData.topicId || '',
      category: sessionData.category,
      categoryName: this.getCategoryName(sessionData.category),
      date: sessionData.date,
      time: sessionData.time,
      timezone: sessionData.timezone || 'GMT+3 (Qatar Standard Time)',
      format: sessionData.format || 'Global Dialogue',
      duration: sessionData.duration || '90 mins',
      status: 'Upcoming',
      moderator: sessionData.moderator || { name: 'TBD', country: 'TBD', flag: '🌐' },
      speakers: sessionData.speakers || [],
      countriesRepresented: sessionData.countriesRepresented || ['Qatar'],
      description: sessionData.description || '',
      structure: sessionData.structure || [
        { phase: '01', title: 'Context & Ground Rules', duration: '10 min', lead: 'Moderator' },
        { phase: '02', title: 'Opening Presentations', duration: '20 min', lead: 'Speakers' },
        { phase: '03', title: 'Structured Dialogue & Cross-Rebuttals', duration: '25 min', lead: 'Debaters' },
        { phase: '04', title: 'Open Member Interventions', duration: '25 min', lead: 'All Members' },
        { phase: '05', title: 'Synthesis & Adjournment', duration: '10 min', lead: 'Panel' }
      ],
      prepMaterials: sessionData.prepMaterials || [{ title: 'Discussion Motion Guide', url: '#' }],
      meetingLink: sessionData.meetingLink || 'https://meet.google.com/gyd-private-session',
      poster: 'session_poster',
      recordingUrl: sessionData.recordingUrl || '',
      isRecordingPrivate: true,
      hasSummary: false,
      summaryId: null
    };

    // If linked to a topic, mark topic as Scheduled
    if (sessionData.topicId) {
      this.updateTopicStatus(sessionData.topicId, 'Scheduled');
    }

    this.db.sessions.unshift(newSession);
    this.saveDatabase();
    return newSession;
  }

  updateSessionRecording(sessionId, recordingUrl) {
    const session = this.db.sessions.find(s => s.id === sessionId);
    if (session) {
      session.recordingUrl = recordingUrl;
      session.status = 'Completed';
      this.saveDatabase();
      return session;
    }
    return null;
  }

  // Feedback Operations
  submitFeedback(feedbackData) {
    const newFeedback = {
      id: 'fdb_' + Date.now().toString(36),
      sessionId: feedbackData.sessionId,
      sessionTitle: feedbackData.sessionTitle,
      memberId: feedbackData.memberId,
      memberName: feedbackData.memberName,
      memberCountry: feedbackData.memberCountry,
      rating: feedbackData.rating || 'Good',
      strengths: feedbackData.strengths || '',
      missingPoints: feedbackData.missingPoints || '',
      evidenceFeedback: feedbackData.evidenceFeedback || '',
      overlookedPerspectives: feedbackData.overlookedPerspectives || '',
      futureIdeas: feedbackData.futureIdeas || '',
      comments: feedbackData.comments || '',
      date: new Date().toISOString().split('T')[0]
    };
    this.db.feedback.unshift(newFeedback);
    this.saveDatabase();
    return newFeedback;
  }

  // Academic Writings Operations
  createWriting(writingData) {
    const newWriting = {
      id: 'wri_' + Date.now().toString(36),
      sessionId: writingData.sessionId || null,
      sessionNumber: writingData.sessionNumber || null,
      title: writingData.title,
      category: writingData.category,
      categoryName: this.getCategoryName(writingData.category),
      author: writingData.author || 'GYD Research Working Group',
      authorRole: writingData.authorRole || 'Coordinating Researcher',
      publicationDate: new Date().toISOString().split('T')[0],
      status: writingData.status || 'Published', // Draft, Under Review, Published
      intro: writingData.intro,
      background: writingData.background,
      keyArguments: Array.isArray(writingData.keyArguments) ? writingData.keyArguments : [writingData.keyArguments],
      counterarguments: Array.isArray(writingData.counterarguments) ? writingData.counterarguments : [writingData.counterarguments],
      evidence: writingData.evidence,
      insights: writingData.insights,
      conclusion: writingData.conclusion,
      furtherQuestions: Array.isArray(writingData.furtherQuestions) ? writingData.furtherQuestions : [writingData.furtherQuestions],
      sources: writingData.sources
    };

    if (writingData.sessionId) {
      const session = this.db.sessions.find(s => s.id === writingData.sessionId);
      if (session) {
        session.hasSummary = true;
        session.summaryId = newWriting.id;
      }
    }

    this.db.writings.unshift(newWriting);
    this.saveDatabase();
    return newWriting;
  }

  // Applications Operations
  submitApplication(appData) {
    const newApp = {
      id: 'app_' + Date.now().toString(36),
      name: appData.name,
      email: appData.email,
      country: appData.country,
      flag: appData.flag || '🌐',
      interests: appData.interests || [],
      debateExperience: appData.debateExperience || '',
      motivation: appData.motivation || '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    this.db.applications.unshift(newApp);
    this.saveDatabase();
    return newApp;
  }

  approveApplication(appId) {
    const app = this.db.applications.find(a => a.id === appId);
    if (!app) return null;

    app.status = 'Approved';

    // Create user account from application
    const newUser = {
      id: 'usr_' + Date.now().toString(36),
      name: app.name,
      email: app.email,
      password: 'password123',
      role: 'Member',
      country: app.country,
      flag: app.flag,
      bio: app.motivation.substring(0, 120),
      interests: app.interests,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    this.db.users.push(newUser);
    this.saveDatabase();
    return newUser;
  }

  rejectApplication(appId) {
    const app = this.db.applications.find(a => a.id === appId);
    if (app) {
      app.status = 'Rejected';
      this.saveDatabase();
      return app;
    }
    return null;
  }

  // Announcements
  addAnnouncement(annData) {
    const newAnn = {
      id: 'ann_' + Date.now().toString(36),
      title: annData.title,
      content: annData.content,
      category: annData.category || 'General',
      priority: annData.priority || 'Normal',
      author: annData.author || 'GYD Secretariat',
      date: new Date().toISOString().split('T')[0]
    };
    this.db.announcements.unshift(newAnn);
    this.saveDatabase();
    return newAnn;
  }

  // Helper
  getCategoryName(catId) {
    const cat = this.db.categories.find(c => c.id === catId);
    return cat ? cat.name : catId;
  }

  // =========================================================================
  // PHASE 2 METHODS: Notifications, Country Chapters, Media & PR, Search, Analytics
  // =========================================================================

  // Notifications
  getNotifications() {
    return this.db.notifications || [];
  }

  getUnreadNotificationsCount() {
    return (this.db.notifications || []).filter(n => !n.read).length;
  }

  markNotificationRead(notifId) {
    const notif = (this.db.notifications || []).find(n => n.id === notifId);
    if (notif) {
      notif.read = true;
      this.saveDatabase();
      return notif;
    }
    return null;
  }

  markAllNotificationsRead() {
    (this.db.notifications || []).forEach(n => { n.read = true; });
    this.saveDatabase();
    return true;
  }

  addNotification(notifData) {
    if (!this.db.notifications) this.db.notifications = [];
    const newNotif = {
      id: 'notif_' + Date.now().toString(36),
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'system',
      time: 'Just now',
      read: false,
      targetView: notifData.targetView || null,
      targetId: notifData.targetId || null
    };
    this.db.notifications.unshift(newNotif);
    this.saveDatabase();
    return newNotif;
  }

  // Country Representatives
  getCountryReps() {
    return this.db.countryReps || [];
  }

  addCountryRep(repData) {
    if (!this.db.countryReps) this.db.countryReps = [];
    const newRep = {
      id: 'rep_' + Date.now().toString(36),
      country: repData.country,
      countryAr: repData.countryAr || repData.country,
      flag: repData.flag || '🌐',
      chapterName: repData.chapterName || (repData.country + ' Chapter'),
      repName: repData.repName,
      email: repData.email,
      isdcTeam: repData.isdcTeam || 'ISDC7 Delegate',
      activeDebaters: parseInt(repData.activeDebaters) || 1,
      status: repData.status || 'Active Chapter',
      bio: repData.bio || ''
    };
    this.db.countryReps.push(newRep);
    this.saveDatabase();
    return newRep;
  }

  // Media Kits
  getMediaKits() {
    return this.db.mediaKits || [];
  }

  createMediaKit(kitData) {
    if (!this.db.mediaKits) this.db.mediaKits = [];
    const newKit = {
      id: 'mk_' + Date.now().toString(36),
      title: kitData.title,
      type: kitData.type || 'instagram_caption',
      category: kitData.category || 'General',
      headline: kitData.headline,
      copyText: kitData.copyText,
      tags: kitData.tags || ['Social'],
      date: new Date().toISOString().split('T')[0]
    };
    this.db.mediaKits.unshift(newKit);
    this.saveDatabase();
    return newKit;
  }

  // Universal Search
  searchAll(query) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results = [];

    // Search Sessions
    (this.db.sessions || []).forEach(s => {
      const match = (s.title && s.title.toLowerCase().includes(q)) ||
                    (s.motion && s.motion.toLowerCase().includes(q)) ||
                    (s.category && s.category.toLowerCase().includes(q));
      if (match) {
        results.push({
          type: 'session',
          typeLabel: 'Session',
          title: s.title,
          subtitle: s.motion ? `Motion: ${s.motion.substring(0, 75)}...` : (s.date + ' • ' + s.status),
          date: s.date,
          targetView: 'sessions',
          id: s.id
        });
      }
    });

    // Search Academic Writings
    (this.db.writings || []).forEach(w => {
      const match = (w.title && w.title.toLowerCase().includes(q)) ||
                    (w.motion && w.motion.toLowerCase().includes(q)) ||
                    (w.executiveSummary && w.executiveSummary.toLowerCase().includes(q));
      if (match) {
        results.push({
          type: 'writing',
          typeLabel: 'Academic Paper',
          title: w.title,
          subtitle: `By ${w.authorName || 'Research Fellow'} • ${w.category}`,
          date: w.date,
          targetView: 'writings',
          id: w.id
        });
      }
    });

    // Search Topics
    (this.db.topics || []).forEach(t => {
      const match = (t.title && t.title.toLowerCase().includes(q)) ||
                    (t.rationale && t.rationale.toLowerCase().includes(q));
      if (match) {
        results.push({
          type: 'topic',
          typeLabel: 'Topic Proposal',
          title: t.title,
          subtitle: `Status: ${t.status} • Category: ${t.category}`,
          date: t.submissionDate,
          targetView: 'topics',
          id: t.id
        });
      }
    });

    // Search Members
    (this.db.users || []).forEach(u => {
      const match = (u.name && u.name.toLowerCase().includes(q)) ||
                    (u.country && u.country.toLowerCase().includes(q)) ||
                    (u.bio && u.bio.toLowerCase().includes(q));
      if (match) {
        results.push({
          type: 'member',
          typeLabel: 'Member',
          title: `${u.flag || '🌐'} ${u.name}`,
          subtitle: `${u.role} from ${u.country}`,
          date: u.joinedDate,
          targetView: 'community',
          id: u.id
        });
      }
    });

    return results;
  }

  // Member Analytics & Journey
  getUserAnalytics(userId) {
    const user = (this.db.users || []).find(u => u.id === userId) || {};
    const feedbackGiven = (this.db.feedback || []).filter(f => f.memberId === userId).length;
    const topicsProposed = (this.db.topics || []).filter(t => t.submittedBy === user.name).length;
    const writingsAuthored = (this.db.writings || []).filter(w => w.authorName === user.name).length;
    
    // Calculate sessions attended / spoken
    const sessionsConducted = (this.db.sessions || []).filter(s => s.status === 'Completed').length;
    const attendedCount = Math.max(sessionsConducted, 2);
    const spokenCount = user.role === 'Speaker' ? 2 : (user.role === 'Moderator' ? 3 : (user.role === 'Coordinator' ? 4 : 1));

    const badges = [
      {
        id: 'isdc7_veteran',
        title: 'Qatar ISDC7 Founding Delegate',
        desc: 'Participated in the Doha 7th International Schools Debate Championship',
        icon: 'award',
        unlocked: true,
        progress: '100%'
      },
      {
        id: 'distinguished_speaker',
        title: 'Distinguished Speaker',
        desc: 'Delivered principal constructive or rebuttal speeches in 3+ international sessions',
        icon: 'mic',
        unlocked: spokenCount >= 3,
        progress: `${Math.min(100, Math.round((spokenCount / 3) * 100))}%`
      },
      {
        id: 'academic_fellow',
        title: 'Academic Research Contributor',
        desc: 'Authored or contributed to peer-reviewed youth policy synthesis papers',
        icon: 'book',
        unlocked: writingsAuthored >= 1 || user.role === 'Coordinator',
        progress: writingsAuthored >= 1 || user.role === 'Coordinator' ? '100%' : '50%'
      },
      {
        id: 'agenda_setter',
        title: 'Dialogue Agenda Setter',
        desc: 'Suggested approved debate motions tackling high-priority global governance issues',
        icon: 'lightbulb',
        unlocked: topicsProposed >= 1,
        progress: topicsProposed >= 1 ? '100%' : '33%'
      },
      {
        id: 'peer_reviewer',
        title: 'Constructive Peer Reviewer',
        desc: 'Provided structured qualitative feedback across completed dialogue rounds',
        icon: 'pen',
        unlocked: feedbackGiven >= 1,
        progress: feedbackGiven >= 1 ? '100%' : '20%'
      }
    ];

    return {
      sessionsAttended: attendedCount,
      debatesSpoken: spokenCount,
      writingsAuthored: writingsAuthored + (user.role === 'Coordinator' ? 2 : 0),
      topicsProposed: topicsProposed + (user.role === 'Coordinator' ? 3 : 1),
      feedbackSubmitted: feedbackGiven + 1,
      engagementScore: 92,
      badges
    };
  }

  // =========================================================================
  // PHASE 3 METHODS: Community Topic Ballot & Certificate Generator
  // =========================================================================

  upvoteTopic(topicId, userId = 'usr_mem_1') {
    const topic = this.db.topics.find(t => t.id === topicId);
    if (!topic) return null;
    if (!topic.upvotedBy) topic.upvotedBy = [];
    if (!topic.upvotes) topic.upvotes = 12;

    const idx = topic.upvotedBy.indexOf(userId);
    let hasUpvoted = false;
    if (idx > -1) {
      topic.upvotedBy.splice(idx, 1);
      topic.upvotes = Math.max(0, topic.upvotes - 1);
      hasUpvoted = false;
    } else {
      topic.upvotedBy.push(userId);
      topic.upvotes = (topic.upvotes || 0) + 1;
      hasUpvoted = true;
    }
    this.saveDatabase();
    return { upvotes: topic.upvotes, hasUpvoted };
  }

  getTopVotedTopics() {
    return [...this.db.topics].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0)).slice(0, 5);
  }

  getCertificateData(userId) {
    const user = this.db.users.find(u => u.id === userId) || this.db.users.find(u => u.role === 'Speaker') || this.db.users[0];
    return {
      recipientName: user.name,
      country: user.country,
      flag: user.flag || '🌐',
      role: user.role,
      issueDate: 'October 2024',
      certificateNumber: 'GYD-ISDC7-' + (user.id || 'MEM').replace('usr_', '').toUpperCase(),
      motions: [
        'Mandating AI Literacy and Ethical AI Utilization as a Compulsory Core Subject in Secondary Schools',
        'Historic Carbon Emitters Duty to Fund Climate Infrastructure and Adaptation in Vulnerable Nations'
      ],
      coordinators: [
        { name: 'Tariq Al-Mansoor', title: 'Founding Lead Coordinator (Qatar)', origin: 'ISDC7 Qatar' },
        { name: 'Amara Chen', title: 'Academic Research Director (Singapore)', origin: 'ISDC7 Singapore' }
      ]
    };
  }
}

// Global data store instance
window.GYD_DATA = new DataService();
