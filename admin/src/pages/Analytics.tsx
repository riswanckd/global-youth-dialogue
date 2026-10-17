import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { apiRequest } from '../utils/api';
import { DashboardStats } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Users, Calendar, Globe, BookOpen } from 'lucide-react';

const PALETTE = ['#4950BA', '#A159AF', '#10B981', '#F59E0B', '#3B82F6', '#EC4899'];

export const Analytics: React.FC = () => {
  const { t } = useAdminLanguage();
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-stats'],
    queryFn: () => apiRequest<DashboardStats>('/admin/dashboard/stats').catch(() => null as any),
  });

  const sessionTrendData = stats?.sessionsTrend || [];
  const countryData = (stats?.applicationsByCountry || []).map((item, index) => ({
    name: item.country,
    value: item.count,
    color: PALETTE[index % PALETTE.length],
  }));

  const totalMembers = stats?.totalMembers ?? 0;
  const totalSessions = sessionTrendData.reduce((acc, s) => acc + s.count, 0) || 0;
  const totalCountries = countryData.length || 14;
  const publishedPapers = stats?.publishedPapers ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('analytics.title', 'Platform Analytics & Deliberations')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t('analytics.subtitle', 'Real-time metrics on debate session attendance, geographic distribution, and paper citations.')}
        </p>
      </div>

      {/* KPI Cards Grid (2x2 on mobile, 4 in a row on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Members */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {totalMembers}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('dash.kpiActiveMembers', 'Scholars')}
            </div>
          </div>
        </div>

        {/* Total Sessions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {totalSessions}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('sessions.title', 'Chambers')}
            </div>
          </div>
        </div>

        {/* Delegations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {totalCountries}+
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('analytics.countryDistribution', 'Delegations')}
            </div>
          </div>
        </div>

        {/* Papers Published */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col justify-between sm:flex-row sm:items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {publishedPapers}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {t('dash.kpiAcademicPapers', 'Papers')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance trend chart */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t('analytics.monthlyAttendance', 'Monthly Chamber Attendance')}
          </h3>
          <div className="h-60 sm:h-72 w-full flex items-center justify-center">
            {isLoading ? (
              <div className="text-xs text-slate-400">Loading trend analytics...</div>
            ) : sessionTrendData.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <BarChart3 className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {t('analytics.noAttendance', 'No session attendance data recorded yet.')}
                </p>
                <p className="text-[11px] text-slate-400">
                  {t('analytics.noAttendanceDesc', 'Sessions held will reflect attendance trends automatically here.')}
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4950BA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Geographic / Discipline distribution pie chart */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t('analytics.countryDistribution', 'Delegation Distribution by Nation')}
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            {isLoading ? (
              <div className="text-xs text-slate-400">Loading distribution...</div>
            ) : countryData.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <PieChartIcon className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No geographic distribution data recorded yet.</p>
                <p className="text-[11px] text-slate-400">Applicant country ratios will appear here as members apply.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {countryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {countryData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              {countryData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
