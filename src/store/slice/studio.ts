import { createSlice } from '@reduxjs/toolkit'
import type { AppState } from '@/lib/store'

let initialState = {}

const studioSlice = createSlice({
  name: 'studio',
  initialState,
  reducers: {
    setStudioInfo: (state, action) => {
      if (!action?.payload) return initialState
      state = {
        ...state,
        ...action.payload,
      }
      return state
    },
  },
})

export const { setStudioInfo } = studioSlice.actions

export const studioInfo = (state: AppState) => state.studio

export default studioSlice.reducer
