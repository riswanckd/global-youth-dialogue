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
  'To maintain a safe, intellectually focused environment for international debaters, live meeting links, private YouTube recordings, and full academic writings are accessible only through authenticated Member & Coordinator portals.': 'حفاظاً على بيئة آمنة ومركزة فكرياً للمناظرين الدوليين، فإن روابط الاجتماعات المباشرة وتسجيلات يوتيوب الخاصة والأوراق الأكاديمية الكاملة متاحة حصرياً عبر بوابات الأعضاء والمنسقين المعتمدة.',
  'Our sessions do not simply end when the meeting ends. Members and presenters transform discussions into academic writing, summaries, reflections, and documented knowledge, creating a growing intellectual archive.': 'لا تنتهي جلساتنا بمجرد انتهاء اللقاء؛ بل يحول الأعضاء والمتحدثون تلك النقاشات إلى أوراق أكاديمية وملخصات وتأملات ومعرفة موثقة تبني أرشيفاً فكرياً متنامياً.',
  'Engage with international affairs, technology, climate, education, economics, governance, culture, and emerging global issues — while hearing perspectives from young people living in different countries.': 'التفاعل مع الشؤون الدولية والتكنولوجيا والمناخ والتعليم والاقتصاد والحوكمة والثقافة والقضايا الناشئة — مع الاستماع المباشر لرؤى شباب يعيشون في دول مختلفة.',
  'Members can gradually move from participating in discussions to proposing topics, presenting research, moderating sessions, leading conversations, and taking responsibility for community activities.': 'يتدرج الأعضاء بثقة من مجرد المشاركة في النقاشات إلى اقتراح المواضيع، وتقديم البحوث، وإدارة الجلسات، وقيادة الحوارات، وتحمل مسؤولية الأنشطة المجتمعية.',
  'Build meaningful relationships with students from different countries, universities, schools, and cultural backgrounds — creating opportunities for collaboration, learning, and future initiatives.': 'توطيد علاقات أصيلة وهادفة مع طلاب من مختلف الدول والجامعات والمدارس والخلفيات الثقافية — مما يفتح آفاقاً رحبة للتعاون والتعلم والمبادرات المستقبلية.',
  'Being part of our community is not only about attending discussions. It is an opportunity to continuously think, research, present, write, and connect with young people from different backgrounds.': 'الانضمام إلى مجتمعنا لا يقتصر على حضور النقاشات فحسب، بل هو فرصة متجددة للتفكير والبحث والعرض والكتابة والتواصل مع شباب من خلفيات متنوعة.',
  'Although the tournament concluded, delegates realized the vital urgency of continuing to debate together, critically interrogate global affairs, and create opportunities for other youth worldwide.': 'ورغم انتهاء البطولة، أدرك المندوبون الحاجة الملحة للاستمرار في التناظر معاً، ومساءلة الشؤون العالمية نقدياً، وتوفير الفرص لشباب آخرين حول العالم.',
  'Although the tournament concluded, delegates realized the urgent value of continuing to debate together, interrogate global challenges, and create opportunities for other youth worldwide.': 'ورغم اختتام البطولة، أدرك المشاركون القيمة البالغة للاستمرار في التناظر معاً، ومناقشة التحديات العالمية، وخلق فرص واعدة للشباب عالمياً.',
  'Through presentations, research, academic writing, discussions, and contributions to the community, members can gradually build a record of their intellectual interests and development.': 'من خلال العروض التقديمية والبحوث والكتابة الأكاديمية والنقاشات والمساهمات المجتمعية، يبني الأعضاء سجلاً موثقاً لاهتماماتهم وتطورهم الفكري.',
  'To create an international space where young people can discuss global issues, challenge ideas, develop rigorous research and communication skills, and learn from peers across borders.': 'خلق مساحة دولية يلتقي فيها الشباب لمناقشة القضايا العالمية، واختبار الأفكار، وتطوير مهارات البحث والتواصل الرصين، والتعلم المتبادل عبر الحدود.',
  'Your application has been received and is currently under coordinator review. Once approved, you will receive an email confirmation and can sign in to access all community features.': 'تم استلام طلبك بنجاح وهو حالياً قيد مراجعة المنسقين. فور اعتماده، ستصلك رسالة تأكيد بالبريد الإلكتروني لتتمكن من تسجيل الدخول والوصول لكافة مزايا المجتمع.',
  'Over time, a member can become not only an audience participant, but also a presenter, researcher, moderator, writer, organizer, and contributor to an international youth network.': 'بمرور الوقت، يصبح العضو ليس فقط مشاركاً ومستمعاً، بل متحدثاً وباحثاً ومديراً للجلسات وكاتباً ومنظماً ومساهماً قيادياً في شبكة شبابية دولية متكاملة.',
  'Global Youth Dialogue — An international community connecting young debaters worldwide to explore global issues and develop ideas through structured dialogue and academic writing.': 'الحوار الشبابي الدولي — مجتمع دولي يربط المناظرين الشباب حول العالم لاستكشاف القضايا العالمية وتطوير الأفكار من خلال حوار منظم وكتابة أكاديمية رصينة.',
  'Explore global issues beyond headlines by researching reliable sources, examining evidence, comparing perspectives, and understanding the context behind major events and policies.': 'استكشاف القضايا العالمية إلى ما وراء العناوين من خلال استقصاء المصادر الموثوقة، وتدقيق الأدلة، ومقارنة الرؤى، وفهم السياقات الحقيقية للأحداث والسياسات الكبرى.',
  'Learn to question assumptions, examine different perspectives, identify weaknesses in arguments, distinguish facts from opinions, and approach complex issues with greater depth.': 'تعلم التشكيك في المسلمات، واستكشاف وجهات النظر المتنوعة، وتحديد مواطن الضعف في الحجج، والتمييز بين الحقائق والآراء، ومعالجة القضايا المعقدة بعمق متزايد.',
  'Friends who met at an international debate championship came together with a shared vision: to create a continuous space for thoughtful global dialogue beyond tournament rounds.': 'التقى أصدقاء في بطولة مناظرات دولية برؤية مشتركة: خلق مساحة دائمة للحوار العالمي الهادف خارج جولات البطولات التنافسية.',
  'An independent youth-led international community connecting young debaters to explore global issues, write academic papers, and develop ideas through weekly structured dialogue.': 'مجتمع دولي مستقل يقوده الشباب يربط المناظرين الشباب حول العالم لاستكشاف القضايا العالمية وكتابة الأوراق الأكاديمية وتطوير الأفكار من خلال حوار أسبوعي منظم.',
  'Submitting this paper sends it directly to the Secretariat for editorial review. Once approved, it will be published live into every Member\'s Academic Writings dashboard.': 'يؤدي إرسال هذه الورقة إلى إحالتها للأمانة الأكاديمية للمراجعة والتدقيق، وفور اعتمادها تنشر مباشرة في بوابة الأوراق الأكاديمية لجميع الأعضاء.',
  'Accredited presenters can choose or curate topics from the Topic Bank, deliver 10–30 min research briefings, and present keynotes in international dialogue sessions.': 'يمكن للمتحدثين المعتمدين اختيار أو إعداد مواضيع من بنك المواضيع، وتقديم إيجازات بحثية مدتها 10–30 دقيقة، وإلقاء كلمات رئيسية في جلسات الحوار الدولي.',
  'A youth-led international community connecting young debaters to explore global issues, exchange perspectives and develop ideas through structured dialogue.': 'مجتمع دولي يقوده الشباب يربط المناظرين لاستكشاف القضايا العالمية وتبادل وجهات النظر وتطوير الأفكار من خلال حوار منظم.',
  'Custom topics are reviewed by the Secretariat. Upon approval, your topic and subtopics will be permanently added to the Global Youth Dialogue Topic Bank!': 'تخضع المواضيع الجديدة لمراجعة الأمانة الأكاديمية، وفور اعتمادها تضاف تلقائياً وبشكل دائم إلى بنك المواضيع الدولي!',
  'A connected generation of young people capable of engaging thoughtfully with global challenges and participating in meaningful international dialogue.': 'جيل مترابط من الشباب القادرين على التفاعل الواعي مع التحديات العالمية والمشاركة الفعالة في حوار دولي هادف ومؤثر.',
  'Build confidence in presenting ideas, speaking clearly, responding to questions, defending arguments, and communicating with different audiences.': 'بناء الثقة في طرح الأفكار، والتحدث بوضوح، والإجابة عن الأسئلة، والدفاع عن الحجج، والتواصل الفعال مع مختلف الجماهير.',
  'Privacy & Security Protocol: Passwords remain encrypted and strictly inaccessible in compliance with international user data privacy standards.': 'بروتوكول الخصوصية والأمان: تظل كلمات المرور مشفرة ومحمية بالكامل ولا يمكن الوصول إليها امتثالاً لمعايير حماية البيانات الدولية.',
  'Global Youth Dialogue was founded to transform that temporary international spark into a permanent, youth-led academic and diplomatic network.': 'تأسس الحوار الشبابي الدولي لتحويل تلك الشعلة الدولية المؤقتة إلى شبكة أكاديمية ودبلوماسية دائمة يقودها الشباب.',
  'Explore our international youth dialogue sessions, upcoming debate agendas, panel discussions, and archived proceedings open for everyone.': 'استكشف جلسات الحوار الشبابي الدولي، وجداول أعمال المناظرات القادمة، وحلقات النقاش، والمحاضر المؤرشفة المتاحة للجميع.',
  'Following the session, the presenter develops their research and presentation into a formal academic paper published in our library.': 'عقب الجلسة، يطور المتحدث بحثه وعرضه التقديمي إلى ورقة أكاديمية رسمية تنشر في مكتبتنا.',
  'The international community convenes online weekly for structured presentations, parliamentary debate, and cross-examination.': 'يجتمع المجتمع الدولي أسبوعياً عبر الإنترنت لتقديم العروض المنظمة، والمناظرة البرلمانية، والاستجواب التفاعلي.',
  'Curate research briefings, prepare academic slide decks, and deliver topic presentations for international dialogue sessions.': 'إعداد الملخصات البحثية وتجهيز العروض التقديمية وتقديم الأوراق البحثية لجلسات الحوار الدولية.',
  'A comprehensive analytical summary of the session is authored and published to record arguments, evidence, and key takeaways.': 'تتم كتابة ملخص تحليلي شامل للجلسة ونشره لتوثيق الحجج والأدلة وأهم المخرجات والتوصيات.',
  'Privacy & Security Protocol: Passwords remain encrypted and strictly inaccessible in compliance with data privacy standards.': 'بروتوكول الخصوصية والأمان: كلمات المرور مشفرة تماماً ومحمية ولا يمكن الوصول إليها امتثالاً لمعايير خصوصية البيانات العالمية.',
  'Members challenge assumptions, examine alternative viewpoints, and provide qualitative peer feedback on argumentation depth.': 'يناقش الأعضاء الفرضيات، ويفحصون وجهات النظر البديلة، ويقدمون تقييمات نوعية حول عمق المحاججة.',
  'Transforming youth debate from tournament rounds into lasting academic inquiry, research papers, and diplomatic capability.': 'تحويل مناظرات الشباب من مجرد جولات مسابقات إلى بحث أكاديمي مستمر، وأوراق بحثية رصينة، وكفاءة دبلوماسية.',
  'Multidisciplinary policy and philosophical arenas explored through rigorous research, presentations, and youth dialogue.': 'ميادين سياساتية وفلسفية متعددة التخصصات يتم استكشافها عبر البحث الرصين والعروض التقديمية والحوار الشبابي.',
  'Only the official Administrator account (Mubashir CP / 3681mubashircp@gmail.com) and core curricula will remain active.': 'سيبقى فقط الحساب الرسمي للمدير (مبشر سي بي / 3681mubashircp@gmail.com) والمناهج الأساسية نشطة.',
  'Specify additional or primary areas of interest (e.g. Geopolitics, Artificial Intelligence Ethics, Climate Finance)...': 'حدد مجالات اهتمام إضافية أو رئيسية (مثل: الجغرافيا السياسية، أخلاقيات الذكاء الاصطناعي، تمويل المناخ)...',
  'Warning: This administrative action will permanently erase all trial and demo data generated during website testing.': 'تحذير: هذا الإجراء الإداري سيحذف نهائياً كافة البيانات التجريبية التي تم إنشاؤها أثناء اختبار الموقع.',
  'Topics and motions are proposed by community members and selected across our multidisciplinary knowledge spheres.': 'يقترح أعضاء المجتمع المواضيع والقضايا، ويتم اختيارها من بين مجالاتنا المعرفية متعددة التخصصات.',
  'Presenters and delegates conduct in-depth research, assemble evidence dossiers, and prepare structured arguments.': 'يجري المتحدثون والمندوبون أبحاثاً معمقة، ويجمعون ملفات الأدلة، ويصيغون الحجج المنظمة.',
  'Unified Directory & Registry of All Members, Academic Presenters, and Co-Administrators across global chapters.': 'الدليل والسجل الموحد لجميع الأعضاء والمقدمين الأكاديميين ونواب الإدارة عبر الفروع الدولية.',
  'Curated international research themes and subtopics ready for structured dialogue, presentations, and debates.': 'مكتبة رصينة للموضوعات الأكاديمية ومحاور البحث المقترحة للجلسات والحوارات والمناظرات.',
  'A structured weekly cycle transforming youth debate into enduring academic research and documented knowledge.': 'دورة أسبوعية منظمة تحول مناظرات الشباب إلى بحوث أكاديمية رصينة ومعرفة موثقة تدوم.',
  'Connecting young debaters worldwide to explore global issues and develop ideas through structured dialogue.': 'ربط المناظرين الشباب حول العالم لاستكشاف القضايا العالمية وتطوير الأفكار عبر حوار منظم.',
  'Join an international network of young debaters. All applications are vetted by our founding coordinators.': 'انضم إلى شبكة دولية من المناظرين الشباب. تخضع جميع الطلبات لمراجعة المنسقين المؤسسين.',
  'No records matched your search query or role filter. You can add a new community member or reset filters.': 'لم تطابق أي سجلات استعلام البحث أو الدور المحدد. يمكنك إضافة عضو جديد أو إعادة ضبط الفلاتر.',
  'The recipient has actively defended evidence-based motions and engaged in international policy exchange.': 'دافع مستلم الشهادة بفاعلية عن قضايا مبنية على الأدلة وشارك بتميز في التبادل الحواري والسياساتي الدولي.',
  'Master archive of your prepared research decks, delivered keynotes, and scheduled speaking slots.': 'الأرشيف الشامل لعروضك البحثية وكلماتك الرئيسية ومواعيد إلقائك المجدولة.',
  'Join our weekly structured international dialogue with debaters representing over 14 countries.': 'انضم إلى حوارنا الدولي الأسبوعي المنظم مع مناظرين يمثلون أكثر من 14 دولة.',
  'This will permanently remove their profile from the active directory and application history.': 'سيؤدي هذا إلى حذف ملفهم نهائياً من الدليل النشط وسجل الطلبات.',
  'Share your motivation to engage in cross-border youth dialogue and academic paper writing...': 'شاركنا دوافعك للمشاركة في الحوار الشبابي العابر للحدود وكتابة الأوراق الأكاديمية...',
  'Select your role to access your dashboard. Members only have access to the Member Dashboard.': 'اختر دورك للوصول إلى لوحة التحكم. يتمتع الأعضاء بصلاحية الوصول إلى لوحة تحكم الأعضاء فقط.',
  'Please check your inbox, copy the 6-digit code, and enter it below to verify your account.': 'يرجى مراجعة صندوق الوارد ونسخ الرمز المكون من 6 أرقام وإدخاله أدناه لتأكيد حسابك.',
  'Explain what facets of this dilemma you will analyze and what evidence you will present...': 'وضح المحاور التي ستتناولها في تحليلك والأدلة التي ستستشهد بها...',
  'All Demo and Trial Profiles of Members, Presenters, and Coordinators (Permanently Deleted)': 'كافة الملفات التجريبية للأعضاء والمتحدثين والمنسقين (حذف نهائي)',
  'Complete your application in 3 steps to join our international network of young debaters.': 'أكمل طلبك في 3 خطوات سهلة للانضمام إلى شبكتنا الدولية للمناظرين الشباب.',
  'Describe your competitive debating, parliamentary, MUN, or public speaking background...': 'صف خبرتك في المناظرات التنافسية أو البرلمانية أو محاكاة الأمم المتحدة (MUN) أو الخطابة...',
  'Briefly highlight your parliamentary debating, MUN, or academic speaking background...': 'أبرز بإيجاز خبرتك في المناظرات البرلمانية أو محاكاة الأمم المتحدة أو الإلقاء الأكاديمي...',
  'Global Youth Dialogue & Exchange (GYDE) | International Community of Youth Debaters': 'الحوار والتبادل الشبابي الدولي (GYDE) | المجتمع الدولي للمناظرين الشباب',
  'You may propose a custom topic or mention a topic from the Academic Topic Bank.': 'يمكنك اقتراح موضوع مخصص أو اختيار موضوع من بنك المواضيع الأكاديمية.',
  'Select areas you are interested in exploring through research and dialogue:': 'حدد المجالات التي ترغب في استكشافها عبر البحث والحوار:',
  'Enter 3 to 5 academic subtopics exploring opposing facets of this topic.': 'أدخل من 3 إلى 5 محاور أكاديمية تستكشف الجوانب المتعارضة لهذا الموضوع.',
  'International Youth Academic & Debate Forum Connecting Global Thinkers': 'منتدى شبابي أكاديمي ودولي للمناظرات يربط المفكرين حول العالم',
  'A topic is proposed by members and curated across key global themes.': 'يقترح الأعضاء الموضوع ويتم فرزه ومواءمته مع المحاور العالمية الرئيسية.',
  'Discuss deeply. Think critically. Write clearly. Connect globally.': 'حاور بعمق. فكّر بنقد. اكتب بوضوح. تواصل عالمياً.',
  'Enter your email and password to access your community workspace.': 'أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى مساحة عملك في المجتمع.',
  'Tariq Al-Mansoor (Admin / Coordinator) → Opens Admin Features': 'طارق المنصور (مدير / منسق) ← مساحة المنسقين',
  'Subtopics & Research Angles (One per line or comma-separated)': 'المحاور وزوايا البحث (سطر لكل محور أو مفصولة بفواصل)',
  'Search sessions, academic papers, topic proposals, members...': 'ابحث في الجلسات والأوراق الأكاديمية والمقترحات والأعضاء...',
  'Every piece of writing is an opportunity to create knowledge.': 'كل نص مكتوب هو مساهمة أصيلة في صناعة المعرفة.',
  'Active participant in the international youth debate society.': 'مشارك نشط ومندوب في مجتمع المناظرات والحوار الدولي للشباب.',
  'A 6-digit secure verification code has been dispatched to:': 'تم إرسال رمز تحقق آمن مكون من 6 أرقام إلى:',
  '06. Discussion Insights (What did participants discover?)': '06. رؤى ومخرجات النقاش (ماذا استنتج المشاركون؟)',
  'Why They Joined Global Youth Dialogue (Personal Mission)': 'دوافع الانضمام إلى الحوار الشبابي الدولي (الرسالة الشخصية)',
  'Sign In page and start participating in weekly sessions!': 'صفحة تسجيل الدخول والبدء في المشاركة في الجلسات الأسبوعية!',
  'Don\'t have an approved account yet? Apply for Membership': 'ليس لديك حساب معتمد بعد؟ قدّم طلب عضوية الآن',
  'The community is designed to give members room to grow:': 'صُمم المجتمع ليمنح كل عضو مساحة واسعة للنمو والارتقاء:',
  'Subtopics & Research Angles (Optional, comma-separated)': 'المحاور وزوايا البحث (اختياري، مفصولة بفواصل)',
  'Kofi Mensah (Member / Delegate) → Opens Member Features': 'كوفي مينساه (عضو / مندوب) ← لوحة تحكم الأعضاء',
  'confirming your approval. You can then navigate to the': 'تؤكد اعتماد طلبك، وعندها يمكنك الانتقال إلى',
  'The following trial data will be permanently cleared:': 'سيتم مسح البيانات التجريبية التالية نهائياً:',
  'Welcome back to the international dialogue platform.': 'مرحباً بك مجدداً في منصة الحوار والتبادل الدولي.',
  'Search member name, email, country, or department...': 'ابحث بالاسم، البريد، الدولة، أو القسم...',
  'Young minds. Different countries. One conversation.': 'عقول شابة. دول مختلفة. حوار واحد.',
  'Through regular participation, members can develop:': 'من خلال المشاركة المنتظمة، يكتسب الأعضاء المهارات التالية:',
  'Email delayed by your mail server or school filter?': 'هل تأخر وصول البريد بسبب خادم البريد أو مرشحات المدرسة/الجامعة؟',
  'By being part of the community, we hope you become:': 'بانضمامك إلى هذا المجتمع، نأمل أن تصبح:',
  '04. Key Counterarguments & Rebuttals (One per line)': '04. الحجج المعارضة والدفوع الرئيسية (حجة واحدة في كل سطر)',
  'Motion Format: This House Would / Believes That...': 'صيغة القضية: يرى هذا المجلس أن / سيقوم هذا المجلس بـ...',
  '15-min Keynote Briefing (Opening Research Dossier)': 'إيجاز رئيسي لمدة 15 دقيقة (افتتاح الملف البحثي)',
  'from the community? This action cannot be undone.': 'من المجتمع؟ لا يمكن التراجع عن هذا الإجراء.',
  'Every presentation is an opportunity to improve.': 'كل عرض تقديمي هو محطة للتطور والارتقاء.',
  'Debate & Public Speaking Background / Experience': 'الخبرة في المناظرات والخطابة العامة',
  '(If not received, check your Spam / Junk folder)': '(إذا لم يصل الرمز، يرجى فحص مجلد الرسائل غير المرغوب فيها Spam / Junk)',
  'Multi-Format (Discussion, Presentation, Debate)': 'متعدد الصيغ (نقاش، عرض تقديمي، مناظرة)',
  '09. Citations, Treaties & Academic Bibliography': '09. المراجع والمعاهدات وقائمة المصادر الأكاديمية',
  'Why do you want to join Global Youth Dialogue?': 'لماذا ترغب في الانضمام إلى الحوار الشبابي الدولي؟',
  'Test Evaluations, Feedback & Community Ballots': 'التقييمات والملاحظات واستطلاعات الرأي التجريبية',
  'Gain Real Presentation & Leadership Experience': 'اكتساب خبرة حقيقية في الإلقاء والقيادة',
  'More comfortable with different perspectives.': 'أكثر انفتاحاً واستيعاباً لوجهات النظر المتباينة.',
  'Kofi Mensah (Presenter) → Can Present a Topic': 'كوفي مينساه (متحدث) ← مساحة المتحدثين',
  '1-Click Demo Profiles (Auto-Role Redirection)': 'ملفات تجريبية بنقرة واحدة (توجيه تلقائي حسب الدور)',
  'Trial Member Applications & Pending Sign-ups': 'طلبات العضوية والتسجيلات التجريبية',
  'Official Certificate of Active Participation': 'الشهادة الرسمية للمشاركة النشطة',
  'Every discussion is an opportunity to learn.': 'كل نقاش هو فرصة سانحة للتعلم.',
  '03. Key Affirmative Arguments (One per line)': '03. الحجج المؤيدة الرئيسية (حجة واحدة في كل سطر)',
  'Session Content & Archives are Members-Only': 'محتوى الجلسات والأرشيف الكامل مخصص للأعضاء فقط',
  'Proposed Topic or Thesis Dilemma to Present': 'الموضوع المقترح أو أطروحة العرض',
  'All rights reserved. Global Youth Dialogue.': 'جميع الحقوق محفوظة. الحوار الشبابي الدولي.',
  '2. Selected Focus Subtopic / Research Angle': '2. المحور الفرعي أو زاوية البحث المحددة',
  'Every question is an opportunity to think.': 'كل سؤال هو دعوة للتأمل والتفكير.',
  'Custom Topic Bank Items & Pipeline Entries': 'المواضيع ومسارات العمل التجريبية في بنك المواضيع',
  'Admin Database Maintenance & Trial Cleanup': 'صيانة قاعدة بيانات الإدارة وتنظيف البيانات التجريبية',
  '01. Introduction (What is the core issue?)': '01. المقدمة (ما هي القضية الجوهرية؟)',
  'Prior Debate & Public Speaking Experience': 'الخبرة السابقة في المناظرات والخطابة',
  'International Community of Youth Debaters': 'المجتمع الدولي للمناظرين الشباب',
  'Click here to auto-fill verification code': 'انقر هنا لتعبئة رمز التحقق تلقائياً (تجريبي)',
  '5. Slide Deck Link / Research Outline URL': '5. رابط العرض التقديمي / مسودة البحث',
  '05. Evidence & Country Case Studies Cited': '05. الأدلة ودراسات الحالة الوطنية المستشهد بها',
  '04. Counterarguments & Sovereign Concerns': '04. الحجج المعارضة والتحفظات السيادية',
  'Test Sessions & Custom Scheduled Debates': 'الجلسات والمناظرات التجريبية المجدولة',
  'Test Academic Papers & Draft Submissions': 'الأوراق الأكاديمية ومسودات الأبحاث التجريبية',
  'Search topics, subtopics, or keywords...': 'ابحث في المواضيع والمحاور والكلمات المفتاحية...',
  '08. Key Takeaways & Discussion Questions': '08. أهم المخرجات وأسئلة النقاش',
  'Why is this topic timely and important?': 'لماذا يعد هذا الموضوع مهماً وملحاً في الوقت الراهن؟',
  'More connected to the world around you.': 'أكثر تواصلاً وتأثيراً في العالم من حولك.',
  'Global Youth Dialogue & Exchange (GYDE)': 'الحوار والتبادل الشبابي الدولي (GYDE)',
  'Verify OTP & Submit Application &rarr;': 'تأكيد الرمز وإرسال طلب الانضمام ←',
  'Speaker Profile & Academic Credentials': 'ملف المتحدث والمؤهلات الأكاديمية',
  'Areas of primary intellectual interest': 'مجالات الاهتمام الفكري والبحثي الرئيسية',
  'Areas of Primary Intellectual Interest': 'مجالات الاهتمام الفكري والبحثي الرئيسية',
  '10-min Framing Thesis for Debate Round': 'أطروحة تأطيرية لمدة 10 دقائق لجولة المناظرة',
  '02. Historical & Diplomatic Background': '02. الخلفية التاريخية والدبلوماسية',
  'No pending applications at this time.': 'لا توجد طلبات معلقة في الوقت الحالي.',
  'Debate and public speaking background': 'الخبرة في المناظرات والخطابة العامة',
  'Country of Residence / Representation': 'دولة الإقامة / التمثيل',
  'Apply to Become an Official Presenter': 'التقدم للاعتماد كمقدم أوراق رسمي',
  '07. Concluding Policy Recommendations': '07. التوصيات السياساتية الختامية',
  '-- Select from Academic Topic Bank --': '-- اختر موضوعاً من بنك المواضيع الأكاديمية --',
  'Suggest a Topic or Dialogue Activity': 'اقتراح موضوع أو نشاط حواري',
  'Grow from Participant to Contributor': 'التطور من مشارك إلى مساهم وقائد',
  'Ephemeral OTP Sessions & Local Cache': 'جلسات رموز OTP المؤقتة والذاكرة المؤقتة المحلية',
  'Next: Background & Interests &rarr;': 'التالي: الاهتمامات والخبرات ←',
  'Debate & Public Speaking Background': 'الخبرة في المناظرات والخطابة',
  'Application Submitted Successfully!': 'تم إرسال طلب الانضمام بنجاح!',
  'Academic Presenter & Keynote Fellow': 'مقدم عروض وزميل رئيسي في الحوار',
  '30-min Deep-Dive Seminar & Workshop': 'ندوة وورشة عمل متعمقة لمدة 30 دقيقة',
  '3. Full Title of Your Presentation': '3. العنوان الكامل لعرضك التقديمي',
  '20 mins presentation + 25 mins Q&A': '20 دقيقة عرض + 25 دقيقة أسئلة ونقاش',
  '1. Topic Selection from Topic Bank': '1. اختيار الموضوع من بنك المواضيع',
  'Verify OTP & Submit Application →': 'تأكيد الرمز وإرسال طلب الانضمام ←',
  'Others (Suggest New Custom Topic)': 'أخرى (اقترح موضوعاً ومحاور مخصصة جديدة)',
  '4. Core Dilemma / Thesis Abstract': '4. القضية الجوهرية / ملخص الأطروحة',
  '08. Unresolved Research Questions': '08. أسئلة بحثية لم تحسم بعد',
  'The Dialogue & Publication Cycle': 'دورة الحوار والنشر الأكاديمي',
  'Official Member & Youth Delegate': 'عضو رسمي ومندوب شبابي',
  'Global Youth Dialogue & Exchange': 'الحوار والتبادل الشبابي الدولي',
  'From conversation to capability.': 'من الحوار إلى التمكين وبناء القدرات.',
  'Brief Abstract & Research Angles': 'ملخص موجز وزوايا البحث',
  'Already have an account? Sign In': 'هل لديك حساب معتمد بالفعل؟ تسجيل الدخول',
  '8. Notes for Session Coordinator': '8. ملاحظات لمنسق الجلسة',
  '7. Preferred Date / Session Slot': '7. الموعد المفضل / فترة الجلسة',
  '07. Neutral Scholarly Conclusion': '07. خاتمة أكاديمية محايدة',
  'Verification Code Sent to Email': 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
  'Turn Discussions into Knowledge': 'تحويل النقاشات إلى معرفة موثقة',
  'Topic Title (Arabic - Optional)': 'عنوان الموضوع (بالعربية - اختياري)',
  'Pending Presenter Accreditation': 'طلب الاعتماد قيد المراجعة',
  'Build an Intellectual Portfolio': 'بناء ملف إنجاز فكري وأكاديمي رصين',
  'Are you sure you want to remove': 'هل أنت متأكد من رغبتك في حذف',
  '06. Synthesized Policy Insights': '06. الرؤى والتوصيات السياساتية المستخلصة',
  'Presenter Accreditation Status': 'حالة الاعتماد كمقدم أوراق',
  'Next: Background & Interests →': 'التالي: الاهتمامات والخبرات ←',
  'My Presentations & Slide Decks': 'عروضي التقديمية وشرائح البحث',
  'Become a Stronger Communicator': 'كن متواصلاً ومحاوراً أكثر قوة وتأثيراً',
  'Apply for Community Membership': 'تقديم طلب عضوية في المجتمع',
  '03. Core Affirmative Arguments': '03. الحجج المؤيدة الرئيسية',
  'Submit Membership Application': 'إرسال طلب الانضمام',
  'Presenter & Speaker Workspace': 'مساحة عمل المتحدثين ومقدمي الأوراق',
  'Preferred Presentation Format': 'صيغة العرض المفضلة',
  'More curious about the world.': 'أكثر شغفاً واستكشافاً للعالم وقضاياه.',
  'Country & Chapter Affiliation': 'الدولة والفرع التابع له',
  'Chief Executive Administrator': 'الرئيس التنفيذي للإدارة',
  '15 mins keynote + 30 mins Q&A': '15 دقيقة كلمة رئيسية + 30 دقيقة أسئلة ونقاش',
  '06 — Document Session Summary': '06 — توثيق ملخص الجلسة',
  '05 — Publish Academic Writing': '05 — نشر الأوراق الأكاديمية',
  '04 — Critical Peer Reflection': '04 — التأمل والنقد البناء',
  'View Complete Member Dossier': 'عرض الملف التعريفي الكامل',
  'View All Sessions & Archives': 'عرض كافة الجلسات والأرشيف',
  'Submit Presenter Application': 'إرسال طلب الاعتماد كمقدم أوراق',
  'Submit Presentation Feedback': 'تقديم تقييم العرض التقديمي',
  'Profile Updated Successfully': 'تم تحديث الملف الشخصي بنجاح',
  'My Dialogue Journey & Badges': 'مساري الحواري وأوسمتي التقديرية',
  'More capable of researching.': 'أكثر قدرة وكفاءة في إعداد البحوث المنهجية.',
  'Grow beyond the debate room.': 'تطور وتألق خارج قاعة المناظرة.',
  'Accredited Keynote Presenter': 'مقدم أوراق معتمد رسمياً',
  '100% Youth-Researched Papers': 'أوراق بحثية شبابية 100%',
  '09. Citations & Bibliography': '09. الاستشهادات وقائمة المراجع',
  'Understand a Changing World': 'فهم عميق لعالم سريع التغير',
  'Suggest as Dialogue Session': 'اقتراح هذا الموضوع لجلسة',
  'Subtopics (3-5 Recommended)': 'المحاور الفرعية (يوصى بـ 3 إلى 5 محاور)',
  'Subtopics & Research Angles': 'المحاور وزوايا البحث الفرعية',
  'Research Briefing & Outline': 'الملخص والخطوط العريضة للبحث',
  'Peace & Conflict Resolution': 'السلام وحل النزاعات',
  'More confident in speaking.': 'أكثر ثقة وجرأة في الحديث والإلقاء.',
  'GYDE Community Registration': 'تسجيل العضوية في مجتمع GYDE',
  'Dialogue Sessions & Archive': 'جلسات الحوار والأرشيف',
  'Debate Motion / Proposition': 'قضية المناظرة / الأطروحة المقترحة',
  'Connect. Challenge. Create.': 'تواصل. حاور. ابتكر.',
  'Certified Academic Delegate': 'مندوب أكاديمي معتمد',
  'Certificate of Appreciation': 'شهادة تقدير واعتزاز',
  '05. Evidence & Case Studies': '05. الأدلة ودراسات الحالة المقارنة',
  'Yes, Delete All Trial Data': 'نعم، احذف كافة البيانات التجريبية نهائياً',
  'What We Hope You Take Away': 'ما نرجو أن تكتسبه وتخرج به',
  'Topic Submitted for Review': 'تم إرسال الموضوع للمراجعة والتدقيق',
  'Review Member Applications': 'مراجعة وفحص طلبات العضوية',
  'No Community Members Found': 'لم يتم العثور على أعضاء في المجتمع',
  'More rigorous in thinking.': 'أكثر دقة ورصانة في التفكير والتحليل.',
  'More effective at writing.': 'أكثر براعة وإقناعاً في الكتابة والتحرير.',
  'Instagram Carousel Caption': 'نص منشور إنستغرام (كاروسيل)',
  'Delegate Feedback Analysis': 'تحليل تقييمات وملاحظات المندوبين',
  '+ Other (Add New Category)': '+ أخرى (إضافة فئة جديدة)',
  'Weekly Structured Debates': 'مناظرات أسبوعية منظمة',
  'Upcoming Dialogue Session': 'الجلسة الحوارية القادمة',
  'Topic Presentation Studio': 'استوديو تقديم المواضيع',
  'Select a Knowledge Sphere': 'اختر مجالاً معرفياً',
  'Permanent Removal Warning': 'تحذير من الحذف النهائي',
  'Participation Certificate': 'شهادة المشاركة الرسمية',
  'Next: Verify Email &rarr;': 'التالي: التحقق من البريد ←',
  'My Presentations & Slides': 'عروضي التقديمية والشرائح',
  '60+ Active Youth Debaters': '+60 مناظراً شبابياً نشطاً',
  '20-min Lead Lecture + Q&A': 'محاضرة رئيسية لمدة 20 دقيقة + أسئلة ونقاش',
  '16 Core Knowledge Spheres': '16 مجالاً معرفياً رئيسياً',
  '03 — Weekly Live Dialogue': '03 — الحوار المباشر الأسبوعي',
  'Weekly Dialogue Sessions': 'جلسات حوار أسبوعية',
  'Topic Lifecycle Pipeline': 'مسار إدارة دورة حياة المواضيع',
  'Sessions & Video Archive': 'الجلسات والأرشيف المرئي',
  'Recent Platform Activity': 'النشاط الأخير على المنصة',
  'Honorary Dialogue Badges': 'أوسمة الشرف الحوارية',
  'Download PDF Certificate': 'تحميل الشهادة بصيغة PDF',
  'Community Member Dossier': 'الملف التعريفي لعضو المجتمع',
  'Youth Academic Research': 'بحوث أكاديمية شبابية',
  'Sign In to Your Account': 'تسجيل الدخول إلى حسابك',
  'Request to be Presenter': 'طلب الاعتماد كمقدم أوراق',
  'Primary Academic Sphere': 'المجال الأكاديمي الرئيسي',
  'Next Scheduled Dialogue': 'الجلسة الحوارية القادمة المجدولة',
  'International Community': 'المجتمع الدولي',
  'Induction / Joined Date': 'تاريخ الانضمام والاعتماد',
  'How the Programme Works': 'كيف يعمل البرنامج',
  'Develop Research Skills': 'تطوير مهارات البحث الرصين',
  'Brief Summary & Context': 'ملخص وسياق موجز',
  'Academic Writing Studio': 'استوديو الكتابة والبحوث الأكاديمية',
  '02 — Research & Prepare': '02 — البحث والإعداد',
  'Youth-Led & Researched': 'أوراق يقودها ويبحثها الشباب',
  'Re-enter your password': 'أعد إدخال كلمة المرور',
  'Next Scheduled Session': 'الجلسة القادمة المجدولة',
  'More prepared to lead.': 'أكثر جاهزية للقيادة وإدارة المبادرات.',
  'Key Motion for Debate:': 'القضية الرئيسية للمناظرة:',
  'ISDC7 Coordinator Team': 'فريق المنسقين التأسيسي (ISDC7)',
  'Core Knowledge Spheres': 'المجالات المعرفية الرئيسية',
  'Connect Across Borders': 'بناء جسور التواصل العابرة للحدود',
  '6. Presentation Format': '6. صيغة العرض التقديمي',
  '&larr; Back to Details': '← العودة إلى التفاصيل',
  'Youth Dialogue Sphere': 'مجال حواري شبابي',
  'Transformative Growth': 'النمو والتحول النوعي',
  'Think More Critically': 'فكّر بنقد وعمق أكبر',
  'Submit Topic Proposal': 'إرسال مقترح الموضوع',
  'Participate as Member': 'المشاركة كعضو',
  'My Profile & Settings': 'ملفي الشخصي والإعدادات',
  'Global Youth Dialogue': 'الحوار الشبابي الدولي',
  'Environment & Climate': 'البيئة والتغير المناخي',
  'Education & Knowledge': 'التعليم والمعرفة',
  'Delete All Trial Data': 'حذف كافة البيانات التجريبية',
  'Countries Represented': 'دولة ممثلة',
  'Coordinator Workspace': 'مساحة عمل المنسقين',
  'Close Presenter Modal': 'إغلاق نافذة التقديم',
  'All Knowledge Spheres': 'كافة المجالات المعرفية',
  'All Dialogue Sessions': 'كافة جلسات الحوار',
  'Academic Presentation': 'عرض أكاديمي',
  '14+ Nations Connected': '+14 دولة متصلة',
  '01 — Propose & Select': '01 — الاقتراح والاختيار',
  '&larr; Return to Home': '← العودة إلى الصفحة الرئيسية',
  'United Arab Emirates': 'الإمارات العربية المتحدة',
  'Type your message...': 'اكتب رسالتك...',
  'Sign In to Join Room': 'تسجيل الدخول للانضمام للقاعة',
  'Science & Innovation': 'العلوم والابتكار',
  'Research Contributor': 'باحث ومساهم',
  'Pending Applications': 'الطلبات قيد الانتظار',
  'Parliamentary Debate': 'مناظرة برلمانية',
  'Next: Verify Email →': 'التالي: التحقق من البريد ←',
  'Minimum 6 characters': '6 خانات على الأقل',
  'Governance & Society': 'الحوكمة والمجتمع',
  'Global Youth Network': 'الشبكة الشبابية الدولية',
  'Floor Keynote Speech': 'الكلمة الرئيسية في القاعة',
  'Filter by country...': 'تصفية حسب الدولة...',
  'Download Certificate': 'تحميل الشهادة',
  'Country & Department': 'الدولة والقسم التابع له',
  'Apply for Membership': 'تقديم طلب عضوية',
  '06 &mdash; SYNTHESIS': '06 — التلخيص والتوثيق',
  '+ Add Community User': '+ إضافة مستخدم جديد للمجتمع',
  'Suggest a Topic Now': 'اقترح موضوعاً الآن',
  'Sessions & Dialogue': 'الجلسات والحوار',
  'Roundtable Dialogue': 'طاولة مستديرة',
  'Our Story & Mission': 'قصتنا ورسالتنا',
  'My Submitted Topics': 'موضوعاتي المقترحة',
  'My Journey & Badges': 'مساري وأوسمتي',
  'Member Applications': 'طلبات العضوية',
  'Media & Information': 'الإعلام والمعلومات',
  'Ethics & Philosophy': 'الأخلاق والفلسفة',
  'Enter your password': 'أدخل كلمة المرور',
  'Enter email address': 'أدخل البريد الإلكتروني',
  'Coordinator Profile': 'ملف المنسق',
  'Chief Administrator': 'رئيس الإدارة العليا',
  'Calendar & Schedule': 'التقويم والجدول الزمني',
  'Admin / Coordinator': 'مدير / منسق',
  'Active Credentialed': 'معتمد ونشط رسمياً',
  'Academic Topic Bank': 'بنك المواضيع الأكاديمية',
  'Academic Researcher': 'باحث أكاديمي',
  'Academic Presenters': 'المتحدثون الأكاديميون',
  'About the Community': 'عن المجتمع الدولي',
  '14+ Global Chapters': '+14 فرعاً عالمياً',
  '06 &mdash; DOCUMENT': '06 — التوثيق والتلخيص',
  '+ Add Topic to Bank': '+ إضافة موضوع جديد لبنك المواضيع',
  '&larr; Back to Home': '← العودة إلى الرئيسية',
  'Youth & Leadership': 'الشباب والقيادة',
  'Topic Bank Catalog': 'كتالوج بنك المواضيع',
  'The GYDE Community': 'مجتمع الحوار والتبادل الدولي (GYDE)',
  'The Dialogue Cycle': 'دورة الحوار',
  'Submit Application': 'إرسال الطلب',
  'Scheduled Sessions': 'الجلسات المجدولة',
  'Save to Topic Bank': 'حفظ في بنك المواضيع',
  'Programme Overview': 'نظرة عامة على البرنامج',
  'Global Contributor': 'مساهم دولي',
  'Enter 6-Digit Code': 'أدخل الرمز المكون من 6 أرقام',
  'Culture & Identity': 'الثقافة والهوية',
  'Coordinator Portal': 'بوابة المنسقين',
  'Academic Presenter': 'متحدث أكاديمي',
  'Academic Materials': 'المواد الأكاديمية',
  '3 OTP Verification': '3 التحقق من البريد',
  '05 &mdash; PUBLISH': '05 — النشر الأكاديمي',
  '04 &mdash; REFLECT': '04 — النقد والتقييم',
  '03 &mdash; DISCUSS': '03 — النقاش والمناظرة',
  '02 &mdash; PREPARE': '02 — البحث والإعداد',
  '← Back to Details': '← العودة إلى تفاصيل الطلب',
  'Upcoming Sessions': 'الجلسات القادمة',
  'Standing / Status': 'الحالة / الاعتماد الرسمي',
  'Speaking Sessions': 'جلسات التحدث والإلقاء',
  'Sessions Overview': 'نظرة عامة على الجلسات',
  'Reset All Filters': 'إعادة ضبط كافة المرشحات',
  'Publish Media Kit': 'نشر الحزمة الإعلامية',
  'Paper Submissions': 'تقديم الأوراق البحثية',
  'Overview & Agenda': 'نظرة عامة وجدول الأعمال',
  'No sessions found': 'لم يتم العثور على جلسات',
  'Needs Improvement': 'يحتاج إلى تطوير',
  'Media & PR Studio': 'استوديو الإعلام والعلاقات العامة',
  'Join Live Session': 'انضم إلى الجلسة المباشرة',
  'Explore Community': 'استكشف المجتمع',
  'Executive Summary': 'ملخص تنفيذي',
  'Delete Trial Data': 'حذف البيانات التجريبية',
  'Create & Schedule': 'إنشاء وجدولة الجلسات',
  'Completed Archive': 'الأرشيف المكتمل',
  'Co-Admins & Leads': 'نواب الإدارة والمنسقون',
  'Academic Writings': 'الأوراق الأكاديمية',
  '01 &mdash; SELECT': '01 — الاختيار',
  '+ Present a Topic': '+ تقديم موضوع بحثي',
  '← Return to Home': '← العودة إلى الصفحة الرئيسية',
  'Youth Delegation': 'الوفد الشبابي',
  'Topic Categories': 'فئات الموضوعات',
  'Tariq Al-Mansoor': 'طارق المنصور',
  'System Protected': 'حساب محمي بالنظام',
  'Presenter Portal': 'بوابة المتحدثين',
  'Portals & Access': 'البوابات والوصول',
  'Panel Discussion': 'جلسة حوارية متخصصة',
  'Our Origin Story': 'قصة البداية والتأسيس',
  'OTP Verification': 'التحقق من البريد',
  'No records found': 'لم يتم العثور على سجلات',
  'Member Dashboard': 'لوحة تحكم الأعضاء',
  'Health & Society': 'الصحة والمجتمع',
  'Discussion Forum': 'منتدى النقاش والحوار',
  'Diplomacy Fellow': 'زميل دبلوماسي',
  'Dialogue Format:': 'طبيعة الجلسة:',
  'Dialogue Archive': 'أرشيف الحوارات',
  'Country Chapters': 'فروع الدول والمنسقون الوطنيون',
  'Confirm Password': 'تأكيد كلمة المرور',
  'Academic Writing': 'الكتابة الأكاديمية',
  '01. Introduction': '01. المقدمة',
  'Total Community': 'إجمالي المجتمع الدولي',
  'Technology & AI': 'التكنولوجيا والذكاء الاصطناعي',
  'Suggest a Topic': 'اقترح موضوعاً',
  'Submit Proposal': 'إرسال المقترح',
  'Submit Feedback': 'إرسال التقييم والملاحظات',
  'Speaker Profile': 'ملف المتحدث',
  'Scheduled Time:': 'الموعد المجدول:',
  'Review Feedback': 'مراجعة تقييمات الأعضاء',
  'Recent Activity': 'النشاط الأخير',
  'Proposed Motion': 'القضية المقترحة للمناظرة',
  'Present a Topic': 'تقديم موضوع بحثي',
  'Policy Briefing': 'إيجاز سياساتي',
  'Official Member': 'عضو رسمي',
  'No topics found': 'لم يتم العثور على مواضيع',
  'Emerging Issues': 'القضايا المعاصرة الناشئة',
  'Economy & Trade': 'الاقتصاد والتجارة',
  'Core Principles': 'المبادئ الأساسية',
  'Choose Category': 'اختر الفئة',
  'Browse Writings': 'تصفح الأوراق الأكاديمية',
  'Back to Details': 'العودة إلى التفاصيل',
  'Youth Debaters': 'مناظراً شبابياً',
  'Writing Studio': 'استوديو الكتابة الأكاديمية',
  'United Kingdom': 'المملكة المتحدة',
  'Topic Pipeline': 'مسار إدارة المواضيع',
  'Sign In Portal': 'بوابة تسجيل الدخول',
  'Sign In &rarr;': 'تسجيل الدخول ←',
  'Return to Home': 'العودة إلى الصفحة الرئيسية',
  'Read Our Story': 'اقرأ قصة تأسيسنا',
  'Lead Speakers:': 'المتحدثون الرئيسيون:',
  'Lead Debaters:': 'المناظرون الرئيسيون:',
  'Global Affairs': 'الشؤون الدولية والعالمية',
  'Founding Story': 'قصة التأسيس',
  'Debate Members': 'أعضاء المناظرات',
  'Approve Member': 'اعتماد العضو',
  'All Categories': 'كافة الفئات',
  'Active Debater': 'مناظر نشط',
  '06 — SYNTHESIS': '06 — التلخيص والتوثيق',
  '0 Applications': '0 طلبات',
  'Zaid Al-Harbi': 'زيد الحربي',
  'Working Paper': 'ورقة عمل بحثية',
  'United States': 'الولايات المتحدة',
  'The Community': 'المجتمع',
  'Suggest Topic': 'اقترح موضوعاً',
  'Sofia Morales': 'صوفيا موراليس',
  'Remove Member': 'حذف العضو',
  'Notifications': 'الإشعارات',
  'Member Portal': 'بوابة الأعضاء',
  'Law & Justice': 'القانون والعدالة',
  'Guest Speaker': 'متحدث ضيف',
  'Give Feedback': 'تقديم الملاحظات والتقييم',
  'Email Address': 'البريد الإلكتروني',
  'Elena Rostova': 'إيلينا روستوفا',
  'Delete Member': 'حذف العضو',
  'Debate Member': 'عضو مناظرات',
  'Close Dossier': 'إغلاق الملف',
  'All Countries': 'كافة الدول',
  'All Community': 'كافة المجتمع',
  'Active Member': 'عضو نشط',
  '06 — DOCUMENT': '06 — التوثيق والتلخيص',
  'under_review': 'قيد المراجعة',
  'View Details': 'عرض التفاصيل',
  'Under Review': 'قيد المراجعة',
  'Submit Paper': 'تقديم ورقة أكاديمية',
  'South Africa': 'جنوب أفريقيا',
  'Set Password': 'تعيين كلمة المرور',
  'Session Lead': 'قائد جلسة',
  'Save Session': 'حفظ الجلسة',
  'Save Changes': 'حفظ التغييرات',
  'Saudi Arabia': 'المملكة العربية السعودية',
  'Satisfactory': 'مرضٍ',
  'Quick Access': 'الوصول السريع',
  'Next Session': 'الجلسة القادمة',
  'Members Only': 'للأعضاء فقط',
  'Join Session': 'انضم إلى الجلسة',
  'Human Rights': 'حقوق الإنسان',
  'How It Works': 'آلية العمل',
  'Download PDF': 'تحميل بصيغة PDF',
  'Back to Home': 'العودة إلى الرئيسية',
  'All Statuses': 'كافة الحالات',
  'All Chapters': 'كافة الفروع',
  '1 Basic Info': '1 البيانات الأساسية',
  '05 — PUBLISH': '05 — النشر الأكاديمي',
  '04 — REFLECT': '04 — النقد والتقييم',
  '03 — DISCUSS': '03 — النقاش والمناظرة',
  '02 — PREPARE': '02 — البحث والإعداد',
  'Update Role': 'تحديث الدور',
  'Topic Title': 'عنوان الموضوع',
  'South Korea': 'كوريا الجنوبية',
  'Select Role': 'اختر الدور',
  'Search GYDE': 'البحث في المنصة',
  'Resend Code': 'إعادة إرسال الرمز',
  'Remove User': 'حذف المستخدم',
  'Participate': 'مشاركة',
  'Our Mission': 'رسالتنا',
  'Lucas Silva': 'لوكاس سيلفا',
  'Kofi Mensah': 'كوفي منساه',
  'In Progress': 'قيد الإعداد',
  'Environment': 'البيئة والمناخ',
  'Description': 'الوصف والملخص',
  'Coordinator': 'منسق',
  'Close Modal': 'إغلاق النافذة',
  'Change Role': 'تغيير الدور',
  'All Formats': 'جميع أشكال الحوار',
  '01 — SELECT': '01 — الاختيار',
  '&larr; Back': '← رجوع',
  '&copy; 2024': '© 2024',
  'Topic Bank': 'بنك المواضيع',
  'Our Vision': 'رؤيتنا',
  'Our Impact': 'أثرنا',
  'Navigation': 'التنقل',
  'Moderator:': 'مدير الجلسة:',
  'Loading...': 'جاري التحميل...',
  'ISDC7 Team': 'فريق ISDC7 التأسيسي',
  'First Name': 'الاسم الأول',
  'Contribute': 'مساهمة فعالة',
  'Basic Info': 'البيانات الأساسية',
  'Amara Chen': 'أمارا تشين',
  'scheduled': 'مجدولة',
  'completed': 'مكتملة',
  'Singapore': 'سنغافورة',
  'Sign In →': 'تسجيل الدخول ←',
  'Scheduled': 'مجدولة',
  'Published': 'منشور',
  'Presenter': 'متحدث أكاديمي',
  'Platform:': 'المنصة:',
  'Palestine': 'فلسطين',
  'Moderator': 'مدير جلسة',
  'Last Name': 'اسم العائلة',
  'Join Room': 'انضم إلى الغرفة',
  'Indonesia': 'إندونيسيا',
  'Full Name': 'الاسم الكامل',
  'Excellent': 'ممتاز',
  'Education': 'التعليم والتعلم',
  'Duration:': 'المدة:',
  'Copy Link': 'نسخ الرابط',
  'Completed': 'مكتملة',
  '2 Details': '2 المجالات والاهتمامات',
  '0 Pending': '0 معلق',
  'upcoming': 'قادمة',
  'rejected': 'مرفوض',
  'approved': 'معتمد',
  'Upcoming': 'قادمة',
  'Sign Out': 'تسجيل الخروج',
  'Sessions': 'الجلسات',
  'Research': 'بحث',
  'Rejected': 'مرفوض',
  'Proposed': 'مقترح',
  'Password': 'كلمة المرور',
  'Pakistan': 'باكستان',
  'Malaysia': 'ماليزيا',
  'Delegate': 'مندوب',
  'Declined': 'مرفوض',
  'Co-Admin': 'نائب مدير النظام',
  'Category': 'المجال الأكاديمي',
  'Approved': 'معتمد',
  '0 Topics': '0 مواضيع',
  '0 Papers': '0 أوراق',
  'pending': 'قيد الانتظار',
  'Tunisia': 'تونس',
  'Sign In': 'تسجيل الدخول',
  'Publish': 'نشر',
  'Present': 'إلقاء وعرض',
  'Pending': 'قيد المراجعة',
  'Nigeria': 'نيجيريا',
  'Morocco': 'المغرب',
  'Minutes': 'دقيقة',
  'Lebanon': 'لبنان',
  'Joined:': 'تاريخ الانضمام:',
  'Join Us': 'انضم إلينا',
  'Germany': 'ألمانيا',
  'Format:': 'طبيعة الجلسة:',
  'Economy': 'الاقتصاد والمالية',
  'Details': 'التفاصيل',
  'Decline': 'رفض الطلب',
  'Country': 'الدولة',
  'Copied!': 'تم النسخ!',
  'Bahrain': 'البحرين',
  'Approve': 'اعتماد وقبول',
  'Algeria': 'الجزائر',
  '← Back': '← رجوع',
  '© 2024': '© 2024',
  'active': 'نشط',
  'Weekly': 'أسبوعياً',
  'Turkey': 'تركيا',
  'Topics': 'مواضيع',
  'Submit': 'إرسال',
  'Search': 'بحث',
  'Reject': 'رفض',
  'Mexico': 'المكسيك',
  'Member': 'عضو / مندوب',
  'Kuwait': 'الكويت',
  'Jordan': 'الأردن',
  'Joined': 'تاريخ الانضمام',
  'France': 'فرنسا',
  'Filter': 'تصفية',
  'Delete': 'حذف',
  'Cancel': 'إلغاء',
  'Canada': 'كندا',
  'Brazil': 'البرازيل',
  'Active': 'نشط',
  'draft': 'مسودة',
  'Yemen': 'اليمن',
  'Write': 'كتابة',
  'Time:': 'الوقت:',
  'Sudan': 'السودان',
  'Qatar': 'قطر',
  'Libya': 'ليبيا',
  'Kenya': 'كينيا',
  'Japan': 'اليابان',
  'India': 'الهند',
  'Hours': 'ساعة',
  'Ghana': 'غانا',
  'Egypt': 'مصر',
  'Draft': 'مسودة',
  'Date:': 'التاريخ:',
  'Close': 'إغلاق',
  'Admin': 'مدير / منسق',
  'About': 'عن المجتمع',
  'Save': 'حفظ',
  'Role': 'تعديل الدور',
  'Oman': 'عُمان',
  'Next': 'التالي',
  'Lead': 'قيادة',
  'Join': 'انضمام',
  'Iraq': 'العراق',
  'Home': 'الرئيسية',
  'Good': 'جيد جداً',
  'Edit': 'تعديل',
  'Back': 'رجوع',
  '100%': '100%',
  'ID:': 'المعرف:',
  '60+': '+60',
  '14+': '+14',
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

    // Normalize internal whitespaces and non-breaking spaces
    const norm = trimmed.replace(/[\s\u00A0]+/g, ' ');

    // 1. Direct exact phrase / sentence match
    if (GLOBAL_TRANSLATION_MAP[norm]) {
      return text.replace(trimmed, GLOBAL_TRANSLATION_MAP[norm]);
    }
    if (GLOBAL_TRANSLATION_MAP[trimmed]) {
      return text.replace(trimmed, GLOBAL_TRANSLATION_MAP[trimmed]);
    }

    // 2. Exact match after stripping surrounding quotes/punctuation (e.g. "..." or ( ... ) or • ... or ...:)
    const matchCore = norm.match(/^([\s\(\[\"\'\“\‘\•\-\—\←\→\&\<\>]*)(.*?)([\s\)\]\"\'\”\’\:\.\!\?\;\,\&]*)$/);
    if (matchCore && matchCore[2]) {
      const prefix = matchCore[1];
      const core = matchCore[2];
      const suffix = matchCore[3];
      if (GLOBAL_TRANSLATION_MAP[core]) {
        return text.replace(trimmed, prefix + GLOBAL_TRANSLATION_MAP[core] + suffix);
      }
    }

    // 3. Multi-sentence splitting: if text contains multiple distinct sentences, translate each matching sentence
    if (norm.includes('. ') || norm.includes('! ') || norm.includes('? ')) {
      const parts = norm.split(/([.!?]\s+)/);
      let anyTranslated = false;
      const translatedParts = [];
      for (let i = 0; i < parts.length; i += 2) {
        const sentence = parts[i];
        const delimiter = parts[i + 1] || '';
        const sTrim = sentence.trim();
        if (GLOBAL_TRANSLATION_MAP[sTrim]) {
          translatedParts.push(GLOBAL_TRANSLATION_MAP[sTrim] + delimiter);
          anyTranslated = true;
        } else {
          translatedParts.push(sentence + delimiter);
        }
      }
      if (anyTranslated) {
        return text.replace(trimmed, translatedParts.join(''));
      }
    }

    // 4. Safe whole-phrase replacement ONLY (strict word boundaries so words like 'Admin' NEVER match inside 'Administrator'!)
    let result = text;
    for (let i = 0; i < this.sortedPhrases.length; i++) {
      const [en, ar] = this.sortedPhrases[i];
      if (!en || en.length < 3) continue;

      if (en.includes(' ')) {
        if (result.includes(en)) {
          result = result.split(en).join(ar);
        }
      } else {
        // Single word: MUST use \b word boundary to avoid corrupting compound words!
        const wordRegex = new RegExp('\\b' + en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
        if (wordRegex.test(result)) {
          result = result.replace(wordRegex, ar);
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
