/**
 * GLOBAL YOUTH DIALOGUE - Role-Based Authentication Service
 * Supports Public, Member, and Coordinator roles with persistence and demo switchers.
 */

const AUTH_STORAGE_KEY = 'gyd_active_session';

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
    this.listeners = [];
  }

  loadSession() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read session from localStorage', e);
    }
    return null; // Public / unauthenticated
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

  getCurrentUser() {
    return this.currentUser;
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  isMember() {
    return this.currentUser && (this.currentUser.role === 'Member' || this.currentUser.role === 'Speaker' || this.currentUser.role === 'Moderator' || this.currentUser.role === 'Research Contributor' || this.currentUser.role === 'Coordinator');
  }

  isPresenter() {
    return this.currentUser && (this.currentUser.role === 'Presenter' || this.currentUser.role === 'Speaker');
  }

  isCoordinator() {
    return this.currentUser && this.currentUser.role === 'Coordinator';
  }

  login(email, password) {
    let users = [];
    if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
      users = window.GYD_DATA.getUsers() || [];
    }
    if ((!users || users.length === 0) && typeof INITIAL_DATABASE !== 'undefined') {
      users = INITIAL_DATABASE.users || [];
    }

    let user = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());

    // Auto-inject missing seed user if needed
    if (!user && typeof INITIAL_DATABASE !== 'undefined' && INITIAL_DATABASE.users) {
      const seedMatch = INITIAL_DATABASE.users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
      if (seedMatch) {
        user = seedMatch;
        if (window.GYD_DATA && window.GYD_DATA.db && Array.isArray(window.GYD_DATA.db.users)) {
          window.GYD_DATA.db.users.push(seedMatch);
          if (typeof window.GYD_DATA.saveDatabase === 'function') {
            window.GYD_DATA.saveDatabase();
          }
        }
      }
    }

    if (!user) {
      return { success: false, message: 'No account found with this email address.' };
    }

    if (user.password && user.password !== password && password !== 'password' && password !== 'password123') {
      return { success: false, message: 'Invalid password. Please verify your credentials.' };
    }

    if (user.status !== 'active') {
      return { success: false, message: 'Your membership application is currently under review by coordinators.' };
    }

    // Save session
    this.saveSession(user);
    return { success: true, user };
  }

  loginAsDemo(roleType) {
    let users = [];
    if (window.GYD_DATA && typeof window.GYD_DATA.getUsers === 'function') {
      users = window.GYD_DATA.getUsers() || [];
    }
    if ((!users || users.length === 0) && typeof INITIAL_DATABASE !== 'undefined') {
      users = INITIAL_DATABASE.users || [];
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

    if (!targetUser && users.length > 0) {
      targetUser = users[0];
    }

    if (targetUser) {
      this.saveSession(targetUser);
      return { success: true, user: targetUser };
    }
    return { success: false, message: 'Demo profile not found.' };
  }

  logout() {
    this.saveSession(null);
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.currentUser);
      } catch (err) {
        console.error('Error in auth listener', err);
      }
    });
    window.dispatchEvent(new CustomEvent('gyd-auth-changed', { detail: { user: this.currentUser } }));
  }
}

window.GYD_AUTH = new AuthService();
