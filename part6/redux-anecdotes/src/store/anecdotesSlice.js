import { createSlice } from "@reduxjs/toolkit";

const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

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
  initialState,
  reducers: {
    vote(state, action) {
      return state.map((anecdote) => anecdote.id === action.payload ? {...anecdote, votes: anecdote.votes + 1} : anecdote).sort((anec1, anec2) => anec2.votes - anec1.votes)
    },
    createNewAnecdote(state, action) {
      let newAnecdote = {
            content: action.payload,
            id: getId(),
            votes: 0
          }
      state.push(newAnecdote)
    }
  }
})

export const { vote, createNewAnecdote } = anecdotesSlice.actions
export default anecdotesSlice.reducer