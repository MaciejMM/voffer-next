import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export interface KindeUserProfile {
  given_name: string;
  family_name: string;
}

export interface KindeUserIdentity {
  type: string;
  details: {
    email?: string;
    username?: string;
  };
}

export interface KindeCreateUserRequest {
  profile: KindeUserProfile;
  identities: KindeUserIdentity[];
}

export async function getKindeToken() {
  try {
    const response = await fetch(`${process.env.KINDE_ISSUER_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        audience: `${process.env.KINDE_MANAGEMENT_AUDIENCE}`,
        grant_type: 'client_credentials',
        client_id: process.env.KINDE_MANAGEMENT_CLIENT_ID!,
        client_secret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET!
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to get token: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Kinde token:', error);
    throw error;
  }
}

export async function createKindeUser(data: KindeCreateUserRequest) {
  try {
    const token = await getKindeToken();
    
    const response = await fetch(`${process.env.KINDE_ISSUER_URL}/api/v1/user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('Error creating Kinde user:', error);
    return { success: false, error: 'Failed to create Kinde user' };
  }
}

export async function updateKindeUser(userId: string, data: Partial<KindeUserProfile>) {
  try {
    const token = await getKindeToken();
    
    const response = await fetch(`${process.env.KINDE_ISSUER_URL}/api/v1/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profile: data }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('Error updating Kinde user:', error);
    return { success: false, error: 'Failed to update Kinde user' };
  }
}

export async function deleteKindeUser(userId: string) {
  try {
    const token = await getKindeToken();
    
    const response = await fetch(`${process.env.KINDE_ISSUER_URL}/api/v1/user?id=${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting Kinde user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

export async function getKindeUser(userId: string) {
  try {
    const token = await getKindeToken();
    
    const response = await fetch(`${process.env.KINDE_ISSUER_URL}/api/v1/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    console.error('Error fetching Kinde user:', error);
    return { success: false, error: 'Failed to fetch Kinde user' };
  }
} 