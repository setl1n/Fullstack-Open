import { configureStore } from "@reduxjs/toolkit";
import anecdoteReducer from "./anecdotesSlice";
import filterReducer from "./filterSlice";


const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer
  }
})

export default store