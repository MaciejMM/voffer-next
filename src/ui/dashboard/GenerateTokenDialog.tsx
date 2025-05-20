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
import {useSearchParams} from "next/navigation";
import useStore from "@/store/store";
import {useState} from "react";
import {Loader2} from "lucide-react";


type GenerateTokenDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GenerateTokenDialog = (
    {
        open
    }: GenerateTokenDialogProps
) => {
    const searchParams = useSearchParams();
    const { setStatus } = useStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateToken = async () => {
        setIsLoading(true);
        try {
            const code:string = searchParams.get('code')!;
            //call api/trans/auth with code
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trans/auth`, {
                method: 'POST',
                body: JSON.stringify({code: code})
            });
            if (!response.ok) {
                console.error('Failed to fetch access token');
                return;
            }
            const data = await response.json();

            //save data to local storage    
            setStatus("logged-in");
        } catch (error) {
            console.error('Error generating token:', error);
            setStatus("logged-out");
        } finally {
            setIsLoading(false);
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
                        <Button 
                            onClick={()=>handleGenerateToken()} 
                            className="cursor-pointer" 
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generowanie...
                                </>
                            ) : (
                                'Wygeneruj token'
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
