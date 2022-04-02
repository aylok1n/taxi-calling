import { configureStore } from '@reduxjs/toolkit'
import addressSlice from './addressSlice'

export const store = configureStore({
    reducer: {
        address: addressSlice
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch