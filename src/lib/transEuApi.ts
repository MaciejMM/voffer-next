import {  validateFreightData } from './transEuService';

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

    const token = sessionStorage.getItem('trans_access_token');
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${BASE_URL}/api/v1/freight`, {
        headers: {
            "Transeu-Access-Token": `Bearer ${token}`,
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

    const token = sessionStorage.getItem('trans_access_token');
    const response = await fetch(`${BASE_URL}/api/v1/freight/${rawFormData.id}`, {
        headers: {
            "Transeu-Access-Token": `Bearer ${token}`,
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
    const response = await fetch(`${BASE_URL}/api/v1/freight`, {
        headers: {
            "Transeu-Access-Token": `Bearer 1111`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch freights');
    }

    return response.json();
};
