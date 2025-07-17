'use server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAccessToken } from '@/lib/tokenStore';
import { updateFreightUpdatedAt } from '@/lib/actions/freight';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const freightId = (await params).id;

  try {
    const cookieStore = await cookies();
    const oldTokenId = cookieStore.get('trans_token_id');
    const tokenData = await getAccessToken(oldTokenId?.value ?? '');
    const apiKey = process.env.TRANS_API_KEY || '';

    const response = await fetch(`https://api.platform.trans.eu/ext/freights-api/v1/freights/${freightId}/refresh_publication`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${tokenData}`,
        'Api-key': apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message || error.detail || 'Unknown error' }, { status: response.status });
    }

    await updateFreightUpdatedAt(freightId);
    return NextResponse.json({
      success: true,
      message: "Fracht został zaktualizowany."
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
} 