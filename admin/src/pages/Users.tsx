import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { useAdminAuth } from '../context/AdminAuthContext';
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
  Square,
  Sliders,
  Mail,
  Eye,
  MapPin,
  Building2,
  BookOpen,
  Heart,
  Star,
} from 'lucide-react';

export const ADMIN_MODULES = [
  { id: 'dashboard', name: 'Programme Overview', nameAr: 'نظرة عامة على البرنامج', description: 'Metrics, live telemetry, and activity pulse', descriptionAr: 'المؤشرات والقياسات الحية ونبض الأنشطة' },
  { id: 'users', name: 'The Community', nameAr: 'المجتمع والوفود', description: 'Community directory, membership, and role management', descriptionAr: 'دليل المجتمع والوفود وإدارة العضويات والأدوار' },
  { id: 'pipeline', name: 'Topic Lifecycle Pipeline', nameAr: 'مسار اعتماد المواضيع', description: 'Topic submissions, review stages, and voting pipeline', descriptionAr: 'مقترحات المواضيع ومراحل المراجعة والاعتماد' },
  { id: 'topics', name: 'Topic Bank', nameAr: 'بنك المواضيع', description: 'Official registry of proposed and approved dialogue topics', descriptionAr: 'السجل الرسمي للمواضيع المعتمدة والمقترحة للحوار' },
  { id: 'sessions', name: 'Session Management', nameAr: 'إدارة الجلسات', description: 'Dialogue session scheduling, chambers, and format config', descriptionAr: 'جدولة جلسات الحوار وتكوين الغرف والوفود' },
  { id: 'session-summaries', name: 'Session Summaries', nameAr: 'ملخصات الجلسات', description: 'Post-dialogue executive summaries and deliberation briefs', descriptionAr: 'الملخصات التنفيذية والتحليلات الأكاديمية للجلسات' },
  { id: 'publications', name: 'Academic Writing Studio', nameAr: 'استوديو الكتابة الأكاديمية', description: 'Working papers, resolutions, and editorial publishing', descriptionAr: 'أوراق العمل والمقالات البحثية والنشر الأكاديمي' },
  { id: 'feedback', name: 'Delegate Feedback Analysis', nameAr: 'تحليل تقييمات الوفود', description: 'Participant ratings, feedback analytics, and sentiment', descriptionAr: 'تقييمات المشاركين وتحليل مؤشرات الأداء الحواري' },
  { id: 'applications', name: 'Pending Applications', nameAr: 'طلبات الانضمام المعلقة', description: 'Applicant screening, verification, and admission approval', descriptionAr: 'تدقيق وتدقيق ملفات المتقدمين والبت في العضوية' },
  { id: 'analytics', name: 'Country Chapters', nameAr: 'الفروع والوفود الدولية', description: 'Geographic delegate distribution and chapter analytics', descriptionAr: 'التوزيع الجغرافي للمشاركين ومؤشرات الفروع الوطنية' },
  { id: 'settings', name: 'Media & PR Studio', nameAr: 'استوديو الإعلام والعلاقات العامة', description: 'Press materials, public relations assets, and broadcast kits', descriptionAr: 'المواد الصحفية وأصول العلاقات العامة وحقائب البث' },
];

export const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const { isArabic, t, translateRole, translateStatus } = useAdminLanguage();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);

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

  const { isSuperAdmin } = useAdminAuth();
  const [permissionModalUser, setPermissionModalUser] = useState<{ user: User; targetRole: UserRole } | null>(null);
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
    if (newRole === 'ADMIN') {
      if (!isSuperAdmin) {
        alert('Only the Super Administrator has authorization to appoint Co-Administrators and grant permissions.');
        return;
      }
      setPermissionModalUser({ user: targetUser, targetRole: newRole });
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
    if (!isSuperAdmin) {
      alert('Only the Super Administrator has authorization to configure Co-Administrator permissions.');
      return;
    }
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
              {isArabic ? 'المشرفون المعاونون' : 'Co-Administrators'}
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
          {['all', 'MEMBER', 'PRESENTER', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                roleFilter === r
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {r === 'all'
                ? t('users.filterAllRoles', 'All')
                : r === 'ADMIN'
                ? (isArabic ? 'مشرفون معاونون' : 'Co-Admins')
                : translateRole(r)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">{isArabic ? 'جاري تحميل سجلات الوفود والأعضاء...' : 'Loading user records...'}</div>
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
                          onClick={() => setSelectedUserDetail(u)}
                          className="text-left group"
                        >
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                            {u.name}
                            <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                          </div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div>{u.country || t('dash.global', 'Global')}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          {u.organization || t('apps.independent', 'Independent')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {u.role === 'SUPER_ADMIN' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 font-bold text-xs shadow-xs">
                            <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{isArabic ? 'المشرف العام' : 'Super Admin'}</span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <select
                              value={u.role === 'COORDINATOR' ? 'ADMIN' : u.role}
                              onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                              className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="MEMBER">{translateRole('MEMBER')}</option>
                              <option value="PRESENTER">{translateRole('PRESENTER')}</option>
                              {isSuperAdmin && <option value="ADMIN">{isArabic ? 'مشرف معاون' : 'Co-Admin'}</option>}
                            </select>

                            {(u.role === 'COORDINATOR' || u.role === 'ADMIN') ? (
                              isSuperAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleOpenPermissions(u)}
                                  title={t('users.configurePermissions', 'Configure Co-Admin Permissions')}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 transition-colors inline-flex items-center gap-1.5 text-xs font-bold shadow-xs"
                                >
                                  <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                  <span>{isArabic ? 'الصلاحيات' : t('users.perms', 'Permissions')} ({u.allowedMenus ? u.allowedMenus.length : 11}/11)</span>
                                </button>
                              )
                            ) : isSuperAdmin && (
                              <button
                                type="button"
                                onClick={() => handleRoleChange(u, 'ADMIN')}
                                title={t('users.assignCoAdmin', 'Promote to Co-Admin and configure permissions')}
                                className="px-2 py-1 rounded-lg text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 border border-indigo-100 dark:border-indigo-900/60 transition-colors inline-flex items-center gap-1"
                              >
                                <Shield className="w-3 h-3 text-indigo-500" />
                                <span>{isArabic ? 'ترقية لمشرف معاون' : t('users.grantCoAdmin', 'Grant Co-Admin')}</span>
                              </button>
                            )}
                          </div>
                        )}
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
                          onClick={() => setSelectedUserDetail(u)}
                          className="text-left group"
                        >
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                            {u.name}
                            <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                          </h4>
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
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {u.role === 'SUPER_ADMIN' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 font-bold text-xs">
                          <Shield className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{isArabic ? 'المشرف العام' : 'Super Admin'}</span>
                        </span>
                      ) : (
                        <>
                          <select
                            value={u.role === 'COORDINATOR' ? 'ADMIN' : u.role}
                            onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                            className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                          >
                            <option value="MEMBER">{translateRole('MEMBER')}</option>
                            <option value="PRESENTER">{translateRole('PRESENTER')}</option>
                            {isSuperAdmin && <option value="ADMIN">{isArabic ? 'مشرف معاون' : 'Co-Admin'}</option>}
                          </select>

                          {(u.role === 'COORDINATOR' || u.role === 'ADMIN') ? (
                            isSuperAdmin && (
                              <button
                                type="button"
                                onClick={() => handleOpenPermissions(u)}
                                title={t('users.configurePermissions', 'Configure Co-Admin Permissions')}
                                className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors inline-flex items-center gap-1 text-xs font-bold"
                              >
                                <Shield className="w-3.5 h-3.5" />
                                <span>{isArabic ? 'الصلاحيات' : 'Permissions'}</span>
                              </button>
                            )
                          ) : isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleRoleChange(u, 'ADMIN')}
                              className="px-2 py-1 text-[11px] rounded-lg border border-dashed border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 hover:bg-indigo-100 transition-colors inline-flex items-center gap-1 font-semibold"
                            >
                              <Shield className="w-3 h-3" />
                              <span>{isArabic ? 'ترقية لمشرف معاون' : 'Grant Co-Admin'}</span>
                            </button>
                          )}
                        </>
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

      {/* User Detail Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 overflow-hidden max-h-[90vh] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {selectedUserDetail.name ? selectedUserDetail.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{selectedUserDetail.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-1 ${
                    selectedUserDetail.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {translateStatus(selectedUserDetail.status)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              {/* Role badge */}
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedUserDetail.role === 'SUPER_ADMIN' ? 'Super Administrator' :
                   selectedUserDetail.role === 'ADMIN' || selectedUserDetail.role === 'COORDINATOR' ? 'Co-Administrator' :
                   selectedUserDetail.role === 'PRESENTER' ? 'Keynote Presenter' : 'Member / Youth Scholar'}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-700 dark:text-slate-300 break-all">{selectedUserDetail.email}</span>
              </div>

              {/* Country */}
              {selectedUserDetail.country && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{selectedUserDetail.country}</span>
                </div>
              )}

              {/* Organization */}
              {selectedUserDetail.organization && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{selectedUserDetail.organization}</span>
                </div>
              )}

              {/* Bio */}
              {(selectedUserDetail as any).bio && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bio</div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{(selectedUserDetail as any).bio}</p>
                </div>
              )}

              {/* Interested Fields */}
              {(() => {
                const fields = (selectedUserDetail as any).areasOfInterest?.length
                  ? (selectedUserDetail as any).areasOfInterest
                  : (selectedUserDetail as any).interests?.length
                  ? (selectedUserDetail as any).interests
                  : [];
                return (
                  <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                      <Heart className="w-3 h-3" />
                      <span>Interested Fields & Focus Areas</span>
                    </div>
                    {fields.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {fields.map((field: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                            {field}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No specific interest fields recorded</p>
                    )}
                  </div>
                );
              })()}

              {/* Experience */}
              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                  <Star className="w-3 h-3" />
                  <span>Academic & Delegate Experience</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {(selectedUserDetail as any).experience || (selectedUserDetail as any).bio || 'Not provided in application'}
                </p>
              </div>

              {/* Motivation */}
              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  Statement of Motivation & Goals
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {(selectedUserDetail as any).motivation || 'Not provided in application'}
                </p>
              </div>

              {/* Joined date */}
              <div className="text-[11px] text-slate-400 pt-1">
                Member since {new Date(selectedUserDetail.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>

              {/* Security notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="text-[10px] text-rose-700 dark:text-rose-400">Password is encrypted and never displayed for security.</span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close
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
                          {isArabic && (mod as any).nameAr ? (mod as any).nameAr : mod.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {isArabic && (mod as any).descriptionAr ? (mod as any).descriptionAr : mod.description}
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
