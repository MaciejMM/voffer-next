interface FreightTableProps {
    data: Freight[];
}

type Freight = {
    id: number;
    weight: string;
    length: string;
    volume: string;
    description: string;
    loadingPlace: Place;
    unloadingPlace: Place;
    selectedCategories: SelectedCategories[];
    selectedVehicles: SelectedVehicles[];
    isFullTruck: boolean;
    transeuFreightId:string;
    createdDate:string;
}

type Place = {
    id:number;
    country: string;
    place: string;
    postalCode: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}
type SelectedVehicles  = {
    name:string;
}

type SelectedCategories = {
    name: string;
}
export const FreightTable: React.FC<FreightTableProps> = ({ data }: { data:Freight[] })  => {


    return (
        <div>
            <h3>Freight Table</h3>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>FTL</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item,key) => (
                    <tr key={key}>
                        <td>{item.id}</td>
                        <td>{item.isFullTruck}</td>
                        <td>{item.description}</td>

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
