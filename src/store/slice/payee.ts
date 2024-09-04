import { createSlice } from '@reduxjs/toolkit'
import type { AppState } from '@/lib/store'

let initialState = {
  style: {
    theme: 0,
  },
  title: 'Pay me a Coffee',
  accountInfo: false,
  copyright: true,
}

const payeeSlice = createSlice({
  name: 'payee',
  initialState,
  reducers: {
    setPayeeInfo: (state, action) => {
      if (!action?.payload) return initialState
      state = {
        ...state,
        ...action.payload,
      }
      return state
    },
  },
})

export const { setPayeeInfo } = payeeSlice.actions

export const payeeInfo = (state: AppState) => state.payee

export default payeeSlice.reducer
