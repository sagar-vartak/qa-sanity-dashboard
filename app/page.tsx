import { getEntries } from '@/lib/contentstack';
import RefreshButton from './components/RefreshButton';
import DashboardClient from './components/DashboardClient';
import AnimatedLogo from './components/AnimatedLogo';

// Force dynamic rendering - disable all caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Default content type - you can change this to match your Contentstack content type
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_TYPE || 'entry';

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

export default async function Home() {
  const entries: Entry[] = await getEntries(CONTENT_TYPE);
  
  // Check if credentials are missing
  const hasCredentials = 
    process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY && 
    process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header - Fixed at top */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <AnimatedLogo />
              <div className="hidden sm:block text-left border-l border-slate-200 dark:border-slate-700 pl-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Sanity Reports powered by Contentstack
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                Last updated: {new Date().toLocaleString()}
              </div>
              <RefreshButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      {!hasCredentials ? (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-yellow-50 border-2 border-yellow-200 p-12 text-center shadow-lg dark:bg-yellow-900/20 dark:border-yellow-800">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-yellow-900 dark:text-yellow-200">
              Configuration Required
            </h2>
            <p className="mb-4 text-yellow-800 dark:text-yellow-300">
              Please configure your Contentstack credentials in your environment variables.
            </p>
            <div className="mt-6 rounded-lg bg-white dark:bg-slate-800 p-4 text-left text-sm">
              <p className="mb-2 font-semibold text-slate-900 dark:text-white">Required variables:</p>
              <ul className="list-inside list-disc space-y-1 text-slate-600 dark:text-slate-300">
                <li><code className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-700">NEXT_PUBLIC_CONTENTSTACK_API_KEY</code></li>
                <li><code className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-700">NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN</code></li>
                <li><code className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-700">NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT</code> (optional, defaults to 'production')</li>
                <li><code className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-700">NEXT_PUBLIC_CONTENTSTACK_REGION</code> (optional, defaults to 'us')</li>
                <li><code className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-700">NEXT_PUBLIC_CONTENTSTACK_CONTENT_TYPE</code> (optional, defaults to 'entry')</li>
              </ul>
            </div>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white p-12 text-center shadow-lg dark:bg-slate-800">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-white">
              No entries found
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Please check your Contentstack configuration and ensure you have entries in your content type: <code className="rounded bg-slate-100 px-2 py-1 dark:bg-slate-700">{CONTENT_TYPE}</code>
            </p>
          </div>
        </div>
      ) : (
        <DashboardClient entries={entries} />
      )}
    </div>
  );
}
