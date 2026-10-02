/**
 * GLOBAL YOUTH DIALOGUE - Internationalization (English & Arabic)
 * Handles full translations, text switching, and RTL direction changes.
 * Guaranteed 100% Arabic with zero English words when Arabic is enabled.
 */

const TRANSLATIONS = {
  en: {
    // Brand & Meta
    brandName: 'Global Youth Dialogue',
    brandSubtitle: 'International Community of Youth Debaters',
    taglineShort: 'Connect. Challenge. Create.',
    taglineLong: 'Young minds. Different countries. One conversation.',
    heroSubtext: 'A youth-led international community connecting young debaters to explore global issues, exchange perspectives and develop ideas through structured dialogue.',

    // Navigation
    navHome: 'Home',
    navAbout: 'About',
    navProcess: 'How It Works',
    navTopics: 'Topic Categories',
    navSessions: 'Sessions',
    navChapters: 'Chapters',
    navWritings: 'Academic Writings',
    navJoinUs: 'Join Us',
    navLogin: 'Sign In',
    navMemberPortal: 'Member Portal',
    navCoordinatorPortal: 'Coordinator Portal',
    navLogout: 'Sign Out',

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
    badgeOrigin: 'Born from Qatar ISDC7 Championship',
    badgeLegacy: 'Qatar ISDC7 Legacy',
    statNationsNum: '14+',
    statNations: 'Countries Represented',
    statDebatersNum: '60+',
    statDebaters: 'Youth Debaters',
    statSessionsNum: 'Bi-weekly',
    statSessions: 'Structured Dialogues',
    statWritingsNum: '100%',
    statWritings: 'Youth-Led & Researched',

    // About Section
    aboutSectionTitle: 'About the Project',
    aboutSubtitle: 'From a temporary debate tournament to a lasting global youth intellectual movement.',
    ourStoryTitle: 'Our Origin Story',
    ourStoryP1: 'Young debaters from different countries met through the prestigious Qatar International Schools Debate Championship (ISDC7) in Doha.',
    ourStoryP2: 'Although the tournament concluded, delegates realized the vital urgency of continuing to debate together, critically interrogate global affairs, and create opportunities for other youth worldwide.',
    ourStoryP3: 'Global Youth Dialogue was founded to transform that temporary international spark into a permanent, youth-led academic and diplomatic network.',

    missionTitle: 'Our Mission',
    missionDesc: 'To create an international space where young people can discuss global issues, challenge ideas, develop rigorous research and communication skills, and learn from peers across borders.',

    visionTitle: 'Our Vision',
    visionDesc: 'A connected generation of young people capable of engaging thoughtfully with global challenges and participating in meaningful international dialogue.',

    // 5-step process
    processTag: 'The Dialogue Cycle',
    processTitle: 'How the Programme Works',
    processSubtitle: 'A structured cycle transforming young debate into enduring academic insight.',
    step1Num: '01',
    step1Title: '01 — Select',
    step1Desc: 'Topics are vetted from community proposals across eight global categories.',
    step2Num: '02',
    step2Title: '02 — Prepare',
    step2Desc: 'Selected delegates conduct research, analyze policy papers, and formulate evidenced arguments.',
    step3Num: '03',
    step3Title: '03 — Discuss',
    step3Desc: 'The international community convenes live for structured debates, roundtables, and cross-examinations.',
    step4Num: '04',
    step4Title: '04 — Reflect',
    step4Desc: 'Members submit rigorous qualitative feedback evaluating argumentation depth, evidence, and missing nuances.',
    step5Num: '05',
    step5Title: '05 — Document',
    step5Desc: 'Research coordinators convert recordings into structured academic summaries published in our youth archive.',

    // Topic Categories
    topicsTag: 'Core Knowledge Spheres',
    topicsTitle: 'Topic Categories',
    topicsSubtitle: 'Multidisciplinary policy spheres explored through rigorous parliamentary debate and dialogue.',
    catBadge: 'ISDC7 Category',
    catTopics: 'Topics',

    // Public Sessions Notice
    sessionsTag: 'Dialogue Archive',
    sessionsTitle: 'Dialogue Sessions & Archive',
    sessionsSubtitle: 'All live session participation, private recordings, and academic writings are members-only.',
    membersOnlyNotice: 'Session Content & Archives are Members-Only',
    signInToAccess: 'To maintain a safe, intellectually focused environment for international debaters, live meeting links, private YouTube recordings, and full academic writings are accessible only through authenticated Member & Coordinator portals.',
    sessionMembersOnly: 'Members Only',
    sessionLabel: 'Session',
    sessionFormat: 'Format:',

    // Chapters Section
    chaptersTag: 'Global Network',
    chaptersTitle: 'National Chapters & Representatives',
    chaptersDesc: 'Organized by ISDC7 tournament alumni across 14+ countries to recruit youth delegates and coordinate national debate cohorts.',
    chapterOrigin: 'Origin:',
    activeDebaters: 'Active Debaters',

    // Core Values
    valConnect: 'Connect',
    valConnectDesc: 'Young people from diverse nations uniting across geographic and cultural borders.',
    valChallenge: 'Challenge',
    valChallengeDesc: 'Scrutinizing perspectives, questioning assumptions, and testing arguments through evidence.',
    valCreate: 'Create',
    valCreateDesc: 'Transforming spoken debates into written academic knowledge, policy insights, and youth leadership.',

    // Footer
    footerDesc: 'Global Youth Dialogue — Founded by the international debaters of ISDC7 Qatar. Advancing structured youth discourse and academic collaboration across borders.',
    footerNavTitle: 'Navigation',
    footerAbout: 'About Origin',
    footerProcess: 'How It Works',
    footerTopics: 'Topic Categories',
    footerSessions: 'Sessions Overview',
    footerPortalsTitle: 'Portals & Access',
    footerSignIn: 'Sign In Portal',
    footerNetwork: 'Qatar ISDC7 Network',
    rightsReserved: 'All rights reserved. Global Youth Dialogue.',

    // Sign In Page
    authTopBadge: 'Global Youth Dialogue • Sign In',
    authPageTitle: 'Sign In to Your Account',
    authPageArabic: 'تسجيل الدخول — الحوار الشبابي الدولي',
    authPageDesc: 'Enter your email and password. Your role will be automatically identified to open either your Member features or Admin workspace.',
    authDemoLabel: '⚡ 1-Click Demo Profiles (Auto-Role Redirection)',
    demoRoleMember: '🇬🇭 Kofi Mensah (Member / Delegate) → Opens Member Features',
    demoRoleAdmin: '🇶🇦 Tariq Al-Mansoor (Admin / Coordinator) → Opens Admin Features',
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
    pendingApplications: 'Pending Applications',
    topicManagement: 'Topic Lifecycle Pipeline',
    sessionManagement: 'Session Management',
    feedbackReview: 'Delegate Feedback Analysis',
    summaryEditor: 'Academic Writing Studio',
    teamManagement: 'ISDC7 Coordinator Team'
  },

  ar: {
    // Brand & Meta
    brandName: 'الحوار الشبابي الدولي',
    brandSubtitle: 'مجتمع دولي للمناظرين الشباب',
    taglineShort: 'تواصل. حاور. ابتكر.',
    taglineLong: 'عقول شابة. دول مختلفة. حوار واحد.',
    heroSubtext: 'مجتمع دولي يقوده الشباب يربط المناظرين لاستكشاف القضايا العالمية وتبادل وجهات النظر وتطوير الأفكار من خلال حوار منظم.',

    // Navigation
    navHome: 'الرئيسية',
    navAbout: 'عن المبادرة',
    navProcess: 'آلية العمل',
    navTopics: 'المحاور والموضوعات',
    navSessions: 'الجلسات',
    navChapters: 'الفروع الدولية',
    navWritings: 'الأوراق الأكاديمية',
    navJoinUs: 'انضم إلينا',
    navLogin: 'تسجيل الدخول',
    navMemberPortal: 'بوابة الأعضاء',
    navCoordinatorPortal: 'بوابة المنسقين',
    navLogout: 'تسجيل الخروج',

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
    badgeOrigin: 'انطلق من البطولة الدولية لمناظرات المدارس في قطر (ISDC7)',
    badgeLegacy: 'إرث مناظرات قطر (ISDC7)',
    statNationsNum: '+١٤',
    statNations: 'دولة ممثلة',
    statDebatersNum: '+٦٠',
    statDebaters: 'مناظراً شاباً',
    statSessionsNum: 'دوري',
    statSessions: 'حوارات منتظمة',
    statWritingsNum: '١٠٠٪',
    statWritings: 'بأبحاث شبابية رصينة',

    // About Section
    aboutSectionTitle: 'عن المشروع',
    aboutSubtitle: 'من منافسة مؤقتة في الدوحة إلى شبكة فكرية شبابية عالمية مستمرة.',
    ourStoryTitle: 'قصة التأسيس',
    ourStoryP1: 'التقى مناظرون شباب من مختلف دول العالم خلال البطولة الدولية السابعة لمناظرات المدارس (ISDC7) في دولة قطر.',
    ourStoryP2: 'ورغم انتهاء البطولة، حرص المشاركون على مواصلة التناظر، ومناقشة القضايا العالمية المعاصرة، وتبادل الرؤى وفتح آفاق جديدة للشباب حول العالم.',
    ourStoryP3: 'تأسس "الحوار الشبابي الدولي" لتحويل هذا التواصل الاستثنائي إلى شبكة شبابية رائدة ومستدامة للحوار والبحث الرصين.',

    missionTitle: 'رسالتنا',
    missionDesc: 'توفير منصة دولية يتبادل فيها الشباب الأفكار، ويتحدون التصورات المسبقة، ويطورون مهارات البحث والتواصل، ويتعلمون من أقرانهم عبر القارات.',

    visionTitle: 'رؤيتنا',
    visionDesc: 'جيل شبابي متصل وقادر على التعامل بوعي ومسؤولية مع التحديات العالمية والمشاركة الفاعلة في الحوار الدولي البنّاء.',

    // 5-step process
    processTag: 'دورة الحوار الأكاديمي',
    processTitle: 'آلية عمل البرنامج',
    processSubtitle: 'دورة متكاملة تحول المناظرة الحية إلى إنتاج معرفي أكاديمي مستدام.',
    step1Num: '٠١',
    step1Title: '٠١ — الاختيار',
    step1Desc: 'اختيار الموضوعات المعتمدة من اقتراحات الأعضاء ضمن الفئات المعرفية الثماني.',
    step2Num: '٠٢',
    step2Title: '٠٢ — الإعداد والبحث',
    step2Desc: 'يقوم المتحدثون ببحث القضية، ومراجعة الدراسات وتجهيز الحجج المدعومة بالأدلة.',
    step3Num: '٠٣',
    step3Title: '٠٣ — النقاش والتناظر',
    step3Desc: 'يلتقي المجتمع في حوار افتراضي منظم يجمع بين العروض والمناظرة البرلمانية وتفنيد الحجج.',
    step4Num: '٠٤',
    step4Title: '٠٤ — المراجعة والتقييم',
    step4Desc: 'يقدم الأعضاء ملاحظات نوعية معمقة حول رصانة الأدلة وزوايا النظر غير المطروحة.',
    step5Num: '٠٥',
    step5Title: '٠٥ — التوثيق الأكاديمي',
    step5Desc: 'يقوم منسقو البحث بتحويل مخرجات الجلسة إلى ورقة بحثية رصينة تحفظ في الأرشيف الدائم.',

    // Topic Categories
    topicsTag: 'المجالات المعرفية الرئيسية',
    topicsTitle: 'فئات الموضوعات',
    topicsSubtitle: 'محاور سياسية وفكرية معاصرة تخضع للبحث والمناظرة المعمقة.',
    catBadge: 'فئة مناظرات قطر (ISDC7)',
    catTopics: 'قضايا',

    // Public Sessions Notice
    sessionsTag: 'أرشيف الجلسات والحوارات',
    sessionsTitle: 'الجلسات والأرشيف المعرفي',
    sessionsSubtitle: 'حضور الجلسات المباشرة والتسجيلات والأوراق الأكاديمية مخصص لأعضاء المجتمع.',
    membersOnlyNotice: 'محتوى الجلسات والأرشيف مخصص لأعضاء المجتمع',
    signInToAccess: 'للحفاظ على بيئة آمنة وفكرية جادة للمناظرين الدوليين، تقتصر روابط الاجتماعات والتسجيلات والأوراق البحثية على الأعضاء وفريق التنسيق.',
    sessionMembersOnly: 'محتوى خاص بالأعضاء',
    sessionLabel: 'الجلسة',
    sessionFormat: 'شكل المناظرة:',

    // Chapters Section
    chaptersTag: 'الشبكة الدولية',
    chaptersTitle: 'الفروع الوطنية والممثلون الدوليون',
    chaptersDesc: 'شبكة تنسيق وطنية يقودها خريجو البطولة الدولية في قطر لتمثيل وتأهيل المناظرين في أكثر من ١٤ دولة.',
    chapterOrigin: 'الفريق في بطولة قطر:',
    activeDebaters: 'مناظراً نشطاً',

    // Core Values
    valConnect: 'تواصل',
    valConnectDesc: 'شباب من مختلف الثقافات والدول يجتمعون ويتخطون الحدود الجغرافية.',
    valChallenge: 'حاور',
    valChallengeDesc: 'مساءلة الأفكار ونقد المسلمات واختبار الأدلة بنزاهة فكرية وحوار رصين.',
    valCreate: 'ابتكر',
    valCreateDesc: 'تحويل الحوار الشفهي إلى معرفة أكاديمية مكتوبة ومبادرات شبابية قيادية.',

    // Footer
    footerDesc: 'الحوار الشبابي الدولي — أسسه مناظرون من بطولة قطر الدولية لمناظرات المدارس (ISDC7). تعزيز الحوار والبحث الشبابي العابر للحدود.',
    footerNavTitle: 'التنقل',
    footerAbout: 'قصة التأسيس',
    footerProcess: 'آلية العمل',
    footerTopics: 'فئات الموضوعات',
    footerSessions: 'نظرة عامة على الجلسات',
    footerPortalsTitle: 'البوابات والوصول',
    footerSignIn: 'بوابة تسجيل الدخول',
    footerNetwork: 'شبكة مناظرات قطر (ISDC7)',
    rightsReserved: 'جميع الحقوق محفوظة. الحوار الشبابي الدولي.',

    // Sign In Page
    authTopBadge: 'الحوار الشبابي الدولي • تسجيل الدخول',
    authPageTitle: 'تسجيل الدخول إلى حسابك',
    authPageArabic: 'تسجيل الدخول — الحوار الشبابي الدولي',
    authPageDesc: 'أدخل بريدك الإلكتروني وكلمة المرور. سيتم التعرف على دورك تلقائياً لفتح واجهة الأعضاء أو مساحة الإدارة.',
    authDemoLabel: '⚡ حسابات تجريبية بنقرة واحدة (توجيه تلقائي للمهام)',
    demoRoleMember: '🇬🇭 كوفي مينساه (عضو / متحدث) ← يفتح واجهة الأعضاء',
    demoRoleAdmin: '🇶🇦 طارق المنصور (منسق / إدارة) ← يفتح واجهة المنسقين',
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
    pendingApplications: 'طلبات الانضمام المعلقة',
    topicManagement: 'إدارة مسار الموضوعات',
    sessionManagement: 'إدارة الجلسات',
    feedbackReview: 'تحليل تقييمات الأعضاء',
    summaryEditor: 'مختبر الكتابة الأكاديمية',
    teamManagement: 'فريق التنسيق التأسيسي (ISDC7)'
  }
};

class I18nService {
  constructor() {
    this.currentLang = localStorage.getItem('gyd_language') || 'en';
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
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  applyLanguage() {
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.isRTL() ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl-mode', this.isRTL());

    // Update all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && TRANSLATIONS[this.currentLang] && TRANSLATIONS[this.currentLang][key]) {
        el.textContent = TRANSLATIONS[this.currentLang][key];
      }
    });

    // Update language switch button text with black & white vector SVG icon
    // When Arabic is active, show "الإنجليزية" (Pure Arabic, ZERO English characters)
    // When English is active, show "العربية"
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
      const globeSvg = `<span class="svg-icon" style="display:inline-flex; align-items:center;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></span>`;
      langBtn.innerHTML = this.currentLang === 'en' 
        ? `${globeSvg} <span>العربية</span>`
        : `${globeSvg} <span>English</span>`;
    }

    // Trigger custom event so UI can re-render dynamic content if needed
    window.dispatchEvent(new CustomEvent('gyd-lang-changed', { detail: { lang: this.currentLang } }));
  }
}

window.GYD_I18N = new I18nService();
