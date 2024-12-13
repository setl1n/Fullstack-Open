import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import Filter from './components/Filter'
import anecdoteService from './services/anecdoteService'
import { setAnecdotes } from './store/anecdotesSlice'
import { useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  anecdoteService.getAll().then((anecdotes) => dispatch(setAnecdotes(anecdotes)))

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification/>
      <Filter/>
      <AnecdoteList/>
      <AnecdoteForm/>
    </div>
  )
}

export default App