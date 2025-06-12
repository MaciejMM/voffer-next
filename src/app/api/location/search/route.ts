import { NextRequest, NextResponse } from 'next/server';

// CityInfo model
interface CityInfo {
  city: string;
  postalCode: string;
  countryCode: string;
  displayName: string;
  name: string;
}

// LocationRequest model
interface LocationRequest {
  searchText: string;
  country?: string;
}

// OpenStreetMap API response types
interface OpenStreetMapResponse {
  display_name: string;
  name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    administrative?: string;
    county?: string;
    province?: string;
    municipality?: string;
    postcode?: string;
    country_code?: string;
  };
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

function getCity(address: OpenStreetMapResponse['address']): string {
  return (
    address.city ||
    address.town ||
    address.village ||
    address.administrative ||
    address.county ||
    address.province ||
    address.municipality ||
    ''
  );
}

export async function POST(req: NextRequest) {
  let body: LocationRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.searchText) {
    return NextResponse.json({ error: 'searchText is required' }, { status: 400 });
  }

  // Build query params
  const params = new URLSearchParams({
    q: body.searchText,
    format: 'json',
    'addressdetails': '1',
    'accept-language': 'en',
  });
  if (body.country) {
    params.append('countrycodes', body.country.toUpperCase());
  }

  // Fetch from OpenStreetMap
  const res = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
    headers: {
      'User-Agent': 'YourAppName/1.0',
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch from OpenStreetMap' }, { status: 502 });
  }

  const osmData: OpenStreetMapResponse[] = await res.json();

  // Map to CityInfo
  const cityInfos: CityInfo[] = (osmData || []).map((info) => ({
    city: getCity(info.address),
    postalCode: info.address.postcode || '',
    countryCode: (info.address.country_code || '').toUpperCase(),
    displayName: info.display_name,
    name: info.name || '',
  }));

  return NextResponse.json(cityInfos);
} 