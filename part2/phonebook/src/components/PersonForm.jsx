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

export default PersonForm