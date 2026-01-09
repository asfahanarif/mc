
import { NextResponse } from 'next/server';

// Note: The official API is at https://api.sunnah.com, but we'll use the base domain for this proxy.
const API_BASE_URL = 'https://sunnah.com/api/v1/';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get('collection');
  const hadithNumber = searchParams.get('hadithNumber');
  const query = searchParams.get('q');

  let apiUrl = '';
  let isSingleHadith = false;

  if (collection && hadithNumber && !query) {
    // Specific Hadith search by collection and number
    apiUrl = `${API_BASE_URL}collections/${collection}/hadiths/${hadithNumber}`;
    isSingleHadith = true;
  } else if (query) {
    // Keyword-based search
    const params = new URLSearchParams({ q: query, limit: "20" }); // Add a limit
    if (collection) {
      params.append('collection', collection);
    }
    apiUrl = `${API_BASE_URL}hadiths/search?${params.toString()}`;
  } else if (collection) {
    // List hadiths from a collection
    apiUrl = `${API_BASE_URL}collections/${collection}/hadiths?limit=20`;
  } else {
    return NextResponse.json({ error: 'Invalid search parameters. Please provide a collection, a keyword, or both.' }, { status: 400 });
  }

  try {
    const apiResponse = await fetch(apiUrl, {
        headers: {
            'Accept': 'application/json',
            // It's good practice to identify your app with a User-Agent
            'User-Agent': 'MuslimahsClubApp/1.0',
        },
    });

    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`API Error (${apiResponse.status}) from ${apiUrl}: ${errorText}`);
        return NextResponse.json({ error: `Hadith not found or API error. Status: ${apiResponse.status}` }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    
    // Normalize the response structure. 
    // Single hadith requests and search requests have different structures.
    if (isSingleHadith) {
        return NextResponse.json({ hadiths: [data] });
    } else if (data.data) { // Search results are under a 'data' key
        return NextResponse.json({ hadiths: data.data });
    } else {
        return NextResponse.json(data);
    }

  } catch (error) {
    console.error('Failed to fetch from Hadith API route:', error);
    return NextResponse.json({ error: 'Internal Server Error while fetching Hadith data' }, { status: 500 });
  }
}

    