
import { NextResponse } from 'next/server';

// Using the free hadith-api by fawazahmed0
// https://github.com/fawazahmed0/hadith-api
const API_BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

// A mapping from the URL-friendly book names to the API's file naming convention.
// Note: This only includes English translations for simplicity.
const BOOK_TO_EDITION_MAP: { [key: string]: string } = {
    bukhari: 'eng-bukhari',
    muslim: 'eng-muslim',
    abudawud: 'eng-abudawud',
    tirmidhi: 'eng-tirmidhi',
    nasai: 'eng-nasai',
    ibnmajah: 'eng-ibnmajah',
    malik: 'eng-malik',
};

async function fetchHadithByNumber(collection: string, hadithNumber: string) {
    const edition = BOOK_TO_EDITION_MAP[collection];
    if (!edition) {
        return NextResponse.json({ error: `Collection '${collection}' is not supported.` }, { status: 400 });
    }
    
    const url = `${API_BASE_URL}/${edition}/${hadithNumber}.json`;
    const response = await fetch(url);

    if (!response.ok) {
        return NextResponse.json({ error: `Hadith not found in ${collection}, number ${hadithNumber}.` }, { status: 404 });
    }
    
    const data = await response.json();

    // The API returns a single hadith object. We wrap it in an array to match the search result structure.
    // We also need to add the collection name, which is not in the single hadith response.
    const normalizedHadith = {
        ...data.hadiths[0], // The API returns { hadiths: [...] }
        collection,
    };
    
    return NextResponse.json({ hadiths: [normalizedHadith] });
}


async function fetchHadithByKeyword(collection?: string, keyword?: string) {
    // This API does not support keyword search directly.
    // The intended use is to download the whole book and search locally, which is not feasible in this serverless environment.
    // As a fallback, we will inform the user that keyword search is not supported with this API.
    return NextResponse.json({ error: "Keyword search is not supported. Please search by book and hadith number." }, { status: 400 });
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get('collection');
  const hadithNumber = searchParams.get('hadithNumber');
  const query = searchParams.get('q');


  if (collection && hadithNumber && !query) {
    return fetchHadithByNumber(collection, hadithNumber);
  }

  if (query) {
      // The new API doesn't support keyword search in the same way.
      // We will return a helpful error message to the user.
      return NextResponse.json({ error: "Keyword search is not supported with the current API. Please search by selecting a book and entering a hadith number." }, { status: 400 });
  }

  // If only a collection is provided, it's not a valid request for a specific hadith.
  if (collection && !hadithNumber && !query) {
      return NextResponse.json({ error: "Please provide a hadith number to search within the selected book." }, { status: 400 });
  }

  return NextResponse.json({ error: 'Please select a book and enter a hadith number to search.' }, { status: 400 });

}
