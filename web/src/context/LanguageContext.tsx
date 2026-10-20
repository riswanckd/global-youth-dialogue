import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'ar';

export interface LanguageContextType {
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

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DICTIONARY: Record<string, Record<Language, string>> = {
  // Public Navigation
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.about': { en: 'About GYDE', ar: 'عن المبادرة' },
  'nav.mission': { en: 'Mission', ar: 'رسالتنا' },
  'nav.cycle': { en: 'Dialogue Cycle', ar: 'دورة الحوار' },
  'nav.topics': { en: 'Topic Bank', ar: 'بنك المواضيع' },
  'nav.sessions': { en: 'Sessions', ar: 'الجلسات' },
  'nav.publications': { en: 'Publications', ar: 'الأوراق البحثية' },
  'nav.community': { en: 'Our Impact', ar: 'أثرنا والمجتمع' },
  'nav.portal': { en: 'Member Portal', ar: 'بوابة الأعضاء' },
  'nav.apply': { en: 'Apply Now', ar: 'تقديم طلب انضمام' },
  'nav.login': { en: 'Sign In', ar: 'تسجيل الدخول' },
  'nav.logout': { en: 'Sign Out', ar: 'تسجيل الخروج' },
  'nav.search': { en: 'Search', ar: 'بحث' },
  'nav.toggleTheme': { en: 'Toggle Light / Dark Mode', ar: 'تبديل المظهر النهاري / الليلي' },

  // Hero Section
  'hero.tagline': { en: 'Where young minds meet the world.', ar: 'حيث تلتقي العقول الشابة بالعالم.' },
  'hero.subtitle': {
    en: 'A youth-led international community where young minds and thinkers explore global issues, exchange perspectives and develop well-reasoned ideas through structured dialogue.',
    ar: 'مجتمع دولي يقوده الشباب، حيث يستكشف المفكرون والعقول الشابة القضايا العالمية، ويتبادلون الرؤى ويطورون أفكاراً محكمة عبر الحوار المنظم.'
  },
  'hero.ctaApply': { en: 'Apply for Membership', ar: 'تقديم طلب الانضمام' },
  'hero.ctaExplore': { en: 'Explore Topic Bank', ar: 'استكشاف بنك المواضيع' },
  'hero.ctaExploreSessions': { en: 'Explore Dialogue Sessions', ar: 'استكشاف جلسات الحوار' },
  'hero.eyebrow': { en: 'GLOBAL YOUTH DIALOGUE COMMUNITY', ar: 'مجتمع الحوار الشبابي الدولي' },
  'hero.leadSubtitle': { en: 'Global Youth Academic & Dialogue Forum', ar: 'منتدى الحوار والأكاديميا الشبابي الدولي' },

  // Sections
  'cycle.title': { en: 'The Dialogue Cycle', ar: 'دورة الحوار' },
  'topics.title': { en: 'Curated Academic Disciplines', ar: 'المحاور المعرفية التخصصية' },
  'publications.title': { en: 'Academic Youth Research & Papers', ar: 'الأبحاث والأوراق الأكاديمية المحكمة' },
  'qatar.badge': { en: 'Founded by Delegates of Qatar ISDC7 Championship', ar: 'تأسست بمبادرة مشاركي بطولة قطر الدولية لمناظرات المدارس' },

  // Member Portal & Switcher
  'portal.memberDashboard': { en: 'Member Dashboard', ar: 'لوحة العضو' },
  'portal.presenterDashboard': { en: 'Presenter Dashboard', ar: 'لوحة المتحدث' },
  'portal.adminPortal': { en: 'Admin Portal', ar: 'بوابة الإدارة' },
  'portal.sessions': { en: 'Sessions & Chambers', ar: 'الجلسات والأرشيف' },
  'portal.academicWritings': { en: 'Academic Writings', ar: 'الأوراق البحثية' },
  'portal.submitFeedback': { en: 'Submit Feedback', ar: 'تقديم التقييم' },
  'portal.topicBank': { en: 'Topic Bank', ar: 'بنك المواضيع' },
  'portal.suggestTopic': { en: 'Suggest a Topic', ar: 'اقتراح موضوع' },
  'portal.myJourney': { en: 'My Journey & Badges', ar: 'مسيرتي والأوسمة' },
  'portal.myProfile': { en: 'My Profile & Settings', ar: 'الملف الشخصي والإعدادات' },
  'portal.notifications': { en: 'Notifications', ar: 'الإشعارات' },
  'portal.delegateDossier': { en: 'Delegate Dossier', ar: 'ملف التفويض' },
  'portal.applyPresenter': { en: 'Request to be Presenter', ar: 'طلب الاعتماد كمتحدث' },
  'portal.speakingSchedule': { en: 'Floor Speaking Schedule', ar: 'جدول الكلمات الرسمية' },

  // Common Actions
  'common.apply': { en: 'Apply', ar: 'تقديم' },
  'common.close': { en: 'Close', ar: 'إغلاق' },
  'common.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'common.submit': { en: 'Submit', ar: 'إرسال' },
  'common.save': { en: 'Save Changes', ar: 'حفظ التغييرات' },
  'common.loading': { en: 'Loading...', ar: 'جارٍ التحميل...' },
  'common.back': { en: 'Back', ar: 'رجوع' },
  'common.view': { en: 'View', ar: 'عرض' },
  'common.readPaper': { en: 'Read Paper', ar: 'قراءة الورقة' },
  'common.joinChamber': { en: 'Join Chamber', ar: 'انضمام للجلسة' },
  'common.watchRecording': { en: 'Watch Recording', ar: 'مشاهدة التسجيل' },
  'common.summary': { en: 'Summary', ar: 'الملخص' },
  'common.all': { en: 'All', ar: 'الكل' },
  'common.copyCitation': { en: 'Copy Citation', ar: 'نسخ الاقتباس' },
  'common.citationCopied': { en: 'Citation copied to clipboard!', ar: 'تم نسخ الاقتباس إلى الحافظة!' },
};

// Categories Arabic Translations
const CATEGORY_MAP_AR: Record<string, string> = {
  'Geopolitics & International Relations': 'الجيوسياسة والعلاقات الدولية',
  'Technology & AI Ethics': 'التكنولوجيا وأخلاقيات الذكاء الاصطناعي',
  'Education & Future of Learning': 'التعليم ومستقبل التعلم',
  'Climate, Environment & Energy': 'المناخ والبيئة والطاقة',
  'Economy, Trade & Labor': 'الاقتصاد والتجارة وسوق العمل',
  'Governance, Law & Human Rights': 'الحوكمة والقانون وحقوق الإنسان',
  'Culture, Identity & Global Media': 'الثقافة والهوية والإعلام العالمي',
  'Public Health, Bioethics & Science': 'الصحة العامة وأخلاقيات الطب الحيوي',
  'Space Governance & Astro-Politics': 'حوكمة الفضاء والسياسة الفضائية',
  'Cybersecurity & Digital Sovereignty': 'الأمن السيبراني والسيادة الرقمية',
  'Youth Leadership & Future Generations': 'القيادة الشبابية وأجيال المستقبل',
  'Peacebuilding, Disarmament & Humanitarian Law': 'بناء السلام ونزع السلاح والقانون الدولي الإنساني',
  'Synthetic Biology & Genetic Horizons': 'علم الأحياء الاصطناعي وآفاق التعديل الجيني',
  'Food Sovereignty & Ocean Ecosystems': 'السيادة الغذائية والنظم البيئية للمحيطات',
  'Philosophy, Epistemology & Applied Ethics': 'الفلسفة ونظرية المعرفة والأخلاق التطبيقية',
  'Urban Futures & Smart Habitats': 'مستقبل المدن والموائل الذكية',
  'International Relations': 'العلاقات الدولية',
  'Global Economics': 'الاقتصاد الدولي',
  'Philosophy & Human Rights': 'الفلسفة وحقوق الإنسان',
  'Environmental Policy': 'السياسات البيئية',
  'Biomedical Ethics': 'الأخلاقيات الطبية والحيوية',
  'Education Reform': 'إصلاح منظومة التعليم',
  'Media & Information Integrity': 'الإعلام والنزاهة المعلوماتية',
  'Topic Presentation': 'عرض تقديمي للقضية',
  'Structured Dialogue': 'حوار منظم',
  'Structural Debate': 'مناظرة هيكلية',
  'Discussion': 'جلسة نقاشية',
  'Guest Talk': 'حديث ضيف خبير',
  'Guest Talks': 'أحاديث الضيوف الخبراء',
  'Academic Discussion / Policy Roundtable': 'حوار أكاديمي / طاولة سياسات مستديرة',
};

// Status Arabic Translations
const STATUS_MAP_AR: Record<string, string> = {
  scheduled: 'مجدولة',
  Scheduled: 'مجدولة',
  Upcoming: 'قادمة',
  completed: 'منعقدة',
  Completed: 'منعقدة',
  Archived: 'مؤرشفة',
  live: 'مباشر الآن',
  Live: 'مباشر الآن',
  in_progress: 'جارية',
  'In Progress': 'جارية',
  proposed: 'مقترح',
  Proposed: 'مقترح',
  reviewing: 'قيد المراجعة',
  under_review: 'قيد المراجعة',
  'Under Review': 'قيد المراجعة',
  approved: 'معتمد',
  Approved: 'معتمد',
  rejected: 'مرفوض',
  Rejected: 'مرفوض',
  published: 'منشور',
  Published: 'منشور',
  draft: 'مسودة',
  Draft: 'مسودة',
  pending: 'معلق',
  Pending: 'معلق',
};

// Roles Arabic Translations
const ROLE_MAP_AR: Record<string, string> = {
  SUPER_ADMIN: 'المشرف العام',
  SuperAdmin: 'المشرف العام',
  ADMIN: 'منسق عام',
  Admin: 'منسق عام',
  COORDINATOR: 'منسق',
  Coordinator: 'منسق',
  PRESENTER: 'متحدث رسمي معتمد',
  Presenter: 'متحدث رسمي معتمد',
  MEMBER: 'عضو معتمد',
  Member: 'عضو معتمد',
  Fellow: 'باحث زميل',
  Delegate: 'وفد معتمد',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('gyde_lang') as Language) || 'en';
  });

  const isArabic = language === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  useEffect(() => {
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
    return fallback || key;
  };

  const translateCategory = (cat: string): string => {
    if (!cat) return '';
    if (!isArabic) return cat;
    return CATEGORY_MAP_AR[cat] || cat;
  };

  const translateStatus = (status: string): string => {
    if (!status) return '';
    if (!isArabic) return status;
    return STATUS_MAP_AR[status] || status;
  };

  const translateRole = (role: string): string => {
    if (!role) return '';
    if (!isArabic) return role;
    return ROLE_MAP_AR[role] || role;
  };

  return (
    <LanguageContext.Provider
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
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
