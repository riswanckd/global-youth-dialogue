import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES } from '../../constants';

const renderCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'globe':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      );
    case 'cpu':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
          <line x1="9" y1="1" x2="9" y2="4"></line>
          <line x1="15" y1="1" x2="15" y2="4"></line>
          <line x1="9" y1="20" x2="9" y2="23"></line>
          <line x1="15" y1="20" x2="15" y2="23"></line>
          <line x1="20" y1="9" x2="23" y2="9"></line>
          <line x1="20" y1="14" x2="23" y2="14"></line>
          <line x1="1" y1="9" x2="4" y2="9"></line>
          <line x1="1" y1="14" x2="4" y2="14"></line>
        </svg>
      );
    case 'book-open':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      );
    case 'leaf':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
        </svg>
      );
    case 'trending-up':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      );
    case 'shield':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      );
    case 'smile':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      );
    case 'heart-pulse':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.28"></path>
        </svg>
      );
    case 'rocket':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
        </svg>
      );
    case 'lock':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      );
    case 'users':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      );
    case 'scale':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
          <path d="M7 21h10"></path>
          <path d="M12 3v18"></path>
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
        </svg>
      );
    case 'dna':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m2 15 6.5 6a7 7 0 0 0 9.8-9.8L12 5.5"></path>
          <path d="m15 2 6 6.5a7 7 0 0 1-9.8 9.8L5.5 12"></path>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      );
    case 'anchor':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="5" r="3"></circle>
          <line x1="12" y1="22" x2="12" y2="8"></line>
          <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
        </svg>
      );
    case 'compass':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
      );
    case 'building-2':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
          <path d="M10 6h4"></path>
          <path d="M10 10h4"></path>
          <path d="M10 14h4"></path>
          <path d="M10 18h4"></path>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      );
  }
};

export const Topics: React.FC = () => {
  const { isArabic } = useLanguage();
  const [search, setSearch] = useState('');

  const filteredCategories = CATEGORIES.filter((cat) => {
    return (
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.nameAr.includes(search) ||
      cat.description.toLowerCase().includes(search.toLowerCase()) ||
      cat.subTopics.some((st) => st.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="public-section active" id="topics">
      <section className="topics-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{isArabic ? 'المحاور المعرفية الرئيسية' : 'Core Knowledge Spheres'}</span>
            <h2 className="section-title serif-text">{isArabic ? 'محاور النقاش والمواضيع' : 'Topic Categories'}</h2>
            <p className="section-desc">
              {isArabic
                ? 'فضاءات معرفية متعددة التخصصات يناقش فيها المناظرون الشباب العلاقات الدولية والتكنولوجيا والمجتمعات الإنسانية.'
                : 'Multidisciplinary arenas where youth debaters examine international relations, technologies, and human societies.'}
            </p>
          </div>

          {/* Search bar & Suggest Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <input
                type="text"
                className="form-control"
                placeholder={isArabic ? 'بحث في المحاور والموضوعات الفرعية...' : 'Search categories or subtopics...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingInlineStart: '2.25rem' }}
              />
              <span style={{ position: 'absolute', insetInlineStart: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
            </div>

            <Link to="/apply" className="btn btn-outline btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginInlineEnd: '4px' }}>
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"></path>
              </svg>
              <span>{isArabic ? 'اقتراح موضوع جديد' : 'Suggest a New Topic'}</span>
            </Link>
          </div>

          <div className="categories-grid" id="publicCategoriesContainer">
            {filteredCategories.map((cat) => (
              <div key={cat.id} className="category-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="category-header">
                  <div className="category-icon">
                    {renderCategoryIcon(cat.icon)}
                  </div>
                  <span className="category-pill">{cat.subTopics.length} {isArabic ? 'مسارات' : 'Subtopics'}</span>
                </div>
                <h4>{isArabic ? cat.nameAr : cat.name}</h4>
                <p>{isArabic ? cat.descriptionAr : cat.description}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.75rem 0', flexGrow: 1 }}>
                  {(isArabic ? cat.subTopicsAr : cat.subTopics).slice(0, 3).map((sub, i) => (
                    <span key={i} className="country-pill" style={{ fontSize: '0.7rem' }}>
                      {sub}
                    </span>
                  ))}
                </div>

                <div className="category-footer">
                  <Link to={`/topics/${cat.id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span>{isArabic ? 'استكشاف الأوراق والمناظرات' : 'Explore Motions & Papers'}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
