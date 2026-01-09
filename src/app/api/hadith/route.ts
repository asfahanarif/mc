
import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://sunnah.com/api/v1/';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get('collection');
  const hadithNumber = searchParams.get('hadithNumber');
  const query = searchParams.get('q');

  let apiUrl = '';
  let isSingleHadith = false;

  if (collection && hadithNumber) {
    apiUrl = `${API_BASE_URL}collections/${collection}/hadiths/${hadithNumber}`;
    isSingleHadith = true;
  } else if (query) {
    const params = new URLSearchParams({ q: query });
    if (collection) {
      params.append('collection', collection);
    }
    apiUrl = `${API_BASE_URL}hadiths?${params.toString()}`;
  } else if (collection) {
    apiUrl = `${API_BASE_URL}collections/${collection}/hadiths?limit=20`;
  } else {
    return NextResponse.json({ error: 'Invalid search parameters' }, { status: 400 });
  }

  try {
    const apiResponse = await fetch(apiUrl, {
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`API Error (${apiResponse.status}): ${errorText}`);
        return NextResponse.json({ error: `Hadith not found or API error. Status: ${apiResponse.status}` }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    
    // The API returns a single object for a specific hadith, but an object with a 'hadiths' array for searches.
    // We'll normalize this to always return the structure expected by the frontend.
    if (isSingleHadith) {
        return NextResponse.json({ hadiths: [data] });
    } else {
        return NextResponse.json(data);
    }

  } catch (error) {
    console.error('Failed to fetch from Hadith API:', error);
    return NextResponse.json({ error: 'Internal Server Error while fetching Hadith data' }, { status: 500 });
  }
}

    