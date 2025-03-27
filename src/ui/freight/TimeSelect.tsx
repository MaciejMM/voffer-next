'use client';
import {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import * as React from "react";
import {cn} from "@/lib/utils";

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
                    }: React.HTMLAttributes<HTMLDivElement>) => {
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");

    const startTimes = generateTimeOptions();
    const [startHour, startMinute] = selectedStartTime ? selectedStartTime.split(":").map(Number) : [0, 0];
    const endTimes = generateTimeOptions(startHour, startMinute);

    return (
        <div className={cn("grid grid-cols-2 gap-4", className)}>

            <Select onValueChange={setSelectedStartTime}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Start"/>
                </SelectTrigger>
                <SelectContent>
                    {startTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                            {time}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select onValueChange={setSelectedEndTime}>
                <SelectTrigger className="w-full">
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
