'use client';
import {useActionState, useState} from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TruckLoadRadioSelector } from "@/ui/freight/TruckLoadRadioSelector";
import { Textarea } from "@/components/ui/textarea";
import { VehicleSelector } from "@/ui/freight/VehicleSelector";
import { ExchangeSelector } from "@/ui/freight/ExchangeSelector";
import { Key, LocationCard } from "@/ui/freight/LocationCard";
import { updateFreightAction, State } from "@/lib/action";
import { LoadingAttributes } from "@/ui/freight/LoadingAttributes";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Terminal, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PaymentDetails } from "@/ui/freight/PaymentDetails";
import { Button } from "@/components/ui/button";

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
    paymentValue?: string;
    paymentCurrency?: string;
    paymentType?: string;
    paymentDays?: string;
}

interface FormProps {
    freight: Freight;
}

export default function Form({ freight }: FormProps) {
    const [isPublished, setIsPublished] = useState<boolean>(freight.isPublished);
    const [paymentCurrency, setPaymentCurrency] = useState<string>(freight.paymentCurrency ?? '');
    const [paymentType, setPaymentType] = useState<string>(freight.paymentType ?? '');
    const initialState: State = {
        message: "",
        success: false,
        errors: {},
        isError: false,
        isSuccess: false,
        inputs: {
            weight: freight.weight || '',
            length: freight.length || '',
            volume: freight.volume || '',
            description: freight.description || '',
            loadingCountry: freight.loadingCountry || '',
            loadingPostalCode: freight.loadingPostalCode || '',
            loadingPlace: freight.loadingPlace || '',
            loadingStartTime: freight.loadingStartTime || '',
            loadingEndTime: freight.loadingEndTime || '',
            loadingStartDate: freight.loadingStartDate || '',
            loadingEndDate: freight.loadingEndDate || '',
            unloadingCountry: freight.unloadingCountry || '',
            unloadingPostalCode: freight.unloadingPostalCode || '',
            unloadingPlace: freight.unloadingPlace || '',
            unloadingStartTime: freight.unloadingStartTime || '',
            unloadingEndTime: freight.unloadingEndTime || '',
            unloadingStartDate: freight.unloadingStartDate || '',
            unloadingEndDate: freight.unloadingEndDate || '',
            selectedCategories: freight.selectedCategories || [],
            selectedVehicles: freight.selectedVehicles || [],
            isFullTruck: freight.isFullTruck || false,
            isPublished: freight.isPublished || false,
            paymentValue: freight.paymentValue || '',
            paymentCurrency: freight.paymentCurrency || '',
            paymentType: freight.paymentType || '',
            paymentDays: freight.paymentDays || '',
        }
    };
    const [state, action, isPending] = useActionState(updateFreightAction, initialState);

    const handleCheckedChange = (checked: boolean | "indeterminate") => {
        setIsPublished(checked === true);
    };

    const handleCurrencyChange = (value: string) => {
        setPaymentCurrency(value);
    };

    const handlePaymentTypeChange = (value: string) => {
        setPaymentType(value);
    };

    const handleSubmit = async (formData: FormData) => {
        formData.set('isPublished', isPublished ? 'true' : 'false');
        formData.set('paymentCurrency', paymentCurrency);
        formData.set('paymentType', paymentType);
        return action(formData);
    };

    return (
        <form action={handleSubmit} className="flex flex-col gap-8">
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
                                checked={isPublished}
                                onCheckedChange={handleCheckedChange}
                            />
                            <Label htmlFor="isPublished">Publish to Trans.EU</Label>
                        </div>
                    </CardContent>
                </Card>
                <PaymentDetails
                    state={state}
                    paymentCurrency={paymentCurrency}
                    paymentType={paymentType}
                    onCurrencyChange={handleCurrencyChange}
                    onPaymentTypeChange={handlePaymentTypeChange}
                />
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
            <div className="flex justify-start">
                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Zapisywanie...
                        </>
                    ) : (
                        'Zapisz zmiany'
                    )}
                </Button>
            </div>
        </form>
    );
}
