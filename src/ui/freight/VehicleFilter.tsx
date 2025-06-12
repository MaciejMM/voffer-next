'use client'
import {Checkbox} from "@/components/ui/checkbox";
import {Separator} from "@/components/ui/separator";
import {CardTitle} from "@/components/ui/card";
import * as React from "react";
import {State} from "@/lib/action";
import {useState} from "react";

const vehicleData = [
    {type: "curtainsider", any_size: true, bus: true, lorry: true, double_trailer: true, solo: true},
    {type: "cooler", any_size: true, bus: true, lorry: true, double_trailer: true, solo: true},
    {type: "standard-tent", any_size: true, bus: true, lorry: true, double_trailer: true, solo: true},
    {type: "box", any_size: true, bus: true, lorry: true, double_trailer: true, solo: true},
    {type: "open-box", any_size: true, bus: true, lorry: true, double_trailer: true, solo: true},
    {type: "isotherm", any_size: true, bus: true, lorry: true, double_trailer: true, solo: true},
    {type: "meathanging", any_size: true, bus: true, lorry: true, double_trailer: true, solo: true},
    {type: "food-tanker", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "tanker", any_size: true, bus: false, lorry: true, double_trailer: true, solo: true},
    {type: "other", any_size: true, bus: true, lorry: true, double_trailer: true, solo: true},
    {type: "car-transporter", any_size: true, bus: true, lorry: true, double_trailer: true, solo: true},
    {type: "dump-truck", any_size: false, bus: false, lorry: true, double_trailer: true, solo: true},
    {type: "petroleum-tanker", any_size: false, bus: false, lorry: true, double_trailer: true, solo: true},
    {type: "chemical-tanker", any_size: false, bus: false, lorry: true, double_trailer: true, solo: true},
    {type: "gas-tanker", any_size: false, bus: false, lorry: true, double_trailer: true, solo: true},
    {type: "silos", any_size: false, bus: false, lorry: true, double_trailer: true, solo: true},
    {type: "mega", any_size: false, bus: false, lorry: true, double_trailer: false, solo: true},
    {type: "coilmulde", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "log-trailer", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "platform-trailer", any_size: false, bus: false, lorry: true, double_trailer: true, solo: true},
    {type: "hook-truck", any_size: false, bus: false, lorry: true, double_trailer: true, solo: true},
    {type: "low-loader", any_size: false, bus: false, lorry: true, double_trailer: true, solo: true},
    {type: "truck", any_size: false, bus: false, lorry: true, double_trailer: false, solo: false},
    {type: "swap-body-system", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "20-standard", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "40-standard", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "45-standard", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "joloda", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "BDE", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "walkingfloor", any_size: false, bus: false, lorry: true, double_trailer: false, solo: true},
    {type: "tank-body-20", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "tank-body-40", any_size: false, bus: false, lorry: true, double_trailer: true, solo: false},
    {type: "jumbo", any_size: false, bus: false, lorry: false, double_trailer: false, solo: false}
];

const vehicleCategories = ["any_size", "bus", "lorry", "double_trailer", "solo"];
type VehicleCategory = (typeof vehicleCategories)[number];

export type VehicleFilterProps = {
    className?: string;
    state: State;
};

export const VehicleFilter = ({
    className,
    state,
    ...props
}: VehicleFilterProps) => {
    const [selectedCategories, setSelectedCategories] = useState<VehicleCategory[]>(state.inputs?.selectedCategories ?? []);
    const [selectedVehicles, setSelectedVehicles] = useState<string[]>(state.inputs?.selectedVehicles ?? []);

    const handleCategoryChange = (category: VehicleCategory) => {
        setSelectedCategories((prev) => {
            let newCategories = prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category];

            if (category === "any_size") {
                // If any_size is being selected, clear other categories
                newCategories = ["any_size"];
                // Reset vehicle selection since any_size means all vehicles are valid
                setSelectedVehicles([]);
            } else {
                // If any other category is being selected, remove any_size
                newCategories = newCategories.filter((c) => c !== "any_size");
                // Filter vehicles based on the selected categories
                setSelectedVehicles((prevVehicles) =>
                    prevVehicles.filter((vehicle) =>
                        vehicleData.find((v) => v.type === vehicle && newCategories.some((c) => v[c as keyof typeof v]))
                    )
                );
            }

            return newCategories;
        });
    };

    const handleVehicleChange = (vehicle: string) => {
        setSelectedVehicles((prev) =>
            prev.includes(vehicle) ? prev.filter((v) => v !== vehicle) : [...prev, vehicle]
        );
    };

    const isVehicleValidForCategories = (vehicle: typeof vehicleData[0], categories: VehicleCategory[]) => {
        if (categories.length === 0) return true;
        if (categories.includes('any_size')) {
            // When any_size is selected, only show vehicles that have any_size: true
            return vehicle.any_size;
        }
        return categories.every(category => vehicle[category as keyof typeof vehicle]);
    };

    const isCategoryValidForVehicles = (category: VehicleCategory) => {
        if (selectedVehicles.length === 0) return true;
        // For any_size, check if all selected vehicles have any_size: true
        if (category === 'any_size') {
            return selectedVehicles.every(vehicleType => {
                const vehicle = vehicleData.find(v => v.type === vehicleType);
                return vehicle && vehicle.any_size;
            });
        }
        // For other categories, check if all selected vehicles support that category
        return selectedVehicles.every(vehicleType => {
            const vehicle = vehicleData.find(v => v.type === vehicleType);
            return vehicle && vehicle[category as keyof typeof vehicle];
        });
    };

    return (
        <div>
            <div className="flex gap-6 p-4">
                <div className="w-1/7">
                    <CardTitle>Rozmiar pojazdu</CardTitle>
                    {vehicleCategories.map((category) => (
                        <div key={category} className="flex items-center gap-2 mt-2">
                            <Checkbox
                                checked={selectedCategories.includes(category)}
                                onClick={() => handleCategoryChange(category)}
                                id={category}
                                name="selectedCategories"
                                value={category}
                                disabled={!isCategoryValidForVehicles(category)}
                                defaultChecked={selectedCategories.includes(category)}
                            />
                            <label htmlFor={category} className={!isCategoryValidForVehicles(category) ? "text-gray-500" : ""}>
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
                <Separator orientation="vertical" className="h-full"/>
                <div className="w-6/7">
                    <CardTitle>Typ pojazdu</CardTitle>
                    <div className="grid grid-cols-5 lg:grid-cols-7 ">
                        {vehicleData.map((vehicle) => {
                            const isValid = isVehicleValidForCategories(vehicle, selectedCategories);
                            const isChecked = selectedVehicles.includes(vehicle.type);

                            return (
                                <div className="flex items-center mt-2 gap-2" key={vehicle.type}>
                                    <Checkbox
                                        checked={isChecked}
                                        onClick={() => handleVehicleChange(vehicle.type)}
                                        disabled={!isValid}
                                        name="selectedVehicles"
                                        id={vehicle.type}
                                        value={vehicle.type}
                                        defaultChecked={selectedVehicles.includes(vehicle.type)}
                                    />
                                    <label htmlFor={vehicle.type} className={!isValid ? "text-gray-500" : ""}>
                                        {vehicle.type}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {state?.errors?.selectedCategories || state?.errors?.selectedVehicles ?
                <div className="flex gap-6 p-4">
                    <div className="w-1/7">
                        <div aria-live="polite" aria-atomic="true">
                            {state?.errors?.selectedCategories &&
                                state.errors?.selectedCategories.map((error: string) => (
                                    <p className="mt-2 text-xs text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <Separator orientation="vertical" className="h-full"/>
                    <div className="w-6/7">
                        <div aria-live="polite" aria-atomic="true">
                            {state?.errors?.selectedVehicles &&
                                state.errors?.selectedVehicles.map((error: string) => (
                                    <p className="mt-2 text-xs text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                </div>
                : <></>
            }
        </div>
    );
};
