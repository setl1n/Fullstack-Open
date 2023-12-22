import { useState } from 'react'

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <p>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </p>
  )
}

const PersonForm = ({ addPhoneNumber, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <>
      <h3>Add a New Number</h3>
      <form onSubmit={addPhoneNumber}>
        name: <input value={newName} onChange={handleNameChange} /> <p></p>
        number: <input value={newNumber} onChange={handleNumberChange} /> <p></p>
        <button type="submit">add</button>
      </form>
    </>
  )
}


const Numbers = ({ persons, filter }) => {
  let filteredList
  if (filter == '') {
    filteredList = persons.map((person) => (
      <li key={person.id}>{person.name} {person.number}</li>
    ))
  } else {
    // Filters the list of contacts first
    let filteredPersons = persons.filter((person) => (
      person.name.toLowerCase().includes(filter.toLowerCase())
    ))
    // Converts array of filtered people to ul elements
    filteredList = filteredPersons.map((person) => (
      <li key={person.id}>{person.name} {person.number}</li>
    ))
  }
  return (
    <>
      <ul style={{ listStyleType: 'none' }}>
        {filteredList}
      </ul>
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([

  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const addPhoneNumber = (event) => {
    event.preventDefault()
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const newContact = {
        id: persons.length + 1,
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(newContact))
      console.log(newContact)
    }
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm addPhoneNumber={addPhoneNumber} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h3>Number</h3>
      <Numbers persons={persons} filter={filter} />
    </div>
  )
}

export default App