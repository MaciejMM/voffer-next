'use client';
import {useActionState, useEffect} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {TruckLoadRadioSelector} from "@/ui/freight/TruckLoadRadioSelector";
import {Textarea} from "@/components/ui/textarea";
import {VehicleSelector} from "@/ui/freight/VehicleSelector";
import {ExchangeSelector} from "@/ui/freight/ExchangeSelector";
import {CreateFreightButton} from "@/ui/freight/CreateFreightButton";
import {Key, LocationCard} from "@/ui/freight/LocationCard";
import {createFreightAction, State} from "@/lib/action";
import {LoadingAttributes} from "@/ui/freight/LoadingAttributes";
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {AlertCircle, Terminal} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { PaymentDetails } from "@/ui/freight/PaymentDetails";

export default function Form() {
    const initialState: State = {
        message: "", 
        success: false, 
        isError: false, 
        isSuccess: false, 
        inputs: { isPublished: true }, 
        errors: {}
    };
    const [state, action, isPending] = useActionState(createFreightAction, initialState);
    const [isPublished, setIsPublished] = useState<boolean>(state.inputs?.isPublished ?? true);
    const [paymentCurrency, setPaymentCurrency] = useState<string>(state.inputs?.paymentCurrency ?? '');
    const [paymentType, setPaymentType] = useState<string>(state.inputs?.paymentType ?? '');
    
    useEffect(() => {
        if (state.inputs?.isPublished !== undefined) {
            setIsPublished(state.inputs.isPublished);
        }
        if (state.inputs?.paymentCurrency !== undefined) {
            setPaymentCurrency(state.inputs.paymentCurrency);
        }
        if (state.inputs?.paymentType !== undefined) {
            setPaymentType(state.inputs.paymentType);
        }
    }, [state.inputs?.isPublished, state.inputs?.paymentCurrency, state.inputs?.paymentType]);
    
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
        <form action={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex flex-row gap-4 ">
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
                            defaultValue={state.inputs?.description}
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
                <div className="col-span-2 flex flex-col justify-end">
                    {
                        state?.isError ?
                            <Alert variant="destructive" aria-invalid={true}>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {state?.message}
                                </AlertDescription>
                            </Alert> : <></>

                    }
                    {
                        state?.isSuccess ?
                            <Alert variant="default" className="text-green-800">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Oferta została utworzona pomyślnie</AlertTitle>
                                <AlertDescription>
                                    Oferta została utworzona pomyślnie w Trans.eu
                                </AlertDescription>
                            </Alert> : <></>
                    }
                </div>
            </div>
            <CreateFreightButton isPending={isPending} className={"self-start"}/>

        </form>
    )
}
