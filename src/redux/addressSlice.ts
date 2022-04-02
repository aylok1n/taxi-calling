import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface AddressState {
    address: string,
    lat: number,
    lng: number,
}


const initialState: AddressState = {
    address: '',
    lat: 0,
    lng: 0,
}


export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setAddress: (state, action: PayloadAction<AddressState>) => {
            state.address = action.payload.address
            state.lng = action.payload.lng
            state.lat = action.payload.lat
        },
    },
})

// Action creators are generated for each case reducer function
export const { setAddress } = addressSlice.actions

export default addressSlice.reducer