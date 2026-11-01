import React, { useState } from 'react';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import {
  Share2,
  Download,
  Copy,
  Check,
  ExternalLink,
  Image,
  FileText,
  Megaphone,
  Globe,
  Sparkles,
  Layers,
  Printer,
  Radio,
} from 'lucide-react';

export const MediaStudio: React.FC = () => {
  const { t, isArabic } = useAdminLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assets' | 'releases' | 'snippets'>('assets');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const [releaseForm, setReleaseForm] = useState({
    title: 'Global Youth Dialogue Convenes International Parliamentary Session',
    targetAudience: 'Diplomatic Press & Youth Academies',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    content: `DOHA / GLOBAL — The Global Youth Dialogue & Exchange (GYDE) Secretariat today announced the convening of its high-level multilateral parliamentary session, bringing together accredited youth scholars, presenters, and delegates from over 14 international country chapters.\n\nThe session examines global institutional frameworks, multilateral governance, and academic youth research. All deliberations are preserved in the permanent digital academic repository at www.thegyde.in/publications.`,
  });

  const mediaKits = [
    {
      id: 'kit-1',
      title: 'GYDE Official Brand & Vector Assets Kit',
      type: 'Vector Logos & SVG Assets',
      size: '2.4 MB',
      description: 'Official primary brand logo, dark/light variations, typography guidelines, and vector emblems.',
      downloadUrl: '/assets/images/gyde_official_logo.svg',
    },
    {
      id: 'kit-2',
      title: 'Global Youth Dialogue Factsheet 2026',
      type: 'Executive Factsheet',
      size: '1.1 MB',
      description: 'Institutional background, 14+ country delegations, academic spheres, and governance structure.',
      downloadUrl: '/assets/docs/gyde_factsheet.pdf',
    },
    {
      id: 'kit-3',
      title: 'Parliamentary Chamber Protocol & Broadcasting Guide',
      type: 'Chamber Standards',
      size: '3.8 MB',
      description: 'Rules of procedure, speaker timing protocols, recording dissemination standards, and media embargo policy.',
      downloadUrl: '/assets/docs/chamber_protocol.pdf',
    },
  ];

  const brandColors = [
    { name: 'Primary Slate (Deep Navy)', hex: '#0f172a', rgb: 'rgb(15, 23, 42)' },
    { name: 'GYDE Royal Indigo', hex: '#4f46e5', rgb: 'rgb(79, 70, 229)' },
    { name: 'Academic Emerald', hex: '#10b981', rgb: 'rgb(16, 185, 129)' },
    { name: 'Deliberation Amber', hex: '#f59e0b', rgb: 'rgb(245, 158, 11)' },
    { name: 'Editorial Purple', hex: '#9333ea', rgb: 'rgb(147, 51, 234)' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Share2 className="w-6 h-6 text-indigo-600" />
          <span>{t('menu.mediaStudio', 'Media & PR Studio')}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isArabic
            ? 'المواد الصحفية، وأصول الهوية الإعلامية، وحقائب البث، وإصدار البيانات الرسمية للمنتدى.'
            : 'Press materials, official public relations assets, broadcast kits, and media communiqués.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('assets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'assets'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>{isArabic ? 'أصول الهوية وحقائب الإعلام' : 'Brand Assets & Media Kits'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('releases')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'releases'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>{isArabic ? 'صانع البيانات الصحفية' : 'Press Release Studio'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('snippets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'snippets'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{isArabic ? 'نصوص البث والتواصل الاجتماعي' : 'Broadcast & Social Snippets'}</span>
        </button>
      </div>

      {/* TAB 1: Brand Assets & Media Kits */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          {/* Logo Showcase Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isArabic ? 'الشعار الرسمي والرموز المتجهة (SVG / Vector)' : 'Official Primary Logo & Vector Identity'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isArabic ? 'أصول معتمدة للبث الإعلامي والمطبوعات الرسمية والمواقع الإلكترونية' : 'Approved vectors for high-resolution broadcast, print publication, and press releases'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/assets/images/gyde_official_logo.svg"
                  download="gyde_official_logo.svg"
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </a>
                <a
                  href="/assets/images/gyde_full_logo.png"
                  download="gyde_full_logo.png"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </a>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <img
                src="/assets/images/gyde_official_logo.svg"
                alt="GYDE Official Logo"
                className="h-14 sm:h-16 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/gyde_full_logo.png';
                }}
              />
            </div>
          </div>

          {/* Media Kits Grid */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              {isArabic ? 'حقائب الصحافة والمطبوعات الرسمية' : 'Official Press Kits & Institutional Publications'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mediaKits.map((kit) => (
                <div
                  key={kit.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {kit.type}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                      {kit.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {kit.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{kit.size}</span>
                    <a
                      href={kit.downloadUrl}
                      download
                      className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'تحميل الحقيبة' : 'Download Kit'}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Color Palette */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isArabic ? 'لوحة الألوان الرسمية للهوية' : 'Official Brand Identity Color Palette'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {brandColors.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => copyToClipboard(color.hex, color.hex)}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-left hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  <div
                    className="w-full h-10 rounded-lg shadow-2xs mb-2 border border-black/5"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {color.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center justify-between">
                    <span>{color.hex}</span>
                    {copiedId === color.hex ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-60" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Press Release Studio */}
      {activeTab === 'releases' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isArabic ? 'صائغ البيانات الصحفية والبيانات العامة' : 'Official Communiqué & Press Release Drafter'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isArabic ? 'صياغة ونشر البيانات الصحفية المعتمدة لوسائل الإعلام والشركاء الدوليين' : 'Format, structure, and export official press statements for diplomatic and media dissemination'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(`${releaseForm.title}\n\nFOR IMMEDIATE RELEASE — ${releaseForm.date}\nTarget Outlets: ${releaseForm.targetAudience}\n\n${releaseForm.content}\n\n###\nMedia Contact: press@thegyde.in | Global Youth Dialogue Secretariat`, 'press-rel')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedId === 'press-rel' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'press-rel' ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ البيان الصحفي' : 'Copy Full Press Release')}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'عنوان البيان الصحفي' : 'Press Release Headline'}
              </label>
              <input
                type="text"
                value={releaseForm.title}
                onChange={(e) => setReleaseForm({ ...releaseForm, title: e.target.value })}
                className="w-full p-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'تاريخ الإصدار' : 'Release Date'}
                </label>
                <input
                  type="text"
                  value={releaseForm.date}
                  onChange={(e) => setReleaseForm({ ...releaseForm, date: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {isArabic ? 'المنافذ المستهدفة' : 'Target Media Circuits'}
                </label>
                <input
                  type="text"
                  value={releaseForm.targetAudience}
                  onChange={(e) => setReleaseForm({ ...releaseForm, targetAudience: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {isArabic ? 'نص البيان الرسمي' : 'Official Statement Body'}
              </label>
              <textarea
                rows={7}
                value={releaseForm.content}
                onChange={(e) => setReleaseForm({ ...releaseForm, content: e.target.value })}
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Broadcast & Social Snippets */}
      {activeTab === 'snippets' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                LinkedIn / Institutional Dispatch
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(`Global Youth Dialogue & Exchange (GYDE) announces its upcoming structured multilateral session. Accredited youth delegates and keynote presenters from over 14 international country chapters will convene to deliberate critical policy themes.\n\nExplore upcoming dialogue schedules and research papers: https://www.thegyde.in`, 'snippet-1')}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                {copiedId === 'snippet-1' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'snippet-1' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-mono bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              Global Youth Dialogue & Exchange (GYDE) announces its upcoming structured multilateral session. Accredited youth delegates and keynote presenters from over 14 international country chapters will convene to deliberate critical policy themes.
              <br /><br />
              Explore upcoming dialogue schedules and research papers: https://www.thegyde.in
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                Academic Papers & Research Monograph Announcement
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(`A new peer-reviewed academic monograph has been indexed in the GYDE Digital Library. Read and cite research papers drafted by verified international fellows at https://www.thegyde.in/publications #GlobalYouthDialogue #AcademicResearch`, 'snippet-2')}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                {copiedId === 'snippet-2' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'snippet-2' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 font-mono bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              A new peer-reviewed academic monograph has been indexed in the GYDE Digital Library. Read and cite research papers drafted by verified international fellows at https://www.thegyde.in/publications #GlobalYouthDialogue #AcademicResearch
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

