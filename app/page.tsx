import Link from 'next/link';
import { getEntries } from '@/lib/contentstack';
import RefreshButton from './components/RefreshButton';

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
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white sm:text-6xl">
              Sanity Dashboard
            </h1>
            <RefreshButton />
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Content powered by Contentstack
          </p>
          <div className="mt-4 flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <div>
              Showing {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </div>
            <div className="text-xs">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </header>

        {/* Entries Table */}
        {!hasCredentials ? (
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
        ) : entries.length === 0 ? (
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
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Env
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Total
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Passed
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Failed
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      HTML Report
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {entries.map((entry) => {
                    const name = entry.name || entry.title || entry.uid || 'Untitled';
                    const date = entry.date 
                      ? new Date(entry.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : entry.created_at 
                        ? new Date(entry.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A';
                    const env = entry.env || entry.environment || 'N/A';
                    const total = entry.total ?? 'N/A';
                    const passed = entry.passed ?? 'N/A';
                    const failed = entry.failed ?? 'N/A';
                    // Extract HTML report URL - handle both object with url property and direct string
                    const htmlReportFirstItem = entry.html_report?.[0];
                    const htmlReportUrl = 
                      (typeof htmlReportFirstItem === 'object' && htmlReportFirstItem?.url) 
                        ? htmlReportFirstItem.url 
                        : (typeof htmlReportFirstItem === 'string' 
                            ? htmlReportFirstItem 
                            : null);

                    return (
                      <tr
                        key={entry.uid}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/entry/${entry.uid}`}
                            className="font-medium text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
                          >
                            {name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                          {date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {env}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-slate-900 dark:text-white">
                          {total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {passed}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            {failed}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {htmlReportUrl ? (
                            <a
                              href={htmlReportUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                              <svg
                                className="mr-1.5 h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                              View Report
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Link
                            href={`/entry/${entry.uid}`}
                            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
