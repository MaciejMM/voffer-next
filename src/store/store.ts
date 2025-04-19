import {create} from 'zustand';
type AuthStatus = "loading" | "logged-in" | "logged-out";

interface StoreState {
    unloadingCountryCode: string;
    setUnloadingCountryCode: (unloadingCountryCode: string) => void;
    openSearchDialog: boolean;
    setOpenSearchDialog: (openSearchDialog: boolean) => void;
    locationKey: string;
    setLocationKey: (locationKey: string) => void;
    selectedLoadingPostalCode: string;
    setSelectedLoadingPostalCode: (selectedLoadingPostalCode: string) => void;
    selectedLoadingLocation: string;
    setSelectedLoadingLocation: (selectedLoadingLocation: string) => void;
    selectedUnloadingLocation: string;
    setSelectedUnloadingLocation: (selectedUnloadingLocation: string) => void;
    selectedUnloadingPostalCode: string;
    setSelectedUnloadingPostalCode: (selectedUnloadingPostalCode: string) => void;
    status: AuthStatus;
    setStatus: (status: AuthStatus) => void;

}

const useStore = create<StoreState>((set) => ({
    unloadingCountryCode: "",
    setUnloadingCountryCode: (code) => set({unloadingCountryCode: code}),
    openSearchDialog: false,
    setOpenSearchDialog: (open) => set({openSearchDialog: open}),
    locationKey: "",
    setLocationKey: (locKey) => set({locationKey: locKey }),

    selectedLoadingPostalCode: "",
    setSelectedLoadingPostalCode: (postalCode) => set({selectedLoadingPostalCode: postalCode}),
    selectedLoadingLocation: "",
    setSelectedLoadingLocation: (location) => set({selectedLoadingLocation: location}),
    selectedUnloadingPostalCode: "",
    setSelectedUnloadingPostalCode: (postalCode) => set({selectedUnloadingPostalCode: postalCode}),
    selectedUnloadingLocation: "",
    setSelectedUnloadingLocation: (location) => set({selectedUnloadingLocation: location}),
    status: "loading",
    setStatus: (status) => set({ status }),

}));

export default useStore;
