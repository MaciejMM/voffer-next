import {Button} from "@/components/ui/button";
import Link from "next/link";


export const CreateFreightLinkButton = () => {
    return (
        <Button className="w-min">
            <Link href="/dashboard/freight/create">Stwórz fracht</Link>
        </Button>
    );
}
