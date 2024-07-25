import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from '@/store/slice/user'
import studioReducer from '@/store/slice/studio'
import icpReducer from '@/store/slice/icp'

import config from '@/config'

const reducers = combineReducers({
  user: userReducer,
  studio: studioReducer,
  icp: icpReducer,
})

const persistConfig = {
  key: config.prefix,
  storage,
  whitelist: ['user'],
}
const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>
