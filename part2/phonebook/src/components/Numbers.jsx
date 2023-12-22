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

export default Numbers