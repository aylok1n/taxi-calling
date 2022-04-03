import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type crew = {
    crew_id: number;
    car_mark: any;
    car_model: any;
    car_color: any;
    car_number: any;
    driver_name: string;
    driver_phone: string;
    lat: number;
    lon: number;
    distance: number;
}


const initialState: { crews: crew[], activeCrew: null | number } = {
    crews: [],
    activeCrew: null
}


export const crewsSlice = createSlice({
    name: 'crews',
    initialState,
    reducers: {
        setCrews: (state, action: PayloadAction<crew[]>) => {
            state.crews = action.payload
        },
        setActiveCrew: (state, action: PayloadAction<crew['crew_id'] | null>) => {
            state.activeCrew = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { setCrews, setActiveCrew } = crewsSlice.actions

export default crewsSlice.reducer