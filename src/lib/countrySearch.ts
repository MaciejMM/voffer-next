"use client";
import {SearchResult} from "@/ui/freight/SearchLocationDialog";

export const autoCompleteCountrySearch = async (query: string, tokenRaw: string, country: string): Promise<SearchResult[]> => {

    if (!query || query === "") {
        return [];
    }

    const request = {
        searchText: query,
        country: country === "" ? null : country,
    }


    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/location/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenRaw}`,
        },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch countries');
    }

    return await res.json();
}
