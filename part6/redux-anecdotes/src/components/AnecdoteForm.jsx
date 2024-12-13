import { useDispatch } from 'react-redux'
import { createNewAnecdote } from '../store/anecdotesSlice'
import { setNotification , clearNotification } from '../store/notificationSlice'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const add = (event) => {
        event.preventDefault()
        const content = event.target.newAnecdote.value
        dispatch(createNewAnecdote(content))
        event.target.newAnecdote.value = ''
        dispatch(setNotification(`you created '${content}'`))
        setTimeout(() => dispatch(clearNotification()), 5000)
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={add}>
                <input name="newAnecdote" /> 
                <button type="submit">add</button>
            </form>
        </>
    )
}

export default AnecdoteForm