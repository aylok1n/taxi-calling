import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface userPosition {
    lat: number | null,
    lng: number | null,
}


const initialState: userPosition = {
    lat: null,
    lng: null,
}


export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setPosition: (state, action: PayloadAction<userPosition>) => {
            state.lng = action.payload.lng
            state.lat = action.payload.lat
        },
    },
})

// Action creators are generated for each case reducer function
export const { setPosition } = addressSlice.actions

export default addressSlice.reducer