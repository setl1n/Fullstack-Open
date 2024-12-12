
import { useState, useEffect } from 'react'


const NewBlog = ({ createNewBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleCreateNewBlog = async (event) => {
        event.preventDefault()
        let newBlog = { title, author, url }
        try {
            await createNewBlog(newBlog)
            setTitle('')
            setAuthor('')
            setUrl('')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={handleCreateNewBlog}>
                title: <input value={title} onChange={({ target }) => setTitle(target.value)} /><br />
                author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /><br />
                url: <input value={url} onChange={({ target }) => setUrl(target.value)} /><br />
                <button type="submit">create</button>
            </form>
        </>
    )
}

export default NewBlog