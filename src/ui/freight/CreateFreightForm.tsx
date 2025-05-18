'use client';
import {useState} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {TruckLoadRadioSelector} from "@/ui/freight/TruckLoadRadioSelector";
import {Textarea} from "@/components/ui/textarea";
import {VehicleSelector} from "@/ui/freight/VehicleSelector";
import {ExchangeSelector} from "@/ui/freight/ExchangeSelector";
import {CreateFreightButton} from "@/ui/freight/CreateFreightButton";
import {Key, LocationCard} from "@/ui/freight/LocationCard";
import {createFreight, State} from "@/lib/freightService";
import {LoadingAttributes} from "@/ui/freight/LoadingAttributes";
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {AlertCircle, Terminal} from "lucide-react";
import {useRouter} from "next/navigation";

export default function Form() {
    const router = useRouter();
    const [state, setState] = useState<State>({message: "", success: false, errors: {}, inputs: {}});
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {

        setIsPending(true);
        try {
            const result = await createFreight(formData);
            setState(result);
            if (result.success) {
                router.push('/dashboard/freight');
            }
        } catch (error) {
            setState({
                isError: true,
                isSuccess: false,
                message: 'Wystąpił błąd podczas tworzenia frachtu',
                success: false,
                inputs: Object.fromEntries(formData.entries())
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form
        onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSubmit(formData);
          }}         
         className="flex flex-col gap-4 w-full">
            <div className="flex flex-row gap-4 ">
                <LocationCard key={Key.Loading} locationKey={Key.Loading} state={state} />
                <LocationCard key={Key.Unloading} locationKey={Key.Unloading} state={state} />
                            </div>
            <div className="grid grid-cols-2 gap-4 ">
                <VehicleSelector state={state} className="w-full col-span-2"/>
                <Card className="col-span-1">
                    <CardContent className="flex flex-col gap-4 flex-1">
                        <TruckLoadRadioSelector className="pb-4" state={state}/>
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
