import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      console.log("action.payload: ", action.payload)
      return action.payload
    },
    clearNotification(state, action) {
      return null
    }
  }
})

export const setNotificationAsync = createAsyncThunk(
  'notification/SetNotificationAsync',
  async ({notification, duration}, {dispatch}) => {
    dispatch(setNotification(notification))
    setTimeout(() => dispatch(clearNotification()), duration)
  }
)

export const { setNotification , clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
