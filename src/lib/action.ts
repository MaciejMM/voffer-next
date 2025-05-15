'use server';

import {z} from 'zod';
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { cookies } from 'next/headers';

export interface FreightFormData {
    weight?: string;
    length?: string;
    volume?: string;
    description?: string;
    loadingCountry?: string;
    loadingPostalCode?: string;
    loadingPlace?: string;
    loadingStartTime?: string;
    loadingEndTime?: string;
    loadingDate?: string;
    loadingStartDate?: string;
    loadingEndDate?: string;
    unloadingCountry?: string;
    unloadingPostalCode?: string;
    unloadingPlace?: string;
    unloadingStartTime?: string;
    unloadingEndTime?: string;
    unloadingDate?: string;
    unloadingStartDate?: string;
    unloadingEndDate?: string;
    selectedVehicles?: string[];
    selectedCategories?: string[];
}

const FormSchema = z.object({
    weight: z.string({
        invalid_type_error: 'Wprowadź wagę',
    }).min(1, {message: 'Wprowadź wagę'}),
    length: z.string({
        invalid_type_error: 'Wprowadź długość',
    }).min(1, {message: 'Wprowadź długość'}),
    volume: z.string({
        invalid_type_error: 'Wprowadź wolumen',
    }).min(1, {message: 'Wprowadź wolumen'}),

    loadingCountry: z.string({
        invalid_type_error: 'Wprowadź kraj załadunku',
    }).min(1, {message: 'Wprowadź kraj załadunku'}),
    loadingPostalCode: z.string({
        invalid_type_error: 'Wprowadź kod pocztowy załadunku',
    }).min(1, {message: 'Wprowadź kod pocztowy załadunku'}),
    loadingPlace: z.string({
        invalid_type_error: 'Wprowadź miejsce załadunku',
    }).min(1, {message: 'Wprowadź miejsce załadunku'}),
    loadingStartTime: z.string({
        invalid_type_error: 'Wprowadź czas załadunku',
    }).min(1, {message: 'Wprowadź czas załadunku'}),
    loadingEndTime: z.string({
        invalid_type_error: 'Wprowadź czas rozładunku',
    }).min(1, {message: 'Wprowadź czas rozładunku'}),
    loadingDate: z.string({
        invalid_type_error: 'Wprowadź datę załadunku',
    }).min(1, {message: 'Wprowadź datę załadunku'}),
    loadingStartDate: z.string({
        invalid_type_error: 'Wprowadź datę rozpoczęcia załadunku',
    }).min(1, {message: 'Wprowadź datę rozpoczęcia załadunku'}),
    loadingEndDate: z.string({
        required_error: 'Wprowadź datę zakończenia załadunku',
        invalid_type_error: 'Wprowadź datę zakończenia załadunku',
    }).min(1, 'Wprowadź datę zakończenia załadunku')
        .refine((val) => val !== 'undefined', {
            message: 'Wprowadź datę zakończenia załadunku',
        }),
    unloadingCountry: z.string({
        invalid_type_error: 'Wprowadź kraj rozładunku',
    }).min(1, {message: 'Wprowadź kraj rozładunku'}),
    unloadingPostalCode: z.string({
        invalid_type_error: 'Wprowadź kod pocztowy rozładunku',
    }).min(1, {message: 'Wprowadź kod pocztowy rozładunku'}),
    unloadingPlace: z.string({
        invalid_type_error: 'Wprowadź miejsce rozładunku',
    }).min(1, {message: 'Wprowadź miejsce rozładunku'}),
    unloadingStartTime: z.string({
        invalid_type_error: 'Wprowadź czas rozładunku',
    }).min(1, {message: 'Wprowadź czas rozładunku'}),
    unloadingEndTime: z.string({
        invalid_type_error: 'Wprowadź czas rozładunku',
    }).min(1, {message: 'Wprowadź czas rozładunku'}),
    unloadingDate: z.string({
        invalid_type_error: 'Wprowadź datę rozładunku',
    }).min(1, {message: 'Wprowadź datę rozładunku'}),
    unloadingStartDate: z.string({
        invalid_type_error: 'Wprowadź datę rozpoczęcia rozładunku',
    }).min(1, {message: 'Wprowadź datę rozpoczęcia rozładunku'}),
    unloadingEndDate: z.string({
        required_error: 'Wprowadź datę zakończenia rozładunku',
        invalid_type_error: 'Wprowadź datę zakończenia rozładunku',
    }).min(1, 'Wprowadź datę zakończenia rozładunku')
    .min(1, 'Wprowadź datę zakończenia rozładunku')
        .refine((val) => val !== 'undefined', {
            message: 'Wprowadź datę zakończenia rozładunku',
        }),
    description: z.string({
        invalid_type_error: 'Wprowadź opis',
    }).min(1, {message: 'Wprowadź opis'}),
    selectedCategories: z.array(z.string()).min(1, {message: 'Wybierz minimum jeden rozmiar pojazdu'}),
    selectedVehicles: z.array(z.string()).min(1, {message: 'Wybierz minimum jeden typ pojazdu'}),
    isFullTruck: z.boolean(),

});

const CreateFreight = FormSchema;

export type State = {
    errors?: {
        [K in keyof FreightFormData]?: string[];
    },
    isError?: boolean;
    isSuccess?: boolean;
    success: boolean;
    message: string;
    inputs?: {
        // [key: string]: string | string[] | undefined;
        weight?: string | undefined;
        length?: string | undefined;
        volume?: string | undefined;
        loadingCountry?: string | undefined;
        loadingPostalCode?: string | undefined;
        loadingPlace?: string | undefined;
        loadingStartTime?: string | undefined;
        loadingEndTime?: string | undefined;
        loadingDate?: string | undefined;
        loadingStartDate?: string | undefined;
        loadingEndDate?: string | undefined;
        unloadingCountry?: string | undefined;
        unloadingPostalCode?: string | undefined;
        unloadingPlace?: string | undefined;
        unloadingStartTime?: string | undefined;
        unloadingEndTime?: string | undefined;
        unloadingDate?: string | undefined;
        unloadingStartDate?: string | undefined;
        unloadingEndDate?: string | undefined;
        description?: string | undefined;
        selectedCategories?: string[] | undefined;
        selectedVehicles?: string[] | undefined;
        isFullTruck?: boolean | undefined;
    }
};

async function refreshAccessTokenFromApi() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trans/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

export async function createFreight(prevState: State, formData: FormData): Promise<State> {
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
        unloadingEndDate: formData.get('unloadingEndDate')  as string,
        description: formData.get('description') as string,
        selectedCategories: formData.getAll('selectedCategories') as string[],
        selectedVehicles: formData.getAll('selectedVehicles') as string[],
        isFullTruck: formData.get('isFullTruck') !== 'false',
    };

    // Get new access token using our new API route
    const tokenResponse = await fetch('/api/trans/auth', {
        method: 'PUT',
        credentials: 'include',
    });

    if (!tokenResponse.ok) {
        return {
            success: false,
            isError: true,
            isSuccess: false,
            errors: {},
            message: 'Failed to refresh access token',
            inputs: rawFormData,
        };
    }

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
        return {
            success: false,
            isError: true,
            isSuccess: false,
            errors: {},
            message: 'Failed to get access token',
            inputs: rawFormData,
        };
    }

    const validatedData = CreateFreight.safeParse(rawFormData);
    if (!validatedData.success) {
        return {
            errors: validatedData.error.flatten().fieldErrors,
            isError: true,
            isSuccess: false,
            message: 'Uzupełnij wszystkie wymagane pola',
            success: false,
            inputs: rawFormData
        };
    }

    const {getAccessTokenRaw} = getKindeServerSession();
    const kindeAccessToken = await getAccessTokenRaw();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/freight`,
        {
            headers: {
                "Authorization": `Bearer ${kindeAccessToken}`,
                "Transeu-Access-Token": `Bearer ${tokenData.access_token}`,
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify(validatedData.data),
        });

    if (!res.ok) {
        return {
            isError: true,
            isSuccess: false,
            message: 'Wystąpił błąd podczas tworzenia frachtu',
            success: false,
            inputs: rawFormData
        };
    }

    return {
        success: true,
        isError: false,
        isSuccess: true,
        errors: {},
        message: 'Freight created successfully.',
        inputs: rawFormData,
    };
}

export async function getFreights() {

    const {getAccessTokenRaw} = getKindeServerSession();
    const accessToken = await getAccessTokenRaw();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/freight`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            method: 'GET',
        });

    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }

    return await res.json();
}

export async function updateFreight(prevState: State, formData: FormData): Promise<State> {
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

    // Get new access token
    const tokenData = await refreshAccessTokenFromApi();
    if (!tokenData) {
        return {
            success: false,
            isError: true,
            isSuccess: false,
            errors: {},
            message: 'Failed to refresh access token',
            inputs: rawFormData,
        };
    }

    const validatedData = CreateFreight.safeParse(rawFormData);
    if (!validatedData.success) {
        return {
            errors: validatedData.error.flatten().fieldErrors,
            isError: true,
            isSuccess: false,
            message: 'Uzupełnij wszystkie wymagane pola',
            success: false,
            inputs: rawFormData
        };
    }

    const {getAccessTokenRaw} = getKindeServerSession();
    const kindeAccessToken = await getAccessTokenRaw();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/freight/${rawFormData.id}`,
        {
            headers: {
                "Authorization": `Bearer ${kindeAccessToken}`,
                "Transeu-Access-Token": `Bearer ${tokenData.accessToken}`,
                "Content-Type": "application/json",
            },
            method: 'PUT',
            body: JSON.stringify(validatedData.data),
        });

    if (!res.ok) {
        return {
            isError: true,
            isSuccess: false,
            message: 'Wystąpił błąd podczas aktualizacji frachtu',
            success: false,
            inputs: rawFormData
        };
    }

    return {
        success: true,
        isError: false,
        isSuccess: true,
        errors: {},
        message: 'Freight updated successfully.',
        inputs: rawFormData,
    };
}

