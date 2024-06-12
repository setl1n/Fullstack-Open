import { useState, useEffect } from 'react'
import countryInfoServices from './services/restcountryapi'

const App = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    console.log("getting list of countries from server");

    let fetchCountryList = async () => {
      let countryList = await countryInfoServices.getAll();
      console.log("processed country list from api:", countryList);
      setCountries(countryList);
    }
    fetchCountryList();
  }, [])

  const handleQueryChange = ((event) => {
    setSearchQuery(event.target.value)
  })

  return (
    <div>
      <form>
        find countries
        <input value={searchQuery} onChange={handleQueryChange} />
      </form>
      <h1>Country Names</h1>
      <ul>
        {countries.map((name,index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App