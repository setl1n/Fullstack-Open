

const Anecdote = ({ anecdote }) => {
    console.log(anecdote)
    return (
        <div>
            <h2>
                {anecdote.content}
            </h2>
            <div>
                has {anecdote.votes} votes
            </div>
        </div>
    )
}

export default Anecdote