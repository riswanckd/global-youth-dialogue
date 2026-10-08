/**
 * GLOBAL YOUTH DIALOGUE - Vector Icon Library
 * Crisp, minimalist black & white vector SVG icons.
 */

const GYD_ICONS = {
  globe: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  
  target: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,

  compass: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>`,

  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,

  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,

  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,

  book: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,

  pen: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,

  lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"></path></svg>`,

  users: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,

  user: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,

  logout: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,

  video: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,

  play: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,

  fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,

  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,

  x: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,

  search: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,

  cpu: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,

  leaf: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>`,

  trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,

  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,

  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,

  mic: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`,

  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,

  layout: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`,

  layers: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,

  award: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,

  sparkle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`,

  messageSquare: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,

  bell: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,

  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,

  share: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,

  activity: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,

  badgeCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,

  filter: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,

  landmark: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="22" x2="22" y2="22"></line><line x1="12" y1="2" x2="2" y2="7"></line><line x1="12" y1="2" x2="22" y2="7"></line><line x1="2" y1="7" x2="22" y2="7"></line><line x1="4" y1="7" x2="4" y2="18"></line><line x1="8" y1="7" x2="8" y2="18"></line><line x1="12" y1="7" x2="12" y2="18"></line><line x1="16" y1="7" x2="16" y2="18"></line><line x1="20" y1="7" x2="20" y2="18"></line><line x1="2" y1="18" x2="22" y2="18"></line></svg>`,

  scale: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"></line><path d="M5 21h14"></path><path d="M4 7l8-4 8 4"></path><path d="M1 11l4-4 4 4a4 4 0 0 1-8 0z"></path><path d="M15 11l4-4 4 4a4 4 0 0 1-8 0z"></path></svg>`,

  brain: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"></path></svg>`,

  rocket: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>`,

  radio: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>`,

  coins: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"></circle><path d="M18.09 10.37A6 6 0 1 1 10.34 18"></path><path d="M7 6h1v4"></path><path d="M16.7 15.3l.6.6"></path></svg>`,

  dna: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 15c6.667-6 13.333 0 20-6"></path><path d="M2 9c6.667 6 13.333 0 20 6"></path><path d="M12 4.5v15"></path><path d="M7.5 7.5v9"></path><path d="M16.5 7.5v9"></path></svg>`,

  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,

  bulletDiamond: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12l10 10 10-10L12 2z"></path></svg>`,

  alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,

  stopCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6" rx="1"></rect></svg>`,

  externalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,

  heart: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`,

  anchor: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"></circle><line x1="12" y1="22" x2="12" y2="8"></line><path d="M5 12H2a10 10 0 0 0 20 0h-3"></path></svg>`,

  droplet: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,

  home: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,

  crosshair: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>`,

  smile: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,

  wifi: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`,

  feather: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>`,

  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`,

  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`,

  star: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,

  party: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.79"></path><path d="M4 3h.01"></path><path d="M22 8h.01"></path><path d="M15 2h.01"></path><path d="M22 20h.01"></path><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38e-2a3 3 0 0 0-2.6 1.5 3 3 0 0 1-2.6 1.5H9.6a3 3 0 0 0-2.6 1.5L4.5 16"></path></svg>`,

  hourglass: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>`,

  folder: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path></svg>`,

  barChart: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>`,

  scroll: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4"></path><path d="M19 17V5a2 2 0 0 0-2-2H4"></path></svg>`,

  refresh: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>`,

  info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,

  mailbox: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,

  liveDot: `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-inline-end: 4px;"><circle cx="12" cy="12" r="8"></circle></svg>`
};

// Aliases for compatibility
GYD_ICONS['book-open'] = GYD_ICONS.book;
GYD_ICONS['trending-up'] = GYD_ICONS.trendingUp;

// Vector SVG Flags (High-contrast, responsive, crisp across all OSs)
GYD_ICONS.flags = {
  QA: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Qatar"><path fill="#8A1538" d="M0 0h640v480H0z"/><path fill="#ffffff" d="M0 0h160l60 26.7-60 26.6 60 26.7-60 26.7 60 26.6-60 26.7 60 26.7-60 26.6 60 26.7-60 26.7 60 26.6-60 26.7 60 26.7-60 26.6 60 26.7-60 26.7 60 26.6-60 26.7 60 26.6-60 26.7 60 26.6-60 26.7 60 26.6-60 26.7 60 26.6H0z"/></svg>`,

  IN: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="India"><path fill="#FF9933" d="M0 0h640v160H0z"/><path fill="#FFFFFF" d="M0 160h640v160H0z"/><path fill="#128807" d="M0 320h640v160H0z"/><circle cx="320" cy="240" r="52" fill="none" stroke="#000080" stroke-width="5"/><circle cx="320" cy="240" r="10" fill="#000080"/><g stroke="#000080" stroke-width="2.5"><line x1="320" y1="188" x2="320" y2="292"/><line x1="268" y1="240" x2="372" y2="240"/><line x1="283" y1="203" x2="357" y2="277"/><line x1="357" y1="203" x2="283" y2="277"/><line x1="270" y1="220" x2="370" y2="260"/><line x1="270" y1="260" x2="370" y2="220"/><line x1="300" y1="189" x2="340" y2="291"/><line x1="340" y1="189" x2="300" y2="291"/><line x1="276" y1="209" x2="364" y2="271"/><line x1="276" y1="271" x2="364" y2="209"/><line x1="310" y1="188" x2="330" y2="292"/><line x1="330" y1="188" x2="310" y2="292"/></g></svg>`,

  GB: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="United Kingdom"><path fill="#012169" d="M0 0h640v480H0z"/><path fill="#FFF" d="m75 0 245 180L565 0h75v60L440 240l200 150v90h-75L320 300 75 480H0v-60l200-150L0 60V0z"/><path fill="#C8102E" d="m424 288 216 162v30L384 300zm-208-96L0 30V0l256 180zM640 0v30L400 210h40L640 30zM0 450v30l240-180h-40z"/><path fill="#FFF" d="M240 0h160v480H240zM0 160h640v160H0z"/><path fill="#C8102E" d="M272 0h96v480h-96zM0 192h640v96H0z"/></svg>`,

  US: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="United States"><path fill="#b22234" d="M0 0h640v480H0z"/><path fill="#fff" d="M0 37h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0zm0 74h640v37H0z"/><path fill="#3c3b6e" d="M0 0h280v259H0z"/><circle cx="50" cy="40" r="7" fill="#fff"/><circle cx="100" cy="40" r="7" fill="#fff"/><circle cx="150" cy="40" r="7" fill="#fff"/><circle cx="200" cy="40" r="7" fill="#fff"/><circle cx="75" cy="80" r="7" fill="#fff"/><circle cx="125" cy="80" r="7" fill="#fff"/><circle cx="175" cy="80" r="7" fill="#fff"/><circle cx="50" cy="120" r="7" fill="#fff"/><circle cx="100" cy="120" r="7" fill="#fff"/><circle cx="150" cy="120" r="7" fill="#fff"/><circle cx="200" cy="120" r="7" fill="#fff"/><circle cx="75" cy="160" r="7" fill="#fff"/><circle cx="125" cy="160" r="7" fill="#fff"/><circle cx="175" cy="160" r="7" fill="#fff"/><circle cx="50" cy="200" r="7" fill="#fff"/><circle cx="100" cy="200" r="7" fill="#fff"/><circle cx="150" cy="200" r="7" fill="#fff"/><circle cx="200" cy="200" r="7" fill="#fff"/></svg>`,

  SG: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Singapore"><path fill="#ed2939" d="M0 0h640v240H0z"/><path fill="#fff" d="M0 240h640v240H0z"/><path fill="#fff" d="M172 120a64 64 0 1 0 0 .1 64 64 0 0 0 0-.1zm-14 0a52 52 0 1 1 52-52 52 52 0 0 1-52 52z"/><circle cx="178" cy="85" r="9" fill="#fff"/><circle cx="204" cy="103" r="9" fill="#fff"/><circle cx="194" cy="133" r="9" fill="#fff"/><circle cx="162" cy="133" r="9" fill="#fff"/><circle cx="152" cy="103" r="9" fill="#fff"/></svg>`,

  GH: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Ghana"><path fill="#006b3f" d="M0 320h640v160H0z"/><path fill="#fcd116" d="M0 160h640v160H0z"/><path fill="#ce1126" d="M0 0h640v160H0z"/><polygon fill="#000" points="320,175 342,242 413,242 355,283 378,350 320,308 262,350 285,283 227,242 298,242"/></svg>`,

  MX: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Mexico"><path fill="#006847" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#ce1126" d="M426.7 0H640v480H426.7z"/><circle cx="320" cy="240" r="38" fill="#c3933c"/><circle cx="320" cy="240" r="28" fill="#6d5423"/><path d="M312 225l16 10-16 15z" fill="#fff"/></svg>`,

  JO: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Jordan"><path fill="#007a3d" d="M0 320h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#000" d="M0 0h640v160H0z"/><polygon fill="#ce1126" points="0,0 320,240 0,480"/><polygon fill="#fff" points="107,222 112,233 124,230 118,240 126,248 114,249 112,260 104,251 93,254 98,244 91,235 102,236"/></svg>`,

  ZA: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="South Africa"><path fill="#002395" d="M0 320h640v160H0z"/><path fill="#de3831" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 144h640v192H0z"/><path fill="#007a3d" d="M0 168h640v144H0z"/><polygon fill="#ffb612" points="0,0 240,240 0,480"/><polygon fill="#000" points="0,32 208,240 0,448"/></svg>`,

  PK: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Pakistan"><path fill="#01411c" d="M0 0h640v480H0z"/><path fill="#fff" d="M0 0h160v480H0z"/><path fill="#fff" d="M430 178a90 90 0 1 0 0 124 90 90 0 0 1 0-124zm20 30l-10 32 30-18-34 4 22 26z"/></svg>`,

  NL: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Netherlands"><path fill="#21468b" d="M0 320h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#ae1c28" d="M0 0h640v160H0z"/></svg>`,

  KE: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Kenya"><path fill="#006600" d="M0 320h640v160H0z"/><path fill="#fff" d="M0 148h640v184H0z"/><path fill="#990000" d="M0 168h640v144H0z"/><path fill="#000" d="M0 0h640v148H0z"/><ellipse cx="320" cy="240" rx="36" ry="60" fill="#990000" stroke="#fff" stroke-width="4"/><circle cx="320" cy="240" r="10" fill="#fff"/></svg>`,

  CA: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Canada"><path fill="#d80027" d="M0 0h160v480H0zm480 0h160v480H480z"/><path fill="#fff" d="M160 0h320v480H160z"/><path fill="#d80027" d="m320 90 18 48 38-16-10 40 42 12-28 28 32 30-48 10 2 50-36-28-10 66h-10l-10-66-36 28 2-50-48-10 32-30-28-28 42-12-10-40 38 16z"/></svg>`,

  AU: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Australia"><path fill="#00008b" d="M0 0h640v480H0z"/><path fill="#fff" d="m0 0 160 120M160 0 0 120" stroke="#fff" stroke-width="24"/><path fill="#c8102e" d="m0 0 160 120M160 0 0 120" stroke="#c8102e" stroke-width="12"/><path fill="#fff" d="M80 0v120M0 60h160" stroke="#fff" stroke-width="36"/><path fill="#c8102e" d="M80 0v120M0 60h160" stroke="#c8102e" stroke-width="20"/><circle cx="160" cy="360" r="32" fill="#fff"/><circle cx="480" cy="120" r="16" fill="#fff"/><circle cx="560" cy="200" r="16" fill="#fff"/><circle cx="480" cy="380" r="16" fill="#fff"/><circle cx="420" cy="240" r="16" fill="#fff"/><circle cx="510" cy="280" r="10" fill="#fff"/></svg>`,

  DE: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Germany"><path fill="#000" d="M0 0h640v160H0z"/><path fill="#dd0000" d="M0 160h640v160H0z"/><path fill="#ffce00" d="M0 320h640v160H0z"/></svg>`,

  FR: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="France"><path fill="#002395" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#ed2939" d="M426.7 0H640v480H426.7z"/></svg>`,

  SA: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Saudi Arabia"><path fill="#006c35" d="M0 0h640v480H0z"/><path fill="#fff" d="M140 310h360v16H140zm20 0-40 8 40 8zm320-16 20 24-20 24z"/><text x="320" y="240" fill="#fff" font-size="64" font-family="sans-serif" font-weight="bold" text-anchor="middle">لا إله إلا الله</text></svg>`,

  AE: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="United Arab Emirates"><path fill="#00732f" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#000" d="M0 320h640v160H0z"/><path fill="#f00" d="M0 0h160v480H0z"/></svg>`,

  TR: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Turkey"><path fill="#e30a17" d="M0 0h640v480H0z"/><circle cx="260" cy="240" r="120" fill="#fff"/><circle cx="290" cy="240" r="96" fill="#e30a17"/><polygon fill="#fff" points="380,240 440,260 410,200 410,280 440,220"/></svg>`,

  EG: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Egypt"><path fill="#c8102e" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#000" d="M0 320h640v160H0z"/><circle cx="320" cy="240" r="30" fill="#c09339"/></svg>`,

  PS: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Palestine"><path fill="#000" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#007a3d" d="M0 320h640v160H0z"/><polygon fill="#e4312b" points="0,0 240,240 0,480"/></svg>`,

  MY: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Malaysia"><path fill="#cc0000" d="M0 0h640v480H0z"/><path fill="#fff" d="M0 34h640v34H0zm0 68h640v34H0zm0 68h640v34H0zm0 68h640v34H0zm0 68h640v34H0zm0 68h640v34H0zm0 68h640v34H0z"/><path fill="#000066" d="M0 0h320v272H0z"/><circle cx="160" cy="136" r="68" fill="#ffcc00"/><circle cx="180" cy="136" r="56" fill="#000066"/><circle cx="210" cy="136" r="36" fill="#ffcc00"/></svg>`,

  NG: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Nigeria"><path fill="#008751" d="M0 0h213.3v480H0zm426.7 0H640v480H426.7z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/></svg>`,

  BR: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Brazil"><path fill="#009b3a" d="M0 0h640v480H0z"/><polygon fill="#fedf00" points="320,40 600,240 320,440 40,240"/><circle cx="320" cy="240" r="90" fill="#002776"/><path fill="#fff" d="M232 245a90 90 0 0 1 176 -10 90 90 0 0 0 -176 10z"/></svg>`,

  JP: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Japan"><path fill="#fff" d="M0 0h640v480H0z"/><circle cx="320" cy="240" r="120" fill="#bc002d"/></svg>`,

  CN: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="China"><path fill="#ee1c25" d="M0 0h640v480H0z"/><polygon fill="#ffff00" points="100,50 115,95 160,95 125,120 140,165 100,140 60,165 75,120 40,95 85,95"/></svg>`,

  ID: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Indonesia"><path fill="#ff0000" d="M0 0h640v240H0z"/><path fill="#ffffff" d="M0 240h640v240H0z"/></svg>`,

  KW: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Kuwait"><path fill="#007a3d" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#ce1126" d="M0 320h640v160H0z"/><polygon fill="#000" points="0,0 160,160 160,320 0,480"/></svg>`,

  OM: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Oman"><path fill="#fff" d="M0 0h640v160H0z"/><path fill="#db161b" d="M0 160h640v160H0z"/><path fill="#008000" d="M0 320h640v160H0z"/><path fill="#db161b" d="M0 0h160v480H0z"/></svg>`,

  MA: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Morocco"><path fill="#c1272d" d="M0 0h640v480H0z"/><polygon fill="none" stroke="#006233" stroke-width="12" points="320,150 360,270 260,195 380,195 280,270"/></svg>`,

  BD: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Bangladesh"><path fill="#006a4e" d="M0 0h640v480H0z"/><circle cx="280" cy="240" r="130" fill="#f42a41"/></svg>`,

  LK: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Sri Lanka"><path fill="#ffbe29" d="M0 0h640v480H0z"/><path fill="#00534e" d="M30 30h90v420H30z"/><path fill="#eb7400" d="M120 30h90v420H120z"/><path fill="#8d153a" d="M230 30h380v420H230z"/><circle cx="420" cy="240" r="50" fill="#ffbe29"/></svg>`,

  IT: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Italy"><path fill="#009246" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#ce2b37" d="M426.7 0H640v480H426.7z"/></svg>`,

  ES: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Spain"><path fill="#aa151b" d="M0 0h640v120H0zm0 360h640v120H0z"/><path fill="#f1bf00" d="M0 120h640v240H0z"/><circle cx="180" cy="240" r="40" fill="#aa151b"/></svg>`,

  RU: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="Russia"><path fill="#fff" d="M0 0h640v160H0z"/><path fill="#0039a6" d="M0 160h640v160H0z"/><path fill="#d52b1e" d="M0 320h640v160H0z"/></svg>`,

  NZ: `<svg class="flag-svg" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" aria-label="New Zealand"><path fill="#00247d" d="M0 0h640v480H0z"/><path fill="#fff" d="m0 0 160 120M160 0 0 120" stroke="#fff" stroke-width="24"/><path fill="#cc142b" d="m0 0 160 120M160 0 0 120" stroke="#cc142b" stroke-width="12"/><path fill="#fff" d="M80 0v120M0 60h160" stroke="#fff" stroke-width="36"/><path fill="#cc142b" d="M80 0v120M0 60h160" stroke="#cc142b" stroke-width="20"/><circle cx="480" cy="140" r="14" fill="#cc142b" stroke="#fff" stroke-width="4"/><circle cx="540" cy="210" r="12" fill="#cc142b" stroke="#fff" stroke-width="4"/><circle cx="480" cy="340" r="14" fill="#cc142b" stroke="#fff" stroke-width="4"/><circle cx="430" cy="240" r="12" fill="#cc142b" stroke="#fff" stroke-width="4"/></svg>`,

  INT: `<svg class="flag-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#2E7D5A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="background: rgba(46,125,90,0.12);" aria-label="International"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
};

// Comprehensive mapping of country names, variants, and Arabic names to ISO-2 codes
const GYD_COUNTRY_MAP = {
  'india': 'IN', 'indian': 'IN', 'bharat': 'IN', 'hindustan': 'IN', 'الهند': 'IN',
  'qatar': 'QA', 'qatari': 'QA', 'doha': 'QA', 'قطر': 'QA',
  'united kingdom': 'GB', 'uk': 'GB', 'britain': 'GB', 'great britain': 'GB', 'england': 'GB', 'scotland': 'GB', 'wales': 'GB', 'british': 'GB', 'بريطانيا': 'GB', 'المملكة المتحدة': 'GB',
  'united states': 'US', 'usa': 'US', 'us': 'US', 'america': 'US', 'american': 'US', 'united states of america': 'US', 'أمريكا': 'US', 'الولايات المتحدة': 'US',
  'singapore': 'SG', 'singaporean': 'SG', 'سنغافورة': 'SG',
  'ghana': 'GH', 'ghanaian': 'GH', 'غانا': 'GH',
  'mexico': 'MX', 'mexican': 'MX', 'المكسيك': 'MX',
  'jordan': 'JO', 'jordanian': 'JO', 'الأردن': 'JO', 'الاردن': 'JO',
  'south africa': 'ZA', 'south african': 'ZA', 'جنوب أفريقيا': 'ZA', 'جنوب افريقيا': 'ZA',
  'pakistan': 'PK', 'pakistani': 'PK', 'باكستان': 'PK',
  'netherlands': 'NL', 'dutch': 'NL', 'holland': 'NL', 'هولندا': 'NL',
  'kenya': 'KE', 'kenyan': 'KE', 'كينيا': 'KE',
  'canada': 'CA', 'canadian': 'CA', 'كندا': 'CA',
  'australia': 'AU', 'australian': 'AU', 'أستراليا': 'AU', 'استراليا': 'AU',
  'germany': 'DE', 'german': 'DE', 'deutschland': 'DE', 'ألمانيا': 'DE', 'المانيا': 'DE',
  'france': 'FR', 'french': 'FR', 'فرنسا': 'FR',
  'turkey': 'TR', 'turkish': 'TR', 'türkiye': 'TR', 'turkiye': 'TR', 'تركيا': 'TR',
  'saudi arabia': 'SA', 'saudi': 'SA', 'ksa': 'SA', 'المملكة العربية السعودية': 'SA', 'السعودية': 'SA',
  'united arab emirates': 'AE', 'uae': 'AE', 'emirates': 'AE', 'dubai': 'AE', 'abu dhabi': 'AE', 'الإمارات': 'AE', 'الامارات': 'AE',
  'kuwait': 'KW', 'kuwaiti': 'KW', 'الكويت': 'KW',
  'oman': 'OM', 'omani': 'OM', 'عمان': 'OM', 'عُمان': 'OM',
  'bahrain': 'BH', 'bahraini': 'BH', 'البحرين': 'BH',
  'egypt': 'EG', 'egyptian': 'EG', 'مصر': 'EG',
  'palestine': 'PS', 'palestinian': 'PS', 'فلسطين': 'PS',
  'lebanon': 'LB', 'lebanese': 'LB', 'لبنان': 'LB',
  'morocco': 'MA', 'moroccan': 'MA', 'المغرب': 'MA',
  'malaysia': 'MY', 'malaysian': 'MY', 'ماليزيا': 'MY',
  'indonesia': 'ID', 'indonesian': 'ID', 'إندونيسيا': 'ID', 'اندونيسيا': 'ID',
  'nigeria': 'NG', 'nigerian': 'NG', 'نيجيريا': 'NG',
  'tunisia': 'TN', 'tunisian': 'TN', 'تونس': 'TN',
  'algeria': 'DZ', 'algerian': 'DZ', 'الجزائر': 'DZ',
  'iraq': 'IQ', 'iraqi': 'IQ', 'العراق': 'IQ',
  'syria': 'SY', 'syrian': 'SY', 'سوريا': 'SY',
  'yemen': 'YE', 'yemeni': 'YE', 'اليمن': 'YE',
  'sudan': 'SD', 'sudanese': 'SD', 'السودان': 'SD',
  'brazil': 'BR', 'brazilian': 'BR', 'البرازيل': 'BR',
  'japan': 'JP', 'japanese': 'JP', 'اليابان': 'JP',
  'china': 'CN', 'chinese': 'CN', 'الصين': 'CN',
  'bangladesh': 'BD', 'bangladeshi': 'BD', 'بنغلاديش': 'BD',
  'sri lanka': 'LK', 'sri lankan': 'LK', 'سريلانكا': 'LK',
  'nepal': 'NP', 'nepali': 'NP', 'نيبال': 'NP',
  'philippines': 'PH', 'filipino': 'PH', 'الفلبين': 'PH',
  'italy': 'IT', 'italian': 'IT', 'إيطاليا': 'IT', 'ايطاليا': 'IT',
  'spain': 'ES', 'spanish': 'ES', 'إسبانيا': 'ES', 'اسبانيا': 'ES',
  'russia': 'RU', 'russian': 'RU', 'روسيا': 'RU',
  'new zealand': 'NZ', 'نيوزيلندا': 'NZ',
  'argentina': 'AR', 'الأرجنتين': 'AR',
  'ireland': 'IE', 'أيرلندا': 'IE',
  'switzerland': 'CH', 'سويسرا': 'CH',
  'sweden': 'SE', 'السويد': 'SE',
  'norway': 'NO', 'النرويج': 'NO',
  'denmark': 'DK', 'الدنمارك': 'DK',
  'finland': 'FI', 'فنلندا': 'FI',
  'poland': 'PL', 'بولندا': 'PL',
  'portugal': 'PT', 'البرتغال': 'PT',
  'belgium': 'BE', 'بلجيكا': 'BE',
  'austria': 'AT', 'النمسا': 'AT',
  'greece': 'GR', 'اليونان': 'GR',
  'south korea': 'KR', 'korea': 'KR', 'كوريا الجنوبية': 'KR', 'كوريا': 'KR',
  'thailand': 'TH', 'تايلاند': 'TH',
  'vietnam': 'VN', 'فيتنام': 'VN',
  'colombia': 'CO', 'كولومبيا': 'CO',
  'chile': 'CL', 'تشيلي': 'CL',
  'peru': 'PE', 'بيرو': 'PE',
  'ethiopia': 'ET', 'إثيوبيا': 'ET',
  'uganda': 'UG', 'أوغندا': 'UG',
  'tanzania': 'TZ', 'تنزانيا': 'TZ',
  'rwanda': 'RW', 'رواندا': 'RW',
  'zimbabwe': 'ZW', 'زيمبابوي': 'ZW',
  'zambia': 'ZM', 'زامبيا': 'ZM',
  'somalia': 'SO', 'الصومال': 'SO',
  'libya': 'LY', 'ليبيا': 'LY',
  'afghanistan': 'AF', 'أفغانستان': 'AF',
  'iran': 'IR', 'إيران': 'IR',
  'ukraine': 'UA', 'أوكرانيا': 'UA'
};

// Resolver helper to convert country text, emoji, or code to standard ISO-2
GYD_ICONS.resolveCountryCode = function(countryOrCode, fallbackFlag) {
  function extractEmoji(str) {
    if (!str) return null;
    const chars = Array.from(String(str));
    const codes = [];
    for (const ch of chars) {
      const cp = ch.codePointAt(0);
      if (cp >= 0x1F1E6 && cp <= 0x1F1FF) {
        codes.push(String.fromCharCode(cp - 0x1F1E6 + 65));
      }
    }
    return codes.length === 2 ? codes.join('') : null;
  }

  // Check emoji flags in either parameter
  const fromEmoji = extractEmoji(countryOrCode) || extractEmoji(fallbackFlag);
  if (fromEmoji) return fromEmoji;

  const raw = String(countryOrCode || '').trim();
  const c = raw.toLowerCase();

  // Pure 2-letter ISO code
  if (/^[a-z]{2}$/i.test(c)) {
    return c.toUpperCase();
  }

  // Direct map check
  if (GYD_COUNTRY_MAP[c]) {
    return GYD_COUNTRY_MAP[c];
  }

  // Substring match against dictionary
  if (c.length > 2) {
    for (const key of Object.keys(GYD_COUNTRY_MAP)) {
      if (key.length > 2 && (c.includes(key) || key.includes(c))) {
        return GYD_COUNTRY_MAP[key];
      }
    }
  }

  // Check fallbackFlag if 2-letter
  if (fallbackFlag && /^[a-z]{2}$/i.test(String(fallbackFlag).trim())) {
    return String(fallbackFlag).trim().toUpperCase();
  }

  return null;
};

// Universal flag renderer
GYD_ICONS.getFlag = function(countryOrCode, fallbackFlag) {
  if (!countryOrCode && !fallbackFlag) return GYD_ICONS.flags.INT;
  
  const code = GYD_ICONS.resolveCountryCode(countryOrCode, fallbackFlag);
  if (code) {
    if (GYD_ICONS.flags[code]) {
      return GYD_ICONS.flags[code];
    }
    // Universal CDN fallback for any country in the world
    const cLower = code.toLowerCase();
    return `<img class="flag-svg" src="https://flagcdn.com/w80/${cLower}.png" alt="${code}" loading="lazy" onerror="this.outerHTML=GYD_ICONS.flags.INT;">`;
  }

  return GYD_ICONS.flags.INT;
};

GYD_ICONS.resolveCode = GYD_ICONS.resolveCountryCode;
window.GYD_ICONS = GYD_ICONS;
window.icons = GYD_ICONS;
