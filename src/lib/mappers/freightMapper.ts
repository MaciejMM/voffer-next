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

// Map of allowed combinations with their corresponding input arrays
const VEHICLE_COMBINATION_MAP = {
  'bus_lorry': ['bus', 'lorry'],
  'double%trailer_lorry': ['double%trailer', 'lorry'],
  'lorry_solo': ['lorry', 'solo'],
  'bus_double%trailer': ['bus', 'double%trailer'],
  'bus_solo': ['bus', 'solo'],
  'double%trailer_solo': ['double%trailer', 'solo'],
  'bus_double%trailer_lorry': ['bus', 'double%trailer', 'lorry'],
  'bus_lorry_solo': ['bus', 'lorry', 'solo'],
  'double%trailer_lorry_solo': ['double%trailer', 'lorry', 'solo'],
  'bus_double%trailer_solo': ['bus', 'double%trailer', 'solo']
};

function matchAndOrderVehicleSizes(vehicleSizeList: string[]): string {
  if (vehicleSizeList.length === 0) return '';
  if (vehicleSizeList.length === 1) return vehicleSizeList[0];

  // Replace double_trailer with double%trailer in the input list
  const normalizedList = vehicleSizeList.map(size => 
    size === 'double_trailer' ? 'double%trailer' : size
  );

  // Find matching combination
  for (const [combination, requiredSizes] of Object.entries(VEHICLE_COMBINATION_MAP)) {
    if (normalizedList.length === requiredSizes.length &&
        normalizedList.every(size => requiredSizes.includes(size))) {
      return combination;
    }
  }

  throw new Error(`Invalid vehicle size combination: ${normalizedList.join('_')}. Allowed combinations are: ${Object.keys(VEHICLE_COMBINATION_MAP).join(', ')}`);
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
    publish: formData.isPublished,
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