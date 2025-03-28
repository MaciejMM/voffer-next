'use client';
import {useActionState} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {TruckLoadRadioSelector} from "@/ui/freight/TruckLoadRadioSelector";
import {Textarea} from "@/components/ui/textarea";
import {VehicleSelector} from "@/ui/freight/VehicleSelector";
import {ExchangeSelector} from "@/ui/freight/ExchangeSelector";
import {CreateFreightButton} from "@/ui/freight/CreateFreightButton";
import {Key, LocationCard} from "@/ui/freight/LocationCard";
import {createFreight, State} from "@/lib/action";
import {LoadingAttributes} from "@/ui/freight/LoadingAttributes";
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {AlertCircle, Terminal} from "lucide-react";


export default function Form() {
    const initialState: State = {message: "", success: false, errors: {}, inputs: {}};
    const [state, action, isPending] = useActionState(createFreight, initialState);


    return (
        <form action={action} className="flex flex-col gap-4 w-full">
            <div className="flex flex-row gap-4 ">
                <LocationCard locationKey={Key.Loading} state={state} />
                <LocationCard locationKey={Key.Unloading} state={state} />
            </div>
            <div className="grid grid-cols-2 gap-4 ">
                <VehicleSelector state={state} className="w-full col-span-2"/>
                <Card className="col-span-1">
                    <CardContent className="flex flex-col gap-4 flex-1">
                        <TruckLoadRadioSelector className="pb-4"/>
                        <LoadingAttributes state={state}/>
                        <Textarea aria-invalid={!!state.errors?.description} state={state} name="description" placeholder="Dodaj komentarz" className=""/>
                        <ExchangeSelector/>
                    </CardContent>
                </Card>
                <div className=" flex flex-col justify-end">
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
                            <Alert variant="default" className=" text-green-800">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Heads up!</AlertTitle>
                                <AlertDescription>
                                    You can add components and dependencies to your app using the cli.
                                </AlertDescription>
                            </Alert> : <></>

                    }


                </div>
            </div>
            <CreateFreightButton isPending={isPending} className={"self-start"}/>

        </form>
    )
}
