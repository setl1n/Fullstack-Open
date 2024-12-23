import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes ,updateAnecdote } from '../requests'
import NotificationContext from "../NotificationContext"
import { useContext } from "react"

const AnecdoteForm = () => {
    const [notification, dispatch] = useContext(NotificationContext)
    const queryClient = useQueryClient()
    const updateAnecdoteMutation = useMutation({
      mutationFn: updateAnecdote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey:['anecdotes'] })
      }
    })
  
    const handleVote = (anecdote) => {
      updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
      dispatch({type:"SET", payload: `anecdote "${anecdote.content}" voted`})
      setTimeout(() => dispatch({type:"CLEAR"}), 5000)
    }
    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        retry: false
      })

    if (result.isLoading) {
        return <div>loading data...</div>
      } else if (result.isError) {
        return <>
          <div>anecdote service not avaialable due to problems in server</div>
          <div>error: {result.error.message}</div>
        </>
      }
    
      const anecdotes = result.data

    return (
        <>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => handleVote(anecdote)}>vote</button>
                </div>
                </div>
            )}
          </>
    )
}

export default AnecdoteForm