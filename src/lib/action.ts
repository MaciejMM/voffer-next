'use server';
import {z} from 'zod';
import { cookies } from 'next/headers';
import { getAccessToken } from './tokenStore';
import { mapFreightFormToTransEuRequest } from './mappers/freightMapper';
import { createFreight } from "@/lib/actions/freight";

export interface FreightFormData {
    weight: string;
    length: string;
    volume: string;
    loadingCountry: string;
    loadingPostalCode: string;
    loadingPlace: string;
    loadingStartTime: string;
    loadingEndTime: string;
    loadingDate: string;
    loadingStartDate: string;
    loadingEndDate: string;
    unloadingCountry: string;
    unloadingPostalCode: string;
    unloadingPlace: string;
    unloadingStartTime: string;
    unloadingEndTime: string;
    unloadingDate: string;
    unloadingStartDate: string;
    unloadingEndDate: string;
    description: string;
    selectedCategories: string[];
    selectedVehicles: string[];
    isFullTruck: boolean;
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
    }).min(1, 'Wprowadź datę zakończenia rozładunku'),
    description: z.string({
        invalid_type_error: 'Wprowadź opis',
    }).min(1, {message: 'Wprowadź opis'}),
    selectedCategories: z.array(z.string()).min(1, {message: 'Wybierz minimum jedną kategorię'}),
    selectedVehicles: z.array(z.string()).min(1, {message: 'Wybierz minimum jeden typ pojazdu'}).max(5, {message: 'Wybierz maksymalnie 5 typów pojazdów'}),
    isFullTruck: z.boolean(),
});

const CreateFreight = FormSchema;

export interface State {
    success: boolean;
    isError: boolean;
    isSuccess: boolean;
    message: string;
    inputs: Partial<FreightFormData>;
     errors?: {
        [K in keyof FreightFormData]?: string[];
    };
}

export async function createFreightAction(prevState: State, formData: FormData): Promise<State> {
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
        unloadingStartTime: formData.get('unloadingStartTime') as string,
        unloadingEndTime: formData.get('unloadingEndTime') as string,
        unloadingDate: (formData.get('unloadingDate')?.toString() ?? '') as string,
        unloadingStartDate: formData.get('unloadingStartDate') as string,
        unloadingEndDate: formData.get('unloadingEndDate') as string,
        description: formData.get('description') as string,
        selectedCategories: formData.getAll('selectedCategories') as string[],
        selectedVehicles: formData.getAll('selectedVehicles') as string[],
        isFullTruck: formData.get('isFullTruck') !== 'false',
    };
    console.log(rawFormData);
    // Get new access token
    const cookieStore = await cookies();
    const oldTokenId = cookieStore.get('trans_token_id');

    if (!oldTokenId) {
        return {
            success: false,
            isError: true,
            isSuccess: false,
            message: 'Failed to refresh access token',
            inputs: rawFormData,
            errors: {},
        };
    }
    const tokenData = await getAccessToken(oldTokenId.value);

    if (!tokenData) {
        return {
            isError: true,
            isSuccess: false,
            message: 'Brak tokenu dostępu do Trans.eu',
            success: false,
            inputs: rawFormData,
            errors: {},
        };
    }

    const validatedData = CreateFreight.safeParse(rawFormData);
    if (!validatedData.success) {
        return {
            isError: true,
            isSuccess: false,
            message: 'Uzupełnij wszystkie wymagane pola',
            success: false,
            inputs: rawFormData,
            errors: validatedData.error.flatten().fieldErrors
        };
    }

    const transEuRequest = mapFreightFormToTransEuRequest(rawFormData);
    console.log(transEuRequest.requirements.vehicle_size);
    console.log(transEuRequest.requirements);

    const transEuResponse = await fetch('https://api.platform.trans.eu/ext/freights-api/v1/freight-exchange', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${tokenData}`,
            'Api-key': process.env.TRANS_API_KEY || '',
        },
        body: JSON.stringify(transEuRequest)
    });

    if (!transEuResponse.ok) {
        const errorData = await transEuResponse.json();
        console.log(errorData);

        let errorMessage = 'Wystąpił błąd podczas tworzenia frachtu w Trans.eu';

        if (errorData.validation_messages) {
            // Extract validation messages
            const validationMessages = Object.entries(errorData.validation_messages)
                .map(([key, value]: [string, any]) => {
                    if (typeof value === 'object' && value.validation_error) {
                        return value.validation_error;
                    }
                    return `${key}: ${JSON.stringify(value)}`;
                })
                .join(', ');

            if (validationMessages) {
                errorMessage = `Błąd walidacji: ${validationMessages}`;
            }
        }

        return {
            isError: true,
            isSuccess: false,
            message: errorMessage,
            success: false,
            inputs: rawFormData,
            errors: {},
        };
    }

    const data = await transEuResponse.json();
    console.log(data);

    // Store the freight data in the database
    try {
        await createFreight(rawFormData, data);
    } catch (error) {
        console.error('Error storing freight in database:', error);
        return {
            success: false,
            isError: true,
            isSuccess: false,
            message: 'Oferta została utworzona w Trans.eu, ale wystąpił błąd podczas zapisywania w bazie danych.',
            inputs: rawFormData,
            errors: {},
        };
    }

    return {
        success: true,
        isError: false,
        isSuccess: true,
        message: 'Oferta została utworzona pomyślnie.',
        inputs: rawFormData,
        errors: {},
    };
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
    const cookieStore = await cookies();
    const oldTokenId = cookieStore.get('trans_token_id');

    if (!oldTokenId) {
        return {
            success: false,
            isError: true,
            isSuccess: false,
            message: 'Failed to refresh access token',
            inputs: rawFormData,
            errors: {},
        };
    }
    const tokenData = await getAccessToken(oldTokenId.value);


    if (!tokenData) {
        return {
            isError: true,
            isSuccess: false,
            message: 'Brak tokenu dostępu do Trans.eu',
            success: false,
            inputs: rawFormData,
            errors: {},
        };
    }

    const validatedData = CreateFreight.safeParse(rawFormData);
    if (!validatedData.success) {
        return {
            isError: true,
            isSuccess: false,
            message: 'Uzupełnij wszystkie wymagane pola' + JSON.stringify(validatedData.error.flatten().fieldErrors),
            success: false,
            inputs: rawFormData,
            errors: Object.fromEntries(
                Object.entries(validatedData.error.flatten().fieldErrors)
                    .map(([key, value]) => [key, value[0]])
            ),
        };
    }


    const transEuRequest = mapFreightFormToTransEuRequest(rawFormData);
    console.log(transEuRequest);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/freight/${rawFormData.id}`,
        {
            headers: {
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
            inputs: rawFormData,
            errors: {},
        };
    }

    return {
        success: true,
        isError: false,
        isSuccess: true,
        message: 'Oferta została zaktualizowana pomyślnie.',
        inputs: {},
        errors: {},
    };
}

