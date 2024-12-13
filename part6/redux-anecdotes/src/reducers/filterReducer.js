const initialState = ''

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FILTER_CHANGE':
      return action.payload
    default:
      return state
  }
}

export const filterChange = (newFiler) => {
  return {
    type: 'FILTER_CHANGE',
    payload: newFiler
  }
}

export default filterReducer