import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, roles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// Get all users
export async function GET(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const allUsers = await db.query.users.findMany({
      with: {
        role: true,
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create new user
export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, title, role } = body;

    // Validate required fields
    if (!firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get role ID
    const roleRecord = await db.query.roles.findFirst({
      where: eq(roles.name, role),
    });

    if (!roleRecord) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        title: title || null,
        roleId: roleRecord.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 