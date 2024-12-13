import { createSlice } from "@reduxjs/toolkit";


const initialState = ''

// boiler code without redux toolkit
// const filterReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'FILTER_CHANGE':
//       return action.payload
//     default:
//       return state
//   }
// }

// export const filterChange = (newFiler) => {
//   return {
//     type: 'FILTER_CHANGE',
//     payload: newFiler
//   }
// }


const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    filterChange(state, action) {
      return action.payload
    }
  }
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer