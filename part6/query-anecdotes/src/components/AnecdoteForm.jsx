import { useContext } from "react"
import { createAnecdote } from '../requests'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import NotificationContext from "../NotificationContext"

const AnecdoteForm = () => {
  const [notification, dispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (data) => {
      dispatch({type:"SET", payload: `anecdote "${data.content}" created`})
      setTimeout(() => dispatch({type:"CLEAR"}), 5000)
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (err, variables) => {
      if (err.message === "Request failed with status code 400") {
        dispatch({type:"SET", payload: `too short anecdote, must have length 5 or more`})
      } else {
        dispatch({type:"SET", payload: `err ${err.message}`})
      }
      setTimeout(() => dispatch({type:"CLEAR"}), 5000)
    }
 })
  const getId = () => (100000 * Math.random()).toFixed(0)


  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    newAnecdoteMutation.mutate({content, id: getId(), votes: 0})
    event.target.anecdote.value = ''
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
