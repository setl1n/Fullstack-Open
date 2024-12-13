import { createSlice } from "@reduxjs/toolkit";

// code without abstraction
// const anecdoteReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'VOTE':
//       return state.map((anecdote) => anecdote.id === action.payload.id ? {...anecdote, votes: anecdote.votes + 1} : anecdote).sort((anec1, anec2) => anec2.votes - anec1.votes)
//     case 'ADD_NEW_ANECDOTE':
//       return [...state, action.payload]
//     default:
//       return state
//   }
// }

// export const vote = (id) => {
//   return {
//     type: 'VOTE', 
//     payload: {id}
//   }
// }

// export const createNewAnecdote = (content) => {
//   let newAnecdote = {
//     content,
//     id: getId(),
//     votes: 0
//   }
//   return {
//     type: 'ADD_NEW_ANECDOTE', 
//     payload: newAnecdote
//   }
// }

const anecdotesSlice = createSlice({
  name: 'filter',
  initialState: [],
  reducers: {
    vote(state, action) {
      return state.map((anecdote) => anecdote.id === action.payload ? {...anecdote, votes: anecdote.votes + 1} : anecdote).sort((anec1, anec2) => anec2.votes - anec1.votes)
    },
    createNewAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { vote, createNewAnecdote , setAnecdotes } = anecdotesSlice.actions
export default anecdotesSlice.reducer