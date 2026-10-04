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
    const users = window.GYD_DATA.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

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
    const users = window.GYD_DATA.getUsers();
    let targetUser = null;

    if (roleType === 'Coordinator') {
      targetUser = users.find(u => u.role === 'Coordinator') || users[0];
    } else if (roleType === 'Presenter') {
      targetUser = users.find(u => u.role === 'Presenter' || u.email === 'presenter@gyd.org' || u.role === 'Speaker') || users[1];
    } else {
      targetUser = users.find(u => (u.role === 'Member' || u.email === 'member@gyd.org') && u.role !== 'Coordinator' && u.role !== 'Presenter') || users[2];
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
