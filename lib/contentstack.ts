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
    const Query = Stack.ContentType(contentType).Query();
    const result = await Query.toJSON().find();
    return result[0] || [];
  } catch (error) {
    console.error('Error fetching entries:', error);
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

