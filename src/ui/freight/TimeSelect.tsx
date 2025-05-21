'use client';
import {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import * as React from "react";
import {cn} from "@/lib/utils";
import {State} from "@/lib/action";

interface TimeSelectProps extends React.HTMLAttributes<HTMLDivElement> {
    state: State;
    locationKey: string;
}

const generateTimeOptions = (startHour = 0, startMinute = 0) => {
    const times = [];
    for (let hour = startHour; hour < 24; hour++) {
        for (let minute = hour === startHour ? startMinute : 0; minute < 60; minute += 30) {
            const formattedHour = hour.toString().padStart(2, "0");
            const formattedMinute = minute.toString().padStart(2, "0");
            times.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    return times;
};

const TimeSelect = ({
                        className,
                        state,
                        ...props
                    }: TimeSelectProps) => {

    let startTimeInput = state.inputs?.[`${props.locationKey}StartTime` as keyof State['inputs']];
    let endTimeInput = state.inputs?.[`${props.locationKey}EndTime` as keyof State['inputs']];
    const [selectedStartTime, setSelectedStartTime] = useState(startTimeInput ?? "");
    const [selectedEndTime, setSelectedEndTime] = useState(endTimeInput ?? "");

    const startTimes = generateTimeOptions();
    const [startHour, startMinute] = selectedStartTime ? selectedStartTime.split(":").map(Number) : [0, 0];
    const endTimes = generateTimeOptions(startHour, startMinute);

    return (
        <div className={cn("grid grid-cols-2 gap-4", className)}>

            <Select onValueChange={setSelectedStartTime} name={`${props.locationKey}StartTime`} >
                <SelectTrigger className="w-full"
                               aria-invalid={!!state.errors?.[`${props.locationKey}StartTime` as keyof State['errors']]}>
                    <SelectValue placeholder="Start" aria-invalid={true}/>
                </SelectTrigger>
                <SelectContent>
                    {startTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                            {time}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select onValueChange={setSelectedEndTime} name={`${props.locationKey}EndTime`}>
                <SelectTrigger className="w-full"
                               aria-invalid={!!state.errors?.[`${props.locationKey}EndTime` as keyof State['errors']]}>
                    <SelectValue placeholder="Koniec"/>
                </SelectTrigger>
                <SelectContent>
                    {endTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                            {time}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default TimeSelect;
