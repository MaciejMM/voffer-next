import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteAccessToken } from '@/lib/tokenStore';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  
  // Get the token ID from cookies to delete it from Redis
  const tokenId = cookieStore.get('trans_token_id');
  if (tokenId) {
    await deleteAccessToken(tokenId.value);
  }

  // Clear Trans.eu related cookies
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.delete('trans_token_id');
  response.cookies.delete('trans_refresh_token');
  
  return response;
} 