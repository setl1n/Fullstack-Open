import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../store/anecdotesSlice'
import { setNotification , clearNotification } from '../store/notificationSlice'


const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes.filter((anecdote) => anecdote.content.includes(state.filter)))
  const dispatch = useDispatch()

  const voteId = (content, id) => {
    dispatch(vote(id))
    dispatch(setNotification(`you voted '${content}'`))
    setTimeout(() => dispatch(clearNotification()), 5000)
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
            <button onClick={() => voteId(anecdote.content, anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList