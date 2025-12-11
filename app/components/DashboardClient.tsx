'use client';

import { useState, useMemo } from 'react';
import Sidebar from './Sidebar';
import EntriesTable from './EntriesTable';

interface Entry {
  uid: string;
  name?: string;
  date?: string;
  env?: string;
  module?: string;
  total?: number;
  passed?: number;
  failed?: number;
  html_report?: Array<{ url?: string }>;
  [key: string]: any;
}

interface DashboardClientProps {
  entries: Entry[];
}

export default function DashboardClient({ entries }: DashboardClientProps) {
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Extract unique environments and modules
  const environments = useMemo(() => {
    const envs = new Set<string>();
    entries.forEach((entry) => {
      const env = entry.env || entry.environment;
      if (env && env !== 'N/A') {
        envs.add(env);
      }
    });
    return Array.from(envs).sort();
  }, [entries]);

  const modules = useMemo(() => {
    const mods = new Set<string>();
    entries.forEach((entry) => {
      const mod = entry.module || entry.module_name;
      if (mod && mod !== 'N/A') {
        mods.add(mod);
      }
    });
    return Array.from(mods).sort();
  }, [entries]);

  // Filter entries based on selected filters
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const entryEnv = entry.env || entry.environment || 'N/A';
      const entryModule = entry.module || entry.module_name || 'N/A';

      const envMatch = !selectedEnv || entryEnv === selectedEnv;
      const moduleMatch = !selectedModule || entryModule === selectedModule;

      return envMatch && moduleMatch;
    });
  }, [entries, selectedEnv, selectedModule]);

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <Sidebar
        environments={environments}
        modules={modules}
        selectedEnv={selectedEnv}
        selectedModule={selectedModule}
        onEnvChange={setSelectedEnv}
        onModuleChange={setSelectedModule}
        entryCount={entries.length}
        filteredCount={filteredEntries.length}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Entries Table */}
          <EntriesTable entries={filteredEntries} />
        </div>
      </main>
    </div>
  );
}

