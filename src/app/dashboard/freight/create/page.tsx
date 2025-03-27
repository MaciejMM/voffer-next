import Form from "@/ui/freight/CreateFreightForm";

export default function Page() {
    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold tracking-tight">
                Stwórz fracht
            </h3>
            <Form />
        </div>
    );
}
