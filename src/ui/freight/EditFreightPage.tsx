'use client';

import { useEffect, useState } from 'react';
import { getFreightById } from '@/lib/actions/freight';
import Form, { Freight } from './EditFreightForm';
import { useParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Freight as FreightType } from '@/ui/freight/freight-table/columns';
import { Skeleton } from "@/components/ui/skeleton";

export default function EditFreightPage() {
    const [freight, setFreight] = useState<Freight | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        const fetchFreight = async () => {
            try {
                if (!params.id) {
                    throw new Error('No freight ID provided');
                }

                const freightData = await getFreightById(params.id as string) as FreightType;
                
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
                };

                setFreight(transformedFreight);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load freight data');
            } finally {
                setLoading(false);
            }
        };

        fetchFreight();
    }, [params.id]);

    if (loading) {
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

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!freight) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Freight not found</AlertDescription>
            </Alert>
        );
    }

    return <Form freight={freight} />;
} 