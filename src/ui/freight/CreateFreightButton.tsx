import {Button} from "@/components/ui/button";
import * as React from "react";
import {cn} from "@/lib/utils";

interface CreateFreightButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    isPending: boolean;
}

export const CreateFreightButton = ({
                                        className,
                                        isPending,
                                    }: CreateFreightButtonProps) => {
    return (
        <div className={cn("py-8 ", className)}>
            <Button size={"lg"} className="cursor-pointer" type="submit" disabled={isPending}>
                {isPending ? 'Loading...' : 'Stwórz fracht'}
            </Button>
        </div>
    );
}
