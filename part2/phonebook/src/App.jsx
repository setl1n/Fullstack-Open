import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Numbers from './components/Numbers'
import contactsServices from './services/contacts'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    contactsServices
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

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
    const newContact = {
      name: newName,
      number: newNumber
    }
    // checks if person's name is already in the phonebook
    if (persons.some(person => person.name === newName)) {
      // check if user wants to update phone number if person's name was found in phone book
      let existingPerson = persons.find(person => person.name === newName)
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with the new one?`)) {
        contactsServices
          .replace(existingPerson.id, newContact)
          .then(replacedContact => {
            setPersons(persons.map(p => p.name === replacedContact.name ? replacedContact : p))
          })
        setNewName('')
        setNewNumber('')
      }
      // adds if person's name is not in the phonebook
    } else {
      contactsServices
        .add(newContact)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const deletePhoneNumber = id => {
    console.log(id)
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name} ?`)) {
      contactsServices
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />
      <PersonForm
        addPhoneNumber={addPhoneNumber}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Number</h3>
      <Numbers
        persons={persons}
        filter={filter}
        deletePhoneNumber={deletePhoneNumber}
      />
    </div>
  )
}

export default App