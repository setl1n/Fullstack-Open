const Person = ({ person, deletePhoneNumber }) => {
  return (
    <>
      {person.name} {person.number} <button onClick={deletePhoneNumber}>delete</button>
    </>
  )
}

const Numbers = ({ persons, filter, deletePhoneNumber }) => {
  let filteredList = filter ?
    persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) : persons

  return (
    <>
      <ul style={{ listStyleType: 'none' }}>
        {filteredList.map(person => (
          <li key={person.id}>
            <Person
              person={person}
              deletePhoneNumber={() => deletePhoneNumber(person.id)}
            />
          </li>
        ))}
      </ul>
    </>
  )
}

export default Numbers