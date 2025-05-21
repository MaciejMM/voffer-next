import {FreightFormData, validateFreightData} from './transEuService';
import {getFreights as getTransEuFreights, updateFreight as updateTransEuFreight} from './transEuApi';

export type State = {
    errors?: {
        [K in keyof FreightFormData]?: string[];
    },
    isError?: boolean;
    isSuccess?: boolean;
    success: boolean;
    message: string;
    inputs?: Partial<FreightFormData>;
};

export const createFreight = async (formData: FormData): Promise<State> => {

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

    const validatedData = validateFreightData(rawFormData);

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

    return {
        success: true,
        isError: false,
        isSuccess: true,
        errors: {},
        message: 'Freight created successfully.',
        inputs: Object.fromEntries(formData),
    };
   
};

export const updateFreight = async (formData: FormData): Promise<State> => {
    try {
        await updateTransEuFreight(formData);
        return {
            success: true,
            isError: false,
            isSuccess: true,
            errors: {},
            message: 'Freight updated successfully.',
            inputs: Object.fromEntries(formData),
        };
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid form data') {
            const rawFormData = Object.fromEntries(formData);
            const validatedData = validateFreightData(rawFormData);
            if (!validatedData.success && validatedData.error) {
                return {
                    errors: validatedData.error.flatten().fieldErrors,
                    isError: true,
                    isSuccess: false,
                    message: 'Uzupełnij wszystkie wymagane pola',
                    success: false,
                    inputs: rawFormData
                };
            }
        }
        return {
            isError: true,
            isSuccess: false,
            message: 'Wystąpił błąd podczas aktualizacji frachtu',
            success: false,
            inputs: Object.fromEntries(formData)
        };
    }
};

export const getFreights = getTransEuFreights;
