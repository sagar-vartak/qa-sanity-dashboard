import Link from 'next/link';
import { getEntry } from '@/lib/contentstack';
import { notFound } from 'next/navigation';

// Default content type - you can change this to match your Contentstack content type
const CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENTSTACK_CONTENT_TYPE || 'entry';

interface Entry {
  uid: string;
  title?: string;
  name?: string;
  description?: string;
  [key: string]: any;
}

interface PageProps {
  params: Promise<{
    uid: string;
  }>;
}

export default async function EntryDetailPage({ params }: PageProps) {
  const { uid } = await params;
  const entry: Entry | null = await getEntry(CONTENT_TYPE, uid);

  if (!entry) {
    notFound();
  }

  const title = entry.title || entry.name || entry.uid || 'Untitled Entry';
  const description = entry.description || entry.summary || '';

  // Get all fields except common ones for display
  const excludedFields = ['uid', 'title', 'name', 'description', 'summary', '_version', 'created_at', 'updated_at', 'created_by', 'updated_by', 'ACL', 'publish_details'];
  const additionalFields = Object.keys(entry)
    .filter((key) => !excludedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = entry[key];
      return obj;
    }, {} as Record<string, any>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>

        {/* Entry Detail Card */}
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-800">
            {/* Header */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 dark:border-slate-700 dark:from-blue-900/20 dark:to-indigo-900/20">
              <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Entry UID */}
              <div className="mb-8 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Entry UID
                </div>
                <div className="font-mono text-sm text-slate-900 dark:text-white">
                  {entry.uid}
                </div>
              </div>

              {/* Additional Fields */}
              {Object.keys(additionalFields).length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    Additional Information
                  </h2>
                  {Object.entries(additionalFields).map(([key, value]) => (
                    <div
                      key={key}
                      className="border-b border-slate-200 pb-4 last:border-0 dark:border-slate-700"
                    >
                      <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                      <div className="text-slate-900 dark:text-white">
                        {renderFieldValue(value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Metadata */}
              {(entry.created_at || entry.updated_at) && (
                <div className="mt-8 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Metadata
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {entry.created_at && (
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Created At</div>
                        <div className="text-sm text-slate-900 dark:text-white">
                          {new Date(entry.created_at).toLocaleString()}
                        </div>
                      </div>
                    )}
                    {entry.updated_at && (
                      <div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Updated At</div>
                        <div className="text-sm text-slate-900 dark:text-white">
                          {new Date(entry.updated_at).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to render field values
function renderFieldValue(value: any): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-slate-400 italic">Not set</span>;
  }

  if (typeof value === 'boolean') {
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        value ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        {value ? 'Yes' : 'No'}
      </span>
    );
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-slate-400 italic">Empty array</span>;
      }
      return (
        <ul className="list-inside list-disc space-y-1">
          {value.map((item, index) => (
            <li key={index} className="text-slate-700 dark:text-slate-300">
              {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Handle nested objects
    return (
      <pre className="overflow-x-auto rounded bg-slate-100 p-3 text-xs dark:bg-slate-900">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  if (typeof value === 'string' && value.startsWith('http')) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline dark:text-blue-400"
      >
        {value}
      </a>
    );
  }

  return <span>{String(value)}</span>;
}

