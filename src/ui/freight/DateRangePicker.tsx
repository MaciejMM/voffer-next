"use client"

import * as React from "react"
import {addDays, format} from "date-fns"
import {CalendarIcon} from "lucide-react"
import {DateRange} from "react-day-picker"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {State} from "@/lib/action";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    state: State;
    locationKey: string;
}
export const DateRangePicker = ({
                                    className,
                                    state,
                                    ...props
                                }: DateRangePickerProps) => {


    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 0),
    })


    let startDate = state.inputs?.[`${props.locationKey}StartDate` as keyof State['inputs']];
    let endDate = state.inputs?.[`${props.locationKey}EndDate` as keyof State['inputs']];
    React.useEffect(() => {
        if (startDate && endDate) {
            setDate({
                from: new Date(startDate as string),
                to: new Date(endDate as string),
            });
        } else {
            setDate(undefined);
        }
    }, [startDate, endDate]);

    const [open, setOpen] = React.useState(false);
    
    const handleSelect = (newDate: DateRange | undefined) => {
        setDate(newDate);

        if (newDate?.from && newDate?.to) {
            setOpen(false);
        }
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return '';
        // Format date in local timezone YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    

    return (
        <div className={cn("w-full", className)} >
            <input type="hidden" name={`${props.locationKey}Date`} value={`${formatDate(date?.from)}-${formatDate(date?.to)}`} />
            <input type="hidden" name={`${props.locationKey}StartDate`} value={`${formatDate(date?.from)}`} />
            <input type="hidden" name={`${props.locationKey}EndDate`} value={`${formatDate(date?.to)}`} />

            <Popover >
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        value={`${date?.from}-${date?.to}`}
                        name={`${props.locationKey}Date}`}
                    >
                        <CalendarIcon/>
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" >
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                        disabled={(date) =>
                            date < new Date() || date > addDays(new Date(), 60)
                        }
                    />
                </PopoverContent>
            </Popover>
        </div>
    )

};
