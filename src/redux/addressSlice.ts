import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface AddressState {
    address: string,
    lat: number,
    lon: number,
}


const initialState: AddressState = {
    address: "",
    lat: 0,
    lon: 0,
}

export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setAddress: (state, action: PayloadAction<AddressState>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state = action.payload
        },
        clearAddress: (state) => {
            state = initialState
        },
    },
})

// Action creators are generated for each case reducer function
export const { setAddress, clearAddress } = addressSlice.actions

export default addressSlice.reducer