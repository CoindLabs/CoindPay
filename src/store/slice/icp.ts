import { createSlice } from '@reduxjs/toolkit'
import type { AppState } from '@/lib/store'

let initialState: any = {}

const icpSlice = createSlice({
  name: 'icp',
  initialState,
  reducers: {
    setIcpInfo: (state, action = null) => {
      if (!action?.payload) return initialState
      state = {
        ...state,
        ...action.payload,
      }
      return state
    },
    clearIcpInfo: () => {
      return initialState // 重置为初始状态
    },
  },
})

export const { setIcpInfo, clearIcpInfo } = icpSlice.actions

export const icpInfo = (state: AppState) => state.icp

export default icpSlice.reducer
