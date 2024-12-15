import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdoteService";

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
    setAnecdotes(state, action) {
      return action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAnecdotes.fulfilled, (state, action) => {
        return action.payload.sort((anec1, anec2) => anec2.votes - anec1.votes)
      })
      .addCase(createNewAnecdotesAsync.fulfilled, (state, action) => {
        state.push(action.payload)
      })
      .addCase(asyncVote.fulfilled, (state, action) => {
        return state.map((anecdote) => anecdote.id === action.payload.id ? {...anecdote, votes: anecdote.votes + 1} : anecdote).sort((anec1, anec2) => anec2.votes - anec1.votes)
      })
  }
})

export const initializeAnecdotes = createAsyncThunk(
  'anecdotes/InitializeAnecdotesStatus', 
  async () => {
    return await anecdoteService.getAll()
  }
)

export const createNewAnecdotesAsync = createAsyncThunk(
  'anecdotes/CreateNewAnecdotesAsync', 
  async ( newAnecdote ) => {
    return await anecdoteService.createNew(newAnecdote)
  }
)

export const asyncVote = createAsyncThunk(
  'anecdotes/AsyncVote', 
  async ( votedAnecdote ) => {
    return await anecdoteService.vote(votedAnecdote)
  }
)

export const { vote, createNewAnecdote , setAnecdotes } = anecdotesSlice.actions
export default anecdotesSlice.reducer