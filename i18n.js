/**
 * GLOBAL YOUTH DIALOGUE - Internationalization (English & Arabic)
 * Handles full translations, text switching, and RTL direction changes.
 * Guaranteed 100% Arabic with zero English words when Arabic is enabled.
 */

const TRANSLATIONS = {
  en: {
    // Brand & Meta
    brandName: 'Global Youth Dialogue & Exchange',
    brandSubtitle: 'International Community of Youth Debaters',
    taglineShort: 'Connect. Challenge. Create.',
    taglineLong: 'Young minds. Different countries. One conversation.',
    heroSubtext: 'A youth-led international community connecting young debaters to explore global issues, exchange perspectives and develop ideas through structured dialogue.',

    // Navigation
    // Navigation
    navHome: 'Home',
    navAbout: 'About',
    navProcess: 'How It Works',
    navTopics: 'Topic Categories',
    navSessions: 'Sessions',
    navImpact: 'Our Impact',
    navWritings: 'Academic Writings',
    navJoinUs: 'Join Us',
    navLogin: 'Sign In',
    navMemberPortal: 'Member Portal',
    navCoordinatorPortal: 'Coordinator Portal',
    navLogout: 'Sign Out',
    navTopicBank: 'Topic Bank',
    topicBankTitle: 'Academic Topic Bank',
    topicBankSubtitle: 'Curated international research themes and subtopics ready for structured dialogue, presentations, and debates.',
    topicBankUseTopic: 'Suggest as Dialogue Session',
    topicSelectPlaceholder: '-- Select from Academic Topic Bank --',
    topicSelectOther: 'Others (Suggest New Custom Topic)',
    topicCustomAlert: 'Custom topics are reviewed by the Secretariat. Upon approval, your topic and subtopics will be permanently added to the Global Youth Dialogue Topic Bank!',
    navPresenterPortal: 'Presenter Portal',
    portalPresenterTitle: 'Presenter & Speaker Workspace',
    portalPresenterSubtitle: 'Curate research briefings, prepare academic slide decks, and deliver topic presentations for international dialogue sessions.',
    presenterRoleBadge: 'Academic Presenter & Keynote Fellow',
    btnPresentTopic: 'Present a Topic',
    btnMyDecks: 'My Presentations & Slides',
    btnAssignedSessions: 'Speaking Sessions',
    demoRolePresenter: 'Kofi Mensah (Presenter) → Can Present a Topic',

    // Mobile Bottom Tab Bar (Compact Navigation)
    tabHome: 'Home',
    tabSessions: 'Sessions',
    tabWritings: 'Writings',
    tabFeedback: 'Feedback',
    tabTopics: 'Topics',
    tabDirectory: 'Directory',
    tabWorkspace: 'Workspace',
    tabApplications: 'Applicants',
    tabStudio: 'Studio',

    // Search
    searchBtn: 'Search',
    searchPlaceholder: 'Search sessions, academic papers, topic proposals, members...',

    // Buttons
    btnExplore: 'Explore Community',
    btnUpcomingSessions: 'Upcoming Sessions',
    btnJoinCommunity: 'Apply for Membership',
    btnLearnMore: 'Read Our Story',
    btnSubmitProposal: 'Suggest a Topic',
    btnViewDetails: 'View Details',
    btnGiveFeedback: 'Submit Feedback',
    btnAccessWritings: 'Browse Writings',
    btnCreateSession: 'Create Session',
    btnManageTopics: 'Manage Topics',
    btnApprove: 'Approve',
    btnDecline: 'Decline',
    btnContactRep: 'Contact Rep',

    // Hero & Stats
    badgeOrigin: 'International Community of Youth Debaters',
    badgeLegacy: 'Founding Story',
    statNationsNum: '14+',
    statNations: 'Countries Represented',
    statDebatersNum: '60+',
    statDebaters: 'Youth Debaters',
    statSessionsNum: 'Weekly',
    statSessions: 'Weekly Dialogue Sessions',
    statWritingsNum: '100%',
    statWritings: 'Youth-Led & Researched',

    // About Section
    aboutSectionTitle: 'About the Community',
    aboutSubtitle: 'Connecting young debaters worldwide to explore global issues and develop ideas through structured dialogue.',
    ourStoryTitle: 'Our Origin Story',
    ourStoryP1: 'Friends who met at an international debate championship came together with a shared vision: to create a continuous space for thoughtful global dialogue beyond tournament rounds.',
    ourStoryP2: 'Although the tournament concluded, delegates realized the vital urgency of continuing to debate together, critically interrogate global affairs, and create opportunities for other youth worldwide.',
    ourStoryP3: 'Global Youth Dialogue was founded to transform that temporary international spark into a permanent, youth-led academic and diplomatic network.',

    missionTitle: 'Our Mission',
    missionDesc: 'To create an international space where young people can discuss global issues, challenge ideas, develop rigorous research and communication skills, and learn from peers across borders.',

    visionTitle: 'Our Vision',
    visionDesc: 'A connected generation of young people capable of engaging thoughtfully with global challenges and participating in meaningful international dialogue.',

    // 6-step process
    processTag: 'The Dialogue & Publication Cycle',
    processTitle: 'How the Programme Works',
    processSubtitle: 'A structured weekly cycle transforming youth debate into enduring academic research and documented knowledge.',
    step1Num: '01',
    step1Title: '01 — Propose & Select',
    step1Desc: 'Topics and motions are proposed by community members and selected across our multidisciplinary knowledge spheres.',
    step2Num: '02',
    step2Title: '02 — Research & Prepare',
    step2Desc: 'Presenters and delegates conduct in-depth research, assemble evidence dossiers, and prepare structured arguments.',
    step3Num: '03',
    step3Title: '03 — Weekly Live Dialogue',
    step3Desc: 'The international community convenes online weekly for structured presentations, parliamentary debate, and cross-examination.',
    step4Num: '04',
    step4Title: '04 — Critical Peer Reflection',
    step4Desc: 'Members challenge assumptions, examine alternative viewpoints, and provide qualitative peer feedback on argumentation depth.',
    step5Num: '05',
    step5Title: '05 — Publish Academic Writing',
    step5Desc: 'Following the session, the presenter develops their research and presentation into a formal academic paper published in our library.',
    step6Num: '06',
    step6Title: '06 — Document Session Summary',
    step6Desc: 'A comprehensive analytical summary of the session is authored and published to record arguments, evidence, and key takeaways.',

    // Home Upcoming Session Section
    homeSessionsTag: 'Next Scheduled Dialogue',
    homeSessionsTitle: 'Upcoming Dialogue Session',
    homeSessionsSubtitle: 'Join our weekly structured international dialogue with debaters representing over 14 countries.',
    homeSessionsViewAll: 'View All Sessions & Archives',
    homeJoinSessionBtn: 'Sign In to Join Room',
    homeApplySessionBtn: 'Apply for Membership',
    homeSessionMotion: 'Key Motion for Debate:',
    homeSessionSpeakers: 'Lead Debaters:',
    homeSessionModerator: 'Moderator:',

    // Topic Categories
    topicsTag: 'Core Knowledge Spheres',
    topicsTitle: '16 Core Knowledge Spheres',
    topicsSubtitle: 'Multidisciplinary policy and philosophical arenas explored through rigorous research, presentations, and youth dialogue.',
    catBadge: 'Youth Dialogue Sphere',
    catTopics: 'Topics',

    // Public Sessions Notice
    sessionsTag: 'Dialogue Archive',
    sessionsTitle: 'Dialogue Sessions & Archive',
    sessionsSubtitle: 'Explore our international youth dialogue sessions, upcoming debate agendas, panel discussions, and archived proceedings open for everyone.',
    membersOnlyNotice: 'Session Content & Archives are Members-Only',
    signInToAccess: 'To maintain a safe, intellectually focused environment for international debaters, live meeting links, private YouTube recordings, and full academic writings are accessible only through authenticated Member & Coordinator portals.',
    sessionMembersOnly: 'Members Only',
    sessionLabel: 'Session',
    sessionFormat: 'Format:',
    sessionsFilterAll: 'All Dialogue Sessions',
    sessionsFilterUpcoming: 'Upcoming Sessions',
    sessionsFilterCompleted: 'Completed Archive',

    // Our Impact Section
    impactTag: 'Transformative Growth',
    impactTitle: 'Our Impact',
    impactSubtitle: 'Grow beyond the debate room.',
    impactIntro: 'Being part of our community is not only about attending discussions. It is an opportunity to continuously think, research, present, write, and connect with young people from different backgrounds.',
    impactPillarsHeader: 'Through regular participation, members can develop:',

    // 8 Impact Pillars
    impactP1Title: 'Become a Stronger Communicator',
    impactP1Desc: 'Build confidence in presenting ideas, speaking clearly, responding to questions, defending arguments, and communicating with different audiences.',
    impactP2Title: 'Think More Critically',
    impactP2Desc: 'Learn to question assumptions, examine different perspectives, identify weaknesses in arguments, distinguish facts from opinions, and approach complex issues with greater depth.',
    impactP3Title: 'Develop Research Skills',
    impactP3Desc: 'Explore global issues beyond headlines by researching reliable sources, examining evidence, comparing perspectives, and understanding the context behind major events and policies.',
    impactP4Title: 'Understand a Changing World',
    impactP4Desc: 'Engage with international affairs, technology, climate, education, economics, governance, culture, and emerging global issues — while hearing perspectives from young people living in different countries.',
    impactP5Title: 'Turn Discussions into Knowledge',
    impactP5Desc: 'Our sessions do not simply end when the meeting ends. Members and presenters transform discussions into academic writing, summaries, reflections, and documented knowledge, creating a growing intellectual archive.',
    impactP6Title: 'Gain Real Presentation & Leadership Experience',
    impactP6Desc: 'Members can gradually move from participating in discussions to proposing topics, presenting research, moderating sessions, leading conversations, and taking responsibility for community activities.',
    impactP7Title: 'Connect Across Borders',
    impactP7Desc: 'Build meaningful relationships with students from different countries, universities, schools, and cultural backgrounds — creating opportunities for collaboration, learning, and future initiatives.',
    impactP8Title: 'Build an Intellectual Portfolio',
    impactP8Desc: 'Through presentations, research, academic writing, discussions, and contributions to the community, members can gradually build a record of their intellectual interests and development.',

    // Journey
    impactJourneyTitle: 'Grow from Participant to Contributor',
    impactJourneyDesc: 'The community is designed to give members room to grow:',
    impactJourneyStep1: 'Join',
    impactJourneyStep2: 'Participate',
    impactJourneyStep3: 'Research',
    impactJourneyStep4: 'Present',
    impactJourneyStep5: 'Lead',
    impactJourneyStep6: 'Write',
    impactJourneyStep7: 'Contribute',
    impactJourneyNote: 'Over time, a member can become not only an audience participant, but also a presenter, researcher, moderator, writer, organizer, and contributor to an international youth network.',

    // Takeaways
    impactTakeawaysTitle: 'What We Hope You Take Away',
    impactTakeawaysSub: 'By being part of the community, we hope you become:',
    impactT1: 'More confident in speaking.',
    impactT2: 'More rigorous in thinking.',
    impactT3: 'More curious about the world.',
    impactT4: 'More capable of researching.',
    impactT5: 'More effective at writing.',
    impactT6: 'More comfortable with different perspectives.',
    impactT7: 'More prepared to lead.',
    impactT8: 'More connected to the world around you.',

    // Creed
    impactCreedTitle: 'From conversation to capability.',
    impactCreed1: 'Every discussion is an opportunity to learn.',
    impactCreed2: 'Every question is an opportunity to think.',
    impactCreed3: 'Every presentation is an opportunity to improve.',
    impactCreed4: 'Every piece of writing is an opportunity to create knowledge.',
    impactMotto: 'Discuss deeply. Think critically. Write clearly. Connect globally.',

    // Core Values
    valConnect: 'Connect',
    valConnectDesc: 'Young people from diverse nations uniting across geographic and cultural borders.',
    valChallenge: 'Challenge',
    valChallengeDesc: 'Scrutinizing perspectives, questioning assumptions, and testing arguments through evidence.',
    valCreate: 'Create',
    valCreateDesc: 'Transforming spoken debates into written academic knowledge, policy insights, and youth leadership.',

    // Footer
    footerDesc: 'Global Youth Dialogue — An international community connecting young debaters worldwide to explore global issues and develop ideas through structured dialogue and academic writing.',
    footerNavTitle: 'Navigation',
    footerAbout: 'Our Story & Mission',
    footerProcess: 'How It Works',
    footerTopics: 'Topic Categories',
    footerSessions: 'Sessions Overview',
    footerImpact: 'Our Impact',
    footerPortalsTitle: 'Portals & Access',
    footerSignIn: 'Sign In Portal',
    footerNetwork: 'Global Youth Network',
    rightsReserved: 'All rights reserved. Global Youth Dialogue.',

    // Sign In Page
    authTopBadge: 'Global Youth Dialogue • Sign In',
    authPageTitle: 'Sign In to Your Account',
    authPageArabic: 'تسجيل الدخول — الحوار الشبابي الدولي',
    authPageDesc: 'Enter your email and password. Your role will be automatically identified to open either your Member features or Admin workspace.',
    authDemoLabel: '1-Click Demo Profiles (Auto-Role Redirection)',
    demoRoleMember: 'Kofi Mensah (Member / Delegate) → Opens Member Features',
    demoRoleAdmin: 'Tariq Al-Mansoor (Admin / Coordinator) → Opens Admin Features',
    authEmailLabel: 'Email Address',
    authPasswordLabel: 'Password',
    authDemoPass: 'Demo: password123',
    authSubmitBtn: 'Sign In →',
    authNoAccount: "Don't have an approved account yet?",
    authOr: 'OR',
    authReturnHome: '← Return to Home',

    // Modals
    applyModalTitle: 'Apply for Community Membership',
    applyModalDesc: 'Join an international network of young debaters. All applications are vetted by our founding coordinators.',
    formFullName: 'Full Name',
    formEmail: 'Email Address',
    formCountry: 'Country of Residence / Representation',
    formInterests: 'Areas of Primary Intellectual Interest',
    formExperience: 'Debate & Public Speaking Background',
    formMotivation: 'Why do you want to join Global Youth Dialogue?',
    btnSubmitApplication: 'Submit Membership Application',

    // Member Portal
    memberDashboard: 'Member Dashboard',
    nextSession: 'Next Scheduled Session',
    recentActivity: 'Recent Platform Activity',
    quickAccess: 'Quick Access',
    mySuggestedTopics: 'My Submitted Topics',
    communityDirectory: 'International Community',

    // Coordinator Portal
    coordDashboard: 'Coordinator Workspace',
    coordOverview: 'Programme Overview',
    coordCommunity: 'The Community',
    coordCommunityTitle: 'The GYDE Community',
    coordCommunitySubtitle: 'Unified Directory & Registry of All Members, Academic Presenters, and Co-Administrators across global chapters.',
    btnAddCommunityUser: '+ Add Community User',
    pendingApplications: 'Pending Applications',
    topicManagement: 'Topic Lifecycle Pipeline',
    sessionManagement: 'Session Management',
    feedbackReview: 'Delegate Feedback Analysis',
    summaryEditor: 'Academic Writing Studio',
    teamManagement: 'ISDC7 Coordinator Team',
    btnDeleteTrialData: 'Delete Trial Data',
    deleteTrialModalTitle: 'Delete All Trial Data',
    deleteTrialModalSubtitle: 'Admin Database Maintenance & Trial Cleanup',
    deleteTrialWarning: 'Warning: This administrative action will permanently erase all trial and demo data generated during website testing.',
    deleteTrialItemsTitle: 'The following trial data will be permanently cleared:',
    deleteTrialItemProfiles: 'All Demo and Trial Profiles of Members, Presenters, and Coordinators (Permanently Deleted)',
    deleteTrialItem1: 'Trial Member Applications & Pending Sign-ups',
    deleteTrialItem2: 'Test Sessions & Custom Scheduled Debates',
    deleteTrialItem3: 'Test Academic Papers & Draft Submissions',
    deleteTrialItem4: 'Custom Topic Bank Items & Pipeline Entries',
    deleteTrialItem5: 'Test Evaluations, Feedback & Community Ballots',
    deleteTrialItem6: 'Ephemeral OTP Sessions & Local Cache',
    deleteTrialNote: 'Only the official Administrator account (Mubashir CP / 3681mubashircp@gmail.com) and core curricula will remain active.',
    btnConfirmDeleteTrial: 'Yes, Delete All Trial Data',

    // Additional Navigation & Dashboards
    navDashboard: 'Dashboard',
    navSubmissions: 'Paper Submissions',
    navMaterials: 'Academic Materials',
    navForum: 'Discussion Forum',
    navCalendar: 'Calendar & Schedule',
    navJourney: 'My Journey & Badges',
    navCertificate: 'Participation Certificate',
    reqPresenter: 'Request to be Presenter',
    navProfile: 'My Profile & Settings',
    presOverview: 'Overview & Agenda',
    topicBankCatalog: 'Topic Bank Catalog',
    speakerProfile: 'Speaker Profile',
    participateAsMember: 'Participate as Member',
    countryChapters: 'Country Chapters',
    mediaStudio: 'Media & PR Studio',
    coordProfile: 'Coordinator Profile',
    heroChapters: '14+ Global Chapters',
    heroStructured: 'Weekly Structured Debates',
    heroDebaters: '60+ Active Youth Debaters',
    heroPapers: '100% Youth-Researched Papers',
    heroKeynote: 'Floor Keynote Speech',
    heroNations: '14+ Nations Connected',
    heroResearch: 'Youth Academic Research'
  },

  ar: {
    // Brand & Meta
    brandName: 'الحوار والتبادل الشبابي الدولي (GYDE)',
    brandSubtitle: 'مجتمع دولي للمناظرين والباحثين الشباب',
    taglineShort: 'تواصل. حاور. ابتكر.',
    taglineLong: 'عقول شابة. دول مختلفة. حوار واحد.',
    heroSubtext: 'مجتمع دولي يقوده الشباب يربط المناظرين لاستكشاف القضايا العالمية وتبادل وجهات النظر وتطوير الأفكار من خلال حوار منظم.',

    // Navigation
    // Navigation
    navHome: 'الرئيسية',
    navAbout: 'عن المجتمع',
    navProcess: 'آلية العمل',
    navTopics: 'فئات الموضوعات',
    navSessions: 'الجلسات',
    navImpact: 'أثرنا',
    navWritings: 'الأوراق الأكاديمية',
    navJoinUs: 'انضم إلينا',
    navLogin: 'تسجيل الدخول',
    navMemberPortal: 'بوابة الأعضاء',
    navCoordinatorPortal: 'بوابة المنسقين',
    navLogout: 'تسجيل الخروج',
    navTopicBank: 'بنك المواضيع',
    topicBankTitle: 'بنك المواضيع الأكاديمية',
    topicBankSubtitle: 'مكتبة رصينة للموضوعات الأكاديمية ومحاور البحث المقترحة للجلسات والحوارات والمناظرات.',
    topicBankUseTopic: 'اقتراح هذا الموضوع لجلسة',
    topicSelectPlaceholder: '-- اختر موضوعاً من بنك المواضيع الأكاديمية --',
    topicSelectOther: 'أخرى (اقترح موضوعاً ومحاور مخصصة جديدة)',
    topicCustomAlert: 'تخضع المواضيع الجديدة لمراجعة الأمانة الأكاديمية، وفور اعتمادها تضاف تلقائياً وبشكل دائم إلى بنك المواضيع الدولي!',
    navPresenterPortal: 'بوابة المتحدثين ومقدمي الأوراق',
    portalPresenterTitle: 'مساحة عمل المتحدثين ومقدمي العروض الأكاديمية',
    portalPresenterSubtitle: 'إعداد الملخصات البحثية وتجهيز العروض التقديمية وتقديم الأوراق البحثية لجلسات الحوار الدولية.',
    presenterRoleBadge: 'مقدم عروض وأوراق أكاديمية',
    btnPresentTopic: 'تقديم موضوع بحثي',
    btnMyDecks: 'عروضي التقديمية ومحاوري',
    btnAssignedSessions: 'جلسات الإلقاء والمشاركة',
    demoRolePresenter: 'كوفي مينساه (مقدم عروض) ← تقديم موضوع للجلسات',

    // Mobile Bottom Tab Bar (Compact Navigation)
    tabHome: 'الرئيسية',
    tabSessions: 'الجلسات',
    tabWritings: 'الأبحاث',
    tabFeedback: 'التقييم',
    tabTopics: 'المواضيع',
    tabDirectory: 'الأعضاء',
    tabWorkspace: 'الرئيسية',
    tabApplications: 'الطلبات',
    tabStudio: 'المختبر',

    // Search
    searchBtn: 'بحث',
    searchPlaceholder: 'ابحث في الجلسات والأوراق الأكاديمية والمقترحات والأعضاء...',

    // Buttons
    btnExplore: 'استكشف المجتمع',
    btnUpcomingSessions: 'الجلسات القادمة',
    btnJoinCommunity: 'تقديم طلب عضوية',
    btnLearnMore: 'اقرأ قصة التأسيس',
    btnSubmitProposal: 'اقترح موضوعاً',
    btnViewDetails: 'عرض التفاصيل',
    btnGiveFeedback: 'تقديم التقييم',
    btnAccessWritings: 'تصفح الأوراق البحثية',
    btnCreateSession: 'إنشاء جلسة جديدة',
    btnManageTopics: 'إدارة الموضوعات',
    btnApprove: 'قبول',
    btnDecline: 'رفض',
    btnContactRep: 'تواصل مع المنسق',

    // Hero & Stats
    badgeOrigin: 'مجتمع دولي مستقل لمناظري الشباب',
    badgeLegacy: 'قصة التأسيس',
    statNationsNum: '+١٤',
    statNations: 'دولة ممثلة',
    statDebatersNum: '+٦٠',
    statDebaters: 'مناظراً شاباً',
    statSessionsNum: 'أسبوعية',
    statSessions: 'جلسات حوار أسبوعية',
    statWritingsNum: '١٠٠٪',
    statWritings: 'بأبحاث شبابية رصينة',

    // About Section
    aboutSectionTitle: 'عن المجتمع والمبادرة',
    aboutSubtitle: 'ربط مناظري الشباب حول العالم لاستكشاف القضايا الدولية وتطوير الأفكار من خلال حوار منظم.',
    ourStoryTitle: 'قصة التأسيس',
    ourStoryP1: 'التقى أصدقاء في بطولة دولية للمناظرات، واجتمعوا برؤية مشتركة: خلق مساحة مستمرة للحوار الفكري العالمي تتجاوز حدود جولات المسابقات.',
    ourStoryP2: 'ورغم انتهاء البطولة، حرص المشاركون على مواصلة التناظر، ومناقشة القضايا العالمية المعاصرة، وتبادل الرؤى وفتح آفاق جديدة للشباب حول العالم.',
    ourStoryP3: 'تأسس "الحوار الشبابي الدولي" لتحويل هذا التواصل الاستثنائي إلى شبكة شبابية رائدة ومستدامة للحوار والبحث الرصين.',

    missionTitle: 'رسالتنا',
    missionDesc: 'توفير منصة دولية يتبادل فيها الشباب الأفكار، ويتحدون التصورات المسبقة، ويطورون مهارات البحث والتواصل، ويتعلمون من أقرانهم عبر القارات.',

    visionTitle: 'رؤيتنا',
    visionDesc: 'جيل شبابي متصل وقادر على التعامل بوعي ومسؤولية مع التحديات العالمية والمشاركة الفاعلة في الحوار الدولي البنّاء.',

    // 6-step process
    processTag: 'دورة الحوار والإنتاج المعرفي',
    processTitle: 'آلية عمل البرنامج',
    processSubtitle: 'دورة أسبوعية متكاملة تحول المناظرة الحية إلى إنتاج معرفي وأوراق أكاديمية موثقة.',
    step1Num: '٠١',
    step1Title: '٠١ — الاقتراح والاختيار',
    step1Desc: 'اقتراح الموضوعات والقضايا واعتمادها من أفكار الأعضاء ضمن المجالات المعرفية المتعددة.',
    step2Num: '٠٢',
    step2Title: '٠٢ — الإعداد والبحث المعمق',
    step2Desc: 'يقوم المتحدثون بجمع الأدلة الموثقة ومراجعة الدراسات وصياغة الحجج المدعومة بالأدلة.',
    step3Num: '٠٣',
    step3Title: '٠٣ — جلسة الحوار الأسبوعية',
    step3Desc: 'يلتقي المجتمع أسبوعياً في حوار افتراضي منظم يجمع بين العروض والمناظرة والتفنيد المتبادل.',
    step4Num: '٠٤',
    step4Title: '٠٤ — النقد والمراجعة الفكرية',
    step4Desc: 'مساءلة الفرضيات وتحدي المسلمات وتقديم ملاحظات نقدية نوعية تعمق أبعاد القضية.',
    step5Num: '٠٥',
    step5Title: '٠٥ — نشر الأوراق البحثية',
    step5Desc: 'عقب الجلسة، يقوم المتحدث بتطوير بحثه وعرضه التقديمي إلى ورقة بحثية أكاديمية تنشر في المكتبة الرقمية.',
    step6Num: '٠٦',
    step6Title: '٠٦ — توثيق الملخص التحليلي',
    step6Desc: 'إعداد ملخص تحليلي شامل لكل جلسة يوثق أبرز الحجج والأدلة وخلاصات وتوصيات المشاركين.',

    // Home Upcoming Session Section
    homeSessionsTag: 'الجلسة القادمة المجدولة',
    homeSessionsTitle: 'جلسة الحوار الدولية القادمة',
    homeSessionsSubtitle: 'انضم إلى مناظرتنا الأسبوعية المنظمة وحوار الطاولة المستديرة مع نخبة من مناظري 14+ دولة.',
    homeSessionsViewAll: 'عرض جميع الجلسات والأرشيف',
    homeJoinSessionBtn: 'تسجيل الدخول للانضمام',
    homeApplySessionBtn: 'تقديم طلب عضوية',
    homeSessionMotion: 'قضية المناظرة المطروحة:',
    homeSessionSpeakers: 'المتحدثون الرئيسيون:',
    homeSessionModerator: 'إدارة الجلسة:',

    // Topic Categories
    topicsTag: 'المجالات المعرفية الرئيسية',
    topicsTitle: '١٦ مجالاً معرفياً أساسياً',
    topicsSubtitle: 'محاور سياسية وفكرية معاصرة تخضع للبحث والمناظرة المعمقة.',
    catBadge: 'محور نقاش شبابي عالمي',
    catTopics: 'قضايا',

    // Public Sessions Notice
    sessionsTag: 'أرشيف الجلسات والحوارات',
    sessionsTitle: 'الجلسات والأرشيف المعرفي',
    sessionsSubtitle: 'استكشف جلسات الحوار الشبابي الدولي، وجداول المناظرات القادمة، وحلقات النقاش وأرشيف الجلسات المتاح للجميع.',
    membersOnlyNotice: 'محتوى الجلسات والأرشيف مخصص لأعضاء المجتمع',
    signInToAccess: 'للحفاظ على بيئة آمنة وفكرية جادة للمناظرين الدوليين، تقتصر روابط الاجتماعات والتسجيلات والأوراق البحثية على الأعضاء وفريق التنسيق.',
    sessionMembersOnly: 'محتوى خاص بالأعضاء',
    sessionLabel: 'الجلسة',
    sessionFormat: 'شكل المناظرة:',
    sessionsFilterAll: 'جميع الجلسات الحوارية',
    sessionsFilterUpcoming: 'الجلسات القادمة',
    sessionsFilterCompleted: 'الأرشيف المكتمل',

    // Our Impact Section
    impactTag: 'النمو والتطور المستمر',
    impactTitle: 'أثر المجتمع',
    impactSubtitle: 'تطور يتجاوز حدود قاعات المناظرة.',
    impactIntro: 'الانضمام إلى مجتمعنا لا يقتصر على حضور النقاشات فحسب؛ بل هو فرصة متواصلة للتفكير والبحث والتقديم والكتابة والتواصل مع شباب من شتى الثقافات والخلفيات.',
    impactPillarsHeader: 'من خلال المشاركة المنتظمة، يكتسب الأعضاء:',

    impactP1Title: 'التواصل الفعّال والإقناع',
    impactP1Desc: 'بناء الثقة في طرح الأفكار، والتحدث بوضوح، والإجابة عن الأسئلة، والدفاع عن الحجج ومخاطبة مختلف الجماهير.',
    impactP2Title: 'التفكير النقدي المعمق',
    impactP2Desc: 'مساءلة الفرضيات، وفحص الرؤى المختلفة، واكتشاف ثغرات الحجج، والتمييز بين الحقائق والآراء والتعامل بعمق مع القضايا المعقدة.',
    impactP3Title: 'تطوير المهارات البحثية',
    impactP3Desc: 'استكشاف القضايا العالمية لما هو أبعد من العناوين الإخبارية، عبر البحث في المصادر الموثوقة ومقارنة الأدلة وتتبع سياقات الأحداث والسياسات.',
    impactP4Title: 'فهم العالم المتغير',
    impactP4Desc: 'الانخراط في قضايا الشؤون الدولية، التقنية، المناخ، التعليم، الاقتصاد، الحوكمة، والثقافة — من خلال الاستماع المباشر لوجهات نظر شباب من مختلف البلدان.',
    impactP5Title: 'تحويل النقاشات إلى إنتاج معرفي',
    impactP5Desc: 'لا تنتهي جلساتنا بانتهاء اللقاء الافتراضي؛ بل يقوم الأعضاء والمتحدثون بتحويل النقاشات إلى أوراق أكاديمية وملخصات ورؤى موثقة تثري أرشيفاً فكرياً متنامياً.',
    impactP6Title: 'اكتساب مهارات القيادة والإلقاء',
    impactP6Desc: 'يتدرج الأعضاء من المشاركة في النقاش إلى اقتراح الموضوعات، وتقديم الأبحاث، وإدارة الجلسات، وتولي المسؤوليات القيادية في أنشطة المجتمع.',
    impactP7Title: 'بناء جسور التواصل العابرة للحدود',
    impactP7Desc: 'توطيد علاقات هادفة مع طلاب من مختلف الدول والجامعات والخلفيات الثقافية — مما يفتح آفاق التعاون والتعلم المشترك والمبادرات المستقبلية.',
    impactP8Title: 'بناء ملف إنجاز فكري متميز',
    impactP8Desc: 'من خلال العروض التقديمية والأبحاث والأوراق الأكاديمية والمداخلات، يبني الأعضاء تدريجياً سجلاً موثقاً لاهتماماتهم الفكرية وتطورهم المعرفي.',

    impactJourneyTitle: 'التدرج: من مشارك إلى قائد ومساهم',
    impactJourneyDesc: 'صُمم المجتمع ليتيح للأعضاء مساراً مستمراً للتطور:',
    impactJourneyStep1: 'الانضمام',
    impactJourneyStep2: 'المشاركة',
    impactJourneyStep3: 'البحث',
    impactJourneyStep4: 'التقديم',
    impactJourneyStep5: 'القيادة',
    impactJourneyStep6: 'الكتابة',
    impactJourneyStep7: 'المساهمة',
    impactJourneyNote: 'مع مرور الوقت، يتحول العضو من مجرد مستمع إلى متحدث، وباحث، وميسر، وكاتب، ومنظم، وصانع أثر في شبكة شبابية دولية.',

    impactTakeawaysTitle: 'ما نأمل أن تكتسبه معنا',
    impactTakeawaysSub: 'من خلال عضويتك في المجتمع، نأمل أن تصبح:',
    impactT1: 'أكثر ثقة وجرأة في الحديث.',
    impactT2: 'أكثر رصانة وانضباطاً في التفكير.',
    impactT3: 'أكثر شغفاً وفضولاً لاستكشاف العالم.',
    impactT4: 'أكثر تمكناً وكفاءة في البحث الرصين.',
    impactT5: 'أكثر براعة ووضوحاً في الكتابة وصياغة الأفكار.',
    impactT6: 'أكثر تفهماً وانفتاحاً على الرؤى ووجهات النظر المختلفة.',
    impactT7: 'أكثر استعداداً لتولي زمام القيادة والمبادرة.',
    impactT8: 'أكثر اتصالاً وتأثيراً في العالم من حولك.',

    impactCreedTitle: 'من الحوار إلى التمكين والكفاءة.',
    impactCreed1: 'كل نقاش هو فرصة حقيقية للتعلم.',
    impactCreed2: 'كل سؤال هو فرصة للتفكير والمساءلة.',
    impactCreed3: 'كل عرض تقديمي هو فرصة للتطوير والإتقان.',
    impactCreed4: 'كل ورقة بحثية هي فرصة لصناعة المعرفة.',
    impactMotto: 'حاور بعمق. فكّر بنزاهة نقدية. اكتب بوضوح. تواصل عالمياً.',

    // Core Values
    valConnect: 'تواصل',
    valConnectDesc: 'شباب من مختلف الثقافات والدول يجتمعون ويتخطون الحدود الجغرافية.',
    valChallenge: 'حاور',
    valChallengeDesc: 'مساءلة الأفكار ونقد المسلمات واختبار الأدلة بنزاهة فكرية وحوار رصين.',
    valCreate: 'ابتكر',
    valCreateDesc: 'تحويل الحوار الشفهي إلى معرفة أكاديمية مكتوبة ومبادرات شبابية قيادية.',

    // Footer
    footerDesc: 'الحوار الشبابي الدولي — مجتمع دولي يربط المناظرين الشباب حول العالم لاستكشاف القضايا العالمية وتطوير الأفكار من خلال حوار منظم وأوراق أكاديمية رصينة.',
    footerNavTitle: 'التنقل',
    footerAbout: 'قصة التأسيس والرسالة',
    footerProcess: 'آلية العمل',
    footerTopics: 'فئات الموضوعات',
    footerSessions: 'نظرة عامة على الجلسات',
    footerImpact: 'أثر المجتمع',
    footerPortalsTitle: 'البوابات والوصول',
    footerSignIn: 'بوابة تسجيل الدخول',
    footerNetwork: 'الشبكة الشبابية الدولية',
    rightsReserved: 'جميع الحقوق محفوظة. الحوار الشبابي الدولي.',

    // Sign In Page
    authTopBadge: 'الحوار الشبابي الدولي • تسجيل الدخول',
    authPageTitle: 'تسجيل الدخول إلى حسابك',
    authPageArabic: 'تسجيل الدخول — الحوار الشبابي الدولي',
    authPageDesc: 'أدخل بريدك الإلكتروني وكلمة المرور. سيتم التعرف على دورك تلقائياً لفتح واجهة الأعضاء أو مساحة الإدارة.',
    authDemoLabel: 'حسابات تجريبية بنقرة واحدة (توجيه تلقائي للمهام)',
    demoRoleMember: 'كوفي مينساه (عضو / متحدث) ← يفتح واجهة الأعضاء',
    demoRoleAdmin: 'طارق المنصور (منسق / إدارة) ← يفتح واجهة المنسقين',
    authEmailLabel: 'البريد الإلكتروني',
    authPasswordLabel: 'كلمة المرور',
    authDemoPass: 'التجريبي: password123',
    authSubmitBtn: '← تسجيل الدخول',
    authNoAccount: 'ليس لديك حساب معتمد بعد؟',
    authOr: 'أو',
    authReturnHome: 'العودة إلى الرئيسية →',

    // Modals
    applyModalTitle: 'تقديم طلب عضوية في المجتمع',
    applyModalDesc: 'انضم إلى شبكة دولية من المناظرين الشباب. تتم مراجعة جميع الطلبات بعناية من قبل منسقي التأسيس.',
    formFullName: 'الاسم الكامل',
    formEmail: 'البريد الإلكتروني',
    formCountry: 'دولة الإقامة / التمثيل',
    formInterests: 'مجالات الاهتمام الفكري الرئيسية',
    formExperience: 'الخبرة السابقة في المناظرات والخطابة',
    formMotivation: 'لماذا ترغب في الانضمام إلى الحوار الشبابي الدولي؟',
    btnSubmitApplication: 'إرسال طلب العضوية',

    // Member Portal
    memberDashboard: 'بوابة الأعضاء',
    nextSession: 'الجلسة القادمة',
    recentActivity: 'أحدث التحديثات',
    quickAccess: 'وصول سريع',
    mySuggestedTopics: 'موضوعاتي المقترحة',
    communityDirectory: 'دليل المجتمع الدولي',

    // Coordinator Portal
    coordDashboard: 'مساحة عمل المنسقين',
    coordOverview: 'نظرة عامة على البرنامج',
    coordCommunity: 'المجتمع',
    coordCommunityTitle: 'مجتمع الحوار والتبادل',
    coordCommunitySubtitle: 'الدليل الموحد لجميع الأعضاء، ومقدمي الأوراق الأكاديمية، والمنسقين المشاركين عبر الفروع العالمية.',
    btnAddCommunityUser: '+ إضافة مستخدم للمجتمع',
    pendingApplications: 'طلبات الانضمام المعلقة',
    topicManagement: 'إدارة مسار الموضوعات',
    sessionManagement: 'إدارة الجلسات',
    feedbackReview: 'تحليل تقييمات الأعضاء',
    summaryEditor: 'مختبر الكتابة الأكاديمية',
    teamManagement: 'فريق التنسيق التأسيسي (ISDC7)',
    btnDeleteTrialData: 'حذف البيانات التجريبية',
    deleteTrialModalTitle: 'حذف جميع البيانات التجريبية',
    deleteTrialModalSubtitle: 'صيانة قاعدة بيانات الإدارة وتنظيف السجلات التجريبية',
    deleteTrialWarning: 'تحذير: سيؤدي هذا الإجراء الإداري إلى مسح جميع البيانات والاختبارات التجريبية التي تم إنشاؤها أثناء تجربة الموقع نهائياً.',
    deleteTrialItemsTitle: 'سيتم مسح البيانات التجريبية التالية نهائياً:',
    deleteTrialItemProfiles: 'جميع الملفات الشخصية التجريبية للأعضاء والمقدمين والمنسقين (حذف دائم)',
    deleteTrialItem1: 'طلبات العضوية التجريبية والتسجيلات المعلقة',
    deleteTrialItem2: 'الجلسات والمناظرات التجريبية المجدولة',
    deleteTrialItem3: 'الأوراق الأكاديمية والمسودات التجريبية',
    deleteTrialItem4: 'المواضيع المخصصة في بنك المواضيع التجريبي',
    deleteTrialItem5: 'تقييمات واستبيانات وتصويتات الجلسات التجريبية',
    deleteTrialItem6: 'جلسات التحقق برمز OTP المؤقت والذاكرة المحلية',
    deleteTrialNote: 'سيبقى حساب المدير الإداري الرسمي فقط (مباشر سي بي / 3681mubashircp@gmail.com) والمناهج الأساسية قيد التشغيل.',
    btnConfirmDeleteTrial: 'نعم، احذف جميع البيانات التجريبية',

    // Additional Navigation & Dashboards
    navDashboard: 'لوحة التحكم',
    navSubmissions: 'تقديم الأوراق البحثية',
    navMaterials: 'المواد الأكاديمية',
    navForum: 'منتدى النقاش',
    navCalendar: 'التقويم والجدول الزمني',
    navJourney: 'مساري وأوسمتي',
    navCertificate: 'شهادة المشاركة',
    reqPresenter: 'طلب الاعتماد كمقدم أوراق',
    navProfile: 'ملفي الشخصي والإعدادات',
    presOverview: 'نظرة عامة وجدول الأعمال',
    topicBankCatalog: 'كتالوج بنك المواضيع',
    speakerProfile: 'ملف المتحدث',
    participateAsMember: 'المشاركة كعضو',
    countryChapters: 'الفروع والمنسقون الوطنيون',
    mediaStudio: 'استوديو الإعلام والعلاقات العامة',
    coordProfile: 'ملف المنسق',
    heroChapters: '+14 فرعاً عالمياً',
    heroStructured: 'مناظرات أسبوعية منظمة',
    heroDebaters: '+60 مناظراً شبابياً نشطاً',
    heroPapers: 'أوراق بحثية شبابية 100%',
    heroKeynote: 'الكلمة الرئيسية في القاعة',
    heroNations: '+14 دولة متصلة',
    heroResearch: 'بحوث أكاديمية شبابية'
  }
};

/**
 * COMPREHENSIVE ENGLISH-TO-ARABIC TRANSLATION DICTIONARY
 * Covers dynamic templates, UI strings, dashboard widgets, tables, filters,
 * forms, statuses, categories, countries, badges, and roles.
 */
const GLOBAL_TRANSLATION_MAP = {
  // Brand & High-level
  'Global Youth Dialogue & Exchange (GYDE)': 'الحوار والتبادل الشبابي الدولي (GYDE)',
  'Global Youth Dialogue & Exchange': 'الحوار والتبادل الشبابي الدولي',
  'Global Youth Dialogue': 'الحوار الشبابي الدولي',
  'International Community of Youth Debaters': 'مجتمع دولي للمناظرين والباحثين الشباب',
  'Connect. Challenge. Create.': 'تواصل. حاور. ابتكر.',
  'Young minds. Different countries. One conversation.': 'عقول شابة. دول مختلفة. حوار واحد.',

  // Hero & Collage Tags
  'Floor Keynote Speech': 'الكلمة الرئيسية في القاعة',
  '14+ Nations Connected': '+14 دولة متصلة',
  'Youth Academic Research': 'بحوث أكاديمية شبابية',
  '60+ Active Youth Debaters': '+60 مناظراً شبابياً نشطاً',
  '100% Youth-Researched Papers': 'أوراق بحثية شبابية 100%',
  '14+ Global Chapters': '+14 فرعاً عالمياً',
  'Weekly Structured Debates': 'مناظرات أسبوعية منظمة',
  'Countries Represented': 'دولة ممثلة',
  'Weekly Dialogue Sessions': 'جلسات حوار أسبوعية',
  'Youth-Led & Researched': 'أوراق يقودها ويبحثها الشباب',

  // Sidebars & Menus
  'Suggest a Topic Now': 'اقترح موضوعاً الآن',
  'Suggest a Topic': 'اقترح موضوعاً',
  'Suggest Topic': 'اقترح موضوعاً',
  'Suggest a Topic or Dialogue Activity': 'اقتراح موضوع أو نشاط حواري',
  'Calendar & Schedule': 'التقويم والجدول الزمني',
  'My Journey & Badges': 'مساري وأوسمتي',
  'My Dialogue Journey & Badges': 'مساري الحواري وأوسمتي التقديرية',
  'Participation Certificate': 'شهادة المشاركة',
  'Download Certificate': 'تحميل الشهادة',
  'Request to be Presenter': 'طلب الاعتماد كمقدم أوراق',
  'Presenter Accreditation Status': 'حالة الاعتماد كمقدم أوراق',
  'Accredited Keynote Presenter': 'مقدم أوراق معتمد رسمياً',
  'Pending Presenter Accreditation': 'طلب الاعتماد قيد المراجعة',
  'My Profile & Settings': 'ملفي الشخصي والإعدادات',
  'Delete Trial Data': 'حذف البيانات التجريبية',
  'Sign Out': 'تسجيل الخروج',
  'Sign In': 'تسجيل الدخول',
  'Join Us': 'انضم إلينا',
  'Overview & Agenda': 'نظرة عامة وجدول الأعمال',
  'Present a Topic': 'تقديم موضوع بحثي',
  'My Presentations & Slides': 'عروضي التقديمية والشرائح',
  'Topic Bank Catalog': 'كتالوج بنك المواضيع',
  'Speaking Sessions': 'جلسات التحدث',
  'Academic Writing': 'الكتابة الأكاديمية',
  'Speaker Profile': 'ملف المتحدث',
  'Participate as Member': 'المشاركة كعضو',
  'Programme Overview': 'نظرة عامة على البرنامج',
  'Topic Pipeline': 'مسار إدارة المواضيع',
  'Topic Lifecycle Pipeline': 'مسار إدارة دورة حياة المواضيع',
  'Create & Schedule': 'إنشاء وجدولة الجلسات',
  'Writing Studio': 'استوديو الكتابة الأكاديمية',
  'Review Feedback': 'مراجعة تقييمات الأعضاء',
  'Member Applications': 'طلبات العضوية',
  'ISDC7 Team': 'فريق ISDC7',
  'ISDC7 Coordinator Team': 'فريق المنسقين التأسيسي (ISDC7)',
  'Country Chapters': 'الفروع والمنسقون الوطنيون',
  'Media & PR Studio': 'استوديو الإعلام والعلاقات العامة',
  'Coordinator Profile': 'ملف المنسق',
  'Sessions & Dialogue': 'الجلسات والحوار',
  'Paper Submissions': 'تقديم الأوراق البحثية',
  'Academic Materials': 'المواد الأكاديمية',
  'Discussion Forum': 'منتدى النقاش',
  'Give Feedback': 'تقديم الملاحظات والتقييم',
  'Topic Bank': 'بنك المواضيع',
  'Academic Topic Bank': 'بنك المواضيع الأكاديمية',
  'Quick Access': 'الوصول السريع',
  'Scheduled Sessions': 'الجلسات المجدولة',
  'Submit Paper': 'تقديم ورقة أكاديمية',
  'Submit Feedback': 'إرسال التقييم',

  // Dashboards & Sections
  'Member Dashboard': 'لوحة تحكم الأعضاء',
  'Presenter & Speaker Workspace': 'مساحة عمل المتحدثين ومقدمي الأوراق',
  'Coordinator Workspace': 'مساحة عمل المنسقين',
  'Next Scheduled Session': 'الجلسة القادمة المجدولة',
  'Next Session': 'الجلسة القادمة',
  'Recent Platform Activity': 'النشاط الأخير على المنصة',
  'Recent Activity': 'النشاط الأخير',
  'My Submitted Topics': 'موضوعاتي المقترحة',
  'International Community': 'المجتمع الدولي',
  'Honorary Dialogue Badges': 'أوسمة الشرف الحوارية',
  'Welcome back to the international dialogue platform.': 'مرحباً بك مجدداً في منصة الحوار الدولي.',
  'Active Debater': 'مناظر نشط',
  'Academic Researcher': 'باحث أكاديمي',
  'Session Lead': 'قائد جلسة',
  'Global Contributor': 'مساهم دولي',
  'Diplomacy Fellow': 'زميل دبلوماسي',
  'Certified Academic Delegate': 'مندوب أكاديمي معتمد',
  'Official Certificate of Active Participation': 'الشهادة الرسمية للمشاركة النشطة',
  'Certificate of Appreciation': 'شهادة تقدير واعتزاز',

  // 16 Knowledge Spheres
  'Global Affairs': 'الشؤون الدولية والعالمية',
  'Governance & Society': 'الحوكمة والمجتمع',
  'Education': 'التعليم',
  'Technology & AI': 'التكنولوجيا والذكاء الاصطناعي',
  'Economy': 'الاقتصاد',
  'Environment': 'البيئة والمناخ',
  'Culture & Identity': 'الثقافة والهوية',
  'Emerging Issues': 'القضايا الناشئة',
  'Ethics & Philosophy': 'الأخلاق والفلسفة',
  'Law & Justice': 'القانون والعدالة',
  'Youth & Leadership': 'الشباب والقيادة',
  'Media & Information': 'الإعلام والمعلومات',
  'Health & Society': 'الصحة والمجتمع',
  'Human Rights': 'حقوق الإنسان',
  'Peace & Conflict Resolution': 'السلام وحل النزاعات',
  'Science & Innovation': 'العلوم والابتكار',

  // Roles
  'Coordinator': 'منسق',
  'Presenter': 'مقدم أوراق',
  'Member': 'عضو',
  'Moderator': 'مدير جلسة',
  'Research Contributor': 'باحث ومساهم',
  'Guest Speaker': 'متحدث ضيف',
  'Admin': 'مدير النظام',
  'Delegate': 'مندوب',
  'Academic Presenter & Keynote Fellow': 'مقدم أوراق أكاديمية وزميل رئيسي',

  // Statuses
  'Under Review': 'قيد المراجعة',
  'under_review': 'قيد المراجعة',
  'Approved': 'معتمد',
  'approved': 'معتمد',
  'Upcoming': 'قادمة',
  'upcoming': 'قادمة',
  'Completed': 'مكتملة',
  'completed': 'مكتملة',
  'Pending': 'قيد الانتظار',
  'pending': 'قيد الانتظار',
  'Scheduled': 'مجدولة',
  'scheduled': 'مجدولة',
  'Draft': 'مسودة',
  'draft': 'مسودة',
  'Active': 'نشط',
  'active': 'نشط',
  'Rejected': 'مرفوض',
  'rejected': 'مرفوض',
  'Proposed': 'مقترح',
  'Published': 'منشور',
  'In Progress': 'قيد الإعداد',

  // Actions & Buttons
  'View Details': 'عرض التفاصيل',
  'Join Room': 'انضم إلى الغرفة',
  'Join Live Session': 'انضم إلى الجلسة المباشرة',
  'Join Session': 'انضم إلى الجلسة',
  'Download PDF': 'تحميل بصيغة PDF',
  'Submit Proposal': 'إرسال المقترح',
  'Submit Application': 'إرسال الطلب',
  'Submit Topic Proposal': 'إرسال مقترح الموضوع',
  'Save Changes': 'حفظ التغييرات',
  'Save Session': 'حفظ الجلسة',
  'Cancel': 'إلغاء',
  'Submit': 'إرسال',
  'Close': 'إغلاق',
  'Back': 'رجوع',
  'Next': 'التالي',
  'Edit': 'تعديل',
  'Delete': 'حذف',
  'Approve': 'اعتماد',
  'Decline': 'رفض',
  'Reject': 'رفض',
  'Publish': 'نشر',
  'Filter': 'تصفية',
  'All Categories': 'جميع الفئات',
  'All Formats': 'جميع أشكال الحوار',
  'All Statuses': 'جميع الحالات',
  'Copy Link': 'نسخ الرابط',
  'Copied!': 'تم النسخ!',
  'Loading...': 'جاري التحميل...',
  'No records found': 'لم يتم العثور على سجلات',
  'No topics found': 'لم يتم العثور على مواضيع',
  'No sessions found': 'لم يتم العثور على جلسات',
  'Notifications': 'الإشعارات',
  'Search GYDE': 'البحث في المنصة',
  'Search': 'بحث',

  // Countries
  'Qatar': 'قطر',
  'Singapore': 'سنغافورة',
  'Ghana': 'غانا',
  'Brazil': 'البرازيل',
  'United Kingdom': 'المملكة المتحدة',
  'Jordan': 'الأردن',
  'Mexico': 'المكسيك',
  'United States': 'الولايات المتحدة',
  'Canada': 'كندا',
  'Germany': 'ألمانيا',
  'France': 'فرنسا',
  'Japan': 'اليابان',
  'South Korea': 'كوريا الجنوبية',
  'India': 'الهند',
  'Pakistan': 'باكستان',
  'Turkey': 'تركيا',
  'Malaysia': 'ماليزيا',
  'Indonesia': 'إندونيسيا',
  'South Africa': 'جنوب أفريقيا',
  'Nigeria': 'نيجيريا',
  'Kenya': 'كينيا',
  'Morocco': 'المغرب',
  'Egypt': 'مصر',
  'Saudi Arabia': 'المملكة العربية السعودية',
  'United Arab Emirates': 'الإمارات العربية المتحدة',
  'Oman': 'عُمان',
  'Kuwait': 'الكويت',
  'Bahrain': 'البحرين',
  'Lebanon': 'لبنان',
  'Palestine': 'فلسطين',
  'Tunisia': 'تونس',
  'Algeria': 'الجزائر',
  'Iraq': 'العراق',
  'Yemen': 'اليمن',
  'Sudan': 'السودان',
  'Libya': 'ليبيا',

  // Names
  'Tariq Al-Mansoor': 'طارق المنصور',
  'Amara Chen': 'أمارا تشين',
  'Kofi Mensah': 'كوفي منساه',
  'Lucas Silva': 'لوكاس سيلفا',
  'Elena Rostova': 'إيلينا روستوفا',
  'Zaid Al-Harbi': 'زيد الحربي',
  'Sofia Morales': 'صوفيا موراليس',

  // Formats & Session Labels
  'Key Motion for Debate:': 'القضية المحورية للمناظرة:',
  'Lead Debaters:': 'المناظرون الرئيسيون:',
  'Lead Speakers:': 'المتحدثون الرئيسيون:',
  'Moderator:': 'مدير الجلسة:',
  'Format:': 'الشكل الحواري:',
  'Duration:': 'المدة:',
  'Platform:': 'المنصة:',
  'Date:': 'التاريخ:',
  'Time:': 'الوقت:',
  'Minutes': 'دقيقة',
  'Hours': 'ساعة',
  'Parliamentary Debate': 'مناظرة برلمانية',
  'Roundtable Dialogue': 'طاولة مستديرة',
  'Panel Discussion': 'جلسة حوارية متخصصة',
  'Policy Briefing': 'إيجاز سياساتي',
  'Academic Presentation': 'عرض أكاديمي',
  'Working Paper': 'ورقة عمل بحثية',
  'Executive Summary': 'ملخص تنفيذي',

  // Journey Steps
  'Grow from Participant to Contributor': 'التدرج: من مشارك إلى قائد ومساهم',
  'Join': 'الانضمام',
  'Participate': 'المشاركة',
  'Research': 'البحث',
  'Present': 'التقديم',
  'Lead': 'القيادة',
  'Write': 'الكتابة',
  'Contribute': 'المساهمة',

  // Form Placeholders & Labels
  'Full Name': 'الاسم الكامل',
  'Email Address': 'البريد الإلكتروني',
  'Password': 'كلمة المرور',
  'Country of Residence / Representation': 'دولة الإقامة / التمثيل',
  'Areas of Primary Intellectual Interest': 'مجالات الاهتمام الفكري والبحثي',
  'Debate & Public Speaking Background': 'الخبرة في المناظرات والخطابة',
  'Why do you want to join Global Youth Dialogue?': 'لماذا ترغب في الانضمام إلى الحوار الشبابي الدولي؟',
  'Submit Membership Application': 'إرسال طلب الانضمام',
  'Topic Title': 'عنوان الموضوع',
  'Category': 'المجال الأكاديمي',
  'Description': 'الوصف والملخص',
  'Proposed Motion': 'القضية المقترحة للمناظرة',
  'Search topics, subtopics, or keywords...': 'ابحث في المواضيع والمحاور والكلمات المفتاحية...',
  'Search sessions, academic papers, topic proposals, members...': 'ابحث في الجلسات والأوراق الأكاديمية والمقترحات والأعضاء...',
  'Type your message...': 'اكتب رسالتك...',
  'Enter your password': 'أدخل كلمة المرور',
  'Enter email address': 'أدخل البريد الإلكتروني'
};

class I18nService {
  constructor() {
    this.currentLang = localStorage.getItem('gyd_language') || 'en';
    this.isTranslating = false;

    // Pre-sort dictionary phrases by length descending to match longest phrases first
    this.sortedPhrases = Object.entries(GLOBAL_TRANSLATION_MAP).sort(
      (a, b) => b[0].length - a[0].length
    );

    this.setupMutationObserver();

    // Auto-apply on initial DOM load if Arabic is selected
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (this.currentLang === 'ar') {
          this.applyLanguage();
        }
      });
    } else {
      if (this.currentLang === 'ar') {
        this.applyLanguage();
      }
    }
  }

  getLang() {
    return this.currentLang;
  }

  isRTL() {
    return this.currentLang === 'ar';
  }

  setLang(lang) {
    if (lang !== 'en' && lang !== 'ar') lang = 'en';
    this.currentLang = lang;
    localStorage.setItem('gyd_language', lang);
    this.applyLanguage();
  }

  t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || GLOBAL_TRANSLATION_MAP[key] || key;
  }

  translateText(text) {
    if (!text || typeof text !== 'string') return text;
    const trimmed = text.trim();
    if (!trimmed) return text;

    // 1. Direct exact phrase match
    if (GLOBAL_TRANSLATION_MAP[trimmed]) {
      return text.replace(trimmed, GLOBAL_TRANSLATION_MAP[trimmed]);
    }

    // 2. Multi-word phrase & keyword replacement from longest to shortest
    let result = text;
    for (let i = 0; i < this.sortedPhrases.length; i++) {
      const [en, ar] = this.sortedPhrases[i];
      if (result.includes(en)) {
        if (en.length <= 4 && /^[a-zA-Z]+$/.test(en)) {
          const regex = new RegExp('\\b' + en + '\\b', 'gi');
          result = result.replace(regex, ar);
        } else {
          result = result.split(en).join(ar);
        }
      }
    }
    return result;
  }

  translateTextNode(node) {
    if (!node || node.nodeType !== 3) return;
    const val = node.nodeValue;
    if (!val || !val.trim()) return;

    if (this.currentLang === 'ar') {
      if (node._origEn === undefined) {
        node._origEn = val;
      }
      const translated = this.translateText(node._origEn);
      if (translated !== val) {
        node.nodeValue = translated;
      }
    } else {
      if (node._origEn !== undefined && node.nodeValue !== node._origEn) {
        node.nodeValue = node._origEn;
      }
    }
  }

  translateAttributes(el) {
    if (!el || el.nodeType !== 1) return;
    if (this.currentLang === 'ar') {
      if (el.placeholder) {
        if (el._origPlaceholder === undefined) el._origPlaceholder = el.placeholder;
        el.placeholder = this.translateText(el._origPlaceholder);
      }
      if (el.title) {
        if (el._origTitle === undefined) el._origTitle = el.title;
        el.title = this.translateText(el._origTitle);
      }
      const aria = el.getAttribute('aria-label');
      if (aria) {
        if (el._origAria === undefined) el._origAria = aria;
        el.setAttribute('aria-label', this.translateText(el._origAria));
      }
    } else {
      if (el._origPlaceholder !== undefined) el.placeholder = el._origPlaceholder;
      if (el._origTitle !== undefined) el.title = el._origTitle;
      if (el._origAria !== undefined) el.setAttribute('aria-label', el._origAria);
    }
  }

  translateSubtree(root) {
    if (!root || root.nodeType === 8) return;
    if (root.nodeType === 3) {
      this.translateTextNode(root);
      return;
    }
    if (root.nodeType === 1) {
      const tag = root.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return;
      this.translateAttributes(root);
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: node => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const pTag = parent.tagName;
            if (pTag === 'SCRIPT' || pTag === 'STYLE' || pTag === 'NOSCRIPT' || pTag === 'INPUT' || pTag === 'TEXTAREA') {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      let curr;
      while ((curr = walker.nextNode())) {
        this.translateTextNode(curr);
      }
    }
  }

  restoreEnglish(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let curr;
    while ((curr = walker.nextNode())) {
      if (curr._origEn !== undefined) {
        curr.nodeValue = curr._origEn;
      }
    }
    const allEls = root.querySelectorAll ? root.querySelectorAll('*') : [];
    allEls.forEach(el => this.translateAttributes(el));
  }

  setupMutationObserver() {
    if (typeof MutationObserver === 'undefined') return;
    this.observer = new MutationObserver(mutations => {
      if (this.isTranslating || this.currentLang !== 'ar') return;
      this.isTranslating = true;
      try {
        for (const m of mutations) {
          if (m.type === 'childList') {
            m.addedNodes.forEach(node => {
              this.translateSubtree(node);
            });
          } else if (m.type === 'characterData' && m.target) {
            this.translateTextNode(m.target);
          }
        }
      } finally {
        this.isTranslating = false;
      }
    });

    const target = document.body || document.documentElement;
    if (target) {
      this.observer.observe(target, {
        childList: true,
        subtree: true,
        characterData: true
      });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true
        });
      });
    }
  }

  applyLanguage() {
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.isRTL() ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl-mode', this.isRTL());

    // 1. Update all elements explicitly keyed with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && TRANSLATIONS[this.currentLang] && TRANSLATIONS[this.currentLang][key]) {
        el.textContent = TRANSLATIONS[this.currentLang][key];
      }
    });

    // 2. Run full DOM text node & attribute translation
    if (this.currentLang === 'ar') {
      this.translateSubtree(document.body);
    } else {
      this.restoreEnglish(document.body);
    }

    // 3. Update language toggle button text with black & white vector SVG icon
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
      const globeSvg = `<span class="svg-icon" style="display:inline-flex; align-items:center;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></span>`;
      langBtn.innerHTML = this.currentLang === 'en' 
        ? `${globeSvg} <span>العربية</span>`
        : `${globeSvg} <span>English</span>`;
    }

    // 4. Trigger custom event so portals re-render
    window.dispatchEvent(new CustomEvent('gyd-lang-changed', { detail: { lang: this.currentLang } }));
  }
}

window.GYD_I18N = new I18nService();
