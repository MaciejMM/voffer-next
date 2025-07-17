'use client'
import {State} from "@/lib/action";
import useStore from "@/store/store";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {useKindeClient} from "@/hooks/useKindeClient";
import {useEffect, useState} from "react";
import * as React from "react";
import {useDebouncedCallback} from "use-debounce";
import {autoCompleteCountrySearch} from "@/lib/countrySearch";
import {Check} from "lucide-react";
import {cn} from "@/lib/utils";

type PostalCodeSearchProps = {
    className?: string;
    state: State;
    locationKey: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onLocationSelect: (postalCode: string, city: string, countryCode: string) => void;
}

export type SearchResult = {
    postalCode: string;
    city: string;
    countryCode: string;
    displayName: string;
    name: string;
}
export const SearchLocationDialog = ({
                                         className,
                                         state,
                                         onOpenChange,
                                         onLocationSelect,
                                         ...props
                                     }: PostalCodeSearchProps) => {
    const [data, setData] = useState<SearchResult[]>([]);
    const [value, setValue] = React.useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState<string>("");
    const {loadingCountryCode, unloadingCountryCode} = useStore();

    const search = useDebouncedCallback((input: string) => {
        if (!input || input.length < 2) return;
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const results: SearchResult[] = await autoCompleteCountrySearch(
                    input,
                    props.locationKey === "loading" ? loadingCountryCode : unloadingCountryCode
                );
                console.log('Search results:', results);
                setData(results || []);
            } catch (error) {
                console.error('Search error:', error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, 300);

    useEffect(() => {
        if (input.length > 0) {
            search(input);
        }
    }, [input, search]);

    const closeAndClear = () => {
        setInput("");
        setData([]);
        onOpenChange(false);
    }

    const selectItem = (item: SearchResult) => {
        if (props.locationKey === "loading") {
            if (state.inputs) {
                state.inputs.loadingPostalCode = item.postalCode;
                state.inputs.loadingPlace = item.city;
                state.inputs.loadingCountry = item.countryCode.toUpperCase();
            }
        } else {
            if (state.inputs) {
                state.inputs.unloadingPostalCode = item.postalCode;
                state.inputs.unloadingPlace = item.city;
                state.inputs.unloadingCountry = item.countryCode.toUpperCase();
            }
        }
        onLocationSelect(item.postalCode, item.city, item.countryCode.toUpperCase());
        setData([]);
        setInput("");
        onOpenChange(false);
    }


    return (
        <Dialog open={props.open}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Wyszukaj
                        miejsce {props.locationKey === "loading" ? "załadunku" : "rozładunku"}</DialogTitle>
                    <DialogDescription>
                        {props.locationKey}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Command shouldFilter={false} className="w-full">
                        <CommandInput
                            value={input}
                            onValueChange={setInput}
                            placeholder="Search postal code..."
                            className="h-9 w-[200]"
                        /> <CommandList>
                        {isLoading && (
                            <CommandItem disabled>Loading...</CommandItem>
                        )}
                        {data.length === 0 && input.length > 0 && !isLoading ? (
                            <CommandEmpty>No results found</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {data.map((item, index) => (
                                    <CommandItem
                                        key={index}
                                        value={item.postalCode || ""}
                                        onSelect={(currentValue) => selectItem(item)}
                                    >
                                        <span>{item.postalCode || ""} - {item?.displayName || ""}</span>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === item?.postalCode ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                    </Command>
                </div>

                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button className="cursor-pointer" type="button" variant="default"
                                onClick={() => closeAndClear()}>
                            Zamknij
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}
