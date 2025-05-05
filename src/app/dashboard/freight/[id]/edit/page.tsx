import {notFound} from 'next/navigation';
import Form, {Freight} from "@/ui/freight/EditFreightForm";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";


type FreightResponse = {
    id: string | null,
    "weight": string | null,
    "length": string | null,
    "volume": string | null,
    "description": string | null,
    "loadingPlace": {
        "country": string | null,
        "place": string | null,
        "postalCode": string | null,
        "startDate": string | null,
        "endDate": string | null,
        "startTime": string | null,
        "endTime": string | null
    },
    "unloadingPlace": {
        "country": string | null,
        "place": string | null,
        "postalCode": string | null,
        "startDate": string | null,
        "endDate": string | null,
        "startTime": string | null,
        "endTime": string | null
    },
    selectedCategories: { name: string }[] | null;
    selectedVehicles: { name: string }[] | null;
    "isFullTruck": boolean,
    "publishDateTime": string | null,
    "publishSelected": string | null,
    "telerouteFreightId": string | null,
    "telerouteExternalId": string | null,
    "transeuFreightId": string | null,
    "createdBy": string | null,
    "updatedBy": string | null,
    "createdDate": string | null,
    "updatedDate": string | null,
    "userId": string | null,
    "isSuccess": boolean | null,
    "message": string | null
}

async function getFreight(id: string) {
    const {getAccessTokenRaw} = getKindeServerSession();
    const accessToken = await getAccessTokenRaw();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/v1/freight/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
    });

    if (!res.ok) {
        notFound();
    }

    const data: FreightResponse = await res.json();
    return mapFreight(data);
}

const mapFreight: any = (freight: FreightResponse) => {
    return {
        weight: freight.weight!,
        length: freight.length,
        volume: freight.volume,
        description: freight.description,
        loadingCountry: freight.loadingPlace.country,
        loadingPostalCode: freight.loadingPlace.postalCode,
        loadingPlace: freight.loadingPlace.place,
        loadingStartTime: freight.loadingPlace.startTime,
        loadingEndTime: freight.loadingPlace.endTime,
        loadingDate: freight.loadingPlace.startDate,
        loadingStartDate: freight.loadingPlace.startDate,
        loadingEndDate: freight.loadingPlace.endDate,
        unloadingCountry: freight.unloadingPlace.country,
        unloadingPostalCode: freight.unloadingPlace.postalCode,
        unloadingPlace: freight.unloadingPlace.place,
        unloadingStartTime: freight.unloadingPlace.startTime,
        unloadingEndTime: freight.unloadingPlace.endTime,
        unloadingDate: freight.unloadingPlace.startDate,
        unloadingStartDate: freight.unloadingPlace.startDate,
        unloadingEndDate: freight.unloadingPlace.endDate,
        selectedVehicles: freight.selectedVehicles?.map(veh => veh.name) ,
        selectedCategories: freight.selectedCategories?.map(cat => cat.name) ,
        isFullTruck: freight.isFullTruck,
    }
}

export default async function Page({
    params,
}: {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const queryParams = await params;
    const freight: Freight = await getFreight(queryParams.id);

    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Edytuj fracht
            </h3>
            <Form freight={freight}/>
        </div>
    );
} 
