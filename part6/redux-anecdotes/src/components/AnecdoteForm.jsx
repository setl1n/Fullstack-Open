import { useDispatch } from 'react-redux'
import { createNewAnecdotesAsync } from '../store/anecdotesSlice'
import { setNotification , clearNotification } from '../store/notificationSlice'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const getId = () => (100000 * Math.random()).toFixed(0)


    const add = async (event) => {
        event.preventDefault()
        const content = event.target.newAnecdote.value
        let newAnecdote = {
            content,
            id: getId(),
            votes: 0
        }
        dispatch(createNewAnecdotesAsync(newAnecdote))
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