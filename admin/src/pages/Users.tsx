import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { User, UserRole } from '../types';
import {
  Users as UsersIcon,
  Search,
  Shield,
  UserCheck,
  UserX,
  KeyRound,
  Filter,
  Trash2,
  Lock,
  Check,
  X,
  CheckSquare,
  Sliders,
  Info,
  Globe,
  Mail,
  Calendar,
  Award,
} from 'lucide-react';

export const ADMIN_MODULES = [
  { id: 'dashboard', name: 'Programme Overview', description: 'Metrics, live telemetry, and activity pulse' },
  { id: 'users', name: 'The Community', description: 'Community directory, membership, and role management' },
  { id: 'pipeline', name: 'Topic Lifecycle Pipeline', description: 'Topic submissions, review stages, and voting pipeline' },
  { id: 'topics', name: 'Topic Bank', description: 'Official registry of proposed and approved dialogue topics' },
  { id: 'sessions', name: 'Session Management', description: 'Dialogue session scheduling, chambers, and format config' },
  { id: 'session-summaries', name: 'Session Summaries', description: 'Post-dialogue executive summaries and deliberation briefs' },
  { id: 'publications', name: 'Academic Writing Studio', description: 'Working papers, resolutions, and editorial publishing' },
  { id: 'feedback', name: 'Delegate Feedback Analysis', description: 'Participant ratings, feedback analytics, and sentiment' },
  { id: 'applications', name: 'Pending Applications', description: 'Applicant screening, verification, and admission approval' },
  { id: 'analytics', name: 'Country Chapters', description: 'Geographic delegate distribution and chapter analytics' },
  { id: 'settings', name: 'Media & PR Studio', description: 'Press materials, public relations assets, and broadcast kits' },
];

export const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const { t, translateRole, translateStatus } = useAdminLanguage();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users', roleFilter],
    queryFn: async () => {
      let remoteUsers: User[] = [];
      try {
        const res = await apiRequest<User[]>(
          `/admin/users${roleFilter !== 'all' ? `?role=${roleFilter}` : ''}`
        );
        if (Array.isArray(res)) remoteUsers = res;
      } catch (err) {
        console.warn('Could not query /admin/users:', err);
      }

      // Merge approved applications from local cache if not yet synced
      try {
        const raw = localStorage.getItem('gyde_cached_applications');
        if (raw) {
          const apps = JSON.parse(raw);
          const approved = apps.filter((a: any) => a.status === 'approved');
          const userEmails = new Set(remoteUsers.map((u) => u.email.toLowerCase()));
          approved.forEach((a: any) => {
            if (!userEmails.has(a.email.toLowerCase())) {
              remoteUsers.push({
                id: a.id,
                name: a.applicantName || a.name || 'Member',
                email: a.email,
                role: a.isApprovedPresenter ? 'PRESENTER' : 'MEMBER',
                status: 'active',
                emailVerified: true,
                country: a.country || 'Global',
                organization: a.organization || 'Independent Scholar',
                createdAt: a.createdAt || new Date().toISOString(),
              });
            }
          });
        }
      } catch {}

      if (roleFilter !== 'all') {
        return remoteUsers.filter((u) => u.role === roleFilter);
      }
      return remoteUsers;
    },
  });

  const [permissionModalUser, setPermissionModalUser] = useState<{ user: User; targetRole: UserRole } | null>(null);
  const [selectedUserDetailsUser, setSelectedUserDetailsUser] = useState<User | null>(null);
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role, allowedMenus }: { id: string; role: UserRole; allowedMenus?: string[] }) =>
      apiRequest(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role, allowedMenus }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setPermissionModalUser(null);
    },
  });

  const handleRoleChange = (targetUser: User, newRole: UserRole) => {
    if (newRole === 'ADMIN' || newRole === 'COORDINATOR') {
      setPermissionModalUser({ user: targetUser, targetRole: 'ADMIN' });
      setSelectedMenus(
        targetUser.allowedMenus && targetUser.allowedMenus.length > 0
          ? targetUser.allowedMenus
          : ADMIN_MODULES.map((m) => m.id)
      );
    } else {
      updateRoleMutation.mutate({ id: targetUser.id, role: newRole });
    }
  };

  const handleOpenPermissions = (targetUser: User) => {
    setPermissionModalUser({ user: targetUser, targetRole: targetUser.role });
    setSelectedMenus(
      targetUser.allowedMenus && targetUser.allowedMenus.length > 0
        ? targetUser.allowedMenus
        : ADMIN_MODULES.map((m) => m.id)
    );
  };

  const handleToggleMenu = (menuId: string) => {
    setSelectedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const handleSelectAllMenus = () => {
    setSelectedMenus(ADMIN_MODULES.map((m) => m.id));
  };

  const handleClearAllMenus = () => {
    setSelectedMenus([]);
  };

  const handleSavePermissions = () => {
    if (!permissionModalUser) return;
    updateRoleMutation.mutate({
      id: permissionModalUser.user.id,
      role: permissionModalUser.targetRole,
      allowedMenus: selectedMenus,
    });
  };

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' }) =>
      apiRequest(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (targetUser: User) => {
      await apiRequest(`/admin/users/${targetUser.id}`, { method: 'DELETE' }).catch(() => {});
      await apiRequest('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ action: 'deleteUser', email: targetUser.email, id: targetUser.id }),
      }).catch(() => {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.country && u.country.toLowerCase().includes(q))
    );
  });

  const totalMembersCount = users.filter((u) => u.role === 'MEMBER').length;
  const presentersCount = users.filter((u) => u.role === 'PRESENTER').length;
  const coordinatorsCount = users.filter(
    (u) => u.role === 'COORDINATOR' || u.role === 'ADMIN' || u.role === 'SUPER_ADMIN'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('users.title', 'Community Directory & Roles')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('users.subtitle', 'Manage authenticated youth scholars, fellows, and secretariat coordinators.')}
          </p>
        </div>
      </div>

      {/* KPI Cards Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Directory */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {users.length}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('users.title', 'Community')}
            </div>
          </div>
        </div>

        {/* Youth Scholars & Fellows */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {totalMembersCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateRole('MEMBER')}
            </div>
          </div>
        </div>

        {/* Keynote Presenters */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {presentersCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateRole('PRESENTER')}
            </div>
          </div>
        </div>

        {/* Coordinators & Admins */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {coordinatorsCount}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {translateRole('COORDINATOR')}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
          <input
            type="text"
            placeholder={t('users.searchPlaceholder', 'Search by name, email, or country...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t('users.filterAllRoles', 'All') },
            { id: 'MEMBER', label: translateRole('MEMBER') },
            { id: 'PRESENTER', label: translateRole('PRESENTER') },
            { id: 'ADMIN', label: 'Co-Admins' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRoleFilter(item.id)}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                roleFilter === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading user records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <UsersIcon className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">
              {t('users.noUsers', 'No users found matching filter.')}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">{t('users.colUser', 'User')}</th>
                    <th className="py-3 px-4">{t('users.colCountry', 'Country & Org')}</th>
                    <th className="py-3 px-4">{t('users.colRole', 'Role')}</th>
                    <th className="py-3 px-4">{t('users.colStatus', 'Status')}</th>
                    <th className="py-3 px-4">{t('users.joined', 'Joined')}</th>
                    <th className="py-3 px-4 text-right rtl:text-left">{t('users.colActions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => setSelectedUserDetailsUser(u)}
                          className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 text-left rtl:text-right transition-colors cursor-pointer group flex items-center gap-1.5"
                          title="Click to view full dossier & profile"
                        >
                          <span className="underline decoration-dotted underline-offset-2 group-hover:decoration-solid">{u.name}</span>
                          <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                        </button>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{u.country || t('dash.global', 'Global')}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          {u.organization || t('apps.independent', 'Independent')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {u.role === 'SUPER_ADMIN' ? (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                              Super Administrator
                            </span>
                          ) : (
                            <select
                              value={u.role === 'COORDINATOR' ? 'ADMIN' : u.role}
                              onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                              className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="MEMBER">{translateRole('MEMBER')}</option>
                              <option value="PRESENTER">{translateRole('PRESENTER')}</option>
                              <option value="ADMIN">Co-Admin</option>
                            </select>
                          )}

                          {(u.role === 'COORDINATOR' || u.role === 'ADMIN') ? (
                            <button
                              type="button"
                              onClick={() => handleOpenPermissions(u)}
                              title={t('users.configurePermissions', 'Configure Co-Admin Permissions')}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 transition-colors inline-flex items-center gap-1.5 text-xs font-bold shadow-xs"
                            >
                              <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                              <span>{t('users.perms', 'Permissions')} ({u.allowedMenus ? u.allowedMenus.length : 11}/11)</span>
                            </button>
                          ) : u.role !== 'SUPER_ADMIN' && (
                            <button
                              type="button"
                              onClick={() => handleRoleChange(u, 'ADMIN')}
                              title={t('users.assignCoAdmin', 'Promote to Co-Admin and configure permissions')}
                              className="px-2 py-1 rounded-lg text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 border border-indigo-100 dark:border-indigo-900/60 transition-colors inline-flex items-center gap-1"
                            >
                              <Shield className="w-3 h-3 text-indigo-500" />
                              <span>{t('users.grantCoAdmin', 'Grant Co-Admin')}</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {translateStatus(u.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right rtl:text-left">
                        <div className="flex items-center justify-end rtl:justify-start gap-1.5">
                          <button
                            onClick={() =>
                              toggleStatusMutation.mutate({
                                id: u.id,
                                status: u.status === 'active' ? 'suspended' : 'active',
                              })
                            }
                            className={`px-2.5 py-1 text-xs font-semibold rounded ${
                              u.status === 'active'
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                            }`}
                          >
                            {u.status === 'active' ? t('users.suspend', 'Suspend') : t('users.activate', 'Activate')}
                          </button>
                          {u.role !== 'SUPER_ADMIN' && u.email !== 'admin@thegyde.in' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Permanently delete user "${u.name}" (${u.email})?`)) {
                                  deleteUserMutation.mutate(u);
                                }
                              }}
                              disabled={deleteUserMutation.isPending}
                              className="px-2 py-1 text-xs font-semibold rounded bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1"
                              title="Delete user permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t('users.delete', 'Delete')}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-3">
              {filtered.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelectedUserDetailsUser(u)}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 leading-tight text-left rtl:text-right flex items-center gap-1"
                        >
                          <span>{u.name}</span>
                          <Info className="w-3 h-3 text-slate-400 shrink-0" />
                        </button>
                        <p className="text-[11px] text-slate-500 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        u.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {translateStatus(u.status)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                    <span>{u.country || t('dash.global', 'Global')} • {u.organization || t('apps.independent', 'Independent')}</span>
                    <span className="text-[10px] text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {u.role === 'SUPER_ADMIN' ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200">
                          Super Admin
                        </span>
                      ) : (
                        <select
                          value={u.role === 'COORDINATOR' ? 'ADMIN' : u.role}
                          onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                          className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                        >
                          <option value="MEMBER">{translateRole('MEMBER')}</option>
                          <option value="PRESENTER">{translateRole('PRESENTER')}</option>
                          <option value="ADMIN">Co-Admin</option>
                        </select>
                      )}

                      {(u.role === 'COORDINATOR' || u.role === 'ADMIN') ? (
                        <button
                          type="button"
                          onClick={() => handleOpenPermissions(u)}
                          title={t('users.configurePermissions', 'Configure Co-Admin Permissions')}
                          className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors inline-flex items-center gap-1 text-xs font-bold"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Permissions</span>
                        </button>
                      ) : u.role !== 'SUPER_ADMIN' && (
                        <button
                          type="button"
                          onClick={() => handleRoleChange(u, 'ADMIN')}
                          className="px-2 py-1 text-[11px] rounded-lg border border-dashed border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 hover:bg-indigo-100 transition-colors inline-flex items-center gap-1 font-semibold"
                        >
                          <Shield className="w-3 h-3" />
                          <span>Grant Co-Admin</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: u.id,
                            status: u.status === 'active' ? 'suspended' : 'active',
                          })
                        }
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                          u.status === 'active'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
                        }`}
                      >
                        {u.status === 'active' ? t('users.suspend', 'Suspend') : t('users.activate', 'Activate')}
                      </button>

                      {u.role !== 'SUPER_ADMIN' && u.email !== 'admin@thegyde.in' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Permanently delete user "${u.name}" (${u.email})?`)) {
                              deleteUserMutation.mutate(u);
                            }
                          }}
                          disabled={deleteUserMutation.isPending}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900 transition-colors"
                          title="Delete user permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Complete User Details Dossier Modal (NO password displayed) */}
      {selectedUserDetailsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  {selectedUserDetailsUser.name ? selectedUserDetailsUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                    <span>{selectedUserDetailsUser.name}</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        selectedUserDetailsUser.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {translateStatus(selectedUserDetailsUser.status)}
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{selectedUserDetailsUser.email}</span>
                    <span>•</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {selectedUserDetailsUser.role === 'SUPER_ADMIN' ? 'Super Administrator' : selectedUserDetailsUser.role === 'ADMIN' ? 'Co-Admin' : translateRole(selectedUserDetailsUser.role)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserDetailsUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 no-scrollbar text-xs">
              {/* Geographic & Institutional Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Country Representation
                  </span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>{selectedUserDetailsUser.country || 'Global Delegate'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Organization / Academic Affiliation
                  </span>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedUserDetailsUser.organization || 'Independent Researcher'}
                  </div>
                </div>
              </div>

              {/* Interested Fields & Thematic Areas */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Thematic Interests & Specializations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedUserDetailsUser.interests && selectedUserDetailsUser.interests.length > 0) ? (
                    selectedUserDetailsUser.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-100 dark:border-indigo-900/60 text-[11px]"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">Global Dialogue, International Diplomacy & Cross-Cultural Exchange</span>
                  )}
                </div>
              </div>

              {/* Experience & Background */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Academic & Professional Experience
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {(selectedUserDetailsUser as any).experience || selectedUserDetailsUser.bio || 'Verified academic delegate active in the Qatar ISDC7 / GYDE international delegation.'}
                </div>
              </div>

              {/* Motivation & Statement of Purpose */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Motivation & Engagement Statement
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {(selectedUserDetailsUser as any).motivation || 'Committed to representing national dialogue perspectives, participating in multilateral chambers, and authoring academic policy briefs.'}
                </div>
              </div>

              {/* Account Meta & Security Check */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <div>
                  <span className="font-medium text-slate-400">Member Since:</span>{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(selectedUserDetailsUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-slate-400">Account Security:</span>{' '}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Bcrypt Hash Secured • Password Confidential
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <div className="text-[11px] text-slate-400">
                Platform ID: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">{selectedUserDetailsUser.id}</code>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserDetailsUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Co-Admin Granular Permission Settings Modal */}
      {permissionModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {t('users.permModalTitle', 'Co-Admin Granular Permission Settings')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('users.permModalSub', 'Configure authorized menu modules for')}{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {permissionModalUser.user.name}
                    </span>{' '}
                    ({permissionModalUser.user.email})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPermissionModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center justify-between py-3 px-1 text-xs shrink-0">
              <div className="text-slate-500">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedMenus.length}</span> of {ADMIN_MODULES.length} modules authorized
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllMenus}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('users.selectAll', 'Select All')}
                </button>
                <button
                  type="button"
                  onClick={handleClearAllMenus}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('users.clearAll', 'Clear All')}
                </button>
              </div>
            </div>

            {/* Modules Checkbox Grid (Scrollable) */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 no-scrollbar py-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ADMIN_MODULES.map((mod) => {
                  const isChecked = selectedMenus.includes(mod.id);
                  return (
                    <label
                      key={mod.id}
                      onClick={() => handleToggleMenu(mod.id)}
                      className={`cursor-pointer p-3 rounded-xl border text-left rtl:text-right transition-all flex items-start gap-3 select-none ${
                        isChecked
                          ? 'border-indigo-500/80 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by label click
                        className="mt-0.5 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                          {mod.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {mod.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="p-3 mt-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  {t(
                    'users.permNotice',
                    'Unauthorized modules will remain visible in the Co-Admin sidebar for navigational consistency, but will be greyed out, disabled, and non-clickable with a lock indicator.'
                  )}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setPermissionModalUser(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleSavePermissions}
                disabled={updateRoleMutation.isPending}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {updateRoleMutation.isPending
                    ? t('common.saving', 'Saving...')
                    : t('users.savePermissions', 'Save & Grant Permissions')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
