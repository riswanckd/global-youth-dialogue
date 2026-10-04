/**
 * GLOBAL YOUTH DIALOGUE - Main Application Controller
 * Handles UI routing, dynamic rendering, role-based portal switching, and user interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize services
  const dataService = window.GYD_DATA;
  const authService = window.GYD_AUTH;
  const i18n = window.GYD_I18N;
  const icons = window.GYD_ICONS || {};

  // Track active subviews
  let currentMemberSubview = 'dashboard';
  let currentCoordSubview = 'dashboard';

  // =========================================================================
  // TOAST NOTIFICATION UTILITY
  // =========================================================================
  function showToast(message, type = 'normal') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <span class="svg-icon">${type === 'success' ? icons.check : type === 'error' ? icons.x : icons.sparkle}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // =========================================================================
  // MODAL CONTROLLERS
  // =========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Modal event listeners
  document.getElementById('headerLoginBtn')?.addEventListener('click', () => openModal('authModal'));
  document.getElementById('headerJoinBtn')?.addEventListener('click', () => openModal('applyModal'));
  document.getElementById('heroJoinBtn')?.addEventListener('click', () => openModal('applyModal'));
  document.getElementById('bannerLoginBtn')?.addEventListener('click', () => openModal('authModal'));
  document.getElementById('bannerApplyBtn')?.addEventListener('click', () => openModal('applyModal'));
  document.getElementById('footerApplyLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('applyModal');
  });

  document.getElementById('authModalClose')?.addEventListener('click', () => closeModal('authModal'));
  document.getElementById('applyModalClose')?.addEventListener('click', () => closeModal('applyModal'));
  document.getElementById('sessionDetailClose')?.addEventListener('click', () => closeModal('sessionDetailModal'));
  document.getElementById('writingReaderClose')?.addEventListener('click', () => closeModal('writingReaderModal'));
  document.getElementById('searchModalClose')?.addEventListener('click', () => closeModal('globalSearchModal'));
  document.getElementById('notificationsModalClose')?.addEventListener('click', () => closeModal('notificationsModal'));
  document.getElementById('newChapterModalClose')?.addEventListener('click', () => closeModal('newChapterModal'));
  document.getElementById('newMediaKitModalClose')?.addEventListener('click', () => closeModal('newMediaKitModal'));

  // Switch between Login and Apply modal
  document.getElementById('switchApplyModalBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('authModal');
    openModal('applyModal');
  });

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // =========================================================================
  // MOBILE NAVIGATION DRAWER CONTROLLER
  // =========================================================================
  function openMobileDrawer() {
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    if (drawer && backdrop) {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileDrawer() {
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Mobile drawer triggers
  document.getElementById('mobileMenuToggleBtn')?.addEventListener('click', openMobileDrawer);
  document.getElementById('mobileDrawerCloseBtn')?.addEventListener('click', closeMobileDrawer);
  document.getElementById('mobileDrawerBackdrop')?.addEventListener('click', closeMobileDrawer);

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // =========================================================================
  // LANGUAGE & RTL TOGGLE
  // =========================================================================
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = i18n.getLang() === 'en' ? 'ar' : 'en';
      i18n.setLang(nextLang);
      renderAll();
    });
  }

  // =========================================================================
  // AUTHENTICATION & PORTAL SWITCHING
  // =========================================================================
  let activePortal = 'public';

  function updateAuthHeaderUI() {
    const user = authService.getCurrentUser();
    const container = document.getElementById('authActionsContainer');
    const publicNav = document.getElementById('publicNav');
    const isAr = i18n.isRTL();

    if (!container) return;

    if (user) {
      const isCoord = user.role === 'Coordinator';
      const isOnPublic = activePortal === 'public';
      const homeText = isAr ? 'الرئيسية' : 'Home';
      const portalText = isCoord ? (isAr ? 'بوابة المنسقين' : 'Coordinator Portal') : (isAr ? 'بوابة الأعضاء' : 'Member Portal');
      const logoutText = isAr ? 'تسجيل الخروج' : 'Sign Out';

      container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: nowrap;">
          ${!isOnPublic ? `
            <button class="btn btn-subtle btn-sm" id="headerPublicViewBtn" title="${homeText}">
              ${homeText}
            </button>
          ` : `
            <button class="btn ${isCoord ? 'btn-navy' : 'btn-primary'} btn-sm" id="headerPortalSwitchBtn">
              ${portalText}
            </button>
          `}
          <button class="btn btn-outline btn-sm" id="headerLogoutBtn" title="${logoutText}">${logoutText}</button>
        </div>
      `;

      document.getElementById('headerPublicViewBtn')?.addEventListener('click', () => {
        navigateToPortal('public');
      });

      document.getElementById('headerPortalSwitchBtn')?.addEventListener('click', () => {
        navigateToPortal(user.role === 'Coordinator' ? 'coordinator' : 'member');
      });

      document.getElementById('headerLogoutBtn')?.addEventListener('click', () => {
        authService.logout();
        navigateToPortal('public');
        showToast(isAr ? 'تم تسجيل الخروج بنجاح.' : 'You have signed out successfully.');
      });

      if (publicNav) publicNav.style.display = (activePortal === 'public') ? 'flex' : 'none';

      // Update mobile drawer actions for logged in user
      const drawerActions = document.getElementById('mobileDrawerActions');
      if (drawerActions) {
        drawerActions.innerHTML = `
          ${!isOnPublic ? `
            <button class="btn btn-subtle" id="drawerHomeBtn" style="width: 100%;">
              ${homeText}
            </button>
          ` : `
            <button class="btn ${isCoord ? 'btn-navy' : 'btn-primary'}" id="drawerPortalBtn" style="width: 100%;">
              ${portalText}
            </button>
          `}
          <button class="btn btn-outline" id="drawerLogoutBtn" style="width: 100%;">${logoutText}</button>
        `;
        document.getElementById('drawerHomeBtn')?.addEventListener('click', () => {
          closeMobileDrawer();
          navigateToPortal('public');
        });
        document.getElementById('drawerPortalBtn')?.addEventListener('click', () => {
          closeMobileDrawer();
          navigateToPortal(user.role === 'Coordinator' ? 'coordinator' : 'member');
        });
        document.getElementById('drawerLogoutBtn')?.addEventListener('click', () => {
          closeMobileDrawer();
          authService.logout();
          navigateToPortal('public');
          showToast(isAr ? 'تم تسجيل الخروج بنجاح.' : 'You have signed out successfully.');
        });
      }
    } else {
      const homeBtnText = isAr ? 'الرئيسية →' : '← Home';
      const loginText = isAr ? 'تسجيل الدخول' : 'Sign In';
      const joinText = isAr ? 'انضم إلينا' : 'Join Us';

      // Update mobile drawer actions for public / guest user
      const drawerActions = document.getElementById('mobileDrawerActions');
      if (drawerActions) {
        drawerActions.innerHTML = `
          <button class="btn btn-outline" id="mobileDrawerLoginBtn" style="width: 100%;">${loginText}</button>
          <button class="btn btn-primary" id="mobileDrawerJoinBtn" style="width: 100%;">${isAr ? 'تقديم طلب عضوية' : 'Apply for Membership'}</button>
        `;
        document.getElementById('mobileDrawerLoginBtn')?.addEventListener('click', () => {
          closeMobileDrawer();
          navigateToPortal('signin');
        });
        document.getElementById('mobileDrawerJoinBtn')?.addEventListener('click', () => {
          closeMobileDrawer();
          openModal('applyModal');
        });
      }

      if (activePortal === 'signin') {
        container.innerHTML = `
          <button class="btn btn-subtle btn-sm" id="headerBackToPublicBtn">${homeBtnText}</button>
          <button class="btn btn-primary btn-sm" id="headerJoinBtn">${joinText}</button>
        `;
        document.getElementById('headerBackToPublicBtn')?.addEventListener('click', () => navigateToPortal('public'));
        document.getElementById('headerJoinBtn')?.addEventListener('click', () => openModal('applyModal'));
        if (publicNav) publicNav.style.display = 'flex';
      } else {
        container.innerHTML = `
          <button class="btn btn-outline btn-sm" id="headerLoginBtn">${loginText}</button>
          <button class="btn btn-primary btn-sm" id="headerJoinBtn">${joinText}</button>
        `;

        document.getElementById('headerLoginBtn')?.addEventListener('click', () => navigateToPortal('signin'));
        document.getElementById('headerJoinBtn')?.addEventListener('click', () => openModal('applyModal'));
        if (publicNav) publicNav.style.display = 'flex';
      }
    }
  }

  function navigateToPortal(portalName) {
    const viewPublic = document.getElementById('viewPublic');
    const viewMember = document.getElementById('viewMember');
    const viewCoordinator = document.getElementById('viewCoordinator');
    const viewSignIn = document.getElementById('viewSignIn');

    // Hide all
    if (viewPublic) viewPublic.style.display = 'none';
    if (viewMember) viewMember.style.display = 'none';
    if (viewCoordinator) viewCoordinator.style.display = 'none';
    if (viewSignIn) viewSignIn.style.display = 'none';

    activePortal = portalName;

    if (portalName === 'coordinator') {
      if (!authService.isCoordinator()) {
        showToast('Coordinator clearance required. Please sign in.', 'error');
        navigateToPortal('signin');
        return;
      }
      if (viewCoordinator) viewCoordinator.style.display = 'block';
      renderCoordinatorPortal();
      window.scrollTo(0, 0);
    } else if (portalName === 'member') {
      if (!authService.isLoggedIn()) {
        showToast('Member access required. Please sign in.', 'error');
        navigateToPortal('signin');
        return;
      }
      if (viewMember) viewMember.style.display = 'block';
      renderMemberPortal();
      window.scrollTo(0, 0);
    } else if (portalName === 'signin') {
      const user = authService.getCurrentUser();
      if (user) {
        if (user.role === 'Coordinator') {
          navigateToPortal('coordinator');
        } else {
          navigateToPortal('member');
        }
        return;
      }
      if (viewSignIn) viewSignIn.style.display = 'block';
      window.scrollTo(0, 0);
    } else {
      activePortal = 'public';
      if (viewPublic) viewPublic.style.display = 'block';
      renderPublicPage();
      window.scrollTo(0, 0);
    }

    updateAuthHeaderUI();
  }

  // Logo click returns to appropriate view
  document.getElementById('brandLogo')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (authService.isCoordinator()) {
      navigateToPortal('coordinator');
    } else if (authService.isLoggedIn()) {
      navigateToPortal('member');
    } else {
      navigateToPortal('public');
    }
  });

  // Footer portal links
  document.getElementById('footerPublicPreviewLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToPortal('public');
  });

  document.getElementById('footerSignInLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    const user = authService.getCurrentUser();
    if (user) {
      navigateToPortal(user.role === 'Coordinator' ? 'coordinator' : 'member');
    } else {
      navigateToPortal('signin');
    }
  });

  // Unified Sign In Form Handler (Auto-detects Member vs Admin)
  document.getElementById('unifiedLoginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('unifiedEmail').value.trim();
    const password = document.getElementById('unifiedPassword').value.trim();

    const result = authService.login(email, password);
    if (result.success) {
      if (result.user.role === 'Coordinator') {
        navigateToPortal('coordinator');
        showToast(`Identified as Admin / Coordinator. Welcome, ${result.user.name}!`, 'success');
      } else {
        navigateToPortal('member');
        showToast(`Identified as Member / Delegate. Welcome, ${result.user.name}!`, 'success');
      }
    } else {
      showToast(result.message, 'error');
    }
  });

  // 1-Click Role Testing on Unified Sign In Portal
  document.getElementById('demoRoleMemberBtn')?.addEventListener('click', () => {
    const res = authService.login('member@gyd.org', 'password123');
    if (res.success) {
      navigateToPortal('member');
      showToast('Identified as Member (Kofi Mensah) → Opened Member Features!', 'success');
    }
  });

  document.getElementById('demoRoleAdminBtn')?.addEventListener('click', () => {
    const res = authService.login('coordinator@gyd.org', 'password123');
    if (res.success) {
      navigateToPortal('coordinator');
      showToast('Identified as Admin / Coordinator (Tariq Al-Mansoor) → Opened Admin Workspace!', 'success');
    }
  });

  // Navigation Links on Unified Sign In Portal
  document.getElementById('authToPublicLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToPortal('public');
  });

  document.getElementById('authToApplyLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('applyModal');
  });

  // Fallback modal demo buttons
  document.getElementById('demoCoordBtn')?.addEventListener('click', () => {
    const res = authService.loginAsDemo('Coordinator');
    if (res.success) {
      closeModal('authModal');
      navigateToPortal('coordinator');
      showToast(`Signed in as Founding Coordinator: ${res.user.name} (${res.user.country})`, 'success');
    }
  });

  document.getElementById('demoMemberBtn')?.addEventListener('click', () => {
    const res = authService.loginAsDemo('Member');
    if (res.success) {
      closeModal('authModal');
      navigateToPortal('member');
      showToast(`Signed in as Verified Debater: ${res.user.name} (${res.user.country})`, 'success');
    }
  });

  // Real Login Form Handler
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const result = authService.login(email, password);
    if (result.success) {
      closeModal('authModal');
      if (result.user.role === 'Coordinator') {
        navigateToPortal('coordinator');
      } else {
        navigateToPortal('member');
      }
      showToast(`Welcome back, ${result.user.name}!`, 'success');
    } else {
      showToast(result.message, 'error');
    }
  });

  // Membership Application Form Handler
  document.getElementById('membershipApplicationForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('appFullName').value.trim();
    const email = document.getElementById('appEmail').value.trim();
    const country = document.getElementById('appCountry').value.trim();
    const debateExp = document.getElementById('appDebateExp').value.trim();
    const motivation = document.getElementById('appMotivation').value.trim();

    const checkedBoxes = document.querySelectorAll('#interestCheckboxes input:checked');
    const interests = Array.from(checkedBoxes).map(cb => cb.value);

    dataService.submitApplication({
      name,
      email,
      country,
      flag: 'INT',
      interests: interests.length ? interests : ['Global Affairs'],
      debateExperience: debateExp,
      motivation
    });

    closeModal('applyModal');
    const toastMsg = i18n.isRTL() 
      ? 'تم استلام طلب عضويتك بنجاح وإرساله للمنسقين للمراجعة!' 
      : 'Your membership application has been received and sent to coordinators for review!';
    showToast(toastMsg, 'success');
    e.target.reset();
  });

  // =========================================================================
  // PUBLIC SECTION BAR SWITCHER & NAVIGATION
  // =========================================================================
  let currentPublicSection = 'home';

  function switchPublicSection(sectionId) {
    const rawId = (sectionId || 'home').replace(/^#/, '');
    const validSections = ['home', 'about', 'topics', 'sessions', 'impact'];
    const targetId = validSections.includes(rawId) ? rawId : 'home';
    currentPublicSection = targetId;

    // Toggle active classes and inline display on public section panels
    const sections = document.querySelectorAll('#viewPublic .public-section');
    sections.forEach(sec => {
      if (sec.id === targetId) {
        sec.classList.add('active');
        sec.style.display = 'block';
      } else {
        sec.classList.remove('active');
        sec.style.display = 'none';
      }
    });

    // Update active nav link indicators
    document.querySelectorAll('#publicNav .nav-link, #mobileNavDrawer .mobile-nav-link, .site-footer a[href^="#"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${targetId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile drawer if open
    closeMobileDrawer();

    // Scroll window smoothly to top of the view
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash cleanly
    if (window.location.hash !== `#${targetId}`) {
      try {
        history.replaceState(null, '', `#${targetId}`);
      } catch (e) {
        window.location.hash = `#${targetId}`;
      }
    }
  }

  // Expose to window for global access
  window.switchPublicSection = switchPublicSection;

  // Delegated click listener on document for guaranteed event handling
  document.addEventListener('click', (e) => {
    const navLink = e.target.closest('#publicNav .nav-link, #mobileNavDrawer .mobile-nav-link, .site-footer a[href^="#"], [data-public-nav]');
    if (!navLink) return;

    const dataNav = navLink.getAttribute('data-public-nav');
    if (dataNav) {
      e.preventDefault();
      switchPublicSection(dataNav);
      return;
    }

    const href = navLink.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = href.replace(/^#/, '');
      const valid = ['home', 'about', 'topics', 'sessions', 'impact'];
      if (valid.includes(target)) {
        e.preventDefault();
        switchPublicSection(target);
      }
    }
  });

  // Hero CTA Buttons
  document.getElementById('heroExploreBtn')?.addEventListener('click', () => {
    switchPublicSection('about');
  });

  document.getElementById('heroSessionsBtn')?.addEventListener('click', () => {
    const upcomingEl = document.querySelector('.home-upcoming-section');
    if (upcomingEl) {
      upcomingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      switchPublicSection('sessions');
    }
  });

  // =========================================================================
  // VIEW: PUBLIC PAGE RENDERING
  // =========================================================================
  function renderPublicPage() {
    renderHomeUpcomingSessions();
    renderPublicCategories();
    renderPublicSessionsPreview();

    // Activate appropriate public section based on current hash
    const hash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    const valid = ['home', 'about', 'topics', 'sessions', 'impact'];
    if (valid.includes(hash)) {
      switchPublicSection(hash);
    } else {
      switchPublicSection(currentPublicSection || 'home');
    }
  }

  function renderHomeUpcomingSessions() {
    const container = document.getElementById('homeUpcomingSessionsContainer');
    if (!container) return;

    const allSessions = dataService.getSessions();
    const upcomingSessions = allSessions.filter(s => s.status === 'Upcoming');
    const mainSession = upcomingSessions[0] || allSessions[allSessions.length - 1];
    if (!mainSession) return;

    const isAr = i18n.isRTL();
    const user = authService.getCurrentUser();
    const isMember = !!user;

    const sesNumText = isAr 
      ? `الجلسة رقم ${mainSession.sessionNumber.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])}` 
      : `Session ${mainSession.sessionNumber.toString().padStart(2, '0')}`;
    const categoryName = isAr ? (mainSession.categoryNameAr || mainSession.categoryName) : mainSession.categoryName;
    const titleText = isAr ? (mainSession.titleAr || mainSession.title) : mainSession.title;
    const descText = isAr ? (mainSession.descriptionAr || mainSession.description) : mainSession.description;
    const formatText = isAr ? (mainSession.formatAr || mainSession.format) : mainSession.format;
    const durationText = isAr ? (mainSession.durationAr || mainSession.duration) : mainSession.duration;
    
    const statusText = isAr ? 'جلسة مباشرة مجدولة' : 'Upcoming Live Dialogue';

    const speakers = mainSession.speakers || [];
    const moderator = mainSession.moderator;

    const moderatorLabel = isAr ? 'إدارة الجلسة:' : 'Session Moderator:';
    const speakersLabel = isAr ? 'المتحدثون الرئيسيون:' : 'Lead Speakers:';
    const accessNotice = isAr ? 'حضور الجلسة المباشرة والأوراق الأكاديمية مخصص لأعضاء المجتمع' : 'Live room access and session briefings are members-only';

    const actionButtons = isMember ? `
      <button class="btn btn-accent btn-md" id="homeSessionPortalBtn">
        ${icons.video} ${isAr ? 'الدخول إلى بوابة الجلسات' : 'Go to Sessions Portal'} →
      </button>
      <button class="btn btn-outline btn-md" id="homeSessionViewAllBtn" data-public-nav="sessions" style="color: #fff; border-color: rgba(255,255,255,0.45);">
        ${icons.calendar} ${isAr ? 'عرض جميع الجلسات' : 'View All Sessions'}
      </button>
    ` : `
      <button class="btn btn-accent btn-md" id="homeSessionJoinBtn">
        ${icons.lock} ${isAr ? 'تسجيل الدخول للانضمام للجلسة' : 'Sign In to Join Room'}
      </button>
      <button class="btn btn-outline btn-md" id="homeSessionApplyBtn" style="color: #fff; border-color: rgba(255,255,255,0.45);">
        ${icons.user} ${isAr ? 'تقديم طلب عضوية' : 'Apply for Membership'}
      </button>
      <button class="btn btn-subtle btn-md" id="homeSessionViewAllBtn" data-public-nav="sessions" style="color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);">
        ${icons.calendar} ${isAr ? 'أرشيف الجلسات' : 'Browse Archive'}
      </button>
    `;

    // Secondary scheduled sessions (e.g. Session 4 if present)
    const secondaryUpcoming = upcomingSessions.slice(1, 3);
    const secondaryHtml = secondaryUpcoming.length ? `
      <div class="home-secondary-sessions">
        <h4 class="home-secondary-title serif-text">${isAr ? 'جلسات قادمة مجدولة لاحقاً:' : 'Following Scheduled Dialogue:'}</h4>
        <div class="home-secondary-grid">
          ${secondaryUpcoming.map(s => `
            <div class="home-secondary-card">
              <div class="home-secondary-badge">${icons.getFlag(s.speakers?.[0]?.country || s.countriesRepresented?.[0] || 'INT')} ${isAr ? `الجلسة رقم ${s.sessionNumber.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])}` : `Session ${s.sessionNumber.toString().padStart(2, '0')}`} • ${isAr ? (s.categoryNameAr || s.categoryName) : s.categoryName}</div>
              <h5 class="serif-text">${isAr ? (s.titleAr || s.title) : s.title}</h5>
              <div class="home-secondary-meta">
                <span>${icons.calendar} ${s.date}</span>
                <span>${icons.clock} ${isAr ? (s.durationAr || s.duration) : s.duration}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="home-session-spotlight">
        <div class="home-session-glow-accent"></div>
        <div class="home-session-card-inner">
          <div class="home-session-top-bar">
            <div class="home-session-sphere-badge">
              <span class="home-session-live-pulse"></span>
              <span class="home-session-badge-num">${sesNumText}</span>
              <span class="home-session-badge-sep">•</span>
              <span class="home-session-badge-cat">${categoryName}</span>
            </div>
            <div class="home-session-status-tag">
              ${icons.video}
              <span>${statusText}</span>
            </div>
          </div>

          <h3 class="home-session-main-title serif-text">${titleText}</h3>
          <p class="home-session-description">${descText}</p>

          <div class="home-session-details-grid">
            <div class="home-session-detail-item">
              <div class="home-detail-icon">${icons.calendar}</div>
              <div class="home-detail-content">
                <span class="home-detail-label">${isAr ? 'التاريخ' : 'Date'}</span>
                <span class="home-detail-val">${mainSession.date}</span>
              </div>
            </div>
            <div class="home-session-detail-item">
              <div class="home-detail-icon">${icons.clock}</div>
              <div class="home-detail-content">
                <span class="home-detail-label">${isAr ? 'التوقيت' : 'Time & Zone'}</span>
                <span class="home-detail-val">${mainSession.time} ${mainSession.timezone}</span>
              </div>
            </div>
            <div class="home-session-detail-item">
              <div class="home-detail-icon">${icons.mic}</div>
              <div class="home-detail-content">
                <span class="home-detail-label">${isAr ? 'الشكل والمدة' : 'Format & Length'}</span>
                <span class="home-detail-val">${formatText} (${durationText})</span>
              </div>
            </div>
          </div>

          <!-- Speakers and Moderator Row -->
          <div class="home-session-participants-row">
            ${moderator ? `
              <div class="home-participant-col">
                <span class="home-part-label">${moderatorLabel}</span>
                <div class="home-part-chip">
                  <span class="home-part-flag">${icons.getFlag(moderator.country, moderator.flag)}</span>
                  <span class="home-part-name">${moderator.name}</span>
                  <span class="home-part-country">(${getCountryLocalized(moderator.country)})</span>
                </div>
              </div>
            ` : ''}

            ${speakers.length ? `
              <div class="home-participant-col">
                <span class="home-part-label">${speakersLabel}</span>
                <div class="home-speakers-chips">
                  ${speakers.map(sp => `
                    <div class="home-part-chip">
                      <span class="home-part-flag">${icons.getFlag(sp.country, sp.flag)}</span>
                      <span class="home-part-name">${sp.name}</span>
                      <span class="home-part-country">(${getCountryLocalized(sp.country)})</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Delegations pill bar -->
          <div class="home-session-delegations-strip">
            <span class="home-del-label">${isAr ? 'الدول الممثلة في الجلسة:' : 'Delegations Represented:'}</span>
            <div class="home-del-pills">
              ${mainSession.countriesRepresented.map(c => `
                <span class="country-pill">${icons.getFlag(c)} <span>${getCountryLocalized(c)}</span></span>
              `).join('')}
            </div>
          </div>

          <!-- Actions Footer -->
          <div class="home-session-actions-footer">
            <div class="home-session-btn-group">
              ${actionButtons}
            </div>
            <div class="home-session-access-hint">
              ${icons.shield}
              <span>${accessNotice}</span>
            </div>
          </div>
        </div>

        ${secondaryHtml}
      </div>
    `;

    // Attach click listeners
    document.getElementById('homeSessionJoinBtn')?.addEventListener('click', () => {
      openModal('authModal');
    });
    document.getElementById('homeSessionApplyBtn')?.addEventListener('click', () => {
      openModal('applyModal');
    });
    document.getElementById('homeSessionPortalBtn')?.addEventListener('click', () => {
      navigateToPortal(user.role === 'Coordinator' ? 'coordinator' : 'member');
    });
    document.getElementById('homeSessionViewAllBtn')?.addEventListener('click', () => {
      switchPublicSection('sessions');
    });
  }

  function getCountryLocalized(name) {
    if (!i18n.isRTL()) return name;
    const map = {
      'Qatar': 'قطر',
      'Singapore': 'سنغافورة',
      'Ghana': 'غانا',
      'United Kingdom': 'المملكة المتحدة',
      'Jordan': 'الأردن',
      'Mexico': 'المكسيك',
      'Pakistan': 'باكستان',
      'South Africa': 'جنوب أفريقيا',
      'Canada': 'كندا',
      'Nigeria': 'نيجيريا',
      'Morocco': 'المغرب',
      'Malaysia': 'ماليزيا',
      'India': 'الهند',
      'Australia': 'أستراليا',
      'Germany': 'ألمانيا',
      'France': 'فرنسا',
      'Turkey': 'تركيا',
      'Kuwait': 'الكويت',
      'Oman': 'عُمان',
      'Saudi Arabia': 'المملكة العربية السعودية',
      'Lebanon': 'لبنان',
      'Palestine': 'فلسطين',
      'Tunisia': 'تونس',
      'Egypt': 'مصر'
    };
    return map[name] || name;
  }

  function renderPublicCategories() {
    const container = document.getElementById('publicCategoriesContainer');
    if (!container) return;

    const categories = dataService.getCategories();
    const topics = dataService.getTopics();
    const isAr = i18n.isRTL();

    container.innerHTML = categories.map(cat => {
      const topicCount = topics.filter(t => t.category === cat.id).length;
      const catIcon = icons[cat.icon] || icons.globe;
      const countLabel = isAr 
        ? `${topicCount.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])} قضايا` 
        : `${topicCount} Topics`;
      const catTitle = isAr ? (cat.nameAr || cat.name) : cat.name;
      const catDesc = isAr ? (cat.descriptionAr || cat.description) : cat.description;
      const subTopicsList = isAr ? (cat.subTopicsAr || cat.subTopics || []) : (cat.subTopics || []);
      const footerTag = isAr ? 'محور نقاش شبابي عالمي' : 'Global Youth Focus';
      const arrow = isAr ? '←' : '→';

      const subtopicsHtml = subTopicsList.length ? `
        <div class="category-subtopics">
          ${subTopicsList.map(st => `<span class="subtopic-tag">${st}</span>`).join('')}
        </div>
      ` : '';

      return `
        <div class="category-card">
          <div class="category-header">
            <div class="category-icon">${catIcon}</div>
            <span class="category-pill">${countLabel}</span>
          </div>
          <h4 class="serif-text">${catTitle}</h4>
          <p>${catDesc}</p>
          ${subtopicsHtml}
          <div class="category-footer">
            <span>${footerTag}</span>
            <span>${arrow}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderPublicSessionsPreview() {
    const container = document.getElementById('publicSessionsPreview');
    if (!container) return;

    const sessions = dataService.getSessions().slice(0, 3);
    const isAr = i18n.isRTL();

    container.innerHTML = sessions.map(ses => {
      const lockText = isAr ? 'محتوى خاص بالأعضاء' : 'Members Only';
      const sesNumText = isAr 
        ? `الجلسة ${ses.sessionNumber.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])} • ${ses.categoryNameAr || ses.categoryName}` 
        : `Session ${ses.sessionNumber.toString().padStart(2, '0')} • ${ses.categoryName}`;
      const titleText = isAr ? (ses.titleAr || ses.title) : ses.title;
      const durationText = isAr ? (ses.durationAr || '٩٠ دقيقة') : ses.duration;
      const formatLabel = isAr ? 'شكل المناظرة:' : 'Format:';
      const formatVal = isAr ? (ses.formatAr || ses.format) : ses.format;

      return `
        <div class="session-card-preview">
          <span class="session-lock-tag">${icons.lock} ${lockText}</span>
          <div class="session-num-badge">${sesNumText}</div>
          <h4 class="serif-text">${titleText}</h4>
          <div class="session-meta-row">
            <span style="display:inline-flex; align-items:center; gap:4px;">${icons.calendar} ${ses.date}</span>
            <span style="display:inline-flex; align-items:center; gap:4px;">${icons.clock} ${durationText}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
            <strong>${formatLabel}</strong> ${formatVal}
          </div>
          <div class="session-countries-pills">
            ${ses.countriesRepresented.map(c => `<span class="country-pill">${getCountryLocalized(c)}</span>`).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // VIEW: MEMBER PORTAL RENDERING
  // =========================================================================
  function renderMemberPortal() {
    const user = authService.getCurrentUser();
    if (!user) return;

    // Sidebar Profile Card
    const profileCard = document.getElementById('memberSidebarProfile');
    if (profileCard) {
      profileCard.innerHTML = `
        <div class="portal-user-avatar">${icons.getFlag(user.country, user.flag)}</div>
        <div class="portal-user-info">
          <span class="portal-user-name">${user.name}</span>
          <span class="portal-user-role">${user.role} • ${user.country}</span>
        </div>
      `;
    }

    // Bind Member Navigation
    bindMemberNavigation();

    // Render active member subview
    switchMemberSubview(currentMemberSubview);
  }

  function bindMemberNavigation() {
    // Desktop sidebar buttons
    document.querySelectorAll('#viewMember .sidebar-item-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-member-target');
        if (target) switchMemberSubview(target);
      };
    });

    // Mobile bottom tab buttons
    document.querySelectorAll('#memberMobileTabBar .mobile-tab-btn, #viewMember .mobile-tab-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-member-target');
        if (target) switchMemberSubview(target);
      };
    });

    // Quick access card clicks
    document.querySelectorAll('[data-member-nav]').forEach(el => {
      el.onclick = () => {
        const target = el.getAttribute('data-member-nav');
        if (target) switchMemberSubview(target);
      };
    });

    // Sign out button
    const memberLogout = document.getElementById('memberLogoutBtn');
    if (memberLogout) {
      memberLogout.onclick = () => {
        authService.logout();
        navigateToPortal('public');
        showToast('Signed out successfully.');
      };
    }

    // Dashboard suggest button
    const dashSuggest = document.getElementById('dashSuggestTopicBtn');
    if (dashSuggest) {
      dashSuggest.onclick = () => {
        switchMemberSubview('topics');
      };
    }
  }

  function switchMemberSubview(targetName) {
    currentMemberSubview = targetName;

    // Update active class on sidebar items
    document.querySelectorAll('#viewMember .sidebar-item-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-member-target') === targetName);
    });

    // Update active class on mobile tabs
    document.querySelectorAll('#memberMobileTabBar .mobile-tab-btn, #viewMember .mobile-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-member-target') === targetName);
    });

    // Hide all subviews
    document.querySelectorAll('#memberContentArea .portal-subview').forEach(view => {
      view.style.display = 'none';
    });

    // Show target subview
    const targetMap = {
      'dashboard': 'subviewMemberDashboard',
      'sessions': 'subviewMemberSessions',
      'writings': 'subviewMemberWritings',
      'feedback': 'subviewMemberFeedback',
      'topics': 'subviewMemberTopics',
      'calendar': 'subviewMemberCalendar',
      'journey': 'subviewMemberJourney',
      'certificate': 'subviewMemberCertificate'
    };

    const targetEl = document.getElementById(targetMap[targetName]);
    if (targetEl) {
      targetEl.style.display = 'block';
    }

    // Trigger subview renderers
    if (targetName === 'dashboard') renderMemberDashboardContent();
    if (targetName === 'sessions') renderMemberSessionsList();
    if (targetName === 'writings') renderMemberWritingsList();
    if (targetName === 'feedback') prepareMemberFeedbackForm();
    if (targetName === 'topics') renderMemberTopicsView();
    if (targetName === 'calendar') renderMemberCalendarView();
    if (targetName === 'journey') renderMemberJourneyView();
    if (targetName === 'certificate') renderMemberCertificate();

    window.scrollTo(0, 0);
  }

  // --- Subview: Member Dashboard Content ---
  function renderMemberDashboardContent() {
    const sessions = dataService.getSessions();
    const nextSession = sessions.find(s => s.status === 'Upcoming') || sessions[0];
    const spotlightEl = document.getElementById('memberNextSessionSpotlight');

    if (spotlightEl && nextSession) {
      spotlightEl.innerHTML = `
        <div class="spotlight-top">
          <span class="spotlight-tag" style="display:inline-flex; align-items:center; gap:5px;">${icons.mic} Upcoming Session ${nextSession.sessionNumber.toString().padStart(2, '0')}</span>
          <span style="font-size: 0.85rem; color: #E6C875; font-weight: 600;">${nextSession.categoryName}</span>
        </div>
        <h3 class="serif-text">${nextSession.title}</h3>
        <div class="spotlight-meta-list">
          <span class="spotlight-meta-item">${icons.calendar} ${nextSession.date}</span>
          <span class="spotlight-meta-item">${icons.clock} ${nextSession.time} ${nextSession.timezone}</span>
          <span class="spotlight-meta-item">${icons.user} Moderator: ${nextSession.moderator.name} (${icons.getFlag(nextSession.moderator.country, nextSession.moderator.flag)} ${nextSession.moderator.country})</span>
        </div>
        <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; margin-bottom: 1.5rem; max-width: 800px; line-height: 1.6;">
          ${nextSession.description}
        </p>
        <div class="spotlight-actions">
          <a href="${nextSession.meetingLink}" target="_blank" class="btn btn-accent btn-md" style="gap:6px;">
            ${icons.video} Join Video Meeting (Live)
          </a>
          <button class="btn btn-outline btn-md" style="color: #fff; border-color: rgba(255,255,255,0.4); gap:6px;" onclick="window.viewSessionDetail('${nextSession.id}')">
            ${icons.fileText} View Full Dossier & Agenda
          </button>
        </div>
      `;
    }

    // Announcements
    const announcementsEl = document.getElementById('memberAnnouncementsList');
    if (announcementsEl) {
      const anns = dataService.getAnnouncements();
      announcementsEl.innerHTML = anns.map(a => `
        <div class="activity-item">
          <div class="activity-icon">${icons.bell}</div>
          <div>
            <div style="font-weight: 600; color: var(--brand-navy);">${a.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">${a.content}</div>
            <div style="font-size: 0.72rem; color: var(--text-subtle); margin-top: 0.3rem;">By ${a.author} • ${a.date}</div>
          </div>
        </div>
      `).join('');
    }

    // Proposed topics snippet
    const propSnippet = document.getElementById('memberProposedTopicsSnippet');
    if (propSnippet) {
      const user = authService.getCurrentUser();
      const allTopics = dataService.getTopics();
      const userTopics = allTopics.filter(t => t.proposedById === user.id);

      if (userTopics.length === 0) {
        propSnippet.innerHTML = `
          <div style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.9rem;">
            You have not submitted any debate motions yet.
            <button class="btn btn-outline btn-sm" style="margin-top: 0.75rem;" onclick="document.querySelector('[data-member-target=topics]').click()">
              Suggest a Topic Now
            </button>
          </div>
        `;
      } else {
        propSnippet.innerHTML = userTopics.map(t => `
          <div style="padding: 0.85rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 0.65rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <strong style="color: var(--brand-navy); font-size: 0.92rem;">${t.title}</strong>
              <span class="badge badge-${t.status.toLowerCase().replace(' ', '')}">${t.status}</span>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${t.categoryName} • Submitted ${t.createdAt}</div>
          </div>
        `).join('');
      }
    }
  }

  // --- Subview: Member Sessions List ---
  function renderMemberSessionsList() {
    const listEl = document.getElementById('memberSessionsList');
    const catSelect = document.getElementById('memberSessionCategoryFilter');
    const statusSelect = document.getElementById('memberSessionStatusFilter');
    const searchInput = document.getElementById('memberSessionSearch');

    // Populate category filter if empty
    if (catSelect && catSelect.options.length <= 1) {
      dataService.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catSelect.appendChild(opt);
      });
    }

    function applyFilters() {
      let sessions = dataService.getSessions();
      const query = (searchInput?.value || '').toLowerCase();
      const cat = catSelect?.value;
      const status = statusSelect?.value;

      if (query) {
        sessions = sessions.filter(s =>
          s.title.toLowerCase().includes(query) ||
          s.categoryName.toLowerCase().includes(query) ||
          s.countriesRepresented.some(c => c.toLowerCase().includes(query)) ||
          s.moderator.name.toLowerCase().includes(query)
        );
      }

      if (cat && cat !== 'all') {
        sessions = sessions.filter(s => s.category === cat);
      }

      if (status && status !== 'all') {
        sessions = sessions.filter(s => s.status === status);
      }

      if (sessions.length === 0) {
        listEl.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">No sessions match your filter criteria.</div>`;
        return;
      }

      listEl.innerHTML = sessions.map(s => {
        const isUpcoming = s.status === 'Upcoming';
        return `
          <div class="session-full-card">
            <div class="s-card-top">
              <span class="badge ${isUpcoming ? 'badge-scheduled' : 'badge-completed'}">${s.status}</span>
              <span class="badge badge-category">${s.categoryName}</span>
            </div>
            <h4>Session ${s.sessionNumber.toString().padStart(2, '0')}: ${s.title}</h4>
            <div class="s-meta-list">
              <span style="display:inline-flex; align-items:center; gap:4px;">${icons.calendar} ${s.date}</span>
              <span style="display:inline-flex; align-items:center; gap:4px;">${icons.clock} ${s.time}</span>
              <span style="display:inline-flex; align-items:center; gap:4px;">${icons.clock} ${s.duration}</span>
              <span style="display:inline-flex; align-items:center; gap:4px;">${icons.mic} ${s.format}</span>
            </div>
            <div class="s-speaker-row">
              <div class="s-speaker-label">Moderator & Speakers:</div>
              <div><strong>Moderator:</strong> ${s.moderator.name} (${s.moderator.country})</div>
              <div><strong>Speakers:</strong> ${s.speakers.map(sp => `${sp.name} (${sp.country})`).join(', ')}</div>
            </div>
            <div class="s-card-actions">
              <button class="btn btn-outline btn-sm" style="gap:5px;" onclick="window.viewSessionDetail('${s.id}')">
                ${icons.fileText} View Agenda & Structure
              </button>
              ${isUpcoming ? `
                <a href="${s.meetingLink}" target="_blank" class="btn btn-primary btn-sm" style="gap:5px;">
                  ${icons.video} Join Meeting
                </a>
              ` : `
                <button class="btn btn-navy btn-sm" style="gap:5px;" onclick="window.playSessionVideo('${s.id}')">
                  ${icons.play} Watch Recording
                </button>
                ${s.hasSummary ? `
                  <button class="btn btn-subtle btn-sm" style="gap:5px;" onclick="window.openAcademicPaperBySession('${s.id}')">
                    ${icons.book} Read Summary
                  </button>
                ` : ''}
              `}
            </div>
          </div>
        `;
      }).join('');
    }

    searchInput.oninput = applyFilters;
    catSelect.onchange = applyFilters;
    statusSelect.onchange = applyFilters;
    applyFilters();
  }

  // --- Subview: Academic Writings Library ---
  function renderMemberWritingsList() {
    const listEl = document.getElementById('memberWritingsList');
    const catSelect = document.getElementById('memberWritingCategoryFilter');
    const searchInput = document.getElementById('memberWritingSearch');

    if (catSelect && catSelect.options.length <= 1) {
      dataService.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catSelect.appendChild(opt);
      });
    }

    function applyWritingsFilter() {
      let writings = dataService.getWritings();
      const query = (searchInput?.value || '').toLowerCase();
      const cat = catSelect?.value;

      if (query) {
        writings = writings.filter(w =>
          w.title.toLowerCase().includes(query) ||
          w.intro.toLowerCase().includes(query) ||
          w.author.toLowerCase().includes(query) ||
          w.categoryName.toLowerCase().includes(query)
        );
      }

      if (cat && cat !== 'all') {
        writings = writings.filter(w => w.category === cat);
      }

      if (writings.length === 0) {
        listEl.innerHTML = `<div style="text-align: center; padding: 3rem; color: var(--text-muted);">No academic writings match your search.</div>`;
        return;
      }

      listEl.innerHTML = writings.map(w => `
        <div class="writing-card">
          <div class="w-header">
            <span class="badge badge-published">Academic Publication</span>
            <span class="badge badge-category">${w.categoryName}</span>
          </div>
          <h3 class="serif-text">${w.title}</h3>
          <div class="w-author-row">
            <span style="display:inline-flex; align-items:center; gap:4px;">${icons.pen} Lead: ${w.author}</span>
            <span style="display:inline-flex; align-items:center; gap:4px;">${icons.calendar} Published: ${w.publicationDate}</span>
            ${w.sessionNumber ? `<span style="display:inline-flex; align-items:center; gap:4px;">${icons.mic} Session ${w.sessionNumber.toString().padStart(2, '0')} Synthesis</span>` : ''}
          </div>
          <p class="w-excerpt">${w.intro}</p>
          <div class="w-sections-preview">
            <div class="w-preview-box">
              <h5>Key Arguments (Affirmative)</h5>
              <p>${w.keyArguments[0] || 'Structured policy rationale.'}</p>
            </div>
            <div class="w-preview-box">
              <h5>Counterarguments & Rebuttal</h5>
              <p>${w.counterarguments[0] || 'Vulnerabilities and constraints.'}</p>
            </div>
          </div>
          <button class="btn btn-navy btn-md" style="gap:6px;" onclick="window.openFullAcademicPaper('${w.id}')">
            ${icons.book} Read Full Academic Paper (Dossier View)
          </button>
        </div>
      `).join('');
    }

    searchInput.oninput = applyWritingsFilter;
    catSelect.onchange = applyWritingsFilter;
    applyWritingsFilter();
  }

  // --- Subview: Member Feedback Form ---
  function prepareMemberFeedbackForm() {
    const sessionSelect = document.getElementById('feedbackSessionSelect');
    const sessions = dataService.getSessions().filter(s => s.status === 'Completed');

    if (sessionSelect) {
      sessionSelect.innerHTML = sessions.map(s => `
        <option value="${s.id}">Session ${s.sessionNumber.toString().padStart(2, '0')}: ${s.title} (${s.date})</option>
      `).join('');
    }

    // Rating pills toggle
    let selectedRating = 'Excellent';
    document.querySelectorAll('#feedbackRatingPills .rating-pill-option').forEach(pill => {
      pill.onclick = () => {
        document.querySelectorAll('#feedbackRatingPills .rating-pill-option').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        selectedRating = pill.getAttribute('data-rating');
      };
    });

    const form = document.getElementById('memberFeedbackForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      const user = authService.getCurrentUser();
      const selectedSession = sessions.find(s => s.id === sessionSelect.value) || sessions[0];

      dataService.submitFeedback({
        sessionId: selectedSession ? selectedSession.id : '',
        sessionTitle: selectedSession ? selectedSession.title : 'General Session',
        memberId: user ? user.id : 'usr_anon',
        memberName: user ? user.name : 'Anonymous Member',
        memberCountry: user ? user.country : 'International',
        rating: selectedRating,
        strengths: document.getElementById('fbStrengths').value.trim(),
        missingPoints: document.getElementById('fbMissingPoints').value.trim(),
        evidenceFeedback: document.getElementById('fbEvidence').value.trim(),
        overlookedPerspectives: document.getElementById('fbOverlooked').value.trim(),
        futureIdeas: document.getElementById('fbFutureIdeas').value.trim(),
        comments: document.getElementById('fbAdditional').value.trim()
      });

      showToast('Thank you! Your qualitative feedback has been submitted to the coordinators.', 'success');
      form.reset();
      switchMemberSubview('dashboard');
    };
  }

  // --- Subview: Member Topic Suggestion & Tracker ---
  function renderMemberTopicsView() {
    const catSelect = document.getElementById('propCategory');
    if (catSelect && catSelect.options.length === 0) {
      dataService.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        catSelect.appendChild(opt);
      });
    }

    // Render topics tracking pipeline
    const listEl = document.getElementById('memberSubmittedTopicsList');
    const topics = dataService.getTopics();

    const pipelineSteps = ['Proposed', 'Under Review', 'Approved', 'Scheduled', 'Completed'];

    listEl.innerHTML = topics.map(t => {
      const currentStepIdx = pipelineSteps.indexOf(t.status);

      return `
        <div class="topic-row-card">
          <div class="t-row-top">
            <div>
              <span class="badge badge-category" style="margin-bottom: 0.35rem;">${t.categoryName}</span>
              <h4>${t.title}</h4>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button class="topic-upvote-btn" onclick="window.voteTopic('${t.id}')" title="Upvote in community ballot">
                ▲ <span id="voteCount_${t.id}">${t.upvotes || 12}</span>
              </button>
              <span class="badge badge-${t.status.toLowerCase().replace(' ', '')}">${t.status}</span>
            </div>
          </div>
          ${t.motion ? `
            <div class="motion-quote">
              <strong>Motion:</strong> ${t.motion}
            </div>
          ` : ''}
          <p style="font-size: 0.88rem; color: var(--text-muted);">${t.description}</p>
          
          <!-- Visual 5-Stage Status Tracker -->
          <div class="topic-progress-steps">
            ${pipelineSteps.map((step, idx) => {
              const isDone = idx < currentStepIdx;
              const isActive = idx === currentStepIdx;
              return `
                <div class="progress-step-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}">
                  <span class="step-dot">${isDone ? icons.check : idx + 1}</span>
                  <span>${step}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div style="font-size: 0.76rem; color: var(--text-subtle); display: flex; justify-content: space-between;">
            <span>Proposed by: ${t.proposedBy}</span>
            <span>Date: ${t.createdAt}</span>
          </div>
        </div>
      `;
    }).join('');

    // Handle Form submission
    const form = document.getElementById('memberTopicForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      const user = authService.getCurrentUser();
      const title = document.getElementById('propTitle').value.trim();
      const catId = document.getElementById('propCategory').value;
      const motion = document.getElementById('propMotion').value.trim();
      const reason = document.getElementById('propReason').value.trim();
      const countryPerspective = document.getElementById('propCountry').value.trim();
      const sources = document.getElementById('propSources').value.trim();

      dataService.addTopic({
        title,
        category: catId,
        motion,
        description: reason,
        proposedBy: user ? user.name : 'Community Member',
        proposedById: user ? user.id : null,
        countryPerspective,
        sources,
        status: 'Proposed'
      });

      showToast('Topic proposal submitted! It is now in the review pipeline.', 'success');
      form.reset();
      renderMemberTopicsView();
    };
  }

  // --- Subview: Member Community Directory ---
  function renderMemberCommunityDirectory() {
    const listEl = document.getElementById('memberCommunityList');
    const users = dataService.getUsers();

    listEl.innerHTML = users.map(u => `
      <div class="member-card">
        <div class="m-card-top">
          <div class="m-avatar">${icons.getFlag(u.country, u.flag)}</div>
          <div>
            <div class="m-name">${u.name}</div>
            <div class="m-country">${u.role} • ${u.country}</div>
          </div>
        </div>
        <p class="m-bio">${u.bio || 'Active youth debater and international affairs researcher.'}</p>
        <div class="m-interests-wrap">
          ${(u.interests || ['Debate', 'Diplomacy']).map(i => `<span class="interest-tag">${i}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // =========================================================================
  // VIEW: COORDINATOR PORTAL RENDERING
  // =========================================================================
  function renderCoordinatorPortal() {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'Coordinator') return;

    // Sidebar Profile
    const profileCard = document.getElementById('coordSidebarProfile');
    if (profileCard) {
      profileCard.innerHTML = `
        <div class="portal-user-avatar avatar-coord">${icons.getFlag(user.country, user.flag)}</div>
        <div class="portal-user-info">
          <span class="portal-user-name">${user.name}</span>
          <span class="portal-user-role">Founding Coordinator (${user.country})</span>
        </div>
      `;
    }

    bindCoordinatorNavigation();
    switchCoordSubview(currentCoordSubview);
  }

  function bindCoordinatorNavigation() {
    document.querySelectorAll('#viewCoordinator .sidebar-item-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-coord-target');
        if (target) switchCoordSubview(target);
      };
    });

    document.querySelectorAll('#coordMobileTabBar .mobile-tab-btn, #viewCoordinator .mobile-tab-btn').forEach(btn => {
      btn.onclick = () => {
        const target = btn.getAttribute('data-coord-target');
        if (target) switchCoordSubview(target);
      };
    });

    document.querySelectorAll('[data-coord-nav]').forEach(el => {
      el.onclick = () => {
        const target = el.getAttribute('data-coord-nav');
        if (target) switchCoordSubview(target);
      };
    });

    const coordLogout = document.getElementById('coordLogoutBtn');
    if (coordLogout) {
      coordLogout.onclick = () => {
        authService.logout();
        navigateToPortal('public');
        showToast('Signed out from Coordinator Workspace.');
      };
    }

    const quickNewSession = document.getElementById('coordQuickNewSessionBtn');
    if (quickNewSession) quickNewSession.onclick = () => switchCoordSubview('sessions');

    const quickNewTopic = document.getElementById('coordQuickNewTopicBtn');
    if (quickNewTopic) quickNewTopic.onclick = () => switchCoordSubview('topics');
  }

  function switchCoordSubview(targetName) {
    currentCoordSubview = targetName;

    // Update active class on sidebar
    document.querySelectorAll('#viewCoordinator .sidebar-item-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-coord-target') === targetName);
    });

    // Update active class on mobile tabs
    document.querySelectorAll('#coordMobileTabBar .mobile-tab-btn, #viewCoordinator .mobile-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-coord-target') === targetName);
    });

    // Hide all
    document.querySelectorAll('#coordContentArea .portal-subview').forEach(view => {
      view.style.display = 'none';
    });

    const targetMap = {
      'dashboard': 'subviewCoordDashboard',
      'topics': 'subviewCoordTopics',
      'sessions': 'subviewCoordSessions',
      'writings': 'subviewCoordWritings',
      'feedback': 'subviewCoordFeedback',
      'applications': 'subviewCoordApplications',
      'team': 'subviewCoordTeam',
      'countries': 'subviewCoordCountries',
      'media': 'subviewCoordMedia'
    };

    const targetEl = document.getElementById(targetMap[targetName]);
    if (targetEl) targetEl.style.display = 'block';

    if (targetName === 'dashboard') renderCoordDashboardContent();
    if (targetName === 'topics') renderCoordTopicsList();
    if (targetName === 'sessions') prepareCoordSessionForm();
    if (targetName === 'writings') prepareCoordWritingStudio();
    if (targetName === 'feedback') renderCoordFeedbackList();
    if (targetName === 'applications') renderCoordApplicationsList();
    if (targetName === 'team') renderCoordTeamList();
    if (targetName === 'countries') renderCountryChapters();
    if (targetName === 'media') renderMediaKits();

    window.scrollTo(0, 0);
  }

  // --- Subview: Coordinator Dashboard ---
  function renderCoordDashboardContent() {
    const users = dataService.getUsers();
    const apps = dataService.getApplications().filter(a => a.status === 'Pending');
    const topics = dataService.getTopics();
    const writings = dataService.getWritings();

    // Update counters
    document.getElementById('kpiMembersCount').textContent = users.length;
    document.getElementById('kpiPendingAppsCount').textContent = apps.length;
    document.getElementById('kpiTopicsCount').textContent = topics.length;
    document.getElementById('kpiWritingsCount').textContent = writings.length;

    // Pending Apps list
    const appsList = document.getElementById('coordDashboardAppsList');
    if (apps.length === 0) {
      appsList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem; padding: 0.5rem 0;">No pending member applications right now.</div>`;
    } else {
      appsList.innerHTML = apps.slice(0, 3).map(app => `
        <div class="application-item">
          <div class="app-meta">
            <span class="app-name">${app.name} (${app.country})</span>
            <span class="app-sub">${app.debateExperience}</span>
            <p class="app-motivation">"${app.motivation}"</p>
          </div>
          <div class="app-actions">
            <button class="btn btn-primary btn-sm" onclick="window.approveApp('${app.id}')">${icons.check} Approve</button>
            <button class="btn btn-outline btn-sm" onclick="window.rejectApp('${app.id}')">${icons.x} Decline</button>
          </div>
        </div>
      `).join('');
    }

    // Topics Under Review list
    const reviewTopics = topics.filter(t => t.status === 'Proposed' || t.status === 'Under Review');
    const topicsList = document.getElementById('coordDashboardTopicsList');
    if (reviewTopics.length === 0) {
      topicsList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem; padding: 0.5rem 0;">All topics have been reviewed.</div>`;
    } else {
      topicsList.innerHTML = reviewTopics.slice(0, 3).map(t => `
        <div style="padding: 0.85rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 0.65rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 600; color: var(--brand-navy); font-size: 0.95rem;">${t.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${t.categoryName} • Proposed by ${t.proposedBy}</div>
          </div>
          <button class="btn btn-navy btn-sm" onclick="document.querySelector('[data-coord-target=topics]').click()">
            Review Motion
          </button>
        </div>
      `).join('');
    }

    // Announcement Modal Handler
    const annBtn = document.getElementById('coordNewAnnounceBtn');
    if (annBtn) {
      annBtn.onclick = () => {
        const title = prompt('Enter Announcement Title:');
        if (!title) return;
        const content = prompt('Enter Announcement Content:');
        if (!content) return;

        const user = authService.getCurrentUser();
        dataService.addAnnouncement({
          title,
          content,
          category: 'Official Notice',
          priority: 'Normal',
          author: `${user.name} (${user.country})`
        });

        showToast('Announcement broadcasted to all community members!', 'success');
        renderCoordDashboardContent();
      };
    }
  }

  // --- Subview: Coordinator Topics Management ---
  function renderCoordTopicsList() {
    const listEl = document.getElementById('coordTopicsFullList');
    const searchInput = document.getElementById('coordTopicSearch');
    const statusFilter = document.getElementById('coordTopicStatusFilter');

    function applyTopicFilters() {
      let topics = dataService.getTopics();
      const q = (searchInput?.value || '').toLowerCase();
      const status = statusFilter?.value;

      if (q) {
        topics = topics.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
      }

      if (status && status !== 'all') {
        topics = topics.filter(t => t.status === status);
      }

      listEl.innerHTML = topics.map(t => `
        <div class="card-panel" style="margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.5rem;">
            <div>
              <span class="badge badge-category">${t.categoryName}</span>
              <h4 style="margin: 0.35rem 0;">${t.title}</h4>
            </div>
            <div style="display: flex; align-items: center; gap: 0.65rem;">
              <select class="form-control" style="width: auto; padding: 0.35rem 0.65rem; font-size: 0.82rem;" onchange="window.updateTopicStatus('${t.id}', this.value)">
                <option value="Proposed" ${t.status === 'Proposed' ? 'selected' : ''}>Proposed</option>
                <option value="Under Review" ${t.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                <option value="Approved" ${t.status === 'Approved' ? 'selected' : ''}>Approved</option>
                <option value="Scheduled" ${t.status === 'Scheduled' ? 'selected' : ''}>Scheduled</option>
                <option value="Completed" ${t.status === 'Completed' ? 'selected' : ''}>Completed</option>
              </select>
            </div>
          </div>
          ${t.motion ? `<div class="motion-quote" style="margin-bottom: 0.75rem;"><strong>Motion:</strong> ${t.motion}</div>` : ''}
          <p style="font-size: 0.88rem; color: var(--text-body); margin-bottom: 0.85rem;">${t.description}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: var(--bg-body); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.82rem;">
            <div><strong>Assigned Speaker:</strong> ${t.assignedSpeaker || 'Unassigned'}</div>
            <div><strong>Assigned Moderator:</strong> ${t.assignedModerator || 'Unassigned'}</div>
            <div style="grid-column: 1/-1;"><strong>Research Notes:</strong> ${t.researchNotes || 'None yet.'}</div>
          </div>
        </div>
      `).join('');
    }

    searchInput.oninput = applyTopicFilters;
    statusFilter.onchange = applyTopicFilters;
    applyTopicFilters();

    // Add Topic Modal Button
    document.getElementById('coordAddTopicModalBtn').onclick = () => {
      const title = prompt('Enter Topic Title:');
      if (!title) return;
      const motion = prompt('Enter Parliamentary Motion (This House would...):') || '';

      dataService.addTopic({
        title,
        motion,
        category: 'global-affairs',
        status: 'Approved',
        proposedBy: 'Secretariat Direct Add'
      });
      showToast('New topic added to approved repository!', 'success');
      renderCoordTopicsList();
    };
  }

  // --- Subview: Coordinator Session Creation ---
  function prepareCoordSessionForm() {
    const topicSelect = document.getElementById('csTopicSelect');
    const modSelect = document.getElementById('csModerator');
    const approvedTopics = dataService.getTopics().filter(t => t.status === 'Approved' || t.status === 'Proposed' || t.status === 'Scheduled');
    const users = dataService.getUsers();

    if (topicSelect) {
      topicSelect.innerHTML = approvedTopics.map(t => `
        <option value="${t.id}">${t.title} (${t.categoryName})</option>
      `).join('');
    }

    if (modSelect) {
      modSelect.innerHTML = users.map(u => `
        <option value="${u.name}">${u.name} (${u.country})</option>
      `).join('');
    }

    // Set default date to 2 weeks from now
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 14);
    const dateInput = document.getElementById('csDate');
    if (dateInput) dateInput.value = nextDate.toISOString().split('T')[0];

    const form = document.getElementById('coordCreateSessionForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      const topicId = topicSelect.value;
      const title = document.getElementById('csTitle').value.trim();
      const date = document.getElementById('csDate').value;
      const time = document.getElementById('csTime').value;
      const format = document.getElementById('csFormat').value;
      const duration = document.getElementById('csDuration').value;
      const modName = modSelect.value;
      const modUser = users.find(u => u.name === modName) || { name: modName, country: 'International', flag: 'INT' };
      const speakersText = document.getElementById('csSpeakers').value;
      const countriesText = document.getElementById('csCountries').value;
      const desc = document.getElementById('csDesc').value;
      const meetingLink = document.getElementById('csMeetingLink').value;
      const recordingUrl = document.getElementById('csRecordingUrl').value;

      const speakers = speakersText.split(',').map(sp => ({
        name: sp.trim(),
        country: 'International',
        flag: 'INT',
        stance: 'Speaker'
      }));

      const countries = countriesText.split(',').map(c => c.trim()).filter(Boolean);

      dataService.createSession({
        title,
        topicId,
        category: 'global-affairs',
        date,
        time,
        format,
        duration,
        moderator: {
          name: modUser.name,
          country: modUser.country,
          flag: modUser.flag
        },
        speakers,
        countriesRepresented: countries,
        description: desc,
        meetingLink,
        recordingUrl
      });

      showToast('Session scheduled and broadcasted to the Member Portal!', 'success');
      form.reset();
      switchCoordSubview('dashboard');
    };
  }

  // --- Subview: Coordinator Writing Studio ---
  function prepareCoordWritingStudio() {
    const sessionSelect = document.getElementById('wsSessionSelect');
    const sessions = dataService.getSessions();

    if (sessionSelect) {
      sessionSelect.innerHTML = sessions.map(s => `
        <option value="${s.id}">Session ${s.sessionNumber.toString().padStart(2, '0')}: ${s.title}</option>
      `).join('');
    }

    const form = document.getElementById('coordSummaryForm');
    form.onsubmit = (e) => {
      e.preventDefault();
      const sessionId = sessionSelect.value;
      const linkedSession = sessions.find(s => s.id === sessionId);

      const title = document.getElementById('wsTitle').value.trim();
      const author = document.getElementById('wsAuthor').value.trim();
      const status = document.getElementById('wsStatus').value;
      const intro = document.getElementById('wsIntro').value.trim();
      const background = document.getElementById('wsBackground').value.trim();
      const keyArgs = document.getElementById('wsKeyArgs').value.split('\n').filter(Boolean);
      const counterArgs = document.getElementById('wsCounterArgs').value.split('\n').filter(Boolean);
      const evidence = document.getElementById('wsEvidence').value.trim();
      const insights = document.getElementById('wsInsights').value.trim();
      const conclusion = document.getElementById('wsConclusion').value.trim();
      const furtherQ = document.getElementById('wsFurtherQuestions').value.split('\n').filter(Boolean);
      const sources = document.getElementById('wsSources').value.trim();

      dataService.createWriting({
        sessionId,
        sessionNumber: linkedSession ? linkedSession.sessionNumber : null,
        title,
        category: linkedSession ? linkedSession.category : 'global-affairs',
        author,
        status,
        intro,
        background,
        keyArguments: keyArgs,
        counterarguments: counterArgs,
        evidence,
        insights,
        conclusion,
        furtherQuestions: furtherQ,
        sources
      });

      showToast('Academic synthesis published successfully to youth research archive!', 'success');
      form.reset();
      switchCoordSubview('dashboard');
    };
  }

  // --- Subview: Coordinator Feedback Review ---
  function renderCoordFeedbackList() {
    const listEl = document.getElementById('coordFeedbackReviewsList');
    const feedbacks = dataService.getFeedback();

    if (feedbacks.length === 0) {
      listEl.innerHTML = `<div class="card-panel" style="text-align: center; color: var(--text-muted);">No feedback records found.</div>`;
      return;
    }

    listEl.innerHTML = feedbacks.map(fb => `
      <div class="card-panel">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <h4 style="margin-bottom: 0.25rem;">${fb.sessionTitle}</h4>
            <div style="font-size: 0.82rem; color: var(--text-muted);">Submitted by ${fb.memberName} (${fb.memberCountry}) • ${fb.date}</div>
          </div>
          <span class="badge ${fb.rating === 'Excellent' ? 'badge-completed' : 'badge-review'}">${fb.rating}</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem;">
          <div><strong>Strengths:</strong> ${fb.strengths}</div>
          ${fb.missingPoints ? `<div><strong>Missing Points / Nuances:</strong> ${fb.missingPoints}</div>` : ''}
          ${fb.evidenceFeedback ? `<div><strong>Evidence Assessment:</strong> ${fb.evidenceFeedback}</div>` : ''}
          ${fb.overlookedPerspectives ? `<div><strong>Overlooked Regional Perspective:</strong> ${fb.overlookedPerspectives}</div>` : ''}
          ${fb.futureIdeas ? `<div><strong>Future Topic Suggestion:</strong> ${fb.futureIdeas}</div>` : ''}
          ${fb.comments ? `<div><strong>Additional Notes:</strong> ${fb.comments}</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  // --- Subview: Coordinator Applications ---
  function renderCoordApplicationsList() {
    const pendingListEl = document.getElementById('coordFullApplicationsList');
    const approvedListEl = document.getElementById('coordApprovedMembersList');
    const allApps = dataService.getApplications();
    const pendingApps = allApps.filter(a => a.status === 'Pending');
    const users = dataService.getUsers();

    if (pendingApps.length === 0) {
      pendingListEl.innerHTML = `<div style="color: var(--text-muted); padding: 1rem 0;">No pending applications in the queue.</div>`;
    } else {
      pendingListEl.innerHTML = pendingApps.map(app => `
        <div class="application-item">
          <div class="app-meta">
            <span class="app-name">${app.name} (${app.country})</span>
            <span class="app-sub">${app.email} • Experience: ${app.debateExperience}</span>
            <p class="app-motivation">"${app.motivation}"</p>
            <div style="margin-top: 0.4rem; display: flex; gap: 0.35rem;">
              ${app.interests.map(i => `<span class="country-pill">${i}</span>`).join('')}
            </div>
          </div>
          <div class="app-actions">
            <button class="btn btn-primary btn-sm" onclick="window.approveApp('${app.id}')">${icons.check} Approve Member</button>
            <button class="btn btn-outline btn-sm" onclick="window.rejectApp('${app.id}')">${icons.x} Decline</button>
          </div>
        </div>
      `).join('');
    }

    // Approved list
    approvedListEl.innerHTML = users.map(u => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-light);">
        <div>
          <strong>${u.name}</strong> (${u.country}) — <span style="color: var(--text-muted); font-size: 0.85rem;">${u.email}</span>
        </div>
        <span class="badge badge-approved">${u.role}</span>
      </div>
    `).join('');
  }

  // --- Subview: Coordinator Team Roster ---
  function renderCoordTeamList() {
    const listEl = document.getElementById('coordTeamRosterGrid');
    const coords = dataService.getUsers().filter(u => u.role === 'Coordinator');

    listEl.innerHTML = coords.map(c => `
      <div class="member-card">
        <div class="m-card-top">
          <div class="m-avatar" style="background: var(--brand-navy); color: #fff;">${icons.getFlag(c.country, c.flag)}</div>
          <div>
            <div class="m-name">${c.name}</div>
            <div class="m-country">${c.department || 'Founding Secretariat'} • ${c.country}</div>
          </div>
        </div>
        <p class="m-bio">${c.bio}</p>
        <div class="m-interests-wrap">
          <span class="interest-tag">ISDC7 Qatar Debater</span>
          <span class="interest-tag">Founding Coordinator</span>
        </div>
      </div>
    `).join('');
  }

  // =========================================================================
  // GLOBAL WINDOW HELPER METHODS (MODAL POPUPS & BUTTON ACTIONS)
  // =========================================================================
  window.viewSessionDetail = function(sessionId) {
    const session = dataService.getSessions().find(s => s.id === sessionId);
    if (!session) return;

    const modalContent = document.getElementById('sessionDetailContent');
    modalContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <span class="badge badge-category">${session.categoryName}</span>
        <span class="badge ${session.status === 'Upcoming' ? 'badge-scheduled' : 'badge-completed'}">${session.status}</span>
      </div>
      <h3 class="serif-text" style="font-size: 1.85rem; color: var(--brand-navy); margin-bottom: 0.85rem;">
        Session ${session.sessionNumber.toString().padStart(2, '0')}: ${session.title}
      </h3>
      <div style="display: flex; flex-wrap: wrap; gap: 1.25rem; font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
        <span style="display:inline-flex; align-items:center; gap:4px;">${icons.calendar} <strong>Date:</strong> ${session.date}</span>
        <span style="display:inline-flex; align-items:center; gap:4px;">${icons.clock} <strong>Time:</strong> ${session.time} (${session.timezone})</span>
        <span style="display:inline-flex; align-items:center; gap:4px;">${icons.clock} <strong>Duration:</strong> ${session.duration}</span>
        <span style="display:inline-flex; align-items:center; gap:4px;">${icons.mic} <strong>Format:</strong> ${session.format}</span>
      </div>

      <div style="background: var(--bg-body); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
        <h5 style="color: var(--brand-navy); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.82rem; letter-spacing: 0.05em;">
          Moderator & Panelists
        </h5>
        <div style="font-size: 0.92rem; margin-bottom: 0.35rem;">
          <strong>Moderator:</strong> ${session.moderator.name} (${session.moderator.country})
        </div>
        <div style="font-size: 0.92rem;">
          <strong>Speakers:</strong>
          <ul style="margin: 0.35rem 0 0 1.25rem; line-height: 1.6;">
            ${session.speakers.map(sp => `<li>${sp.name} (${sp.country}) — <em>${sp.stance}</em></li>`).join('')}
          </ul>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: var(--brand-navy); margin-bottom: 0.65rem; text-transform: uppercase; font-size: 0.82rem; letter-spacing: 0.05em;">
          Session Structure & Agenda
        </h5>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${session.structure.map(st => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.85rem; background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-sm); font-size: 0.88rem;">
              <span><strong>Phase ${st.phase}:</strong> ${st.title}</span>
              <span style="color: var(--text-muted); font-size: 0.82rem;">${st.duration} • Lead: ${st.lead}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: var(--brand-navy); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.82rem; letter-spacing: 0.05em;">
          Preparation Materials & Motion Dossier
        </h5>
        <ul style="margin-left: 1.25rem; font-size: 0.9rem;">
          ${session.prepMaterials.map(m => `<li><a href="${m.url}" target="_blank" style="color: var(--brand-green); font-weight: 500; text-decoration: underline;">${m.title}</a></li>`).join('')}
        </ul>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${session.status === 'Upcoming' ? `
          <a href="${session.meetingLink}" target="_blank" class="btn btn-primary btn-md" style="gap:6px;">
            ${icons.video} Open Private Meeting Link
          </a>
        ` : `
          <button class="btn btn-navy btn-md" style="gap:6px;" onclick="window.playSessionVideo('${session.id}')">
            ${icons.play} Watch Session Recording
          </button>
        `}
      </div>
    `;

    openModal('sessionDetailModal');
  };

  window.playSessionVideo = function(sessionId) {
    const session = dataService.getSessions().find(s => s.id === sessionId);
    if (!session) return;

    const modalContent = document.getElementById('sessionDetailContent');
    modalContent.innerHTML = `
      <h3 class="serif-text" style="font-size: 1.65rem; color: var(--brand-navy); margin-bottom: 0.5rem;">
        Private Recording: Session ${session.sessionNumber.toString().padStart(2, '0')}
      </h3>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">${session.title}</p>
      
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: var(--radius-lg); background: #000; margin-bottom: 1.5rem;">
        <iframe 
          src="${session.recordingUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}" 
          style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.85rem; color: var(--text-muted); display:inline-flex; align-items:center; gap:5px;">
          ${icons.lock} Private unlisted link restricted to Global Youth Dialogue delegates.
        </span>
        ${session.hasSummary ? `
          <button class="btn btn-primary btn-sm" style="gap:6px;" onclick="window.openAcademicPaperBySession('${session.id}')">
            ${icons.book} Read Academic Summary
          </button>
        ` : ''}
      </div>
    `;

    openModal('sessionDetailModal');
  };

  window.openFullAcademicPaper = function(writingId) {
    const writing = dataService.getWritings().find(w => w.id === writingId);
    if (!writing) return;

    const modalContent = document.getElementById('writingReaderContent');
    modalContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span class="badge badge-published">Academic Youth Publication Library</span>
        <button class="btn btn-navy btn-sm" onclick="window.print()" style="gap: 5px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg> Export Dossier (PDF / Print)
        </button>
      </div>
      <div class="print-only-target" style="padding: 1rem 0;">
        <h2 class="serif-text" style="font-size: 2.15rem; color: var(--brand-navy); line-height: 1.25; margin-bottom: 0.85rem;">
          ${writing.title}
        </h2>
        <div style="display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--text-muted); padding-bottom: 1rem; border-bottom: 1px solid var(--border-light); margin-bottom: 1.5rem;">
          <span><strong>Author:</strong> ${writing.author}</span>
          <span><strong>Category:</strong> ${writing.categoryName}</span>
          <span><strong>Date:</strong> ${writing.publicationDate}</span>
          <span><strong>Legacy:</strong> Qatar ISDC7 Network</span>
        </div>

      <div style="line-height: 1.75; font-size: 1rem; color: var(--text-body);">
        <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">01. Introduction</h4>
        <p style="margin-bottom: 1rem;">${writing.intro}</p>

        <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">02. Historical & Diplomatic Background</h4>
        <p style="margin-bottom: 1rem;">${writing.background}</p>

        <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">03. Core Affirmative Arguments</h4>
        <ul style="margin: 0 0 1rem 1.5rem;">
          ${writing.keyArguments.map(arg => `<li style="margin-bottom: 0.4rem;">${arg}</li>`).join('')}
        </ul>

        <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">04. Counterarguments & Sovereign Concerns</h4>
        <ul style="margin: 0 0 1rem 1.5rem;">
          ${writing.counterarguments.map(arg => `<li style="margin-bottom: 0.4rem;">${arg}</li>`).join('')}
        </ul>

        <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">05. Evidence & Case Studies</h4>
        <p style="margin-bottom: 1rem;">${writing.evidence}</p>

        <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">06. Discussion Insights</h4>
        <p style="margin-bottom: 1rem;">${writing.insights}</p>

        <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">07. Scholarly Conclusion</h4>
        <p style="margin-bottom: 1rem;">${writing.conclusion}</p>

        <h4 class="serif-text" style="color: var(--brand-navy); margin: 1.25rem 0 0.5rem;">08. Further Research Questions</h4>
        <ul style="margin: 0 0 1rem 1.5rem;">
          ${writing.furtherQuestions.map(q => `<li style="margin-bottom: 0.4rem;">${q}</li>`).join('')}
        </ul>

        <div style="background: var(--bg-body); padding: 1rem; border-radius: var(--radius-md); margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-muted);">
          <strong>Citations & Sources:</strong><br>
          ${writing.sources}
        </div>
      </div>
    `;

    openModal('writingReaderModal');
  };

  window.openAcademicPaperBySession = function(sessionId) {
    const writing = dataService.getWritings().find(w => w.sessionId === sessionId);
    if (writing) {
      closeModal('sessionDetailModal');
      window.openFullAcademicPaper(writing.id);
    } else {
      showToast('Academic synthesis for this session is currently being drafted by researchers.', 'normal');
    }
  };

  window.updateTopicStatus = function(topicId, newStatus) {
    dataService.updateTopicStatus(topicId, newStatus);
    showToast(`Topic updated to status: "${newStatus}"`, 'success');
  };

  window.approveApp = function(appId) {
    const newUser = dataService.approveApplication(appId);
    if (newUser) {
      showToast(`Approved ${newUser.name}! User account created with role "Member".`, 'success');
      renderCoordinatorPortal();
    }
  };

  window.rejectApp = function(appId) {
    dataService.rejectApplication(appId);
    showToast('Application declined.', 'normal');
    renderCoordinatorPortal();
  };

  // =========================================================================
  // PHASE 2 CONTROLLERS: Search, Notifications, Calendar, Chapters, Media, Analytics
  // =========================================================================

  // 1. Universal Search (Ctrl + K)
  function initGlobalSearch() {
    const searchBtn = document.getElementById('headerSearchBtn');
    const searchInput = document.getElementById('globalSearchInput');
    const searchClose = document.getElementById('searchModalClose');
    const searchResults = document.getElementById('globalSearchResults');
    const filterPills = document.querySelectorAll('#searchFilterPills .search-filter-pill');

    let activeFilter = 'all';

    function openSearch() {
      openModal('globalSearchModal');
      setTimeout(() => searchInput?.focus(), 120);
      performSearch();
    }

    searchBtn?.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', () => closeModal('globalSearchModal'));

    // Keyboard shortcut: Ctrl + K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeModal('globalSearchModal');
      }
    });

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeFilter = pill.getAttribute('data-filter') || 'all';
        performSearch();
      });
    });

    searchInput?.addEventListener('input', () => {
      performSearch();
    });

    function performSearch() {
      if (!searchResults) return;
      const query = (searchInput?.value || '').trim();
      let results = dataService.searchAll(query);
      if (activeFilter !== 'all') {
        results = results.filter(r => r.type === activeFilter);
      }

      if (results.length === 0) {
        searchResults.innerHTML = `
          <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted);">
            <p style="font-size: 0.95rem; margin-bottom: 0.25rem;">No results found for "${query || '...'}"</p>
            <span style="font-size: 0.8rem;">Try searching for "Security Council", "AI", "Climate", or a member's name.</span>
          </div>
        `;
        return;
      }

      searchResults.innerHTML = results.map(item => `
        <div class="search-result-card" data-result-type="${item.type}" data-result-target="${item.targetView}" data-result-id="${item.id}">
          <div class="search-result-info">
            <div class="search-result-title">${item.title}</div>
            <div class="search-result-sub">${item.subtitle}</div>
          </div>
          <span class="search-result-badge">${item.typeLabel}</span>
        </div>
      `).join('');

      searchResults.querySelectorAll('.search-result-card').forEach(card => {
        card.addEventListener('click', () => {
          const type = card.getAttribute('data-result-type');
          const targetView = card.getAttribute('data-result-target');
          const id = card.getAttribute('data-result-id');
          closeModal('globalSearchModal');

          if (type === 'session') {
            window.openSessionModal(id);
          } else if (type === 'writing') {
            window.openWritingModal(id);
          } else if (targetView) {
            if (authService.isCoordinator()) {
              navigateToPortal('coordinator');
              switchCoordSubview(targetView);
            } else if (authService.isLoggedIn()) {
              navigateToPortal('member');
              switchMemberSubview(targetView);
            } else {
              navigateToPortal('public');
            }
          }
        });
      });
    }
  }

  // 2. In-App Notifications Center
  function initNotifications() {
    const notifBtn = document.getElementById('headerNotifBtn');
    const notifModalClose = document.getElementById('notificationsModalClose');
    const markAllRead = document.getElementById('markAllReadBtn');

    function updateBadge() {
      const unreadCount = dataService.getUnreadNotificationsCount();
      const countBadge = document.getElementById('notifCountBadge');
      const totalBadge = document.getElementById('notifTotalBadge');
      if (countBadge) {
        countBadge.textContent = unreadCount;
        countBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
      }
      if (totalBadge) {
        totalBadge.textContent = `${unreadCount} Unread`;
      }
    }

    function renderNotificationList() {
      const list = document.getElementById('notificationsList');
      if (!list) return;
      const notifs = dataService.getNotifications();

      if (notifs.length === 0) {
        list.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No notifications yet.</div>`;
        return;
      }

      list.innerHTML = notifs.map(n => `
        <div class="notif-card ${n.read ? '' : 'unread'}" data-notif-id="${n.id}">
          <div class="notif-icon-wrap">
            ${n.type === 'session' ? icons.calendar : n.type === 'writing' ? icons.book : n.type === 'topic' ? icons.lightbulb : icons.bell}
          </div>
          <div style="flex: 1;">
            <div class="notif-title-row">
              <span class="notif-title">${n.title}</span>
              <span class="notif-time-tag">${n.time}</span>
            </div>
            <p class="notif-body">${n.message}</p>
          </div>
          ${n.read ? '' : '<div class="unread-dot"></div>'}
        </div>
      `).join('');

      list.querySelectorAll('.notif-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-notif-id');
          const notif = dataService.markNotificationRead(id);
          updateBadge();
          renderNotificationList();
          if (notif && notif.targetView) {
            closeModal('notificationsModal');
            if (notif.type === 'session' && notif.targetId) {
              window.openSessionModal(notif.targetId);
            } else if (notif.type === 'writing' && notif.targetId) {
              window.openWritingModal(notif.targetId);
            } else if (authService.isCoordinator()) {
              navigateToPortal('coordinator');
              switchCoordSubview(notif.targetView);
            } else if (authService.isLoggedIn()) {
              navigateToPortal('member');
              switchMemberSubview(notif.targetView);
            }
          }
        });
      });
    }

    notifBtn?.addEventListener('click', () => {
      openModal('notificationsModal');
      renderNotificationList();
    });

    notifModalClose?.addEventListener('click', () => closeModal('notificationsModal'));

    markAllRead?.addEventListener('click', () => {
      dataService.markAllNotificationsRead();
      updateBadge();
      renderNotificationList();
      showToast('All notifications marked as read', 'success');
    });

    updateBadge();
  }

  // 3. Timezone Converter & Calendar Engine
  let activeTimezone = { code: 'AST', offset: 3, label: 'Doha (AST GMT+3)' };

  function renderMemberCalendarView() {
    const container = document.getElementById('memberCalendarList');
    const pillsContainer = document.getElementById('tzSelectorPills');
    const tzDesc = document.getElementById('currentTzDesc');
    if (!container) return;

    if (tzDesc) {
      tzDesc.textContent = `Showing times converted to ${activeTimezone.label}`;
    }

    // Bind timezone pills
    if (pillsContainer) {
      pillsContainer.querySelectorAll('.tz-pill').forEach(pill => {
        pill.onclick = () => {
          pillsContainer.querySelectorAll('.tz-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const code = pill.getAttribute('data-tz');
          const offset = parseInt(pill.getAttribute('data-offset'), 10);
          const label = pill.textContent.trim();
          activeTimezone = { code, offset, label };
          renderMemberCalendarView();
          showToast(`Clock switched to ${label}`);
        };
      });
    }

    const sessions = dataService.getSessions();
    container.innerHTML = sessions.map(ses => {
      const baseHour = 16; // 16:00 UTC+3 Doha
      const diff = activeTimezone.offset - 3;
      let targetHour = (baseHour + diff);
      if (targetHour < 0) targetHour += 24;
      if (targetHour >= 24) targetHour -= 24;
      const formattedTime = `${targetHour.toString().padStart(2, '0')}:00 ${activeTimezone.code}`;

      const dateParts = ses.date.split('-');
      const day = dateParts[2] || '18';
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const month = monthNames[parseInt(dateParts[1], 10) - 1] || 'Oct';

      // Google calendar URL
      const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Global Youth Dialogue: ' + ses.title)}&dates=${ses.date.replace(/-/g, '')}T${targetHour.toString().padStart(2, '0')}0000Z/${ses.date.replace(/-/g, '')}T${(targetHour + 2).toString().padStart(2, '0')}0000Z&details=${encodeURIComponent('Motion: ' + ses.motion + '\nMeeting Link: ' + ses.meetLink)}&location=${encodeURIComponent('Google Meet: ' + ses.meetLink)}`;

      return `
        <div class="calendar-card">
          <div class="calendar-date-block">
            <div class="calendar-date-num">${day}</div>
            <div class="calendar-date-month">${month}</div>
            <div class="calendar-time-converted">${formattedTime}</div>
          </div>
          <div>
            <div class="calendar-meta-title">Session ${ses.sessionNumber.toString().padStart(2, '0')}: ${ses.title}</div>
            <div class="calendar-motion-quote">"${ses.motion}"</div>
            <div class="calendar-speakers-tags">
              <span class="country-pill" style="background: var(--brand-green-light); color: var(--brand-green); font-weight: 600;">${ses.status}</span>
              <span class="country-pill">Format: ${ses.format}</span>
              <span class="country-pill">⏳ ${ses.duration}</span>
            </div>
          </div>
          <div class="calendar-actions-col">
            <a href="${ses.meetLink}" target="_blank" class="btn btn-primary btn-sm" style="text-align: center; text-decoration: none;">
              ${icons.video} Join Google Meet
            </a>
            <a href="${gCalUrl}" target="_blank" class="btn btn-outline btn-sm" style="text-align: center; text-decoration: none; font-size: 0.76rem;">
              ${icons.calendar} Google Calendar
            </a>
            <button class="btn btn-subtle btn-sm" onclick="window.downloadIcs('${ses.id}', '${formattedTime}')" style="font-size: 0.74rem;">
              Download .ics
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 4. Country Chapters Hub
  function renderCountryChapters() {
    const reps = dataService.getCountryReps();
    const publicGrid = document.getElementById('publicRepsGrid');
    const memberGrid = document.getElementById('memberRepsGrid');
    const coordGrid = document.getElementById('coordRepsGrid');
    const isAr = i18n.isRTL();

    const generateHtml = () => reps.map(r => {
      const repName = isAr ? (r.repNameAr || r.repName) : r.repName;
      const country = isAr ? (r.countryAr || r.country) : r.country;
      const chapterName = isAr ? (r.chapterNameAr || r.chapterName) : r.chapterName;
      const bio = isAr ? (r.bioAr || r.bio) : r.bio;
      const isdcTeam = isAr ? (r.isdcTeamAr || r.isdcTeam) : r.isdcTeam;
      const originLabel = isAr ? 'الفريق في بطولة قطر:' : 'Origin:';
      const debatersCount = isAr 
        ? `${r.activeDebaters.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d])} مناظراً نشطاً`
        : `${r.activeDebaters} Active Debaters`;
      const contactLabel = isAr ? 'تواصل مع المنسق' : 'Contact Rep';

      return `
      <div class="rep-card">
        <div>
          <div class="rep-header">
            <div class="rep-flag-box">${icons.getFlag(r.country, r.flag)}</div>
            <div>
              <div class="rep-name">${repName}</div>
              <div class="rep-chapter-title">${country} • ${chapterName}</div>
            </div>
          </div>
          <p class="rep-bio">${bio}</p>
        </div>
        <div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            <strong>${originLabel}</strong> ${isdcTeam}
          </div>
          <div class="rep-stats-row">
            <span style="display:inline-flex;align-items:center;gap:5px;">${icons.users} ${debatersCount}</span>
            <a href="mailto:${r.email}" class="btn btn-outline btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.74rem; text-decoration: none;">
              ${icons.mail} ${contactLabel}
            </a>
          </div>
        </div>
      </div>
    `;
    }).join('');

    if (publicGrid) publicGrid.innerHTML = generateHtml();
    if (memberGrid) memberGrid.innerHTML = generateHtml();
    if (coordGrid) coordGrid.innerHTML = generateHtml();
  }

  // 5. Media & PR Content Studio
  function renderMediaKits() {
    const grid = document.getElementById('coordMediaKitsGrid');
    if (!grid) return;
    const kits = dataService.getMediaKits();

    grid.innerHTML = kits.map(k => `
      <div class="media-kit-card">
        <div>
          <span class="media-kit-type-tag">${k.category || 'Promo Kit'}</span>
          <div class="media-kit-title">${k.title}</div>
          <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-body); margin-bottom: 0.5rem;">
            ${k.headline}
          </div>
          <div class="media-copy-box" id="copyBox_${k.id}">${k.copyText}</div>
        </div>
        <div class="media-actions-bar">
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
            ${(k.tags || []).map(t => `<span class="country-pill" style="font-size: 0.7rem;">#${t}</span>`).join('')}
          </div>
          <button class="btn btn-navy btn-sm" onclick="window.copyMediaText('copyBox_${k.id}')" style="gap: 0.4rem;">
            ${icons.copy} Copy Text
          </button>
        </div>
      </div>
    `).join('');
  }

  // 6. Member Journey & Honor Badges
  function renderMemberJourneyView() {
    const user = authService.getCurrentUser();
    if (!user) return;
    const stats = dataService.getUserAnalytics(user.id);

    const statsStrip = document.getElementById('memberAnalyticsStrip');
    if (statsStrip) {
      statsStrip.innerHTML = `
        <div class="analytics-stat-card">
          <div class="analytics-stat-num">${stats.sessionsAttended}</div>
          <div class="analytics-stat-label">Dialogues Attended</div>
        </div>
        <div class="analytics-stat-card">
          <div class="analytics-stat-num">${stats.debatesSpoken}</div>
          <div class="analytics-stat-label">Debates Spoken</div>
        </div>
        <div class="analytics-stat-card">
          <div class="analytics-stat-num">${stats.writingsAuthored}</div>
          <div class="analytics-stat-label">Academic Papers Authored</div>
        </div>
        <div class="analytics-stat-card">
          <div class="analytics-stat-num">${stats.engagementScore}%</div>
          <div class="analytics-stat-label">Community Score</div>
        </div>
      `;
    }

    const badgesGrid = document.getElementById('memberBadgesGrid');
    if (badgesGrid) {
      badgesGrid.innerHTML = stats.badges.map(b => `
        <div class="badge-honor-card ${b.unlocked ? '' : 'locked'}">
          <div>
            <div class="badge-icon-header">
              <div class="badge-icon-box">
                ${icons[b.icon] || icons.award}
              </div>
              <span class="badge-status-pill ${b.unlocked ? 'status-approved' : 'status-review'}" style="font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 999px;">
                ${b.unlocked ? `${icons.check} UNLOCKED` : 'IN PROGRESS'}
              </span>
            </div>
            <div class="badge-title">${b.title}</div>
            <p class="badge-desc">${b.desc}</p>
          </div>
          <div class="badge-progress-wrap">
            <div class="badge-progress-bar">
              <div class="badge-progress-fill" style="width: ${b.progress};"></div>
            </div>
            <div class="badge-progress-label">
              <span>Progress</span>
              <span>${b.progress}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // 7. Coordinator Forms Initialization
  function initPhase2Forms() {
    // New Country Chapter
    document.getElementById('coordNewChapterBtn')?.addEventListener('click', () => openModal('newChapterModal'));
    document.getElementById('newChapterForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const country = document.getElementById('chapCountry').value.trim();
      const flag = document.getElementById('chapFlag').value.trim();
      const chapterName = document.getElementById('chapName').value.trim();
      const repName = document.getElementById('chapRepName').value.trim();
      const email = document.getElementById('chapEmail').value.trim();
      const isdcTeam = document.getElementById('chapIsdcTeam').value.trim();
      const activeDebaters = document.getElementById('chapDebatersCount').value.trim();
      const bio = document.getElementById('chapBio').value.trim();

      dataService.addCountryRep({
        country,
        flag,
        chapterName,
        repName,
        email,
        isdcTeam,
        activeDebaters,
        bio
      });

      closeModal('newChapterModal');
      document.getElementById('newChapterForm').reset();
      renderCountryChapters();
      showToast(`Registered new chapter: ${country} (${chapterName})!`, 'success');
    });

    // New Media Kit
    document.getElementById('coordNewMediaKitBtn')?.addEventListener('click', () => openModal('newMediaKitModal'));
    document.getElementById('newMediaKitForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('mkTitle').value.trim();
      const type = document.getElementById('mkType').value;
      const headline = document.getElementById('mkHeadline').value.trim();
      const copyText = document.getElementById('mkCopyText').value.trim();
      const tags = document.getElementById('mkTags').value.split(',').map(t => t.trim()).filter(Boolean);

      dataService.createMediaKit({
        title,
        type,
        category: type === 'instagram_caption' ? 'Instagram' : (type === 'quote_card' ? 'Quote' : 'PR'),
        headline,
        copyText,
        tags
      });

      closeModal('newMediaKitModal');
      document.getElementById('newMediaKitForm').reset();
      renderMediaKits();
      showToast(`Published new Media Kit: "${title}"!`, 'success');
    });
  }

  // Global Helpers for Media Copy and Calendar .ics
  window.copyMediaText = function(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText || el.textContent).then(() => {
      showToast('Copied text to clipboard! Ready to paste into Instagram or WhatsApp.', 'success');
    }).catch(() => {
      showToast('Press Ctrl+C to copy selected text.', 'normal');
    });
  };

  window.downloadIcs = function(sessionId, formattedTime) {
    const ses = dataService.getSessions().find(s => s.id === sessionId);
    if (!ses) return;

    const dtParts = ses.date.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Global Youth Dialogue//Dialogue Sessions//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:Global Youth Dialogue: ${ses.title}`,
      `DESCRIPTION:Motion: ${ses.motion}\\n\\nMeeting Link: ${ses.meetLink}`,
      `LOCATION:Google Meet: ${ses.meetLink}`,
      `DTSTART:${dtParts}T130000Z`,
      `DTEND:${dtParts}T150000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `GYD_Session_${ses.sessionNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded calendar file: GYD_Session_${ses.sessionNumber}.ics`, 'success');
  };

  // =========================================================================
  // PHASE 3: LIVE CHAMBER TIMER, POI AUDIO & OFFICIAL CERTIFICATES
  // =========================================================================

  // 1. Web Audio Bell Chime Synthesizer (Zero-dependency, offline)
  function playChimeBell(count = 1) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      for (let i = 0; i < count; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + (i * 0.3);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, startTime); // A5 chime bell
        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.7);
      }
    } catch (err) {
      console.warn('Audio chime playback restricted or unsupported:', err);
    }
  }

  // 2. Official Chamber Speech Timer Engine
  let chamberTimerInterval = null;
  let chamberSecondsElapsed = 0;
  let chamberTotalSeconds = 420; // 7 minutes default (Constructive)
  let chamberIsRunning = false;

  function updateChamberTimerDisplay() {
    const digitsEl = document.getElementById('timerDigits');
    const bannerEl = document.getElementById('poiBanner');
    if (!digitsEl || !bannerEl) return;

    const mins = Math.floor(chamberSecondsElapsed / 60);
    const secs = chamberSecondsElapsed % 60;
    digitsEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // POI State Transitions
    if (chamberSecondsElapsed < 60) {
      // 0:00 - 1:00 Protected Time
      bannerEl.className = 'poi-banner protected';
      bannerEl.innerHTML = `<span class="timer-banner-icon">${icons.lock}</span> PROTECTED TIME (1ST MINUTE — NO POIs)`;
    } else if (chamberSecondsElapsed >= 60 && chamberSecondsElapsed < (chamberTotalSeconds - 60)) {
      // 1:00 - (Total - 1:00) Open Floor for POIs
      bannerEl.className = 'poi-banner open';
      bannerEl.innerHTML = `<span class="timer-banner-icon">${icons.bell}</span> FLOOR OPEN FOR POIs (Points of Information Permitted)`;
    } else if (chamberSecondsElapsed >= (chamberTotalSeconds - 60) && chamberSecondsElapsed <= chamberTotalSeconds) {
      // Final Minute Protected Time
      bannerEl.className = 'poi-banner protected';
      bannerEl.innerHTML = `<span class="timer-banner-icon">${icons.lock}</span> PROTECTED TIME (FINAL MINUTE — NO POIs)`;
    } else {
      // Overtime
      bannerEl.className = 'poi-banner overtime';
      bannerEl.innerHTML = chamberSecondsElapsed > chamberTotalSeconds + 15
        ? `<span class="timer-banner-icon">${icons.stopCircle || icons.shield}</span> SPEECH OVERTIME — PLEASE CONCLUDE IMMEDIATELY`
        : `<span class="timer-banner-icon">${icons.alertTriangle || icons.zap}</span> TIME EXPIRED (GRACE PERIOD: 15 SECONDS)`;
    }
  }

  function initChamberTimer() {
    const digitsEl = document.getElementById('timerDigits');
    const startBtn = document.getElementById('timerStartBtn');
    const pauseBtn = document.getElementById('timerPauseBtn');
    const resetBtn = document.getElementById('timerResetBtn');
    const bellBtn = document.getElementById('timerBellBtn');
    const raisePoiBtn = document.getElementById('raisePoiBtn');
    const poiList = document.getElementById('poiQueueList');

    if (!digitsEl) return;

    // Reset display
    updateChamberTimerDisplay();

    // Format selection pills
    document.querySelectorAll('#subviewMemberChamber [data-timer-len]').forEach(pill => {
      pill.onclick = () => {
        document.querySelectorAll('#subviewMemberChamber [data-timer-len]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        chamberTotalSeconds = parseInt(pill.getAttribute('data-timer-len'), 10);
        
        // Reset running timer
        if (chamberTimerInterval) clearInterval(chamberTimerInterval);
        chamberTimerInterval = null;
        chamberIsRunning = false;
        chamberSecondsElapsed = 0;
        if (startBtn) startBtn.innerHTML = `${icons.play} Start Speech`;
        updateChamberTimerDisplay();
        showToast(`Format set to ${pill.getAttribute('data-format-name') || pill.textContent.trim()}`);
      };
    });

    if (startBtn) {
      startBtn.onclick = () => {
        if (chamberIsRunning) return;
        chamberIsRunning = true;
        startBtn.innerHTML = `${icons.play} Running...`;

        chamberTimerInterval = setInterval(() => {
          chamberSecondsElapsed++;
          updateChamberTimerDisplay();

          // Chime triggers
          if (chamberSecondsElapsed === 60) {
            playChimeBell(1);
            showToast('1 Minute Elapsed: Floor is now OPEN for POIs!', 'normal');
          } else if (chamberSecondsElapsed === (chamberTotalSeconds - 60)) {
            playChimeBell(1);
            showToast('Protected Time: Final minute reached, no further POIs.', 'normal');
          } else if (chamberSecondsElapsed === chamberTotalSeconds) {
            playChimeBell(2);
            showToast('Time Expired! 15 seconds grace period begins.', 'normal');
          } else if (chamberSecondsElapsed === chamberTotalSeconds + 15) {
            playChimeBell(3);
            showToast('Grace period concluded! Please gavel speech.', 'error');
          }
        }, 1000);
      };
    }

    if (pauseBtn) {
      pauseBtn.onclick = () => {
        if (!chamberIsRunning) return;
        clearInterval(chamberTimerInterval);
        chamberTimerInterval = null;
        chamberIsRunning = false;
        if (startBtn) startBtn.textContent = '▶ Resume Speech';
        showToast('Speech timer paused.');
      };
    }

    if (resetBtn) {
      resetBtn.onclick = () => {
        if (chamberTimerInterval) clearInterval(chamberTimerInterval);
        chamberTimerInterval = null;
        chamberIsRunning = false;
        chamberSecondsElapsed = 0;
        if (startBtn) startBtn.textContent = '▶ Start Speech';
        updateChamberTimerDisplay();
        showToast('Speech timer reset to 00:00.');
      };
    }

    if (bellBtn) {
      bellBtn.onclick = () => {
        playChimeBell(1);
        showToast('Chamber Bell Chimed (Gavel Check)');
      };
    }

    if (raisePoiBtn && poiList) {
      raisePoiBtn.onclick = () => {
        const user = authService.getCurrentUser() || { name: 'Delegate', country: 'Global' };
        const poiTopic = prompt('Enter POI subject or question (e.g. Sovereign Debt / Clause 4):', 'Clarification on Motion');
        if (!poiTopic) return;

        const item = document.createElement('div');
        item.className = 'poi-standing-item';
        item.innerHTML = `
          <div>
            <strong>${user.name} (${user.country})</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${poiTopic}</div>
          </div>
          <button class="btn btn-subtle btn-sm" onclick="this.parentElement.remove()">Dismiss</button>
        `;
        poiList.prepend(item);
        playChimeBell(1);
        showToast(`POI offered by ${user.name} (${user.country})!`, 'success');
      };
    }
  }

  // 3. Official Certificate of Participation Generator
  function renderMemberCertificate() {
    const user = authService.getCurrentUser();
    const cert = dataService.getCertificateData(user ? user.id : 'usr_mem_1');

    const nameEl = document.getElementById('certRecipientName');
    const roleEl = document.getElementById('certCountryRole');
    const idEl = document.getElementById('certVerificationId');
    const printBtn = document.getElementById('printCertBtn');

    if (nameEl) nameEl.textContent = cert.recipientName;
    if (roleEl) roleEl.textContent = `${cert.country} • ${cert.role} Delegate`;
    if (idEl) idEl.textContent = cert.certificateNumber;

    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }
  }

  // 4. Community Topic Ballot Upvote Global Function
  window.voteTopic = function(topicId) {
    const user = authService.getCurrentUser();
    const userId = user ? user.id : 'usr_mem_1';
    const result = dataService.upvoteTopic(topicId, userId);
    if (result) {
      const countEl = document.getElementById(`voteCount_${topicId}`);
      if (countEl) countEl.textContent = result.upvotes;
      showToast(result.hasUpvoted ? '▲ Upvoted topic in the community ballot!' : 'Upvote removed.', 'success');
    }
  };

  // =========================================================================
  // INITIALIZE APP
  // =========================================================================
  function renderAll() {
    i18n.applyLanguage();
    const user = authService.getCurrentUser();
    const hash = window.location.hash;

    if (hash === '#signin' || hash === '#login') {
      navigateToPortal('signin');
      return;
    }

    if (user) {
      if (user.role === 'Coordinator') {
        navigateToPortal('coordinator');
      } else {
        navigateToPortal('member');
      }
    } else {
      navigateToPortal('public');
    }
  }

  // Handle URL hash changes for direct navigation
  window.addEventListener('hashchange', () => {
    const rawHash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';
    if (rawHash === 'signin' || rawHash === 'login') {
      navigateToPortal('signin');
    } else if (rawHash === 'public' || rawHash === 'home') {
      if (activePortal !== 'public') navigateToPortal('public');
      switchPublicSection('home');
    } else {
      const valid = ['about', 'topics', 'sessions', 'impact'];
      if (valid.includes(rawHash)) {
        if (activePortal !== 'public') navigateToPortal('public');
        switchPublicSection(rawHash);
      }
    }
  });

  // Initialize Phase 2 Services
  initGlobalSearch();
  initNotifications();
  initPhase2Forms();

  
  // Re-render all dynamic content instantly on language change
  window.addEventListener('gyd-lang-changed', () => {
    updateAuthHeaderUI();
    if (activePortal === 'public') {
      renderPublicPage();
    } else if (activePortal === 'member') {
      renderMemberPortal();
    } else if (activePortal === 'coordinator') {
      renderCoordinatorPortal();
    }
  });

  renderAll();
});
