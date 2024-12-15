import { useSelector, useDispatch } from 'react-redux'
import { asyncVote } from '../store/anecdotesSlice'
import { setNotificationAsync } from '../store/notificationSlice'


const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes.filter((anecdote) => anecdote.content.includes(state.filter)))
  const dispatch = useDispatch()

  const voteForAnecdote = (anecdote) => {
    let votedAnecdote = {
      content : anecdote.content,
      id : anecdote.id,
      votes : anecdote.votes + 1
    }
    dispatch(asyncVote(votedAnecdote))
    dispatch(setNotificationAsync({ notification: `you voted '${votedAnecdote.content}'`, duration: 5000}))
  }

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteForAnecdote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList