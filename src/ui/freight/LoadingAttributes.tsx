import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {State} from "@/lib/action";

export const LoadingAttributes = ({state}: { state: State }) => {
    const attributes = [
        {name: 'weight', label: 'Waga (tony)', errorKey: "Weight",min: 0},
        {name: 'length', label: 'Długość (metr)', errorKey: "Length", min: 0},
        {name: 'volume', label: 'Wolumen', errorKey: "Volume", min: 0},
    ]

    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                {
                    attributes.map((attribute) => (
                        <div className="grid w-full max-w-sm items-center gap-1.5" key={attribute.name}>
                            <Label htmlFor={attribute.name}>{attribute.label}</Label>
                            <Input
                                aria-invalid={!!state.errors?.[attribute.name as keyof State['errors']]}
                                defaultValue={String(state.inputs?.[attribute.name as keyof State['inputs']] ?? '')}
                                name={attribute.name}
                                type="number"
                                min={attribute.min}
                                id={attribute.name}
                                placeholder={attribute.label}
                                aria-describedby={`${attribute.name}-error`}/>
                        </div>
                    ))
                }
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div id={`weight-error`} aria-live="polite" aria-atomic="true">
                    {state?.errors?.weight &&
                        state.errors?.weight.map((error: string) => (
                            <p className="mt-2 text-xs text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
                <div id={`length-error`} aria-live="polite" aria-atomic="true">
                    {state?.errors?.length &&
                        state.errors?.length.map((error: string) => (
                            <p className="mt-2 text-xs text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
                <div id={`volume-error`} aria-live="polite" aria-atomic="true">
                    {state?.errors?.volume &&
                        state.errors?.volume.map((error: string) => (
                            <p className="mt-2 text-xs text-red-500" key={error}>
                                {error}
                            </p>
                        ))}
                </div>
            </div>

        </div>

    )
}
