import Contentstack from 'contentstack';

// Validate environment variables
const API_KEY = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
const DELIVERY_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;

if (!API_KEY || !DELIVERY_TOKEN) {
  console.warn(
    '⚠️  Contentstack credentials are missing. Please set NEXT_PUBLIC_CONTENTSTACK_API_KEY and NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN in your environment variables.'
  );
}

// Initialize Contentstack SDK for Delivery API
export const Stack = Contentstack.Stack(
  API_KEY || '',
  DELIVERY_TOKEN || '',
  process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'production',
  process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us'
);

// Management Token for creating/publishing entries
const MANAGEMENT_TOKEN = process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN;

// Initialize Contentstack SDK for Management API
export const ManagementStack = Contentstack.Stack(
  API_KEY || '',
  MANAGEMENT_TOKEN || '',
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

// Get API base URL based on region
function getApiBaseUrl(): string {
  const region = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION || 'us';
  const regionMap: Record<string, string> = {
    'us': 'https://api.contentstack.io',
    'eu': 'https://eu-api.contentstack.io',
    'azure-na': 'https://azure-na-api.contentstack.io',
    'azure-eu': 'https://azure-eu-api.contentstack.io',
  };
  return regionMap[region] || regionMap['us'];
}

// Helper function to create an entry
export async function createEntry(
  contentType: string,
  entryData: Record<string, any>
): Promise<{ uid: string; [key: string]: any } | null> {
  try {
    if (!API_KEY || !MANAGEMENT_TOKEN) {
      throw new Error('Contentstack Management API credentials are not configured');
    }

    const apiBaseUrl = getApiBaseUrl();
    const url = `${apiBaseUrl}/v3/content_types/${contentType}/entries`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entry: entryData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error_message || `Failed to create entry: ${response.statusText}`);
    }

    const result = await response.json();
    const entryUid = result.entry?.uid;

    if (!entryUid) {
      throw new Error('Failed to create entry: No UID returned');
    }

    console.log(`[Contentstack] Created entry ${entryUid} in content type: ${contentType}`);
    return result.entry;
  } catch (error) {
    console.error('[Contentstack] Error creating entry:', error);
    if (error instanceof Error) {
      console.error('[Contentstack] Error details:', error.message, error.stack);
    }
    throw error;
  }
}

// Helper function to publish an entry
export async function publishEntry(
  contentType: string,
  entryUid: string,
  options?: {
    environments?: string[];
    locales?: string[];
  }
): Promise<boolean> {
  try {
    if (!API_KEY || !MANAGEMENT_TOKEN) {
      throw new Error('Contentstack Management API credentials are not configured');
    }

    const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'production';
    const environments = options?.environments || [environment];
    const locales = options?.locales || ['en-us'];

    const apiBaseUrl = getApiBaseUrl();
    const url = `${apiBaseUrl}/v3/content_types/${contentType}/entries/${entryUid}/publish`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entry: {
          environments,
          locales,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error_message || `Failed to publish entry: ${response.statusText}`);
    }

    console.log(`[Contentstack] Published entry ${entryUid} to environments: ${environments.join(', ')}`);
    return true;
  } catch (error) {
    console.error('[Contentstack] Error publishing entry:', error);
    if (error instanceof Error) {
      console.error('[Contentstack] Error details:', error.message, error.stack);
    }
    throw error;
  }
}

// Helper function to create and publish an entry in one call
export async function createAndPublishEntry(
  contentType: string,
  entryData: Record<string, any>,
  publishOptions?: {
    environments?: string[];
    locales?: string[];
  }
): Promise<{ uid: string; [key: string]: any }> {
  try {
    // Step 1: Create entry
    const createdEntry = await createEntry(contentType, entryData);
    
    if (!createdEntry || !createdEntry.uid) {
      throw new Error('Failed to create entry');
    }

    // Step 2: Publish entry
    await publishEntry(contentType, createdEntry.uid, publishOptions);

    console.log(`[Contentstack] Successfully created and published entry ${createdEntry.uid}`);
    return createdEntry;
  } catch (error) {
    console.error('[Contentstack] Error creating and publishing entry:', error);
    throw error;
  }
}

// Helper function to update an entry
export async function updateEntry(
  contentType: string,
  entryUid: string,
  entryData: Record<string, any>
): Promise<{ uid: string; [key: string]: any } | null> {
  try {
    if (!API_KEY || !MANAGEMENT_TOKEN) {
      throw new Error('Contentstack Management API credentials are not configured');
    }

    const apiBaseUrl = getApiBaseUrl();
    const url = `${apiBaseUrl}/v3/content_types/${contentType}/entries/${entryUid}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entry: entryData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error_message || `Failed to update entry: ${response.statusText}`);
    }

    const result = await response.json();
    const entryUidResult = result.entry?.uid || entryUid;

    if (!entryUidResult) {
      throw new Error('Failed to update entry: No UID returned');
    }

    console.log(`[Contentstack] Updated entry ${entryUid} in content type: ${contentType}`);
    return result.entry;
  } catch (error) {
    console.error('[Contentstack] Error updating entry:', error);
    if (error instanceof Error) {
      console.error('[Contentstack] Error details:', error.message, error.stack);
    }
    throw error;
  }
}

// Helper function to unpublish an entry
export async function unpublishEntry(
  contentType: string,
  entryUid: string,
  options?: {
    environments?: string[];
    locales?: string[];
  }
): Promise<boolean> {
  try {
    if (!API_KEY || !MANAGEMENT_TOKEN) {
      throw new Error('Contentstack Management API credentials are not configured');
    }

    const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'production';
    const environments = options?.environments || [environment];
    const locales = options?.locales || ['en-us'];

    const apiBaseUrl = getApiBaseUrl();
    const url = `${apiBaseUrl}/v3/content_types/${contentType}/entries/${entryUid}/unpublish`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entry: {
          environments,
          locales,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error_message || `Failed to unpublish entry: ${response.statusText}`);
    }

    console.log(`[Contentstack] Unpublished entry ${entryUid} from environments: ${environments.join(', ')}`);
    return true;
  } catch (error) {
    console.error('[Contentstack] Error unpublishing entry:', error);
    if (error instanceof Error) {
      console.error('[Contentstack] Error details:', error.message, error.stack);
    }
    throw error;
  }
}

// Helper function to delete an entry
export async function deleteEntry(
  contentType: string,
  entryUid: string
): Promise<boolean> {
  try {
    if (!API_KEY || !MANAGEMENT_TOKEN) {
      throw new Error('Contentstack Management API credentials are not configured');
    }

    const apiBaseUrl = getApiBaseUrl();
    const url = `${apiBaseUrl}/v3/content_types/${contentType}/entries/${entryUid}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'api_key': API_KEY,
        'authorization': MANAGEMENT_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error_message || `Failed to delete entry: ${response.statusText}`);
    }

    console.log(`[Contentstack] Deleted entry ${entryUid} from content type: ${contentType}`);
    return true;
  } catch (error) {
    console.error('[Contentstack] Error deleting entry:', error);
    if (error instanceof Error) {
      console.error('[Contentstack] Error details:', error.message, error.stack);
    }
    throw error;
  }
}

