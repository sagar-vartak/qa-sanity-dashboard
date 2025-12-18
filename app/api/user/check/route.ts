import { NextRequest, NextResponse } from 'next/server';
import { getEntries } from '@/lib/contentstack';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Fetch all users from Contentstack
    const users = await getEntries('users');
    
    // Check if user with this email exists (case-insensitive)
    const existingUser = users.find(
      (user: any) => user.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return NextResponse.json({
        exists: true,
        user: {
          username: existingUser.title || existingUser.username,
          email: existingUser.email,
        },
      });
    }

    return NextResponse.json({
      exists: false,
    });
  } catch (error) {
    console.error('[API] Error checking user:', error);
    return NextResponse.json(
      {
        error: 'Failed to check user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

