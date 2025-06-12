"use client";
import {SearchResult} from "@/ui/freight/SearchLocationDialog";

export const autoCompleteCountrySearch = async (query: string, country: string): Promise<SearchResult[]> => {
    if (!query || query === "") {
        return [];
    }

    const request = {
        searchText: query,
        country: country === "" ? undefined : country,
    };

    const res = await fetch("/api/location/search", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch countries');
    }

    return await res.json();
}
