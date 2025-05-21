import { FreightFormData } from '../action';

interface TransEuFreightRequest {
  shipment_external_id?: string;
  external_source?: string;
  capacity: number;
  publish: boolean;
  payment?: object;
  requirements: {
    is_ftl: boolean;
    required_truck_bodies: string[];
    vehicle_size: string;
  };
  loads: any[];
  spots: {
    spot_order: number;
    place: {
      address: {
        country: string;
        postal_code: string;
        locality: string;
      };
    };
    operations: {
      operation_order: number;
      type: 'loading' | 'unloading';
      timespans: {
        begin: string;
        end: string;
      };
    }[];
  }[];
}

export function mapFreightFormToTransEuRequest(formData: FreightFormData): TransEuFreightRequest {
  // Convert weight to capacity (assuming weight is in tonnes)
  const capacity = parseFloat(formData.weight || '0');

  // Map vehicle types to truck bodies
  const requiredTruckBodies = formData.selectedVehicles ?? [];
  const vehicleSizeList = formData.selectedCategories ?? [];
  // Format date and time for loading
  const loadingBegin = formData.loadingStartDate && formData.loadingStartTime 
    ? `${formData.loadingStartDate.split('T')[0]}T${formData.loadingStartTime}:00+0200`
    : undefined;
  const loadingEnd = formData.loadingEndDate && formData.loadingEndTime
    ? `${formData.loadingEndDate.split('T')[0]}T${formData.loadingEndTime}:00+0200`
    : undefined;

  // Format date and time for unloading
  const unloadingBegin = formData.unloadingStartDate && formData.unloadingStartTime
    ? `${formData.unloadingStartDate.split('T')[0]}T${formData.unloadingStartTime}:00+0200`
    : undefined;
  const unloadingEnd = formData.unloadingEndDate && formData.unloadingEndTime
    ? `${formData.unloadingEndDate.split('T')[0]}T${formData.unloadingEndTime}:00+0200`
    : undefined;

    //vehicleSizeList -> values should be joined by _ if there are more than one
    const vehicleSize = vehicleSizeList.length > 1 ? vehicleSizeList.join('_') : vehicleSizeList[0];

  return {
    capacity,
    publish: true,
    requirements: {
      is_ftl: formData.isFullTruck || false,
      required_truck_bodies: requiredTruckBodies ,
      vehicle_size: vehicleSize,
    },
    loads: [],
    spots: [
      {
        spot_order: 1,
        place: {
          address: {
            // country: formData.loadingCountry || '',
            country: 'AF',
            // postal_code: formData.loadingPostalCode || '',
            postal_code: '12345',
            // locality: formData.loadingPlace || '',
            locality: 'Kabul',
          },
        },
        operations: [
          {
            operation_order: 1,
            type: 'loading',
            timespans: {
              begin: loadingBegin || '',
              end: loadingEnd || '',
            },
          },
        ],
      },
      {
        spot_order: 2,
        place: {
          address: {
            // country: formData.unloadingCountry || '',
            country: 'AF',
            // postal_code: formData.unloadingPostalCode || '', 
            postal_code: '12345',
            // locality: formData.unloadingPlace || '',
            locality: 'Kabul',

          },
        },
        operations: [
          {
            operation_order: 1,
            type: 'unloading',
            timespans: {
              begin: unloadingBegin || '',
              end: unloadingEnd || '',
            },
          },
        ],
      },
    ],
  };
} 