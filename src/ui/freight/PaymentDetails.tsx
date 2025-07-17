import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { State } from "@/lib/action";

interface PaymentDetailsProps {
    state: State;
    paymentCurrency: string;
    paymentType: string;
    onCurrencyChange: (value: string) => void;
    onPaymentTypeChange: (value: string) => void;
}

export function PaymentDetails({
    state,
    paymentCurrency,
    paymentType,
    onCurrencyChange,
    onPaymentTypeChange,
}: PaymentDetailsProps) {
    return (
        <Card className="col-span-1">
            <CardContent className="flex flex-col gap-4 flex-1">
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="paymentCurrency">Currency</Label>
                            <Select 
                                name="paymentCurrency"
                                value={paymentCurrency}
                                onValueChange={onCurrencyChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="eur">EUR</SelectItem>
                                    <SelectItem value="pln">PLN</SelectItem>
                                    <SelectItem value="usd">USD</SelectItem>
                                </SelectContent>
                            </Select>
                            {state.errors?.paymentCurrency && (
                                <p className="text-sm text-red-500">{state.errors.paymentCurrency}</p>
                            )}
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="paymentType">Payment Type</Label>
                            <Select
                                name="paymentType"
                                value={paymentType}
                                onValueChange={onPaymentTypeChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="deferred">Deferred</SelectItem>
                                    <SelectItem value="payment_in_advance">Payment in Advance</SelectItem>
                                    <SelectItem value="payment_on_unloading">Payment on Unloading</SelectItem>
                                </SelectContent>
                            </Select>
                            {state.errors?.paymentType && (
                                <p className="text-sm text-red-500">{state.errors.paymentType}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="paymentValue">Payment Value</Label>
                            <Input
                                type="number"
                                name="paymentValue"
                                placeholder="Enter payment value"
                                defaultValue={state.inputs?.paymentValue}
                                aria-invalid={!!state.errors?.paymentValue}
                            />
                            {state.errors?.paymentValue && (
                                <p className="text-sm text-red-500">{state.errors.paymentValue}</p>
                            )}
                        </div>
                        {paymentType === 'deferred' && (
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="paymentDays">Payment Days</Label>
                                <Input
                                    type="number"
                                    name="paymentDays"
                                    min={1}
                                    max={60}
                                    placeholder="Enter days (1-60)"
                                    defaultValue={state.inputs?.paymentDays}
                                    aria-invalid={!!state.errors?.paymentDays}
                                    required={paymentType === 'deferred'}
                                />
                                {state.errors?.paymentDays && (
                                    <p className="text-sm text-red-500">{state.errors.paymentDays}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 