import { configureStore } from '@reduxjs/toolkit'
import addressSlice from './addressSlice'
import userPositionSlice from './userPositionSlice'

export const store = configureStore({
    reducer: {
        address: addressSlice,
        userPosition: userPositionSlice
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch