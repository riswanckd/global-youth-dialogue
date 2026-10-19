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
} from 'lucide-react';

export const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const { t, translateRole, translateStatus } = useAdminLanguage();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users', roleFilter],
    queryFn: () =>
      apiRequest<User[]>(
        `/admin/users${roleFilter !== 'all' ? `?role=${roleFilter}` : ''}`
      ),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      apiRequest(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

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
          {['all', 'MEMBER', 'PRESENTER', 'COORDINATOR', 'ADMIN', 'SUPER_ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                roleFilter === r
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? t('users.filterAllRoles', 'All') : translateRole(r)}
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
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{u.country || t('dash.global', 'Global')}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          {u.organization || t('apps.independent', 'Independent')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            updateRoleMutation.mutate({ id: u.id, role: e.target.value as UserRole })
                          }
                          className="text-xs font-semibold px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                        >
                          <option value="MEMBER">{translateRole('MEMBER')}</option>
                          <option value="PRESENTER">{translateRole('PRESENTER')}</option>
                          <option value="COORDINATOR">{translateRole('COORDINATOR')}</option>
                          <option value="ADMIN">{translateRole('ADMIN')}</option>
                          <option value="SUPER_ADMIN">{translateRole('SUPER_ADMIN')}</option>
                        </select>
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
                          {u.role !== 'SUPER_ADMIN' && u.email !== '3681mubashircp@gmail.com' && (
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
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {u.name}
                        </h4>
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

                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        updateRoleMutation.mutate({ id: u.id, role: e.target.value as UserRole })
                      }
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                    >
                      <option value="MEMBER">{translateRole('MEMBER')}</option>
                      <option value="PRESENTER">{translateRole('PRESENTER')}</option>
                      <option value="COORDINATOR">{translateRole('COORDINATOR')}</option>
                      <option value="ADMIN">{translateRole('ADMIN')}</option>
                      <option value="SUPER_ADMIN">{translateRole('SUPER_ADMIN')}</option>
                    </select>

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

                      {u.role !== 'SUPER_ADMIN' && u.email !== '3681mubashircp@gmail.com' && (
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
    </div>
  );
};
