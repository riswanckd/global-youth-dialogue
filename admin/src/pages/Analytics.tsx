import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const PALETTE = ['#4950BA', '#A159AF', '#10B981', '#F59E0B', '#3B82F6', '#EC4899'];

export const Analytics: React.FC = () => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Analytics & Deliberations</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time metrics on debate session attendance, geographic distribution, and paper citations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance trend chart */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Chamber Attendance</h3>
          <div className="h-72 w-full flex items-center justify-center">
            {isLoading ? (
              <div className="text-xs text-slate-400">Loading trend analytics...</div>
            ) : sessionTrendData.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <BarChart3 className="w-8 h-8 mx-auto text-slate-400 opacity-50" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">No session attendance data recorded yet.</p>
                <p className="text-[11px] text-slate-400">Sessions held will reflect attendance trends automatically here.</p>
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
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Applicant Geographic Distribution</h3>
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
