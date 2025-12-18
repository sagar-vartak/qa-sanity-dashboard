import { NextRequest, NextResponse } from 'next/server';
import { createAndPublishEntry } from '@/lib/contentstack';

// Content type for user data - using 'users' as specified
const USER_CONTENT_TYPE = 'users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email } = body;

    if (!username || !email) {
      return NextResponse.json(
        { error: 'Username and email are required' },
        { status: 400 }
      );
    }

    // Prepare entry data with username as title and email
    const entryData = {
      title: username, // Username is used as title
      email: email,
    };

    // Create and publish entry using the helper function
    const result = await createAndPublishEntry(USER_CONTENT_TYPE, entryData);

    if (!result || !result.uid) {
      throw new Error('Failed to create and publish entry: No UID returned');
    }

    return NextResponse.json({
      success: true,
      entryUid: result.uid,
      message: 'User information saved and published successfully',
    });
  } catch (error) {
    console.error('[API] Error creating/publishing user entry:', error);
    return NextResponse.json(
      {
        error: 'Failed to save user information',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

