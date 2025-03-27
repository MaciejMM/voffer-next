import {Checkbox} from "@/components/ui/checkbox"

export const ExchangeSelector = () => {

    const exchangeSelectorData = [
        {
            title: "trans",
            checked: true,
            disabled: false,
            text: "Trams.EU"
        },
        {
            title: "teleroute",
            checked: false,
            disabled: true,
            text: "Teleroute"
        },
        {
            title: "timocon",
            checked: false,
            disabled: true,
            text: "Timocon"
        }
    ]


    return (
        <div className="flex flex-row gap-4">
                {
                    exchangeSelectorData.map((exchange, index) => {
                            return (
                                <div key={index} className="flex items-center space-x-2">
                                    <Checkbox checked={exchange.checked} id={exchange.title} disabled={exchange.disabled}/>
                                    <label
                                        htmlFor={exchange.title}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {exchange.text}
                                    </label>
                                </div>
                            )
                        }
                    )
                }

        </div>
    )

}
