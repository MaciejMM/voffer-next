'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {getTranseuAccessToken} from "@/utils/auth";
import {redirect, useSearchParams} from "next/navigation";
import useStore from "@/store/store";


type GenerateTokenDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GenerateTokenDialog = (
    {
        open,
        onOpenChange
    }: GenerateTokenDialogProps
) => {
    const searchParams = useSearchParams();
    const { setStatus } = useStore();
    const handleGenerateToken = async () => {
        const code:string = searchParams.get('code')!;
        const response = await getTranseuAccessToken(code)
        if(response) {
            setStatus("logged-in");
            redirect('/dashboard');
        } else {
            setStatus("logged-out");
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Zaloguj się do TRANS.EU
                    </DialogTitle>
                    <DialogDescription>
                        Aby dokonczyć logowanie kliknij poniższy przycisk.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex flex-row justify-start gap-4 py-4">
                        <Button onClick={()=>handleGenerateToken()} className=" cursor-pointer" type="submit">Wygeneruj token</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
