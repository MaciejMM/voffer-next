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

export const DateRangePicker = ({
                                    className,
                                }: React.HTMLAttributes<HTMLDivElement>) => {

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 0),
    })
    const [open, setOpen] = React.useState(false);

    const handleSelect = (newDate: DateRange | undefined) => {
        setDate(newDate);
        if (newDate?.from && newDate?.to) {
            setOpen(false);
        }
    };
    return (
        <div className={cn("w-full", className)}>
            <Popover >
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
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
