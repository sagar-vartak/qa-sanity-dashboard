'use client';

import { useState } from 'react';

interface SidebarProps {
  environments: string[];
  modules: string[];
  selectedEnv: string | null;
  selectedModule: string | null;
  onEnvChange: (env: string | null) => void;
  onModuleChange: (module: string | null) => void;
  entryCount: number;
  filteredCount: number;
}

export default function Sidebar({
  environments,
  modules,
  selectedEnv,
  selectedModule,
  onEnvChange,
  onModuleChange,
  entryCount,
  filteredCount,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-24 z-50 rounded-lg bg-slate-800 p-2 text-white shadow-lg lg:hidden"
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-20 z-40 h-[calc(100vh-80px)] w-64 transform bg-white shadow-xl transition-transform duration-300 dark:bg-slate-800 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-6">
          {/* Sidebar Header */}
          <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Filters
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {filteredCount} of {entryCount} entries
            </p>
          </div>

          {/* Environment Filter */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Environment
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onEnvChange(null)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedEnv === null
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                All Environments
              </button>
              {environments.map((env) => (
                <button
                  key={env}
                  onClick={() => onEnvChange(env)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selectedEnv === env
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          {/* Module Filter */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Module
            </label>
            <div className="space-y-2">
              <button
                onClick={() => onModuleChange(null)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedModule === null
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                }`}
              >
                All Modules
              </button>
              {modules.map((module) => (
                <button
                  key={module}
                  onClick={() => onModuleChange(module)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selectedModule === module
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {module}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedEnv || selectedModule) && (
            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  onEnvChange(null);
                  onModuleChange(null);
                }}
                className="w-full rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

