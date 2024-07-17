import { createSlice } from '@reduxjs/toolkit'
import type { AppState } from '@/lib/store'

let initialState = {}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action = null) => {
      if (!action?.payload) return initialState
      state = {
        ...state,
        ...action.payload,
      }
      return state
    },
  },
})

export const { setUserInfo } = userSlice.actions

export const userInfo = (state: AppState) => state.user

export default userSlice.reducer
