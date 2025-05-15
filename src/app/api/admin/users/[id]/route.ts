import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, roles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>} 
): Promise<NextResponse> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    const userId = parseInt(id);
    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        role: true,
      },
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userRecord);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>} 
): Promise<NextResponse> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    const userId = parseInt(id);
    const body = await request.json();
    const { firstName, lastName, title, role } = body;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        firstName: firstName || existingUser.firstName,
        lastName: lastName || existingUser.lastName,
        title: title || existingUser.title,
        roleId: role ? (await db.query.roles.findFirst({
          where: eq(roles.name, role),
        }))?.id : existingUser.roleId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>} 
): Promise<NextResponse> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    const userId = parseInt(id);

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 