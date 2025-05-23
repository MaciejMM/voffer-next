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

const ALLOWED_VEHICLE_SIZE_COMBINATIONS = [
  'bus_lorry',
  'double_trailer_lorry',
  'lorry_solo',
  'bus_double_trailer',
  'bus_solo',
  'double_trailer_solo',
  'bus_double_trailer_lorry',
  'bus_lorry_solo',
  'double_trailer_lorry_solo',
  'bus_double_trailer_solo'
];

// Define the order of vehicle types for consistent combination
const VEHICLE_TYPE_ORDER = {
  'bus': 1,
  'double_trailer': 2,
  'lorry': 3,
  'solo': 4
};

function matchAndOrderVehicleSizes(vehicleSizeList: string[]): string {
  if (vehicleSizeList.length === 0) return '';
  if (vehicleSizeList.length === 1) return vehicleSizeList[0];

  // Sort the vehicle sizes according to the defined order
  const orderedSizes = [...vehicleSizeList].sort((a, b) => 
    (VEHICLE_TYPE_ORDER[a as keyof typeof VEHICLE_TYPE_ORDER] || 999) - 
    (VEHICLE_TYPE_ORDER[b as keyof typeof VEHICLE_TYPE_ORDER] || 999)
  );

  const combinedSize = orderedSizes.join('_');

  // Check if the ordered combination is in the allowed list
  if (!ALLOWED_VEHICLE_SIZE_COMBINATIONS.includes(combinedSize)) {
    throw new Error(`Invalid vehicle size combination: ${combinedSize}. Allowed combinations are: ${ALLOWED_VEHICLE_SIZE_COMBINATIONS.join(', ')}`);
  }

  return combinedSize;
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

  // Get properly ordered vehicle size combination
  const vehicleSize = matchAndOrderVehicleSizes(vehicleSizeList);
    
  return {
    capacity,
    publish: true,
    requirements: {
      is_ftl: formData.isFullTruck || false,
      required_truck_bodies: requiredTruckBodies,
      vehicle_size: vehicleSize,
    },
    loads: [],
    spots: [
      {
        spot_order: 1,
        place: {
          address: {
            country: 'AF',
            postal_code: '12345',
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
            country: 'AF',
            postal_code: '12345',
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