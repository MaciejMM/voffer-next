import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {  validateFreightData } from './transEuService';
import { getAccessToken } from './tokenStore';
import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;


export const createFreight = async (formData: FormData) => {
    const rawFormData = {
        weight: formData.get('weight') as string,
        length: formData.get('length') as string,
        volume: formData.get('volume') as string,
        loadingCountry: formData.get('loadingCountry') as string,
        loadingPostalCode: formData.get('loadingPostalCode') as string,
        loadingPlace: formData.get('loadingPlace') as string,
        loadingStartTime: formData.get('loadingStartTime') as string,
        loadingEndTime: formData.get('loadingEndTime') as string,
        loadingDate: formData.get('loadingDate') as string,
        loadingStartDate: formData.get('loadingStartDate') as string,
        loadingEndDate: formData.get('loadingEndDate') as string,
        unloadingCountry: formData.get('unloadingCountry') as string,
        unloadingPostalCode: formData.get('unloadingPostalCode') as string,
        unloadingPlace: formData.get('unloadingPlace') as string,
        unloadingStartTime: formData.get('unloadingTime') as string,
        unloadingEndTime: formData.get('unloadingEndTime') as string,
        unloadingDate: (formData.get('unloadingDate')?.toString() ?? '') as string,
        unloadingStartDate: formData.get('unloadingStartDate') as string,
        unloadingEndDate: formData.get('unloadingEndDate') as string,
        description: formData.get('description') as string,
        selectedCategories: formData.getAll('selectedCategories') as string[],
        selectedVehicles: formData.getAll('selectedVehicles') as string[],
        isFullTruck: formData.get('isFullTruck') !== 'false',
    };

    const validatedData = validateFreightData(rawFormData);
    if (!validatedData.success) {
        throw new Error('Invalid form data');
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('trans_token_id') ?? null;
    const tokenData = await getAccessToken(token?.value ?? '');

    if (!tokenData) {
        throw new Error('No token found');
    }

    const response = await fetch(`${BASE_URL}/api/v1/freight`, {
        headers: {
            "Transeu-Access-Token": `Bearer ${tokenData}`,
            "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify(validatedData.data),
    });

    if (!response.ok) {
        throw new Error('Failed to create freight');
    }

    return response.json();
};

export const updateFreight = async (formData: FormData) => {
    const rawFormData = {
        id: formData.get('id') as string,
        weight: formData.get('weight') as string,
        length: formData.get('length') as string,
        volume: formData.get('volume') as string,
        loadingCountry: formData.get('loadingCountry') as string,
        loadingPostalCode: formData.get('loadingPostalCode') as string,
        loadingPlace: formData.get('loadingPlace') as string,
        loadingStartTime: formData.get('loadingStartTime') as string,
        loadingEndTime: formData.get('loadingEndTime') as string,
        loadingDate: formData.get('loadingDate') as string,
        loadingStartDate: formData.get('loadingStartDate') as string,
        loadingEndDate: formData.get('loadingEndDate') as string,
        unloadingCountry: formData.get('unloadingCountry') as string,
        unloadingPostalCode: formData.get('unloadingPostalCode') as string,
        unloadingPlace: formData.get('unloadingPlace') as string,
        unloadingStartTime: formData.get('unloadingStartTime') as string,
        unloadingEndTime: formData.get('unloadingEndTime') as string,
        unloadingDate: formData.get('unloadingDate') as string,
        unloadingStartDate: formData.get('unloadingStartDate') as string,
        unloadingEndDate: formData.get('unloadingEndDate') as string,
        description: formData.get('description') as string,
        selectedCategories: formData.getAll('selectedCategories') as string[],
        selectedVehicles: formData.getAll('selectedVehicles') as string[],
        isFullTruck: formData.get('isFullTruck') !== 'false',
    };

    const validatedData = validateFreightData(rawFormData);
    if (!validatedData.success) {
        throw new Error('Invalid form data');
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('trans_token_id') ?? null;
    const tokenData = await getAccessToken(token?.value ?? '');

    if (!tokenData) {
        throw new Error('No token found');
    }

    const response = await fetch(`${BASE_URL}/api/v1/freight/${rawFormData.id}`, {
        headers: {
            "Transeu-Access-Token": `Bearer ${tokenData}`,
            "Content-Type": "application/json",
        },
        method: 'PUT',
        body: JSON.stringify(validatedData.data),
    });

    if (!response.ok) {
        throw new Error('Failed to update freight');
    }

    return response.json();
};

export const getFreights = async () => {
    const {getAccessTokenRaw} = getKindeServerSession();
    const accessToken = await getAccessTokenRaw();
    const response = await fetch(`${BASE_URL}/api/v1/freight`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch freights');
    }

    return response.json();
};

interface TransEuFreightResponse {
    id: number;
    status: string;
    publication?: {
        status: string;
    };
    reference_number: string;
}

export const getTransEuFreightStatuses = async (transeuIds: string[]) => {
    if (!transeuIds.length) return [];

    const cookieStore = await cookies();
    const token = cookieStore.get('trans_token_id') ?? null;
    const apiKey = process.env.TRANS_API_KEY;
    const tokenData = await getAccessToken(token?.value ?? '');

    if (!tokenData || !apiKey) {
        console.error('Missing Trans.eu credentials');
        return [];
    }

    try {
        const response = await fetch('https://api.platform.trans.eu/ext/freights-api/v1/freights', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData}`,
                'Api-key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Trans.eu freight statuses');
        }

        const data = await response.json() as TransEuFreightResponse[];
        
        return data
            .filter((freight: TransEuFreightResponse) => 
                transeuIds.includes(freight.id.toString()))
            .map((freight: TransEuFreightResponse) => ({
                id: freight.id.toString(),
                status: freight.publication?.status === 'active' ? 'active' : freight.status,
                referenceNumber: freight.reference_number,
                publicationStatus: freight.publication?.status
            }));
    } catch (error) {
        console.error('Error fetching Trans.eu freight statuses:', error);
        return [];
    }
};
