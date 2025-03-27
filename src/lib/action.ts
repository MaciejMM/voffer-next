import {z} from 'zod';
export interface FreightFormData {
    weight?: string;
    length?: string;
    volume?: string;
    description?: string;
    loadingCountry?: string;
    loadingPostalCode?: string;
    loadingPlace?: string;
    loadingStartDate?: string;
    loadingEndDate?: string;
    loadingStartTime?: string;
    loadingEndTime?: string;
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
    // loadingCountry: z.string({
    //     invalid_type_error: 'Wprowadź kraj załadunku',
    // }),
    // loadingPostalCode: z.string({
    //     invalid_type_error: 'Wprowadź kod pocztowy załadunku',
    // }),
    // loadingPlace: z.string({
    //     invalid_type_error: 'Wprowadź miejsce załadunku',
    // }),
    // unloadingCountry: z.string({
    //     invalid_type_error: 'Wprowadź kraj rozładunku',
    // }),
    // unloadingPostalCode: z.string({
    //     invalid_type_error: 'Wprowadź kod pocztowy rozładunku',
    // }),
    // unloadingPlace: z.string({
    //     invalid_type_error: 'Wprowadź miejsce rozładunku',
    // }),
    description: z.string({
        invalid_type_error: 'Wprowadź opis',
    }).min(1, {message: 'Wprowadź opis'}),

});

const CreateFreight = FormSchema;

export type State = {
    errors?: {
        [K in keyof FreightFormData]?: string[];
    },
    success: boolean;
    message: string;
    inputs?: {
        [key: string]: string | undefined;
        weight?: string;
        length?: string;
        volume?: string;
        description?: string;
        loadingPostalCode?: string;
    }
};


export async function createFreight(prevState: State, formData: FormData): Promise<State> {
    const rawFormData =  {
        weight: formData.get('weight') as string,
        length: formData.get('length') as string,
        volume: formData.get('volume') as string,
        // loadingCountry: formData.get('loadingCountry'),
        // loadingPostalCode: formData.get('loadingPostalCode'),
        // loadingPlace: formData.get('loadingPlace'),
        // unloadingCountry: formData.get('unloadingCountry'),
        // unloadingPostalCode: formData.get('unloadingPostalCode'),
        // unloadingPlace: formData.get('unloadingPlace'),
        description: formData.get('description') as string,
    };

    const validatedData = CreateFreight.safeParse(rawFormData);

    if (!validatedData.success) {
        return {
            errors: validatedData.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Freight.',
            success: false,
            inputs: rawFormData
        };
    }
    console.log('form submitted:', validatedData.data)

    return {
        success: true,
        errors: {},
        message: 'Freight created successfully.',
        inputs: rawFormData
    };
}


