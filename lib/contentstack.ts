import Contentstack from 'contentstack';

// Validate environment variables
const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;

if (!API_KEY || !DELIVERY_TOKEN) {
  console.warn(
    '⚠️  Contentstack credentials are missing. Please set NEXT_PUBLIC_CONTENTSTACK_API_KEY and NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN in your environment variables.'
  );
}

// Initialize Contentstack SDK
export const Stack = Contentstack.Stack(
  API_KEY || '',
  DELIVERY_TOKEN || '',
  process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'production',
  process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us'
);

// Helper function to fetch all entries of a content type
export async function getEntries(contentType: string) {
  try {
    const allEntries: any[] = [];
    let skip = 0;
    const limit = 100; // Contentstack API limit per request
    let hasMore = true;
    let iteration = 0;
    const maxIterations = 100; // Safety limit to prevent infinite loops

    while (hasMore && iteration < maxIterations) {
      iteration++;
      const Query = Stack.ContentType(contentType).Query();
      Query.skip(skip).limit(limit);
      
      const result = await Query.toJSON().find();
      
      // Handle different response structures
      let entries: any[] = [];
      if (Array.isArray(result)) {
        entries = result[0] || [];
      } else if (result && Array.isArray(result.entries)) {
        entries = result.entries;
      } else if (result && Array.isArray(result.items)) {
        entries = result.items;
      } else if (result && typeof result === 'object') {
        // Try to find entries array in result
        const possibleKeys = ['entries', 'items', 'data', 'results'];
        for (const key of possibleKeys) {
          if (Array.isArray(result[key])) {
            entries = result[key];
            break;
          }
        }
      }
      
      if (entries.length === 0) {
        hasMore = false;
      } else {
        allEntries.push(...entries);
        skip += limit;
        
        // If we got fewer entries than the limit, we've reached the end
        if (entries.length < limit) {
          hasMore = false;
        }
      }
    }

    console.log(`[Contentstack] Fetched ${allEntries.length} entries from content type: ${contentType} (${iteration} iteration(s))`);
    return allEntries;
  } catch (error) {
    console.error('[Contentstack] Error fetching entries:', error);
    if (error instanceof Error) {
      console.error('[Contentstack] Error details:', error.message, error.stack);
    }
    return [];
  }
}

// Helper function to fetch a single entry by UID
export async function getEntry(contentType: string, uid: string) {
  try {
    const entry = await Stack.ContentType(contentType).Entry(uid).toJSON().fetch();
    return entry;
  } catch (error) {
    console.error('Error fetching entry:', error);
    return null;
  }
}

// Helper function to fetch entries with query parameters
export async function getEntriesWithQuery(
  contentType: string,
  queryParams?: {
    skip?: number;
    limit?: number;
    query?: any;
  }
) {
  try {
    const Query = Stack.ContentType(contentType).Query();
    
    if (queryParams?.skip) {
      Query.skip(queryParams.skip);
    }
    if (queryParams?.limit) {
      Query.limit(queryParams.limit);
    }
    if (queryParams?.query) {
      Object.keys(queryParams.query).forEach((key) => {
        Query.where(key, queryParams.query[key]);
      });
    }
    
    const result = await Query.toJSON().find();
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching entries with query:', error);
    return [];
  }
}

