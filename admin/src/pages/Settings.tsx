import React from 'react';
import { useAdminLanguage } from '../context/AdminLanguageContext';
import { Settings as SettingsIcon, Shield, Server, Database } from 'lucide-react';

export const Settings: React.FC = () => {
  const { t } = useAdminLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('settings.title', 'Platform Settings & Security')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t('settings.subtitle', 'Configure GYDE infrastructure, authentication parameters, and email dispatchers.')}
        </p>
      </div>

      {/* 2x2 System Health & Settings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
        {/* API Service */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('settings.apiConn', 'API Service Connectivity')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t('settings.apiConnDesc', 'REST endpoint is connected to')}{' '}
              <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">/api/v1</code>
            </p>
          </div>
        </div>

        {/* MongoDB Data Layer */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Resilient
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('settings.dbLayer', 'MongoDB Data Layer')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t('settings.dbLayerDesc', 'MongoDB with Mongoose schemas, automated memory-server fallback enabled.')}
            </p>
          </div>
        </div>

        {/* RBAC Control */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              Enforced
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('settings.rbac', 'Role-Based Access Control')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t('settings.rbacDesc', 'Strict RBAC enforcement for SUPER_ADMIN, ADMIN, COORDINATOR, PRESENTER, and MEMBER.')}
            </p>
          </div>
        </div>

        {/* Security Telemetry */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              Active
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Security & Audit Telemetry
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              End-to-end token auditing, session revocation, and security activity tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
