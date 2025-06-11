import { Suspense } from 'react';
import { getFreightById } from '@/lib/actions/freight';
import { Freight } from '@/ui/freight/EditFreightForm';
import { Freight as FreightType } from '@/ui/freight/freight-table/columns';
import { Skeleton } from "@/components/ui/skeleton";
import EditFreightForm from '@/ui/freight/EditFreightForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function EditFreightSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-32" />
            <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    );
}

async function EditFreightContent({ id }: { id: string }) {
    try {
        const freightData = await getFreightById(id) as FreightType;
        
        if (!freightData) {
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Freight not found</AlertDescription>
                </Alert>
            );
        }

        // Transform the freight data to match the form structure
        const transformedFreight: Freight = {
            id: freightData.id,
            weight: freightData.rawFormData.weight || '',
            length: freightData.rawFormData.length || '',
            volume: freightData.rawFormData.volume || '',
            description: freightData.rawFormData.description || '',
            loadingCountry: freightData.rawFormData.loadingCountry || '',
            loadingPostalCode: freightData.rawFormData.loadingPostalCode || '',
            loadingPlace: freightData.rawFormData.loadingPlace || '',
            loadingStartTime: freightData.rawFormData.loadingStartTime || '',
            loadingEndTime: freightData.rawFormData.loadingEndTime || '',
            loadingDate: freightData.rawFormData.loadingDate || '',
            loadingStartDate: freightData.rawFormData.loadingStartDate || '',
            loadingEndDate: freightData.rawFormData.loadingEndDate || '',
            unloadingCountry: freightData.rawFormData.unloadingCountry || '',
            unloadingPostalCode: freightData.rawFormData.unloadingPostalCode || '',
            unloadingPlace: freightData.rawFormData.unloadingPlace || '',
            unloadingStartTime: freightData.rawFormData.unloadingStartTime || '',
            unloadingEndTime: freightData.rawFormData.unloadingEndTime || '',
            unloadingDate: freightData.rawFormData.unloadingDate || '',
            unloadingStartDate: freightData.rawFormData.unloadingStartDate || '',
            unloadingEndDate: freightData.rawFormData.unloadingEndDate || '',
            selectedCategories: freightData.rawFormData.selectedCategories || [],
            selectedVehicles: freightData.rawFormData.selectedVehicles || [],
            isFullTruck: freightData.rawFormData.isFullTruck || false,
            isPublished: freightData.rawFormData.isPublished || false,
        };

        return <EditFreightForm freight={transformedFreight} />;
    } catch (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error instanceof Error ? error.message : 'Failed to load freight data'}
                </AlertDescription>
            </Alert>
        );
    }
}

export default async function EditFreightPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    
    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Edytuj fracht
            </h3>
            <Suspense fallback={<EditFreightSkeleton />}>
                <EditFreightContent id={id} />
            </Suspense>
        </div>
    );
} 
