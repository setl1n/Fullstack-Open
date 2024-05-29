import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Numbers from './components/Numbers'
import Notificaiton from './components/Notification'
import ErrorMessage from './components/ErrorMessage'
import contactsServices from './services/contacts'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [successNotiMessage, setNotiMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const reloadPersons = (() => {
    contactsServices
      .getAll()
      .then(response => {
        setPersons(response)
      })
  })

  useEffect(() => {
    reloadPersons();
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

  const displayShortNotification = (newName) => {
    setNotiMessage(`Added ${newName}`)
    setTimeout(() => {
      setNotiMessage(null)
    }, 2500)
  }

  const displayShortErrorMessage = (name) => {
    setErrorMessage(`Information of ${newName} has already been removed from the server`)
    setTimeout(() => {
      setErrorMessage(null)
    }, 2500)
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
            displayShortNotification(replacedContact.name)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.log("caugt error:\n", error)
            if (error.response.status == 404) {
              displayShortErrorMessage(newName)
              reloadPersons()
            } else {
              console.log("unhandled error caught")
            }
          })
      }
      // adds if person's name is not in the phonebook
    } else {
      contactsServices
        .add(newContact)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact))
          displayShortNotification(returnedContact.name)
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
      <Notificaiton message={successNotiMessage} />
      <ErrorMessage message={errorMessage} />
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