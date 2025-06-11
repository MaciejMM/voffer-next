'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TruckLoadRadioSelector } from "@/ui/freight/TruckLoadRadioSelector";
import { Textarea } from "@/components/ui/textarea";
import { VehicleSelector } from "@/ui/freight/VehicleSelector";
import { ExchangeSelector } from "@/ui/freight/ExchangeSelector";
import { EditFreightButton } from "@/ui/freight/EditFreightButton";
import { Key, LocationCard } from "@/ui/freight/LocationCard";
import { updateFreight, State } from "@/lib/action";
import { LoadingAttributes } from "@/ui/freight/LoadingAttributes";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Terminal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

export interface Freight {
    id?: string;
    weight: string;
    length: string;
    volume: string;
    description: string;
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
    selectedVehicles: string[];
    selectedCategories: string[];
    isFullTruck: boolean;
    isPublished: boolean;
}

interface FormProps {
    freight: Freight;
}

export default function Form({ freight }: FormProps) {
    const router = useRouter();
    const [state, setState] = useState<State>({
        message: "",
        success: false,
        errors: {},
        isError: false,
        isSuccess: false,
        inputs: {
            weight: freight.weight || '',
            length: freight.length || '',
            volume: freight.volume || '',
            description: freight.description,
            loadingCountry: freight.loadingCountry,
            loadingPostalCode: freight.loadingPostalCode,
            loadingPlace: freight.loadingPlace,
            loadingStartTime: freight.loadingStartTime,
            loadingEndTime: freight.loadingEndTime,
            loadingStartDate: freight.loadingStartDate,
            loadingEndDate: freight.loadingEndDate,
            unloadingCountry: freight.unloadingCountry,
            unloadingPostalCode: freight.unloadingPostalCode,
            unloadingPlace: freight.unloadingPlace,
            unloadingStartTime: freight.unloadingStartTime!,
            unloadingEndTime: freight.unloadingEndTime!,
            unloadingStartDate: freight.unloadingStartDate,
            unloadingEndDate: freight.unloadingEndDate,
            selectedCategories: freight.selectedCategories,
            selectedVehicles: freight.selectedVehicles,
            isFullTruck: freight.isFullTruck,
            isPublished: freight.isPublished,
        }
    });
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            const result = await updateFreight(state, formData);
            setState(result);
            if (result.success) {
                router.push('/dashboard/freight');
            }
        } catch (error) {
            setState({
                ...state,
                isError: true,
                message: error instanceof Error ? error.message : 'An unexpected error occurred'
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form action={handleSubmit} className="flex flex-col gap-4 w-full">
            <input type="hidden" name="id" value={freight.id || ''} />
            <div className="flex flex-row gap-4">
                <LocationCard locationKey={Key.Loading} state={state} />
                <LocationCard locationKey={Key.Unloading} state={state} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <VehicleSelector state={state} className="w-full col-span-2"/>
                <Card className="col-span-1">
                    <CardContent className="flex flex-col gap-4 flex-1">
                        <TruckLoadRadioSelector className="pb-4" state={state}/>
                        <LoadingAttributes state={state}/>
                        <Textarea 
                            aria-invalid={!!state.errors?.description} 
                            state={state} 
                            name="description" 
                            placeholder="Dodaj komentarz" 
                            defaultValue={freight.description}
                        />
                        <ExchangeSelector/>
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="isPublished" 
                                name="isPublished" 
                                defaultChecked={freight.isPublished} 
                            />
                            <Label htmlFor="isPublished">Publish to Trans.EU</Label>
                        </div>
                    </CardContent>
                </Card>
                {state?.isError ? (
                    <Alert variant="destructive" aria-invalid={true}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {state?.message}
                        </AlertDescription>
                    </Alert>
                ) : null}
                {state?.isSuccess ? (
                    <Alert variant="default" className="text-green-800">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>
                            Freight updated successfully
                        </AlertDescription>
                    </Alert>
                ) : null}
            </div>
            <EditFreightButton isPending={isPending} className="self-start"/>
        </form>
    );
}
