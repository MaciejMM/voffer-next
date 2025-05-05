import {Button} from "@/components/ui/button";
import * as React from "react";
import {cn} from "@/lib/utils";

interface EditFreightButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    isPending: boolean;
}

export const EditFreightButton = ({
    className,
    isPending,
}: EditFreightButtonProps) => {
    return (
        <div className={cn("py-8 ", className)}>
            <Button size={"lg"} className="cursor-pointer" type="submit" disabled={isPending}>
                {isPending ? 'Loading...' : 'Zapisz zmiany'}
            </Button>
        </div>
    );
} 