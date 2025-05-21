import {z} from 'zod';

const FormSchema = z.object({
    weight: z.string({
        invalid_type_error: 'Wprowadź wagę',
    }).min(1, {message: 'Wprowadź wagę'}),
    length: z.string({
        invalid_type_error: 'Wprowadź długość',
    }).min(1, {message: 'Wprowadź długość'}),
    volume: z.string({
        invalid_type_error: 'Wprowadź objętość',
    }).min(1, {message: 'Wprowadź objętość'}),
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
        invalid_type_error: 'Wprowadź czas załadunku',
    }).min(1, {message: 'Wprowadź czas załadunku'}),
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
    .min(1, 'Wprowadź datę zakończenia załadunku')
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

export type FreightFormData = z.infer<typeof FormSchema>;

interface TokenData {
    access_token: string;
    expires_in: number;
    token_type: string;
}

const TOKEN_EXPIRY_KEY = 'trans_token_expiry';

export const refreshTransEuToken = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trans/auth`, {
            method: 'PUT',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data: TokenData = await response.json();
        if (data.access_token) {
            // Store the token and its expiry time
            sessionStorage.setItem('trans_access_token', data.access_token);
            const expiryTime = Date.now() + (data.expires_in * 1000);
            sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
            return data.access_token;
        }
        throw new Error('No access token in response');
    } catch (error) {
        console.error('Error refreshing TransEU token:', error);
        throw error;
    }
};

export const getTransEuToken = async () => {
    const token = sessionStorage.getItem('trans_access_token');
    const expiryTime = sessionStorage.getItem(TOKEN_EXPIRY_KEY);

    // If no token or token is expired (with 5 minute buffer), refresh it
    if (!token || !expiryTime || Date.now() > parseInt(expiryTime) - 300000) {
        return await refreshTransEuToken();
    }

    return token;
};

export const validateFreightData = (data: any) => {
    return FormSchema.safeParse(data);
}; 
