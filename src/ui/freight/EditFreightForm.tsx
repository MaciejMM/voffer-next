'use client';
import {useState} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {TruckLoadRadioSelector} from "@/ui/freight/TruckLoadRadioSelector";
import {Textarea} from "@/components/ui/textarea";
import {VehicleSelector} from "@/ui/freight/VehicleSelector";
import {ExchangeSelector} from "@/ui/freight/ExchangeSelector";
import {EditFreightButton} from "@/ui/freight/EditFreightButton";
import {Key, LocationCard} from "@/ui/freight/LocationCard";
import {updateFreight, State} from "@/lib/freightService";
import {LoadingAttributes} from "@/ui/freight/LoadingAttributes";
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {AlertCircle, Terminal} from "lucide-react";
import {useRouter} from "next/navigation";

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
}

interface FormProps {
    freight: Freight;
}

export default function Form({ freight }: FormProps) {
    const router = useRouter();
    const initialState: State = {
        message: "",
        success: false,
        errors: {},
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
        }
    };

    const [state, setState] = useState<State>(initialState);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            formData.append('id', freight.id!);
            const result = await updateFreight(formData);
            setState(result);
            if (result.success) {
                router.push('/dashboard/freight');
            }
        } catch (error) {
            setState({
                isError: true,
                isSuccess: false,
                message: 'Wystąpił błąd podczas aktualizacji frachtu',
                success: false,
                inputs: state.inputs
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form action={handleSubmit}>
            <div className="flex flex-col gap-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-8">
                            <TruckLoadRadioSelector state={state}/>
                            <LoadingAttributes state={state}/>
                            <LocationCard locationKey={Key.Loading} state={state}/>
                            <LocationCard locationKey={Key.Unloading} state={state}/>
                            <div className="flex flex-col gap-4">
                                <Textarea
                                    name="description"
                                    placeholder="Opis"
                                    className="min-h-[100px]"
                                    defaultValue={state.inputs?.description}
                                    state={state}
                                />
                                {state.errors?.description && (
                                    <p className="text-sm text-red-500">{state.errors.description}</p>
                                )}
                            </div>
                            <VehicleSelector state={state}/>
                            <ExchangeSelector/>
                        </div>
                    </CardContent>
                </Card>
                {state.isError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {state.message}
                        </AlertDescription>
                    </Alert>
                )}
                {state.isSuccess && (
                    <Alert>
                        <Terminal className="h-4 w-4"/>
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>
                            {state.message}
                        </AlertDescription>
                    </Alert>
                )}
                <EditFreightButton isPending={isPending}/>
            </div>
        </form>
    );
}
