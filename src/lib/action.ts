import {z} from 'zod';
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

    unloadingCountry?: string;
    unloadingPostalCode?: string;
    unloadingPlace?: string;
    selectedVehicles?: string[];
    selectedCategories?: string[] ;
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
    } ).min(1, {message: 'Wprowadź czas rozładunku'}),
    unloadingEndTime: z.string({
        invalid_type_error: 'Wprowadź czas rozładunku',
    }).min(1, {message: 'Wprowadź czas rozładunku'}),

    description: z.string({
        invalid_type_error: 'Wprowadź opis',
    }).min(1, {message: 'Wprowadź opis'}),
    selectedCategories: z.array(z.string()).min(1, { message: 'Wybierz minimum jeden rozmiar pojazdu' }),
    selectedVehicles: z.array(z.string()).min(1, { message: 'Wybierz minimum jeden typ pojazdu' }),

});

const CreateFreight = FormSchema;

export type State = {
    errors?: {
        [K in keyof FreightFormData]?: string[] ;
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

        unloadingCountry?: string | undefined;
        unloadingPostalCode?: string | undefined;
        unloadingPlace?: string | undefined;
        unloadingStartTime?: string | undefined;
        unloadingEndTime?: string | undefined;

        description?: string | undefined;
        selectedCategories?: string[] | undefined;
        selectedVehicles?: string[] | undefined;
    }
};


export async function createFreight(prevState: State, formData: FormData): Promise<State> {
    const rawFormData =  {
        weight: formData.get('weight') as string,
        length: formData.get('length') as string,
        volume: formData.get('volume') as string,
        loadingCountry: formData.get('loadingCountry') as string,
        loadingPostalCode: formData.get('loadingPostalCode') as string,
        loadingPlace: formData.get('loadingPlace') as string,
        loadingStartTime: formData.get('loadingStartTime') as string,
        loadingEndTime: formData.get('loadingEndTime') as string,
        unloadingCountry: formData.get('unloadingCountry') as string,
        unloadingPostalCode: formData.get('unloadingPostalCode') as string,
        unloadingPlace: formData.get('unloadingPlace') as string,
        unloadingStartTime: formData.get('unloadingStartTime') as string,
        unloadingEndTime: formData.get('unloadingEndTime') as string,
        description: formData.get('description') as string,
        selectedCategories: formData.getAll('selectedCategories') as string[],
        selectedVehicles: formData.getAll('selectedVehicles') as string[],
    };

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
    console.log('form submitted:', validatedData.data)

    return {
        success: true,
        isError: false,
        isSuccess: true,
        errors: {},
        message: 'Freight created successfully.',
        inputs: rawFormData,
    };
}


