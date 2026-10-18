import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ar';

export interface AdminLanguageContextType {
  language: Language;
  isArabic: boolean;
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  translateCategory: (cat: string) => string;
  translateRole: (role: string) => string;
  translateStatus: (status: string) => string;
}

const DICTIONARY: Record<string, Record<Language, string>> = {
  // Top Navbar & Common
  'nav.search': { en: 'Search', ar: 'بحث' },
  'nav.searchPlaceholder': { en: 'Search...', ar: 'بحث...' },
  'nav.lightDark': { en: 'Toggle Light / Dark mode', ar: 'تبديل الوضع الليلي / النهاري' },
  'nav.notifications': { en: 'Notifications', ar: 'الإشعارات' },
  'nav.switchLanguage': { en: 'Switch Language / تغيير اللغة', ar: 'تغيير اللغة / Switch Language' },
  'nav.signOut': { en: 'Sign Out', ar: 'تسجيل الخروج' },
  'nav.defaultName': { en: 'Mubashir CP', ar: 'مباشر سي بي' },
  'nav.defaultRole': { en: 'Founding Coordinator (India)', ar: 'المنسق المؤسس (الهند)' },
  'nav.superAdmin': { en: 'Super Administrator', ar: 'المشرف العام' },
  'nav.coordinator': { en: 'Coordinator', ar: 'منسق' },
  'nav.presenter': { en: 'Presenter', ar: 'مقدم مناظرة' },
  'nav.member': { en: 'Member', ar: 'عضو' },

  // Sidebar Menu Items
  'menu.overview': { en: 'Programme Overview', ar: 'نظرة عامة على البرنامج' },
  'menu.community': { en: 'The Community', ar: 'المجتمع والوفود' },
  'menu.pipeline': { en: 'Topic Lifecycle Pipeline', ar: 'مسار دورة حياة القضايا' },
  'menu.topicBank': { en: 'Topic Bank', ar: 'بنك المواضيع' },
  'menu.sessions': { en: 'Session Management', ar: 'إدارة الجلسات والمناظرات' },
  'menu.writingStudio': { en: 'Academic Writing Studio', ar: 'استوديو الأبحاث الأكاديمية' },
  'menu.feedbackAnalysis': { en: 'Delegate Feedback Analysis', ar: 'تحليل تقييمات الوفود' },
  'menu.pendingApps': { en: 'Pending Applications', ar: 'طلبات العضوية المعلقة' },
  'menu.coordinatorTeam': { en: 'ISDC7 Coordinator Team', ar: 'فريق منسقي بطولة قطر' },
  'menu.countryChapters': { en: 'Country Chapters', ar: 'الفروع والوفود الدولية' },
  'menu.mediaStudio': { en: 'Media & PR Studio', ar: 'استوديو الإعلام والعلاقات العامة' },
  'menu.coordinatorProfile': { en: 'Coordinator Profile', ar: 'ملف المنسق' },
  'menu.deleteTrialData': { en: 'Delete Trial Data', ar: 'حذف البيانات التجريبية' },

  // Delete Trial Modal
  'deleteModal.toastSuccess': {
    en: 'All trial and demo data have been cleared successfully.',
    ar: 'تم مسح جميع البيانات التجريبية والتوضيحية بنجاح.',
  },
  'deleteModal.title': {
    en: 'Delete All Trial & Demo Data?',
    ar: 'حذف جميع البيانات التجريبية والتوضيحية؟',
  },
  'deleteModal.desc': {
    en: 'This action will wipe trial submissions, applicant evaluations, demo session drafts, and local test cookies. Primary administrator accounts remain preserved.',
    ar: 'سيؤدي هذا الإجراء إلى مسح كافة الطلبات التجريبية وتقييمات المتقدمين ومسودات الجلسات وملفات تعريف الارتباط المحلية. ستبقى حسابات المنسقين الأساسية محفوظة.',
  },
  'deleteModal.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'deleteModal.confirm': { en: 'Confirm Delete', ar: 'تأكيد الحذف' },
  'deleteModal.purging': { en: 'Purging Data...', ar: 'جارٍ حذف البيانات...' },

  // Dashboard Page
  'dash.title': { en: 'Coordinator Workspace', ar: 'مساحة عمل المنسق' },
  'dash.subtitle': {
    en: 'Restricted Programme & Academic Administration (Qatar ISDC7 Founding Secretariat)',
    ar: 'إدارة البرامج والشؤون الأكاديمية المعتمدة (الأمانة العامة التأسيسية لبطولة قطر ISDC7)',
  },
  'dash.notificationsBtn': { en: 'Notifications', ar: 'الإشعارات' },
  'dash.createSessionBtn': { en: 'Create Session', ar: 'إنشاء جلسة' },
  'dash.addTopicBtn': { en: 'Add Topic', ar: 'إضافة موضوع' },
  'dash.deleteTrialBtn': { en: 'Delete Trial Data', ar: 'حذف البيانات التجريبية' },

  'dash.kpiActiveMembers': { en: 'Active Members', ar: 'الأعضاء النشطون' },
  'dash.kpiPendingApps': { en: 'Pending Applications', ar: 'الطلبات المعلقة' },
  'dash.kpiTopicLibrary': { en: 'Topic Library', ar: 'مكتبة المواضيع' },
  'dash.kpiAcademicPapers': { en: 'Academic Papers', ar: 'الأوراق الأكاديمية' },

  'dash.pendingHeader': { en: 'Pending Membership Applications', ar: 'طلبات العضوية المعلقة' },
  'dash.manageAll': { en: 'Manage All', ar: 'إدارة الكل' },
  'dash.noPending': { en: 'No pending membership applications.', ar: 'لا توجد طلبات عضوية معلقة حالياً.' },
  'dash.noPendingDesc': {
    en: 'New submissions from prospective youth debaters will appear here for review.',
    ar: 'ستظهر هنا الطلبات الجديدة المقدمة من المناظرين الشباب للمراجعة والتدقيق.',
  },
  'dash.approve': { en: 'Approve', ar: 'قبول' },
  'dash.decline': { en: 'Decline', ar: 'رفض' },
  'dash.global': { en: 'Global', ar: 'دولي' },
  'dash.applicantFallback': { en: 'Applicant', ar: 'متقدم' },
  'dash.appApprovedToast': { en: 'Application approved successfully.', ar: 'تم قبول طلب العضوية بنجاح.' },
  'dash.appDeclinedToast': { en: 'Application declined.', ar: 'تم رفض طلب العضوية.' },
  'dash.localProcessed': { en: 'Action processed locally.', ar: 'تمت معالجة الإجراء محلياً.' },

  'dash.coordinatorActions': { en: 'Coordinator Actions', ar: 'إجراءات المنسق' },
  'dash.actionCreateSession': { en: 'Create New Session', ar: 'إنشاء جلسة مناظرة جديدة' },
  'dash.actionDraftSummary': { en: 'Draft Academic Summary', ar: 'صياغة ملخص أكاديمي' },
  'dash.actionInspectFeedback': { en: 'Inspect Feedback Reviews', ar: 'فحص تقييمات الوفود' },
  'dash.actionPostAnnouncement': { en: 'Post Community Announcement', ar: 'نشر إعلان للمجتمع' },
  'dash.announcementToast': { en: 'Announcement composer opened.', ar: 'تم فتح محرر الإعلانات.' },

  // Applications Page
  'apps.title': { en: 'Applicant Dossiers & Vetting', ar: 'ملفات المتقدمين والتدقيق' },
  'apps.subtitle': {
    en: 'Review and deliberate on incoming membership requests from international youth debaters.',
    ar: 'مراجعة والبت في طلبات العضوية الواردة من المناظرين الشباب حول العالم.',
  },
  'apps.totalDossiers': { en: 'Total Dossiers', ar: 'إجمالي الملفات' },
  'apps.searchPlaceholder': {
    en: 'Search by name, email, or country...',
    ar: 'البحث بالاسم، البريد الإلكتروني، أو الدولة...',
  },
  'apps.tabAll': { en: 'All', ar: 'الكل' },
  'apps.tabPending': { en: 'Pending', ar: 'معلق' },
  'apps.tabUnderReview': { en: 'Under Review', ar: 'قيد المراجعة' },
  'apps.tabApproved': { en: 'Approved', ar: 'مقبول' },
  'apps.tabRejected': { en: 'Rejected', ar: 'مرفوض' },
  'apps.noApps': { en: 'No applications found.', ar: 'لم يتم العثور على أي طلبات عضوية.' },
  'apps.colApplicant': { en: 'Applicant', ar: 'المتقدم' },
  'apps.colCountry': { en: 'Country & Institution', ar: 'الدولة والمؤسسة' },
  'apps.colExperience': { en: 'Debate Track', ar: 'المسار التناظري' },
  'apps.colStatus': { en: 'Status', ar: 'الحالة' },
  'apps.colActions': { en: 'Actions', ar: 'الإجراءات' },
  'apps.reviewBtn': { en: 'Review Dossier', ar: 'مراجعة الملف' },
  'apps.modalTitle': { en: 'Applicant Dossier & Deliberation', ar: 'ملف المتقدم ومداولة المنسقين' },
  'apps.modalSubtitle': {
    en: 'Review full background, debate accolades, and candidate motivation statement.',
    ar: 'مراجعة السيرة التناظرية والجوائز ورسالة الدافع للمرشح.',
  },
  'apps.personalStatement': { en: 'Personal Statement & Motivation', ar: 'رسالة الاهتمام والدافع' },
  'apps.debateExperience': { en: 'Debate Experience & Honors', ar: 'الخبرة التناظرية والجوائز' },
  'apps.interests': { en: 'Thematic Knowledge Disciplines', ar: 'المجالات والمحاور المعرفية' },
  'apps.coordinatorNotes': { en: 'Coordinator Deliberation Notes', ar: 'ملاحظات وتوصيات المنسق' },
  'apps.notesPlaceholder': {
    en: 'Enter assessment notes or accreditation criteria...',
    ar: 'أدخل ملاحظات التقييم أو شروط الاعتماد للمتقدم...',
  },
  'apps.accreditPresenter': {
    en: 'Accredit as Verified Debate Presenter / Chair',
    ar: 'اعتماد المرشح كمقدم / رئيس جلسة مناظرة رسمي',
  },
  'apps.approveApplication': { en: 'Approve Membership', ar: 'الموافقة على العضوية' },
  'apps.rejectApplication': { en: 'Decline Application', ar: 'رفض الطلب' },
  'apps.closeModal': { en: 'Close Dossier', ar: 'إغلاق الملف' },

  // Users Page
  'users.title': { en: 'Community Directory', ar: 'دليل المجتمع والوفود' },
  'users.subtitle': {
    en: 'Manage verified youth scholars, debaters, and coordinator privileges across 14+ country delegations.',
    ar: 'إدارة الباحثين الشباب والمناظرين المعتمدين وصلاحيات المنسقين عبر وفود أكثر من 14 دولة.',
  },
  'users.searchPlaceholder': {
    en: 'Search users by name, email, or country...',
    ar: 'البحث بالاسم، البريد الإلكتروني، أو الدولة...',
  },
  'users.filterAllRoles': { en: 'All Roles', ar: 'جميع الأدوار' },
  'users.filterSuperAdmin': { en: 'Super Admin', ar: 'المشرف العام' },
  'users.filterCoordinator': { en: 'Coordinator', ar: 'منسق' },
  'users.filterPresenter': { en: 'Presenter', ar: 'مقدم مناظرة' },
  'users.filterMember': { en: 'Member', ar: 'عضو' },
  'users.noUsers': { en: 'No members found matching filter.', ar: 'لم يتم العثور على أي أعضاء مطابقين للبحث.' },
  'users.colUser': { en: 'User & Details', ar: 'المستخدم والبيانات' },
  'users.colRole': { en: 'Role Privilege', ar: 'صلاحية الدور' },
  'users.colCountry': { en: 'Country', ar: 'الدولة' },
  'users.colStatus': { en: 'Account Status', ar: 'حالة الحساب' },
  'users.colActions': { en: 'Governance', ar: 'الإدارة والتحكم' },
  'users.active': { en: 'Active', ar: 'نشط' },
  'users.suspended': { en: 'Suspended', ar: 'موقوف' },
  'users.makeCoord': { en: 'Make Coordinator', ar: 'تعيين كمنسق' },
  'users.makePresenter': { en: 'Make Presenter', ar: 'تعيين كمقدم' },
  'users.makeMember': { en: 'Make Member', ar: 'تعيين كعضو' },
  'users.suspend': { en: 'Suspend', ar: 'إيقاف' },
  'users.activate': { en: 'Activate', ar: 'تفعيل' },
  'users.delete': { en: 'Delete', ar: 'حذف' },

  // Sessions Page
  'sessions.title': { en: 'Parliamentary Sessions & Debates', ar: 'جلسات المناظرات البرلمانية' },
  'sessions.subtitle': {
    en: 'Schedule and preside over bi-weekly parliamentary debates, configure motion assignments, and upload recordings.',
    ar: 'جدولة وإدارة جلسات المناظرة البرلمانية نصف الشهرية، وتعيين القضايا وتوثيق التسجيلات.',
  },
  'sessions.scheduleBtn': { en: 'Schedule Sessions', ar: 'جدولة الجلسات' },
  'sessions.searchPlaceholder': {
    en: 'Search sessions by title or category...',
    ar: 'البحث في الجلسات حسب العنوان أو المجال...',
  },
  'sessions.noSessions': { en: 'No parliamentary sessions found.', ar: 'لا توجد جلسات مسجلة.' },
  'sessions.modalTitle': { en: 'Schedule Sessions', ar: 'جدولة الجلسات' },
  'sessions.activityFormat': { en: 'Proposed Activity Format', ar: 'شكل النشاط الحواري المقترح' },
  'sessions.motionLabel': { en: 'Session Motion / Title', ar: 'قضية الجلسة / العنوان' },
  'sessions.descLabel': { en: 'Motion Description & Rules of Engagement', ar: 'الوصف ومحددات المناظرة' },
  'sessions.dateLabel': { en: 'Scheduled Date & Time (UTC)', ar: 'الموعد المحدد (توقيت UTC)' },
  'sessions.durationLabel': { en: 'Duration (Minutes)', ar: 'المدة (بالدقائق)' },
  'sessions.meetingUrlLabel': { en: 'Virtual Meeting URL (Zoom / Google Meet)', ar: 'رابط قاعة الاجتماع (Zoom / Meet)' },
  'sessions.cancelBtn': { en: 'Cancel', ar: 'إلغاء' },
  'sessions.createBtn': { en: 'Publish Session Chamber', ar: 'اعتماد وجدولة الجلسة' },
  'sessions.joinChamber': { en: 'Join Chamber', ar: 'دخول القاعة' },
  'sessions.live': { en: 'Live Now', ar: 'جارية الآن' },
  'sessions.scheduled': { en: 'Scheduled', ar: 'مجدولة' },
  'sessions.completed': { en: 'Completed', ar: 'منتهية' },
  'sessions.categoryLabel': { en: 'Session Category', ar: 'فئة ونوع الجلسة' },
  'sessions.academicSphere': { en: 'Academic Discipline / Sphere', ar: 'المجال المعرفي الأكاديمي' },
  'sessions.moderator': { en: 'Session Moderator', ar: 'مدير الجلسة' },
  'sessions.moderatorPlaceholder': { en: 'Full name of session moderator...', ar: 'اسم مدير الجلسة الكامل...' },
  'sessions.presentersLabel': { en: 'Presenter(s) (1 or more)', ar: 'مقدم(و) العرض (1 أو أكثر)' },
  'sessions.addPresenter': { en: '+ Add Presenter', ar: '+ إضافة مقدم عرض' },
  'sessions.team1Label': { en: 'Team 1 / Proposition Members', ar: 'الفريق الأول / أعضاء فريق الموالاة' },
  'sessions.team2Label': { en: 'Team 2 / Opposition Members', ar: 'الفريق الثاني / أعضاء فريق المعارضة' },
  'sessions.teamMemberPlaceholder': { en: 'Enter member name...', ar: 'أدخل اسم العضو...' },
  'sessions.addMember': { en: '+ Add Member', ar: '+ إضافة عضو' },
  'sessions.speakersLabel': { en: 'Key Speakers (if any)', ar: 'المتحدثون الرئيسيون (إن وجدوا)' },
  'sessions.addSpeaker': { en: '+ Add Speaker', ar: '+ إضافة متحدث' },
  'sessions.guestName': { en: 'Guest Name', ar: 'اسم الضيف' },
  'sessions.guestBio': { en: 'Guest Biography / Credentials', ar: 'النبذة التعريفية عن الضيف' },
  'sessions.guestImage': { en: 'Guest Photo / Image URL', ar: 'رابط صورة الضيف' },
  'sessions.chooseTopic': { en: 'Select Topic from Topic Bank', ar: 'اختر موضوعاً من بنك المواضيع' },
  'sessions.chooseTopicPlaceholder': { en: '-- Select an Approved Topic from Bank --', ar: '-- اختر موضوعاً معتمداً من القائمة --' },
  'sessions.customTopicOption': { en: '✎ Custom Topic / Type Title Manually', ar: '✎ موضوع مخصص / كتابة العنوان يدوياً' },
  'sessions.addNewTopicBtn': { en: '+ Add New Topic', ar: '+ إضافة موضوع جديد' },
  'sessions.availableTopics': { en: 'available', ar: 'متاح' },
  'sessions.topicAddedSuccess': { en: 'New topic created and selected for this session!', ar: 'تم إنشاء الموضوع الجديد واختياره لهذه الجلسة بنجاح!' },

  // Topics Page
  'topics.title': { en: 'Topic Pipeline & Proposals', ar: 'مسار ومقترحات القضايا' },
  'topics.subtitle': {
    en: 'Curate member-suggested parliamentary debate motions across the 16 core knowledge disciplines.',
    ar: 'فرز وتنسيق قضايا المناظرات البرلمانية المقترحة من الأعضاء عبر 16 تخصصاً معرفياً.',
  },
  'topics.searchPlaceholder': {
    en: 'Search topics by motion or category...',
    ar: 'البحث في القضايا حسب العنوان أو المجال...',
  },
  'topics.noTopics': { en: 'No topics found.', ar: 'لم يتم العثور على أي قضايا.' },
  'topics.approveVoting': { en: 'Approve for Ballot Voting', ar: 'اعتماد للتصويت العام' },
  'topics.rejectMotion': { en: 'Decline Motion', ar: 'رفض القضية' },
  'topics.openBallot': { en: 'Ballot Voting Active', ar: 'التصويت متاح حالياً' },
  'topics.addTopicBtn': { en: 'Add Topic', ar: 'إضافة موضوع جديد' },
  'topics.addModalTitle': { en: 'Add New Topic to Bank', ar: 'إضافة موضوع جديد إلى بنك المواضيع' },
  'topics.addModalSubtitle': {
    en: 'Administrators have authorization to directly add approved debate topics to the global repository.',
    ar: 'يملك المنسقون والمسؤولون صلاحية إضافة قضايا معتمدة مباشرة إلى المستودع العالمي.',
  },
  'topics.titleInputLabel': { en: 'Topic Title', ar: 'عنوان الموضوع' },
  'topics.titlePlaceholder': { en: 'e.g., Geopolitical Realignment in South Asia', ar: 'مثال: التحالفات الجيوسياسية في جنوب آسيا' },
  'topics.motionInputLabel': { en: 'Suggested Debate Motion', ar: 'نص القضية المقترح (الأطروحة الجدلية)' },
  'topics.motionPlaceholder': { en: 'This House Believes That / This House Would...', ar: 'يرى هذا المجلس أن / سيقوم هذا المجلس بـ...' },
  'topics.categoryInputLabel': { en: 'Core Discipline / Sphere', ar: 'المجال التخصصي الأساسي' },
  'topics.formatInputLabel': { en: 'Proposed Activity Format', ar: 'صيغة النشاط المقترحة' },
  'topics.descriptionInputLabel': { en: 'Academic Rationale & Description', ar: 'الوصف والسياق الأكاديمي' },
  'topics.descriptionPlaceholder': { en: 'Provide contextual framing, core debate lines, and background notes...', ar: 'قدم الإطار السياقي والمحاور الجدلية الأساسية...' },
  'topics.perspectiveInputLabel': { en: 'Regional / Policy Perspective (Optional)', ar: 'المنظور الإقليمي أو السياسي (اختياري)' },
  'topics.perspectivePlaceholder': { en: 'e.g., GCC, Global South, European Union', ar: 'مثال: دول مجلس التعاون، الجنوب العالمي، الاتحاد الأوروبي' },
  'topics.statusInputLabel': { en: 'Topic Status', ar: 'حالة الموضوع' },
  'topics.saveBtn': { en: 'Save & Approve Topic', ar: 'حفظ واعتماد الموضوع' },
  'topics.savingBtn': { en: 'Adding Topic...', ar: 'جارٍ إضافة الموضوع...' },
  'topics.cancelBtn': { en: 'Cancel', ar: 'إلغاء' },
  'topics.toastSuccess': { en: 'New topic successfully added to Topic Bank!', ar: 'تمت إضافة الموضوع الجديد بنجاح إلى بنك المواضيع!' },

  // Publications Page
  'pubs.title': { en: 'Academic Research & Papers', ar: 'الأبحاث والأوراق الأكاديمية' },
  'pubs.subtitle': {
    en: 'Review, peer-assess, and publish delegate academic papers to the public digital repository.',
    ar: 'مراجعة وتحكيم ونشر الأوراق البحثية للوفود في المستودع الرقمي العام.',
  },
  'pubs.searchPlaceholder': {
    en: 'Search papers by title or category...',
    ar: 'البحث في الأبحاث حسب العنوان أو المجال...',
  },
  'pubs.noPubs': { en: 'No research papers found.', ar: 'لم يتم العثور على أوراق بحثية.' },
  'pubs.publishBtn': { en: 'Accredit & Publish', ar: 'اعتماد ونشر للعامة' },
  'pubs.publishedBadge': { en: 'Published Online', ar: 'منشور في المستودع' },

  // Feedback Page
  'fb.title': { en: 'Delegate Reviews & Feedback', ar: 'تقييمات الوفود والمراجعات' },
  'fb.subtitle': {
    en: 'Peer reflections and ratings on presentation clarity, argument strength, and floor debate rigor.',
    ar: 'انطباعات وتقييمات الأقران حول وضوح العرض، قوة الحجج، ورصانة المناظرة.',
  },
  'fb.searchPlaceholder': {
    en: 'Search feedback by session or member...',
    ar: 'البحث في التقييمات حسب الجلسة أو العضو...',
  },
  'fb.noFb': { en: 'No peer reviews found.', ar: 'لا توجد تقييمات مسجلة.' },
  'fb.argumentation': { en: 'Argumentation', ar: 'المحاججة الفكرية' },
  'fb.evidence': { en: 'Evidence & Rigor', ar: 'الأدلة والقرائن' },
  'fb.delivery': { en: 'Oratory & Delivery', ar: 'الإلقاء والخطابة' },
  'fb.engagement': { en: 'Rebuttal & Engagement', ar: 'التفنيد والتجاوب' },
  'fb.strengths': { en: 'Strengths', ar: 'نقاط القوة' },
  'fb.improvements': { en: 'Areas for Growth', ar: 'فرص التطوير والتحسين' },

  // Analytics Page
  'analytics.title': { en: 'Platform Analytics & Deliberations', ar: 'إحصائيات المنصة والتحليلات' },
  'analytics.subtitle': {
    en: 'Real-time metrics on debate session attendance, geographic distribution, and paper citations.',
    ar: 'مؤشرات حية حول حضور الجلسات، التوزيع الجغرافي للوفود، والنشاط الأكاديمي.',
  },
  'analytics.monthlyAttendance': { en: 'Monthly Chamber Attendance', ar: 'حضور غرف المناظرة الشهري' },
  'analytics.countryDistribution': { en: 'Delegation Distribution by Nation', ar: 'توزيع الوفود حسب الدول' },
  'analytics.noAttendance': { en: 'No session attendance data recorded yet.', ar: 'لا توجد بيانات حضور مسجلة حتى الآن.' },
  'analytics.noAttendanceDesc': {
    en: 'Sessions held will reflect attendance trends automatically here.',
    ar: 'ستنعكس إحصائيات الجلسات المنعقدة تلقائياً هنا.',
  },

  // Audit Logs Page
  'audit.title': { en: 'Security & Deliberation Audit Trail', ar: 'سجل التدقيق والأمان' },
  'audit.subtitle': {
    en: 'Immutable logging of coordinator deliberations, user status modifications, and session accreditation.',
    ar: 'سجل غير قابل للتعديل لقرارات المنسقين، وتعديلات حالات المستخدمين، واعتماد الجلسات.',
  },
  'audit.searchPlaceholder': {
    en: 'Search audit records by action or coordinator...',
    ar: 'البحث في سجلات التدقيق حسب الإجراء أو المنسق...',
  },
  'audit.noLogs': { en: 'No audit logs recorded yet.', ar: 'لم يتم تسجيل أي عمليات تدقيق بعد.' },
  'audit.colAction': { en: 'Action', ar: 'الإجراء' },
  'audit.colBy': { en: 'Coordinator / Actor', ar: 'المنسق / الفاعل' },
  'audit.colTarget': { en: 'Target Entity', ar: 'الجهة المعنية' },
  'audit.colDate': { en: 'Timestamp', ar: 'التاريخ والتوقيت' },

  // Settings Page
  'settings.title': { en: 'Platform Settings & Security', ar: 'إعدادات المنصة والأمان' },
  'settings.subtitle': {
    en: 'Configure GYDE infrastructure, authentication parameters, and email dispatchers.',
    ar: 'إعداد البنية التحتية لـ GYDE، معايير المصادقة، وخوادم البريد.',
  },
  'settings.apiConn': { en: 'API Service Connectivity', ar: 'اتصال خدمات الـ API' },
  'settings.apiConnDesc': {
    en: 'REST endpoint is connected to',
    ar: 'نقطة نهاية REST متصلة بالخادم في',
  },
  'settings.dbLayer': { en: 'MongoDB Data Layer', ar: 'طبقة بيانات MongoDB' },
  'settings.dbLayerDesc': {
    en: 'MongoDB with Mongoose schemas, automated memory-server fallback enabled for resilient offline operations.',
    ar: 'قواعد بيانات MongoDB مع مخططات Mongoose وخادم ذاكرة احتياطي لضمان استمرارية العمل دون انقطاع.',
  },
  'settings.rbac': { en: 'Role-Based Access Control (RBAC)', ar: 'التحكم بالوصول المبني على الأدوار (RBAC)' },
  'settings.rbacDesc': {
    en: 'Strict RBAC enforcement for SUPER_ADMIN, ADMIN, COORDINATOR, PRESENTER, and MEMBER.',
    ar: 'تطبيق صارم لنظام الصلاحيات للأدوار: المشرف العام، المنسق، مقدم المناظرة، والعضو.',
  },

  // Login Page
  'login.title': { en: 'GYDE Secretariat Login', ar: 'تسجيل دخول أمانة GYDE' },
  'login.subtitle': {
    en: 'Restricted access for Qatar ISDC7 Founding Coordinators and Academic Administrators.',
    ar: 'دخول مخصص لمنسقي بطولة قطر الدولية لمناظرات المدارس والمشرفين الأكاديميين.',
  },
  'login.emailLabel': { en: 'Official Secretariat Email', ar: 'البريد الإلكتروني المعتمد للأمانة' },
  'login.passwordLabel': { en: 'Security Passcode', ar: 'رمز المرور الأمني' },
  'login.authBtn': { en: 'Authenticate Secretariat Clearance', ar: 'مصادقة صلاحيات الأمانة' },
  'login.authLoading': { en: 'Authenticating Secretariat...', ar: 'جارٍ التحقق من الصلاحيات...' },
  'login.nodeActive': { en: 'Secretariat Node Active', ar: 'خادم الأمانة نشط ومحمى' },
};

const CATEGORIES_AR: Record<string, string> = {
  'Geopolitics & International Relations': 'الجيوسياسية والعلاقات الدولية',
  'Technology & AI Ethics': 'أخلاقيات التكنولوجيا والذكاء الاصطناعي',
  'Education & Future of Learning': 'التعليم ومستقبل التعلم',
  'Climate, Environment & Energy': 'المناخ والبيئة والاستدامة',
  'Economy, Trade & Labor': 'الاقتصاد والتجارة والعمل',
  'Governance, Law & Human Rights': 'الحوكمة والقانون وحقوق الإنسان',
  'Culture, Identity & Global Media': 'الثقافة والهوية والإعلام العالمي',
  'Public Health, Bioethics & Science': 'الصحة العامة والأخلاقيات الحيوية والعلوم',
  'Space Governance & Astro-Politics': 'حوكمة الفضاء الخارجي والسياسات الفضائية',
  'Cybersecurity & Digital Sovereignty': 'الأمن السيبراني والسيادة الرقمية',
  'Youth Leadership & Future Generations': 'القيادة الشبابية والمشاركة المدنية',
  'Peacebuilding, Disarmament & Humanitarian Law': 'بناء السلام ونزع السلاح والقانون الإنساني',
  'Synthetic Biology & Genetic Horizons': 'البيولوجيا التركيبية والآفاق الجينية',
  'Food Sovereignty & Ocean Ecosystems': 'السيادة الغذائية ونظم المحيطات',
  'Philosophy, Epistemology & Applied Ethics': 'الفلسفة ونظرية المعرفة والأخلاقيات التطبيقية',
  'Urban Futures & Smart Habitats': 'مستقبل المدن الذكية والعمران والإسكان',
  'International Relations': 'العلاقات الدولية والدبلوماسية',
  'Global Economics': 'الاقتصاد والتجارة العالمية',
  'Philosophy & Human Rights': 'الفلسفة وحقوق الإنسان',
  'Environmental Policy': 'السياسات البيئية والمناخية',
  'Biomedical Ethics': 'الأخلاقيات الطبية والحيوية',
  'Education Reform': 'تطوير التعليم والمعرفة',
  'Media & Information Integrity': 'الإعلام ونزاهة المعلومات',
  'Topic Presentation': 'عرض موضوع',
  'Structural Debate': 'مناظرة هيكلية',
  'Discussion': 'جلسة نقاشية',
  'Guest Talks': 'حوارات الضيوف',
};

const ROLES_AR: Record<string, string> = {
  SUPER_ADMIN: 'المشرف العام',
  ADMIN: 'مسؤول النظام',
  COORDINATOR: 'منسق أكاديمي',
  PRESENTER: 'مقدم مناظرة',
  MEMBER: 'عضو باحث',
};

const STATUS_AR: Record<string, string> = {
  pending: 'معلق',
  under_review: 'قيد المراجعة',
  approved: 'معتمد',
  rejected: 'مرفوض',
  active: 'نشط',
  suspended: 'موقوف',
  draft: 'مسودة',
  scheduled: 'مجدولة',
  live: 'جارية الآن',
  completed: 'مكتملة',
  voting: 'تصويت عام',
  published: 'منشور',
};

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export const AdminLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('gyde_admin_lang') as Language) ||
           (localStorage.getItem('gyde_lang') as Language) ||
           'en';
  });

  const isArabic = language === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('gyde_admin_lang', language);
    localStorage.setItem('gyde_lang', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', dir);
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string, fallback?: string): string => {
    if (DICTIONARY[key] && DICTIONARY[key][language]) {
      return DICTIONARY[key][language];
    }
    return fallback !== undefined ? fallback : key;
  };

  const translateCategory = (cat: string): string => {
    if (isArabic && CATEGORIES_AR[cat]) {
      return CATEGORIES_AR[cat];
    }
    return cat;
  };

  const translateRole = (role: string): string => {
    if (isArabic && ROLES_AR[role.toUpperCase()]) {
      return ROLES_AR[role.toUpperCase()];
    }
    return role;
  };

  const translateStatus = (status: string): string => {
    const key = status.toLowerCase();
    if (isArabic && STATUS_AR[key]) {
      return STATUS_AR[key];
    }
    return status;
  };

  return (
    <AdminLanguageContext.Provider
      value={{
        language,
        isArabic,
        dir,
        setLanguage,
        toggleLanguage,
        t,
        translateCategory,
        translateRole,
        translateStatus,
      }}
    >
      {children}
    </AdminLanguageContext.Provider>
  );
};

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) throw new Error('useAdminLanguage must be used within an AdminLanguageProvider');
  return context;
}
