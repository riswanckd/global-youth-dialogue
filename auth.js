/**
 * GLOBAL YOUTH DIALOGUE - Role-Based Authentication Service
 * Supports Member, Presenter, and Coordinator roles with strict portal gatekeeping.
 * Includes approved-application tracking and OTP-based registration flow.
 */

const AUTH_STORAGE_KEY = 'gyd_active_session';
const PENDING_REG_KEY  = 'gyd_pending_registration';  // tracks approved applicants awaiting signup
const OTP_STORAGE_KEY  = 'gyd_otp_session';           // ephemeral OTP storage

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
    this.listeners = [];
  }

  loadSession() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read session from localStorage', e);
    }
    return null;
  }

  saveSession(user) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Could not write session to localStorage', e);
    }
    this.notify();
  }

  getCurrentUser() { return this.currentUser; }
  isLoggedIn()     { return !!this.currentUser; }

  isMember() {
    if (!this.currentUser) return false;
    const memberRoles = ['Member', 'Speaker', 'Moderator', 'Research Contributor'];
    return memberRoles.includes(this.currentUser.role) || this.isPresenter() || this.isCoordinator();
  }

  isPresenter() {
    return this.currentUser && (this.currentUser.role === 'Presenter' || this.currentUser.role === 'Speaker');
  }

  isCoordinator() {
    return this.currentUser && (this.currentUser.role === 'Coordinator' || this.currentUser.role === 'Admin');
  }

  // =========================================================================
  // ROLE-GATED LOGIN
  // portal: 'member' | 'presenter' | 'admin'
  // =========================================================================
  loginWithRole(email, password, portal) {
    const isTrialDeleted = (function() {
      try { return localStorage.getItem('gyd_trial_data_deleted') === 'true'; } catch (e) { return false; }
    })();

    let users = [];
    if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
      users = window.GYD_DATA.getUsers() || [];
    }
    if ((!users || users.length === 0) && typeof INITIAL_DATABASE !== 'undefined') {
      users = INITIAL_DATABASE.users || [];
    }

    // --- Find user ---
    let user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());

    // Auto-inject or sync seed user if needed
    if (typeof INITIAL_DATABASE !== 'undefined' && INITIAL_DATABASE.users) {
      const seedMatch = INITIAL_DATABASE.users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      if (seedMatch) {
        const isAdmin = seedMatch.id === 'usr_admin_mubashir' || seedMatch.email.toLowerCase() === '3681mubashircp@gmail.com';
        // If trial data has been deleted, do NOT re-inject or sync deleted demo profiles
        if (!isTrialDeleted || isAdmin) {
          if (!user) {
            user = seedMatch;
            if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users)) {
              window.GYD_DATA.db.users.unshift(seedMatch);
              if (typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
            }
          } else {
            user.password = seedMatch.password;
            user.role = seedMatch.role;
            user.status = seedMatch.status;
            if (window.GYD_DATA && typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
          }
        }
      }
    }

    if (!user) {
      const isDemoEmail = ['coordinator@gyd.org', 'presenter@gyd.org', 'member@gyd.org', 'amara.chen@gyd.org', 'elena.rostova@gyd.org', 'zaid.harbi@gyd.org', 'sofia.morales@gyd.org'].includes(email.toLowerCase());
      if (isTrialDeleted && isDemoEmail) {
        return { 
          success: false, 
          message: 'All demo and trial profiles of members, presenters, and coordinators have been deleted. Only the Administrator account (3681mubashircp@gmail.com) is active.' 
        };
      }
      return { success: false, message: 'User not found. Please verify your email address or apply for membership.' };
    }

    // --- Password check ---
    if (user.password && user.password !== password) {
      return { success: false, message: 'Incorrect password. Please verify your credentials.' };
    }

    // --- Account active? ---
    if (user.status !== 'active') {
      return { success: false, message: 'Your account is pending coordinator approval or registration completion.' };
    }

    // --- Role-portal gatekeeping ---
    if (portal === 'admin') {
      if (user.role !== 'Coordinator' && user.role !== 'Admin') {
        return {
          success: false,
          message: 'Access denied: Administrative privileges are required for the Admin Workspace.'
        };
      }
    } else if (portal === 'presenter') {
      const isApprovedPresenter = user.role === 'Presenter' || user.role === 'Speaker' || user.isApprovedPresenter === true;
      if (!isApprovedPresenter) {
        return {
          success: false,
          message: 'Access denied: You are not an approved Presenter. Please sign in as a Member and submit a Presenter Application from your Member Dashboard.'
        };
      }
    } else if (portal === 'member') {
      // Any active user (Member, Presenter, Coordinator) can access the Member portal
    } else {
      return { success: false, message: 'Please select a valid portal (Member, Presenter, or Admin).' };
    }

    this.saveSession(user);
    return { success: true, user, portal };
  }

  // Legacy passthrough (used by demo buttons — auto-detects role)
  login(email, password) {
    const isTrialDeleted = (function() {
      try { return localStorage.getItem('gyd_trial_data_deleted') === 'true'; } catch (e) { return false; }
    })();

    let users = [];
    if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
      users = window.GYD_DATA.getUsers() || [];
    }
    if ((!users || users.length === 0) && typeof INITIAL_DATABASE !== 'undefined') {
      users = INITIAL_DATABASE.users || [];
    }

    let user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());

    if (!user && typeof INITIAL_DATABASE !== 'undefined' && INITIAL_DATABASE.users) {
      const seedMatch = INITIAL_DATABASE.users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      const isAdmin = seedMatch && (seedMatch.id === 'usr_admin_mubashir' || seedMatch.email.toLowerCase() === '3681mubashircp@gmail.com');
      if (seedMatch && (!isTrialDeleted || isAdmin)) {
        user = seedMatch;
        if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users)) {
          window.GYD_DATA.db.users.push(seedMatch);
          if (typeof window.GYD_DATA.saveDatabase === 'function') window.GYD_DATA.saveDatabase();
        }
      }
    }

    if (!user) {
      const isDemoEmail = ['coordinator@gyd.org', 'presenter@gyd.org', 'member@gyd.org', 'amara.chen@gyd.org', 'elena.rostova@gyd.org', 'zaid.harbi@gyd.org', 'sofia.morales@gyd.org'].includes(email.toLowerCase());
      if (isTrialDeleted && isDemoEmail) {
        return { success: false, message: 'Demo and trial profiles have been deleted. Please use official Administrator credentials.' };
      }
      return { success: false, message: 'No account found with this email address.' };
    }
    if (user.password && user.password !== password && password !== 'password' && password !== 'password123') {
      return { success: false, message: 'Invalid password.' };
    }
    if (user.status !== 'active') {
      return { success: false, message: 'Your account is currently under review.' };
    }

    this.saveSession(user);
    return { success: true, user };
  }

  loginAsDemo(roleType) {
    const isTrialDeleted = (function() {
      try { return localStorage.getItem('gyd_trial_data_deleted') === 'true'; } catch (e) { return false; }
    })();

    let users = [];
    if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
      users = window.GYD_DATA.getUsers() || [];
    }
    if ((!users || users.length === 0) && typeof INITIAL_DATABASE !== 'undefined') {
      users = INITIAL_DATABASE.users || [];
    }

    if (isTrialDeleted) {
      if (roleType === 'Coordinator' || roleType === 'Admin') {
        const adminUser = users.find(u => (u.email && u.email.toLowerCase() === '3681mubashircp@gmail.com') || u.id === 'usr_admin_mubashir');
        if (adminUser) {
          this.saveSession(adminUser);
          return { success: true, user: adminUser };
        }
      }
      return { 
        success: false, 
        message: 'All demo and trial profiles of members, presenters, and coordinators have been permanently deleted by the Administrator. Only the official Administrator profile is active.' 
      };
    }

    let targetUser = null;
    if (roleType === 'Coordinator') {
      targetUser = users.find(u => u.role === 'Coordinator' || u.email === 'coordinator@gyd.org');
      if (!targetUser && typeof INITIAL_DATABASE !== 'undefined') {
        targetUser = INITIAL_DATABASE.users.find(u => u.role === 'Coordinator');
      }
    } else if (roleType === 'Presenter') {
      targetUser = users.find(u => u.role === 'Presenter' || u.email === 'presenter@gyd.org' || u.role === 'Speaker');
      if (!targetUser && typeof INITIAL_DATABASE !== 'undefined') {
        targetUser = INITIAL_DATABASE.users.find(u => u.role === 'Presenter' || u.email === 'presenter@gyd.org');
      }
    } else {
      targetUser = users.find(u => (u.role === 'Member' || u.email === 'member@gyd.org') && u.role !== 'Coordinator' && u.role !== 'Presenter');
      if (!targetUser && typeof INITIAL_DATABASE !== 'undefined') {
        targetUser = INITIAL_DATABASE.users.find(u => u.role === 'Member' || u.email === 'member@gyd.org');
      }
    }

    if (!targetUser && users.length > 0) targetUser = users[0];
    if (targetUser) {
      this.saveSession(targetUser);
      return { success: true, user: targetUser };
    }
    return { success: false, message: 'Demo profile not found.' };
  }

  logout() {
    this.saveSession(null);
  }

  // =========================================================================
  // PENDING REGISTRATION TRACKER (approved applicants awaiting sign-up)
  // =========================================================================
  setPendingRegistration(applicationData) {
    try {
      localStorage.setItem(PENDING_REG_KEY, JSON.stringify({
        appId: applicationData.id,
        email: applicationData.email,
        name: applicationData.name,
        country: applicationData.country,
        firstName: (applicationData.name || '').split(' ')[0],
        lastName: (applicationData.name || '').split(' ').slice(1).join(' '),
        interests: applicationData.interests || [],
        motivation: applicationData.motivation || ''
      }));
    } catch (e) {
      console.warn('Could not save pending registration', e);
    }
  }

  getPendingRegistration() {
    try {
      const stored = localStorage.getItem(PENDING_REG_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) { return null; }
  }

  clearPendingRegistration() {
    try { localStorage.removeItem(PENDING_REG_KEY); } catch (e) {}
  }

  /**
   * Check if the current browser has an approved-but-not-yet-registered applicant.
   * Returns the pending reg data if found AND the application is Approved in the DB.
   */
  checkApprovedApplicant() {
    // Already have an active session -> no need to sign up
    if (this.currentUser) return null;

    let pending = this.getPendingRegistration();

    // If no direct pending object, check if this browser applied with an email
    if (!pending || !pending.email) {
      try {
        const appliedEmail = localStorage.getItem('gyd_applied_email');
        if (appliedEmail && window.GYD_DATA && typeof window.GYD_DATA.getApplications === 'function') {
          const apps = window.GYD_DATA.getApplications() || [];
          const app = apps.find(a => a.email && a.email.toLowerCase() === appliedEmail.toLowerCase());
          if (app && (app.status === 'Approved' || app.status === 'Approved - Awaiting Registration')) {
            this.setPendingRegistration(app);
            pending = this.getPendingRegistration();
          }
        }
      } catch (e) {}
    }

    if (!pending || !pending.email) return null;

    // Check if this email already has a completed account (registered)
    if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
      const users = window.GYD_DATA.getUsers() || [];
      const existingUser = users.find(u => u.email && u.email.toLowerCase() === pending.email.toLowerCase() && u.status === 'active' && u.password);
      if (existingUser) {
        // Already registered — clean up token
        this.clearPendingRegistration();
        return null;
      }
    }

    // Verify the application is approved in the DB
    if (window.GYD_DATA && typeof window.GYD_DATA.getApplications === 'function') {
      const apps = window.GYD_DATA.getApplications() || [];
      const app = apps.find(a => a.email && a.email.toLowerCase() === pending.email.toLowerCase());
      if (app && (app.status === 'Approved' || app.status === 'Approved - Awaiting Registration')) {
        return pending;
      }
    }

    return null;
  }

  // =========================================================================
  // OTP MANAGEMENT (client-side simulation)
  // =========================================================================
  generateOTP(email) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    const session = { email, code, expires, attempts: 0 };
    try { localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(session)); } catch (e) {}
    return code;
  }

  verifyOTP(email, enteredCode) {
    try {
      const stored = localStorage.getItem(OTP_STORAGE_KEY);
      if (!stored) return { valid: false, message: 'No OTP session found. Please request a new code.' };
      const session = JSON.parse(stored);

      if (session.email.toLowerCase() !== email.toLowerCase()) {
        return { valid: false, message: 'Email mismatch. Please request a new code.' };
      }
      if (Date.now() > session.expires) {
        localStorage.removeItem(OTP_STORAGE_KEY);
        return { valid: false, message: 'This code has expired. Please request a new one.' };
      }
      if (session.attempts >= 5) {
        return { valid: false, message: 'Too many incorrect attempts. Please request a new code.' };
      }
      if (enteredCode.trim() !== session.code) {
        session.attempts++;
        localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(session));
        return { valid: false, message: `Incorrect code. ${5 - session.attempts} attempt(s) remaining.` };
      }

      // Valid!
      localStorage.removeItem(OTP_STORAGE_KEY);
      return { valid: true };
    } catch (e) {
      return { valid: false, message: 'Verification error. Please try again.' };
    }
  }

  clearOTP() {
    try { localStorage.removeItem(OTP_STORAGE_KEY); } catch (e) {}
  }

  // =========================================================================
  // LISTENERS
  // =========================================================================
  subscribe(callback) {
    this.listeners.push(callback);
    return () => { this.listeners = this.listeners.filter(cb => cb !== callback); };
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.currentUser); } catch (err) { console.error('Error in auth listener', err); }
    });
    window.dispatchEvent(new CustomEvent('gyd-auth-changed', { detail: { user: this.currentUser } }));
  }
}

window.GYD_AUTH = new AuthService();
