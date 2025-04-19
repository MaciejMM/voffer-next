
export default async function Page(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const id = params.id;

    return (
        <main>
            <h1 className="text-2xl">Edit Freight</h1>
            <p>Freight ID: {id}</p>
            {/* Add your form or other components here */}
        </main>
    );
}
