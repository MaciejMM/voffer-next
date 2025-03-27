import {CreateFreightLinkButton} from "@/ui/freight/CreateFreightLinkButton";

export default function Page(){
    return (
        <div className="container flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Twoje Frachty
            </h3>
            <CreateFreightLinkButton/>

        </div>
    );
};
